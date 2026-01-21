// =========================================== //
// ADMIN DATA - PHỈ THÚY CHI BẢO
// =========================================== //

// Dữ liệu mẫu cho admin
const adminData = {
    // Thông tin admin
    adminInfo: {
        name: "Admin",
        email: "admin@phithuy.com",
        role: "Quản trị viên"
    },
    
    // Thống kê
    statistics: {
        totalOrders: 24,
        totalProducts: 156,
        totalCustomers: 89,
        totalRevenue: 128500000,
        recentOrders: 5,
        lowStockProducts: 8
    },
    
    // Cài đặt
    settings: {
        siteName: "Phỉ Thúy Chi Bảo",
        currency: "VNĐ",
        timezone: "Asia/Ho_Chi_Minh"
    }
};

// Hàm lấy dữ liệu sản phẩm từ localStorage hoặc tạo mẫu
function getProductsData() {
    let products = localStorage.getItem('adminProducts');
    
    if (!products) {
        // Tạo dữ liệu mẫu nếu chưa có
        products = [
            {
                id: 1,
                name: "Vòng tay Phỉ Thúy tự nhiên",
                category: "Vòng tay",
                description: "Vòng tay phỉ thúy cao cấp, màu xanh tự nhiên",
                details: "Phỉ thúy tự nhiên, đường kính 6cm",
                price: 18500000,
                salePrice: 16500000,
                stock: 15,
                status: "active",
                image: "../images/vongtay1.jpg"
            },
            {
                id: 2,
                name: "Dây chuyền mặt ngọc",
                category: "Dây chuyền",
                description: "Dây chuyền mặt ngọc phỉ thúy tinh xảo",
                details: "Vàng 18K, ngọc phỉ thúy tự nhiên",
                price: 32000000,
                salePrice: null,
                stock: 8,
                status: "active",
                image: "../images/daychuyen1.jpg"
            }
        ];
        
        localStorage.setItem('adminProducts', JSON.stringify(products));
    } else {
        products = JSON.parse(products);
    }
    
    return products;
}

// Hàm lấy dữ liệu đơn hàng
function getOrdersData() {
    return [
        {
            id: "DH001",
            customer: "Nguyễn Văn A",
            email: "a@email.com",
            phone: "0901234567",
            address: "123 Nguyễn Trãi, Hà Nội",
            items: [
                { productId: 1, name: "Vòng tay Phỉ Thúy", quantity: 1, price: 18500000 },
                { productId: 2, name: "Dây chuyền mặt ngọc", quantity: 1, price: 32000000 }
            ],
            total: 50500000,
            discount: 5000000,
            finalTotal: 45500000,
            status: "pending",
            paymentMethod: "cod",
            orderDate: "2023-12-15",
            notes: "Giao hàng giờ hành chính"
        }
    ];
}

// Export dữ liệu nếu dùng module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { adminData, getProductsData, getOrdersData };
}