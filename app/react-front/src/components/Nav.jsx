import { NavLink } from "react-router-dom";
import { Typography, Collapse, ListItem, ListItemSuffix } from "@material-tailwind/react";
import React from "react";
import { ChevronRightIcon, CalendarDaysIcon, TagIcon, ClockIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

import { DocIcon } from "./Icons";

const base = 'navbar relative w-full rounded-lg flex flex-col w-full text-gray-700 dark:text-gray-400 dark:hover:text-black hover:bg-gradient-y-to-r-60 dark:hover:bg-gradient-b-to-g-60 my-1';
const pending = 'relative  w-full rounded-lg flex flex-col w-full bg-gradient-y-to-r-60 text-black dark:bg-gradient-b-to-g-60 dark:text-black my-1';
const active = 'relative w-full rounded-lg flex flex-col w-full bg-gradient-y-to-r-100 text-black dark:bg-gradient-b-to-g-100 dark:text-black my-1';

export default function ({ data, lang, call }) {
  const catalogs = React.useMemo(() => {
    const m = new Map();
    data.map(({ tags, title, date, time, free }, idx) => {
      buildingMap({ m, tags, title, path: `/${lang}/docs`, call, date, lang, time, free, types: tags });
    })
    return m;
  }, [data, lang, call])

  return (
    <ul>
      <li><NavLink key={-1}
        className={({ isActive, isPending }) => {
          return isPending ? pending : isActive ? active : base;
        }}
        onClick={call ? call : () => { }}
        to={`/${lang}/docs/Overview`}>
        <Typography className={`relative ${lang == 'zh' && '!font-[slideyouran] !text-[20px]'} w-full capitalize !line-clamp-1 hover:!line-clamp-none px-[20px] my-[6px]`}> {lang == 'en' ? "Overview" : "总览"} </Typography>
        <Overview date={data[0].date} length={data.length} />
      </NavLink></li>
      <Nav m={catalogs} level={0} />
    </ul>
  )
}

function buildingMap({ m, tags, title, path, call, date, lang, time, free, types }) {
  if (tags.length !== 0) {
    const [t1, ...ts] = tags;
    if (!m.get(t1)) {
      m.set(t1, new Map());
    }
    buildingMap({ m: m.get(t1), tags: ts, title, path: path + '/' + t1, call, date, lang, time, free, types });
  } else {
    const splitTitle = title.replaceAll(' ', '-');
    if (!m.get('base')) {
      m.set('base', [<li><NavLink key={0}
        className={({ isActive, isPending }) => {
          return isPending ? pending : isActive ? active : base;
        }}
        onClick={call ? call : () => { }}
        to={`${path}/${splitTitle}`}>
        <Card title={title} date={date} lang={lang} time={time} types={types} />
      </NavLink></li>]);
    } else {
      m.set('base', [...m.get('base'), <li><NavLink key={m.get('base').length}
        className={({ isActive, isPending }) => {
          return isPending ? pending : isActive ? active : base;
        }}
        onClick={call ? call : () => { }}
        to={`${path}/${splitTitle}`}>
        <Card title={title} date={date} lang={lang} time={time} types={types} />
      </NavLink></li>])
    }
  }
  return m;
}


function Nav({ m, level }) {
  const keys = m.keys();
  let karr = [];
  for (let n = keys.next().value; n;) {
    karr = [...karr, n];
    n = keys.next().value;
  }
  return (
    <ul>
      {m.get('base')}
      {
        karr.map(k => (k !== 'base' && <li key={k} className="w-full">
          <NavItem k={k} m={m} level={level} />
        </li>))
      }
    </ul>
  )
}

function NavItem({ m, k, level }) {
  const [open, setOpen] = React.useState(true);
  let blanks = ["☆"];
  for (let i = 0; i < level; i++) {
    blanks = [...blanks, <span key={i}> ☆ </span>];
  }
  return (
    <ul>
      <li>
        <ListItem onClick={() => setOpen(open => !open)} className={`relative  w-full text-base font-sans font-semibold dark:!text-gray-300 focus:!bg-gray-50 dark:hover:!bg-black dark:focus:!bg-black`}>
          &nbsp;{blanks}
          {k}
          <ListItemSuffix>
            <ChevronRightIcon
              strokeWidth={2.5}
              className={`h-3 w-3 transition-transform lg:block ${open ? 'rotate-90' : ''}`}
            />
          </ListItemSuffix>
        </ListItem>
      </li>
      <li>
        <Collapse open={open}>
          <Nav m={m.get(k)} level={level + 1} />
        </Collapse>
      </li>
    </ul>
  )
}

function Card({ title, date, lang, time, types }) {
  const diff = (new Date().getTime() - date.getTime()) / (1000 * 3600 * 24);
  return (
    <>
      <div className="relative flex w-full flex-row-reverse">
        <Typography className={`relative ${lang == 'zh' && '!font-[slideyouran] !text-[20px]'} w-full navbaritem mx-[20px] my-[6px] capitalize`}> {title} </Typography>
        {
          diff <= 60 &&
          <>
            <div className="absolute w-5 h-5 flex text-black font-serif items-center text-[10px] bg-gradient-y-to-r-100 dark:bg-gradient-b-to-g-100 rounded-full">
              <span className="flex flex-col w-full items-center"> New </span>
            </div>
            <div className="absolute w-5 h-5 animate-slow-ping bg-red-200 dark:bg-blue-500 rounded-full opacity-75" />
          </>
        }
      </div>
      <hr className="opacity-80 dark:opacity-20 gap-3" />
      <div className="flex flex-col mx-[20px] navbartip mt-2 text-black opacity-90">
        <Typography variant="small" className="flex gap-1">
          <TagIcon
            strokeWidth={1}
            className="h-5 w-5"
          />
          <span> {types.join(' / ')} </span>
        </Typography>

        <Typography variant="small" className="flex gap-1">
          <ClockIcon
            strokeWidth={1}
            className="h-5 w-5"
          />
          <span> {time} Min Read </span>
        </Typography>

        <Typography variant="small" className="flex gap-1">
          <CalendarDaysIcon
            strokeWidth={1}
            className="h-5 w-5"
          />
          <span> {format(new Date(date), "PP")} </span>
        </Typography>

        <img className="w-[140px] h-[60px] invert self-end" src="/imgs/logo.png" />
      </div>
    </>
  )
}

function Overview({ date, length }) {
  return (
    <>
      <hr className="opacity-80 dark:opacity-20 gap-3" />
      <div className="flex flex-col mx-[20px] navbartip mt-2 text-black opacity-90">
        <Typography variant="small" className="flex  gap-1">
          <DocIcon />
          <span> All {length} Articles </span>
        </Typography>
        <Typography variant="small" className="flex gap-1">
          <CalendarDaysIcon
            strokeWidth={1}
            className="h-5 w-5"
          />
          <span> {format(new Date(date), "PP")}@Last Updated </span>
        </Typography>
        <img className="w-[140px] h-[60px] invert self-end" src="/imgs/logo.png" />
      </div>
    </>
  )
}