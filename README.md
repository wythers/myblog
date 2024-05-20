# Myblog

![Wyther's Blog home page](myblogHomePage.png)  

Myblog was designed to build a modern Web Blog. Just a small bit about it:  

- **Responsive Design**: The web app created by `myblog` that look good on all devices! and automatically adjust for different screen sizes and viewports.  

- **SPA**: Yes, Building with Myblog will produce an SPA web blog, which means leaving rendering to the frontend and requiring fewer server resources. Taking [Wyther's Blog](https://wytherblog.top) as an example, the annual cloud server bill is about $15.

- **Microservice-based**: On the backend, for example, web and application services are independent, which means you can migrate your web service in just a few minutes if some cloud providers have lower prices.

- **Writing Post Only With Markdown**: No HTML, No CSS, NO static page, just writing your post ONLY with Markdown!!!  

There's a lot more to be had! Give it a try and find out.  

## Getting Started

With three config files:  

1. [app/react-front/myblog.config.js](app/react-front/myblog.config.js)

2. [appserver/nginx.conf.template](appserver/nginx.conf.template)  

3. [docker-compose.yml](docker-compose.yml)

Specialize the files based on your blog information and the requirements listed in the comments.

## Building and Host

```bash
$ docker compose up -d
```  

## Authors

- Wyther Yang([https://wytherblog.top](https://wytherblog.top))

Wyther will regularly share some interesting thoughts and excellent designs on [Wyther's Blog](https://wytherblog.top).



