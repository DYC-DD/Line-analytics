from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import upload
from app.services.parser import parse_line_chat
from app.services.analyzer import analyze_chat

app = FastAPI()

# CORS 中介層
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 掛載 upload 路由
app.include_router(upload.router)
