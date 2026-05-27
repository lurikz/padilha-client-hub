FROM oven/bun:latest

WORKDIR /app

COPY package.json ./
COPY bun.lock ./

RUN bun install

COPY . .

ENV PORT=3001
EXPOSE 3001

CMD ["bun", "run", "src/index.ts"]
