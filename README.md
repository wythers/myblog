# Myblog

![Wyther's Blog home page](myblogHomePage.png)  

Myblog was designed for you if you want to create modern Web Blog. Just a small bit about it:  

- **Responsive Design**: The web app created by `myblog` that look good on all devices! and automatically adjust for different screen sizes and viewports.  

- **SPA**: Yes, Building with Myblog will produce an SPA web blog, which means leaving rendering to the visitor and requiring fewer server resources. Taking [Wyther's Blog](wytherblog.top) as an example, the annual cloud server bill is about $15.

- **Microservice-based** On the backend, for example, web and application services are independent, which means migration can take a few minutes depending on the cloud provider's price.

- **Writing Only With Markdown** No HTML, No CSS, NO static page, just writing your post ONLY with Markdown!!!  

There's a lot more to be had! Give it a try and find out.  

## Getting Started

With three config files:  

1. [app/react-front/myblog.config.js](app/react-front/myblog.config.js)

2. [appserver/nginx.conf.template](appserver/nginx.conf.template)  

3. [docker-compose.yml](docker-compose.yml)

Fill out the files, as required in the comments, with your blog information.  

## Building and Host

```bash
$ docker compose up -d
```  

## Author

- Wyther Yang([wytherblog.top](wytherblog.top))

Wyther will regularly share some interesting thoughts and excellent designs on [Wyther's Blog](wytherblog.top).



