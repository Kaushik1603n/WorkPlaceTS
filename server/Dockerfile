FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install --omit=dev

EXPOSE 5000

CMD ["node", "dist/server.js"]