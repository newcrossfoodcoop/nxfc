[![Stories in Ready](https://badge.waffle.io/newcrossfoodcoop/nxfc.png?label=ready&title=Ready)](https://waffle.io/newcrossfoodcoop/nxfc)
# New Cross Food Coop & Eat A Rainbow Website

[![Join the chat at https://gitter.im/newcrossfoodcoop/nxfc](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/newcrossfoodcoop/nxfc?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](http://drone.newcrossfoodcoop.org.uk/api/badge/github.com/newcrossfoodcoop/nxfc/status.svg?branch=master)](http://drone.newcrossfoodcoop.org.uk/github.com/newcrossfoodcoop/nxfc)
[![Dependency Status](https://david-dm.org/newcrossfoodcoop/nxfc.svg)](https://david-dm.org/newcrossfoodcoop/nxfc)

The website is based on: 

* [MEAN.JS 0.4.0](https://github.com/meanjs/mean/tree/0.4.0) a Node.js development framework.

## Getting started
To make getting started as easy as possible we are using: 

* [Vagrant](https://www.vagrantup.com/) to provide a virtual machine to run the app in
* [Docker](https://www.docker.com/) to provide "containers" to run our app and its dependant services in

These allow our application to run happily and consistently on Linux, MacOSX and Windows in only a few commands.

### 1. Install Vagrant & Docker
* Install [Vagrant](http://www.vagrantup.com/downloads)
* Install [Docker](http://www.docker.com/)

### 2. Clone The GitHub Repository
```
$ git clone https://github.com/newcrossfoodcoop/nxfc.git nxfc
```
This will clone the latest version of the repository to a **nxfc** folder.

### 3. Start The App
```
$ vagrant up
```
Vagrant and Docker will now download a couple of container images, build them and then run them, this could take a few minutes the first time but will be much quicker the next time.

The website should now be running on the 3000 port so in your browser just go to [http://localhost:3000](http://localhost:3000)
                            
That's it! You should now have two containers running one running mongodb and one running the website.

Head to the [wiki](https://github.com/newcrossfoodcoop/nxfc/wiki/Home) to find out how to work with the app.

## Contributing

We intend to follow the standard open source approach for contributing to a project hosted on github that you can find [here](https://guides.github.com/activities/contributing-to-open-source/#contributing). Basically: 
1. fork the repo
2. clone it locally
3. make your changes in a branch
4. push them to your fork
5. open a pull request

## License
(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
