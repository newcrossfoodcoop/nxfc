FROM bsimpson53/nxfc_base_dev

MAINTAINER Ben Simpson, ben@hy-street.net

WORKDIR /home/app

# Install Mean.JS packages
ADD package.json /home/app/package.json
RUN npm install

# Manually trigger bower. Why doesnt this work via npm install?
ADD .bowerrc /home/app/.bowerrc
ADD bower.json /home/app/bower.json
RUN bower install --config.interactive=false --allow-root

# Make everything available for start
ADD . /home/app

# default to development
ENV NODE_ENV development

# Define upload directories as volumes
VOLUME /home/app/uploads
VOLUME /home/app/modules/users/client/img/profie/uploads

# Port 3000 for server
# Port 35729 for livereload
EXPOSE 3000 35729
CMD ["gulp"]
