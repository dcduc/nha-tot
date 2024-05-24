import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";
import Map from "../components/Map";

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);

        // Fetch all listings to find suggestions
        const allListingsRes = await fetch(`/api/listing/get`);
        const allListingsData = await allListingsRes.json();
        if (allListingsData.success === false) {
          setError(true);
          return;
        }
        // const allListings = allListingsData.listings;

        // Extract the district from the current listing address
        const district = data.address.split(", ").slice(-3).join(", ");

        // Find listings in the same district
        const similarListings = allListingsData.filter(
          (listing) =>
            listing.address.includes(district) && listing._id !== data._id
        );

        setSuggestions(similarListings);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && (
        <p className="text-center my-7 text-2xl text-emerald-700">
          Đang tải...
        </p>
      )}
      {error && (
        <p className="text-center my-7 text-2xl text-rose-700">
          Có lỗi xảy ra!
        </p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-emerald-100 cursor-pointer">
            <FaShare
              className="text-emerald-700"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-emerald-100 p-2">
              Sao chép liên kết thành công!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="font-bold text-emerald-700 text-3xl">
              {listing.name}
            </p>
            <p className="text-xl font-semibold text-emerald-900">
              {listing.offer
                ? listing.discountPrice.toLocaleString("vi-VN")
                : listing.regularPrice.toLocaleString("vi-VN")}{" "}
              đồng{listing.type === "rent" && "/tháng"}
            </p>

            <p className="flex items-center mt-4 gap-2 text-emerald-700  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-emerald-500 w-full max-w-[200px] text-white text-sm font-medium text-center p-1 rounded-md">
                {listing.type === "rent" ? "Cho thuê" : "Nhà bán"}
              </p>
              {listing.offer && (
                <p className="bg-emerald-600 w-full max-w-[200px] text-white text-sm font-medium text-center p-1 rounded-md">
                  Giảm giá{" "}
                  {Math.ceil(
                    100 - (listing.discountPrice / listing.regularPrice) * 100
                  )}
                  %
                </p>
              )}
            </div>
            <p className="text-emerald-700">
              <span className="font-semibold text-emerald-950">Mô tả - </span>
              {listing.description}
            </p>
            <ul className="text-emerald-900 font-medium text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1 && `${listing.bedrooms} phòng ngủ`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1 && `${listing.bathrooms} phòng tắm`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.parking ? "Có bãi xe" : "Không có bãi xe"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? "Có nội thất" : "Không nội thất"}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 px-5 py-2 font-medium"
              >
                Liên hệ người đăng
              </button>
            )}
            {contact && <Contact listing={listing} />}
            <Map address={listing.address} />
          </div>
          {suggestions && suggestions.length > 0 && (
            <div className="max-w-4xl mx-auto p-3 my-7">
              <h2 className="text-2xl font-semibold mb-4">
                Xem thêm {listing.type === "rent" ? "nhà thuê" : "nhà bán"} tại
                khu vực này
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions.slice(0, 6).map((suggestion) => (
                  <div key={suggestion.slug} className="border p-3 rounded-md">
                    <Swiper navigation>
                      {suggestion.imageUrls.map((url) => (
                        <SwiperSlide key={url}>
                          <div
                            className="h-40"
                            style={{
                              background: `url(${url}) center no-repeat`,
                              backgroundSize: "cover",
                            }}
                          ></div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <Link
                      to={`/listing/${suggestion.slug}`}
                      aria-label={suggestion.name}
                    >
                      <p className="font-semibold text-lg mt-2 hover:underline text-emerald-700">
                        {suggestion.name}
                      </p>
                      <p className="text-sm font-semibold text-emerald-900 mt-2">
                        {suggestion.offer
                          ? suggestion.discountPrice.toLocaleString("vi-VN")
                          : suggestion.regularPrice.toLocaleString(
                              "vi-VN"
                            )}{" "}
                        đồng{suggestion.type === "rent" && "/tháng"}
                      </p>
                      <p className="text-sm text-emerald-900 mt-2">
                        {suggestion.address}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
