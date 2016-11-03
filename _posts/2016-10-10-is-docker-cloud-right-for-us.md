---
layout: post
title:  "Is Docker Cloud Right For Us?"
date:   2016-10-10 18:57:12 +0100
categories: update
---

## What's Docker Cloud?

[Docker Cloud](http://cloud.docker.com) is a Container As A Service (*Caas*)
platform provided by docker and was originally called tutum.

It provides a nice clean, quick way to set up and link docker **services** (where a
service is a collection of containers with the same configuration and single
service level endpoint).

You can define **stacks** which are collections of services defined in a similar 
way to a *docker-compose.yml* and they can be deployed as a whole. 

You can deploy new **nodes** (or *hosts*) and fit them into your cloud with a
variety of infrastructure providers with the click of a button. You can even
define a cluster that you can scale allowing you to scale the services deployed
against that cluster.

It provides you with a secure cluster out of the box where you can choose to 
open up only the ports you need to the outside world, but to be able to safely
and simply connect your services together.

## How do we use it?

It was great to be able to set up a bunch of services for continuous 
integration (drone) tightly integrated with github (for source control) and 
docker hub (for docker image storage).

We were able to quickly set up production and stage environments, that look like
they can easily be scaled.

## So what's wrong?

**Shared storage and scalability** is the problem, while the services scale just
fine, if they need any shared storage then as things stand they are restricted
to residing on the same host. Should anything happen to the host, the whole 
service is gone, removing the point of scaling the service for availability.

## What's the alternative?

I'm glad you asked... I'm not sure, I'm wondering if we'll have to move to 
[shipyard](https://shipyard-project.com/) at some point perhaps... what do you 
think?

# Update 03/11/2016

There's another problem... the **cost of memory** in the cloud and how fat node 
processes are, it's easy to rack up a monthly £50 bill for your environments 
when you hardly use any CPU.
