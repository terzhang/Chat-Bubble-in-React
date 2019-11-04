import { useState, useEffect } from "react";

// get the window width and height as obj
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

// the hook function that updates the windowDimensions state
export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  // effect hook that run once on mount.
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    // event listener: when window resizes, call handleResize
    window.addEventListener("resize", handleResize);

    // on unmount, remove the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
