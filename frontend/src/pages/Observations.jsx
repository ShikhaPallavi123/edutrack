import { useEffect, useState } from 'react';
import { getObservations, getStaff, createObservation, aiObservationSummary } from '../api';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import AiPanel from '../components/AiPanel';

export default function Observations() {
  const [obs, setObs] = useState([]);
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ staff_id: '', date: '', grade_subject: '', obs_type: 'Formal', domain1: '', domain2: '', domain3: '', domain4: '', domain5: '', strengths: '', growth_areas: '', notes: '', status: 'Completed' });

  useEffect(() => {
    getObservations().then(r => setObs(r.data));
    getStaff().then(r => setStaff(r.data));
  }, []);

  const scoreColor = s => s >= 4.5 ? 'purple' : s >= 4 ? 'green' : s >= 3 ? 'blue' : s >= 2 ? 'amber' : 'red';

  async function submit(e) {
    e.preventDefault();
    const domains = [form.domain1, form.domain2, form.domain3, form.domain4, form.domain5].map(Number);
    const score = (domains.reduce((a,b) => a+b, 0) / domains.length).toFixed(1);
    await createObservation({ ...form, score });
    setShowForm(false);
    getObservations().then(r => setObs(r.data));
  }

  return (
    <div style={{ padding: 28 }}>
      <PageHeader title="Classroom Observations" subtitle={`${obs.length} observations on record`}
        action={<button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 16px', background: '#1E4D8C', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>+ New Observation</button>} />

      {showForm && (
        <div style={{ background: 'white', border: '1px solid #E2DED8', borderRadius: 10, padding: 24, marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>New Classroom Observation</div>
          <form onSubmit={submit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5955', marginBottom: 5 }}>Teacher</label>
                <select value={form.staff_id} onChange={e => setForm({...form, staff_id: e.target.value})} required style={{ width: '100%', padding: '8px 10px', border: '1px solid #CBC7C0', borderRadius: 6, fontSize: 13 }}>
                  <option value="">Select teacher...</option>
                  {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5955', marginBottom: 5 }}>Date</label>
                <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required style={{ width: '100%', padding: '8px 10px', border: '1px solid #CBC7C0', borderRadius: 6, fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5955', marginBottom: 5 }}>Grade & Subject</label>
                <input value={form.grade_subject} onChange={e => setForm({...form, grade_subject: e.target.value})} placeholder="e.g. Grade 4 · Mathematics" required style={{ width: '100%', padding: '8px 10px', border: '1px solid #CBC7C0', borderRadius: 6, fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5955', marginBottom: 5 }}>Type</label>
                <select value={form.obs_type} onChange={e => setForm({...form, obs_type: e.target.value})} style={{ width: '100%', padding: '8px 10px', border: '1px solid #CBC7C0', borderRadius: 6, fontSize: 13 }}>
                  <option>Formal</option><option>Informal</option><option>Walkthrough</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#5C5955', marginBottom: 8 }}>Domain Scores (1–4)</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
                {['Classroom Env.','Instruction','Engagement','Assessment','Professional'].map((d,i) => (
                  <div key={i}>
                    <label style={{ display: 'block', fontSize: 11, color: '#9C9892', marginBottom: 4 }}>{d}</label>
                    <input type="number" min="1" max="4" step="0.1" value={form[`domain${i+1}`]} onChange={e => setForm({...form, [`domain${i+1}`]: e.target.value})} required style={{ width: '100%', padding: '7px 8px', border: '1px solid #CBC7C0', borderRadius: 6, fontSize: 13 }} />
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5955', marginBottom: 5 }}>Strengths</label>
                <textarea value={form.strengths} onChange={e => setForm({...form, strengths: e.target.value})} rows={3} style={{ width: '100%', padding: '8px 10px', border: '1px solid #CBC7C0', borderRadius: 6, fontSize: 13, resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5955', marginBottom: 5 }}>Growth Areas</label>
                <textarea value={form.growth_areas} onChange={e => setForm({...form, growth_areas: e.target.value})} rows={3} style={{ width: '100%', padding: '8px 10px', border: '1px solid #CBC7C0', borderRadius: 6, fontSize: 13, resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" style={{ padding: '8px 20px', background: '#1E4D8C', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Save Observation</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '8px 16px', background: '#F0EDE8', color: '#5C5955', border: '1px solid #CBC7C0', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {selected && (
        <div style={{ background: 'white', border: '1px solid #E2DED8', borderRadius: 10, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Observation Report — {selected.staff_name}</div>
              <div style={{ fontSize: 13, color: '#5C5955', marginTop: 3 }}>{selected.grade_subject} · {selected.date}</div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#9C9892' }}>✕</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, marginBottom: 20 }}>
            {['Classroom Env.','Instruction','Engagement','Assessment','Professional'].map((d,i) => (
              <div key={i} style={{ background: '#F0EDE8', borderRadius: 8, padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#1E4D8C' }}>{selected[`domain${i+1}`]}</div>
                <div style={{ fontSize: 11, color: '#5C5955', marginTop: 4 }}>{d}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div style={{ background: '#E4F3EB', borderRadius: 8, padding: 14 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#1A6B3A', marginBottom: 8 }}>✓ Strengths</div>
              <p style={{ fontSize: 13, color: '#1A1917' }}>{selected.strengths}</p>
            </div>
            <div style={{ background: '#FBF0DA', borderRadius: 8, padding: 14 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#8B5E0A', marginBottom: 8 }}>△ Growth Areas</div>
              <p style={{ fontSize: 13, color: '#1A1917' }}>{selected.growth_areas}</p>
            </div>
          </div>
          <AiPanel
            buttonLabel="✨ Generate AI Summary"
            onGenerate={async () => {
              const res = await aiObservationSummary({ staffName: selected.staff_name, gradeSubject: selected.grade_subject, scores: { domain1: selected.domain1, domain2: selected.domain2, domain3: selected.domain3, domain4: selected.domain4, domain5: selected.domain5 }, strengths: selected.strengths, growthAreas: selected.growth_areas });
              return res.data.summary;
            }}
          />
        </div>
      )}

      <div style={{ background: 'white', border: '1px solid #E2DED8', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F0EDE8' }}>
              {['Teacher','Date','Grade/Subject','Type','Score','Status',''].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#5C5955', textTransform: 'uppercase', borderBottom: '1px solid #E2DED8' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {obs.map(o => (
              <tr key={o.id} style={{ borderBottom: '1px solid #E2DED8' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: o.avatar_color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700 }}>{o.avatar_initials}</div>
                    {o.staff_name}
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: '#5C5955', fontSize: 13 }}>{o.date}</td>
                <td style={{ padding: '12px 16px', color: '#5C5955', fontSize: 13 }}>{o.grade_subject}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{o.obs_type}</td>
                <td style={{ padding: '12px 16px' }}><Badge label={`${o.score}/5`} color={scoreColor(o.score)} /></td>
                <td style={{ padding: '12px 16px' }}><Badge label={o.status} color={o.status==='Completed'?'green':'amber'} /></td>
                <td style={{ padding: '12px 16px' }}><button onClick={() => setSelected(o)} style={{ padding: '5px 12px', background: '#F0EDE8', border: '1px solid #CBC7C0', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
