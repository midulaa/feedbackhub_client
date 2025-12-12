// UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/* -------------------------
   useLocalStorage hook
-------------------------- */
function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch (e) {
      return initial;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value;
      setState(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  };

  return [state, setValue];
}

/* -------------------------
   User Dashboard Root
-------------------------- */
const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const render = () => {
    switch (activeTab) {
      case 'feedback': return <SubmitFeedback />;
      case 'complaint': return <SubmitComplaint />;
      case 'myfeedbacks': return <MyFeedbacks />;
      case 'mycomplaints': return <MyComplaints />;
      case 'profile': return <UserProfile />;
      default: return <UserOverview />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <UserSidebar active={activeTab} setActive={setActiveTab} navigate={navigate} />
      <main className="flex-1 p-6">{render()}</main>
    </div>
  );
};

export default UserDashboard;

/* -------------------------
   Sidebar (dark slate blue)
-------------------------- */
function UserSidebar({ active, setActive, navigate }) {
  return (
    <aside className="w-64 bg-slate-800 text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-slate-700 text-xl font-semibold">Feedhub User</div>

      <nav className="flex-1 p-3 space-y-1">
        <NavItem label="Dashboard" id="overview" active={active} setActive={setActive} />
        <NavItem label="Submit Feedback" id="feedback" active={active} setActive={setActive} />
        <NavItem label="Submit Complaint" id="complaint" active={active} setActive={setActive} />
        <NavItem label="My Feedbacks" id="myfeedbacks" active={active} setActive={setActive} />
        <NavItem label="My Complaints" id="mycomplaints" active={active} setActive={setActive} />
        <NavItem label="Profile" id="profile" active={active} setActive={setActive} />
      </nav>

      <button
        onClick={() => navigate('/')}
        className="m-4 py-2 bg-white text-slate-800 rounded-md font-medium"
      >Logout</button>
    </aside>
  );
}

function NavItem({ label, id, active, setActive }) {
  return (
    <button
      onClick={() => setActive(id)}
      className={`w-full text-left px-3 py-2 rounded-md transition ${
        active === id ? 'bg-slate-700' : 'hover:bg-slate-700/40'
      }`}
    >{label}</button>
  );
}

/* -------------------------
   Overview
-------------------------- */
function UserOverview() {
  const [feedbacks] = useLocalStorage('feedhub_feedbacks', []);
  const [complaints] = useLocalStorage('feedhub_complaints', []);

  const user = localStorage.getItem('current_user') || 'User';

  const myFeedbacks = feedbacks.filter(f => f.user === user);
  const myComplaints = complaints.filter(c => c.user === user);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Welcome, {user}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="My Feedbacks" value={myFeedbacks.length} />
        <Card title="My Complaints" value={myComplaints.length} />
        <Card title="Resolved Complaints" value={myComplaints.filter(c => c.status==='resolved').length} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-3xl font-bold text-slate-800">{value}</div>
    </div>
  );
}

/* -------------------------
   Submit Feedback
-------------------------- */
function SubmitFeedback() {
  const [feedbacks, setFeedbacks] = useLocalStorage('feedhub_feedbacks', []);
  const [categories] = useLocalStorage('feedhub_categories', []);
  const user = localStorage.getItem('current_user') || 'User';

  const [form, setForm] = useState({ title: '', message: '', category: '' });

  function submit(e) {
    e.preventDefault();
    const id = 'fb' + Date.now();

    setFeedbacks([{ ...form, id, user, date: new Date().toLocaleDateString(), status: 'pending' }, ...feedbacks]);
    alert('Feedback submitted!');
    setForm({ title: '', message: '', category: '' });
  }

  return (
    <div className="max-w-xl bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold text-slate-800 mb-3">Submit Feedback</h2>

      <form onSubmit={submit} className="space-y-3">
        <Input label="Title" value={form.title} onChange={e => setForm({...form, title:e.target.value})} />
        <Input label="Message" textarea value={form.message} onChange={e => setForm({...form, message:e.target.value})} />

        <label className="block text-sm text-gray-600">Category</label>
        <select className="w-full p-2 border rounded" value={form.category} onChange={e => setForm({...form, category:e.target.value})}>
          <option value="">Select category</option>
          {categories.map(c => <option key={c.id}>{c.name}</option>)}
        </select>

        <button className="px-3 py-2 bg-slate-800 text-white rounded">Submit</button>
      </form>
    </div>
  );
}

