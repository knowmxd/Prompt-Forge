import {
  Bookmark as BookmarkIcon,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  FilePlus,
  Library,
  Maximize2,
  Minimize2,
} from "lucide-react";

export type Copied = "json" | "line" | null;
export type JsonMode = "peek" | "full" | "hidden";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Actions({
  confirmNew,
  onNew,
  onSave,
  onLibrary,
  compact,
}: {
  confirmNew: boolean;
  onNew: () => void;
  onSave: () => void;
  onLibrary: () => void;
  compact: boolean;
}) {
  return (
    <>
      <button type="button" className={cn("btn btn-ghost", compact && "w-full px-2")} onClick={onNew} aria-label="New prompt">
        <FilePlus className="size-4" />
        {confirmNew ? "Discard?" : compact ? "New" : "New prompt"}
      </button>
      <button
        type="button"
        className={cn("btn btn-ghost", compact && "w-full px-2")}
        onClick={onSave}
        aria-label="Save to library"
      >
        <BookmarkIcon className="size-4" />
        {compact ? "Save" : "Save to library"}
      </button>
      <button
        type="button"
        className={cn("btn btn-ghost", compact && "w-full px-2")}
        onClick={onLibrary}
        aria-label="Open library"
      >
        <Library className="size-4" />
        Library
      </button>
    </>
  );
}

export function JsonBlock({
  json,
  copied,
  mode,
  onCopy,
  onMode,
}: {
  json: string;
  copied: Copied;
  mode: JsonMode;
  onCopy: (kind: "json" | "line") => void;
  onMode: (mode: JsonMode) => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden border-t border-border bg-bg",
        mode === "peek" && "h-52 shrink-0",
        mode === "full" && "min-h-0 flex-1",
        mode === "hidden" && "shrink-0",
      )}
    >
      <div className="flex shrink-0 flex-wrap items-center gap-2 px-3 py-2">
        <div className="mr-auto">
          <p className="text-xs font-medium tracking-wide text-muted">JSON</p>
          <p className="text-xs text-faint">
            {mode === "full" ? "Full document" : mode === "hidden" ? "Hidden" : "Live — a fraction"}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-ghost w-11 px-0"
          aria-label={mode === "hidden" ? "Show JSON" : "Hide JSON"}
          onClick={() => onMode(mode === "hidden" ? "peek" : "hidden")}
        >
          {mode === "hidden" ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
        <button
          type="button"
          className="btn btn-ghost w-11 px-0"
          aria-label={mode === "full" ? "Show a fraction of the JSON" : "Show the full JSON"}
          onClick={() => onMode(mode === "full" ? "peek" : "full")}
        >
          {mode === "full" ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
        </button>
        {mode === "hidden" ? null : (
          <>
            <button type="button" className="btn btn-ghost" onClick={() => onCopy("line")}>
              {copied === "line" ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied === "line" ? "Copied" : "Copy line"}
            </button>
            <button type="button" className="btn btn-primary" onClick={() => onCopy("json")}>
              {copied === "json" ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied === "json" ? "Copied" : "Copy JSON"}
            </button>
          </>
        )}
      </div>
      {mode === "hidden" ? null : (
        <pre
          id="json-output"
          className="min-h-0 flex-1 overflow-auto px-4 pb-4 font-mono text-xs leading-relaxed break-words whitespace-pre-wrap"
        >
          {json.split("\n").map((line, index) => (
            <div key={index}>{colorLine(line)}</div>
          ))}
        </pre>
      )}
    </div>
  );
}

function colorLine(line: string) {
  const match = line.match(/^(\s*)("(?:\\.|[^"\\])*")(\s*:\s*)(.*)$/);
  if (!match) return <span className="text-faint">{line}</span>;
  return (
    <>
      {match[1]}
      <span className="text-primary">{match[2]}</span>
      <span className="text-faint">{match[3]}</span>
      <span className="text-fg">{match[4]}</span>
    </>
  );
}
