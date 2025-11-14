import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-blue-600 text-white px-6 py-4 shadow">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">CV. Sejahtera</h1>

        <ul className="flex gap-6 text-sm font-medium">
          <li>
            <Link to="/" className="hover:text-blue-200">
              Home
            </Link>
          </li>
          <li>
            <Link to="/pemesanan" className="hover:text-blue-200">
              Pemesanan
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
