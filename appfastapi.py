from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key="secret")

@app.get("/")
def read_root():
    return {"Hello": "World"}
