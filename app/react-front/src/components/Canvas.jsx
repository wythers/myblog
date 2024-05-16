import { useRef, useMemo, useEffect } from "react";
import { GlslCanvas } from "../utils/wgl"
import { animated } from "@react-spring/web";
import { create } from "zustand";

export function Canvas({ url, spring, ...twcss }) {
  const useStore = useMemo(newStore, []);
  const { useEffects } = useStore(state => ({ ...state }));
  const [ref] = useEffects();

  return <animated.canvas ref={ref} id="Lunar" data-textures={url} {...twcss} style={{ ...spring }} />
}

const newStore = () => create(set => ({
  useEffects: () => {
    const ref = useRef(null);
    useEffect(() => {
      new GlslCanvas(ref.current);
    }, [])
    return [ref];
  }
}));