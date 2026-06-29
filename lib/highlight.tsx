import { Fragment } from "react";

// Renders **word** as highlighted (bright + semibold) inside dim text.
// Usage: <HL text={bullet} />
export function HL({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="font-semibold text-ink">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}
