# app/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from app.schemas import SolveRequest
import os
import asyncio

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
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

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
            "/stream/3_3",
        ],
        "file_endpoints": [
            "/files",
            "/files/{filename}",
            "/preview/{filename}",
        ],
    }

# ===============================================================
# Helper: Unified Stream Wrapper
# ===============================================================
def make_stream_response(generator_func, params):
    """Stream generator output line by line to frontend in real time."""
    async def event_stream():
        for line in generator_func(params):
            if isinstance(line, str):
                yield (line + "\n").encode("utf-8")
            else:
                yield str(line).encode("utf-8")
            await asyncio.sleep(0)
    return StreamingResponse(event_stream(), media_type="text/plain")

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
    return make_stream_response(s2_2.stream_s2_2, req.params)


@app.post("/stream/3_1")
async def stream_3_1(req: SolveRequest):
    from app.solutions import s3_1
    return make_stream_response(s3_1.stream_s3_1, req.params)


@app.post("/stream/3_2")
async def stream_3_2(req: SolveRequest):
    from app.solutions import s3_2
    return make_stream_response(s3_2.stream_s3_2, req.params)


@app.post("/stream/3_3")
async def stream_3_3(req: SolveRequest):
    from app.solutions import s3_3
    return make_stream_response(s3_3.stream_s3_3, req.params)


# ===============================================================
# FILE MANAGEMENT ROUTES
# ===============================================================

@app.get("/files")
async def list_files():
    """List all CSV and PNG files in the output folder."""
    try:
        files = [f for f in os.listdir(OUTPUT_DIR) if f.endswith((".csv", ".png"))]
        files.sort()
        return {"available_files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/files/{filename}")
async def get_file(filename: str):
    """Serve CSV or PNG file from the output directory."""
    file_path = os.path.join(OUTPUT_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    # MIME type detection
    if filename.lower().endswith(".csv"):
        media_type = "text/csv"
    elif filename.lower().endswith(".png"):
        media_type = "image/png"
    else:
        media_type = "application/octet-stream"

    return FileResponse(file_path, media_type=media_type, filename=filename)


@app.get("/preview/{filename}")
async def preview_file(filename: str, lines: int = 10):
    """Preview the first few lines of a CSV file."""
    file_path = os.path.join(OUTPUT_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    if not filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Preview only supports CSV files")

    try:
        with open(file_path, "r") as f:
            content = "".join([next(f) for _ in range(lines) if not f.closed])
        return {"filename": filename, "preview": content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {e}")