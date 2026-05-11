import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '▦' },
  { to: '/staff', label: 'Staff Directory', icon: '👥' },
  { to: '/observations', label: 'Observations', icon: '👁' },
  { to: '/reviews', label: 'Reviews', icon: '📋' },
  { to: '/goals', label: 'Goal Tracking', icon: '🎯' },
  { to: '/notes', label: 'Notes & Docs', icon: '📝' },
  { to: '/reports', label: 'Reports', icon: '📊' },
];

export default function Sidebar() {
  return (
    <aside style={{
      width: 220, background: '#1A1917', display: 'flex',
      flexDirection: 'column', flexShrink: 0, height: '100vh'
    }}>
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: '#2860B0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏫</div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>EduTrack</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>K-12 Admin</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {links.map(link => (
          <NavLink key={link.to} to={link.to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
            borderRadius: 7, marginBottom: 2, textDecoration: 'none', fontSize: 13.5,
            color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
            background: isActive ? '#2860B0' : 'transparent',
            fontWeight: isActive ? 600 : 400,
          })}>
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: 14, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2860B0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700 }}>PW</div>
        <div>
          <div style={{ color: 'white', fontSize: 13, fontWeight: 500 }}>Dr. Patricia Walsh</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Principal</div>
        </div>
      </div>
    </aside>
  );
}
