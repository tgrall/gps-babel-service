FROM node:bullseye-slim

# Install GPSBabel
RUN apt-get update -y && apt-get install -y gpsbabel && apt-get install -y curl


# Deploy application
WORKDIR /usr/src/app

# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

COPY . .


EXPOSE 8080

ENTRYPOINT	["node", "index.js"]
