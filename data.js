// Trong file data.js - THAY THẾ CÁC LINK ẢNH
const productsData = [
    {
        id: 1,
        name: "Vòng Phỉ Thúy Lý Ngư",
        description: "Ngọc tự nhiên từ Myanmar, màu lục bảo thượng hạng. Thiết kế hình cá chép với ý nghĩa phong thủy vượng tài lộc.",
        price: "42.000.000 VNĐ",
        image: "https://images.unsplash.com/photo-1594575111051-4e2d1e301a80?w=400&h=400&fit=crop", // Ảnh ngọc xanh
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
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop", // Ảnh ngọc trắng
        badge: "CAO CẤP",
        category: "Mặt ngọc",
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
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop", // Ảnh nhẫn
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
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop", // Ảnh bông tai
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
        image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop", // Ảnh dây chuyền
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
        image: "https://images.unsplash.com/photo-1535957998253-26ae1ef29506?w=400&h=400&fit=crop", // Ảnh vòng tay
        badge: "ĐỘC QUYỀN",
        category: "Vòng tay",
        material: "Ngọc phỉ thúy + Vàng 24K",
        origin: "Myanmar",
        warranty: "Trọn đời",
        certification: "GIA Certified"
    }
];

// Tin tức - CŨNG SỬA LINK ẢNH
const newsData = {
    hero: {
        id: 1,
        title: "Bí mật phong thủy của ngọc phỉ thúy: Không chỉ là trang sức",
        excerpt: "Khám phá những bí ẩn phong thủy đằng sau viên ngọc quý được săn lùng nhất châu Á.",
        category: "phongthuy",
        author: "Nguyễn Phong Thủy",
        date: "15/04/2024",
        readTime: "8 phút",
        views: "25.4K",
        image: "https://images.unsplash.com/photo-1588345921523-c2dce2a71d8e?w=800&h=400&fit=crop" // Hero news
    },
    
    latestNews: [
        {
            id: 2,
            title: "Cách phân biệt ngọc phỉ thúy thật và giả trong 5 phút",
            excerpt: "Hướng dẫn chi tiết từ chuyên gia giúp bạn nhận biết ngọc phỉ thúy thật chỉ trong vài phút.",
            category: "ngocquy",
            date: "14/04/2024",
            views: "18.2K",
            image: "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?w=400&h=300&fit=crop" // News 1
        },
        {
            id: 3,
            title: "Vị trí đặt tượng phong thủy trong nhà mang lại tài lộc",
            excerpt: "Bí quyết bài trí tượng phong thủy đúng vị trí để thu hút năng lượng tích cực.",
            category: "phongthuy",
            date: "13/04/2024",
            views: "22.5K",
            image: "https://images.unsplash.com/photo-1547825407-12a4355f1c12?w=400&h=300&fit=crop" // News 2
        },
        {
            id: 4,
            title: "Lịch sử 3000 năm của ngọc bích trong văn hóa phương Đông",
            excerpt: "Hành trình xuyên suốt lịch sử của ngọc bích từ biểu tượng quyền lực đến vật phẩm phong thủy.",
            category: "vanhoa",
            date: "12/04/2024",
            views: "15.8K",
            image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop" // News 3
        }
    ]
};