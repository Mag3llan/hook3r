FROM node:0.12-wheezy

MAINTAINER devops@mag3llan.com

#Install global dependencies
RUN npm install -g nodemon bunyan

# Setup app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Copy app 
COPY . /usr/src/app

EXPOSE 18080

CMD [ "npm", "start" ]