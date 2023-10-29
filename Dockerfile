FROM node:16.15

WORKDIR /app

COPY *.json /app/

RUN npm install

COPY . /app/

EXPOSE 3000

CMD ["node", "dist/index.js"]