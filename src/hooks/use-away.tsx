import { useEffect } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useAway(ref: any, callback: any) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useAwayUp(ref: any, callback: any) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickUpOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    // Bind the event listener
    document.addEventListener("mouseup", handleClickUpOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mouseup", handleClickUpOutside);
    };
  }, [ref]);
}
