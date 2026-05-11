import { useEffect, useState } from 'react';
import { getStaff, getObservations, getReviews, getGoals } from '../api';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import PageHeader from '../components/PageHeader';

export default function Dashboard() {
  const [staff, setStaff] = useState([]);
  const [obs, setObs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    getStaff().then(r => setStaff(r.data));
    getObservations().then(r => setObs(r.data));
    getReviews().then(r => setReviews(r.data));
    getGoals().then(r => setGoals(r.data));
  }, []);

  const pending = reviews.filter(r => r.status === 'Pending').length;
  const avgScore = staff.length ? (staff.reduce((a,s) => a + s.score, 0) / staff.length).toFixed(1) : 0;
  const onTrack = goals.filter(g => g.progress_pct >= 50).length;
  const ratingColor = r => ({ Exemplary:'purple', Proficient:'green', Developing:'blue', Basic:'amber' }[r] || 'gray');

  return (
    <div style={{ padding: 28 }}>
      <PageHeader title="Dashboard" subtitle="Lincoln K-12 School · Spring 2026" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Staff" value={staff.length} delta="Active this semester" deltaUp />
        <StatCard label="Observations" value={obs.length} delta="This cycle" deltaUp />
        <StatCard label="Reviews Pending" value={pending || '—'} delta="Need attention" />
        <StatCard label="Avg Performance" value={`${avgScore}/5`} delta={`${onTrack} goals on track`} deltaUp />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: 'white', border: '1px solid #E2DED8', borderRadius: 10, padding: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>Staff at a Glance</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F0EDE8' }}>
                {['Name','Department','Score','Rating'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#5C5955', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staff.slice(0,6).map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #E2DED8' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: s.avatar_color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700 }}>{s.avatar_initials}</div>
                      {s.name}
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#5C5955', fontSize: 13 }}>{s.department}</td>
                  <td style={{ padding: '10px 12px' }}><Badge label={`${s.score}/5`} color={s.score>=4.5?'purple':s.score>=4?'green':s.score>=3?'blue':'amber'} /></td>
                  <td style={{ padding: '10px 12px' }}><Badge label={s.rating} color={ratingColor(s.rating)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'white', border: '1px solid #E2DED8', borderRadius: 10, padding: 20 }}>
            <div style={{ fontWeight: 600, marginBottom: 14 }}>Goal Progress</div>
            {goals.slice(0,5).map(g => (
              <div key={g.id} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: '#5C5955' }}>{g.staff_name} — {g.title.slice(0,30)}...</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{g.progress_pct}%</span>
                </div>
                <div style={{ background: '#F0EDE8', borderRadius: 20, height: 6 }}>
                  <div style={{ width: `${g.progress_pct}%`, height: '100%', borderRadius: 20, background: g.progress_pct>=70?'#1A9A4D':g.progress_pct>=40?'#2860B0':'#C53030', transition: 'width 0.5s' }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: '#EAF0FB', border: '1px solid #C8D8F0', borderRadius: 10, padding: 16 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <span style={{ background: '#1E4D8C', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>AI INSIGHT</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>
              {staff.length > 0
                ? `${staff.filter(s=>s.rating==='Proficient'||s.rating==='Exemplary').length} of ${staff.length} staff performing at Proficient or above. ${staff.filter(s=>s.score<3.5).length} staff need focused support this cycle.`
                : 'Loading insights...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
