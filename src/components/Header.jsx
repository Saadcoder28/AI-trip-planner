import { Link } from "react-router-dom";
import Auth from "./Auth";

export default function Header({ user, setUser }) {
  return (
    <header className="w-full bg-gray-900 text-white py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* left: “My Trips” */}
        {user ? (
          <Link to="/trips" className="text-gray-300 hover:text-white">
            My Trips
          </Link>
        ) : (
          <div className="w-20" /> /* spacer */
        )}

        {/* centre: “Home” */}
        <Link to="/" className="text-lg font-bold">
          Home
        </Link>

        {/* right: login/logout */}
        <Auth user={user} setUser={setUser} />
      </div>
    </header>
  );
}
