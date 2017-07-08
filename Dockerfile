FROM node:boron


# Create app directory
RUN mkdir -p /var/src/app
WORKDIR /var/src/app

# Install app dependencies
COPY package.json /var/src/

RUN npm install --production

# Bundle server source
COPY ./app /var/src/app
# Bundle app code
COPY ./build /var/src/build

# Copy env if exists 
#COPY .env /var/src/.env


EXPOSE 3000
CMD [ "npm", "start" ]