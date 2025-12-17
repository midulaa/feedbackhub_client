import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const renderContent = () => {
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
    <div className={`min-h-screen flex ${isDark ? 'bg-gradient-to-br from-purple-900 to-purple-800' : 'bg-gradient-to-br from-white to-purple-50'}`}>
      <UserSidebar active={activeTab} setActive={setActiveTab} navigate={navigate} />
      <main className={`flex-1 p-8 ${isDark ? 'text-white' : 'text-purple-900'}`}>{renderContent()}</main>
    </div>
  );
};

export default UserDashboard;

function UserSidebar({ active, setActive, navigate }) {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const { isDark, toggleTheme } = useTheme();
  const userName = userData.name || 'User';
  
  return (
    <aside className={`w-64 ${isDark ? 'bg-gradient-to-b from-purple-900 to-purple-800' : 'bg-gradient-to-b from-purple-800 to-purple-900'} text-white min-h-screen flex flex-col shadow-2xl`}>
      <div className="p-6 border-b border-purple-700">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-purple-400 bg-clip-text text-transparent">FeedbackHub</div>
        <div className="text-sm text-purple-300 mt-1">Welcome, {userName}</div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <NavItem label="Dashboard" id="overview" active={active} setActive={setActive} />
        <NavItem label="Submit Feedback" id="feedback" active={active} setActive={setActive} />
        <NavItem label="Submit Complaint" id="complaint" active={active} setActive={setActive} />
        <NavItem label="My Feedbacks" id="myfeedbacks" active={active} setActive={setActive} />
        <NavItem label="My Complaints" id="mycomplaints" active={active} setActive={setActive} />
        <NavItem label="Profile" id="profile" active={active} setActive={setActive} />
      </nav>

      <div className="m-4 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-medium transition-all duration-200"
          aria-label="Toggle theme"
        >
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
        >Logout</button>
      </div>
    </aside>
  );
}

function NavItem({ label, id, active, setActive }) {
  return (
    <button
      onClick={() => setActive(id)}
      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
        active === id ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold shadow-lg' : 'text-purple-200 hover:bg-purple-800 hover:text-white'
      }`}
    >{label}</button>
  );
}

function UserOverview() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = userData.name || 'User';

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      if (!userData.id) {
        setLoading(false);
        return;
      }

      const [feedbacksRes, complaintsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/feedback/user/${userData.id}`),
        fetch(`http://localhost:5000/api/complaint/user/${userData.id}`)
      ]);
      
      const feedbacksData = await feedbacksRes.json();
      const complaintsData = await complaintsRes.json();
      
      setFeedbacks(Array.isArray(feedbacksData) ? feedbacksData : []);
      setComplaints(Array.isArray(complaintsData) ? complaintsData : []);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setFeedbacks([]);
      setComplaints([]);
    }
    setLoading(false);
  };

  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-purple-900">Welcome, {userName}</h1>
        <p className="text-purple-700 mt-2">Manage your feedback and complaints</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="My Feedbacks" value={feedbacks.length} />
        <Card title="My Complaints" value={complaints.length} />
        <Card title="Resolved" value={resolvedComplaints} />
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">Quick Actions</h3>
            <p className="text-slate-600 mt-1">Get started with FeedbackHub</p>
          </div>
          <button 
            onClick={fetchUserData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  const { isDark } = useTheme();
  return (
    <div className={`${isDark ? 'bg-purple-800 border-purple-700' : 'bg-white border-purple-200'} rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow duration-200`}>
      <div className="text-sm font-medium text-purple-600 uppercase tracking-wide">{title}</div>
      <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-purple-900'} mt-2`}>{value}</div>
    </div>
  );
}

function SubmitFeedback() {
  const { isDark } = useTheme();
  const [form, setForm] = useState({ title: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.message.trim()) {
      alert('All fields are required!');
      return;
    }
    
    setLoading(true);
    
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          message: form.message,
          title: form.title,
          userId: userData.id
        })
      });
      
      if (response.ok) {
        alert('✅ Feedback submitted successfully! Status: New');
        setForm({ title: '', message: '' });
      } else {
        alert('❌ Error submitting feedback');
      }
    } catch (error) {
      alert('❌ Error submitting feedback');
    }
    setLoading(false);
  };

  return (
    <div className={`max-w-2xl ${isDark ? 'bg-purple-800 border-purple-700' : 'bg-white border-purple-200'} p-8 rounded-2xl shadow-xl border`}>
      <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-purple-900'} mb-6`}>Submit Feedback</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
            placeholder="Enter feedback title"
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            required 
          />
        </div>
        

        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
            rows="4"
            placeholder="Describe your feedback in detail"
            value={form.message}
            onChange={e => setForm({...form, message: e.target.value})}
            required 
          />
        </div>

        <button 
          type="submit"
          disabled={loading} 
          className="w-full py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}

function SubmitComplaint() {
  const { isDark } = useTheme();
  const [form, setForm] = useState({ subject: '', message: '', priority: 'Low', category: 'Website' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.subject.trim() || !form.message.trim()) {
      alert('Subject and Message are required!');
      return;
    }
    
    setLoading(true);
    
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch('http://localhost:5000/api/complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: form.subject,
          message: form.message,
          priority: form.priority,
          category: form.category,
          userId: userData.id,
          userName: userData.name
        })
      });
      
      if (response.ok) {
        const priorityMsg = form.priority === 'High' ? ' 🔴 High Priority - Admin will be notified!' : '';
        alert(`✅ Complaint submitted successfully! Status: Pending${priorityMsg}`);
        setForm({ subject: '', message: '', priority: 'Low', category: 'Website' });
      } else {
        alert('❌ Error submitting complaint');
      }
    } catch (error) {
      alert('❌ Error submitting complaint');
    }
    setLoading(false);
  };

  return (
    <div className={`max-w-2xl ${isDark ? 'bg-purple-800 border-purple-700' : 'bg-white border-purple-200'} p-8 rounded-2xl shadow-xl border`}>
      <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-purple-900'} mb-6`}>Submit Complaint</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <input 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
            placeholder="Enter complaint subject"
            value={form.subject}
            onChange={e => setForm({...form, subject: e.target.value})}
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
            rows="4"
            placeholder="Describe your complaint in detail"
            value={form.message}
            onChange={e => setForm({...form, message: e.target.value})}
            required 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
              value={form.priority}
              onChange={e => setForm({...form, priority: e.target.value})}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
              value={form.category}
              onChange={e => setForm({...form, category: e.target.value})}
            >
              <option value="Website">Website</option>
              <option value="Service">Service</option>
              <option value="Performance">Performance</option>
              <option value="UI/UX">UI/UX</option>
              <option value="Security">Security</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading} 
          className="w-full py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
}

