from fastapi import APIRouter
from app.routers.v1 import example, auth, projects, chat, users, canvas, design_packages, tasks

router = APIRouter(prefix="/v1")

router.include_router(example.router)
router.include_router(auth.router)
router.include_router(projects.router)
router.include_router(chat.router)
router.include_router(users.router)
router.include_router(canvas.router)
router.include_router(design_packages.router)
router.include_router(tasks.router)
