import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import { useSpring, animated } from 'react-spring';
import { useGesture } from 'react-with-gesture';
import useWindowDimensions from './hooks/useWindowDimension';

function App() {
  const ICON_WIDTH = 100;
  const ICON_HEIGHT = 100;
  const { width, height } = useWindowDimensions();

  // react-spring hook: https://www.react-spring.io/docs/hooks/use-spring
  const [{ transform }, set] = useSpring(() => ({
    transform: `translate3d(0px,0px,0)`
  }));

  // whether to snap to either sides
  const snapToSide = x => x > width * 0.7 || x < width * 0.3;

  // whether it's within the region of the bubble bin
  const isInBinRange = (x, y) => {
    let b = height * (1 - 0.4); // height goes from top to bottom
    let a = width / 2;
    // eq is y = m * (x - a)^2 + b, where x = a +/- a/2 if y = 0
    // and a = axis of symmetry, b = vertex
    // then.. m = 4b / a^2
    let m = (4 * b) / a ** 2;
    let eq = m * (x - a) ** 2 + b;
    return y >= eq;
  };

  // useGesture listens to events: mouse down, mouse's xy, and velocity
  const gestureBind = useGesture(({ down, xy }) => {
    let newXY;
    let [x, y] = xy;

    // determining the region where the bubble will snap to edge
    if (x > width * 0.8) {
      x = width * 0.9;
    } else if (x < width * 0.2) {
      x = 0;
    }

    // magnet bubble to center bottom of the screen if it's in bin range
    if (isInBinRange(x, y) && !snapToSide(x)) {
      x = width / 2 - ICON_WIDTH / 2; // take icon width into account
      y = height * 0.8;
      newXY = [x, y];
    } else {
      // clamp the y within viewport
      let maxY = height - ICON_HEIGHT;
      let minY = 0;
      y = Math.min(Math.max(parseInt(y), minY), maxY);
      newXY = down ? xy : [x, y];
    }

    // new spring config according to gesture events: https://www.react-spring.io/docs/hooks/api
    const newConfig = { mass: 1, tension: 500, friction: 20, clamp: true };
    /* console.log(transform.getValue()); */

    set({
      transform: `translate3d(${newXY[0]}px, ${newXY[1]}px, 0)`,
      config: newConfig
    });
  });

  return (
    <div>
      <animated.div
        className="bubbleContainer"
        // bind is collection of event callbacks, such as onTouchStart, onTouchMove, etc.,
        // which the hook uses to determine its gestures
        {...gestureBind()}
        style={{
          transform
        }}
        // prevent default event of bringing up context menu
        onContextMenu={e => e.preventDefault()}
      >
        <img
          className="bubble"
          src={require('./cat_icon.png')}
          width={String(ICON_WIDTH)}
          height={String(ICON_HEIGHT)}
          alt="cat icon"
          draggable={false}
        />
      </animated.div>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
