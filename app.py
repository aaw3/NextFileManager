from fastapi import FastAPI, HTTPException, Body, Query
from pathlib import Path
import shutil
import magic
from typing import Annotated

app = FastAPI()

# Define the root directory to restrict access
ROOT_DIRECTORY = Path("./uploads").resolve()
print(f"Root Directory: {ROOT_DIRECTORY}")

# Will be combined with user directory eventually
def secure_path(path: str) -> Path:
    combined_path = ROOT_DIRECTORY / path
    # Make sure path is within defined root directory
    resolved_path = combined_path.resolve()
    
    if not resolved_path.is_relative_to(ROOT_DIRECTORY):
        raise HTTPException(status_code=403, detail="Access to this path is forbidden")
    
    return resolved_path

# [GET] /api/directory
@app.get("/api/directory")
async def list_directory(path: str = "/"):
    directory = secure_path(path)
    
    if not directory.exists() or not directory.is_dir():
        raise HTTPException(status_code=404, detail="Directory not found")

    mime = magic.Magic(mime=True)
    files_info = []
    for file_path in directory.iterdir():
        files_info.append({
            "modified": int(file_path.stat().st_mtime),
            "created": int(file_path.stat().st_ctime),
            "fileName": file_path.name,
            "thumbnail": "placeholder_thumbnail",  # Temporary Placeholder
            "mime_type": "inode/directory" if file_path.is_dir() else mime.from_file(str(file_path)) if file_path.is_file() else "unknown", 
            "size": file_path.stat().st_size,
        })

    return {"files": files_info}

# [POST] /api/directory
@app.post("/api/directory")
async def create_directory(path: str):
    directory = secure_path(path)

    try:
        directory.mkdir(parents=True, exist_ok=False)
    except FileExistsError:
        raise HTTPException(status_code=400, detail="Directory already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "Directory created successfully"}

# [PATCH] /api/directory
@app.patch("/api/directory")
async def rename_directory(old_path: str, new_path: str):
    old_directory = secure_path(old_path)
    new_directory = secure_path(new_path)

    if not old_directory.exists() or not old_directory.is_dir():
        raise HTTPException(status_code=404, detail="Directory not found")
    
    try:
        old_directory.rename(new_directory)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "Directory renamed successfully"}

# [DELETE] /api/directory
@app.delete("/api/directory")
async def delete_directory(paths: list[str] = Body(...)):
    for path in paths:
        directory = secure_path(path)
        if not directory.exists() or not directory.is_dir():
            raise HTTPException(status_code=404, detail=f"Directory '{path}' not found")

        try:
            shutil.rmtree(directory)  # Recursive delete
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    return {"message": "Directory(s) deleted successfully"}

# [DELETE] /api/file
@app.delete("/api/file")
async def delete_file(data: dict = Body(...)):
    if not "paths" in data:
        raise HTTPException(status_code=400, detail="Paths not provided in request")

    for path in paths:
        file_path = secure_path(path)
        print(file_path)
        # Print file info
        print(file_path.stat())
        if not file_path.exists() or not file_path.is_file():
            raise HTTPException(status_code=404, detail=f"File '{path}' not found")

        try:
            file_path.unlink()  # Delete file
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    return {"message": "File(s) deleted successfully"}
