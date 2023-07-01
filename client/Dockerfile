FROM node:19.7.0
WORKDIR /client
COPY package*.json ./

RUN npm install
COPY . ./
RUN NODE_ENV=development npm i

EXPOSE 3000

CMD npm run start