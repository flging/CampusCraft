interface UniversityTagProps {
  tag: string;
  colorHex: string;
  name: string;
}

export default function UniversityTag({ tag, colorHex, name }: UniversityTagProps) {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 font-pixel text-xs tracking-wider"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.25)",
        borderLeft: `3px solid ${colorHex}`,
      }}
      title={name}
    >
      <span style={{ color: colorHex }} className="font-pixel-bold">
        [{tag}]
      </span>
      <span className="text-white/80">{name}</span>
    </div>
  );
}
