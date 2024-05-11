FROM node:16

RUN npm i -g @nestjs/cli
WORKDIR /workspaces
# 差分テスト