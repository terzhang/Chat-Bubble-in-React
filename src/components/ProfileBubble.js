import React from 'react';
import '../styles.css';
import { animated } from 'react-spring';

// Reusable profile bubble
// A controlled component fed with profile info, transform and mouse events
const ProfileBubble = ({ profile, transform, bind }) => {
  return (
    <animated.div
      {...bind()}
      className="bubbleContainer"
      // bind is collection of event callbacks, such as onTouchStart, onTouchMove, etc.,
      // which the hook uses to determine its gestures
      style={{
        transform: transform()
      }}
      // prevent default event of bringing up context menu
      onContextMenu={e => e.preventDefault()}
    >
      <img
        src={profile.uri}
        width={profile.width}
        height={profile.height}
        alt={profile.name}
        draggable={false}
      />
    </animated.div>
  );
};

export default ProfileBubble;
