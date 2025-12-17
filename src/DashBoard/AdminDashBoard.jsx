import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

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

const AdminDashboard = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');

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
      case 'todolist':
        return <AdminTodoList />;

      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-gradient-to-br from-purple-900 to-purple-800' : 'bg-gradient-to-br from-white to-purple-50'}`}>
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8">{renderContent()}</main>
    </div>
  );
};

export default AdminDashboard;

function AdminSidebar({ activeTab, setActiveTab }) {
  const [collapsed, setCollapsed] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) navigate('/');
  };

  return (
    <aside className={`flex flex-col ${collapsed ? 'w-20' : 'w-64'} transition-width duration-200`}>
      <div className={`flex flex-col h-full ${isDark ? 'bg-gradient-to-b from-purple-900 to-purple-800' : 'bg-gradient-to-b from-purple-800 to-purple-900'} text-white shadow-2xl`}>
        <div className="flex items-center justify-between p-4 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-3 bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg ${collapsed ? 'text-sm' : 'text-lg font-bold'}`}>
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
            <SidebarItem label="Todo List" id="todolist" active={activeTab==='todolist'} onClick={()=>setActiveTab('todolist')} />

          </ul>
        </nav>

        <div className="p-4 border-t border-purple-700">
          <div className="flex gap-2 mb-3">
            <button
              onClick={toggleTheme}
              className="flex-1 p-2 rounded-lg bg-purple-700 hover:bg-purple-600 transition-colors text-sm"
              aria-label="Toggle theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button onClick={handleLogout} className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium py-2 rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-sm">Logout</button>
          </div>
          <div className="text-xs text-purple-300 text-center">© 2024 Feedhub</div>
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
        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${active ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold shadow-lg' : 'text-purple-200 hover:bg-purple-800 hover:text-white'}`}
      >
        <span className="text-md">•</span>
        <span className="truncate">{label}</span>
      </button>
    </li>
  );
}

function AdminOverview() {
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const categories = JSON.parse(localStorage.getItem('feedhub_categories') || '[]');
  const [readFeedbacks, setReadFeedbacks] = useState(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, feedbacksRes, complaintsRes] = await Promise.all([
        fetch('http://localhost:5000/api/users'),
        fetch('http://localhost:5000/api/feedback'),
        fetch('http://localhost:5000/api/complaint')
      ]);
      
      const usersData = await usersRes.json();
      const feedbacksData = await feedbacksRes.json();
      const complaintsData = await complaintsRes.json();
      
      const deletedIds = JSON.parse(localStorage.getItem('deleted_feedbacks') || '[]');
      const filteredFeedbacks = feedbacksData.filter(f => !deletedIds.includes(f._id));
      
      setUsers(usersData);
      setFeedbacks(filteredFeedbacks);
      setComplaints(complaintsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setUsers([]);
      setFeedbacks([]);
      setComplaints([]);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
  const approvedFeedbacks = feedbacks.filter(f => f.status === 'Resolved').length;

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Admin Dashboard</h1>
          <p className="text-purple-700 mt-1">Overview & Analytics</p>
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
          <h3 className="font-semibold text-purple-700 mb-3">Pending Complaints</h3>
          <div className="text-3xl font-bold text-purple-600">{pendingComplaints}</div>
        </Card>

        <Card>
          <h3 className="font-semibold text-purple-700 mb-3">Resolved Feedbacks</h3>
          <div className="text-3xl font-bold text-purple-600">{approvedFeedbacks}</div>
        </Card>

        <Card>
          <h3 className="font-semibold text-purple-700 mb-3">System Health</h3>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-lg font-semibold text-purple-600">Online</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RecentComplaints complaints={complaints.slice(0,1)} />
        <RecentFeedbacks feedbacks={feedbacks.slice(0,1)} />
      </div>
    </section>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-200 hover:shadow-xl transition-shadow duration-200">
      <div className="text-sm font-medium text-purple-600 uppercase tracking-wide">{title}</div>
      <div className="text-3xl font-bold text-purple-900 mt-2">{value}</div>
    </div>
  );
}

function Card({ children }) {
  return <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-200">{children}</div>;
}

