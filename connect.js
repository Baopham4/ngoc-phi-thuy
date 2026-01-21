// =========================================== //
// KẾT NỐI TỰ ĐỘNG ADMIN - WEBSITE CHÍNH
// =========================================== //

const AdminConnector = {
    // Kiểm tra kết nối
    checkConnection() {
        return localStorage.getItem('adminProducts') !== null;
    },
    
    // Đồng bộ dữ liệu khi website load
    syncOnLoad() {
        console.log('🔄 Đang kiểm tra kết nối với admin...');
        
        if (this.checkConnection()) {
            console.log('✅ Phát hiện dữ liệu admin, đang đồng bộ...');
            this.syncProducts();
            this.updateCartFromAdmin();
        } else {
            console.log('ℹ️ Chưa có dữ liệu từ admin, sử dụng dữ liệu mặc định');
        }
    },
    
    // Đồng bộ sản phẩm
    syncProducts() {
        try {
            const adminProducts = JSON.parse(localStorage.getItem('adminProducts'));
            
            if (adminProducts && Array.isArray(adminProducts) && window.productsData) {
                // Chuyển đổi định dạng
                const formattedProducts = adminProducts.map(product => ({
                    id: product.id,
                    name: product.name,
                    description: product.description || "",
                    price: this.formatPrice(product.price) + " VNĐ",
                    image: product.image || this.getDefaultImage(product.category),
                    badge: product.salePrice ? "GIẢM GIÁ" : (product.badge || "MỚI"),
                    category: product.category,
                    material: product.details || "Ngọc phỉ thúy tự nhiên",
                    origin: "Myanmar",
                    warranty: product.category === "Vòng tay" ? "5 năm" : "3 năm",
                    certification: "GIA Certified",
                    salePrice: product.salePrice ? this.formatPrice(product.salePrice) + " VNĐ" : null,
                    stock: product.stock || 0,
                    status: product.status || "active"
                }));
                
                // Cập nhật biến toàn cục
                window.productsData = formattedProducts;
                
                console.log('✅ Đã đồng bộ', window.productsData.length, 'sản phẩm từ admin');
                
                // Kích hoạt sự kiện
                const event = new CustomEvent('productsSynced', {
                    detail: { 
                        count: window.productsData.length,
                        source: 'admin',
                        timestamp: Date.now()
                    }
                });
                window.dispatchEvent(event);
                
                // Cập nhật UI nếu các module đã được khởi tạo
                this.updateUI();
            }
        } catch (error) {
            console.error('❌ Lỗi đồng bộ:', error);
        }
    },
    
    // Cập nhật UI sau khi đồng bộ
    updateUI() {
        // Cập nhật trang sản phẩm
        if (typeof ProductsPage !== 'undefined' && ProductsPage.loadProducts) {
            ProductsPage.loadProducts();
            console.log('🔄 Đã cập nhật trang sản phẩm');
        }
        
        // Cập nhật trang chủ
        if (typeof HomePage !== 'undefined' && HomePage.loadFeaturedProducts) {
            HomePage.loadFeaturedProducts();
            console.log('🔄 Đã cập nhật trang chủ');
        }
        
        // Hiển thị thông báo
        if (typeof Core !== 'undefined' && Core.showNotification) {
            Core.showNotification('Đã cập nhật sản phẩm mới từ admin', 'success');
        }
    },
    
    // Cập nhật giỏ hàng từ admin (nếu có)
    updateCartFromAdmin() {
        const cartOrders = localStorage.getItem('adminCartOrders');
        if (cartOrders) {
            try {
                const orders = JSON.parse(cartOrders);
                console.log('📦 Có', orders.length, 'đơn hàng từ admin');
                // Có thể xử lý thêm ở đây nếu cần
            } catch (error) {
                console.error('❌ Lỗi xử lý đơn hàng:', error);
            }
        }
    },
    
    // Định dạng giá
    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    
    // Lấy ảnh mặc định
    getDefaultImage(category) {
        const categoryMap = {
            "Vòng tay": "images/vongtay1.jpg",
            "Dây chuyền": "images/daychuyen1.jpg", 
            "Nhẫn": "images/nhan1.jpg",
            "Bông tai": "images/bongtai1.jpg",
            "Mặt dây chuyền": "images/daychuyen1.jpg",
            "Khác": "images/default-product.jpg"
        };
        return categoryMap[category] || "images/default-product.jpg";
    },
    
    // API để admin gọi khi thay đổi dữ liệu
    refreshWebsite() {
        console.log('🔄 Admin yêu cầu refresh website');
        this.syncProducts();
        
        // Hiển thị thông báo cho user
        if (typeof Core !== 'undefined' && Core.showNotification) {
            Core.showNotification('Website đã được cập nhật với dữ liệu mới nhất!', 'success');
        }
        
        return true;
    },
    
    // Kiểm tra cập nhật định kỳ
    startAutoSync(interval = 30000) {
        console.log('⏰ Bật chế độ auto-sync mỗi', interval / 1000, 'giây');
        
        setInterval(() => {
            const lastSync = localStorage.getItem('adminLastSync');
            const currentTime = Date.now();
            
            if (!lastSync || (currentTime - parseInt(lastSync)) > 10000) {
                if (this.checkConnection()) {
                    this.syncProducts();
                    localStorage.setItem('adminLastSync', currentTime);
                }
            }
        }, interval);
    }
};

// Tự động đồng bộ khi load
document.addEventListener('DOMContentLoaded', () => {
    AdminConnector.syncOnLoad();
    AdminConnector.startAutoSync();
});

// Lắng nghe sự kiện từ admin
window.addEventListener('storage', (event) => {
    if (event.key === 'adminProducts' || event.key === 'websiteProducts') {
        console.log('🔄 Phát hiện thay đổi dữ liệu từ admin');
        AdminConnector.syncProducts();
    }
});

// Xuất cho sử dụng toàn cục
window.AdminConnector = AdminConnector;
console.log('✅ AdminConnector đã sẵn sàng');