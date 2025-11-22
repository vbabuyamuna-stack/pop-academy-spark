import React from "react";
import { useNavigate } from "react-router-dom";

// Dummy auth state for template
const useAuth = () => ({
  user: { name: "Admin", email: "admin@academy.com" },
  signOut: () => {},
});

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="navbar bg-base-100 shadow-md border-b border-primary/20 px-4">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl text-primary" href="/">Pop Academy</a>
      </div>
      <div className="flex-none gap-2">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src="https://api.dicebear.com/7.x/identicon/svg?seed=admin" alt="avatar" />
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <a className="justify-between" href="/profile">
                  Profile
                </a>
              </li>
              <li>
                <button onClick={signOut}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <button className="btn btn-accent" onClick={() => navigate("/auth")}>Login</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
