import { useContext, useEffect } from 'react'
import { Typography } from "@material-tailwind/react";
import { LinearGradient } from "react-text-gradients"
import { animated, useSpring } from "@react-spring/web";
import { create } from 'zustand';

import { Green } from "./Planets";
import { ModelContext } from '../context/Context';

export default function () {
  const { useEffects } = useStore();
  const [darkModel, lang, about, spring, api] = useEffects();

  return (
    <animated.div className="relative flex flex-col px-[10%] w-full gap-[20px]" style={{ ...spring }}>
      <Green />
      {
        lang == 'en' ?
          <span className="!text-[25px] md:!tracking-wide md:!leading-[80px] md:!text-3xl lg:w-[80%] 2xl:w-[40%] capitalize z-10">
            {darkModel % 2 ? <LinearGradient gradient={['to right', '#569CFF, #AAFFF0']}> about me? </LinearGradient> : <LinearGradient gradient={['to right', '#ff6d6d, #fff59a']}> about me? </LinearGradient>}
            <span> &#128525; </span>
          </span> :
          <Typography variant="h3" color="gray" className="!font-[slideyouran] !font-[400] text-[40px] leading-relaxed lg:w-[80%] 2xl:w-[40%] z-10">
            {darkModel % 2 ? <LinearGradient gradient={['to right', '#569CFF, #AAFFF0']}> 关于我？ </LinearGradient> : <LinearGradient gradient={['to right', '#ff6d6d, #fff59a']}> 关于我？ </LinearGradient>}
            <span className="not-italic text-[30px]"> &#128525; </span>
          </Typography>
      }
      {
        lang == 'en' ?
          <span variant="h4" className="font-serif !font-[400] leading-relaxed text-[18px] md:!tracking-wide md:!leading-[40px] md:text-2xl lg:w-[700px] z-10 text-gray-700 dark:text-gray-200">
            {about}
          </span> :
          <Typography variant="h4" className="!font-[slideyouran] !font-[400] text-[28px] leading-[2] lg:w-[700px] z-10 text-gray-700 dark:text-gray-200">
            {about}
          </Typography>
      }
    </animated.div>
  )
}

const useStore = create(set => ({
  useEffects: () => {
    const { darkModel, lang, about } = useContext(ModelContext);
    const [spring, api] = useSpring(() => ({
      opacity: 0,
    }));
  
    useEffect(() => {
      api.start({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: {
          duration: 3000,
        }
      })
    }, []);

    return [darkModel, lang, about, spring, api];
  }
}))