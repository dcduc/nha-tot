import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="mx-auto max-w-lg p-3">
      <h1 className="my-7 text-center text-3xl font-semibold text-emerald-700">
        Thông tin cá nhân
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="flex flex-col gap-4">
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt="profile"
            className="mt-2 h-48 w-48 cursor-pointer self-center rounded-full object-cover"
          />
          <p className="self-center text-sm">
            {fileUploadError ? (
              <span className="text-rose-700 font-semibold">
                Lỗi khi tải ảnh lên (Ảnh phải nhỏ hơn 2MB và phải là ảnh)
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className="text-emerald-600">{`Đang tải ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className="text-emerald-700 font-semibold">
                Tải ảnh lên thành công
              </span>
            ) : (
              ""
            )}
          </p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-emerald-900">
            Email
          </label>
          <input
            type="email"
            placeholder="abc@example.com"
            defaultValue={currentUser.email}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-emerald-900 focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
            id="email"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-emerald-900">
            Họ và tên
          </label>
          <input
            type="text"
            placeholder="Username"
            defaultValue={currentUser.username}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-emerald-900 focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
            id="username"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-emerald-900">
            Mật khẩu
          </label>
          <input
            type="password"
            placeholder="Password"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-emerald-900 focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm"
            id="password"
            onChange={handleChange}
            autoComplete="on"
          />
        </div>
        <button
          disabled={loading}
          className="w-full rounded-lg bg-emerald-500 px-5 py-2 text-center text-sm font-medium text-white hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-300"
        >
          {loading ? "Loading..." : "Cập nhật thông tin"}
        </button>
        <Link to={"/create-listing"}>
          <button className="mt-5 w-full rounded-lg bg-teal-500 px-5 py-2 text-center text-sm font-medium text-white hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-emerald-300">
            Thêm bài đăng
          </button>
        </Link>
      </form>
      <div className="mt-5 flex justify-between">
        <button
          onClick={handleDeleteUser}
          className="transition-color cursor-pointer rounded-lg bg-rose-500 px-5 py-2 text-sm font-medium text-white hover:bg-rose-600"
        >
          Xóa tài khoản
        </button>
        <button
          onClick={handleSignOut}
          className="transition-color cursor-pointer rounded-lg bg-yellow-500 px-5 py-2 text-sm font-medium text-white hover:bg-yellow-600"
        >
          Đăng xuất
        </button>
      </div>

      <p className="my-5 font-semibold text-rose-700">{error ? error : ""}</p>
      <p className="my-5 font-semibold text-emerald-700">
        {updateSuccess ? "User is updated successfully!" : ""}
      </p>
      <button
        onClick={handleShowListings}
        className="transition-color w-full cursor-pointer rounded-lg bg-cyan-500 px-5 py-2 text-sm font-medium text-white hover:bg-cyan-600"
      >
        Xem bài đăng của bạn
      </button>
      <p className="mt-5 text-rose-700">
        {showListingsError ? "Error showing listings" : ""}
      </p>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="mt-7 text-center text-2xl font-semibold">
            Bài đăng của bạn
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="flex items-center justify-between gap-4 rounded-lg border p-3 focus:outline-none focus:ring-4 focus:ring-emerald-300"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-24 w-24 rounded-lg border border-emerald-200 object-contain hover:opacity-75"
                />
              </Link>
              <Link
                className="flex-1 truncate font-semibold text-emerald-700 hover:underline"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="item-center flex flex-col">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="transition-color w-full cursor-pointer rounded-lg bg-rose-500 px-5 py-2 text-sm font-medium text-white hover:opacity-75"
                >
                  Xóa
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="transition-color mt-4 w-full cursor-pointer rounded-lg bg-yellow-500 px-5 py-2 text-sm font-medium text-white hover:opacity-75">
                    Cập nhật
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
