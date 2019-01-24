FROM node:10

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
COPY index.js index.html ./
COPY public public
RUN npm install --production

EXPOSE 3000

CMD ["node", "index.js"]