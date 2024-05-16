import { useContext, useMemo } from 'react'

import { IconButton, Button as TextButton, Tooltip } from "@material-tailwind/react";
import { create } from 'zustand';
import { ModelContext } from '../context/Context';

export default function ({ isfocused, tryfocus, type, tooltip, link, ...passager }) {
  const useStore = useMemo(newStore, []);
  const { isHover, onMouseOver, onMouseOut, onClick, hdr, useEffects } = useStore(state => ({ ...state }));
  const [ darkModel, lang ] = useEffects();

  const Button = type == 'icon' ? IconButton : TextButton;

  return (
    <>
      {
        isfocused ?
          <div tabIndex={-1} className="flex items-center bg-gradient-y-to-r-100 dark:bg-gradient-b-to-g-100 p-[2px] border-none rounded-lg focus:outline-none ">
            {
              darkModel % 2 ?
                <Tooltip content={lang == 'en' ? `At ${tooltip}` : `当前在${tooltip}`} className="text-gray-400 bg-gray-800">
                  <Button
                    tabIndex={-1}
                    className="!bg-none focus:outline-none"
                    {...passager}
                  />
                </Tooltip>
                : <Tooltip content={lang == 'en' ? `At ${tooltip}` : `当前在${tooltip}`}>
                  <Button
                    tabIndex={-1}
                    className="!bg-none focus:outline-none"
                    {...passager}
                  />
                </Tooltip>
            }
          </div> :
          <div tabIndex={-1} className={`${isHover ? 'bg-gradient-y-to-r-100 dark:bg-gradient-b-to-g-100' : '!bg-gray-50 dark:!bg-black'} focus:outline-none flex items-center p-[2px] border-none rounded-lg`} >
            {
              darkModel % 2 ?
                <Tooltip content={hdr(link, tooltip, lang)} className="text-gray-400 bg-gray-800">
                  <Button
                    tabIndex={-1}
                    className="!bg-gray-50 dark:!bg-black focus:outline-none"
                    {...passager}
                    onMouseOver={() => onMouseOver(isfocused)}
                    onMouseLeave={() => onMouseOut(isfocused)}
                    onClick={!tryfocus ? null : () => {
                      onClick();
                      tryfocus();
                    }}
                  />
                </Tooltip>
                : <Tooltip content={hdr(link, tooltip, lang)}>
                  <Button
                    tabIndex={-1}
                    className="!bg-gray-50 dark:!bg-black focus:outline-none"
                    {...passager}
                    onMouseOver={() => onMouseOver(isfocused)}
                    onMouseLeave={() => onMouseOut(isfocused)}
                    onClick={!tryfocus ? null : () => {
                      onClick();
                      tryfocus();
                    }}
                  />
                </Tooltip>
            }
          </div>
      }
    </>
  );
}

const newStore = () => create(set => ({
  isHover: false,
  onMouseOver: (isfocused) => set(isfocused ? {} : { isHover: true }),
  onMouseOut: (isfocused) => set(isfocused ? {} : { isHover: false }),
  onClick: () => set({ isHover: false }),
  hdr: (link, tip, lang) => {
    return link ?
    lang == 'en' ? `Link ${tip} home page` : `连接${tip}主页` : 
    lang == 'en' ? `Go to ${tip}` : `访问${tip}`
  },
  useEffects: () => {
    const { darkModel, lang } = useContext(ModelContext);
    return [ darkModel, lang ];
  }
}));
