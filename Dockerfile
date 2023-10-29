FROM node:20.9

WORKDIR /app

COPY *.json /app/

RUN npm install

COPY . /app/

EXPOSE 3000

CMD ["npm", "run" ,"start:prod"]