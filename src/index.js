import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import { useSpring, animated, useTransition, config } from 'react-spring';
import { useGesture } from 'react-with-gesture';
import useWindowDimensions from './hooks/useWindowDimension';
import { ReactComponent as IconClose } from './assets/icon_close.svg';
import ProfileBubble from './components/ProfileBubble';
import { flattenDiagnosticMessageText } from 'typescript';

function App() {
  const ICON_WIDTH = 100;
  const ICON_HEIGHT = 100;
  const { width, height } = useWindowDimensions();
  const [mouseDown, setMouseDown] = React.useState(false);

  // react-spring hook: https://www.react-spring.io/docs/hooks/use-spring
  const [{ pos }, set] = useSpring(() => ({
    pos: [0, 0]
  }));

  // transition hook for bubble bin
  const transition = useTransition(mouseDown, null, {
    from: { opacity: 0, top: height },
    enter: { opacity: 1, top: height * 0.8 },
    leave: { opacity: 0, top: height },
    config: { ...config.default, duration: 500 }
  });

  // whether to snap to either sides
  const snapToSide = x => x > width * 0.6 || x < width * 0.4;

  // whether it's within the region of the bubble bin
  const isInBinRange = (x, y) => {
    let b = height * (1 - 0.4); // vertex
    let a = width / 2 - ICON_WIDTH / 2; // axis of symmetry
    // eq is y = m * (x - a)^2 + b, where x = a +/- a/2 if y = 0
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
      x = width - ICON_WIDTH; // compensate so bubble won't clip
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
      if (down) {
        newXY = [xy[0] - ICON_WIDTH / 2, xy[1] - ICON_HEIGHT / 2]; // center bubble to cursor
      } else if (snapToSide(x)) {
        newXY = [x, y]; // don't override the snapping algorithm
      } else {
        newXY = [x - ICON_WIDTH / 2, y - ICON_HEIGHT / 2]; // center bubble to cursor
      }
    }

    // new spring config according to gesture events: https://www.react-spring.io/docs/hooks/api
    const newConfig = { mass: 1, tension: 500, friction: 20, clamp: true };
    /* console.log(transform.getValue()); */

    set({
      pos: newXY,
      config: newConfig
    });
  });

  // handler for mouse down event
  const handleMouseDown = e => {
    if (!mouseDown) {
      setMouseDown(true);
    }
  };

  // handler for mouse up event
  const handleMouseUp = e => {
    if (mouseDown) {
      setMouseDown(false);
    }
  };

  // return an interpolated position given an animated value
  const handleTransform = () => {
    return pos.interpolate((x, y) => `translate(${x}px, ${y}px)`);
  };

  return (
    <div onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      <ProfileBubble
        profile={{
          name: 'Mr.Cat',
          uri: require('./assets/cat_icon.png'),
          width: String(ICON_WIDTH),
          height: String(ICON_HEIGHT)
        }}
        transform={handleTransform}
        bind={() => gestureBind()}
      />
      {/* transition animation for bubble bin */}
      {transition.map(
        ({ item, key, props }) =>
          item && (
            <animated.div
              className="bubbleBin"
              key={key}
              style={{
                ...props,
                position: 'absolute',
                // top instead of bottom since bin region magnets to y = height * 0.8
                right: width / 2 - ICON_WIDTH / 2,
                width: '100px',
                height: '100px'
              }}
            >
              <IconClose
                className="bubbleBin"
                alt="close bubble"
                width="100"
                height="100"
                viewBox="9 9 26 26"
              />
            </animated.div>
          )
      )}
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
