FROM node:bullseye-slim

# Install GPSBabel
RUN apt-get update -y && apt-get install -y gpsbabel && apt-get install -y curl


# Deploy application
WORKDIR /usr/src/app

# where available (npm@5+)
COPY package*.json ./

COPY . .

RUN npm install
RUN npm run build



EXPOSE 8080

ENTRYPOINT	["node", "./build/app.js"]
