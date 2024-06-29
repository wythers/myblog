import React, { useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';

import remarkGfm from "remark-gfm";
import gemoji from 'remark-gemoji';
import rehypeRaw from 'rehype-raw';
import { remarkAlert } from 'remark-github-blockquote-alert';
import 'remark-github-blockquote-alert/alert.css'

import Markdown from 'react-markdown';
import { annotate } from 'rough-notation';

import { ModelContext } from '../context/Context';
import CodeBlock from '../components/CodeBlock';
import { CodeBlock as Code, dracula, github } from "react-code-blocks";

export default function ({ data }) {
  const { darkModel, lang } = useContext(ModelContext);
  const { pathname, atDocs } = isAtDocs(lang);
  const { markdown, titles } = useMemo(() => preprocess(data, darkModel, lang, pathname), [data, darkModel, lang]);
  React.useEffect(() => {
    const mock = titles.current;

    const dark = darkModel % 2;
    const doc = document.getElementById("on this doc");
    let handlers = [];
    let elements = [];
    let sig = [];
    let history = -1;
    
    mock.map((m, idx) => {
      const a = document.createElement('a')
      const e = document.getElementById(m);
      e.index = idx;

      !dark ? a.classList.add('text-gray-800') :
        a.classList.add('text-white')

      a.textContent = m;
      a.setAttribute("href", `#${m}`);
      doc.appendChild(a);
      const handler = annotate(a, { type: 'circle', color: !dark ? 'rgb(253 164 175)' : 'rgb(129 212 250)', iterations: 1, multiline: false })
      handlers = [...handlers, handler];
      elements = [...elements, e];
      sig = [...sig, 0];
    })

    let obs = new IntersectionObserver((es, o) => {
      es.forEach(e => {
        if (e.intersectionRatio > 0) {
          sig[e.target.index] = 1;
        } else {
          sig[e.target.index] = 0;
        }
      });

      let show = false;
      for (let i = 0; i < sig.length; i++) {
        if (!show && sig[i] == 1) {
          handlers[i].show();
          show = true;
          history = i;
          continue
        }
        handlers[i].hide();
      }

      
      if (!show && history != -1) {
        handlers[history].show();
      }

    }, { root: null, rootMargin: '0px', threshold: 0 })

    elements.map(e => {
      obs.observe(e);
    });

    return () => {
      obs.disconnect();
      doc.replaceChildren();
    }

  }, [pathname, darkModel, lang])

  const spring = useSpring({
    from: {
      opacity: 0
    },
    to: {
      opacity: 1
    },
    config: {
      duration: 1500
    }
  })

  return (
    <>
      <animated.div style={{ ...spring }} className="relative self-center flex min-h-mkh flex-col justify-center overflow-hidden bg-gray-50 dark:bg-black py-8 lg:py-12">
        <div className="w-full h-[100px]"></div>
        <img src="/imgs/beams.jpg" alt="bg" className="fixed dark:invert left-[90%] top-48 max-w-none -translate-x-2/3 -translate-y-1/2" width="1308" />
        <div className={`relative flex w-full top-[30px] items-center ${atDocs && 'lg:pl-[350px] lg:pr-[10px]'} desktop:px-[400px]`}>
          <main className="relative w-full  bg-transparent px-6 py-12 md:mx-auto md:max-w-3xl lg:max-w-4xl  lg:pb-28 lg:pt-16">
            <article className={`
              prose prose-rose dark:prose-sky markdown dark:prose-invert mx-auto mt-8 lg:prose-xl
              prose-ol:!py-0 prose-ol:!my-0
              prose-li:!py-0 prose-li:!my-0
              prose-pre:!p-0 prose-code:bg-gray-300 dark:prose-code:bg-gray-800 prose-code:rounded
              `}>
              {markdown}
            </article>
          </main>
        </div>
      </animated.div>
    </>
  )
}

function preprocess(data, darkModel, lang, pathname) {
  let titles = { current: [] }
  let files = {}
  const dir = pathname.split('/');

  function blockquote({ className, ...properties }) {
    return <blockquote className={`${className} font-bold`} {...properties} />
  }

  function code({ className, ...properties }) {
    const { children } = properties;
    const match = /language-(\w+)/.exec(className || '')
    let text = String(children);

    if (text[0] !== '@') {
      return <span className="codeblock w-full"><Code
        codeContainerStyle={{width: '100%'}}
        language={match ? match[1] : 'cpp'}
        text={text.replace(/\n$/, '')}
        showLineNumbers={false}
        theme={darkModel % 2 ? dracula : github}
        codeBlock
      /></span>
    }

    let file = 'unkown tab'
    const idx = text.indexOf('\n\n');
    if (idx == -1) {
      throw Error('code block format error.');
    }

    const json = JSON.parse(text.substring(1, idx));
    file = json.tab;
    text = text.substring(idx + 2) + '\n';
    text = text.replace(/\n$/, '');
    files[file] = files[file] ? [files[file][0] + '\n' + text, match ? match[1] : 'cpp'] : [text, match ? match[1] : 'cpp'];

    return json.skipped ?? <CodeBlock files={{ ...files }} InitTab={file} dark={darkModel % 2} />
  }

  function heads() {
    function h1({ className, ...properties }) {
      if (properties.id)
        titles.current = [...titles.current, properties.id]
      if (properties.hello)
        console.log(properties.hello)
      return <h1 className={className} {...properties} />
    }
    function h2({ className, ...properties }) {
      if (properties.id) {
        if (!properties.id.startsWith('footnote')) {
          titles.current = [...titles.current, properties.id]
        } else {
          if (lang == 'zh') {
            return <h2 className={className} {...properties}> 引用 </h2>
          }
        }
      }
      return <h2 className={className} {...properties} />
    }
    function h3({ className, ...properties }) {
      if (properties.id)
        titles.current = [...titles.current, properties.id]
      return <h3 className={className} {...properties} />
    }

    return { h1, h2, h3 };
  }

  
  function img({ src, ...properties }) {
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return <img src={src} {...properties} />
    }

    dir[dir.length-1] = src;
    return <img src={`/raw${dir.join('/')}`} {...properties} />
  }
  

  return {
    markdown:
      <Markdown
        remarkPlugins={[remarkGfm, gemoji, remarkAlert]}
        components={{ code, img, ...heads() }}
        rehypePlugins={[rehypeRaw]}
      >
        {data}
      </Markdown >,
    titles
  }
}

function isAtDocs(lang) {
  const location = useLocation();
  return { pathname: location.pathname, atDocs: location.pathname.startsWith(`/${lang}/docs`) }
}
