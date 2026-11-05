"use client";
import { useLayoutEffect, useRef, type TextareaHTMLAttributes } from "react";
export function AutoTextarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const size = () => {
    const node = ref.current;
    if (node) {
      node.style.height = "auto";
      node.style.height = `${node.scrollHeight}px`;
    }
  };
  useLayoutEffect(() => {
    size();
    window.addEventListener("resize", size);
    return () => window.removeEventListener("resize", size);
  }, [props.defaultValue, props.value]);
  return (
    <textarea
      {...props}
      ref={ref}
      rows={1}
      onInput={(event) => {
        size();
        props.onInput?.(event);
      }}
    />
  );
}
