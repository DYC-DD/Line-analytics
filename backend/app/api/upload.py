from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.parser import parse_line_chat
from app.services.analyzer import analyze_chat

router = APIRouter()


@router.post("/upload")
async def upload_chat(file: UploadFile = File(...)):
    if not file.filename.endswith(".txt"):
        raise HTTPException(status_code=400, detail="請上傳 .txt 聊天記錄檔案")

    content = await file.read()
    text = content.decode("utf-8")

    parsed_data = parse_line_chat(text)
    analysis = analyze_chat(parsed_data)

    return {"analysis": analysis}
