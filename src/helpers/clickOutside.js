import { useEffect } from "react";

export default function useClickOutside(ref, fun) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) {
        return;
      }
      fun();
    };
    // mousedown -> When you click the mouse(left/right/middle) button
    document.addEventListener("mousedown", listener);
    // touchstart -> When you touch the screen
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref]);
}
