// =========================================== //
// ADMIN JAVASCRIPT - PHỈ THÚY CHI BẢO
// =========================================== //

// Biến toàn cục
let products = JSON.parse(localStorage.getItem('adminProducts')) || [];
let currentProductId = null;

// ============================ //
// INITIALIZATION
// ============================ //
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra trang hiện tại
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    // Khởi tạo cho từng trang
    if (page === 'products.html' || page === 'products') {
        initProductsPage();
    } else if (page === 'index.html' || page === '' || page === 'admin') {
        initDashboard();
    } else if (page === 'orders.html') {
        initOrdersPage();
    } else if (page === 'customers.html') {
        initCustomersPage();
    }
    
    // Khởi tạo các sự kiện chung
    initCommonEvents();
});

// ============================ //
// PRODUCTS MANAGEMENT
// ============================ //
function initProductsPage() {
    loadProductsTable();
    setupProductModal();
    initImportExport();
}

function loadProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    // Load từ localStorage
    products = JSON.parse(localStorage.getItem('adminProducts')) || [];
    
    let html = '';
    
    if (products.length === 0) {
        html = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 40px;">
                    <div class="empty-state">
                        <div class="empty-icon">
                            <i class="fas fa-gem"></i>
                        </div>
                        <h3>Chưa có sản phẩm nào</h3>
                        <p>Bắt đầu bằng cách thêm sản phẩm đầu tiên</p>
                        <button class="btn btn-primary" id="addFirstProduct" style="margin-top: 20px;">
                            <i class="fas fa-plus"></i> Thêm sản phẩm đầu tiên
                        </button>
                    </div>
                </td>
            </tr>
        `;
    } else {
        products.forEach((product, index) => {
            const originalPrice = formatPrice(product.price);
            const salePrice = product.salePrice ? formatPrice(product.salePrice) : null;
            
            html += `
                <tr>
                    <td>#${String(index + 1).padStart(3, '0')}</td>
                    <td>
                        <img src="${product.image || getDefaultImage(product.category)}" 
                             alt="${product.name}" 
                             class="product-image"
                             onerror="this.src='../images/default-product.jpg'">
                    </td>
                    <td><strong>${product.name}</strong></td>
                    <td>${product.category}</td>
                    <td>
                        ${salePrice ? 
                            `<span style="text-decoration: line-through; color: #999; font-size: 0.9em;">${originalPrice} ₫</span><br>
                             <strong style="color: #e53935;">${salePrice} ₫</strong>` : 
                            `<strong>${originalPrice} ₫</strong>`
                        }
                    </td>
                    <td>${product.salePrice ? `<span class="status-badge status-pending">${Math.round((1 - product.salePrice/product.price) * 100)}%</span>` : '-'}</td>
                    <td><span class="${product.stock < 10 ? 'status-badge status-cancelled' : ''}">${product.stock}</span></td>
                    <td>
                        <span class="status-badge ${getStatusClass(product.status)}">
                            ${getStatusText(product.status)}
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-icon btn-edit" onclick="editProduct(${index})" title="Sửa">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon btn-delete" onclick="deleteProduct(${index})" title="Xóa">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    }
    
    tbody.innerHTML = html;
    
    // Thêm sự kiện cho nút thêm sản phẩm đầu tiên
    const addFirstBtn = document.getElementById('addFirstProduct');
    if (addFirstBtn) {
        addFirstBtn.addEventListener('click', () => openProductModal());
    }
}

