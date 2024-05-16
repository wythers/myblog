import { useContext, useEffect } from 'react'
import { Typography } from "@material-tailwind/react";
import { LinearGradient } from "react-text-gradients"
import { animated, useSpring } from "@react-spring/web";
import { Link } from 'react-router-dom';
import { create } from 'zustand';

import { RightCir } from "./Icons";
import { ModelContext } from '../context/Context';

export default function () {
  const { useEffects } = useStore(state => ({...state}));
  const [darkModel, lang, host, intro, spring, api] = useEffects();

  useEffect(() => {
    api.start({
      from: { opacity: 0 },
      to: { opacity: 1 },
      config: {
        duration: 2000,
      }
    })
  }, [])

  return (
    <animated.div className="relative flex flex-col px-[10%] w-full gap-[40px]" style={{ ...spring }}>
      {
        lang == 'en' ?
          <span className="!text-[30px] md:!tracking-wide md:!leading-[80px] md:!text-5xl lg:w-[800px]  text-gray-700 dark:text-gray-200/90">
            Hello from {darkModel % 2 ? <LinearGradient gradient={['to right', 'blue, green']}> {host} </LinearGradient> : <LinearGradient gradient={['to right', 'red, yellow']}> {host} </LinearGradient>}
            {', '}{intro}
          </span> :
          <Typography variant="h1" className="!font-[slideyouran] !font-[400] text-[54px] !leading-loose lg:w-[800px]  text-gray-700 dark:text-gray-200/90">
            {darkModel % 2 ? <LinearGradient gradient={['to right', 'blue, green']}> 你好！ </LinearGradient> : <LinearGradient gradient={['to right', 'red, yellow']}> 你好！ </LinearGradient>}
            {intro}
          </Typography>
      }
      <Link to={`/${lang}/docs/Overview/`} className="flex hover:border-red-500 dark:hover:border-blue-500 focus:outline-none p-3 items-center justify-between w-[150px] border-[1px] rounded-lg text-gray-800 dark:text-white  border-gray-700 dark:border-white">
        {
          lang == 'en' ?
            <span> Get Reading </span> :
            <span className="!font-[slideyouran] text-[20px]"> 开始阅读 </span>
        }
        <RightCir />
      </Link>
    </animated.div>
  )
}

const useStore = create(set => ({
  useEffects: () => {
    const { darkModel, lang, host, intro } = useContext(ModelContext);
    const [spring, api] = useSpring(() => ({
      opacity: 0,
    }));
  
    useEffect(() => {
      api.start({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: {
          duration: 2000,
        }
      })
    }, [])
    
    return [darkModel, lang, host, intro, spring, api]
  }
}));