from fastapi import FastAPI, HTTPException, Body, Query, Request, BackgroundTasks
from fastapi.responses import JSONResponse, Response, StreamingResponse
from pydantic import BaseModel
from pathlib import Path
import shutil
import magic
from typing import Annotated, Optional, List
from fastapi.middleware.cors import CORSMiddleware
from http import HTTPStatus
import zipfile
from datetime import datetime
from io import BytesIO
import tempfile

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BUFFER_SIZE = 1024 * 1024  # 1MB
MAX_ZIP_MEMORY_SIZE = 1024 * 1024 * 512  # 512MB
MAX_UNCOMPRESSED_SIZE = 1024 * 1024 * 128 # 128MB



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
            continue

        files_info[p] = get_file_info(file_path)
        

    return {"files": files_info}

# [GET] /api/file/read
@app.get("/api/file/read")
async def read_file(background_tasks: BackgroundTasks,  path: list[str] = Query(...), nodl: Optional[bool] = Query(False)):
    """
        Read file from the server and return it as a Response or StreamingResponse

        Args:
            background_tasks (BackgroundTasks): Background task to delete temporary files after request
            path (list[str] = Query(...)): List of paths to read
            nodl (Optional[bool] = Query(False)): Return file without attachment header so it can be opened in the browser

        Retruns:
            Response: File content as a Response or Streaming
    """
    
    paths = set(path)

    nonexistent_files = []
    for p in paths:
        file_path = secure_path(p)
        if not file_path.exists():
            nonexistent_files.append(p)
            continue

    if len(nonexistent_files) > 0:
        return JSONResponse(status_code=404,  content={"message": "Files not found", "files": nonexistent_files})

    if len(paths) == 0:
        raise HTTPException(status_code=400, detail="Paths not provided in request")
    elif len(paths) == 1 and secure_path(path[0]).is_file():
        return read_single_file(paths.pop(), nodl, background_tasks)
    else:
        return read_multiple_files(paths, background_tasks)

    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="File not found")

    return read_single_file(file_path, nodl, background_tasks)

def read_single_file(path: str, nodl: bool, background_tasks: BackgroundTasks):
    """
        Read a single file from the server and return it as a Response or StreamingResponse

        Uses file size to determine if the file should be returned as a Response or StreamingResponse and if it should be compressed

        Args:
            path (str): Path to read
            nodl (bool): Return file without attachment header so it can be opened in the browser
            background_tasks (BackgroundTasks): Background task to delete temporary files after request

        Returns:
            Response: File content as a Response or StreamingResponse
    """

    file_path = secure_path(path)
    with open(file_path, "rb") as file:
        if file_path.stat().st_size < BUFFER_SIZE:
            if nodl:
                return Response(content=file_unbuffered(file_path), media_type=mime.from_file(str(file_path)))
            else:
                return Response(content=file_unbuffered(file_path), media_type='application/octet-stream', headers={'Content-Disposition': f'attachment; filename={file_path.name}'})
                # Return Response with mime type so it can be opened by the browser
        
        if file_path.stat().st_size < MAX_UNCOMPRESSED_SIZE:
            return StreamingResponse(content=file_stream(file_path), media_type='application/octet-stream', headers={'Content-Disposition': f'attachment; filename={file_path.name}'})


        return read_multiple_files(set(path))

def file_unbuffered(file_path: str):
    """
        Read file from the server and return it as a Response

        Args:
            file_path (str): Path to read

        Returns:
            bytes: File content
    """
    with open(file_path, "rb") as file:
        return file.read()


def file_stream(file_path: str):
    """
        Read file from the server and return it as a StreamingResponse

        Args:
            file_path (str): Path to read

        Returns:
            Generator: File content
    """


    with open(file_path, "rb") as file:
        while True:
            chunk = file.read(BUFFER_SIZE)
            if not chunk:
                break
            yield chunk


