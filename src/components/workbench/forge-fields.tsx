import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bookmark as BookmarkIcon, Check, Plus, Trash2, X } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { loadBookmarkImage } from "@/lib/prompt/cloud";
import { loadImage } from "@/lib/prompt/images";
import {
  CLUSTER_GROUPS,
  CLUSTERS,
  clusterHasContent,
  getAt,
  resolvePath,
  type ClusterId,
  type FieldDef,
  type PromptDoc,
} from "@/lib/prompt/model";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function safeHex(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value.trim()) ? value.trim() : "#888888";
}

function base64ToBlob(data: string) {
  const [header, body] = data.split(",");
  const mime = header?.match(/data:([^;]+)/)?.[1] ?? "image/png";
  const binary = atob(body ?? "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export function ClusterMenu({
  doc,
  slot,
  active,
  onPick,
}: {
  doc: PromptDoc;
  slot: number;
  active: ClusterId;
  onPick: (id: ClusterId) => void;
}) {
  return (
    <div className="py-2">
      {CLUSTER_GROUPS.map((group) => (
        <div key={group} className="pb-2">
          <p className="px-3 pt-3 pb-1 text-xs font-medium tracking-wide text-faint">{group}</p>
          {CLUSTERS.filter((item) => item.group === group).map((item) => {
            const on = item.id === active;
            const filled = clusterHasContent(doc, item, slot);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onPick(item.id)}
                className={cn(
                  "flex h-11 w-full items-center gap-2 px-3 text-left text-sm",
                  on ? "bg-surface font-medium text-primary" : "text-muted hover:bg-surface hover:text-fg",
                )}
                aria-current={on ? "true" : undefined}
              >
                <span className={cn("size-1.5 shrink-0 rounded-full", filled ? "bg-primary" : "bg-border")} />
                {item.label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function FieldCard({
  field,
  doc,
  slot,
  onFocus,
  onChange,
  onSave,
}: {
  field: FieldDef;
  doc: PromptDoc;
  slot: number;
  onFocus: (path: string) => void;
  onChange: (value: string | string[]) => void;
  onSave: () => void;
}) {
  const path = resolvePath(field.path, slot);
  const value = getAt(doc, path);
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <div className="mb-2 flex items-center gap-2">
        <label htmlFor={path} className="text-sm font-medium">
          {field.label}
        </label>
        <button
          type="button"
          className="ml-auto flex size-11 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-fg"
          aria-label={`Save ${field.label} to assets`}
          onClick={onSave}
        >
          <BookmarkIcon className="size-4" />
        </button>
      </div>
      {field.kind === "palette" && Array.isArray(value) ? (
        <PaletteField colors={value} onChange={onChange} />
      ) : field.kind === "list" && Array.isArray(value) ? (
        <textarea
          id={path}
          data-path={path}
          rows={field.rows}
          value={value.join("\n")}
          placeholder={field.hint}
          onFocus={() => onFocus(path)}
          onChange={(event) => onChange(event.target.value.split("\n"))}
          onBlur={(event) =>
            onChange(
              event.target.value
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean),
            )
          }
          className="field resize-y"
        />
      ) : (
        <textarea
          id={path}
          data-path={path}
          rows={field.rows}
          value={typeof value === "string" ? value : ""}
          placeholder={field.hint}
          onFocus={() => onFocus(path)}
          onChange={(event) => onChange(event.target.value)}
          className="field resize-y"
        />
      )}
    </div>
  );
}

export function PaletteField({
  colors,
  onChange,
}: {
  colors: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      {colors.length === 0 ? <p className="text-sm text-faint">No swatches yet.</p> : null}
      {colors.map((hex, index) => (
        <div key={`${hex}-${index}`} className="flex items-center gap-2">
          <input
            aria-label={`Palette color ${index + 1}`}
            type="color"
            value={safeHex(hex)}
            onChange={(event) => {
              const next = [...colors];
              next[index] = event.target.value.toUpperCase();
              onChange(next);
            }}
            className="size-11 shrink-0 rounded-md border border-border bg-bg"
          />
          <input
            aria-label={`Hex ${index + 1}`}
            value={hex}
            onChange={(event) => {
              const next = [...colors];
              next[index] = event.target.value;
              onChange(next);
            }}
            className="field font-mono"
          />
          <button
            type="button"
            aria-label={`Remove color ${index + 1}`}
            className="flex size-11 items-center justify-center text-muted hover:text-fg"
            onClick={() => onChange(colors.filter((_, item) => item !== index))}
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-ghost" onClick={() => onChange([...colors, "#C46A3A"])}>
        <Plus className="size-4" />
        Add swatch
      </button>
    </div>
  );
}

export function AccountSlot({ compact = false }: { compact?: boolean }) {
  const { isPending } = useCurrentUserState();
  if (isPending) return compact ? null : <div className="h-11 w-24 animate-pulse rounded-md bg-surface" />;
  if (compact) {
    return (
      <div className="border-t border-border px-3 py-2 lg:hidden">
        <SignedOut>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted">Sign in to keep this in your account.</p>
            <Link to="/login" className="btn btn-primary shrink-0">
              Sign in
            </Link>
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    );
  }
  return (
    <>
      <SignedOut>
        <Link to="/login" className="btn btn-ghost">
          Sign in
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}

export function AssetCard({
  eyebrow,
  title,
  body,
  tags,
  imageId,
  remote = false,
  picked,
  onPick,
  onDelete,
}: {
  eyebrow: string;
  title: string;
  body: string;
  tags?: string[];
  imageId?: string;
  remote?: boolean;
  picked: boolean;
  onPick: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className={cn("rounded-lg border bg-surface", picked ? "border-primary" : "border-border")}>
      <button type="button" onClick={onPick} aria-pressed={picked} className="flex w-full items-start gap-3 px-3 py-3 text-left">
        {imageId ? <BookmarkPhoto id={imageId} remote={remote} /> : null}
        <span className="min-w-0 flex-1">
          <p className="text-xs font-medium tracking-wide text-primary">{eyebrow}</p>
          <p className="mt-1 text-sm font-medium">{title}</p>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{body}</p>
          {tags && tags.length > 0 ? <p className="mt-1 text-xs text-faint">{tags.join(" · ")}</p> : null}
        </span>
        <PickMark on={picked} />
      </button>
      {onDelete ? (
        <div className="flex justify-end border-t border-border">
          <button
            type="button"
            className="flex size-11 items-center justify-center text-muted hover:text-fg"
            aria-label={`Delete ${title}`}
            onClick={onDelete}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function BookmarkPhoto({ id, remote }: { id: string; remote: boolean }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    let objectUrl = "";
    const load = remote
      ? loadBookmarkImage({ data: id }).then((data) => (data ? base64ToBlob(data) : loadImage(id)))
      : loadImage(id);
    load
      .then((blob) => {
        if (!alive || !blob) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id, remote]);
  if (!url) return <span className="size-14 shrink-0 rounded-md bg-bg" />;
  return <img src={url} alt="" className="size-14 shrink-0 rounded-md object-cover" />;
}

export function PickMark({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
        on ? "border-primary bg-primary text-primary-fg" : "border-border bg-bg",
      )}
      aria-hidden="true"
    >
      {on ? <Check className="size-3" /> : null}
    </span>
  );
}
