import uvicorn
import sys


def dev():
    """Run development server with hot reload."""
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="debug",
    )


def start():
    """Run production server."""
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        workers=4,
        log_level="info",
    )


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "start":
        start()
    else:
        dev()
