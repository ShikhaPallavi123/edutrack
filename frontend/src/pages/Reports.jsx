import { useEffect, useState } from 'react';
import { getStaff, getObservations, getGoals, aiDepartmentReport } from '../api';
import PageHeader from '../components/PageHeader';
import AiPanel from '../components/AiPanel';

export default function Reports() {
  const [staff, setStaff] = useState([]);
  const [obs, setObs] = useState([]);
  const [goals, setGoals] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);

  useEffect(() => {
    getStaff().then(r => setStaff(r.data));
    getObservations().then(r => setObs(r.data));
    getGoals().then(r => setGoals(r.data));
  }, []);

  const depts = [...new Set(staff.map(s => s.department))];

  function deptStats(dept) {
    const s = staff.filter(x => x.department === dept);
    const avg = s.length ? (s.reduce((a,x) => a+x.score, 0)/s.length).toFixed(1) : 0;
    const g = goals.filter(x => s.map(y=>y.id).includes(x.staff_id));
    const goalPct = g.length ? Math.round(g.reduce((a,x)=>a+x.progress_pct,0)/g.length) : 0;
    return { count: s.length, avg, goalPct };
  }

  const totalAvg = staff.length ? (staff.reduce((a,s)=>a+s.score,0)/staff.length).toFixed(1) : 0;
  const onTrack = goals.filter(g=>g.progress_pct>=50).length;

  return (
    <div style={{ padding: 28 }}>
      <PageHeader title="Reports & Analytics" subtitle="School-wide performance overview" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Avg. Performance Score', value: `${totalAvg}/5` },
          { label: 'Total Observations', value: obs.length },
          { label: 'Goals On Track', value: `${onTrack}/${goals.length}` },
          { label: 'Departments', value: depts.length },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', border: '1px solid #E2DED8', borderRadius: 10, padding: '18px 20px' }}>
            <div style={{ fontSize: 11, color: '#9C9892', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', border: '1px solid #E2DED8', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '16px 20px', fontWeight: 600, borderBottom: '1px solid #E2DED8' }}>Department Breakdown</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F0EDE8' }}>
              {['Department','Staff','Avg Score','Goal Progress','AI Report'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#5C5955', textTransform: 'uppercase', borderBottom: '1px solid #E2DED8' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {depts.map(dept => {
              const s = deptStats(dept);
              return (
                <tr key={dept} style={{ borderBottom: '1px solid #E2DED8' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{dept}</td>
                  <td style={{ padding: '12px 16px', color: '#5C5955' }}>{s.count}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 600 }}>{s.avg}</span>
                      <div style={{ flex: 1, background: '#F0EDE8', borderRadius: 20, height: 6, minWidth: 80 }}>
                        <div style={{ width: `${(s.avg/5)*100}%`, height: '100%', borderRadius: 20, background: s.avg>=4?'#1A9A4D':s.avg>=3?'#2860B0':'#C53030' }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 600 }}>{s.goalPct}%</span>
                      <div style={{ flex: 1, background: '#F0EDE8', borderRadius: 20, height: 6, minWidth: 80 }}>
                        <div style={{ width: `${s.goalPct}%`, height: '100%', borderRadius: 20, background: s.goalPct>=70?'#1A9A4D':s.goalPct>=40?'#2860B0':'#C53030' }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => setSelectedDept(dept)} style={{ padding: '5px 12px', background: '#E8EFF9', color: '#1E4D8C', border: '1px solid #C0D4F0', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>✨ Generate</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedDept && (
        <div style={{ background: 'white', border: '1px solid #E2DED8', borderRadius: 10, padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>{selectedDept} Department Report</div>
          <AiPanel
            buttonLabel={`✨ Generate ${selectedDept} Report`}
            onGenerate={async () => {
              const s = deptStats(selectedDept);
              const res = await aiDepartmentReport({ department: selectedDept, avgScore: s.avg, staffCount: s.count, obsComplete: 75, goalProgress: s.goalPct });
              return res.data.report;
            }}
          />
        </div>
      )}
    </div>
  );
}
