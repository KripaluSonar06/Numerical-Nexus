# app/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from app.schemas import SolveRequest, SolveResponse
from app.solutions import s2_1a, s2_1b, s2_2, s3_1, s3_2
import os

# ===============================================================
# Initialize the FastAPI app
# ===============================================================
app = FastAPI(title="Numerical Methods Assignment 2 & 3 Backend", version="1.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # During development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Output directory for CSVs, PNGs, etc.
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)


# ===============================================================
# Root route
# ===============================================================
@app.get("/")
async def root():
    """Root route showing available endpoints."""
    return {
        "message": "Backend is running successfully 🚀",
        "endpoints": [
            "/solve/2_1A",
            "/solve/2_1B",
            "/solve/2_2",
            "/solve/3_1",
            "/solve/3_2",
            "/files",
            "/files/{filename}",
            "/preview/{filename}",
        ],
    }


# ===============================================================
# Assignment 2_1A Endpoint
# ===============================================================
@app.post("/solve/2_1A", response_model=SolveResponse)
async def solve_2_1a_endpoint(req: SolveRequest):
    try:
        result = s2_1a.solve_s2_1a(req.params)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ===============================================================
# Assignment 2_1B Endpoint
# ===============================================================
@app.post("/solve/2_1B", response_model=SolveResponse)
async def solve_2_1b_endpoint(req: SolveRequest):
    try:
        result = s2_1b.solve_s2_1b(req.params)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ===============================================================
# Assignment 2_2 Endpoint
# ===============================================================
@app.post("/solve/2_2", response_model=SolveResponse)
async def solve_2_2_endpoint(req: SolveRequest):
    try:
        result = s2_2.solve_s2_2(req.params)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ===============================================================
# Assignment 3_1 Endpoint
# ===============================================================
@app.post("/solve/3_1", response_model=SolveResponse)
async def solve_3_1_endpoint(req: SolveRequest):
    try:
        result = s3_1.solve_s3_1(req.params)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ===============================================================
# Assignment 3_2 Endpoint
# ===============================================================
@app.post("/solve/3_2", response_model=SolveResponse)
async def solve_3_2_endpoint(req: SolveRequest):
    try:
        result = s3_2.solve_s3_2(req.params)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ===============================================================
# File Listing Endpoint
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


# ===============================================================
# File Download / View Endpoint
# ===============================================================
@app.get("/files/{filename}")
async def get_file(filename: str):
    """Serve any CSV or PNG file from the output directory."""
    file_path = os.path.join(OUTPUT_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    # Determine MIME type
    if filename.lower().endswith(".csv"):
        media_type = "text/csv"
    elif filename.lower().endswith(".png"):
        media_type = "image/png"
    else:
        media_type = "application/octet-stream"

    return FileResponse(file_path, media_type=media_type, filename=filename)


# ===============================================================
# File Preview Endpoint (for quick frontend display)
# ===============================================================
@app.get("/preview/{filename}")
async def preview_file(filename: str, lines: int = 10):
    """Preview the first few lines of a CSV file."""
    file_path = os.path.join(OUTPUT_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    if not filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Preview supported only for CSV files")

    try:
        with open(file_path, "r") as f:
            content = "".join([next(f) for _ in range(lines) if not f.closed])
        return {"filename": filename, "preview": content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {e}")
