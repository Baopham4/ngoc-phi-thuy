// =========================================== //
// DỮ LIỆU CHUNG CHO WEBSITE PHỈ THÚY CHI BẢO
// =========================================== //

// Thông tin sinh viên
const studentInfo = {
    name: "Phạm Quốc Bảo",
    mssv: "2274802010049",
    class: "DHTMDTT/TT",
    subject: "Thiết kế Web",
    project: "Website Ngọc Phỉ Thúy"
};

// Dữ liệu sản phẩm
const productsData = [
    {
        id: 1,
        name: "Vòng Phỉ Thúy Lý Ngư",
        description: "Ngọc tự nhiên từ Myanmar, màu lục bảo thượng hạng. Thiết kế hình cá chép với ý nghĩa phong thủy vượng tài lộc.",
        price: "42.000.000 VNĐ",
        image: "images/vongtay1.jpg",
        badge: "BÁN CHẠY",
        category: "Vòng tay",
        material: "Ngọc phỉ thúy tự nhiên",
        origin: "Myanmar",
        warranty: "5 năm",
        certification: "GIA Certified"
    },
    {
        id: 2,
        name: "Ngọc Phỉ Thúy Tuyết",
        description: "Đá trắng trong suốt từ vùng Kachin, vân tuyết độc bản. Chế tác tinh xảo, mang vẻ đẹp thuần khiết.",
        price: "85.500.000 VNĐ",
        image: "images/daychuyen1.jpg",
        badge: "CAO CẤP",
        category: "Dây chuyền",
        material: "Ngọc phỉ thúy tuyết trắng",
        origin: "Kachin, Myanmar",
        warranty: "Trọn đời",
        certification: "GIA Certified"
    },
    {
        id: 3,
        name: "Nhẫn Phỉ Thúy Rồng",
        description: "Kết hợp vàng 24K và ngọc phỉ thúy xanh lục từ Myanmar. Thiết kế rồng uốn lượn tinh xảo, quyền uy.",
        price: "68.750.000 VNĐ",
        image: "images/nhan1.jpg",
        badge: "ĐỘC BẢN",
        category: "Nhẫn",
        material: "Ngọc phỉ thúy + Vàng 24K",
        origin: "Myanmar",
        warranty: "5 năm",
        certification: "GIA Certified"
    },
    {
        id: 4,
        name: "Bông Tai Hoa Sen",
        description: "Đôi bông tai hình hoa sen cách điệu, kết hợp ngọc phỉ thúy và kim cương 0.5ct. Vẻ đẹp thanh tao.",
        price: "39.500.000 VNĐ",
        image: "images/bongtai1.jpg",
        badge: "ƯU ĐÃI",
        category: "Bông tai",
        material: "Ngọc phỉ thúy + Kim cương",
        origin: "Myanmar",
        warranty: "3 năm",
        certification: "GIA Certified"
    },
    {
        id: 5,
        name: "Dây Chuyền Phỉ Thúy Viên Mãn",
        description: "Mặt dây chuyền hình tròn, biểu tượng của sự viên mãn. Ngọc màu lục bảo tự nhiên từ Myanmar.",
        price: "75.300.000 VNĐ",
        image: "images/daychuyen2.jpg",
        badge: "PHONG THỦY",
        category: "Dây chuyền",
        material: "Ngọc phỉ thúy tự nhiên",
        origin: "Myanmar",
        warranty: "5 năm",
        certification: "GIA Certified"
    },
    {
        id: 6,
        name: "Vòng Tay Kim Tiền Ngọc Bích",
        description: "Chuỗi ngọc phỉ thúy hạng A kết hợp hạt vàng 24K. Mang ý nghĩa tài lộc, thịnh vượng trường tồn.",
        price: "125.000.000 VNĐ",
        image: "images/vongtay2.jpg",
        badge: "ĐỘC QUYỀN",
        category: "Vòng tay",
        material: "Ngọc phỉ thúy + Vàng 24K",
        origin: "Myanmar",
        warranty: "Trọn đời",
        certification: "GIA Certified"
    },
    {
        id: 7,
        name: "Nhẫn Cưới Kim Cương Ngọc",
        description: "Nhẫn cưới kết hợp kim cương và ngọc phỉ thúy. Thiết kế tinh tế, sang trọng cho ngày trọng đại.",
        price: "185.000.000 VNĐ",
        image: "images/nhan2.jpg",
        badge: "CAO CẤP",
        category: "Nhẫn",
        material: "Ngọc phỉ thúy + Kim cương",
        origin: "Myanmar",
        warranty: "Trọn đời",
        certification: "GIA Certified"
    },
    {
        id: 8,
        name: "Bông Tai Khuyên Ngọc Xanh",
        description: "Bông tai khuyên đơn giản nhưng tinh tế với viên ngọc phỉ thúy xanh lục tự nhiên.",
        price: "28.300.000 VNĐ",
        image: "images/bongtai2.jpeg",
        badge: "PHỔ BIẾN",
        category: "Bông tai",
        material: "Ngọc phỉ thúy tự nhiên",
        origin: "Myanmar",
        warranty: "3 năm",
        certification: "GIA Certified"
    }
];

// Dữ liệu tin tức
const newsData = {
    breakingNews: [
        "• Giá ngọc phỉ thúy thượng hạng tăng 15% trong quý đầu năm 2024",
        "• Triển lãm ngọc quý quốc tế sẽ diễn ra tại Hà Nội tháng 10/2024",
        "• Phát hiện mỏ ngọc bích mới tại Myanmar với trữ lượng lớn",
        "• Chuyên gia phong thủy cảnh báo về ngọc giả trên thị trường"
    ],
    
    categories: [
        { name: "Phong thủy", count: 128, icon: "fas fa-yin-yang" },
        { name: "Ngọc quý", count: 95, icon: "fas fa-gem" },
        { name: "Văn hóa", count: 76, icon: "fas fa-landmark" },
        { name: "Thị trường", count: 54, icon: "fas fa-chart-line" }
    ],
    
    tags: [
        "Ngọc phỉ thúy", "Phong thủy", "Văn hóa", "Đầu tư",
        "Tài lộc", "May mắn", "Trang sức", "Cổ vật"
    ]
};

// Xuất dữ liệu
export { studentInfo, productsData, newsData };