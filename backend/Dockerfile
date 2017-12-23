FROM node:8.7
COPY package.json package-lock.json ./
WORKDIR /
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]