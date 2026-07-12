import time
import logging
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger("edusphere")


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time

        log_data = {
            "method": request.method,
            "url": str(request.url.path),
            "status_code": response.status_code,
            "process_time_ms": round(process_time * 1000, 2),
            "client_ip": request.client.host if request.client else "unknown",
        }

        if response.status_code >= 400:
            logger.warning(f"Request failed: {log_data}")
        else:
            logger.info(f"Request: {log_data}")

        response.headers["X-Process-Time"] = str(round(process_time * 1000, 2))
        return response
