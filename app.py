from fastapi import FastAPI, HTTPException, Body, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated, Optional, List
from pydantic import BaseModel
from pathlib import Path
import shutil
import magic
from typing import Annotated, Optional, List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)



mime = magic.Magic(mime=True)

# Define the root directory to restrict access
ROOT_DIRECTORY = Path("./uploads").resolve()
print(f"Root Directory: {ROOT_DIRECTORY}")

# Will be combined with user directory eventually
def secure_path(path: str) -> Path:

    if path == "/":
        path = "." # Make root directory relative
    else:
        path = path.lstrip("/") # Make all paths provided relative

    combined_path = ROOT_DIRECTORY / path
    print(ROOT_DIRECTORY, combined_path)
    # Make sure path is within defined root directory
    resolved_path = combined_path.resolve()
    
    if not resolved_path.is_relative_to(ROOT_DIRECTORY):
        raise HTTPException(status_code=403, detail="Access to this path is forbidden")
    
    return resolved_path

# [GET] /api/directory
@app.get("/api/directory")
async def list_directory(path: list[str] = Query(...)):

    paths = set(path)

    paths_info = {}
    
    for p in paths:
        directory = secure_path(p)
    
        if not directory.exists() or not directory.is_dir():
            continue
            #raise HTTPException(status_code=404, detail="Directory not found")

        files_info = []
        for file_path in directory.iterdir():
            files_info.append(
                get_file_info(file_path)
            )
        
        paths_info[p] = files_info

    return {"directories": paths_info}

# [GET] /api/file
@app.get("/api/file")
async def list_file(path: list[str] = Query(...)):
    
    paths = set(path)

    files_info = {}

    for p in paths:
        file_path = secure_path(p)

        if not file_path.exists() or not file_path.is_file():
            files_info[p] = None
            #raise HTTPException(status_code=404, detail="Directory not found")

        files_info[p] = get_file_info(file_path)
        

    return {"files": files_info}

# Required to be parsed as a list instead of query parameter
class DirectoryRequest(BaseModel):
    path: List[str]

# [POST] /api/directory
@app.post("/api/directory")
async def create_directory(request: DirectoryRequest, verbose: Optional[bool] = Query(False)):
    path = request.path
    if len(path) == 0:
        raise HTTPException(status_code=400, detail="Paths not provided in request")

    paths = set(path)

    successful_paths = []
    failed_paths = []

    for p in paths:
        directory = secure_path(p)
        try:
            directory.mkdir(parents=True, exist_ok=False)
        except FileExistsError:
            successful_paths.append(p)
            continue
            #raise HTTPException(status_code=400, detail="Directory already exists")
        except Exception as e:
            failed_paths.append(p)
            #raise HTTPException(status_code=500, detail=str(e))
        successful_paths.append(p)

    return generate_response(successful_paths, failed_paths, "Directories created", verbose)

# [PATCH] /api/file
@app.patch("/api/file")
async def rename_file(files: dict[str, str], verbose: Optional[bool] = Query(False)):

    successful_paths = {}
    failed_paths = {}
    
    for old_name, new_name in files.items():
        old_directory = secure_path(old_name)
        new_directory = secure_path(new_name)

        if not old_directory.exists() or not old_directory.is_dir():
            #raise HTTPException(status_code=404, detail="Directory not found")
            failed_paths[old_name] = new_name
            continue
        
        try:
            old_directory.rename(new_directory)
        except Exception as e:
            #raise HTTPException(status_code=500, detail=str(e))
            failed_paths[old_name] = new_name
            continue

        successful_paths[old_name] = new_name

    return generate_response(successful_paths, failed_paths, "Directories renamed", verbose)

# [DELETE] /api/directory
@app.delete("/api/directory") # Must use query parameters as body is not supported in DELETE requests
async def delete_directory(path: list[str] = Query(...), verbose: Optional[bool] = Query(False)):
    if len(path) == 0:
        raise HTTPException(status_code=400, detail="Paths not provided in request")

    paths = set(path)

    successful_paths = []
    failed_paths = []

    for p in paths:
        directory = secure_path(p)
        if not directory.exists() or not directory.is_dir():
            failed_paths.append(p)
            continue

        try:
            shutil.rmtree(directory)  # Recursive delete
        except Exception as e:
            failed_paths.append(p)
            continue
        successful_paths.append(p)

    return generate_response(successful_paths, failed_paths, "Directories deleted", verbose)

# [DELETE] /api/file
@app.delete("/api/file")
async def delete_file(path: list[str] = Query(...), verbose: Optional[bool] = Query(False)): # Must use query parameters as body is not supported in DELETE requests
    if len(path) == 0:
        raise HTTPException(status_code=400, detail="Paths not provided in request")

    paths = set(path)

    successful_paths = []
    failed_paths = []

    for p in paths:  
        file_path = secure_path(p)
        # Print file info
        if not file_path.exists() or not file_path.is_file():
            failed_paths.append(p)
            continue

        try:
            file_path.unlink()  # Delete file
        except Exception as e:
            failed_paths.append(p)
            continue    

        successful_paths.append(p)

    return generate_response(successful_paths, failed_paths, "Files deleted", verbose)


# Function to determine the response
# Will be moved to a utils library later
def generate_response(successful_paths, failed_paths, operation, verbose):
    if verbose:
        return {"message": str(len(successful_paths)) + " " + operation + " successfully", "paths": {"success": successful_paths, "fail": failed_paths}}

    if (len(failed_paths) > 0):
        return {"message": str(len(successful_paths)) + " " + operation + " successfully", "failed": failed_paths}
    
    return {"message": str(len(successful_paths)) + " " + operation + " successfully"}


def get_file_info(file_path: Path):
    return {
            "modified": int(file_path.stat().st_mtime),
            "created": int(file_path.stat().st_ctime),
            "fileName": file_path.name,
            "thumbnail": "placeholder_thumbnail",  # Temporary Placeholder
            "mime_type": "inode/directory" if file_path.is_dir() else mime.from_file(str(file_path)) if file_path.is_file() else "unknown", 
            "size": file_path.stat().st_size,
    }