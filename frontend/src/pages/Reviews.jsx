import { useEffect, useState } from 'react';
import { getReviews, getStaff, createReview, aiReviewSummary } from '../api';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import AiPanel from '../components/AiPanel';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ staff_id: '', review_type: 'Annual', period: '2025-2026', rating: 'Proficient', score: '', summary: '', due_date: '', status: 'Pending', reviewer: 'Dr. Walsh' });

  useEffect(() => {
    getReviews().then(r => setReviews(r.data));
    getStaff().then(r => setStaff(r.data));
  }, []);

  async function submit(e) {
    e.preventDefault();
    await createReview(form);
    setShowForm(false);
    getReviews().then(r => setReviews(r.data));
  }

  const ratingColor = r => ({ Exemplary:'purple', Proficient:'green', Developing:'blue', Basic:'amber', 'Needs Improvement':'red' }[r] || 'gray');

  return (
    <div style={{ padding: 28 }}>
      <PageHeader title="Performance Reviews" subtitle={`${reviews.filter(r=>r.status==='Pending').length} pending reviews`}
        action={<button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 16px', background: '#1E4D8C', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>+ New Review</button>} />

      {showForm && (
        <div style={{ background: 'white', border: '1px solid #E2DED8', borderRadius: 10, padding: 24, marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>New Performance Review</div>
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
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5955', marginBottom: 5 }}>Review Type</label>
                <select value={form.review_type} onChange={e => setForm({...form, review_type: e.target.value})} style={{ width: '100%', padding: '8px 10px', border: '1px solid #CBC7C0', borderRadius: 6, fontSize: 13 }}>
                  <option>Annual</option><option>Mid-Year</option><option>Probationary</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5955', marginBottom: 5 }}>Overall Rating</label>
                <select value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} style={{ width: '100%', padding: '8px 10px', border: '1px solid #CBC7C0', borderRadius: 6, fontSize: 13 }}>
                  {['Exemplary','Proficient','Developing','Basic','Needs Improvement'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5955', marginBottom: 5 }}>Score (out of 5)</label>
                <input type="number" min="1" max="5" step="0.1" value={form.score} onChange={e => setForm({...form, score: e.target.value})} style={{ width: '100%', padding: '8px 10px', border: '1px solid #CBC7C0', borderRadius: 6, fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5955', marginBottom: 5 }}>Due Date</label>
                <input type="date" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} style={{ width: '100%', padding: '8px 10px', border: '1px solid #CBC7C0', borderRadius: 6, fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5955', marginBottom: 5 }}>Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} style={{ width: '100%', padding: '8px 10px', border: '1px solid #CBC7C0', borderRadius: 6, fontSize: 13 }}>
                  <option>Pending</option><option>In Progress</option><option>Completed</option>
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5955', marginBottom: 5 }}>Summary</label>
                <textarea value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} rows={4} placeholder="Write review summary..." style={{ width: '100%', padding: '8px 10px', border: '1px solid #CBC7C0', borderRadius: 6, fontSize: 13, resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <AiPanel buttonLabel="✨ Draft Summary with AI" onGenerate={async () => {
                const s = staff.find(x => x.id === Number(form.staff_id));
                if (!s) return 'Please select a staff member first.';
                const res = await aiReviewSummary({ staffName: s.name, department: s.department, rating: form.rating, scores: { overall: form.score } });
                setForm(f => ({ ...f, summary: res.data.summary }));
                return res.data.summary;
              }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" style={{ padding: '8px 20px', background: '#1E4D8C', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Save Review</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '8px 16px', background: '#F0EDE8', color: '#5C5955', border: '1px solid #CBC7C0', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: 'white', border: '1px solid #E2DED8', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F0EDE8' }}>
              {['Staff Member','Type','Period','Rating','Score','Due Date','Status'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#5C5955', textTransform: 'uppercase', borderBottom: '1px solid #E2DED8' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#9C9892' }}>No reviews yet. Click "+ New Review" to get started.</td></tr>
            ) : reviews.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #E2DED8' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: r.avatar_color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700 }}>{r.avatar_initials}</div>
                    {r.staff_name}
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{r.review_type}</td>
                <td style={{ padding: '12px 16px', color: '#5C5955', fontSize: 13 }}>{r.period}</td>
                <td style={{ padding: '12px 16px' }}><Badge label={r.rating || '—'} color={ratingColor(r.rating)} /></td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{r.score ? `${r.score}/5` : '—'}</td>
                <td style={{ padding: '12px 16px', color: '#5C5955', fontSize: 13 }}>{r.due_date || '—'}</td>
                <td style={{ padding: '12px 16px' }}><Badge label={r.status} color={r.status==='Completed'?'green':r.status==='In Progress'?'blue':'amber'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
