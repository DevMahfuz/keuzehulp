import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function getFocusable(root) {
  if (!root) return [];
  return Array.from(
    root.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
}

export default function WizardModal({ open, titleId, onClose, children }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const restoreFocusRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    restoreFocusRef.current = document.activeElement;
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPadding: body.style.paddingRight,
    };
    const scrollbar = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbar > 0) {
      body.style.paddingRight = `${scrollbar}px`;
    }
    const t = window.setTimeout(() => {
      closeRef.current?.focus();
    }, 0);

    const onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = getFocusable(dialogRef.current);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.paddingRight = prev.bodyPadding;
      const back = restoreFocusRef.current;
      if (back && typeof back.focus === "function") {
        back.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="bw-keuzehulp-scope">
      <div className="bw-keuzehulp-overlay" data-testid="bw-keuzehulp-overlay">
        <div
          className="bw-keuzehulp-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          ref={dialogRef}
        >
          <button
            ref={closeRef}
            className="bw-keuzehulp-close"
            type="button"
            aria-label="Sluiten"
            onClick={onClose}
          >
            ×
          </button>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
