---
layout: post
title:  "Docker containers make things easier"
date:   2016-10-09 23:12:27 +0100
categories: update
comments: true
---

# What's a container?

We've plumped for [docker](https://www.docker.com/) to run our services. 
Containers are processes that run on a host and provide a controlled execution 
space that looks to the process(es) in the container like a virtual machaine 
with it's own operating system, but in reality it's not, there's no 
virtualisation taking place, the process isn't being run on a virtual model of 
a machine. This means that the overheads for running a process in a container 
are similar to running any other process on a machine.

# What does that mean for us?

On one server we can run lots of cleanly isolated services that in the past we
would have had to run on many seperate servers, at great expense. As a way of
keeping costs under control, that's great, but it's not the most important
benifit here. The most important part for us is that it allows us to take our
application and cut it into smaller, simpler and easier to manage, maintain and
reuse services.

# What does that mean for you?

Hopefully it makes it easier for you to contribute to our project, lowering the
amount you need to know about the whole system in order to make useful changes
to the service that we want to provide. Contact 
[us](http://newcrossfoodcoop.github.io/nxfc/about/) and lend a hand!
