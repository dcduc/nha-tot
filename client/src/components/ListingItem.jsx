import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaBath, FaBed } from "react-icons/fa";

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
          }
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-emerald-700">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-emerald-900 truncate w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-emerald-900 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-emerald-700 mt-2 font-semibold ">
            {listing.offer
              ? listing.discountPrice.toLocaleString("vi-VN")
              : listing.regularPrice.toLocaleString("vi-VN")}{" "}
            đồng{listing.type === "rent" && "/tháng"}
          </p>
          <div className="flex text-emerald-900 gap-4 mt-2">
            <div className="flex font-bold text-xs justify-between">
              <FaBed className="text-sm mr-2" />
              {listing.bedrooms > 1 && `${listing.bedrooms} phòng ngủ`}
            </div>
            <div className="flex font-bold text-xs justify-between">
              <FaBath className="text-sm mr-2" />
              {listing.bathrooms > 1 && `${listing.bathrooms} phòng tắm`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
