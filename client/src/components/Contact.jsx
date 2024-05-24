import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        console.log(data);
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Liên hệ <span className="font-semibold">{landlord.username}</span>{" "}
            cho{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Nhập tin nhắn của bạn ở đây"
            className="w-full border p-3 rounded-lg"
          ></textarea>

          <Link
            to={`mailto:${
              landlord.email
            }?subject=Về ${listing.name.toLowerCase()}&body=${message}`}
            className="bg-emerald-500 text-white font-medium text-center py-2 px-5 rounded-lg hover:bg-emerald-600 transition-all"
          >
            Gửi tin nhắn
          </Link>
        </div>
      )}
    </>
  );
}
