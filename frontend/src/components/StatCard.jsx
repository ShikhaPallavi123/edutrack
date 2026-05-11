export default function StatCard({ label, value, delta, deltaUp }) {
  return (
    <div style={{ background: 'white', border: '1px solid #E2DED8', borderRadius: 10, padding: '18px 20px' }}>
      <div style={{ fontSize: 11, color: '#9C9892', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{value}</div>
      {delta && <div style={{ fontSize: 12, marginTop: 6, color: deltaUp ? '#1A6B3A' : '#8B1A1A' }}>{delta}</div>}
    </div>
  );
}
