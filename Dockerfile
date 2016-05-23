// preparing the environment
FROM node:4-onbuild

RUN apt-get update
RUN apt-get install -y -q --no-install-recommends \
    apt-transport-https \
    build-essential \
    ca-certificates \
    curl \
    g++ \
    gcc \
    git \
    apt-get -y autoclean

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Create app directory
RUN mkdir -p /app
WORKDIR /app

// install app dependencies
COPY package.json /app/
RUN make install
RUN npm install --production
RUN npm run setup

CMD [ 'npm', "boot-dev" ]

EXPOSE 7000