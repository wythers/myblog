import { useContext } from 'react'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import { create } from 'zustand'

import { ModelContext } from '../context/Context'
import { Yellow, Red } from './Planets'
import Intro from './Intro'
import About from './About'

export default function () {
  const { useEffects } = useStore(state => ({ ...state }));
  const [lang, siteTitle, siteDescription, siteDomainName] = useEffects();

  return (
    <HelmetProvider>
      <Helmet>
        <title> {`${siteTitle} - ${lang == 'en' ? 'Designed and built to record interesting thoughts' : '设计和创建为记录有趣的想法'}`} </title>
        <meta name="description" content={siteDescription} />
        <meta property="og:site_name" content={siteTitle} />
        <meta property="og:title" content={`${siteTitle} - ${lang == 'en' ? 'designed and built to record interesting thoughts' : '设计和创建为记录有趣的想法'}`} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:url" content={siteDomainName} />
      </Helmet>

      <Red />
      <Yellow />
      <Intro />
      <About />
    </HelmetProvider>
  )
}

const useStore = create(set => ({
  useEffects: () => {
    const { lang } = useContext(ModelContext);
    return [lang, localStorage.getItem(`${lang}/siteTitle`), localStorage.getItem(`${lang}/siteDescription`), window.location.href];
  }
}));