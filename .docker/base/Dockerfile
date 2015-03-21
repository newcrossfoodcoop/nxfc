FROM dockerfile/nodejs

MAINTAINER Ben Simpson, ben@newcrossfoodcoop.org.uk

WORKDIR /home/app

# Install fonts for PhantomJS
RUN apt-get update
RUN apt-get install -y libfontconfig libfreetype6

# install docker
RUN apt-get install -y apparmor  
RUN curl -s https://get.docker.io/ubuntu/ | sudo sh
ADD bin/wrapdocker /usr/local/bin/wrapdocker  
RUN chmod +x /usr/local/bin/wrapdocker 

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

# default to development
ENV NODE_ENV development
