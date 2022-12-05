FROM node:17-alpine

WORKDIR /usr/app

# Install dependancies
COPY ./package.json ./
# RUN npm install -g npm@9.1.3
RUN npm install
COPY ./ ./

#Default command 
CMD ["npm", "start"]