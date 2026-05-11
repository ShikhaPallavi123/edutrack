import { useEffect, useState } from 'react';
import { getGoals, createGoal, updateGoal, getStaff } from '../api';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ staff_id: '', title: '', category: 'Instruction Quality', due_date: '', progress_pct: 0 });

  useEffect(() => {
    getGoals().then(r => setGoals(r.data));
    getStaff().then(r => setStaff(r.data));
  }, []);

  async function submit(e) {
    e.preventDefault();
    await createGoal(form);
    setShowForm(false);
    getGoals().then(r => setGoals(r.data));
  }

  async function updateProgress(id, pct) {
    await updateGoal(id, { progress_pct: pct, status: pct >= 100 ? 'Completed' : 'Active', title: goals.find(g=>g.id===id)?.title, category: goals.find(g=>g.id===id)?.category });
    getGoals().then(r => setGoals(r.data));
  }

  return (
    <div style={{ padding: 28 }}>
      <PageHeader title="Goal Tracking" subtitle={`${goals.length} active goals`}
        action={<button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 16px', background: '#1E4D8C', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>+ New Goal</button>} />

      {showForm && (
        <div style={{ background: 'white', border: '1px solid #E2DED8', borderRadius: 10, padding: 24, marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Set New Goal</div>
          <form onSubmit={submit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5955', marginBottom: 5 }}>Staff Member</label>
                <select value={form.staff_id} onChange={e => setForm({...form, staff_id: e.target.value})} required style={{ width: '100%', padding: '8px 10px', border: '1px solid #CBC7C0', borderRadius: 6, fontSize: 13 }}>
                  <option value="">Select staff...</option>
                  {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5955', marginBottom: 5 }}>Category</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ width: '100%', padding: '8px 10px', border: '1px solid #CBC7C0', borderRadius: 6, fontSize: 13 }}>
                  {['Instruction Quality','Student Engagement','Classroom Management','Professional Dev.','Student Outcomes'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5955', marginBottom: 5 }}>Goal Title</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="e.g. Implement formative assessment strategies..." style={{ width: '100%', padding: '8px 10px', border: '1px solid #CBC7C0', borderRadius: 6, fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5955', marginBottom: 5 }}>Due Date</label>
                <input type="date" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} style={{ width: '100%', padding: '8px 10px', border: '1px solid #CBC7C0', borderRadius: 6, fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5955', marginBottom: 5 }}>Initial Progress %</label>
                <input type="number" min="0" max="100" value={form.progress_pct} onChange={e => setForm({...form, progress_pct: e.target.value})} style={{ width: '100%', padding: '8px 10px', border: '1px solid #CBC7C0', borderRadius: 6, fontSize: 13 }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" style={{ padding: '8px 20px', background: '#1E4D8C', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Create Goal</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '8px 16px', background: '#F0EDE8', color: '#5C5955', border: '1px solid #CBC7C0', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {goals.map(g => (
          <div key={g.id} style={{ background: 'white', border: '1px solid #E2DED8', borderRadius: 10, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: g.avatar_color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700 }}>{g.avatar_initials}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{g.title}</div>
                  <div style={{ fontSize: 12, color: '#9C9892', marginTop: 2 }}>{g.staff_name} · {g.category}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Badge label={`${g.progress_pct}%`} color={g.progress_pct>=70?'green':g.progress_pct>=40?'blue':'red'} />
                <span style={{ fontSize: 12, color: '#9C9892' }}>Due {g.due_date}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, background: '#F0EDE8', borderRadius: 20, height: 8 }}>
                <div style={{ width: `${g.progress_pct}%`, height: '100%', borderRadius: 20, background: g.progress_pct>=70?'#1A9A4D':g.progress_pct>=40?'#2860B0':'#C53030', transition: 'width 0.4s' }} />
              </div>
              <input type="range" min="0" max="100" value={g.progress_pct} onChange={e => updateProgress(g.id, Number(e.target.value))} style={{ width: 80, accentColor: '#1E4D8C' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
