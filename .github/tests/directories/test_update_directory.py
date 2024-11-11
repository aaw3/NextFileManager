# Example of an update test if your API supports moving/renaming directories

from fastapi.testclient import TestClient
from app import app
from tests.helpers import mkdir, rmdir

client = TestClient(app)

def test_rename_directory():
    dir_original = "original_dir"
    dir_renamed = "renamed_dir"
    mkdir(dir_original)
    response = client.patch("/api/directory", json={dir_original: dir_renamed})
    assert response.status_code == 200
    rmdir(dir_renamed)

def test_rename_duplicate_directory():
    dir_original = "original_dir"
    dir_renamed = "renamed_dir"
    mkdir(dir_original, dir_renamed)
    response = client.patch("/api/directory", json={dir_original: dir_renamed})
    assert response.status_code == 400
    rmdir(dir_original, dir_renamed)
