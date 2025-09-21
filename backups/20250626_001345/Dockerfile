FROM node:18-alpine

WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm install --production

# copy source
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
