# 以 Node.js 为例，如果是 Java 请更换镜像
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install --production
EXPOSE 3000
CMD ["npm", "start"]