function setupProductModal() {
    const modal = document.getElementById('productModal');
    const addBtn = document.getElementById('addProductBtn');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveProductBtn');
    const imageUpload = document.getElementById('imageUpload');
    const imageInput = document.getElementById('imageInput');
    
    // Mở modal thêm sản phẩm
    if (addBtn) {
        addBtn.addEventListener('click', () => openProductModal());
    }
    
    // Đóng modal
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
    // Xử lý upload hình ảnh
    if (imageUpload && imageInput) {
        imageUpload.addEventListener('click', () => imageInput.click());
        imageInput.addEventListener('change', handleImageUpload);
    }
    
    // Lưu sản phẩm
    if (saveBtn) {
        saveBtn.addEventListener('click', saveProduct);
    }
    
    // Đóng modal bằng ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function openProductModal(product = null) {
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('productForm');
    const preview = document.getElementById('imagePreview');
    
    // Reset form
    form.reset();
    preview.style.display = 'none';
    preview.src = '';
    
    if (product) {
        // Chế độ sửa
        modalTitle.textContent = 'Sửa sản phẩm';
        currentProductId = product.id;
        
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productDetails').value = product.details || '';
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productSalePrice').value = product.salePrice || '';
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productStatus').value = product.status || 'active';
        
        if (product.image) {
            preview.src = product.image;
            preview.style.display = 'block';
        }
    } else {
        // Chế độ thêm mới
        modalTitle.textContent = 'Thêm sản phẩm mới';
        currentProductId = Date.now();
        document.getElementById('productId').value = currentProductId;
    }
    
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    currentProductId = null;
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Kiểm tra kích thước file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB', 'error');
        return;
    }
    
    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
        showNotification('Vui lòng chọn file hình ảnh', 'error');
        return;
    }
    
    const preview = document.getElementById('imagePreview');
    const reader = new FileReader();
    
    reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
    }
    
    reader.onerror = function() {
        showNotification('Lỗi khi đọc file', 'error');
    }
    
    reader.readAsDataURL(file);
}

function saveProduct() {
    // Lấy dữ liệu từ form
    const product = {
        id: parseInt(document.getElementById('productId').value) || Date.now(),
        name: document.getElementById('productName').value.trim(),
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value.trim(),
        details: document.getElementById('productDetails').value.trim(),
        price: parseInt(document.getElementById('productPrice').value) || 0,
        salePrice: parseInt(document.getElementById('productSalePrice').value) || null,
        stock: parseInt(document.getElementById('productStock').value) || 0,
        status: document.getElementById('productStatus').value,
        image: document.getElementById('imagePreview').src || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Validate
    if (!product.name || !product.category || !product.price) {
        showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
        return;
    }
    
    if (product.price < 0) {
        showNotification('Giá sản phẩm không được âm', 'error');
        return;
    }
    
    if (product.salePrice && product.salePrice > product.price) {
        showNotification('Giá khuyến mãi không được lớn hơn giá gốc', 'error');
        return;
    }
    
    if (product.stock < 0) {
        showNotification('Số lượng tồn kho không được âm', 'error');
        return;
    }
    
    // Hiển thị loading
    const saveBtn = document.getElementById('saveProductBtn');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<div class="loading"></div> Đang lưu...';
    saveBtn.disabled = true;
    
    // Giả lập delay
    setTimeout(() => {
        if (currentProductId && currentProductId !== product.id) {
            // Cập nhật sản phẩm đã tồn tại
            const index = products.findIndex(p => p.id === currentProductId);
            if (index !== -1) {
                product.createdAt = products[index].createdAt; // Giữ ngày tạo
                products[index] = product;
                showNotification('Cập nhật sản phẩm thành công', 'success');
            }
        } else {
            // Thêm sản phẩm mới
            products.push(product);
            showNotification('Thêm sản phẩm mới thành công', 'success');
        }
        
        // Lưu vào localStorage
        localStorage.setItem('adminProducts', JSON.stringify(products));
        
        // Đồng bộ với website chính
        syncWithMainData();
        
        // Đóng modal và reload bảng
        closeModal();
        loadProductsTable();
        
        // Reset button
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
    }, 1000);
}

function editProduct(index) {
    if (index >= 0 && index < products.length) {
        openProductModal(products[index]);
    }
}

function deleteProduct(index) {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này? Thao tác này không thể hoàn tác.')) return;
    
    if (index >= 0 && index < products.length) {
        const productName = products[index].name;
        products.splice(index, 1);
        
        localStorage.setItem('adminProducts', JSON.stringify(products));
        syncWithMainData();
        
        showNotification(`Đã xóa sản phẩm "${productName}"`, 'success');
        loadProductsTable();
    }
}

// ============================ //
// IMPORT/EXPORT DATA
// ============================ //
function initImportExport() {
    const exportBtn = document.getElementById('exportDataBtn');
    const importBtn = document.getElementById('importDataBtn');
    const importInput = document.getElementById('importFile');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }
    
    if (importBtn && importInput) {
        importBtn.addEventListener('click', () => importInput.click());
        importInput.addEventListener('change', importData);
    }
}

