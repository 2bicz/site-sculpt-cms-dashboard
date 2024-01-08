FROM node:20
WORKDIR /src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
CMD ["npm", "start"]