from fastapi import APIRouter, Depends, Request, Response
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from src.database import get_db
from src.repositories.dashboard import DashboardRepository
from fastapi.templating import Jinja2Templates

router = APIRouter(prefix="/dashboard", tags=["dashboard"])
templates = Jinja2Templates(directory="templates")

from core.storage.minio_client import MinioClient
minio_client = MinioClient()

@router.get("/", response_class=HTMLResponse)
async def get_dashboard_page(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})

@router.get("/logs", response_class=HTMLResponse)
async def get_logs_page(request: Request):
    return templates.TemplateResponse("logs.html", {"request": request})

@router.get("/stats")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    repo = DashboardRepository(db)
    return {
        "summary": repo.get_summary_stats(),
        "ai_requests": repo.get_ai_requests_stats(),
        "models": repo.get_model_distribution(),
        "nutrition": repo.get_nutrition_stats()
    }

@router.get("/logs/data")
async def get_logs_data(page: int = 0, db: Session = Depends(get_db)):
    limit = 20
    offset = page * limit
    repo = DashboardRepository(db)
    return repo.get_detailed_logs(limit=limit, offset=offset)

@router.get("/images/{image_name}")
async def get_image(image_name: str):
    from core.storage.minio_client import BUCKET_NAME
    try:
        response = minio_client.client.get_object(BUCKET_NAME, image_name)
        return Response(content=response.read(), media_type="image/jpeg")
    except Exception:
        return Response(status_code=404)
