interface TagChipProps {
  tag: string;
  isActive?: boolean;
  onClick?: (tag: string) => void;
}

export function TagChip({ tag, isActive = false, onClick }: TagChipProps) {
  const sharedClassName =
    "rounded-full border px-3 py-1 text-xs font-medium transition-colors";

  if (!onClick) {
    return (
      <span
        className={`${sharedClassName} border-panel-border bg-panel-muted text-text-secondary`}
      >
        {tag}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onClick(tag)}
      className={`${sharedClassName} cursor-pointer ${
        isActive
          ? "border-accent bg-accent/20 text-accent"
          : "border-panel-border bg-panel-muted text-text-secondary hover:border-accent/60 hover:text-text-primary"
      }`}
    >
      {tag}
    </button>
  );
}
