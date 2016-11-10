---
layout: post
title:  "Docker Hosting Monitoring And Logging"
date:   2016-11-10 13:48:05 +0000
categories: update
comments: true
---

## Context

As a not for profit organisation, we very much need to keep a handle on our
costs, often we're time rich and cash poor.

At the moment our site is being hosted in containers on DockerCloud using 
DigitalOcean droplets: 

* DockerCloud
  * $15 per host per month (first two hosts free)
* DigitalOcean
  * $5 - $10 per host per month

I had been under the impression that my DockerCloud account was free, but it 
appears not as I just got billed out of the blue :(

Right now I've got 5 hosts, two of which are soley for this project, giving me
monthly cost of `2 x ($15 + $10) = $50` which is too high :(

## Problem: DockerCloud Costs

I really need to limit the costs of DockerCloud or not use it at all. 

### Option 1 - Bigger Hosts

To limit the costs I can use bigger machines and put all the services onto them,
since DockerCloud's pricing is per host I could squeeze it all onto a free account.

pros:

* Fairly quick, some data migration
* Solves the short term problem

cons:

* It means that if I lose a host through a badly behaving service then everything goes down
* It's probably only a stop-gap

### Option 2 - Docker Swarm

I could run the services as a docker swarm...

pros:

* Free (only DigitalOcean costs)
* Could use a free tool like shipyard to manage the swarm

cons:

* It would take time to set up and get used to
* It's probably going to have additonal ongoing time costs

### Option 3 - Kubernetes

Switch to a more mature container technology like [Kubernetes](https://technologyconversations.com/2015/11/04/docker-clustering-tools-compared-kubernetes-vs-docker-swarm)

pros:

* Free (only DigitalOcean costs)
* It uses docker containers

cons:

* Apart from using docker containers... it's totally different :)

## Problem 2: Monitoring and alerting not sufficient on DockerCloud

DockerCloud doesn't provide centralised monitoring, alerting and logging. It does
allow you to access the logs for each container but if you want memory/cpu usage
you have to roll your own.

### Option 1 - Cloud Services

There are quite a lot of cloud based monitoring services availiable, I've tried
a couple (logentries & sematext). From looking around a combination of Papertrail
and DataDog might be the way to go.

pros:

* quick and easy to set up
* has a free tier
  * DataDog - up to 5 hosts
  * Papertrail - up to 100MB per month
* Papertrail is $7 per month up to the first 1GB

cons:

* DataDog is $15 per host per month after you break 5 hosts

### Option 2 - Self Hosted Services (Paid)

I found a service called OpsDash which you host yourself and gives you monitoring
dashboards out of the box for a bunch of services

pros:

* looks easy to set up
* Free for the first 5 hosts, then $1 a month after that

cons:

* You have to pay something :)
* Doesn't support centralised logging so would need part of one of the other options

### Option 3 - Open Source Self Hosted Services (Free)

#### Monitoring & Alerts

So far I've tried:

* Prometheus - log collection & alerting
* Grafana - visualisation
* Influx - Time Series DB

Honestly I've found this bit frustrating, mostly because I'd have to write loads
of querying to expose the data that I want, and there seem to be multiple query 
languages.

#### Logging

I haven't got as far as looking at logging, but for that greylog looks like just
the thing (greylog, mongo & elastic search)

pros:
  * free
  * greylog looks good
  
cons:
  * monitoring and alerts are really irritating!
  


