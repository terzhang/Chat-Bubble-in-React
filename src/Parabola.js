import React from "react";
import { useSpring, animated } from "react-spring";
//here we will put the animation for the parabola when it's called
export default function Parabola() {
  const props = useSpring({ opacity: 1, from: { opacity: 0 }, delay: "2000" });
  return (
    <animated.div style={props}>
      <h1>I will fade in</h1>
    </animated.div>
  );
}
