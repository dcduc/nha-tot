import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [houseNumber, setHouseNumber] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
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
  console.log(formData);
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
          setImageUploadError("Lỗi khi tải ảnh lên (Ảnh phải nhỏ hơn 2MB)");
          setUploading(false);
        });
    } else {
      setImageUploadError("Bạn chỉ có thể tải lên tối đa 6 ảnh");
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
        return setError("Vui lòng tải lên ít nhất 1 ảnh");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Giá giảm phải nhỏ hơn giá gốc");
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
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
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Lỗi khi fetch dữ liệu thành phố!");
        }
        return response.json();
      })
      .then((data) => {
        setCities(data);
      })
      .catch((error) => {
        console.error("Lỗi khi fetch dữ liệu thành phố", error);
      });
  }, []);

  const handleCityChange = (event) => {
    const cityId = event.target.value;
    setSelectedCity(cityId);
    setDistricts([]);
    setWards([]);
    if (cityId) {
      const selectedCityData = cities.find((city) => city.Id === cityId);
      if (selectedCityData) {
        setDistricts(selectedCityData.Districts);
      }
    }
  };

  const handleDistrictChange = (event) => {
    const districtId = event.target.value;
    setSelectedDistrict(districtId);
    setWards([]);
    if (districtId) {
      const selectedCityData = cities.find((city) => city.Id === selectedCity);
      if (selectedCityData) {
        const selectedDistrictData = selectedCityData.Districts.find(
          (district) => district.Id === districtId
        );
        if (selectedDistrictData) {
          setWards(selectedDistrictData.Wards);
        }
      }
    }
  };

  return (
    <main className="mx-auto max-w-4xl p-3">
      <h1 className="my-7 text-center text-3xl font-bold">Tạo bài đăng</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Tên bài đăng"
            className="border p-3 rounded-lg"
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
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <div className="flex flex-col gap-y-6">
            <select
              className="rounded-lg border p-3"
              value={selectedCity}
              onChange={handleCityChange}
              required
            >
              <option value="">Chọn tỉnh thành</option>
              {cities.map((city) => (
                <option key={city.Id} value={city.Id}>
                  {city.Name}
                </option>
              ))}
            </select>

            <select
              className="rounded-lg border p-3"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              aria-label=".form-select-sm"
            >
              <option value="">Chọn quận huyện</option>
              {districts.map((district) => (
                <option key={district.Id} value={district.Id}>
                  {district.Name}
                </option>
              ))}
            </select>

            <select
              className="rounded-lg border p-3"
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              aria-label=".form-select-sm"
            >
              <option value="">Chọn phường xã</option>
              {wards.map((ward) => (
                <option key={ward.Id} value={ward.Id}>
                  {ward.Name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Số nhà, tên đường"
              className="rounded-lg border p-3"
              required
              onChange={(e) => setHouseNumber(e.target.value)}
              value={houseNumber}
            />
          </div>
          <input
            hidden
            type="text"
            id="address"
            value={
              (formData.address =
                houseNumber +
                ", " +
                wards.find((ward) => ward.Id === selectedWard)?.Name +
                ", " +
                districts.find((district) => district.Id === selectedDistrict)
                  ?.Name +
                ", " +
                cities.find((city) => city.Id === selectedCity)?.Name)
            }
          />
          <div className="flex flex-wrap gap-6">
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
          <div className="flex flex-wrap gap-6">
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
                max="1000000000" // 1 billion
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
        <div className="flex flex-1 flex-col gap-4">
          <p className="font-semibold">
            Hình ảnh (tối đa 6):
            <span className="ml-2 font-normal text-gray-600">
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
              className="w-28 rounded-lg bg-green-500 px-5 py-2 text-sm font-medium text-white hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? "Đang tải..." : "Tải lên"}
            </button>
          </div>
          <p className="text-sm text-red-700">
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
                  className="h-20 w-20 rounded-lg object-contain"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="rounded-lg bg-red-500 px-5 py-2 text-sm font-medium text-white hover:opacity-75 hover:shadow-lg"
                >
                  Xóa
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="rounded-lg bg-sky-500 px-5 py-4 text-sm font-medium text-white hover:opacity-95 disabled:opacity-50"
          >
            {loading ? "Đang tạo..." : "Tạo bài đăng"}
          </button>
          {error && <p className="text-sm text-red-700">{error}</p>}
        </div>
      </form>
    </main>
  );
}
