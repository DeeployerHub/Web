FROM node:argon

MAINTAINER Mahan hazrati <eng.mahan.hazrati@gmail.com>

RUN apt-get update
RUN apt-get install -y -q --no-install-recommends \
    apt-transport-https \
    build-essential \
    ca-certificates \
    make \
    curl \
    g++ \
    gcc \
    git

# Create app directory
RUN mkdir -p /app
COPY . /app/
WORKDIR /app

RUN make install
RUN npm install --production
RUN npm run setup

CMD [ "npm", "run", "boot-dev" ]

EXPOSE 443