function MyFeedbacks() {
  const { isDark } = useTheme();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch(`http://localhost:5000/api/feedback/user/${userData.id}`);
      const data = await response.json();
      setFeedbacks(data);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>My Feedbacks</h2>
      <div className={`${isDark ? 'bg-purple-800 border-purple-700' : 'bg-white border-purple-200'} rounded-2xl shadow-xl border p-6`}>
        {feedbacks.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No feedbacks yet.</p>
        ) : (
          <div className="space-y-4">
            {feedbacks.map(f => (
              <div key={f._id} className="border-b pb-4 last:border-b-0">
                <div className="font-semibold text-slate-800">{f.title}</div>
                <div className="text-sm text-gray-600 mt-1">{f.message}</div>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(f.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MyComplaints() {
  const { isDark } = useTheme();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!userData.id) {
        setError('No user session found');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`http://localhost:5000/api/complaint/user/${userData.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setError(error.message);
      setComplaints([]);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading your complaints...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-3">My Complaints</h2>
        <div className="text-red-600">Error: {error}</div>
        <button 
          onClick={fetchComplaints}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>My Complaints</h2>
      <div className={`${isDark ? 'bg-purple-800 border-purple-700' : 'bg-white border-purple-200'} rounded-2xl shadow-xl border p-6`}>
        {complaints.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No complaints submitted yet.</p>
            <p className="text-sm text-gray-400">Submit a complaint to see it here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map(c => (
              <div key={c._id} className="border-b pb-4 last:border-b-0">
                <div className="font-semibold text-slate-800">{c.subject}</div>
                <div className="text-sm text-gray-600 mt-1">{c.message}</div>
                <div className="flex gap-4 mt-2 text-xs">
                  <span className={`px-2 py-1 rounded-full ${
                    c.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    c.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {c.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full ${
                    c.priority === 'High' ? 'bg-red-100 text-red-800' :
                    c.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {c.priority}
                  </span>
                  <span className="text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UserProfile() {
  const { isDark } = useTheme();
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: userData.name || 'User',
    email: userData.email || 'user@example.com',
    phone: userData.phone || '+1 234 567 8900',
    location: userData.location || 'New York, USA',
    bio: userData.bio || 'Passionate user providing valuable feedback to improve services.'
  });

  const handleSave = () => {
    const updatedUser = { ...userData, ...profile };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  return (
    <div className={`max-w-4xl ${isDark ? 'bg-purple-800 border-purple-700' : 'bg-white border-purple-200'} rounded-2xl shadow-xl border overflow-hidden`}>
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-8 text-white">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-3xl font-bold">{profile.name}</h2>
            <p className="text-purple-200 mt-1">{userData.role || 'User'} • Member since 2024</p>
          </div>
        </div>
      </div>
      
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-purple-900'}`}>Profile Information</h3>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileField label="Full Name" value={profile.name} field="name" isEditing={isEditing} profile={profile} setProfile={setProfile} />
          <ProfileField label="Email Address" value={profile.email} field="email" isEditing={isEditing} profile={profile} setProfile={setProfile} />
          <ProfileField label="Phone Number" value={profile.phone} field="phone" isEditing={isEditing} profile={profile} setProfile={setProfile} />
          <ProfileField label="Location" value={profile.location} field="location" isEditing={isEditing} profile={profile} setProfile={setProfile} />
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          {isEditing ? (
            <textarea 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
              rows="3"
              value={profile.bio}
              onChange={e => setProfile({...profile, bio: e.target.value})}
            />
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg text-gray-700">{profile.bio}</div>
          )}
        </div>
        

      </div>
    </div>
  );
}

function ProfileField({ label, value, field, isEditing, profile, setProfile }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {isEditing ? (
        <input 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
          value={value}
          onChange={e => setProfile({...profile, [field]: e.target.value})}
        />
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg text-gray-700 font-medium">{value}</div>
      )}
    </div>
  );
}