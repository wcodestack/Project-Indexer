FROM node:20-alpine

WORKDIR /app

# Install OpenSSL (required by Prisma)
RUN apk add --no-cache openssl

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

# Create startup script that runs migrations then starts app
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

CMD ["./entrypoint.sh"]