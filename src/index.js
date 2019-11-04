import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import { useSpring, animated } from 'react-spring';
import { useGesture } from 'react-with-gesture';
import useWindowDimensions from './hooks/useWindowDimension';

function App() {
  const ICON_WIDTH = 100;
  const ICON_HEIGHT = 100;

  const { width, height } = useWindowDimensions();
  const [removeBubble, setRemoveBubble] = React.useState(false);
  // react-spring hook to animate the xy value with set
  const [{ buubleXY }, set] = useSpring(() => ({
    buubleXY: [width / 2, height / 2]
  }));

  const isSnap = x => x > width * 0.65 || x < width * 0.35;

  // useGesture listens to events: mouseDown, mouseDelta, and velocity
  const gestureBind = useGesture(({ down, delta, xy, velocity }) => {
    velocity = 1;

    // determining the region where the bubble will snap to edge
    let x = xy[0];
    let y = xy[1];
    let newXY;

    // assign new x value if near edge
    if (x > width * 0.6) {
      x = width * 0.9;
    } else if (x < width * 0.4) {
      x = 0;
    }

    // determining the region where the bubble will snap to removal bubble.
    if (y > height * 0.7 && !isSnap(x)) {
      let rBubbleX = width / 2 - ICON_WIDTH / 2; // take icon width into account
      let rBubbleY = height * 0.8;
      newXY = [rBubbleX, rBubbleY];
    } else {
      newXY = down ? xy : [x, y];
    }

    // new spring config according to gesture events
    const newConfig = { mass: velocity, tension: 500 * velocity, friction: 50 };

    // set assign new xy value and new spring config according to gesture events
    set({ buubleXY: newXY, config: newConfig });
  });

  return (
    <div>
      <animated.div
        className="bubbleContainer"
        // bind is collection of event callbacks, such as onTouchStart, onTouchMove, etc.,
        // which the hook uses to determine its gestures
        {...gestureBind()}
        // interpolation is a way of estimating new data points
        // within the range of a discrete set of data points
        style={{
          transform: buubleXY.interpolate(
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
      <p>{width + ', ' + height}</p>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
