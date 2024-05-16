import { Drawer, IconButton } from '@material-tailwind/react';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { create } from 'zustand';

import { ModelContext } from '../context/Context';
import Switcher from './Switcher';
import Translator from './Translator';
import Button from './Button';
import Nav from './Nav';
import DocSearch from './DocSearch';
import { HomeIcon, DocIcon, BashIcon, GithubIcon, ZhihuIcon } from "./Icons";

export default function () {
  const { useEffects } = useStore(state => ({ ...state }));
  const [
    drawer,
    closeDrawer,
    darkModel,
    handleDarkModel,
    lang,
    to,
    data,
    getPeer,
    github,
    zhihu,
    nav, atHome, atDocs, atChangelog, peerPath
  ] = useEffects();

  return (
    <Drawer className="flex flex-col bg-gray-50 dark:bg-black  justify-between  pt-6 px-1" open={drawer} placement="right" onClose={closeDrawer}>
      <div className="flex flex-col w-full gap-4">
        <div className="flex flex-row w-full items-center  justify-between">
          <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
          <div className="flex gap-1">
            <Translator handleTranslate={() => {
              closeDrawer();
              localStorage.setItem('lang', to);
              if (lang == 'en' && sessionStorage.getItem('font') != 'done') {
                window.location.replace(peerPath);
                return;
              }
              nav(peerPath);
            }} />
            <Switcher left="light" right="dark" cur={darkModel} handleModel={handleDarkModel} />
          </div>
        </div>
        <div className="flex flex-row w-full items-center gap-2 px-2">
          <Button tooltip={lang == 'en' ? 'home' : '首页'} isfocused={atHome} type="icon" tryfocus={() => { closeDrawer(); nav(`/${lang}/`) }}>
            <HomeIcon />
          </Button>
          <Button tooltip={lang == 'en' ? 'docs' : '目录'} isfocused={atDocs} type="icon" tryfocus={() => { closeDrawer(); nav(`/${lang}/docs/Overview/`) }} >
            <DocIcon />
          </Button>
          <Button tooltip={lang == 'en' ? 'change log' : '更新记录'} isfocused={atChangelog} type="icon" tryfocus={() => { closeDrawer(); nav(`/${lang}/changelog/`) }} >
            <BashIcon />
          </Button>
        </div>
      </div>

      <div className="relative flex flex-col border-y-2 border-gray-200 dark:border-gray-900 grow mt-4 pt-4 overflow-y-scroll overflow-x-hidden scrollbar-hide gap-2 px-2">
        <DocSearch mobile={true} />
        <Nav data={data} lang={lang} call={closeDrawer} />
      </div>

      <div className="flex flex-row gap-2 px-2 items-center bg-inherit w-full h-[60px]">
        <Button tooltip={'github'} link={true} isfocused={false} type="icon" tryfocus={() => { window.open(github) }} >
          <GithubIcon />
        </Button>
        <Button tooltip={lang == 'en' ? 'zhihu' : '知乎'} link={true} isfocused={false} type="icon" tryfocus={() => { window.open(zhihu) }} >
          <ZhihuIcon />
        </Button>
      </div>
    </Drawer>
  )
}

const useStore = create(set => ({
  useEffects: () => {
    const { drawer, closeDrawer, darkModel, handleDarkModel, lang, to, data, getPeer, github, zhihu } = useContext(ModelContext);
    const nav = useNavigate();
    const location = useLocation();
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
      drawer,
      closeDrawer,
      darkModel,
      handleDarkModel,
      lang,
      to,
      data,
      getPeer,
      github,
      zhihu,
      nav,
      location.pathname == `/${lang}/` ||
      location.pathname == `/${lang}`,
      location.pathname.startsWith(`/${lang}/docs`),
      location.pathname == `/${lang}/changelog` ||
      location.pathname == `/${lang}/changelog/`,
      splited.join('/')
    ]
  }
}));
