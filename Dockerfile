FROM node:16.15

WORKDIR /app

COPY *.json /app/

RUN npm install

RUN npm tsc

COPY . /app/

EXPOSE 3000

CMD ["npm", "run" ,"start:prod"]