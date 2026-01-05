from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from typing import Union

from src.api import analyzer, dashboard, auth
from starlette.middleware.sessions import SessionMiddleware
from src.cfgs import get_default

app = FastAPI()

# Required for OAuthlib/Authlib to store temporary state
app.add_middleware(
    SessionMiddleware, 
    secret_key=get_default("SESSION_SECRET_KEY", required=False) or "auth-session-secret"
)

app.include_router(analyzer.router)
app.include_router(dashboard.router)
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}




# static files (css, js, images)
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

@app.get("/1", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "title": "FastAPI HTML",
            "user": "Minh"
        }
    )