/* -------------------------
   Submit Complaint
-------------------------- */
function SubmitComplaint() {
  const [complaints, setComplaints] = useLocalStorage('feedhub_complaints', []);
  const [categories] = useLocalStorage('feedhub_categories', []);
  const user = localStorage.getItem('current_user') || 'User';

  const [form, setForm] = useState({ subject: '', message: '', category: '', priority: 'Low' });

  function submit(e) {
    e.preventDefault();
    const id = 'cmp' + Date.now();

    setComplaints([{ ...form, id, user, date: new Date().toLocaleDateString(), status: 'pending' }, ...complaints]);
    alert('Complaint submitted!');
    setForm({ subject: '', message: '', category: '', priority: 'Low' });
  }

  return (
    <div className="max-w-xl bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold text-slate-800 mb-3">Submit Complaint</h2>

      <form onSubmit={submit} className="space-y-3">
        <Input label="Subject" value={form.subject} onChange={e => setForm({...form, subject:e.target.value})} />
        <Input label="Message" textarea value={form.message} onChange={e => setForm({...form, message:e.target.value})} />

        <label className="block text-sm text-gray-600">Category</label>
        <select className="w-full p-2 border rounded" value={form.category} onChange={e => setForm({...form, category:e.target.value})}>
          <option value="">Select category</option>
          {categories.map(c => <option key={c.id}>{c.name}</option>)}
        </select>

        <label className="block text-sm text-gray-600">Priority</label>
        <select className="w-full p-2 border rounded" value={form.priority} onChange={e => setForm({...form, priority:e.target.value})}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button className="px-3 py-2 bg-slate-800 text-white rounded">Submit</button>
      </form>
    </div>
  );
}

/* -------------------------
   My Feedbacks
-------------------------- */
function MyFeedbacks() {
  const [feedbacks] = useLocalStorage('feedhub_feedbacks', []);
  const user = localStorage.getItem('current_user') || 'User';

  const list = feedbacks.filter(f => f.user === user);

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-800 mb-3">My Feedbacks</h2>

      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-3">
        {list.map(f => (
          <div key={f.id} className="border-b pb-2">
            <div className="font-medium text-slate-800">{f.title}</div>
            <div className="text-sm text-gray-600">Status: {f.status}</div>
            <div className="text-sm text-gray-600">Category: {f.category}</div>
            <div className="text-sm mt-1">{f.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------
   My Complaints
-------------------------- */
function MyComplaints() {
  const [complaints] = useLocalStorage('feedhub_complaints', []);
  const user = localStorage.getItem('current_user') || 'User';

  const list = complaints.filter(c => c.user === user);

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-800 mb-3">My Complaints</h2>

      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-3">
        {list.map(c => (
          <div key={c.id} className="border-b pb-2">
            <div className="font-medium text-slate-800">{c.subject}</div>
            <div className="text-sm text-gray-600">Status: {c.status}</div>
            <div className="text-sm text-gray-600">Priority: {c.priority}</div>
            <div className="text-sm text-gray-600">Category: {c.category}</div>
            <div className="text-sm mt-1">{c.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------
   Profile Page
-------------------------- */
function UserProfile() {
  const [profile, setProfile] = useState(() => {
    return JSON.parse(localStorage.getItem('current_user_profile') || '{"name":"User","email":"user@mail.com"}');
  });

  function save(e) {
    e.preventDefault();
    localStorage.setItem('current_user_profile', JSON.stringify(profile));
    alert('Profile Updated!');
  }

  return (
    <div className="max-w-lg bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold text-slate-800 mb-3">Profile</h2>

      <form onSubmit={save} className="space-y-3">
        <Input label="Name" value={profile.name} onChange={e => setProfile({...profile, name:e.target.value})} />
        <Input label="Email" value={profile.email} onChange={e => setProfile({...profile, email:e.target.value})} />

        <button className="px-3 py-2 bg-slate-800 text-white rounded">Save</button>
      </form>
    </div>
  );
}

/* -------------------------
   Input Component
-------------------------- */
function Input({ label, textarea, ...props }) {
  return (
    <label className="block">
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      {textarea ? (
        <textarea className="w-full p-2 border rounded" rows="4" {...props} />
      ) : (
        <input className="w-full p-2 border rounded" {...props} />
      )}
    </label>
  );
}