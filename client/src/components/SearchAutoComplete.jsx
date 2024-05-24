import { useEffect, useState } from "react";
import { IoSearch, IoClose } from "react-icons/io5";

export default function SearchAutoComplete() {
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(-1);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleClose = () => {
    setSearch("");
    setSearchData([]);
    setSelectedItem(-1);
  };

  const handleKeyDown = (e) => {
    if (selectedItem < searchData.length) {
      if (e.key === "ArrowUp" && selectedItem > 0) {
        setSelectedItem((prev) => prev - 1);
      } else if (
        e.key === "ArrowDown" &&
        selectedItem < searchData.length - 1
      ) {
        setSelectedItem((prev) => prev + 1);
      } else if (e.key === "Enter" && selectedItem >= 0) {
        window.open(searchData[selectedItem].show.url, "_blank");
      }
    } else {
      setSelectedItem(-1);
    }
  };

  useEffect(() => {
    if (search !== "") {
      // fetch(`https://api.tvmaze.com/search/shows?q=${search}`)
      //   .then((res) => res.json())
      //   .then((data) => setSearchData(data));
      fetch("/api/listing/get")
        .then((res) => res.json())
        .then((res) => {
          const newFilterData = res.filter((item) => {
            return item.name.toLowerCase().includes(search.toLowerCase());
          });
          console.log(res);
          setSearchData(newFilterData);
        });
      // const newFilterData = data.filter((book) => {
      //   return book.title.toLowerCase().includes(search.toLowerCase());
      // });
      // setSearchData(newFilterData);
    } else {
      setSearchData([]);
    }
  }, [search]);

  return (
    <section className="hidden py-2 px-5 h-15 md:flex flex-col items-center relative">
      <div className="bg-white rounded-xl w-96 overflow-hidden flex items-center justify-between shadow-inner">
        <input
          type="text"
          className="flex-1 px-5 py-2 bg-transparent focus:outline-none"
          placeholder="Tìm kiếm..."
          autoComplete="off"
          onChange={handleChange}
          value={search}
          onKeyDown={handleKeyDown}
        />
        <div className="px-5 h-full flex items-center cursor-pointer text-emerald-900">
          {search === "" ? <IoSearch /> : <IoClose onClick={handleClose} />}
        </div>
      </div>
      <div className="bg-white w-96 mt-2 absolute top-11 rounded-xl text-emerald-900 shadow-2xl">
        {searchData.slice(0, 10).map((data, index) => {
          return (
            <a
              href={`/listing/${data.slug}`}
              key={index}
              target="_blank"
              rel="noreferrer"
              className={
                selectedItem === index
                  ? "hover:bg-emerald-200 bg-emerald-200 px-5 py-2.5 cursor-pointer block"
                  : "hover:bg-emerald-200 px-5 py-2.5 cursor-pointer block"
              }
              aria-label={data.name} // Add aria-label attribute
            >
              {data.name}
            </a>
          );
        })}
      </div>
    </section>
  );
}
