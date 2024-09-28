FROM node:16.15

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node",  "-r", "tsconfig-paths/register", "dist/index.js"]