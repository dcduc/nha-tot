import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import SearchAutoComplete from "./SearchAutoComplete";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="sticky top-0 z-50 shadow-md bg-gradient-to-r from-emerald-100 to-transparent hover:from-transparent hover:to-emerald-100">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/" aria-label="Home">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap transition-transform hover:scale-110">
            <span className="text-emerald-700 hover:opacity-75">Nhà</span>
            <span className="text-emerald-900 hover:opacity-75">Tốt</span>
          </h1>
        </Link>
        <SearchAutoComplete />
        <ul className="flex gap-12 text-emerald-800">
          <li>
            <Link to="/" aria-label="Home">
              <span className="hidden font-semibold transition-transform hover:scale-110 sm:block">
                Trang chủ
              </span>
            </Link>
          </li>
          <li>
            <Link to="/about" aria-label="About">
              <span className="hidden font-semibold transition-transform hover:scale-110 sm:block">
                Về chúng tôi
              </span>
            </Link>
          </li>
          <li>
            <Link to="/profile" aria-label="Profile">
              {currentUser ? (
                <img
                  className="h-7 w-7 rounded-full border-2 border-emerald-800 object-cover transition-transform hover:scale-110"
                  src={currentUser.avatar}
                  alt="profile"
                />
              ) : (
                <span className="text-emerald-800 font-bold transition-transform hover:scale-110">
                  Đăng nhập
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
