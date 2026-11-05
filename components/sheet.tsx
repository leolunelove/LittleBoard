"use client";
import { useEffect, useRef, type ReactNode, type KeyboardEvent } from "react";
let modalCount = 0;
let pageOverflow = "";
import { X } from "lucide-react";
export function Sheet({
  title,
  children,
  onClose,
  onKeyDown,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDialogElement>) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  const closing = useRef(false);
  const animation = useRef<Animation | null>(null);
  function requestClose() {
    if (closing.current) return;
    const node = ref.current;
    if (
      !node?.animate ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      close.current();
      return;
    }
    closing.current = true;
    animation.current = node.animate(
      [
        { opacity: 1, transform: "translateY(0) scale(1)" },
        { opacity: 0, transform: "translateY(6px) scale(.99)" },
      ],
      { duration: 120, easing: "ease-out" },
    );
    animation.current.finished
      .then(() => {
        closing.current = false;
        close.current();
      })
      .catch(() => {});
  }
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement | null;
    if (modalCount++ === 0) {
      pageOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    dialog.showModal();
    dialog
      .querySelector<
        HTMLInputElement | HTMLTextAreaElement
      >("input:not([type=checkbox]):not([type=file]), textarea")
      ?.focus({ preventScroll: true });
    return () => {
      animation.current?.cancel();
      dialog.close();
      if (--modalCount === 0) document.body.style.overflow = pageOverflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="memo-sheet"
      aria-label={title}
      onKeyDown={(event) => {
        if (event.key === "Escape") event.stopPropagation();
        onKeyDown?.(event);
      }}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            requestClose();
        }
      }}
    >
      <div className="sheet-heading">
        <h2>{title}</h2>
        <button
          type="button"
          className="icon-button"
          aria-label="Close"
          onClick={requestClose}
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
