FROM node:18

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --only=production

COPY . .

EXPOSE 8080
CMD [ "npx", "ts-node", "./app/Main.ts" ]

