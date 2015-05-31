FROM newcrossfoodcoop/nxfc-base:v4

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
RUN gulp build

# Define upload directories as volumes
VOLUME /home/app/uploads
VOLUME /home/app/modules/users/client/img/profie/uploads
VOLUME /home/app/modules/ghost/server/content/data

# Port 3000 for server
# Port 35729 for livereload
# Port 5858 for debug
# Port 80 for production
# Port 2368 for ghost
EXPOSE 3000 35729 5858 80 2368

# ["gulp","prod"] for production
CMD ["gulp"]
