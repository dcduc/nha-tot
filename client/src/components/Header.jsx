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
    <header className="sticky top-0 z-50 bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap transition-transform hover:scale-110">
            <span className="text-slate-500">Nhà</span>
            <span className="text-slate-700">Tốt</span>
          </h1>
        </Link>
        {/* <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-2xl flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form> */}
        <SearchAutoComplete />
        <ul className="flex gap-12">
          <Link to="/">
            <li className="hidden font-semibold transition-transform hover:scale-110 sm:block text-slate-700">
              Trang chủ
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden font-semibold transition-transform hover:scale-110 sm:block text-slate-700">
              Về chúng tôi
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="h-7 w-7 rounded-full border-2 border-slate-800 object-cover transition-transform hover:scale-110"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="text-slate-700 font-bold transition-transform hover:scale-110">
                Đăng nhập
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
