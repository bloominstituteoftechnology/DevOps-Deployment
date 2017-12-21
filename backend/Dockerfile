FROM node:5.4
COPY package.json package.json
WORKDIR /
RUN npm install
COPY server.js /
EXPOSE 8080
CMD ["node", "/server.js"]