import ReactDOM from 'react-dom/client'
import React, { useEffect, useMemo, useState } from 'react'
import { useSpring } from "@react-spring/web";
import { HelmetProvider, Helmet } from 'react-helmet-async';

import './index.css'
import { pullRouter, pullSnapshots, pullfont } from "./apis/main.js";
import Loading from "./components/Loading.jsx";

function Main({ lang, ...props }) {
  const { defaultDarkModel, defaultlanguage } = props;
  const [module, setModule] = useState(null);
  const [hotData, setHotData] = useState(null);
  const [ok, setOk] = useState(false);

  const Component = useMemo(() => {
    if (module && hotData) {
      const building = module.default;
      return building({ ...props, data: hotData });
    }
    return null;
  }, [module, hotData])

  const [spring, api] = useSpring(() => ({
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    rotate: 'none',
    background: `${defaultDarkModel ? 'black' : 'white'}`,
    display: 'flex'
  }))
  useEffect(() => {
    if (module && hotData) {
      api.start({
        from: { x: -xdelta / 2, y: -ydelta / 2, width: w, height: h, rotate: window.innerWidth >= 800 ? `-${r}deg` : '0deg', background: `${defaultDarkModel ? 'black' : 'rgb(248 250 252)'}` },
        to: [
          { y: window.innerWidth >= 800 ? -ydelta - window.innerHeight : -ydelta, x: -xdelta - window.innerWidth },
          { display: 'none' }
        ],
        config: {
          duration: window.innerWidth >= 800 ? 1000 : 800,
        },
        onStart: () => setOk(true)
      })
    }
  }, [module, hotData])


  return (
    <>
      <Loading
        lang={lang}
        moduleHandler={setModule}
        hotDataHandler={setHotData}
        tasks={[
          { title: 'Initialize route context', do: pullRouter() },
          { title: 'Fetch meta data', do: pullSnapshots() },
          { title: 'Sync all necessary font files', do: pullfont(localStorage.getItem('lang') ?? defaultlanguage) },
        ]}
        moduleIdx={0}
        hotDataIdx={1}
        spring={spring}
      />
      {ok && <Component />}
    </>
  )
}

export default function ({ defaultThemeModel, ...props }) {
  const themeHistory = localStorage.getItem('theme');
  const langHistory = localStorage.getItem('lang');
  const theme = themeHistory ? themeHistory : defaultThemeModel;
  const lang = langHistory ? langHistory : props.defaultlanguage;

  localStorage.setItem('en/siteTitle', `${props.language[0].host}'s Blog`);
  localStorage.setItem('zh/siteTitle', `${props.language[1].host}的博客`);
  localStorage.setItem('en/siteDescription', `${props.language[0].host}'s blog to record interesting thoughts`);
  localStorage.setItem('zh/siteDescription', `${props.language[0].host}的博客为记录有趣的想法`);

  const defaultDarkModel = theme === 'dark';
  if (defaultDarkModel) {
    const r = document.querySelector("html");
    r.classList.add('dark');
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <HelmetProvider>
        <Helmet>
          <meta property="og:image" content={`${window.location.origin}/imgs/favicon.png`} />
          <meta property="og:image:width" content="250" />
          <meta property="og:image:height" content="280" />
          <meta property="og:type" content="website" />
        </Helmet>

        <Main
          {...props}
          lang={lang}
          defaultDarkModel={defaultDarkModel}
        />
      </HelmetProvider>
    </React.StrictMode>
  );
}

const w = window.innerWidth * 2;
const r = Math.round((Math.atan2(window.innerHeight, window.innerWidth) * 180) / Math.PI);
//  const h = Math.round(window.innerHeight * (window.innerWidth / w) + window.innerWidth * (window.innerHeight / w));
const h = window.innerHeight * 2
const xdelta = w - window.innerWidth
const ydelta = h - window.innerHeight;
