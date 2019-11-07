import { useState, useEffect } from 'react';

// the hook function that updates the windowDimensions state
export default function useWindowDimensions() {
  // get the window width and height as obj
  const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  };

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  // effect hook that run once on mount.
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
      /* console.log(
        `window resized to ${windowDimensions.width}, ${windowDimensions.height}`
      ); */
    };

    // event listener: when window resizes, call handleResize
    window.addEventListener('resize', handleResize);
    /* console.log('listener added'); */

    // on unmount, remove the event listener
    return () => {
      /* console.log('listener removed'); */
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  /* console.log(windowDimensions.width, ' ', windowDimensions.height); */
  return windowDimensions;
}
