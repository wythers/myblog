import { useEffect, useState, useMemo } from "react";
import { useSpring, animated } from "@react-spring/web";
import { Typography, Spinner } from '@material-tailwind/react';
import { HelmetProvider, Helmet } from "react-helmet-async";

import { Canvas } from './Canvas';
import { CheckMarkIcon, WarningIcon, XIcon } from "./Icons";

export default function ({ lang, moduleHandler, hotDataHandler, pure, tasks, moduleIdx, hotDataIdx, spring, center }) {
  const [msgs, setMsgs] = useState([]);
  const [ok, setOk] = useState(true);

  let states = [];
  let els = [];
  let apis = [];
  tasks.map((task, i) => {
    const [done, setDone] = useState(null);
    const [notify, setNotify] = useState({ type: 'info', value: 'loading...' });
    const [spring, api] = useSpring(() => ({
      opacity: 1
    }))
    useEffect(() => {
      task.do(setDone, setMsgs, setNotify);
    }, []);

    if (!moduleHandler && i == moduleIdx) {
      states = [...states, true];
      return;
    }

    states = [...states, done];
    els = [...els, <LoadingNotify key={i} title={task.title} msg={notify} done={done} spring={spring} />]
    apis = [...apis, api]
  })

  const [s1, api1] = useSpring(() => ({
    opacity: 1
  }))
  const [s2, api2] = useSpring(() => ({
    opacity: 1
  }))

  useEffect(() => {
    let flag = false;
    states.map(s => {
      if (!s || s === 'fail') {
        flag = true;
      }
    })

    if (flag)
      return;

    const chain = async function () {
      for (let i = 0; i < apis.length; i++) {
        await new Promise(resolve => apis[i].start({
          from: { opacity: 1 },
          to: { opacity: 0 },
          onResolve: () => resolve(),
          config: {
            duration: 600,
          }
        }))
      }

      await new Promise(resolve => api1.start({
        from: { opacity: 1 },
        to: { opacity: 0 },
        onResolve: () => resolve(),
        config: {
          duration: 600,
        }
      }))

      await new Promise(resolve => api2.start({
        from: { opacity: 1 },
        to: { opacity: 0 },
        onResolve: () => resolve(),
        config: {
          duration: 600,
        }
      }))

      setOk(false);

      if (moduleHandler && states[moduleIdx]) {
        moduleHandler(states[moduleIdx])
      }

      if (hotDataIdx !== -1 && states[hotDataIdx]) {
        hotDataHandler(states[hotDataIdx])
      }
    }
    chain();

  }, states)

  return (
    <HelmetProvider>
      <Helmet>
        <title> {lang == 'en' ? `Loading... - ${localStorage.getItem('en/siteTitle')}` : `加载中... - ${localStorage.getItem('zh/siteTitle')}`} </title>
      </Helmet>
      {
        !pure ?
          <animated.div className="fixed w-full min-h-screen flex flex-row items-center bg-white dark:bg-black z-[99]" style={{ ...spring }} >
            {
              ok &&
              <>
                <LoadingDial msgs={msgs} spring={s1} />
                <div className="relative w-full flex flex-col items-center gap-y-3">
                  <Canvas url="/imgs/moon.jpg" className="w-[300px] lg:w-[350px] h-[300px] lg:h-[350px] filter-none dark:invert z-10  rounded-full" spring={s2} />
                  <div>
                    {els}
                  </div>
                </div>
              </>
            }
          </animated.div> :
          <animated.div className="fixed self-center w-full flex min-h-screen flex-col justify-center overflow-hidden bg-white dark:bg-black z-[20]" style={{ ...spring }} >
            {
              ok &&
              <>
                <LoadingSmallDial msgs={msgs} spring={s1} />
                <div className={`flex flex-col items-center bg-inherit ${!center && 'lg:pl-[350px] lg:pr-[10px]'} desktop:px-[400px]`}>
                  <div className="relative w-full flex flex-col items-center !gap-y-6">
                    <Canvas url="/imgs/moon.jpg" className="w-[250px] h-[250px] filter-none dark:invert z-10  rounded-full" spring={s2} />
                    <div>
                      {els}
                    </div>
                  </div>
                </div>
              </>
            }
          </animated.div>
      }
    </HelmetProvider>
  )
}


function LoadingDial({ msgs, spring }) {
  const theme = localStorage.getItem('theme');
  const [scroll, setScroll] = useState(false);
  return (
    <animated.div
      style={{ ...spring }}
      className={`${theme == 'dark' ? 'graysmallscrollbar' : 'lightsmallscrollbar'} ${!scroll && 'scrollbar-hide'} absolute z-10 flex flex-col-reverse  max-h-[200px] lg:max-h-[300px] p-2 top-0 overflow-y-scroll`}
      onMouseEnter={() => setScroll(true)}
      onMouseLeave={() => setScroll(false)}
    >
      {msgs.toReversed().map((m, idx) => <Msg m={m} key={idx} />)}
    </animated.div>
  )
}

function LoadingSmallDial({ msgs, spring }) {
  const theme = localStorage.getItem('theme');
  const [scroll, setScroll] = useState(false);
  return (
    <animated.div
      style={{ ...spring }}
      className={`${theme == 'dark' ? 'graysmallscrollbar' : 'lightsmallscrollbar'} ${!scroll && 'scrollbar-hide'} absolute z-20 flex flex-col-reverse self-end top-[100px] max-h-[150px] lg:max-h-[300px] p-2 overflow-y-scroll`}
      onMouseEnter={() => setScroll(true)}
      onMouseLeave={() => setScroll(false)}
    >
      {msgs.toReversed().map((m, idx) => <Msg m={m} key={idx} />)}
    </animated.div>
  )
}

function LoadingNotify({ title, msg, done, spring }) {

  const { icon, color } = useMemo(() => {
    let icon;
    let color;
    if (done) {
      switch (done) {
        case 'fail':
          icon = <XIcon />;
          break;
        case 'warning':
          icon = <WarningIcon />;
          break;
        default:
          icon = <CheckMarkIcon />;
      }
    } else {
      icon = <Spinner className="h-6 w-6 p-1" />;
    }

    switch (msg.type) {
      case 'info':
        color = "!text-green-400";
        break;
      case 'warn':
        color = "!text-yellow-400";
        break;
      default:
        color = "!text-red-400";
    }

    return { icon, color };
  }, [msg, done])


  return (
    <animated.div className='flex flex-row  items-center gap-x-1' style={{ ...spring }}>
      <div className="flex flex-row items-start self-start align-top opacity-60">
        {icon}
      </div>
      <div className="flex flex-col self-start">
        <Typography variant="h6" className="font-[20px] font-serif !text-gray-700 !dark:text-gray-100 whitespace-nowrap"> {title} </Typography>
        <Typography variant="small" className={`font-serif flex flex-col whitespace-nowrap ${color}`}> {msg.value} </Typography>
      </div>
    </animated.div>
  )
}

function Msg({ m }) {
  const spring = useSpring({
    from: {
      x: 80,
      opacity: 1
    },
    to: {
      x: 0,
      opacity: 0.6
    },
    config: {
      duration: 200,
    }
  })

  return (
    <animated.div style={spring}>
      <Typography className="font-serif !text-gray-700 !dark:text-gray-100 whitespace-nowrap"> {m} </Typography>
    </animated.div>
  )
}
