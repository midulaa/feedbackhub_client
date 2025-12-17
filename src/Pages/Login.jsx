import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authAPI } from "../services/api";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await authAPI.login(formData);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      if (response.user.role === 'admin') {
        navigate('/AdminDashBoard');
      } else {
        navigate('/UserDashBoard');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setError("User not found. Please register first.");
        setTimeout(() => navigate('/register'), 2000);
      } else {
        setError(error.response?.data?.message || "Login failed");
      }
    }
    setLoading(false);
  };

  return (
    <div className="p-28 min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-purple-700 mb-5 text-center">Login</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block text-gray-600">Email</label>
          <input 
            className="w-full mb-4 p-2 border rounded" 
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />

          <label className="block text-gray-600">Password</label>
          <input 
            className="w-full mb-4 p-2 border rounded" 
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />

          <button 
            type="submit"
            disabled={loading}
            className="bg-purple-600 text-white w-full py-2 rounded hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-purple-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;