import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="bg-emerald-50 p-6">
      <div className="container mx-auto rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-emerald-700">
          Chào mừng đến với Trang Web Cho Thuê và Bán Nhà Đất của Chúng Tôi!
        </h1>
        <p className="mb-4 text-lg text-emerald-700">
          Chào mừng bạn đến với <strong>NhaTot</strong>, nơi mang đến giải pháp
          toàn diện cho nhu cầu tìm kiếm và đăng tin cho thuê hoặc bán nhà đất,
          phòng trọ, và căn hộ. Chúng tôi hiểu rằng việc tìm kiếm một ngôi nhà
          mới hoặc một người thuê nhà đáng tin cậy có thể là một quá trình đầy
          thách thức. Vì vậy, chúng tôi đã xây dựng một nền tảng trực tuyến tiện
          lợi và hiệu quả để kết nối người mua, người bán, người thuê và chủ nhà
          một cách dễ dàng.
        </p>

        <h2 className="mb-4 text-2xl font-semibold text-emerald-700">
          Tại Sao Chọn Chúng Tôi?
        </h2>
        <ul className="mb-4 list-inside list-disc text-emerald-700">
          <li>
            <strong>Giao Diện Thân Thiện:</strong> Giao diện trực quan và dễ sử
            dụng của chúng tôi giúp bạn dễ dàng đăng tin hoặc tìm kiếm bất động
            sản chỉ với vài bước đơn giản.
          </li>
          <li>
            <strong>Đa Dạng Lựa Chọn:</strong> Hàng nghìn tin đăng từ các căn hộ
            chung cư, nhà ở, đến các phòng trọ với nhiều mức giá và vị trí khác
            nhau, phù hợp với nhu cầu đa dạng của bạn.
          </li>
          <li>
            <strong>Tìm Kiếm Thông Minh:</strong> Công cụ tìm kiếm mạnh mẽ cho
            phép bạn lọc kết quả theo vị trí, giá cả, diện tích, và nhiều tiêu
            chí khác, giúp bạn nhanh chóng tìm thấy bất động sản mong muốn.
          </li>
          <li>
            <strong>An Toàn và Đáng Tin Cậy:</strong> Chúng tôi cam kết bảo mật
            thông tin cá nhân của bạn và đảm bảo mọi tin đăng đều được kiểm
            duyệt kỹ lưỡng để tránh các tin giả và lừa đảo.
          </li>
        </ul>

        <h2 className="mb-4 text-2xl font-semibold text-emerald-700">
          Cách Thức Hoạt Động
        </h2>
        <ol className="mb-4 list-inside list-decimal text-emerald-700">
          <li>
            <strong>Đăng Ký Tài Khoản:</strong> Đăng ký một tài khoản miễn phí
            để bắt đầu đăng tin hoặc tìm kiếm bất động sản.
          </li>
          <li>
            <strong>Đăng Tin Dễ Dàng:</strong> Đối với người bán hoặc cho thuê,
            chỉ cần vài bước đơn giản để đăng tin với đầy đủ thông tin và hình
            ảnh minh họa.
          </li>
          <li>
            <strong>Tìm Kiếm và Liên Hệ:</strong> Đối với người mua hoặc thuê,
            sử dụng công cụ tìm kiếm để duyệt qua các tin đăng và liên hệ trực
            tiếp với chủ nhà hoặc người bán thông qua thông tin liên lạc được
            cung cấp.
          </li>
        </ol>

        <h2 className="mb-4 text-2xl font-semibold text-emerald-700">
          Dịch Vụ Hỗ Trợ
        </h2>
        <p className="mb-4 text-lg text-emerald-700">
          Đội ngũ hỗ trợ khách hàng của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7
          qua email, điện thoại, và chat trực tuyến. Chúng tôi ở đây để giải đáp
          mọi thắc mắc và giúp bạn giải quyết mọi vấn đề phát sinh trong quá
          trình sử dụng trang web.
        </p>

        <h2 className="mb-4 text-2xl font-semibold text-emerald-700">
          Câu Chuyện Thành Công
        </h2>
        <p className="mb-4 text-lg text-emerald-700">
          Hàng nghìn khách hàng đã tìm thấy ngôi nhà mơ ước hoặc những người
          thuê nhà hoàn hảo thông qua nền tảng của chúng tôi. Hãy tham gia cùng
          cộng đồng của chúng tôi và trải nghiệm dịch vụ tuyệt vời mà chúng tôi
          mang lại.
        </p>

        <div className="mt-6 text-center">
          <Link to={"/"} aria-label="Home">
            <button className="rounded-lg bg-emerald-500 px-4 py-2 text-white transition-all hover:scale-110 hover:bg-emerald-600">
              Khám Phá Ngay
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
