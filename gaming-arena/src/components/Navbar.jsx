import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Show Back button on all pages except home
  const showBack = location.pathname !== "/";

  return (
    <nav className="w-full bg-cyan-800 text-white shadow sticky top-0 z-50" style={{ fontFamily: 'Outfit',  fontWeight: 300}}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 rounded font-bold transition-colors mr-2"
            >
              ← Back
            </button>
          )}
          <span className="text-2xl font-extrabold tracking-wide" style={{ fontFamily: 'Bitcount',  fontWeight: 300}}>Gaming Arena</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-cyan-200 font-semibold transition-colors">Home</Link>
        </div>
      </div>
    </nav>
  );
}