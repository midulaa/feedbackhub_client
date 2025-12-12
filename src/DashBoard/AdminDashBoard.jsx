// AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* -------------------------
   useLocalStorage (same pattern)
   ------------------------- */
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
   Helper: seed default categories if not present
   ------------------------- */
function seedCategoriesIfNeeded() {
  const existing = JSON.parse(localStorage.getItem('feedhub_categories') || 'null');
  if (!existing) {
    const defaults = [
      { id: 'cat_ui', name: 'UI / UX' },
      { id: 'cat_bug', name: 'Bug' },
      { id: 'cat_feature', name: 'Feature Request' },
      { id: 'cat_perf', name: 'Performance' },
      { id: 'cat_service', name: 'Service' },
      { id: 'cat_other', name: 'Others' },
    ];
    localStorage.setItem('feedhub_categories', JSON.stringify(defaults));
  }
}

/* -------------------------
   Root Admin Dashboard (single file)
   ------------------------- */
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Seed categories on mount
  useEffect(() => { seedCategoriesIfNeeded(); }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <AdminUsers />;
      case 'feedbacks':
        return <AdminFeedbacks />;
      case 'complaints':
        return <AdminComplaints />;
      case 'categories':
        return <AdminCategories />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'profile':
        return <AdminProfile />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#faf8ff] to-white">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  );
};

export default AdminDashboard;

/* -------------------------
   Sidebar (dark premium)
   ------------------------- */
