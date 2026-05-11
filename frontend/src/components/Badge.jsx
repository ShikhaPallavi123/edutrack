const colors = {
  green:  { bg: '#E4F3EB', color: '#1A6B3A' },
  blue:   { bg: '#E8EFF9', color: '#1E4D8C' },
  amber:  { bg: '#FBF0DA', color: '#8B5E0A' },
  red:    { bg: '#F9E4E4', color: '#8B1A1A' },
  purple: { bg: '#EFE8F9', color: '#5A2D8B' },
  gray:   { bg: '#F0EDE8', color: '#5C5955' },
};
export default function Badge({ label, color = 'gray' }) {
  const s = colors[color] || colors.gray;
  return (
    <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 20, fontSize: 11.5, fontWeight: 500, background: s.bg, color: s.color }}>
      {label}
    </span>
  );
}
