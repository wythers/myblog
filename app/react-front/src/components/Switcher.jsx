import { create } from "zustand";
import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { useGesture } from "react-use-gesture";
import { IconButton } from "@material-tailwind/react";

import { SunIcon, LunaIcon } from "./Icons";

export default function (props) {
  return (
    <Switcher {...props}>
      <SunIcon />
      <LunaIcon />
    </Switcher>
  )
}

function Switcher({ left, right, cur, handleModel, children }) {
  const useStore = React.useMemo(() => newSwitcherStore(left, right, cur), []);
  const { model, spring } = useStore(state => ({ ...state }));
  const { s1, s2, bind } = spring(handleModel);

  return (
    <div className="flex items-center relative focus:outline-none">
      <animated.div className={`flex items-center relative  !bg-gray-200 dark:!bg-gray-800 rounded-lg  px-[2px] py-[3px] w-[90px] focus:outline-none`} style={s1}>
        <animated.div className={`h-[40px] bg-white dark:bg-black rounded-lg relative`} style={s2} />
      </animated.div>
      {children.map((c, i) => (
        !i ? <IconButton tabIndex={-1} key={i} ripple={false} className={`${model == left ? "pointer-events-none" : ""}  focus:outline-none !bg-transparent hover:!bg-transparent !absolute left-[4px]`}
          {...bind()}>
          {c}
        </IconButton> :
          <IconButton tabIndex={-1} key={i} ripple={false} className={`${model == right ? "pointer-events-none" : ""}  focus:outline-none !bg-transparent hover:!bg-transparent !absolute left-[48px]`}
            {...bind()}>
            {c}
          </IconButton>
      ))}
    </div>
  )
}

const newSwitcherStore = (left, right, init) => create((set, get) => ({
  model: init % 2 ? right : left,
  spring: (handleDarkModel) => {
    const s1 = useSpring({
      justifyContent: get().model == left ? 'flex-start' : 'flex-end'
    });

    const [s2, api] = useSpring(() => ({
      width: '50%'
    }));

    const bind = useGesture({
      onMouseEnter: () => api.start({ width: '60%' }),
      onMouseLeave: () => api.start({ width: '50%' }),
      onPointerDown: () => {
        api.start({ from: { width: '100%' }, to: [{ width: '60%' }, { width: '50%' }] })
        get().model == left ? set({ model: right }) : set({ model: left });
        handleDarkModel();
      }
    })

    return { bind, s1, s2 };
  },
}));