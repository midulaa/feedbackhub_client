
const Register = () => {
  return (
    <div className="p-28 min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-purple-700 mb-5 text-center">Register</h2>

        <label className="block text-gray-600">Full Name</label>
        <input className="w-full mb-4 p-2 border rounded" type="text" />

        <label className="block text-gray-600">Email</label>
        <input className="w-full mb-4 p-2 border rounded" type="email" />

        <label className="block text-gray-600">Password</label>
        <input className="w-full mb-4 p-2 border rounded" type="password" />

        <button className="bg-purple-600 text-white w-full py-2 rounded hover:bg-purple-700 transition">
          Register
        </button>
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-purple-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
