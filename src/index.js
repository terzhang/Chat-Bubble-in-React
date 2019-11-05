import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import { useSpring, animated } from 'react-spring';
import { useGesture } from 'react-with-gesture';
import useWindowDimensions from './hooks/useWindowDimension';

function App() {
  const ICON_WIDTH = 100;
  const ICON_HEIGHT = 100;
  const pos = React.useRef(null);
  const { width, height } = useWindowDimensions();

  // react-spring hook to animate the xy value with set
  const [{ bubbleXY }, set] = useSpring(() => ({
    bubbleXY: [width / 2, height / 2]
  }));

  const isSnap = x => x > width * 0.8 || x < width * 0.2;
  /* const toBubbleBin = y => y > height * 0.7; */
  // given the bubble's coordinate return whether it's within the region of the bubble bin
  const isInBinRange = (x, y) => {
    let i = height * 0.7;
    let j = width / 2;
    // eq is y = b * (x - i)^2 + j, where x=w/5 if y = 0
    // and i = axis of symmetry, j = vertex
    // then.. b = 25j / 16(i^2)
    let b = (-25 * j) / (16 * i ** 2);
    let eq = b * (x - i) ** 2 + j;
    return y >= eq;
  };

  // useGesture listens to events: mouseDown, mouseDelta, and velocity
  const gestureBind = useGesture(({ down, xy, velocity }) => {
    velocity = 1;

    // determining the region where the bubble will snap to edge
    let x = xy[0];
    let y = xy[1];
    let newXY;

    // assign new x value if near edge
    if (x > width * 0.8) {
      x = width * 0.9;
    } else if (x < width * 0.2) {
      x = 0;
    }

    // determining the region where the bubble will snap to removal bubble.
    if (isInBinRange(x, y) && !isSnap(x)) {
      let x = width / 2 - ICON_WIDTH / 2; // take icon width into account
      let y = height * 0.8;
      newXY = [x, y];
    } else {
      // TODO: clamp x and y to viewport better
      if (y > height - ICON_HEIGHT) {
        // subtract icon height b/c icon's xy is calculated from its top left corner
        y = height - ICON_HEIGHT;
      } else if (y < 0) {
        y = 0;
      }
      newXY = down ? xy : [x, y];
    }

    // new spring config according to gesture events
    const newConfig = { mass: velocity, tension: 500 * velocity, friction: 50 };

    // set assign new xy value and new spring config according to gesture events
    set({ bubbleXY: newXY, config: newConfig });
  });

  return (
    <div>
      <animated.div
        ref={pos}
        className="bubbleContainer"
        // bind is collection of event callbacks, such as onTouchStart, onTouchMove, etc.,
        // which the hook uses to determine its gestures
        {...gestureBind()}
        // interpolation is a way of estimating new data points
        // within the range of a discrete set of data points
        style={{
          transform: bubbleXY.interpolate(
            (x, y) => `translate3d(${x}px,${y}px,0)`
          )
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
