import { create } from "zustand";
import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { useGesture } from "react-use-gesture";
import { IconButton } from "@material-tailwind/react";

import { LangIcon, TransIcon } from "./Icons";

export default function (props) {
  return (
    <Translator {...props}>
      <LangIcon />
    </Translator>
  )
}

function Translator({ handleTranslate, children }) {
  const useStore = React.useMemo(newTranslatorStore, []);
  const { spring } = useStore(state => ({ ...state }));
  const { s1, bind } = spring(handleTranslate);

  return (
    <div className="flex items-center relative focus:!outline-none">
      <animated.div className={`flex items-center relative  !bg-gray-200 dark:!bg-gray-800 rounded-lg  px-[2px] py-[3px] w-[90px] focus:!outline-none`}>
        <animated.div className={`h-[40px] bg-white dark:bg-black rounded-lg relative focus:outline-none`} style={s1} />
      </animated.div>
      <IconButton tabIndex={-1} ripple={false} className={`focus:!outline-none pointer-events-none !bg-transparent hover:!bg-transparent !absolute left-[4px]`}>
        {children}
      </IconButton>
      <button className={`focus:!outline-none !bg-transparent hover:!bg-transparent  h-full !absolute left-[55px]`} {...bind()}>
        <TransIcon />
      </button>
    </div>
  )
}

const newTranslatorStore = () => create((set) => ({
  spring: (handleDarkModel) => {
    const [s1, api] = useSpring(() => ({
      width: '50%',
      x: 0
    }));

    const bind = useGesture({
      onMouseEnter: () => api.start({ width: '60%' }),
      onMouseLeave: () => api.start({ width: '50%' }),
      onPointerDown: () => {
        api.start({ to: [{ width: '50%', x: 43, position: 'relative' }, { x: 0 }] })
        handleDarkModel();
      }
    })

    return { bind, s1 };
  },
}));