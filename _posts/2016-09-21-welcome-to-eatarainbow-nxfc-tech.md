---
layout: post
title:  "Welcome to the Tech Blog!"
date:   2016-09-21 21:28:34 +0100
categories: update
---
This is the inaugural post :)

The aim is to document the rhythm of work on the website and how it develops.

Right now I'm in the process of migrating the site's architecture from a 
[monolithic](http://microservices.io/patterns/monolithic.html) app to an 
[api gateway](http://microservices.io/patterns/apigateway.html) and a cluster of 
micro-services behind it.

In reality the monolithic app is:

* hard to groc
* hard to contribute to
* hard to test
* hard to maintain

I'm hoping that I can reuse some of the services for other projects guaranteeing
that they are maintained and actively monitored and developed. 
