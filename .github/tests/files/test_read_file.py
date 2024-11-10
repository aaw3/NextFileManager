from fastapi.testclient import TestClient
from app import app, BUFFER_SIZE

client = TestClient(app)

def test_read_single_file_unbuffered_nodownload():
    small_file_path = "small.txt"
    global BUFFER_SIZE
    original_buffer_size = BUFFER_SIZE
    BUFFER_SIZE = 1024  # Small buffer for test
    try:
        response = client.get("/api/file/read", params={"path": [small_file_path], "nodl": "true"})
        assert response.status_code == 200
        assert "Content-Disposition" not in response.headers
        assert response.content == b"This is a small file."
    finally:
        BUFFER_SIZE = original_buffer_size
