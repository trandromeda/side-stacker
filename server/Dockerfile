FROM node:19.7.0
WORKDIR /server
COPY package*.json ./

RUN npm install
COPY . ./
RUN NODE_ENV=development npm i

EXPOSE 9000
EXPOSE 9001

CMD npm run start