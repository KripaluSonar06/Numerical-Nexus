# app/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from app.schemas import SolveRequest
import os
import asyncio
from app.solutions import s3_2_plot_api
from urllib.parse import unquote

# ===============================================================
# Initialize FastAPI
# ===============================================================
app = FastAPI(
    title="Numerical Methods Assignment Backend",
    version="2.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (adjust for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory for generated output files
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # project root (one level above app/)
OUTPUT_DIR = os.path.join(BASE_DIR, "output")  # project_root/output
os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_question_dir(question_id: str) -> str:
    """Return (and ensure) a subfolder for a given question inside output/."""
    folder = os.path.join(OUTPUT_DIR, question_id)
    os.makedirs(folder, exist_ok=True)
    return folder

def clear_question_dir(question_id: str):
    """Delete all existing files in a specific question's folder."""
    folder = get_question_dir(question_id)
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"⚠️ Could not delete {file_path}: {e}")

# ===============================================================
# Include additional routers (for τ slider API)
# ===============================================================
app.include_router(s3_2_plot_api.router)

# ===============================================================
# Root route
# ===============================================================
@app.get("/")
async def root():
    """Show available streaming endpoints and file utilities."""
    return {
        "message": "🚀 Numerical Methods Streaming Backend is Live",
        "stream_endpoints": [
            "/stream/2_1A",
            "/stream/2_1B",
            "/stream/2_2",
            "/stream/3_1",
            "/stream/3_2",
        ],
        "file_endpoints": [
            "/files",
            "/files/{filename}",
            "/preview/{filename}",
        ],
        "extra_routes": [
            "/compute_temp  (for live τ-slider plotting)"
        ]
    }

# ===============================================================
# Helper: Unified Stream Wrapper
# ===============================================================
def make_stream_response(generator_func, params):
    """Stream generator output line by line to frontend in real time."""
    async def event_stream():
        for line in generator_func(params):
            if isinstance(line, bytes):
                chunk = line
            else:
                text = line if line.endswith("\n") else (line + "\n")
                chunk = text.encode("utf-8")
            yield chunk
            await asyncio.sleep(0)  # yield control to event loop
    return StreamingResponse(event_stream(), media_type="text/plain; charset=utf-8")

# ===============================================================
# STREAMING ASSIGNMENT ENDPOINTS
# ===============================================================
@app.post("/stream/2_1A")
async def stream_2_1a(req: SolveRequest):
    from app.solutions import s2_1a
    return make_stream_response(s2_1a.stream_s2_1a, req.params)

@app.post("/stream/2_1B")
async def stream_2_1b(req: SolveRequest):
    from app.solutions import s2_1b
    return make_stream_response(s2_1b.stream_s2_1b, req.params)

@app.post("/stream/2_2")
async def stream_2_2(req: SolveRequest):
    from app.solutions import s2_2
    question_id = "2_2"
    clear_question_dir(question_id)
    return make_stream_response(s2_2.stream_s2_2, req.params)

@app.post("/stream/3_1")
async def stream_3_1(req: SolveRequest):
    from app.solutions import s3_1
    question_id = "3_1"
    clear_question_dir(question_id)
    return make_stream_response(s3_1.stream_s3_1, req.params)

@app.post("/stream/3_2")
async def stream_3_2(req: SolveRequest):
    from app.solutions import s3_2
    question_id = "3_2"
    clear_question_dir(question_id)
    return make_stream_response(s3_2.stream_s3_2, req.params)

# ===============================================================
# FILE MANAGEMENT ROUTES
# ===============================================================
@app.get("/files/{question_id}")
async def list_files(question_id: str):
    """List all CSV and PNG files inside output/<question_id>."""
    folder_path = os.path.join(OUTPUT_DIR, question_id)
    if not os.path.exists(folder_path):
        raise HTTPException(status_code=404, detail="Directory not found")

    files = [
        f"{question_id}/{f}"
        for f in os.listdir(folder_path)
        if f.endswith((".csv", ".png"))
    ]
    files.sort()
    return {"available_files": files}


@app.get("/files")
async def list_all_files():
    """(Optional) List files from all questions (debugging use only)."""
    all_files = []
    for subfolder in os.listdir(OUTPUT_DIR):
        folder = os.path.join(OUTPUT_DIR, subfolder)
        if os.path.isdir(folder):
            for f in os.listdir(folder):
                if f.endswith((".csv", ".png")):
                    all_files.append(f"{subfolder}/{f}")
    all_files.sort()
    return {"available_files": all_files}


@app.get("/preview/{filename:path}")
async def preview_file(filename: str, lines: int = 10):
    safe_filename = unquote(filename).replace("\\", "/")
    file_path = os.path.join(OUTPUT_DIR, safe_filename)
    file_path = os.path.normpath(file_path)

    if not file_path.startswith(os.path.abspath(OUTPUT_DIR)):
        raise HTTPException(status_code=400, detail="Invalid file path")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"File not found: {file_path}")
    if not file_path.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Preview only supports CSV files")

    try:
        with open(file_path, "r", encoding="utf-8-sig") as f:
            content = "".join([next(f) for _ in range(lines) if not f.closed])
        return {"filename": safe_filename, "preview": content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {e}")

@app.get("/download/{filename:path}")
def download_file(filename: str):
    """Download a file from any subfolder within output/."""
    safe_filename = filename.replace("\\", "/")  # convert Windows-style paths
    file_path = os.path.join(OUTPUT_DIR, safe_filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, filename=os.path.basename(file_path))
    raise HTTPException(status_code=404, detail="File not found")

@app.get("/fullcsv/{filename:path}")
async def full_csv(filename: str):
    """Return the entire CSV content as a JSON table for frontend rendering."""
    safe_filename = unquote(filename).replace("\\", "/")
    file_path = os.path.join(OUTPUT_DIR, safe_filename)
    file_path = os.path.normpath(file_path)

    if not file_path.startswith(os.path.abspath(OUTPUT_DIR)):
        raise HTTPException(status_code=400, detail="Invalid file path")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"File not found: {file_path}")
    if not file_path.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Preview only supports CSV files")

    try:
        import csv
        with open(file_path, "r", encoding="utf-8-sig") as f:
            reader = csv.reader(f)
            rows = [row for row in reader]
        return {"filename": safe_filename, "rows": rows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {e}")