from fastapi import APIRouter
from app.routers.v1 import example, auth, projects, chat

router = APIRouter(prefix="/v1")

router.include_router(example.router)
router.include_router(auth.router)
router.include_router(projects.router)
router.include_router(chat.router)
