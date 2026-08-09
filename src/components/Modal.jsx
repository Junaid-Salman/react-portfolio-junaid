import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { RiCloseLine } from "react-icons/ri";

const TRANSITION_DURATION_MS = 200;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const Modal = ({ isOpen, onClose, title, ariaLabel, children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const hasOpenedRef = useRef(false);
  const backdropMouseDownOnSelfRef = useRef(false);
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const titleId = useId();

  // Mount/unmount + enter/exit transition timing.
  useEffect(() => {
    if (isOpen) {
      hasOpenedRef.current = true;
      setIsMounted(true);

      // Defer to the next two frames so the browser paints the pre-transition
      // (opacity-0/scale-95) state at least once before we flip to visible —
      // a single rAF (or a plain effect) can commit both states before the
      // first paint and silently skip the enter animation.
      let raf2;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setIsVisible(true));
      });

      return () => {
        cancelAnimationFrame(raf1);
        if (raf2) cancelAnimationFrame(raf2);
      };
    }

    if (!hasOpenedRef.current) return undefined;

    // Closing: trigger the exit transition, then unmount once it's done.
    setIsVisible(false);

    const panel = panelRef.current;
    let settled = false;

    const finishClosing = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      if (panel) panel.removeEventListener("transitionend", handleTransitionEnd);

      if (isOpenRef.current) {
        // Reopened while the exit transition was still in flight — abort the
        // unmount and resume showing, instead of stranding mounted-but-hidden.
        setIsVisible(true);
      } else {
        setIsMounted(false);
      }
    };

    const handleTransitionEnd = (event) => {
      // Guard against bubbled transitionend from descendants (e.g. a hover
      // transition on the close button) and against firing twice when more
      // than one property transitions on the panel itself.
      if (event.target !== panel || event.propertyName !== "opacity") return;
      finishClosing();
    };

    if (panel) panel.addEventListener("transitionend", handleTransitionEnd);
    // Safety net: covers prefers-reduced-motion (duration collapses to 0, so
    // transitionend never fires) and any other cancelled/interrupted transition.
    const timeoutId = setTimeout(finishClosing, TRANSITION_DURATION_MS + 50);

    return () => {
      settled = true;
      clearTimeout(timeoutId);
      if (panel) panel.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, [isOpen]);

  // Body scroll lock, including the iOS Safari background-scroll fix.
  // Tied to isMounted (not isOpen) so it releases only once the exit
  // transition has actually finished, and its cleanup — which always runs,
  // even if a parent force-unmounts this component without calling onClose
  // — is the single place scroll state gets restored.
  useEffect(() => {
    if (!isMounted) return undefined;

    const { body } = document;
    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    const previousStyle = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    if (scrollbarWidth > 0) {
      const currentPaddingRight = parseFloat(getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
    }

    return () => {
      body.style.position = previousStyle.position;
      body.style.top = previousStyle.top;
      body.style.width = previousStyle.width;
      body.style.paddingRight = previousStyle.paddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [isMounted]);

  // Initial focus + return focus. Same isMounted-cleanup approach as the
  // scroll lock above, for the same reason (must survive a force-unmount).
  useEffect(() => {
    if (!isMounted) return undefined;

    triggerRef.current = document.activeElement;
    panelRef.current?.focus();

    return () => {
      const trigger = triggerRef.current;
      if (trigger && document.contains(trigger)) {
        trigger.focus();
      } else {
        // Trigger was removed from the DOM while open — documented fallback.
        document.body.focus?.();
      }
    };
  }, [isMounted]);

  // Escape-to-close + Tab focus trap, bound at document level so a keydown
  // is still caught even if focus has escaped the panel (e.g. a click landed
  // on a non-focusable region).
  useEffect(() => {
    if (!isMounted) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(panel.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        (el) => el.getClientRects().length > 0 && !el.closest("[inert], fieldset[disabled]")
      );

      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !panel.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !panel.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMounted, onClose]);

  if (!isMounted) return null;

  const handleBackdropMouseDown = (event) => {
    backdropMouseDownOnSelfRef.current = event.target === event.currentTarget;
  };

  const handleBackdropClick = (event) => {
    const startedOnBackdrop = backdropMouseDownOnSelfRef.current;
    backdropMouseDownOnSelfRef.current = false;
    // Both press and release must have started on the backdrop itself —
    // otherwise a text selection begun inside the panel and released outside
    // it (a drag, not a click) would incorrectly close the modal.
    if (startedOnBackdrop && event.target === event.currentTarget) {
      onClose();
    }
  };

  const modal = (
    <div
      className={`fixed inset-0 z-[1500] flex items-center justify-center bg-black/60 p-4 transition-opacity duration-200 motion-reduce:transition-none ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onMouseDown={handleBackdropMouseDown}
      onClick={handleBackdropClick}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title && ariaLabel ? ariaLabel : undefined}
        tabIndex={-1}
        className={`flex max-h-[85vh] w-full max-w-md flex-col rounded-2xl bg-neutral-900 shadow-2xl outline-none transition duration-200 motion-reduce:transition-none ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="sticky top-0 flex items-center justify-between gap-4 rounded-t-2xl border-b border-neutral-800 bg-neutral-900 px-5 py-4">
          {title ? (
            <h2 id={titleId} className="text-lg font-semibold text-neutral-200">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-200"
          >
            <RiCloseLine className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 text-neutral-300">{children}</div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  ariaLabel: PropTypes.string,
  children: PropTypes.node,
};

export default Modal;

/*
Usage example — Modal must always be rendered; isOpen alone gates visibility.
Never wrap it in `{isOpen && <Modal .../>}`, which would force-unmount it and
skip the exit transition, scroll restore, and return-focus handling above.

  import { useState } from "react";
  import Modal from "./Modal";

  const Example = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <button onClick={() => setIsOpen(true)}>Open modal</button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Example">
          <p>Modal content goes here.</p>
        </Modal>
      </>
    );
  };
*/
