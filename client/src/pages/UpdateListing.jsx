import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, []);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("Vui lòng tải lên ít nhất 1 hình ảnh");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Giá giảm phải nhỏ hơn giá thường");
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data.slug}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className="mx-auto max-w-4xl p-3">
      <h1 className="my-7 text-center text-3xl font-bold text-emerald-700">
        Cập nhật bài đăng
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 flex-col gap-4 text-emerald-700">
          <input
            type="text"
            placeholder="Tên bài đăng"
            className="rounded-lg border border-gray-300 p-3"
            id="name"
            maxLength="255"
            minLength="6"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Mô tả"
            className="rounded-lg border border-gray-300 p-3"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Địa chỉ"
            className="rounded-lg border border-gray-300 px-5 py-2"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap text-emerald-700">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Bán</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Thuê</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Bãi xe</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Nội thất</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Giảm giá</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-emerald-700">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="rounded-lg border border-gray-300 px-5 py-2"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Phòng ngủ</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="rounded-lg border border-gray-300 px-5 py-2"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Phòng tắm</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="100000000000"
                required
                className="rounded-lg border border-gray-300 px-5 py-2"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>
                  Giá (<strong>VND</strong>)
                </p>
                {formData.type === "rent" && (
                  <span className="text-xs">/tháng</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="rounded-lg border border-gray-300 px-5 py-2"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>
                    Giảm giá (<strong>VND</strong>)
                  </p>

                  {formData.type === "rent" && (
                    <span className="text-xs">/tháng</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4 text-emerald-700">
          <p className="font-semibold">
            Hình ảnh (tối đa 6):
            <span className="font-normal text-emerald-700 ml-2">
              Ảnh đầu tiên sẽ được làm thumbnail cho bài đăng
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="w-full rounded-lg border border-gray-300 px-5 py-2"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="w-28 rounded-lg bg-green-500 px-5 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? "Đang tải..." : "Tải lên"}
            </button>
          </div>
          <p className="text-rose-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="duration flex items-center justify-between gap-4 rounded-lg border bg-gray-100 px-5 py-2 transition hover:shadow-md"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="rounded-lg bg-rose-500 px-5 py-2 text-sm font-medium text-white hover:opacity-75 hover:shadow-lg"
                >
                  Xóa
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="rounded-lg bg-emerald-500 px-5 py-4 text-sm font-medium text-white hover:opacity-95 disabled:opacity-50"
          >
            {loading ? "Đang cập nhật..." : "Cập nhật bài đăng"}
          </button>
          {error && <p className="text-rose-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
