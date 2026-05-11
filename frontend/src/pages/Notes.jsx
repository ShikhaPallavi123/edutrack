import { useEffect, useState } from 'react';
import { getNotes, createNote, getStaff, aiEnhanceNote } from '../api';
import PageHeader from '../components/PageHeader';
import AiPanel from '../components/AiPanel';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ staff_id: '', title: '', content: '', note_type: 'General', tags: '' });

  useEffect(() => {
    getNotes().then(r => { setNotes(r.data); if(r.data.length) setSelected(r.data[0]); });
    getStaff().then(r => setStaff(r.data));
  }, []);

  async function save() {
    await createNote(form);
    getNotes().then(r => { setNotes(r.data); setSelected(r.data[0]); });
    setForm({ staff_id: '', title: '', content: '', note_type: 'General', tags: '' });
  }

  return (
    <div style={{ padding: 28 }}>
      <PageHeader title="Notes & Documentation" />
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, height: 'calc(100vh - 160px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
          <button onClick={() => setSelected(null)} style={{ padding: '10px 14px', background: '#1E4D8C', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>+ New Note</button>
          {notes.map(n => (
            <div key={n.id} onClick={() => setSelected(n)} style={{ background: selected?.id===n.id?'white':'white', border: `1.5px solid ${selected?.id===n.id?'#2860B0':'#E2DED8'}`, borderRadius: 8, padding: 12, cursor: 'pointer' }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{n.title}</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 11, background: '#F0EDE8', color: '#5C5955', padding: '2px 7px', borderRadius: 20 }}>{n.note_type}</span>
                <span style={{ fontSize: 11, color: '#9C9892' }}>{n.created_at?.slice(0,10)}</span>
              </div>
              <div style={{ fontSize: 12, color: '#9C9892', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.content?.slice(0,50)}...</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', border: '1px solid #E2DED8', borderRadius: 10, padding: 24, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {selected ? (
            <>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{selected.title}</div>
              <div style={{ fontSize: 12, color: '#9C9892', marginBottom: 20 }}>{selected.note_type} · {selected.staff_name || 'School-wide'} · {selected.created_at?.slice(0,10)}</div>
              <div style={{ flex: 1, fontSize: 14, lineHeight: 1.8, color: '#1A1917', whiteSpace: 'pre-wrap', overflowY: 'auto', marginBottom: 16 }}>{selected.content}</div>
              <AiPanel buttonLabel="✨ AI Enhance Note" onGenerate={async () => {
                const res = await aiEnhanceNote({ content: selected.content });
                return res.data.enhancement;
              }} />
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>New Note</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5955', marginBottom: 5 }}>Staff Member</label>
                  <select value={form.staff_id} onChange={e => setForm({...form, staff_id: e.target.value})} style={{ width: '100%', padding: '8px 10px', border: '1px solid #CBC7C0', borderRadius: 6, fontSize: 13 }}>
                    <option value="">School-wide</option>
                    {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5955', marginBottom: 5 }}>Note Type</label>
                  <select value={form.note_type} onChange={e => setForm({...form, note_type: e.target.value})} style={{ width: '100%', padding: '8px 10px', border: '1px solid #CBC7C0', borderRadius: 6, fontSize: 13 }}>
                    {['General','Observation Note','Coaching Note','Meeting Note','Documentation'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5955', marginBottom: 5 }}>Title</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Note title..." style={{ width: '100%', padding: '8px 10px', border: '1px solid #CBC7C0', borderRadius: 6, fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5955', marginBottom: 5 }}>Content</label>
                <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={8} placeholder="Write your note here..." style={{ width: '100%', padding: '8px 10px', border: '1px solid #CBC7C0', borderRadius: 6, fontSize: 13, resize: 'vertical', lineHeight: 1.6 }} />
              </div>
              <button onClick={save} style={{ padding: '9px 20px', background: '#1E4D8C', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 13, alignSelf: 'flex-start' }}>Save Note</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
