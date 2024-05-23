import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function SearchHeader() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProductIndex, setSelectedProductIndex] = useState(-1);
  const inputRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("/api/listing/get");
      setProducts(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProductIndex !== -1) {
      scrollActiveProductIntoView(selectedProductIndex);
    }
  }, [selectedProductIndex]);

  function scrollActiveProductIntoView(index) {
    const activeProduct = document.getElementById(`product-${index}`);
    if (activeProduct) {
      activeProduct.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }

  function handleProductClick(product) {
    alert(`You selected ${product.name}`);
    setQuery("");
    setSelectedProductIndex(-1);
    setSearchResults([]);
  }

  function handleQueryChange(e) {
    setQuery(e.target.value);
    setSearchResults(
      products.filter((product) =>
        product.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
    console.log(searchResults);
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowUp") {
      setSelectedProductIndex((prevIndex) =>
        prevIndex === -1 ? searchResults.length - 1 : prevIndex - 1
      );
    } else if (e.key === "ArrowDown") {
      setSelectedProductIndex((prevIndex) =>
        prevIndex === searchResults.length - 1 ? -1 : prevIndex + 1
      );
    } else if (e.key === "Enter") {
      if (selectedProductIndex !== -1) {
        const selectedProduct = searchResults[selectedProductIndex];
        alert(`You selected ${selectedProduct.name}`);
        setQuery("");
        setSelectedProductIndex(-1);
        setSearchResults([]);
      }
    }
  }

  return (
    <div className="">
      <input
        type="text"
        className="h-6 w-full rounded-lg border p-3"
        onChange={handleQueryChange}
        onKeyDown={handleKeyDown}
        value={query}
        ref={inputRef}
        placeholder="Search..."
      />
      <div className="resultProductContainer z-[100] max-h-96 max-w-[16rem] overflow-y-scroll bg-white relative">
        {query !== "" &&
          searchResults.length > 0 &&
          searchResults.map((product, index) => (
            <div
              key={product._id}
              id={`product-${index}`}
              className={`${
                selectedProductIndex === index ? "bg-gray-200" : ""
              } flex cursor-pointer items-center justify-between gap-8 px-4 py-2 hover:bg-gray-200`}
              onClick={() => handleProductClick(product)}
            >
              <p>{product.name}</p>
              <p>{product._discountPrice}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
