import { useEffect, useState } from 'react';
import { getStaff } from '../api';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => { getStaff().then(r => setStaff(r.data)); }, []);

  const ratingColor = r => ({ Exemplary:'purple', Proficient:'green', Developing:'blue', Basic:'amber', 'Needs Improvement':'red' }[r] || 'gray');
  const filtered = staff.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.department.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: 28 }}>
      <PageHeader title="Staff Directory" subtitle={`${staff.length} staff members`} />
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or department..." style={{ flex: 1, maxWidth: 320, padding: '8px 12px', border: '1px solid #CBC7C0', borderRadius: 6, fontSize: 13, outline: 'none' }} />
      </div>
      <div style={{ background: 'white', border: '1px solid #E2DED8', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F0EDE8' }}>
              {['Staff Member','Department','Grade Levels','Experience','Score','Rating'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#5C5955', textTransform: 'uppercase', borderBottom: '1px solid #E2DED8' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid #E2DED8' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: s.avatar_color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{s.avatar_initials}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: '#9C9892' }}>{s.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: '#5C5955', fontSize: 13 }}>{s.department}</td>
                <td style={{ padding: '12px 16px', color: '#5C5955', fontSize: 13 }}>{s.grade_levels}</td>
                <td style={{ padding: '12px 16px', color: '#5C5955', fontSize: 13 }}>{s.years_experience} yrs</td>
                <td style={{ padding: '12px 16px' }}><Badge label={`${s.score}/5`} color={s.score>=4.5?'purple':s.score>=4?'green':s.score>=3?'blue':'amber'} /></td>
                <td style={{ padding: '12px 16px' }}><Badge label={s.rating} color={ratingColor(s.rating)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
