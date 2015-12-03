# atacama [![Build Status](https://api.travis-ci.org/the-james-burton/atacama.svg?branch=master)](https://travis-ci.org/the-james-burton/atacama) [![devDependency Status](https://david-dm.org/the-james-burton/atacama/dev-status.svg)](https://david-dm.org/the-james-burton/atacama#info=devDependencies) [![Dependency Status](https://gemnasium.com/the-james-burton/atacama.svg)](https://gemnasium.com/the-james-burton/atacama)

## What is it?

Atacama is a backronym that I thought could mean *Automated technical analysis, combined and made available*. It is a web client application for my *turbine* server-side technical analysis engine. I originally designed *the-turbine* specifically so that everything could be viewed in Kibana without the need for a separate client app. Atacama was really conceived as a way for me to learn how to program in angular-js and (hopefully) demonstrate how easy it is to write powerful, single-page applications with angular-js and off-the-shelf open-source components with the minimum of code.

As I have developed the app, some interesting opportunities for optimisation above a Kibana-only approach have emerged. One of these is to only calculate indicators and strategies for markets, stocks and interests of the users. Anything that becomes an interest of the user will be a catch-up job for *the-turbine*, which will then do it as fast as possible. In reality, this is a better fit for real enterprise problems such as ticking risk calculations where is it just not feasible to calculate everything all the time.

Further down the line, this minimum-runtime plus burst-on-demand approach will provide for some interesting horizontal scalability work. This should give me some nice real world reasons to use the emerging auto-scaling features in products such as OpenShift.


## What does it looks like?

*(Screenshots to follow)*

## How does it work?

It is a HTML5/Angular-JS single-page application that runs in a web browser. It communicates with three principal back end components...

* **elasticsearch** Using a factory-provided elasticsearch javascript client. Ultimately, this client communicates via the elasticsearch rest API. Historic data is fetched from elasticsearch for presenting to the user. My *turbine* server project also has spring-data-elasticsearch and some rest APIs to provide the same data. This will allow me to swap easily between the two to try out different architectures.
* **rabbitMQ** Real-time data is streamed to Atacama using Stomp over Websockets. Thanks to a plugin, rabbitMQ is able to act as a websocket broker for my web app. It is actually very easy to swap rabbitMQ for a native spring-boot solution and I will be experimenting with scalability at some point to see which is the best option.
* **the-turbine** Using spring-boot provided bespoke rest APIs. This is for control only and is not used for data at the moment, although as explained above it is easy for me to make it the sole point of contact for Atacama if I so wish.

## How do I use it?

The easiest way to get it up and running is to clone the repo and then build it. Make sure you have git, node, bower and grunt-cli installed then run something like the following...

```bash
git clone https://github.com/the-james-burton//atacama/atacama.git atacama
cd atacama
npm install
bower install
grunt serve
```

Then browse to http://localhost:9000 and you should see the app.

## What is it build on?

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular) version 0.12.1. This gives me a number of core angular-js components, as well as bootstrap and sass. In addition to those, I have found a number of very helpful open-source projects that deserve a special mention...

* **angular-moment** Easy use of moment-js from within angular-js.
* **angular-nvd3** Does great charts really easily.
* **angular-gridster** A fantastic dynamic dashboard.
* **AngularStompDK** Very nice stomp integration for angular-js.
* **elasticsearch** The factory elasticsearch javascript client.
* **lodash** An awesome functional programming library for javascript.
* **restangular** An alternative REST client for angular-js.
* **stomp-websocket** The defacto stomp over websockets implementation for javascript.

## What is already done?

* **angular service separation** There is reasonable separation of functionality into service classes. This will continue and be strengthened as I continue developing.
* **tests for services** The angular services are tested via Jasmine and Karma.

## What is going to be done soon?

* **tests for controllers** I will try and ensure that more of the code is tested, particularly the angular controllers.
* **more refactoring** I tend to deliver early, let code evolve and refactor later as patterns emerge. This works well when trying new technologies, which I am doing all the time in the project.
* **styling, logo and tidy up** The UI is pretty rough at the moment with very little custom formatting. Most of what you see is the default look of a yeoman app with bootstrap and sass. I want to do some unique styling, largely as a way to get familiar with CSS, SASS and bootstrap.

## What is going to be done in the long term?

* **DevOps** When functionally complete and stable, I want to ensure that this project is easily deployable into nginx, perhaps wrapped in a docker container and scaled via OpenShift. I would also like to look at a CI/CD pipeline that fabric8 could prvovide. This is a chunky piece of work and is likely to be combined into one effort alongside my associated *turbine* project.

## What is unlikely to be done?

* **angular2** Typescript and various other things in angular2 look awesome, but this project is going to stay as angular-js. When I do decide to make the jump to angular2 it will be when that it is a little more mature. I will also create a brand new project instead of refactoring this one. For now, I want to concentrate on angular-js and get better at it.
* **gulp** Grunt is fine and I don't mind the declarative approach over coded streams. Having said that, gulp does look cool but I want to concentrate on other things just now.
* **alternative scaffolding** Yeoman has and is working very well for me. In theory I should be able to easily migrate into another scaffold tool in the future if I want to, but it is not the priority just now.
* **foundation** So I have bootstrap just now from Yeoman. That will do just fine for now.

## Build & development

Run `grunt` for building, `grunt test` to run the tests and `grunt serve` for preview.
