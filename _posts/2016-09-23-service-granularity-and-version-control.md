---
layout: post
title:  "Service Granularity and Version Control"
date:   2016-09-23 23:37:19 +0100
categories: update
comments: true
---
Deciding how to decompose the app has been tricky. There are some obvious parts
like [ghost](https://ghost.org/) that should have been running separately from
the start, but there are other areas where how to subdivide becomes more tricky.

# E-commerce

Our app is designed to support community 
[co-buying](https://en.wikipedia.org/wiki/Co-buying) and is essentially a 
slightly odd e-commerce platform. In the monolithic version of the app *ecom* is 
one module that deals with:

* products
* ingests
* orders
* payments
* baskets
* suppliers
* deliveries
* collections

These different areas all depend on one another, but there is a lot of disparate
functionality here. For example, we have to perform ingests of products which 
requires long running processes and therefore at least a separate worker process
(if not a worker container) so as not to impact the running of the app itself. 
This is quite different from performing financial transactions.

# A database per service?

A common pattern is to use a private
[database per service](http://microservices.io/patterns/data/database-per-service.html)
keeping your service the ultimate controller of its data and avoiding having to
co-ordinate schema changes across multiple services. I asked myself 
[Do I really need a database per service?](https://plainoldobjects.com/2015/09/02/does-each-microservice-really-need-its-own-database-2/)

# Maybe not...

It struck me that I could, with the help of [docker](https://www.docker.com/),
version several services together, structured in a similar way to 
[meanjs](meanjs.org)' modules, but generating separate containers: 

* It would be easier to maintain their coherent management of their data.
* I can avoid the worst unnecessary hoop jumping when dealing with related data.
* I can still reduce the complexity of the app, partly by challenging some of
the dependencies that are easy to draw when your're talking to other parts of the same app

# Where will this take the ecom 'module'

It looks to me like it's going to divide into 3 or 4 parts centred around:

1. products and suppliers
1. payments and orders
1. deliveries and collections

So far things seem to decompose down into an api built as an 
[express](https://expressjs.com/) app and sometimes an additional worker built 
as a [sencea](http://senecajs.org/) app.

