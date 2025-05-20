# 使用 Nginx 作為靜態伺服器
FROM nginx:stable-alpine

# 刪除預設 index.html
RUN rm -rf /usr/share/nginx/html/*

# 將本地 frontend/dist 拷貝進容器
COPY ./frontend/dist/ /usr/share/nginx/html

# 自定義 nginx 設定
COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf
