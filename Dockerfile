FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
RUN npm install -g vite
RUN npm run build
RUN chown -R node:node /usr/src/app
USER node
EXPOSE 5173
CMD ["vite", "preview", "--host"]