function AdminSidebar({ activeTab, setActiveTab }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) navigate('/');
  };

  return (
    <aside
      className={`flex flex-col ${collapsed ? 'w-20' : 'w-64'} transition-width duration-200`}
      >
      <div className={`flex flex-col h-full bg-[#2a1a3a] text-white`}>
        <div className="flex items-center justify-between p-4 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className={`rounded-md p-2 bg-[#4c3370] ${collapsed ? 'text-sm' : 'text-lg font-bold'}`}>
              {collapsed ? 'FH' : 'Feedhub Admin'}
            </div>
          </div>
          <button className="text-white/80 text-sm" onClick={() => setCollapsed(c => !c)}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-1">
            <SidebarItem label="Dashboard" id="overview" active={activeTab==='overview'} onClick={()=>setActiveTab('overview')} />
            <SidebarItem label="Users" id="users" active={activeTab==='users'} onClick={()=>setActiveTab('users')} />
            <SidebarItem label="Feedbacks" id="feedbacks" active={activeTab==='feedbacks'} onClick={()=>setActiveTab('feedbacks')} />
            <SidebarItem label="Complaints" id="complaints" active={activeTab==='complaints'} onClick={()=>setActiveTab('complaints')} />
            <SidebarItem label="Categories" id="categories" active={activeTab==='categories'} onClick={()=>setActiveTab('categories')} />
            <SidebarItem label="Analytics" id="analytics" active={activeTab==='analytics'} onClick={()=>setActiveTab('analytics')} />
            <SidebarItem label="Profile" id="profile" active={activeTab==='profile'} onClick={()=>setActiveTab('profile')} />
          </ul>
        </nav>

        <div className="p-4 border-t border-white/8">
          <button onClick={handleLogout} className="w-full bg-white text-[#2a1a3a] font-medium py-2 rounded-md shadow-sm">Logout</button>
          <div className="text-xs text-white/60 mt-3">© Feedhub</div>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ label, id, active, onClick }) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 transition
          ${active ? 'bg-[#4c3370] text-white font-semibold' : 'text-white/80 hover:bg-white/5'}`}
      >
        <span className="text-md">•</span>
        <span className="truncate">{label}</span>
      </button>
    </li>
  );
}

/* -------------------------
   Overview Panel
   ------------------------- */
function AdminOverview() {
  const users = JSON.parse(localStorage.getItem('feedhub_users') || '[]');
  const feedbacks = JSON.parse(localStorage.getItem('feedhub_feedbacks') || '[]');
  const complaints = JSON.parse(localStorage.getItem('feedhub_complaints') || '[]');
  const categories = JSON.parse(localStorage.getItem('feedhub_categories') || '[]');

  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
  const approvedFeedbacks = feedbacks.filter(f => f.status === 'Resolved').length;
  const avgRating = feedbacks.length ? (feedbacks.reduce((s,f)=> s + (f.rating||0),0)/feedbacks.length).toFixed(2) : '0.00';

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#3b1f4b]">Admin Dashboard</h1>
          <p className="text-sm text-[#5a3b6f]">Overview & quick stats</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={users.length} />
        <StatCard title="Total Feedbacks" value={feedbacks.length} />
        <StatCard title="Total Complaints" value={complaints.length} />
        <StatCard title="Categories" value={categories.length} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold text-sm text-[#5a3b6f] mb-2">Pending Complaints</h3>
          <div className="text-2xl font-bold text-[#3b1f4b]">{pendingComplaints}</div>
        </Card>

        <Card>
          <h3 className="font-semibold text-sm text-[#5a3b6f] mb-2">Resolved Feedbacks</h3>
          <div className="text-2xl font-bold text-[#3b1f4b]">{approvedFeedbacks}</div>
        </Card>

        <Card>
          <h3 className="font-semibold text-sm text-[#5a3b6f] mb-2">Average Rating</h3>
          <div className="text-2xl font-bold text-[#3b1f4b]">{avgRating}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RecentList title="Latest Feedbacks" items={(JSON.parse(localStorage.getItem('feedhub_feedbacks')||'[]')).slice(0,6).map(f=> ({id:f.id, label: f.title || (f.message||'').slice(0,60), meta:`${f.user || 'Anon'} • ${f.rating||'-'}★`}))} />
        <RecentList title="Latest Complaints" items={(JSON.parse(localStorage.getItem('feedhub_complaints')||'[]')).slice(0,6).map(c=> ({id:c.id, label: c.subject|| (c.message||'').slice(0,60), meta:`${c.user||'Anon'} • ${c.status||'Pending'}` }))} />
      </div>
    </section>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-[#f0e9f8]">
      <div className="text-sm text-[#6b4f7a]">{title}</div>
      <div className="text-3xl font-bold text-[#3b1f4b]">{value}</div>
    </div>
  );
}

function Card({ children }) {
  return <div className="bg-white rounded-lg p-4 shadow-sm border border-[#f0e9f8]">{children}</div>;
}

function RecentList({ title, items = [] }) {
  return (
    <Card>
      <h3 className="font-semibold text-sm text-[#5a3b6f] mb-2">{title}</h3>
      <ul className="space-y-2">
        {items.length === 0 && <li className="text-sm text-gray-500">No items.</li>}
        {items.map(i => (
          <li key={i.id} className="text-sm">
            <div className="font-medium text-[#3b1f4b]">{i.label}</div>
            <div className="text-xs text-gray-500">{i.meta}</div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* -------------------------
   Users Management (READ + block/unblock + delete)
   Admin cannot add users here.
   ------------------------- */
function AdminUsers() {
  const [users, setUsers] = useLocalStorage('feedhub_users', []);

  function toggleBlock(id) {
    setUsers(u => u.map(x => x.id === id ? { ...x, blocked: !x.blocked } : x));
  }

  function handleDelete(id) {
    if (!confirm('Delete this user?')) return;
    setUsers(u => u.filter(x => x.id !== id));
    // optionally remove their submissions
    const feedbacks = JSON.parse(localStorage.getItem('feedhub_feedbacks') || '[]').filter(f=>f.userId !== id);
    const complaints = JSON.parse(localStorage.getItem('feedhub_complaints') || '[]').filter(c=>c.userId !== id);
    localStorage.setItem('feedhub_feedbacks', JSON.stringify(feedbacks));
    localStorage.setItem('feedhub_complaints', JSON.stringify(complaints));
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#3b1f4b]">Users</h2>
        <div className="text-sm text-gray-500">Users register themselves — admin can block or delete.</div>
      </div>

      <div className="bg-white rounded-lg p-3 border border-[#f0e9f8] shadow-sm">
        <table className="w-full text-sm">
          <thead className="text-xs text-[#6b4f7a]">
            <tr>
              <th className="py-2 text-left">Name</th>
              <th className="py-2 text-left">Email</th>
              <th className="py-2 text-left">Phone</th>
              <th className="py-2 text-left">Status</th>
              <th className="py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && <tr><td colSpan="5" className="py-6 text-center text-gray-500">No registered users found.</td></tr>}
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="py-2">{u.name}</td>
                <td className="py-2">{u.email}</td>
                <td className="py-2">{u.phone || '-'}</td>
                <td className="py-2">{u.blocked ? 'Blocked' : 'Active'}</td>
                <td className="py-2 space-x-2">
                  <button onClick={() => toggleBlock(u.id)} className={`px-2 py-1 text-sm rounded ${u.blocked ? 'bg-yellow-50 text-yellow-700' : 'bg-white border text-[#4c3370]'}`}>
                    {u.blocked ? 'Unblock' : 'Block'}
                  </button>
                  <button onClick={() => handleDelete(u.id)} className="px-2 py-1 text-sm bg-red-50 border border-red-200 rounded text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* -------------------------
   Feedbacks Management (with status + admin remark modal)
   ------------------------- */
function AdminFeedbacks() {
  const [feedbacks, setFeedbacks] = useLocalStorage('feedhub_feedbacks', []);
  const [filter, setFilter] = useState('all');

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [modalStatus, setModalStatus] = useState('Pending');
  const [modalRemark, setModalRemark] = useState('');

  function openModal(item) {
    setSelected(item);
    setModalStatus(item.status || 'Pending');
    setModalRemark(item.adminRemark || '');
    setModalOpen(true);
  }

  function saveStatus() {
    if (!selected) return;
    setFeedbacks(f => f.map(x => x.id === selected.id ? { ...x, status: modalStatus, adminRemark: modalRemark } : x));
    setModalOpen(false);
    setSelected(null);
  }

  function del(id) {
    if (!confirm('Delete this feedback?')) return;
    setFeedbacks(f => f.filter(x => x.id !== id));
  }

  const list = feedbacks.filter(f => filter === 'all' ? true : f.status === filter);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#3b1f4b]">Feedbacks</h2>
        <div className="flex items-center gap-2">
          <select className="border rounded px-2 py-1" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="In Process">In Process</option>
            <option value="Resolved">Resolved</option>
            <option value="Unresolved">Unresolved</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg p-3 border border-[#f0e9f8] shadow-sm">
        {list.length === 0 && <div className="py-6 text-center text-gray-500">No feedbacks.</div>}
        {list.map(f => (
          <div key={f.id} className="border-b last:border-b-0 py-3">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <div className="font-medium text-[#3b1f4b]">{f.title || (f.message || '').slice(0, 60)}</div>
                <div className="text-xs text-gray-500">{f.user || 'Anon'} • {f.date || '-'}</div>
                <div className="mt-2 text-sm text-gray-700">{f.message}</div>
                <div className="mt-2 text-xs text-gray-500">Category: {f.category || 'General'} • Rating: {f.rating ?? '-'}</div>
                {f.adminRemark && <div className="mt-2 text-sm text-[#5a3b6f]">Admin remark: {f.adminRemark}</div>}
              </div>

              <div className="flex-shrink-0 flex flex-col gap-2 items-end">
                <div className="text-xs text-gray-600">Status: <span className="font-medium text-[#4c3370]">{f.status || 'Pending'}</span></div>

                <div className="flex flex-col gap-2">
                  <button onClick={() => openModal(f)} className="px-2 py-1 bg-[#4c3370] text-white rounded text-sm">Update</button>
                  <button onClick={() => del(f.id)} className="px-2 py-1 bg-red-50 text-red-600 rounded text-sm">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && selected && (
        <Modal onClose={() => { setModalOpen(false); setSelected(null); }}>
          <h3 className="text-lg font-semibold text-[#3b1f4b] mb-2">Update Status</h3>
          <label className="block mb-2 text-sm">
            Select Status
            <select className="mt-1 w-full px-3 py-2 border rounded" value={modalStatus} onChange={e=>setModalStatus(e.target.value)}>
              <option>Pending</option>
              <option>In Process</option>
              <option>Resolved</option>
              <option>Unresolved</option>
            </select>
          </label>

          <label className="block mb-3 text-sm">
            Admin Remark (optional)
            <textarea className="mt-1 w-full px-3 py-2 border rounded" rows={4} value={modalRemark} onChange={e=>setModalRemark(e.target.value)} />
          </label>

          <div className="flex justify-end gap-2">
            <button onClick={() => { setModalOpen(false); setSelected(null); }} className="px-3 py-2 border rounded">Cancel</button>
            <button onClick={saveStatus} className="px-3 py-2 bg-[#4c3370] text-white rounded">Save</button>
          </div>
        </Modal>
      )}
    </section>
  );
}

/* -------------------------
   Complaints Management (with status + remark modal)
   ------------------------- */
function AdminComplaints() {
  const [complaints, setComplaints] = useLocalStorage('feedhub_complaints', []);
  const [filter, setFilter] = useState('all');

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [modalStatus, setModalStatus] = useState('Pending');
  const [modalRemark, setModalRemark] = useState('');

  function openModal(item) {
    setSelected(item);
    setModalStatus(item.status || 'Pending');
    setModalRemark(item.adminRemark || '');
    setModalOpen(true);
  }

  function saveStatus() {
    if (!selected) return;
    setComplaints(c => c.map(x => x.id === selected.id ? { ...x, status: modalStatus, adminRemark: modalRemark } : x));
    setModalOpen(false);
    setSelected(null);
  }

  function assign(id) {
    const assignee = prompt('Assign to (admin name):');
    if (!assignee) return;
    setComplaints(c => c.map(x => x.id === id ? { ...x, assignedTo: assignee, status: 'In Process' } : x));
  }

  function del(id) {
    if (!confirm('Delete this complaint?')) return;
    setComplaints(c => c.filter(x => x.id !== id));
  }

  const list = complaints.filter(c => filter === 'all' ? true : c.status === filter);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#3b1f4b]">Complaints</h2>
        <div className="flex items-center gap-2">
          <select className="border rounded px-2 py-1" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="In Process">In Process</option>
            <option value="Resolved">Resolved</option>
            <option value="Unresolved">Unresolved</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg p-3 border border-[#f0e9f8] shadow-sm">
        {list.length === 0 && <div className="py-6 text-center text-gray-500">No complaints.</div>}
        {list.map(c => (
          <div key={c.id} className="border-b last:border-b-0 py-3">
            <div className="flex justify-between">
              <div className="flex-1 pr-4">
                <div className="font-medium text-[#3b1f4b]">{c.subject || (c.message || '').slice(0, 60)}</div>
                <div className="text-xs text-gray-500">{c.user || 'Anon'} • {c.date || '-'}</div>
                <div className="mt-2 text-sm text-gray-700">{c.message}</div>
                <div className="mt-2 text-xs text-gray-500">Category: {c.category || 'General'}</div>
                {c.adminRemark && <div className="mt-2 text-sm text-[#5a3b6f]">Admin remark: {c.adminRemark}</div>}
                {c.assignedTo && <div className="mt-1 text-xs text-gray-500">Assigned to: {c.assignedTo}</div>}
              </div>

              <div className="flex flex-col gap-2 items-end">
                <div className="text-sm text-gray-600">Status: <span className="font-medium text-[#4c3370]">{c.status || 'Pending'}</span></div>

                <div className="flex gap-2">
                  <button onClick={() => openModal(c)} className="px-2 py-1 bg-[#4c3370] text-white rounded text-sm">Update</button>
                  <button onClick={() => assign(c.id)} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-sm">Assign</button>
                  <button onClick={() => del(c.id)} className="px-2 py-1 bg-red-50 text-red-600 rounded text-sm">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && selected && (
        <Modal onClose={() => { setModalOpen(false); setSelected(null); }}>
          <h3 className="text-lg font-semibold text-[#3b1f4b] mb-2">Update Status</h3>
          <label className="block mb-2 text-sm">
            Select Status
            <select className="mt-1 w-full px-3 py-2 border rounded" value={modalStatus} onChange={e=>setModalStatus(e.target.value)}>
              <option>Pending</option>
              <option>In Process</option>
              <option>Resolved</option>
              <option>Unresolved</option>
            </select>
          </label>

          <label className="block mb-3 text-sm">
            Admin Remark (optional)
            <textarea className="mt-1 w-full px-3 py-2 border rounded" rows={4} value={modalRemark} onChange={e=>setModalRemark(e.target.value)} />
          </label>

          <div className="flex justify-end gap-2">
            <button onClick={() => { setModalOpen(false); setSelected(null); }} className="px-3 py-2 border rounded">Cancel</button>
            <button onClick={saveStatus} className="px-3 py-2 bg-[#4c3370] text-white rounded">Save</button>
          </div>
        </Modal>
      )}
    </section>
  );
}

/* -------------------------
   Categories Management (admin manages categories list)
   ------------------------- */
function AdminCategories() {
  const [categories, setCategories] = useLocalStorage('feedhub_categories', []);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);

  function addOrSave(e) {
    e.preventDefault();
    if (!name.trim()) return alert('Name required');
    if (editingId) {
      setCategories(c => c.map(x => x.id === editingId ? { ...x, name } : x));
      setEditingId(null);
    } else {
      const id = 'cat' + Date.now();
      setCategories(c => [{ id, name }, ...c]);
    }
    setName('');
  }

  function edit(cat) {
    setEditingId(cat.id);
    setName(cat.name);
  }

  function del(id) {
    if (!confirm('Delete category?')) return;
    setCategories(c => c.filter(x => x.id !== id));
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#3b1f4b]">Categories</h2>
        <form onSubmit={addOrSave} className="flex gap-2">
          <input className="px-2 py-1 rounded border" placeholder="New category" value={name} onChange={e => setName(e.target.value)} />
          <button className="px-3 py-1 bg-[#4c3370] text-white rounded">{editingId ? 'Save' : 'Add'}</button>
        </form>
      </div>

      <div className="bg-white rounded-lg p-3 border border-[#f0e9f8] shadow-sm">
        {categories.length === 0 && <div className="py-6 text-center text-gray-500">No categories yet.</div>}
        <ul className="divide-y">
          {categories.map(cat => (
            <li key={cat.id} className="py-2 flex justify-between items-center">
              <div className="text-sm text-[#3b1f4b]">{cat.name}</div>
              <div className="flex gap-2">
                <button className="px-2 py-1 rounded border text-sm" onClick={() => edit(cat)}>Edit</button>
                <button className="px-2 py-1 rounded border text-sm text-red-600" onClick={() => del(cat.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------
   Analytics (simple)
   ------------------------- */
function AdminAnalytics() {
  const feedbacks = JSON.parse(localStorage.getItem('feedhub_feedbacks') || '[]');
  const complaints = JSON.parse(localStorage.getItem('feedhub_complaints') || '[]');
  const users = JSON.parse(localStorage.getItem('feedhub_users') || '[]');

  // simple computed stats
  const topCategories = (() => {
    const map = {};
    feedbacks.forEach(f => map[f.category] = (map[f.category] || 0) + 1);
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  })();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#3b1f4b]">Analytics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Users" value={users.length} />
        <StatCard title="Feedbacks" value={feedbacks.length} />
        <StatCard title="Complaints" value={complaints.length} />
      </div>

      <Card>
        <h3 className="font-semibold text-[#5a3b6f] mb-2">Top Categories (by feedback)</h3>
        {topCategories.length === 0 && <div className="text-sm text-gray-500">No data yet.</div>}
        <ul className="space-y-1">
          {topCategories.map(([cat, count]) => (
            <li key={cat} className="flex justify-between">
              <span className="text-sm text-[#3b1f4b]">{cat || 'General'}</span>
              <span className="text-sm text-gray-600">{count}</span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}

/* -------------------------
   Profile (simple card style)
   ------------------------- */
function AdminProfile() {
  const [profile, setProfile] = useLocalStorage('feedhub_admin_profile', { name: 'Admin', email: 'admin@feedhub.local' });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);

  useEffect(() => { setForm(profile); }, [profile]);

  function save() {
    if (!form.name.trim() || !form.email.trim()) return alert('Name and Email required');
    setProfile(form);
    setEditing(false);
  }

  return (
    <section className="space-y-4 max-w-2xl">
      <h2 className="text-xl font-semibold text-[#3b1f4b]">Profile</h2>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-[#f0e9f8]">
        {!editing ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-[#3b1f4b]">{profile.name}</div>
                <div className="text-sm text-gray-600">{profile.email}</div>
              </div>
              <div>
                <button onClick={() => setEditing(true)} className="px-3 py-2 bg-[#4c3370] text-white rounded">Edit</button>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>Simple profile card. Use this to store admin contact info and email.</p>
            </div>
          </>
        ) : (
          <>
            <label className="block mb-2">
              <div className="text-sm text-gray-600 mb-1">Name</div>
              <input className="w-full px-3 py-2 border rounded" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </label>
            <label className="block mb-2">
              <div className="text-sm text-gray-600 mb-1">Email</div>
              <input className="w-full px-3 py-2 border rounded" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </label>

            <div className="flex gap-2 justify-end">
              <button onClick={() => { setEditing(false); setForm(profile); }} className="px-3 py-2 border rounded">Cancel</button>
              <button onClick={save} className="px-3 py-2 bg-[#4c3370] text-white rounded">Save</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* -------------------------
   Reusable Modal
   ------------------------- */
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg p-6 w-full max-w-lg shadow-lg border border-[#f0e9f8]">
        {children}
      </div>
    </div>
  );
}
