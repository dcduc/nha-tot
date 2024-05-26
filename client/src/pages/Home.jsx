import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=6");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=6");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=6");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div>
      {/* top */}
      <div className="flex flex-col gap-6 p-8 md:p-28 px-3 max-w-6xl mx-auto h-screen">
        <h1 className="text-3xl font-bold text-emerald-900 lg:text-6xl">
          <span className="text-emerald-700">Nhà</span>Tốt
        </h1>
        <div className="text-xs font-medium text-emerald-700 sm:text-lg">
          Tìm kiếm và cho thuê nhà đất, phòng trọ, chung cư dễ dàng và hiệu quả
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-emerald-900 font-bold hover:underline"
          aria-label="View all listings"
        >
          Xem tất cả
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing.slug}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer, sale and rent */}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-emerald-900">
                Offers gần đây
              </h2>
              <Link
                className="text-sm text-emerald-700 hover:underline"
                to={"/search?offer=true"}
                aria-label="View more offers"
              >
                Xem thêm các offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing.slug} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-emerald-900">
                Nhà cho thuê gần đây
              </h2>
              <Link
                className="text-sm text-emerald-700 hover:underline"
                to={"/search?type=rent"}
                aria-label="View more rental listings"
              >
                Xem thêm nhà cho thuê
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing.slug} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-emerald-900">
                Nhà bán gần đây
              </h2>
              <Link
                className="text-sm text-emerald-700 hover:underline"
                to={"/search?type=sale"}
                aria-label="View more sale listings"
              >
                Xem thêm nhà bán
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing.slug} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
