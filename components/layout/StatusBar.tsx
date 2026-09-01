"use client";

export function StatusBar() {
  return (
    <div className="h-6 flex items-center justify-between px-3 bg-[var(--accent)] text-[#0c0c11] font-mono text-[11px] leading-none">
      <span className="flex items-center gap-3">
        <span className="hidden sm:inline">main</span>
        <span className="hidden sm:inline">● 0 ◆ 0</span>
        <span>UTF-8</span>
        <span className="hidden sm:inline">LF</span>
      </span>
      <span className="flex items-center gap-2">
        <span>TypeScript</span>
        <span className="hidden sm:inline">Spaces: 2</span>
        <span className="hidden sm:inline">Ln 1, Col 1</span>
      </span>
    </div>
  );
}
