FROM python:3.11-slim

# 設定工作目錄
WORKDIR /app

# 複製 requirements.txt 先安裝依賴
COPY ../backend/requirements.txt /app/requirements.txt

# 安裝 Python 套件（避免重新 build 全部）
RUN pip install --no-cache-dir -r /app/requirements.txt

# 複製完整後端程式碼
COPY ../backend/ /app/

# 啟動 FastAPI API
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
