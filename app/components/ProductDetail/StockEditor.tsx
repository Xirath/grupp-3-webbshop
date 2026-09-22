"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
  useId,
} from "react";
import { useRouter } from "next/navigation";
import { updateStockAction, type StockEditState } from "./actions";

interface StockEditorProps {
  productId: number;
  productTitle: string;
  stock: number;
}

export default function StockEditor({
  productId,
  productTitle,
  stock,
}: StockEditorProps) {
  const router = useRouter();
  const id = useId();
  const titleId = `${id}-stock-modal-title`;
  const descriptionId = `${id}-stock-modal-description`;
  const inputId = `${id}-stock-quantity`;

  const [isOpen, setIsOpen] = useState(false);
  const [stockValue, setStockValue] = useState(stock);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [state, formAction, isPending] = useActionState<
    StockEditState,
    FormData
  >(updateStockAction.bind(null, productId), {});

  const dialogRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Lock page scrolling while the modal is open.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const closeDialog = useCallback(() => {
    if (isPending) return;

    setIsOpen(false);

    // Return keyboard focus to the button that opened the modal.
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }, [isPending]);

  useEffect(() => {
    if (!state.success) return;

    router.refresh();
    requestAnimationFrame(() => {
      setIsOpen(false);
      triggerRef.current?.focus();
    });
  }, [router, state.success]);

  useEffect(() => {
    if (!isOpen) return;

    // Focus the input as soon as the dialog opens.
    inputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      );

      // Safely handle an empty focusable collection.
      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeDialog, isOpen, isPending]);

  const openDialog = () => {
    setStockValue(stock);
    setHasSubmitted(false);
    setIsOpen(true);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openDialog}
        className="min-h-10 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
      >
        Adjust Stock
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close stock editor"
            onClick={closeDialog}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
          />

          <form
            action={formAction}
            ref={dialogRef}
            onSubmit={() => setHasSubmitted(true)}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            aria-busy={isPending}
            className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
          >
            <h2 id={titleId} className="text-lg font-bold text-slate-950">
              Adjust Stock
            </h2>

            <p id={descriptionId} className="mt-1 text-sm text-slate-500">
              Update the inventory quantity for{" "}
              <span className="font-medium text-slate-700">{productTitle}</span>
              .
            </p>

            <label
              htmlFor={inputId}
              className="mt-6 block text-sm font-medium text-slate-700"
            >
              Stock quantity
            </label>

            <input
              ref={inputRef}
              id={inputId}
              name="stock"
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              value={stockValue}
              disabled={isPending}
              onChange={(event) => {
                const rawValue = event.target.value;

                // Handle empty input without producing NaN.
                if (rawValue === "") {
                  setStockValue(0);
                  return;
                }

                const value = Number(rawValue);

                if (Number.isFinite(value)) {
                  setStockValue(Math.max(0, Math.floor(value)));
                }
              }}
              className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-600/20 disabled:cursor-not-allowed disabled:bg-slate-100"
            />

            {hasSubmitted && state.error && (
              <p role="alert" className="mt-2 text-sm text-red-600">
                {state.error}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeDialog}
                disabled={isPending}
                className="min-h-11 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending || stockValue === stock}
                className="min-h-11 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Saving..." : "Save Stock"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
