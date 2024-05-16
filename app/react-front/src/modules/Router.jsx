import React, { useEffect, useState } from 'react'
import { ThemeProvider } from '@material-tailwind/react'
import { createBrowserRouter, RouterProvider, Navigate, useLoaderData } from "react-router-dom"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSpring } from '@react-spring/web'
import { HelmetProvider, Helmet } from 'react-helmet-async'

import Index from '../components/Index.jsx'
import Home from '../components/Home'
import Loading from '../components/Loading'
import Overview from '../components/Overview'
import { theme } from '../theme'
import Error404 from '../404'

import { pullMarkdown, pullText } from '../apis/markdown.js'

export default function ({ language, defaultlanguage, defaultDarkModel, data, ...left }) {

  const queryClient = new QueryClient()

  const Apps = language.map(({ lang, ...props }) => ({
    path: `${lang}`,
    element: <Home lang={lang} data={data[lang].snapshots} getPeer={data[lang].getPeer} defaultDarkModel={defaultDarkModel} {...props} {...left} />,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: "docs",
        element: <Redirect navKey={'doc'} defaultPath={`Overview/`} />
      },
      {
        path: "docs/Overview",
        element: <Overview />
      },
      {
        path: "404.html",
        element: <WithHelmet lang={lang}> <Error404 /> </WithHelmet>
      },
      ...expand(lang, data[lang].snapshots, queryClient)
    ],
  }))

  const router = createBrowserRouter([
    {
      errorElement: <Redirect navKey={'404'} defaultPath={`${localStorage.getItem('lang') ?? defaultlanguage}/404.html`} />,
      children: [
        {
          path: "/",
          element: <Redirect navKey={'lang'} defaultPath={`${localStorage.getItem('lang') ?? defaultlanguage}/`} />,
        },
        ...Apps
      ]
    }
  ]);

  return () => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  )
}



function clearPathname(url) {
  let pathname = url.pathname;
  const len = pathname.length;
  if (pathname[len - 1] == '/') {
    pathname = pathname.substring(0, len - 1);
  }
  return pathname;
}

function expand(lang, data, queryClient) {
  let tmp = [{
    path: "changelog",
    loader: async ({ request }) => {
      const url = new URL(request.url)
      return clearPathname(url);
    },
    element: <DynamicImportMarkdownComponent lang={lang} queryClient={queryClient} center={true} />
  }];
  data.map(({ title, tags }) => {
    const splitTitle = title.replaceAll(' ', '-');
    const splitTag = tags.join('/');
    const path = `docs/${splitTag}/${splitTitle}`
    tmp = [...tmp, {
      path,
      loader: async ({ request }) => {
        const url = new URL(request.url)
        return clearPathname(url);
      },
      element: <DynamicImportMarkdownComponent lang={lang} queryClient={queryClient} />
    }]
  })
  return tmp;
}

const w = window.innerWidth * 2;
const r = Math.round((Math.atan2(window.innerHeight, window.innerWidth) * 180) / Math.PI);
//  const h = Math.round(window.innerHeight * (window.innerWidth / w) + window.innerWidth * (window.innerHeight / w));
const h = window.innerHeight * 2;
const xdelta = w - window.innerWidth;
const ydelta = h - window.innerHeight;


const Redirect = ({ navKey, defaultPath }) => {
  return <Navigate replace to={defaultPath} />
}

function DynamicImportComponent({ refresh, lang, tasks, pure, moduleInit, moduleIdx, hotDataInit, hotDataIdx, center, ...props }) {
  const [module, setModule] = useState(moduleInit);
  const [hotData, setHotData] = useState(hotDataInit);
  const [siteTitle, siteDomainName] = [localStorage.getItem(`${lang}/siteTitle`), decodeURI(window.location.href)];
  const tmp = refresh.split('/');
  const docTitle = decodeURIComponent(tmp[tmp.length - 1]);
  let siteDescription = lang == 'en' ? `${docTitle.replaceAll('-', ' ')}` : docTitle;
  siteDescription = (siteDescription[0] <= 'z' && siteDescription >= 'a') ? siteDescription[0].toUpperCase() + siteDescription.slice(1) : siteDescription;
  let Component = null;
  if (module) {
    Component = module.default;
  }

  const [spring, api] = useSpring(() => ({
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    rotate: 'none',
    display: 'flex'
  }))

  useEffect(() => {
    if (module && hotData) {
      api.start({
        from: { x: -xdelta / 2, y: -ydelta / 2, width: w, height: h, rotate: window.innerWidth >= 800 ? `-${r}deg` : '0deg' },
        to: [
          { y: window.innerWidth >= 800 ? -ydelta - window.innerHeight : -ydelta, x: -xdelta - window.innerWidth },
          { display: 'none' }
        ],
        config: {
          duration: window.innerWidth >= 800 ? 2000 : 1000,
        },
      })
    }
  }, [module, hotData])


  return (
    <>
      <Loading
        lang={lang}
        pure={pure}
        moduleHandler={module ? null : setModule}
        hotDataHandler={setHotData}
        tasks={tasks}
        moduleIdx={moduleIdx}
        hotDataIdx={hotDataIdx}
        spring={spring}
        center={center}
      />
      {(Component && hotData) &&
        <HelmetProvider>
          <Helmet>
            <title> {`${siteDescription} - ${siteTitle}`} </title>
            <meta name="description" content={siteDescription} />
            <meta property="og:site_name" content={siteTitle} />
            <meta property="og:title" content={`${siteDescription} - ${siteTitle}`} />
            <meta property="og:description" content={siteDescription} />
            <meta property="og:url" content={siteDomainName} />
          </Helmet>

          <Component data={hotData} {...props} />
        </HelmetProvider>}
    </>
  )
}


function DynamicImportMarkdownComponent({ lang, queryClient, center }) {
  const pathname = useLoaderData();

  return (
    <DynamicImportComponent
      key={pathname}
      lang={lang}
      refresh={pathname}
      tasks={[
        { title: 'Load necessary components', do: pullMarkdown(queryClient) },
        { title: 'Pulling the content', do: pullText(queryClient, pathname) },
      ]}
      pure={true}
      moduleInit={null}
      hotDataIdx={1}
      hotDataInit={null}
      moduleIdx={0}
      center={center}
    />
  )
}

function WithHelmet({ lang, children }) {
  const [siteTitle, siteDomainName] = [localStorage.getItem(`${lang}/siteTitle`), decodeURI(window.location.href)];
  const siteDescription = lang == 'en' ? '404, Not Found' : '404, 未发现资源';
  
  return (
    <HelmetProvider>
      <Helmet>
        <title> {`${siteDescription} - ${siteTitle}`} </title>
        <meta name="description" content={siteDescription} />
        <meta property="og:site_name" content={siteTitle} />
        <meta property="og:title" content={`${siteDescription} - ${siteTitle}`} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:url" content={siteDomainName} />
      </Helmet>
      {children}
    </HelmetProvider>
  )
}