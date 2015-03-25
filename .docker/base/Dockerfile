FROM dockerfile/nodejs

MAINTAINER Ben Simpson, ben@newcrossfoodcoop.org.uk

WORKDIR /home/app

# Install fonts for PhantomJS
RUN apt-get update \
    && apt-get install -y libfontconfig libfreetype6 \
    && rm -rf /var/lib/apt/lists/*

# Install Mean.JS Prerequisites
RUN npm install -g gulp
RUN npm install -g bower

# Install Mean.JS packages
ADD package.json /home/app/package.json
RUN npm install

# Manually trigger bower. Why doesnt this work via npm install?
ADD .bowerrc /home/app/.bowerrc
ADD bower.json /home/app/bower.json
RUN bower install --config.interactive=false --allow-root