function RecentComplaints({ complaints }) {
  return (
    <Card>
      <h3 className="font-semibold text-slate-700 mb-4">Recent Complaints</h3>
      <div className="space-y-3">
        {complaints.length === 0 && <div className="text-sm text-gray-500">No complaints.</div>}
        {complaints.map(c => (
          <div key={c._id} className="border-b pb-3 last:border-b-0">
            <div className="font-medium text-slate-800 text-sm">{c.subject}</div>
            <div className="text-xs text-gray-500 mt-1">{c.userName || 'Anonymous'}</div>
            <div className="mt-2">
              <span className={`px-2 py-1 rounded text-xs ${
                c.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {c.status || 'Pending'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RecentFeedbacks({ feedbacks }) {
  return (
    <Card>
      <h3 className="font-semibold text-slate-700 mb-4">Latest Feedbacks</h3>
      <div className="space-y-2">
        {feedbacks.length === 0 && <div className="text-sm text-gray-500">No feedbacks.</div>}
        {feedbacks.map(f => (
          <div key={f._id} className="text-sm border-b pb-2 last:border-b-0">
            <div className="font-medium text-slate-800">{f.title || (f.message||'').slice(0,60)}</div>
            <div className="text-xs text-gray-500">{f.name} • {new Date(f.createdAt).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AdminTodoList() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('admin_todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const todo = { id: Date.now(), text: newTodo, completed: false };
    const updated = [todo, ...todos];
    setTodos(updated);
    localStorage.setItem('admin_todos', JSON.stringify(updated));
    setNewTodo('');
  };

  const toggleTodo = (id) => {
    const updated = todos.map(t => t.id === id ? {...t, completed: !t.completed} : t);
    setTodos(updated);
    localStorage.setItem('admin_todos', JSON.stringify(updated));
  };

  const deleteTodo = (id) => {
    const updated = todos.filter(t => t.id !== id);
    setTodos(updated);
    localStorage.setItem('admin_todos', JSON.stringify(updated));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) return;
    const updated = todos.map(t => t.id === id ? {...t, text: editText} : t);
    setTodos(updated);
    localStorage.setItem('admin_todos', JSON.stringify(updated));
    setEditingId(null);
    setEditText('');
  };

  return (
    <section className="space-y-4 max-w-2xl">
      <h2 className="text-2xl font-bold text-purple-900">Todo List</h2>
      <form onSubmit={addTodo} className="flex gap-2">
        <input 
          className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500" 
          placeholder="Add new task..."
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
        />
        <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Add</button>
      </form>
      <div className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm">
        {todos.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No tasks yet.</p>
        ) : (
          <div className="space-y-2">
            {todos.map(todo => (
              <div key={todo.id} className="flex items-center gap-3 p-2 hover:bg-purple-50 rounded">
                <input 
                  type="checkbox" 
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-4 h-4 text-purple-600"
                />
                {editingId === todo.id ? (
                  <input 
                    className="flex-1 px-2 py-1 border border-purple-300 rounded"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    onBlur={() => saveEdit(todo.id)}
                    onKeyPress={e => e.key === 'Enter' && saveEdit(todo.id)}
                    autoFocus
                  />
                ) : (
                  <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {todo.text}
                  </span>
                )}
                <button 
                  onClick={() => startEdit(todo.id, todo.text)}
                  className="text-purple-500 hover:text-purple-700 text-sm"
                >✏️</button>
                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8">Loading users...</div>;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-purple-900">Users Management</h2>
      <div className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm">
        {users.length === 0 ? (
          <div className="py-6 text-center text-gray-500">No users found.</div>
        ) : (
          <div className="space-y-3">
            {users.map(u => (
              <div key={u._id} className="flex justify-between items-center p-3 border-b">
                <div>
                  <div className="font-medium text-purple-900">{u.name}</div>
                  <div className="text-sm text-gray-600">{u.email}</div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                  {u.role || 'user'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AdminFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/feedback')
      .then(res => res.json())
      .then(data => {
        const deletedIds = JSON.parse(localStorage.getItem('deleted_feedbacks') || '[]');
        const filteredData = data.filter(f => !deletedIds.includes(f._id));
        setFeedbacks(filteredData);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const deleteFeedback = (id) => {
    const deletedIds = JSON.parse(localStorage.getItem('deleted_feedbacks') || '[]');
    deletedIds.push(id);
    localStorage.setItem('deleted_feedbacks', JSON.stringify(deletedIds));
    setFeedbacks(feedbacks.filter(f => f._id !== id));
  };

  if (loading) return <div className="text-center py-8">Loading feedbacks...</div>;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-purple-900">Feedback Management</h2>
      <div className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm">
        {feedbacks.length === 0 ? (
          <div className="py-6 text-center text-gray-500">No feedbacks.</div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map(f => (
              <div key={f._id} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold text-purple-900">{f.title || 'Feedback'}</div>
                    <div className="text-sm text-gray-600 mt-1">{f.message}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      {f.name} • {new Date(f.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteFeedback(f._id)}
                    className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                  >Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/complaint')
      .then(res => res.json())
      .then(data => setComplaints(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/complaint/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        setComplaints(complaints.map(c => c._id === id ? {...c, status} : c));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) return <div className="text-center py-8">Loading complaints...</div>;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-purple-900">Complaint Management</h2>
      <div className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm">
        {complaints.length === 0 ? (
          <div className="py-6 text-center text-gray-500">No complaints.</div>
        ) : (
          <div className="space-y-4">
            {complaints.map(c => (
              <div key={c._id} className="border-b pb-4">
                <div className="font-semibold text-purple-900">{c.subject}</div>
                <div className="text-sm text-gray-600 mt-1">{c.message}</div>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex gap-2">
                    <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                      {c.priority}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      c.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                      c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {c.status || 'Pending'}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => updateStatus(c._id, 'Pending')}
                      className="px-3 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
                    >Pending</button>
                    <button 
                      onClick={() => updateStatus(c._id, 'In Progress')}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                    >Progress</button>
                    <button 
                      onClick={() => updateStatus(c._id, 'Resolved')}
                      className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                    >Resolved</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AdminCategories() {
  const [categories, setCategories] = useLocalStorage('feedhub_categories', []);
  const [name, setName] = useState('');

  const addCategory = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const id = 'cat' + Date.now();
    setCategories(c => [{ id, name }, ...c]);
    setName('');
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-purple-900">Categories</h2>
      <form onSubmit={addCategory} className="flex gap-2">
        <input 
          className="flex-1 px-4 py-2 border border-purple-300 rounded-lg" 
          placeholder="New category" 
          value={name} 
          onChange={e => setName(e.target.value)} 
        />
        <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Add</button>
      </form>
      <div className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm">
        {categories.length === 0 ? (
          <div className="py-6 text-center text-gray-500">No categories yet.</div>
        ) : (
          <div className="space-y-2">
            {categories.map(cat => (
              <div key={cat.id} className="p-2 border-b">
                <div className="text-purple-900">{cat.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AdminAnalytics() {
  const [data, setData] = useState({ users: 0, feedbacks: 0, complaints: 0, priorityData: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/users'),
      fetch('http://localhost:5000/api/feedback'),
      fetch('http://localhost:5000/api/complaint')
    ])
    .then(async ([usersRes, feedbacksRes, complaintsRes]) => {
      const users = await usersRes.json();
      const feedbacks = await feedbacksRes.json();
      const complaints = await complaintsRes.json();
      
      const deletedIds = JSON.parse(localStorage.getItem('deleted_feedbacks') || '[]');
      const filteredFeedbacks = feedbacks.filter(f => !deletedIds.includes(f._id));
      
      const priorityCounts = complaints.reduce((acc, c) => {
        acc[c.priority] = (acc[c.priority] || 0) + 1;
        return acc;
      }, {});
      
      setData({ 
        users: users.length, 
        feedbacks: filteredFeedbacks.length, 
        complaints: complaints.length,
        priorityData: [
          { name: 'Low', value: priorityCounts.Low || 0, color: '#10b981' },
          { name: 'Medium', value: priorityCounts.Medium || 0, color: '#f59e0b' },
          { name: 'High', value: priorityCounts.High || 0, color: '#ef4444' }
        ]
      });
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8">Loading analytics...</div>;

  const feedbackVsComplaintData = [
    { name: 'Feedbacks', value: data.feedbacks, color: '#8b5cf6' },
    { name: 'Complaints', value: data.complaints, color: '#ef4444' }
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-purple-900">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Users" value={data.users} />
        <StatCard title="Total Feedbacks" value={data.feedbacks} />
        <StatCard title="Total Complaints" value={data.complaints} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart title="Feedbacks vs Complaints" data={feedbackVsComplaintData} />
        <PieChart title="Priority Levels" data={data.priorityData} />
      </div>
    </section>
  );
}

function BarChart({ title, data }) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-200">
      <h3 className="text-lg font-semibold text-purple-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-20 text-sm font-medium text-gray-700">{item.name}</div>
            <div className="flex-1 mx-4">
              <div className="bg-gray-200 rounded-full h-6 relative">
                <div 
                  className="h-6 rounded-full flex items-center justify-end pr-2 text-white text-sm font-medium"
                  style={{ 
                    width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`, 
                    backgroundColor: item.color,
                    minWidth: item.value > 0 ? '30px' : '0px'
                  }}
                >
                  {item.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PieChart({ title, data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-200">
      <h3 className="text-lg font-semibold text-purple-900 mb-4">{title}</h3>
      {total === 0 ? (
        <div className="text-center py-8 text-gray-500">No data available</div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const strokeDasharray = `${percentage} ${100 - percentage}`;
                const strokeDashoffset = data.slice(0, index).reduce((sum, prev) => sum + (prev.value / total) * 100, 0);
                
                return (
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r="15.915"
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth="8"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={-strokeDashoffset}
                    className="transition-all duration-300"
                  />
                );
              })}
            </svg>
          </div>
          <div className="ml-6 space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-700">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

