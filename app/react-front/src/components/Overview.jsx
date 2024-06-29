import { useContext, useState } from 'react';
import { Typography, Button, IconButton, Collapse } from '@material-tailwind/react'
import { Link } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { HelmetProvider, Helmet } from 'react-helmet-async'
import { create } from 'zustand';

import { ModelContext } from '../context/Context'

export default function () {
  const { thumb, setThumb, useEffects } = useStore(state => ({ ...state }));
  const [
    lang, data, email, codeRepository,
    latestPath,
    siteTitle, siteDomainName, siteDescription,
    spring
  ] = useEffects();

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
      <animated.div style={{ ...spring }} className="relative self-center flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 dark:bg-black py-8 lg:py-12">
        <img src="/imgs/beams.jpg" alt="" className="fixed dark:invert left-[90%] top-48 max-w-none -translate-x-2/3 -translate-y-1/2" width="1308" />
        <div className="relative flex w-full top-[30px] lg:pl-[350px] lg:pr-[10px]  desktop:px-[400px]">
          <div className="relative w-full  bg-transparent py-12 md:mx-auto md:max-w-3xl lg:max-w-4xl lg:pb-28 lg:pt-16">
            <div className=" relative px-2 lg:px-0  items-center 2xl:items-start flex w-full flex-col gap-10 pt-[80px] lg:pt-[40px] dark:text-white">
              {
                lang == 'en' ?
                  <>
                    <Typography variant="h1"> Overview </Typography>
                    <Typography variant="lead" className="font-serif"> Welcome to the Wyther's docs site! </Typography>
                    <div className="flex  flex-col 2xl:flex-row w-full flex-wrap gap-x-6  gap-y-8  items-center 2xl:items-start">
                      <Link to={latestPath} className="flex flex-col p-4 bg-gray-200 hover:bg-gradient-y-to-r-60 dark:bg-gray-900 hover:border-none rounded-lg border-white gap-2 mini:w-[400px] dark:hover:bg-gradient-b-to-g-60">
                        <Typography variant="h4" className="font-bold"> Getting started </Typography>
                        <Typography variant="paragraph"> Try to read a latest article about c++, golang, or javascript on Wyther's docs site.  </Typography>
                        <Button variant="outlined" ripple={false} className="px-2 self-start text-inherit border-black dark:border-white"> Let's go </Button>
                      </Link>

                      <div className="flex flex-col bg-gray-200 hover:bg-gradient-y-to-r-60 dark:bg-gray-900 p-4 rounded-lg border-white gap-2 mini:w-[400px] dark:hover:bg-gradient-b-to-g-60 opacity-60">
                        <Typography variant="h4" className="font-bold"> Subscribe & buy me a coffee </Typography>
                        <Typography variant="paragraph" > Get my new posts directly to your inbox and make me power up.</Typography>
                        <Button variant="outlined" disabled={true} ripple={false} className="px-2 self-start text-inherit border-black dark:border-white"> Coming soon </Button>
                      </div>

                      <a href={codeRepository} target="_blank" className="flex flex-col p-4 bg-gray-200 hover:bg-gradient-y-to-r-60 dark:bg-gray-900 hover:border-none rounded-lg border-white gap-2 mini:w-[400px] dark:hover:bg-gradient-b-to-g-60">
                        <Typography variant="h4" className="font-bold"> Example code </Typography>
                        <Typography variant="paragraph"> Want to see any example code in my articles? don't worry, that's all in one github repository.</Typography>
                        <Button variant="outlined" ripple={false} className="px-2 self-start text-inherit border-black dark:border-white"> check out </Button>
                      </a>

                    </div>

                    <div className="flex flex-col gap-1">
                      <Typography variant="h6"> How to contact me? </Typography>
                      <Typography variant="small">
                        There is a place where I can explore new ideas, experiment with different techniques, and muse on best practices.
                        If you're interested in my thoughts on something or want to provide feedback. please make email to
                        <span className="text-red-400 dark:text-blue-400"> {email} </span>
                      </Typography>
                    </div>

                    <div className="flex flex-col gap-2 items-center lg:items-start">
                      <Typography variant="h6" className="opacity-40"> Found fun here? </Typography>
                      <div className="flex gap-5">
                        <IconButton disabled={thumb} className={`${thumb == 'up' ? 'border-red-400 dark:border-blue-400' : 'border-black dark:border-white'} !border-[1px] opacity-60 hover:opacity-100`}
                          onClick={() => setThumb('up')}
                        >
                          <HandThumbUpIcon
                            strokeWidth={1}
                            className={`h-6 w-6 ${thumb == 'up' && 'stroke-red-500 dark:stroke-blue-500'}`}
                          />
                        </IconButton>
                        <IconButton disabled={thumb} className={`${thumb == 'down' ? 'border-red-400 dark:border-blue-400' : 'border-black dark:border-white'} !border-[1px] opacity-60 hover:opacity-100`}
                          onClick={() => setThumb('down')}
                        >
                          <HandThumbDownIcon
                            strokeWidth={1}
                            className={`h-6 w-6 ${thumb == 'down' && 'stroke-red-500 dark:stroke-blue-500'}`}
                          />
                        </IconButton>
                      </div>
                      <Collapse open={thumb ? true : false}>
                        {thumb == 'up' && <Typography variant="small" className="font-serif"> Wyther: Thanks for your thumb-up, I appreciate it!😘 </Typography>}
                        {thumb === 'down' && <Typography variant="small" className="font-serif"> Wyther: Ok, I accept it.😞 </Typography>}
                      </Collapse>
                    </div>
                  </> :
                  <>
                    <Typography variant="h1" className={H1}> 总览 </Typography>
                    <Typography variant="lead" className={H2}> 欢迎来到Wyther的博客网站！ </Typography>
                    <div className="flex  flex-col 2xl:flex-row w-full flex-wrap gap-x-6  gap-y-8  items-center 2xl:items-start">
                      <Link to={latestPath} className="flex flex-col p-4 bg-gray-200 hover:bg-gradient-y-to-r-60 dark:bg-gray-900 hover:border-none rounded-lg border-white gap-2 mini:w-[400px] dark:hover:bg-gradient-b-to-g-60">
                        <Typography variant="h4" className={H3}> 导引 </Typography>
                        <Typography variant="paragraph" className={base}> 尝试阅读wyther的有关c++、golang或javascript的最新文章。 </Typography>
                        <Button variant="outlined" ripple={false} className={`p-1 self-start text-inherit border-black dark:border-white ${base}`}> 开始 </Button>
                      </Link>

                      <div className="flex flex-col bg-gray-200 hover:bg-gradient-y-to-r-60 dark:bg-gray-900 p-4 rounded-lg border-white gap-2 mini:w-[400px] dark:hover:bg-gradient-b-to-g-60 opacity-60">
                        <Typography variant="h4" className={H3}> 订阅 & 打赏 </Typography>
                        <Typography variant="paragraph" className={base} > 新文章发布将收到邮件提醒，也可以为我加油！ </Typography>
                        <Button variant="outlined" disabled={true} ripple={false} className={`p-1 self-start text-inherit border-black dark:border-white ${base}`}> 即将到来 </Button>
                      </div>

                      <a href={codeRepository} target="_blank" className="flex flex-col p-4 bg-gray-200 hover:bg-gradient-y-to-r-60 dark:bg-gray-900 hover:border-none rounded-lg border-white gap-2 mini:w-[400px] dark:hover:bg-gradient-b-to-g-60">
                        <Typography variant="h4" className={H3}> 代码实例 </Typography>
                        <Typography variant="paragraph" className={base} > 想要查阅文章中列举的代码实例？别担心，它们都被收录在同一个库中。 </Typography>
                        <Button variant="outlined" ripple={false} className={`p-1 self-start text-inherit border-black dark:border-white ${base}`}> 查阅 </Button>
                      </a>

                    </div>

                    <div className="flex flex-col gap-1">
                      <Typography variant="h6" className="text-[20px] lg:text-[30px] font-[400]"> 怎么联系我？ </Typography>
                      <Typography variant="small" className={foot}>
                        这里可以探索新想法、尝试不同技术并思考最佳实践。如果你对某篇文章感兴趣或想提供反馈。请发送电子邮件至
                        <span className="text-red-400 dark:text-blue-400"> {email} </span>
                      </Typography>
                    </div>

                    <div className="flex flex-col gap-2 items-center lg:items-start">
                      <Typography variant="h6" className="text-[20px] lg:text-[30px] font-[400]"> 获得些许新的思考? </Typography>
                      <div className="flex gap-5">
                        <IconButton disabled={thumb} className={`${thumb == 'up' ? 'border-red-400 dark:border-blue-400' : 'border-black dark:border-white'} !border-[1px] opacity-60 hover:opacity-100`}
                          onClick={() => setThumb('up')}
                        >
                          <HandThumbUpIcon
                            strokeWidth={1}
                            className={`h-6 w-6 ${thumb == 'up' && 'stroke-red-500 dark:stroke-blue-500'}`}
                          />
                        </IconButton>
                        <IconButton disabled={thumb} className={`${thumb == 'down' ? 'border-red-400 dark:border-blue-400' : 'border-black dark:border-white'} !border-[1px] opacity-60 hover:opacity-100`}
                          onClick={() => setThumb('down')}
                        >
                          <HandThumbDownIcon
                            strokeWidth={1}
                            className={`h-6 w-6 ${thumb == 'down' && 'stroke-red-500 dark:stroke-blue-500'}`}
                          />
                        </IconButton>
                      </div>
                      <Collapse open={thumb ? true : false}>
                        {thumb == 'up' && <Typography variant="small" className={foot}> Wyther: 谢谢你的点赞。😘 </Typography>}
                        {thumb === 'down' && <Typography variant="small" className={foot}> Wyther: 好吧，我接受！😞 </Typography>}
                      </Collapse>
                    </div>
                  </>
              }
            </div>
          </div>
        </div>
      </animated.div>
    </HelmetProvider>
  )
}

const H1 = 'text-[65px] font-[400]';
const H2 = 'text-[45px] font-[400]';
const H3 = 'text-[35px] font-[400]';
const base = 'text-[16px] font-[400]';
const foot = 'text-[16px] font-[400]';

const useStore = create(set => ({
  thumb: null,
  setThumb: (s) => set({ thumb: s }),

  useEffects: () => {
    const { lang, data, email, codeRepository } = useContext(ModelContext);
    const { title, tags } = data[0];
    const splitTitle = title.replaceAll(' ', '-');
    const joinedTags = tags.join('/');
    const latestPath = `/${lang}/docs/${joinedTags}/${splitTitle}`
    const [siteTitle, siteDomainName] = [sessionStorage.getItem(`${lang}/siteTitle`), decodeURI(window.location.href)];
    const siteDescription = lang == 'en' ? 'Documentation overview for the introduction' : '文档总述';

    const spring = useSpring({
      from: {
        opacity: 0
      },
      to: {
        opacity: 1
      },
      config: {
        duration: 2000
      }
    })

    return [
      lang, data, email, codeRepository,
      latestPath,
      siteTitle, siteDomainName, siteDescription,
      spring
    ]
  }

}));