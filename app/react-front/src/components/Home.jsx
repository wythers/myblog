import { useEffect, useRef } from 'react'
import { create } from "zustand";
import { Outlet } from 'react-router-dom';
import { useLocation, ScrollRestoration } from 'react-router-dom';

import { ModelContext } from '../context/Context';
import Drawer from './Drawer'
import Menu from './Menu'
import Footer from './Footer';

export default function ({ lang, defaultDarkModel, ...props }) {
  const useStore = useRef(newStore(defaultDarkModel)).current;
  const { darkModel, handleDarkModel, drawer, openDrawer, closeDrawer, useEffects } = useStore(state => ({ ...state }));
  const [location, docs] = useEffects();

  return (
    <ModelContext.Provider value={{ darkModel, handleDarkModel, lang, drawer, closeDrawer, openDrawer, ...props }} >
      <div className={`${!docs(location, lang) && 'flex flex-col justify-between gap-[250px]'} overflow-x-hidden relative w-full items-start bg-gray-50 dark:bg-black min-h-screen`}>
        <Menu />
        <Outlet />
        <Footer />
        <Drawer />
        <ScrollRestoration />
      </div>
    </ModelContext.Provider>
  );
}

const newStore = (defaultDarkModle) => create((set, get) => ({
  darkModel: defaultDarkModle ? 1 : 0,
  handleDarkModel: () => set(state => {
    localStorage.setItem('theme', (state.darkModel + 1) % 2 == 1 ? 'dark' : 'light');
    return { darkModel: state.darkModel + 1 }
  }),

  drawer: false,
  openDrawer: () => {
    document.querySelector("html").classList.add("overflow-hidden");
    set({drawer: true})
  },
  closeDrawer: () => {
    document.querySelector("html").classList.remove("overflow-hidden");
    set({drawer: false});
  },

  useEffects: () => {
    const location = useLocation();

    function docs(location, lang) {
      return location.pathname.startsWith(`/${lang}/docs`) || location.pathname.startsWith(`/${lang}/changelog`)
    }

    useEffect(() => {
      const r = document.querySelector("html");
      get().darkModel % 2 ? r.classList.add('dark', 'grayscrollbar') : r.classList.remove('dark', 'grayscrollbar');
      get().darkModel % 2 ? r.classList.remove('lightscrollbar') : r.classList.add('lightscrollbar');
    }, [get().darkModel]);

    return [location, docs];
  }
}));