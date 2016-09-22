---
layout: post
title:  "Using RAML to slice and dice a monolithic app"
date:   2016-09-22 14:52:12 +0100
categories: update
---

# What's RAML?

[RAML](http://raml.org/) is an API specification language that lends itself to:

* Running tests against an API ([abao](https://www.npmjs.com/package/abao))
* Validating and proxying incoming requests against the spec 
([osprey](https://www.npmjs.com/package/osprey))
* Generating documentation from the spec ([raml2html](https://www.npmjs.com/package/raml2html))

# What am I going to do with it?

I've been looking at how to easily integrate multiple services into an 
[API gateway](http://microservices.io/patterns/apigateway.html) without having 
to write too much code in the gateway.

For my gateway I'm co-opting the original application structure based on 
[MeanJs](http://meanjs.org/). This means that the gateway retains responsibility 
for users and permissions, and for serving the [angular](https://angularjs.org/) 
application.

The new services that were originally *modules* in the meanjs app are migrated 
to be stand alone services that publish a [RAML](http://raml.org/) spec. My hope 
is that I can replace the guts of the modules with 
[osprey](https://www.npmjs.com/package/osprey) configuration.
