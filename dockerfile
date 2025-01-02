FROM node:20.16.0

WORKDIR /user/app

COPY package*.json ./

RUN npm install

COPY . .

# Build the Prisma Client
RUN npx prisma generate

# Set the entrypoint to the script
ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 3000

CMD ["npm","run","dev"]