function exportData() {
    const data = {
        products: products,
        exportedAt: new Date().toISOString(),
        version: '1.0',
        info: 'Dữ liệu từ Phỉ Thúy Chi Bảo Admin'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `phithuy_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('Đã xuất dữ liệu thành công', 'success');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            if (!importedData.products || !Array.isArray(importedData.products)) {
                throw new Error('File không hợp lệ');
            }
            
            if (confirm(`Bạn có chắc muốn nhập ${importedData.products.length} sản phẩm? Dữ liệu cũ sẽ bị ghi đè.`)) {
                products = importedData.products;
                localStorage.setItem('adminProducts', JSON.stringify(products));
                syncWithMainData();
                loadProductsTable();
                showNotification(`Đã nhập thành công ${products.length} sản phẩm`, 'success');
            }
        } catch (error) {
            showNotification('File không hợp lệ: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset input
}

// ============================ //
// SYNC WITH MAIN WEBSITE
// ============================ //
function syncWithMainData() {
    try {
        // Đồng bộ dữ liệu với website chính
        const formattedProducts = products.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description || "",
            price: formatPrice(product.price) + " VNĐ",
            image: product.image || getDefaultImage(product.category),
            badge: product.salePrice ? "GIẢM GIÁ" : (product.badge || "MỚI"),
            category: product.category,
            material: product.details || "Ngọc phỉ thúy tự nhiên",
            origin: "Myanmar",
            warranty: product.category === "Vòng tay" ? "5 năm" : "3 năm",
            certification: "GIA Certified",
            salePrice: product.salePrice ? formatPrice(product.salePrice) + " VNĐ" : null,
            stock: product.stock || 0,
            status: product.status || "active",
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        }));
        
        // Lưu vào localStorage để website chính có thể đọc
        localStorage.setItem('adminProducts', JSON.stringify(products));
        localStorage.setItem('websiteProducts', JSON.stringify(formattedProducts));
        localStorage.setItem('lastSync', Date.now());
        
        // Tạo event để website chính biết có dữ liệu mới
        window.dispatchEvent(new CustomEvent('adminDataUpdated', {
            detail: { productCount: products.length }
        }));
        
        // Log thông tin đồng bộ
        console.log(`[ADMIN] Đã đồng bộ ${products.length} sản phẩm với website chính`);
        
    } catch (error) {
        console.error('[ADMIN] Lỗi khi đồng bộ dữ liệu:', error);
        showNotification('Lỗi đồng bộ dữ liệu', 'error');
    }
}

// ============================ //
// DASHBOARD FUNCTIONS
// ============================ //
function initDashboard() {
    updateDashboardStats();
    loadRecentOrders();
    loadTopProducts();
}

function updateDashboardStats() {
    const stats = {
        totalOrders: 24,
        totalProducts: products.length,
        totalCustomers: 89,
        totalRevenue: 128500000,
        lowStockProducts: products.filter(p => p.stock < 10).length
    };
    
    // Cập nhật số liệu trên dashboard
    document.querySelectorAll('.stat-info h3').forEach((el, index) => {
        switch(index) {
            case 0: el.textContent = stats.totalOrders; break;
            case 1: el.textContent = stats.totalProducts; break;
            case 2: el.textContent = stats.totalCustomers; break;
            case 3: el.textContent = formatPrice(stats.totalRevenue); break;
        }
    });
}

function loadRecentOrders() {
    // Giả lập dữ liệu đơn hàng
    const orders = [
        { id: 'DH001', customer: 'Nguyễn Văn A', date: '15/12/2023', amount: 25800000, status: 'pending' },
        { id: 'DH002', customer: 'Trần Thị B', date: '14/12/2023', amount: 42500000, status: 'completed' },
        { id: 'DH003', customer: 'Lê Văn C', date: '13/12/2023', amount: 18500000, status: 'completed' },
        { id: 'DH004', customer: 'Phạm Thị D', date: '12/12/2023', amount: 32500000, status: 'cancelled' }
    ];
    
    const tbody = document.querySelector('#recentOrders tbody');
    if (!tbody) return;
    
    let html = '';
    orders.forEach(order => {
        html += `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.date}</td>
                <td>${formatPrice(order.amount)} ₫</td>
                <td><span class="status-badge status-${order.status}">${getOrderStatusText(order.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit"><i class="fas fa-eye"></i></button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function loadTopProducts() {
    const topProducts = products.slice(0, 5);
    const tbody = document.querySelector('#topProducts tbody');
    if (!tbody) return;
    
    let html = '';
    topProducts.forEach(product => {
        html += `
            <tr>
                <td>
                    <img src="${product.image || getDefaultImage(product.category)}" 
                         alt="${product.name}" 
                         class="product-image">
                </td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${formatPrice(product.price)} ₫</td>
                <td>${Math.floor(Math.random() * 100)}</td>
                <td>${product.stock}</td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// ============================ //
// ORDERS MANAGEMENT
// ============================ //
function initOrdersPage() {
    loadOrdersTable();
}

function loadOrdersTable() {
    const tbody = document.querySelector('#ordersTable tbody');
    if (!tbody) return;
    
    // Giả lập dữ liệu
    const orders = [
        { id: 'DH001', customer: 'Nguyễn Văn A', items: '2 sản phẩm', amount: 50500000, date: '15/12/2023', status: 'pending' },
        { id: 'DH002', customer: 'Trần Thị B', items: '1 sản phẩm', amount: 18500000, date: '14/12/2023', status: 'completed' },
        { id: 'DH003', customer: 'Lê Văn C', items: '3 sản phẩm', amount: 98500000, date: '13/12/2023', status: 'completed' },
        { id: 'DH004', customer: 'Phạm Thị D', items: '1 sản phẩm', amount: 32500000, date: '12/12/2023', status: 'cancelled' }
    ];
    
    let html = '';
    orders.forEach(order => {
        html += `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.items}</td>
                <td>${formatPrice(order.amount)} ₫</td>
                <td>${order.date}</td>
                <td><span class="status-badge status-${order.status}">${getOrderStatusText(order.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit"><i class="fas fa-eye"></i></button>
                        <button class="btn-icon btn-edit"><i class="fas fa-edit"></i></button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// ============================ //
// CUSTOMERS MANAGEMENT
// ============================ //
function initCustomersPage() {
    loadCustomersTable();
}

function loadCustomersTable() {
    const tbody = document.querySelector('#customersTable tbody');
    if (!tbody) return;
    
    // Giả lập dữ liệu
    const customers = [
        { id: '001', name: 'Nguyễn Văn A', email: 'a@email.com', phone: '0901234567', address: 'Hà Nội', orders: 3, joined: '12/12/2023' },
        { id: '002', name: 'Trần Thị B', email: 'b@email.com', phone: '0912345678', address: 'TP.HCM', orders: 5, joined: '10/12/2023' },
        { id: '003', name: 'Lê Văn C', email: 'c@email.com', phone: '0923456789', address: 'Đà Nẵng', orders: 2, joined: '08/12/2023' }
    ];
    
    let html = '';
    customers.forEach(customer => {
        html += `
            <tr>
                <td>#${customer.id}</td>
                <td><strong>${customer.name}</strong></td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.address}</td>
                <td>${customer.orders} đơn</td>
                <td>${customer.joined}</td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// ============================ //
// UTILITY FUNCTIONS
// ============================ //
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getStatusClass(status) {
    switch(status) {
        case 'active': return 'status-completed';
        case 'inactive': return 'status-cancelled';
        case 'outofstock': return 'status-pending';
        default: return '';
    }
}

function getStatusText(status) {
    switch(status) {
        case 'active': return 'Đang bán';
        case 'inactive': return 'Ngừng bán';
        case 'outofstock': return 'Hết hàng';
        default: return status;
    }
}

function getOrderStatusText(status) {
    switch(status) {
        case 'pending': return 'Chờ xử lý';
        case 'completed': return 'Hoàn thành';
        case 'cancelled': return 'Đã hủy';
        case 'shipping': return 'Đang giao';
        default: return status;
    }
}

function getDefaultImage(category) {
    const categoryMap = {
        "Vòng tay": "../images/vongtay1.jpg",
        "Dây chuyền": "../images/daychuyen1.jpg", 
        "Nhẫn": "../images/nhan1.jpg",
        "Bông tai": "../images/bongtai1.jpg"
    };
    return categoryMap[category] || "../images/default-product.jpg";
}

function showNotification(message, type = 'info') {
    // Xóa thông báo cũ nếu có
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    // Tạo thông báo mới
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Tự động ẩn sau 5 giây
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.4s ease-out reverse';
        setTimeout(() => notification.remove(), 400);
    }, 5000);
}

function initCommonEvents() {
    // Thêm style cho animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Auto-sync mỗi 30 giây
    setInterval(() => {
        if (products.length > 0) {
            syncWithMainData();
        }
    }, 30000);
}

// ============================ //
// EXPORT FUNCTIONS
// ============================ //
// Xuất các hàm để sử dụng từ HTML
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;