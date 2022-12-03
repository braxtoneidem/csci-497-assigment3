FROM node:17-alpine

WORKDIR /home/sabine/Documents/Western/CSCI-497/assigment-3

# Install dependancies
COPY ./package.json ./
RUN npm install
COPY ./ ./

#Default command 
CMD ["npm", "start"]