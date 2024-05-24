FROM node:20-alpine

ARG GITHUB_PACKAGE_REGISTRY_TOKEN

WORKDIR /app

COPY package*.json ./

RUN npm config set '//npm.pkg.github.com/:_authToken' "${GITHUB_PACKAGE_REGISTRY_TOKEN}"

RUN npm install

COPY . .

RUN npm run prisma:generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]