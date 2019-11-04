import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import { useSpring, animated } from "react-spring";
import { useGesture } from "react-with-gesture";
import useWindowDimensions from "./hooks/useWindowDimension";
import { updateStatement } from "typescript";

export default function Bubble() {
  const ICON_WIDTH = 100;
  const ICON_HEIGHT = 100;

  const { width, height } = useWindowDimensions();
  // react-spring hook to animate the xy value with set
  const [{ buubleXY }, set] = useSpring(() => ({ buubleXY: [0, 0] }));

  // useGesture listens to events: mouseDown, mouseDelta, and velocity
  const gestureBind = useGesture(({ down, delta, xy, velocity }) => {
    velocity = 1;

    // determining the region where the bubble will snap to edge
    let x = xy[0];
    let y = xy[1];
    let middleFlag = false;
    let tempX = x; //tempX will store the position of the bubble every time in the window (before changing the actual position after the x's snapping)

    //checking the X position - taking ICON's width into consideration
    //leaving no place to play in the middle( but if it is in the middle adding a flag variable so that we know maybe he will try to close the bubble)
    if (x > (width - ICON_WIDTH / 2) * 0.5) {
      tempX = x;
      x = width * 0.9;
    } else if (x < (width - ICON_WIDTH / 2) * 0.5) {
      tempX = x;
      x = 0;
    }

    //checking if the user has the bubble in the horizontal middle and turning the flag to true
    if (!(tempX > width * 0.55 || tempX < width * 0.45)) {
      middleFlag = true;

      console.log("middle Flag");
    }

    // determining the region where the bubble will snap to removal bubble.
    let newXY;

    //if the bubble is in the bottom and middle the app will snap to the position where the disappearing circle will appear
    if (y > height * 0.75 && middleFlag) {
      let rBubbleX = width / 2 - ICON_WIDTH / 2; // take icon width into account
      let rBubbleY = height * 0.8; //just tweaked the numbers a little
      newXY = [rBubbleX, rBubbleY];
      updateState(); //update the state in the parent file
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
      {
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
            src={require("./cat_icon.png")}
            width={String(ICON_WIDTH)}
            height={String(ICON_HEIGHT)}
            alt="cat icon"
            draggable={false}
          />
        </animated.div>
      }
      <p>{width + " , " + height}</p>
    </div>
  );
}

export default function updateState() {
  this.setState({ showCircle: true });
}
