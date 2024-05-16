import { create } from "zustand";
import React, { useContext, useEffect, useState } from "react";
import { IconButton } from "@material-tailwind/react";
import { useSpring, animated } from '@react-spring/web';
import { useScroll } from '@use-gesture/react';
import { Link, useLocation, useNavigate } from "react-router-dom";

import DocSearch from "./DocSearch";
import Switcher from "./Switcher";
import Translator from "./Translator";
import Nav from "./Nav";
import { ModelContext } from "../context/Context";
import Button from "./Button";
import { HomeIcon, DocIcon, BashIcon, GithubIcon, ZhihuIcon, Bars3Icon } from "./Icons";

const color = [
  ['transparent', 'rgba(249, 250, 251, 0.9)'],
  ['transparent', 'rgba(0, 0, 0, 0.9)']
]

export default function() {
  const { scroll, scrollx, setScroll, setScrollx, cnt, setCnt, useEffects } = useStore(state => ({ ...state }));
  const [
    nav,
    darkModel, handleDarkModel, lang, data, getPeer, to, openDrawer, github, zhihu,
    s1, s2, s3,
    atHome, atDocs, atChangelog, peerPath
  ] = useEffects();

  return (
    <animated.div className={`fixed w-full h-[100px] z-[50]`} style={s1}>

      <div className="hidden relative lg:flex w-full h-[100px] items-center justify-between px-[20px] lg:px-[50px]">
        <div className="flex gap-3 items-center">
          <Button tooltip={lang == 'en' ? 'home' : '首页'} isfocused={atHome} type="icon" tryfocus={() => { nav(`/${lang}/`) }}>
            <HomeIcon />
          </Button>
          <Button tooltip={lang == 'en' ? 'docs' : '目录'} isfocused={atDocs} type="icon" tryfocus={() => { nav(`/${lang}/docs/Overview/`) }} >
            <DocIcon />
          </Button>
          <Button tooltip={lang == 'en' ? 'change log' : '更新记录'} isfocused={atChangelog} type="icon" tryfocus={() => { nav(`/${lang}/changelog/`) }} >
            <BashIcon />
          </Button>

          <div className="border-r-[1px] h-[20px] mx-[11px] self-center  border-gray-400"></div>

          <Button key={`${cnt}github`} tooltip={'github'} link={true} isfocused={false} type="icon" tryfocus={() => { window.open(github); setCnt() }} >
            <GithubIcon />
          </Button>
          <Button key={`${cnt}zhihu`} tooltip={lang == 'en' ? 'zhihu' : '知乎'} link={true} isfocused={false} type="icon" tryfocus={() => { window.open(zhihu); setCnt() }} >
            <ZhihuIcon />
          </Button>

          <div className="border-r-[1px] h-[20px] mx-[11px] self-center  border-gray-400"></div>

          <Switcher left="light" right="dark" cur={darkModel} handleModel={handleDarkModel} />
          <Translator handleTranslate={
            () => {
              localStorage.setItem('lang', to);
              if (lang == 'en' && sessionStorage.getItem('font') != 'done') {
                window.location.replace(peerPath);
                return;
              }
              nav(peerPath);
            }} />
        </div>
        <Link to={`/${lang}/`}>
          <img className="w-[160px] h-[65px] invert opacity-80 dark:invert-0 cursor-fancy" src="/imgs/logo.png" />
        </Link>
      </div>
      <div className="relative flex lg:hidden gap-3 w-full h-[100px] items-center flex-row-reverse justify-between px-[20px] lg:px-[50px]">
        <IconButton variant="text" onClick={openDrawer}>
          <Bars3Icon />
        </IconButton>
        <Link to={`/${lang}/`}>
          <img className="w-[160px] h-[65px] invert dark:invert-0 cursor-fancy" src="/imgs/logo.png" />
        </Link>
      </div>

      {
        !atHome &&
        <animated.div
          style={{ ...s2 }} className={`${darkModel % 2 ? 'graysmallscrollbar' : 'lightsmallscrollbar'} ${!scrollx && 'scrollbar-hide'} overflow-x-auto overflow-y-hidden flex flex-nowrap gap-10 backdrop-blur-sm relative w-full h-[80px] bg-inherit mx-[5px] lg:mx-[50px]`}
          onMouseEnter={() => setScrollx(true)}
          onMouseLeave={() => setScrollx(false)}
        >
          <DocSearch />
          <div className="relative flex flex-col items-center h-full grow">
            <div id='on this doc' className="relative flex flex-nowrap items-center gap-8 h-full px-[50px] lg:px-[70px] whitespace-nowrap font-serif text-base capitalize" />
          </div>
        </animated.div>
      }

      {
        atDocs &&
        <animated.div
          style={{ ...s3 }} className={`${darkModel % 2 ? 'graysmallscrollbar' : 'lightsmallscrollbar'} ${!scroll && 'scrollbar-hide'} relative hidden border-b-2 rounded-md border-red-200 dark:border-blue-200 lg:flex lg:flex-col w-[300px] lg:w-[330px] h-sideh overflow-y-auto overflow-x-hidden ml-[20px] lg:ml-[50px]`}
          onMouseEnter={() => setScroll(true)}
          onMouseLeave={() => setScroll(false)}
        >
          <Nav data={data} lang={lang} />
        </animated.div>
      }
    </animated.div>
  )
}

