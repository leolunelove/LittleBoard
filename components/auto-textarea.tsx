"use client";
import {
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  type Ref,
  type TextareaHTMLAttributes,
} from "react";
export function AutoTextarea({
  ref: forwardedRef,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  ref?: Ref<HTMLTextAreaElement>;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(forwardedRef, () => ref.current!, []);
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
