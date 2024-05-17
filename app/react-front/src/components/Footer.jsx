import { Typography } from "@material-tailwind/react";
import { LinearGradient } from "react-text-gradients"
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { create } from "zustand";

import { Blue } from "./Planets";
import { ModelContext } from "../context/Context";

export default function () {
  const { useEffects } = useStore(state => ({ ...state }));
  const [darkModel, lang, location, home, ICP, NISM, NISMN] = useEffects();

  return (
    <footer className="opacity-50 md:pr-[40px] flex flex-col-reverse text-black dark:text-white items-end w-full gap-1  h-[150px] bg-transparent p-5 rounded relative z-10 ">
      {home(location, lang) && <Blue />}
      {
        lang == 'en' ?
          <>
            <Typography className={`text-[8px] md:text-footer !font-[550]`}>
              Designed & built by Wyther. Powered by – React, TailwindCSS, Gin & more...
            </Typography>
            <Typography className="text-[8px] md:text-footer !font-[550]">
              Lessons learned building amazing apps and writing beautiful code.
            </Typography>
            {
              NISM &&
              <a href={`http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${NISMN}`} target="_blank" className="flex items-center text-[10px] md:text-footer !font-[550] hover:text-pink-500 dark:hover:text-blue-500">
                <img src="https://imgservices-1252317822.image.myqcloud.com/image/20191223/o5lajshfcw.png" className="w-[18px] h-[18px]" />
                <span> {NISM} </span>
              </a>
            }
            {
              ICP &&
              <a href="https://beian.miit.gov.cn" target="_blank" className="flex items-center text-[10px] md:text-footer !font-[550] hover:text-pink-500 dark:hover:text-blue-500">
                <img src="/imgs/icp.ico" className="w-[18px] h-[18px]" />
                <span> {ICP} </span>
              </a>
            }
          </> :
          <>
            <Typography className={`!font-[slideyouran]  text-[10px] md:text-[18px] !font-[400]`}>
              Wyther's设计和架构，技术支持——React、TailwindCSS、Gin 等
            </Typography>
            <Typography className="!font-[slideyouran]  text-[12px] md:text-[18px]  !font-[400] ">
              构建令人惊叹的应用程序和编写优美的代码
            </Typography>
            {
              NISM &&
              <a href={`http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${NISMN}`} target="_blank" className="flex items-center !font-[400] !text-[18px] !font-[slideyouran] hover:text-pink-500 dark:hover:text-blue-500">
                <img src="https://imgservices-1252317822.image.myqcloud.com/image/20191223/o5lajshfcw.png" className="w-[18px] h-[18px]" />
                <span> {NISM} </span>
              </a>
            }
            {
              ICP &&
              <a href="https://beian.miit.gov.cn" target="_blank" className="flex items-center !font-[400] !text-[18px] !font-[slideyouran] hover:text-pink-500 dark:hover:text-blue-500">
                <img src="/imgs/icp.ico" className="w-[18px] h-[18px]" />
                <span> {ICP} </span>
              </a>
            }
          </>
      }
      <Typography className="!font-[550] text-footer">
        © {new Date().getFullYear()}
        {darkModel % 2 ? <LinearGradient gradient={['to right', 'blue, green']}> Wyther's </LinearGradient> : <LinearGradient gradient={['to right', 'red, yellow']}> Wyther's </LinearGradient>}
      </Typography>
    </footer>
  );
}

const useStore = create(set => ({
  useEffects: () => {
    const { darkModel, lang, ICP, NISM, NISMN } = useContext(ModelContext);
    const location = useLocation();
    function home(location, lang) {
      return location.pathname == `/${lang}/` || location.pathname == `/${lang}`
    }

    return [darkModel, lang, location, home, ICP, NISM, NISMN];
  }
}));