const useStore = create((set, get) => {
  return {
    scrollUp: true,
    scrolling: false,
    handleScrollUp: (up) => set({ scrollUp: up, scrolling: true }),

    cnt: 0,
    // TODO: send to analyzing service to track
    setCnt: () => set(state => ({ cnt: state.cnt + 1 })),

    scroll: false,
    scrollx: false,
    setScroll: (s) => set({ scroll: s }),
    setScrollx: (s) => set({ scrollx: s }),

    useEffects: () => {
      const { darkModel, handleDarkModel, lang, data, getPeer, to, openDrawer, github, zhihu } = useContext(ModelContext);
      const location = useLocation();
      const nav = useNavigate()
      const dark = darkModel % 2;

      // animated
      const [s1, api] = useSpring(() => ({ from: { y: -100 }, to: { y: 0, background: 'transparent' }, config: { duration: 1500 } }));
      useScroll(({ xy: [, off], delta: [, y] }) => {
        if (off == 0 && y == 0) {
          api.start({ from: { background: 'transparent' } });
          set({ scrolling: false });
        } else {
          y == 0 ? {} : get().handleScrollUp(y < 0 ? true : false);
        }
      }, { target: window })

      useEffect(() => {
        api.start({
          from: { background: get().scrolling ? color[dark][1] : 'transparent' },
          to: { y: 0 }
        });
      }, [dark])

      useEffect(() => {
        if (get().scrollUp) {
          get().scrolling && api.start({ from: { y: -100, background: color[dark][1] }, to: { y: 0 }, config: { duration: 400 } });
        } else {
          get().scrolling && api.start({ from: { y: -20, background: color[dark][1] }, to: { y: -100 }, config: { duration: 400 } });
        }
      }, [get().scrollUp])

      const s2 = useSpring({
        from: {
          x: -320
        },
        to: {
          x: 0
        },
        config: {
          duration: 1200
        }
      });
      const s3 = useSpring({
        from: {
          x: -320
        },
        to: {
          x: 0
        },
        config: {
          duration: 1200
        }
      });

      // get where
      const splited = location.pathname.replace(lang, to).split('/');
      if (lang == 'zh') {
        const peerTitle = getPeer(decodeURIComponent(splited[splited.length - 1]));
        if (peerTitle) {
          splited[splited.length - 1] = peerTitle.replaceAll(' ', '-');
        }
      } else {
        const peerTitle = getPeer(splited[splited.length - 1].replaceAll('-', ' '));
        if (peerTitle) {
          splited[splited.length - 1] = peerTitle;
        }
      }

      return [
        nav,
        darkModel, handleDarkModel, lang, data, getPeer, to, openDrawer, github, zhihu,
        s1, s2, s3,
        location.pathname == `/${lang}/` ||
        location.pathname == `/${lang}`,
        location.pathname.startsWith(`/${lang}/docs`),
        location.pathname == `/${lang}/changelog` ||
        location.pathname == `/${lang}/changelog/`,
        splited.join('/')
      ];
    }
  }
});