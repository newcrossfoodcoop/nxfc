FROM newcrossfoodcoop/nxfc-base:v4-v0.10

MAINTAINER Ben Simpson, ben@hy-street.net

WORKDIR /home/app

# Install Mean.JS packages
ADD package.json /home/app/package.json
RUN npm install

# Make everything available for start
ADD . /home/app

# Define upload directories as volumes
VOLUME /home/app/uploads

# Port 4000 for server
# Port 5858 for debug
EXPOSE 3000 5858

# CMD ["gulp","prod-worker"] for production
CMD ["gulp", "dev-worker"]