def read_multiple_files(paths: set[str], background_tasks: BackgroundTasks):
    """
        Read multiple files from the server and return them as a Response or StreamingResponse

        Args:
            paths (set[str]): Paths to read
            background_tasks (BackgroundTasks): Background task to delete temporary files after request

        Returns:
            Response: File content as a Response or StreamingResponse
    """

    paths = [secure_path(p) for p in paths]


    zbuf = BytesIO()
    zipname = f'NextFileManager-{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}'
    with zipfile.ZipFile(zbuf, "w", zipfile.ZIP_DEFLATED) as zf:
        for file_path in paths:
            if not file_path.exists():
                raise HTTPException(status_code=404, detail="File deleted during compression")
            zf.write(file_path, arcname=file_path.name)

            if zbuf.tell() > MAX_ZIP_MEMORY_SIZE:
                zf.close()

                tempfile.mk
                temp_file_path = Path(tempfile.mkdtemp()) / f"{zipname}.zip"
                background_tasks.add_task(delete_after_request, temp_file_path.parent)
                with open(temp_file_path, 'wb') as f:
                    f.write(zbuf.getvalue())


                    # Return zip file stream
                    return StreamingResponse(open(temp_file_path, 'rb'), media_type='application/zip', headers={'Content-Disposition': f'attachment; filename={zipname}.zip'})
    
    # Return memory buffer stream
    zbuf.seek(0)
    return StreamingResponse(zbuf, media_type='application/zip', headers={'Content-Disposition': f'attachment; filename={zipname}.zip'})
    


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
            if (directory.is_file()):
                failed_paths.append(p)
            elif (directory.is_dir()):
                successful_paths.append(p)
            continue
            #raise HTTPException(status_code=400, detail="Directory already exists")
        except Exception as e:
            failed_paths.append(p)
            #raise HTTPException(status_code=500, detail=str(e))
        successful_paths.append(p)

    return JSONResponse(**generate_response(successful_paths, failed_paths, "Directories created", verbose))

# [PATCH] /api/directory
@app.patch("/api/directory")
async def rename_directory(paths: dict[str, str], verbose: Optional[bool] = Query(False)):

    successful_paths = {}
    failed_paths = {}
    
    for old_name, new_name in paths.items():
        old_directory = secure_path(old_name)
        new_directory = secure_path(new_name)

        if not old_directory.exists() or not old_directory.is_dir():
            #raise HTTPException(status_code=404, detail="Directory not found")
            failed_paths[old_name] = new_name
            continue

        if new_directory.exists():
            failed_paths[old_name] = new_name
            continue
        
        try:
            old_directory.rename(new_directory)
        except Exception as e:
            #raise HTTPException(status_code=500, detail=str(e))
            failed_paths[old_name] = new_name
            continue

        successful_paths[old_name] = new_name

    return JSONResponse(**generate_response(successful_paths, failed_paths, "Directories renamed", verbose))

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

    return JSONResponse(**generate_response(successful_paths, failed_paths, "Directories deleted", verbose))

# [PATCH] /api/file
@app.patch("/api/file")
async def rename_file(paths: dict[str, str], verbose: Optional[bool] = Query(False)):

    successful_paths = {}
    failed_paths = {}
    
    for old_name, new_name in paths.items():
        old_file = secure_path(old_name)
        new_file = secure_path(new_name)

        if not old_file.exists() or not old_file.is_file():
            failed_paths[old_name] = new_name
            continue


        if new_file.exists():
            failed_paths[old_name] = new_name
            continue
        
        try:
            old_file.rename(new_file)
        except Exception as e:
            failed_paths[old_name] = new_name
            continue

        successful_paths[old_name] = new_name

    return JSONResponse(**generate_response(successful_paths, failed_paths, "Files renamed", verbose))

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

    return JSONResponse(**generate_response(successful_paths, failed_paths, "Files deleted", verbose))


# Function to determine the response
# Will be moved to a utils library later
def generate_response(successful_paths, failed_paths, operation, verbose):
    http_status = HTTPStatus.OK.value
    if len(successful_paths) == 0 and len(failed_paths) > 0:
        http_status = HTTPStatus.BAD_REQUEST.value
    if len(successful_paths) > 0 and len(failed_paths) > 0:
        http_status = HTTPStatus.MULTI_STATUS.value

    if verbose:
        return {"status_code": http_status, "content": {"message": str(len(successful_paths)) + " " + operation + " successfully", "paths": {"success": successful_paths, "fail": failed_paths}}}

    if (len(failed_paths) > 0):
        return {"status_code": http_status, "content": {"message": str(len(successful_paths)) + " " + operation + " successfully", "failed": failed_paths}}
    
    return {"status_code": http_status, "content": {"message": str(len(successful_paths)) + " " + operation + " successfully"}}


def get_file_info(file_path: Path):
    return {
            "modified": int(file_path.stat().st_mtime),
            "created": int(file_path.stat().st_ctime),
            "fileName": file_path.name,
            "thumbnail": "placeholder_thumbnail",  # Temporary Placeholder
            "mime_type": "inode/directory" if file_path.is_dir() else mime.from_file(str(file_path)) if file_path.is_file() else "unknown", 
            "size": file_path.stat().st_size,
    }

def delete_after_request(file_path):
    try:
        file_path.unlink()
    except Exception as e:
        print(f"Unable to delete file: {str(e)}")


# Return 'message' instead of 'detail' for all HTTPExceptions to be interpreted by frontend
@app.exception_handler(HTTPException)
def custom_http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail}  # Change "detail" to "message"
    )