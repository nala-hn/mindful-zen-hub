from datetime import datetime
from fastapi.responses import JSONResponse
from typing import Any
from fastapi.encoders import jsonable_encoder

def universal_response(
    result: str, 
    detail: str, 
    path: str, 
    code: int, 
    data: Any = None
):
    return JSONResponse(
        status_code=code,
        content=jsonable_encoder({
            "result": result,
            "detail": detail,
            "path": path,
            "date": datetime.utcnow().isoformat(),
            "code": code,
            "data": data
        })
    )