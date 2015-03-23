FROM bsimpson53/nxfc_base

MAINTAINER Ben Simpson, ben@hy-street.net

WORKDIR /home/app

# Install Mean.JS packages
ADD package.json /home/app/package.json
RUN npm install --production

# Manually trigger bower. Why doesnt this work via npm install?
ADD .bowerrc /home/app/.bowerrc
ADD bower.json /home/app/bower.json
RUN bower install --config.interactive=false --allow-root

# Make everything available for start
ADD . /home/app

# Define upload directories as volumes
VOLUME /home/app/uploads
VOLUME /home/app/modules/users/client/img/profie/uploads

COPY .docker/production/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Open port 80
ENV PORT 80
EXPOSE 80

CMD ["/usr/bin/supervisord"]
