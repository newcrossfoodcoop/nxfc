FROM bsimpson53/nxfc_base

MAINTAINER Ben Simpson, ben@newcrossfoodcoop.org.uk

WORKDIR /home/app

# Install Mean.JS packages
ADD package.json /home/app/package.json
RUN npm install

# Manually trigger bower. Why doesnt this work via npm install?
ADD .bowerrc /home/app/.bowerrc
ADD bower.json /home/app/bower.json
RUN bower install --config.interactive=false --allow-root

# Default to Development
ENV NODE_ENV development
