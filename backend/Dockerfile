FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# App port
EXPOSE 3000

CMD ["npm", "run", "dev"]
