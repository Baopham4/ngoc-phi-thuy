// =========================================== //
// JAVASCRIPT CHUNG CHO WEBSITE PHỈ THÚY CHI BẢO
// =========================================== //

import { studentInfo, productsData, newsData } from './data.js';

// Biến toàn cục
let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

// ============================ //
// CORE MODULE - CÁC HÀM CƠ BẢN
// ============================ //
const Core = {
    // Kiểm tra email hợp lệ
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Kiểm tra số điện thoại
    validatePhone(phone) {
        const phoneRegex = /^(0[0-9]{9,10})$/;
        return phoneRegex.test(phone);
    },

    // Format số tiền
    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    // Hiển thị thông báo
    showNotification(message, type = 'info') {
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
    },

    // Lưu giỏ hàng vào localStorage
    saveCartToStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
    },

    // Cập nhật số lượng giỏ hàng trên header
    updateCartCount() {
        const cartCounts = document.querySelectorAll('.cart-count');
        cartCounts.forEach(count => {
            count.textContent = shoppingCart.length;
        });
    },

    // Trích xuất giá từ chuỗi
    extractPrice(priceString) {
        if (!priceString) return 0;
        const num = priceString.replace(/[^0-9]/g, '');
        return parseInt(num) || 0;
    },

    // Thêm sản phẩm vào giỏ hàng
    addToCart(productId) {
        const product = productsData.find(p => p.id === productId);
        if (!product) {
            this.showNotification('Không tìm thấy sản phẩm', 'error');
            return;
        }
        
        // Kiểm tra xem sản phẩm đã có trong giỏ chưa
        const existingItem = shoppingCart.find(item => item.id === productId);
        if (!existingItem) {
            shoppingCart.push({
                ...product,
                quantity: 1,
                selected: true
            });
            this.saveCartToStorage();
            this.updateCartCount();
            this.showNotification(`Đã thêm "${product.name}" vào giỏ hàng`, 'success');
        } else {
            this.showNotification(`"${product.name}" đã có trong giỏ hàng`, 'info');
        }
    },

    // Hiển thị modal sản phẩm
    showProductModal(productId) {
        const product = productsData.find(p => p.id === productId);
        if (!product) {
            this.showNotification('Không tìm thấy sản phẩm', 'error');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'product-modal active';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close"><i class="fas fa-times"></i></button>
                <div class="modal-body">
                    <div class="modal-image">
                        <img src="${product.image}" alt="${product.name}" 
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/500x400/00796B/FFFFFF?text=Phỉ+Thúy'">
                    </div>
                    <div class="modal-info">
                        <h3>${product.name}</h3>
                        <p class="modal-description">${product.description}</p>
                        
                        <div class="modal-details">
                            <p><strong>Chất liệu:</strong> ${product.material}</p>
                            <p><strong>Xuất xứ:</strong> ${product.origin}</p>
                            <p><strong>Bảo hành:</strong> ${product.warranty}</p>
                            <p><strong>Kiểm định:</strong> ${product.certification}</p>
                        </div>
                        
                        <div class="modal-price">${product.price}</div>
                        
                        <div class="modal-buttons">
                            <button class="btn-primary add-to-cart-btn">
                                <i class="fas fa-shopping-cart"></i> THÊM VÀO GIỎ
                            </button>
                            <button class="btn-secondary consult-btn">
                                <i class="fas fa-comments"></i> TƯ VẤN NGAY
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup close events
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        const closeModal = () => modal.classList.remove('active');
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        
        // Thêm sự kiện cho nút thêm vào giỏ
        const addToCartBtn = modal.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', () => {
            this.addToCart(productId);
            closeModal();
        });
        
        // Thêm sự kiện cho nút tư vấn
        const consultBtn = modal.querySelector('.consult-btn');
        consultBtn.addEventListener('click', () => {
            window.location.href = 'lien-he.html';
            closeModal();
        });
        
        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
};

// ============================ //
// HEADER MODULE
// ============================ //
const Header = {
    init() {
        this.setupMobileMenu();
        this.setupActiveNav();
        Core.updateCartCount();
    },

    setupMobileMenu() {
        const mobileBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileBtn && navMenu) {
            mobileBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileBtn.innerHTML = navMenu.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });
            
            // Đóng menu khi click ra ngoài
            document.addEventListener('click', (e) => {
                if (!navMenu.contains(e.target) && !mobileBtn.contains(e.target) && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        }
    },

    setupActiveNav() {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html') ||
                (currentPage === 'index.html' && linkHref === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
};

// ============================ //
// FOOTER MODULE
// ============================ //
const Footer = {
    init() {
        this.updateCurrentYear();
        this.setupNewsletter();
    },

    updateCurrentYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    },

    setupNewsletter() {
        const newsletterForms = document.querySelectorAll('#newsletterForm, #newsletterFormSidebar');
        
        newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = form.querySelector('input[type="email"]');
                const email = emailInput.value.trim();

                if (!Core.validateEmail(email)) {
                    Core.showNotification('Vui lòng nhập email hợp lệ', 'error');
                    return;
                }

                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;

                // Hiệu ứng loading
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
                submitBtn.disabled = true;

                // Giả lập gửi dữ liệu
                setTimeout(() => {
                    emailInput.value = '';
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Đã đăng ký!';
                    Core.showNotification('Đăng ký nhận bản tin thành công!', 'success');

                    // Reset sau 3 giây
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 3000);
                }, 1500);
            });
        });
    }
};

// ============================ //
// BACK TO TOP FUNCTIONALITY
// ============================ //
const BackToTop = {
    init() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};

// ============================ //
// POPUP MODULE (THÔNG TIN SINH VIÊN)
// ============================ //
const Popup = {
    init() {
        // Chỉ hiển thị popup lần đầu
        if (!localStorage.getItem('studentPopupShown')) {
            setTimeout(() => {
                this.showPopup();
            }, 1000);
        }
    },

    showPopup() {
        const popup = document.createElement('div');
        popup.className = 'student-popup active';
        popup.id = 'studentPopup';
        
        popup.innerHTML = `
            <div class="popup-content">
                <div class="popup-header">
                    <h3><i class="fas fa-user-graduate"></i> THÔNG TIN SINH VIÊN</h3>
                </div>
                <div class="popup-body">
                    <div class="student-info-popup">
                        <p><strong>Họ tên:</strong> ${studentInfo.name}</p>
                        <p><strong>MSSV:</strong> ${studentInfo.mssv}</p>
                        <p><strong>Lớp:</strong> ${studentInfo.class}</p>
                        <p><strong>Môn học:</strong> ${studentInfo.subject}</p>
                        <p><strong>Dự án:</strong> ${studentInfo.project}</p>
                    </div>
                </div>
                <div class="popup-footer">
                    <button class="popup-close-btn" id="popupCloseBtn">ĐÃ HIỂU</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        this.setupPopupEvents();
    },

    setupPopupEvents() {
        const popup = document.getElementById('studentPopup');
        const closeBtn = document.getElementById('popupCloseBtn');
        
        if (!popup || !closeBtn) return;
        
        // Đóng khi click nút
        closeBtn.addEventListener('click', () => this.closePopup(popup));
        
        // Đóng khi click bên ngoài
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                this.closePopup(popup);
            }
        });
        
        // Đóng bằng phím ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && popup.classList.contains('active')) {
                this.closePopup(popup);
            }
        });
    },

    closePopup(popup) {
        popup.classList.remove('active');
        localStorage.setItem('studentPopupShown', 'true');
        
        setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
            }
        }, 300);
    }
};

// ============================ //
// TRANG CHỦ MODULE
// ============================ //
const HomePage = {
    init() {
        if (!document.querySelector('.categories-grid')) return;
        
        this.setupCategoryCards();
        this.setupScrollIndicator();
        this.loadFeaturedProducts();
    },

    setupCategoryCards() {
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Ngăn sự kiện khi click vào nút bên trong
                if (e.target.closest('.btn-view-category')) return;
                
                const category = card.dataset.category;
                window.location.href = `san-pham.html?category=${category}`;
            });
        });
    },

    setupScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                window.scrollTo({
                    top: window.innerHeight,
                    behavior: 'smooth'
                });
            });
        }
    },

    loadFeaturedProducts() {
        const container = document.getElementById('featuredProducts');
        if (!container) return;
        
        let html = '';
        // Lấy 4 sản phẩm đầu tiên
        productsData.slice(0, 4).forEach(product => {
            html += `
                <div class="product-card" onclick="Core.showProductModal(${product.id})">
                    <div class="product-img-container">
                        <img src="${product.image}" alt="${product.name}" class="product-img"
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/400x300/00796B/FFFFFF?text=Phỉ+Thúy'">
                        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-desc">${product.description.substring(0, 80)}...</p>
                        <p class="product-price">${product.price}</p>
                        <button class="product-link">
                            <i class="fas fa-gem"></i> XEM CHI TIẾT
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
};

// ============================ //
// TRANG SẢN PHẨM MODULE
// ============================ //
const ProductsPage = {
    init() {
        if (!document.querySelector('.products-grid')) return;
        
        this.loadProducts();
        this.setupViewToggle();
        this.setupSorting();
        this.setupFilters();
        this.setupSearch();
        this.loadFeaturedProducts();
        
        // Kiểm tra danh mục từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        if (categoryParam) {
            this.filterByCategory(categoryParam);
        }
    },

    loadProducts() {
        const gridContainer = document.getElementById('productsGrid');
        const listContainer = document.getElementById('productsList');
        
        if (!gridContainer || !listContainer) return;
        
        let gridHTML = '';
        let listHTML = '';
        
        productsData.forEach(product => {
            // Grid view
            gridHTML += `
                <div class="product-card" onclick="Core.showProductModal(${product.id})">
                    <div class="product-img-container">
                        <img src="${product.image}" alt="${product.name}" class="product-img"
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/400x300/00796B/FFFFFF?text=Phỉ+Thúy'">
                        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-desc">${product.description.substring(0, 80)}...</p>
                        <p class="product-price">${product.price}</p>
                        <button class="product-link">
                            <i class="fas fa-gem"></i> XEM CHI TIẾT
                        </button>
                    </div>
                </div>
            `;
            
            // List view
            listHTML += `
                <div class="product-list-item" onclick="Core.showProductModal(${product.id})">
                    <div class="product-list-img">
                        <img src="${product.image}" alt="${product.name}"
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/200x200/00796B/FFFFFF?text=Phỉ+Thúy'">
                    </div>
                    <div class="product-list-info">
                        <h3>${product.name}</h3>
                        <p class="description">${product.description}</p>
                        <div class="product-list-meta">
                            <span><i class="fas fa-gem"></i> ${product.category}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${product.origin}</span>
                            <span><i class="fas fa-shield-alt"></i> ${product.warranty}</span>
                        </div>
                        <div class="product-list-price">${product.price}</div>
                    </div>
                </div>
            `;
        });
        
        gridContainer.innerHTML = gridHTML;
        listContainer.innerHTML = listHTML;
        this.updateProductsCount();
    },

    loadFeaturedProducts() {
        const featuredList = document.getElementById('featuredProducts');
        if (!featuredList) return;
        
        let html = '';
        // Lấy 3 sản phẩm đầu tiên làm featured
        productsData.slice(0, 3).forEach(product => {
            html += `
                <div class="featured-product" onclick="Core.showProductModal(${product.id})">
                    <img src="${product.image}" alt="${product.name}"
                         onerror="this.onerror=null; this.src='https://via.placeholder.com/60x60/00796B/FFFFFF?text=P'">
                    <div class="featured-product-info">
                        <h4>${product.name}</h4>
                        <p class="price">${product.price}</p>
                    </div>
                </div>
            `;
        });
        
        featuredList.innerHTML = html;
    },

    setupViewToggle() {
        const viewBtns = document.querySelectorAll('.view-btn');
        const productsGrid = document.getElementById('productsGrid');
        const productsList = document.getElementById('productsList');
        
        if (!viewBtns.length || !productsGrid || !productsList) return;
        
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const view = btn.dataset.view;
                if (view === 'grid') {
                    productsGrid.classList.add('active');
                    productsList.classList.remove('active');
                } else {
                    productsList.classList.add('active');
                    productsGrid.classList.remove('active');
                }
            });
        });
    },

    setupSorting() {
        const sortSelect = document.getElementById('sortBy');
        if (!sortSelect) return;
        
        sortSelect.addEventListener('change', (e) => {
            this.sortProducts(e.target.value);
        });
    },

    setupFilters() {
        const applyBtn = document.getElementById('applyFilters');
        const resetBtn = document.getElementById('resetFilters');
        
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.filterProducts();
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }
        
        // Cập nhật giá hiển thị khi kéo slider
        const priceMin = document.getElementById('priceMin');
        const priceMax = document.getElementById('priceMax');
        const minPriceDisplay = document.getElementById('minPrice');
        const maxPriceDisplay = document.getElementById('maxPrice');
        
        if (priceMin && priceMax && minPriceDisplay && maxPriceDisplay) {
            const updatePriceDisplay = () => {
                minPriceDisplay.textContent = Core.formatPrice(parseInt(priceMin.value)) + ' VNĐ';
                maxPriceDisplay.textContent = Core.formatPrice(parseInt(priceMax.value)) + ' VNĐ';
            };
            
            priceMin.addEventListener('input', updatePriceDisplay);
            priceMax.addEventListener('input', updatePriceDisplay);
        }
    },

    setupSearch() {
        const searchInput = document.getElementById('productSearch');
        const searchBtn = document.querySelector('.search-btn');
        
        if (!searchInput) return;
        
        const performSearch = () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            if (searchTerm.length < 2) {
                Core.showNotification('Vui lòng nhập ít nhất 2 ký tự', 'info');
                return;
            }
            
            const products = document.querySelectorAll('.product-card, .product-list-item');
            let foundCount = 0;
            
            products.forEach(product => {
                const name = product.querySelector('.product-name, h3')?.textContent.toLowerCase();
                const desc = product.querySelector('.product-desc, .description')?.textContent.toLowerCase();
                
                if (name?.includes(searchTerm) || desc?.includes(searchTerm)) {
                    product.style.display = 'block';
                    foundCount++;
                } else {
                    product.style.display = 'none';
                }
            });
            
            Core.showNotification(`Tìm thấy ${foundCount} sản phẩm`, foundCount > 0 ? 'success' : 'info');
            this.updateProductsCount();
        };
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
        
        if (searchBtn) {
            searchBtn.addEventListener('click', performSearch);
        }
    },

    filterProducts() {
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
            .map(cb => cb.value);
        
        const minPrice = parseInt(document.getElementById('priceMin')?.value || 0);
        const maxPrice = parseInt(document.getElementById('priceMax')?.value || 500000000);
        
        const products = document.querySelectorAll('.product-card, .product-list-item');
        let visibleCount = 0;
        
        products.forEach(product => {
            const priceText = product.querySelector('.product-price, .product-list-price')?.textContent;
            const price = Core.extractPrice(priceText);
            
            let categoryMatch = true;
            if (selectedCategories.length > 0) {
                const categoryElement = product.querySelector('.product-list-meta span:first-child');
                const categoryText = categoryElement ? categoryElement.textContent.replace('Ngọc phỉ thúy', '').trim() : '';
                categoryMatch = selectedCategories.some(cat => categoryText.includes(cat));
            }
            
            const priceMatch = price >= minPrice && price <= maxPrice;
            
            if (categoryMatch && priceMatch) {
                product.style.display = 'block';
                visibleCount++;
            } else {
                product.style.display = 'none';
            }
        });
        
        this.updateProductsCount(visibleCount);
        Core.showNotification(`Hiển thị ${visibleCount} sản phẩm`, 'info');
    },

    resetFilters() {
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = checkbox.name === 'category' && checkbox.value === 'Vòng tay';
        });
        
        document.getElementById('priceMin').value = 0;
        document.getElementById('priceMax').value = 500000000;
        document.getElementById('minPrice').textContent = '0 VNĐ';
        document.getElementById('maxPrice').textContent = '500.000.000 VNĐ';
        
        this.filterProducts();
        Core.showNotification('Đã đặt lại bộ lọc', 'success');
    },

    sortProducts(sortBy) {
        const isGridView = document.querySelector('.view-btn[data-view="grid"]')?.classList.contains('active');
        const container = isGridView ? document.getElementById('productsGrid') : document.getElementById('productsList');
        const products = Array.from(container.children);
        
        products.sort((a, b) => {
            const aPriceText = a.querySelector('.product-price, .product-list-price')?.textContent;
            const bPriceText = b.querySelector('.product-price, .product-list-price')?.textContent;
            const aPrice = Core.extractPrice(aPriceText);
            const bPrice = Core.extractPrice(bPriceText);
            const aName = a.querySelector('.product-name, h3')?.textContent || '';
            const bName = b.querySelector('.product-name, h3')?.textContent || '';
            
            switch(sortBy) {
                case 'price-asc':
                    return aPrice - bPrice;
                case 'price-desc':
                    return bPrice - aPrice;
                case 'name-asc':
                    return aName.localeCompare(bName);
                case 'name-desc':
                    return bName.localeCompare(aName);
                default:
                    return 0;
            }
        });
        
        // Reorder products
        products.forEach(product => container.appendChild(product));
    },

    filterByCategory(category) {
        const categoryMap = {
            'daychuyen': 'Dây chuyền',
            'vongtay': 'Vòng tay',
            'nhan': 'Nhẫn',
            'bongtai': 'Bông tai'
        };
        
        const categoryName = categoryMap[category];
        if (categoryName) {
            // Check the corresponding checkbox
            const checkboxes = document.querySelectorAll('input[name="category"]');
            checkboxes.forEach(cb => {
                cb.checked = cb.value === categoryName;
            });
            
            // Apply filter
            this.filterProducts();
            Core.showNotification(`Đang hiển thị sản phẩm ${categoryName}`, 'info');
        }
    },

    updateProductsCount(count) {
        const countElement = document.getElementById('productsCount');
        if (countElement) {
            const totalCount = count || document.querySelectorAll('.product-card[style*="block"], .product-card:not([style])').length;
            countElement.textContent = totalCount;
        }
    }
};

// ============================ //
// TRANG TIN TỨC MODULE
// ============================ //
const NewsPage = {
    init() {
        if (!document.querySelector('.news-grid')) return;
        
        this.loadBreakingNews();
        this.loadCategories();
        this.loadTags();
        this.setupFAQ();
    },

    loadBreakingNews() {
        const breakingText = document.getElementById('breakingText');
        if (!breakingText) return;
        
        let newsHTML = '<span class="marquee">';
        newsData.breakingNews.forEach((news, index) => {
            newsHTML += news + (index < newsData.breakingNews.length - 1 ? ' &nbsp;&nbsp;•&nbsp;&nbsp; ' : '');
        });
        newsHTML += '</span>';
        
        breakingText.innerHTML = newsHTML;
    },

    loadCategories() {
        const categoryList = document.getElementById('categoryList');
        if (!categoryList) return;
        
        let categoryHTML = '';
        newsData.categories.forEach(category => {
            categoryHTML += `
                <a href="#" class="category-item" onclick="NewsPage.filterByCategory('${category.name}')">
                    <span class="category-name">
                        <i class="${category.icon}"></i> ${category.name}
                    </span>
                    <span class="category-count">${category.count}</span>
                </a>
            `;
        });
        
        categoryList.innerHTML = categoryHTML;
    },

        loadTags() {
        const tagsCloud = document.getElementById('tagsCloud');
        if (!tagsCloud) return;
        
        let tagsHTML = '';
        newsData.tags.forEach(tag => {
            tagsHTML += `
                <a href="#" class="tag" onclick="NewsPage.filterByTag('${tag}')">
                    #${tag}
                </a>
            `;
        });
        
        tagsCloud.innerHTML = tagsHTML;
    },

    setupFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                item.classList.toggle('active');
                const icon = question.querySelector('.faq-icon i');
                if (item.classList.contains('active')) {
                    icon.className = 'fas fa-chevron-up';
                } else {
                    icon.className = 'fas fa-chevron-down';
                }
            });
        });
    },

    filterByCategory(categoryName) {
        const categoryItems = document.querySelectorAll('.category-item');
        categoryItems.forEach(item => {
            item.classList.remove('active');
            if (item.textContent.includes(categoryName)) {
                item.classList.add('active');
            }
        });
        
        Core.showNotification(`Đang lọc tin tức theo: ${categoryName}`, 'info');
    },

    filterByTag(tagName) {
        Core.showNotification(`Đang tìm tin tức với từ khóa: #${tagName}`, 'info');
    }
};

// ============================ //
// TRANG GIỎ HÀNG MODULE
// ============================ //
const CartPage = {
    init() {
        if (!document.querySelector('.cart-container')) return;
        
        this.loadCartItems();
        this.setupCartEvents();
        this.updateCartSummary();
    },

    loadCartItems() {
        const tbody = document.getElementById('cartItems');
        if (!tbody) return;
        
        if (shoppingCart.length === 0) {
            this.showEmptyCart();
            return;
        }
        
        let html = '';
        let total = 0;
        let totalDiscount = 0;
        
        shoppingCart.forEach((item, index) => {
            const itemTotal = Core.extractPrice(item.price) * item.quantity;
            total += itemTotal;
            
            // Giảm giá 10% nếu có badge "Giảm giá"
            const discount = item.badge && item.badge.includes('Giảm giá') ? itemTotal * 0.1 : 0;
            totalDiscount += discount;
            
            html += `
                <tr class="cart-item" data-id="${item.id}">
                    <td class="cart-item-select">
                        <input type="checkbox" class="item-checkbox" ${item.selected ? 'checked' : ''}>
                    </td>
                    <td class="cart-item-info">
                        <div class="cart-item-details">
                            <img src="${item.image}" alt="${item.name}"
                                 onerror="this.onerror=null; this.src='https://via.placeholder.com/80x80/00796B/FFFFFF?text=P'">
                            <div class="cart-item-text">
                                <h4>${item.name}</h4>
                                <p>${item.description.substring(0, 60)}...</p>
                                <div class="cart-item-meta">
                                    <span><i class="fas fa-gem"></i> ${item.category}</span>
                                    <span><i class="fas fa-map-marker-alt"></i> ${item.origin}</span>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td class="cart-item-price">
                        <span class="original-price">${item.price}</span>
                        ${discount > 0 ? `<span class="discount-price">${Core.formatPrice(itemTotal - discount)} VNĐ</span>` : ''}
                    </td>
                    <td class="cart-item-quantity">
                        <div class="quantity-control">
                            <button class="quantity-btn minus" onclick="CartPage.updateQuantity(${index}, -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                                   onchange="CartPage.changeQuantity(${index}, this.value)">
                            <button class="quantity-btn plus" onclick="CartPage.updateQuantity(${index}, 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </td>
                    <td class="cart-item-total">
                        ${discount > 0 
                            ? `<span class="original-price">${Core.formatPrice(itemTotal)} VNĐ</span>
                               <span class="discount-price">${Core.formatPrice(itemTotal - discount)} VNĐ</span>`
                            : `${Core.formatPrice(itemTotal)} VNĐ`
                        }
                    </td>
                    <td class="cart-item-actions">
                        <button class="btn-icon" onclick="CartPage.removeItem(${index})" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn-icon" onclick="Core.showProductModal(${item.id})" title="Xem chi tiết">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
        this.updateCartSummary(total, totalDiscount);
    },

    showEmptyCart() {
        const cartContainer = document.querySelector('.cart-container');
        if (!cartContainer) return;
        
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <h3>Giỏ hàng trống</h3>
                <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                <a href="san-pham.html" class="btn-primary">
                    <i class="fas fa-gem"></i> MUA SẮM NGAY
                </a>
            </div>
        `;
    },

    updateCartSummary(total = 0, discount = 0) {
        const summaryTable = document.getElementById('cartSummary');
        if (!summaryTable) return;
        
        const selectedItems = shoppingCart.filter(item => item.selected);
        const subtotal = total - discount;
        const shipping = selectedItems.length > 0 ? 30000 : 0;
        const totalAmount = subtotal + shipping;
        
        summaryTable.innerHTML = `
            <div class="summary-row">
                <span>Tạm tính:</span>
                <span>${Core.formatPrice(total)} VNĐ</span>
            </div>
            ${discount > 0 ? `
            <div class="summary-row discount">
                <span>Giảm giá:</span>
                <span>-${Core.formatPrice(discount)} VNĐ</span>
            </div>
            ` : ''}
            <div class="summary-row">
                <span>Phí vận chuyển:</span>
                <span>${shipping > 0 ? Core.formatPrice(shipping) + ' VNĐ' : 'Miễn phí'}</span>
            </div>
            <div class="summary-row total">
                <span>Tổng cộng:</span>
                <span>${Core.formatPrice(totalAmount)} VNĐ</span>
            </div>
        `;
        
        // Cập nhật nút thanh toán
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.disabled = selectedItems.length === 0;
            checkoutBtn.textContent = selectedItems.length > 0 
                ? `THANH TOÁN (${selectedItems.length} SẢN PHẨM)` 
                : 'VUI LÒNG CHỌN SẢN PHẨM';
        }
    },

    setupCartEvents() {
        // Select all checkbox
        const selectAllCheckbox = document.getElementById('selectAll');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                const checkboxes = document.querySelectorAll('.item-checkbox');
                checkboxes.forEach((checkbox, index) => {
                    checkbox.checked = e.target.checked;
                    shoppingCart[index].selected = e.target.checked;
                });
                Core.saveCartToStorage();
                this.updateCartSummary();
            });
        }

        // Individual item checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('item-checkbox')) {
                const row = e.target.closest('.cart-item');
                const index = Array.from(row.parentNode.children).indexOf(row);
                shoppingCart[index].selected = e.target.checked;
                Core.saveCartToStorage();
                
                // Update select all checkbox
                const allChecked = Array.from(document.querySelectorAll('.item-checkbox'))
                    .every(cb => cb.checked);
                if (selectAllCheckbox) {
                    selectAllCheckbox.checked = allChecked;
                }
                
                this.updateCartSummary();
            }
        });

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                const selectedItems = shoppingCart.filter(item => item.selected);
                if (selectedItems.length === 0) {
                    Core.showNotification('Vui lòng chọn ít nhất một sản phẩm để thanh toán', 'error');
                    return;
                }
                
                // Lưu thông tin đơn hàng tạm thời
                localStorage.setItem('pendingOrder', JSON.stringify({
                    items: selectedItems,
                    timestamp: Date.now()
                }));
                
                window.location.href = 'thanh-toan.html';
            });
        }

        // Continue shopping button
        const continueBtn = document.getElementById('continueShopping');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                window.location.href = 'san-pham.html';
            });
        }

        // Clear cart button
        const clearBtn = document.getElementById('clearCart');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (shoppingCart.length === 0) {
                    Core.showNotification('Giỏ hàng đã trống', 'info');
                    return;
                }
                
                if (confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
                    shoppingCart = [];
                    Core.saveCartToStorage();
                    Core.updateCartCount();
                    this.loadCartItems();
                    Core.showNotification('Đã xóa toàn bộ giỏ hàng', 'success');
                }
            });
        }
    },

    updateQuantity(index, change) {
        const newQuantity = shoppingCart[index].quantity + change;
        if (newQuantity < 1) {
            this.removeItem(index);
            return;
        }
        
        shoppingCart[index].quantity = newQuantity;
        Core.saveCartToStorage();
        this.loadCartItems();
        Core.showNotification('Đã cập nhật số lượng', 'success');
    },

    changeQuantity(index, value) {
        const newQuantity = parseInt(value);
        if (isNaN(newQuantity) || newQuantity < 1) {
            shoppingCart[index].quantity = 1;
        } else {
            shoppingCart[index].quantity = newQuantity;
        }
        
        Core.saveCartToStorage();
        this.loadCartItems();
    },

    removeItem(index) {
        const itemName = shoppingCart[index].name;
        if (confirm(`Bạn có chắc chắn muốn xóa "${itemName}" khỏi giỏ hàng?`)) {
            shoppingCart.splice(index, 1);
            Core.saveCartToStorage();
            Core.updateCartCount();
            this.loadCartItems();
            Core.showNotification(`Đã xóa "${itemName}" khỏi giỏ hàng`, 'success');
        }
    }
};

// ============================ //
// TRANG THANH TOÁN MODULE
// ============================ //
const CheckoutPage = {
    init() {
        if (!document.querySelector('.checkout-container')) return;
        
        this.loadCheckoutItems();
        this.setupValidation();
        this.setupPaymentMethods();
        this.setupOrderSummary();
    },

    loadCheckoutItems() {
        const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder'));
        const itemsContainer = document.getElementById('checkoutItems');
        
        if (!pendingOrder || !pendingOrder.items || pendingOrder.items.length === 0) {
            Core.showNotification('Không có sản phẩm nào để thanh toán', 'error');
            setTimeout(() => window.location.href = 'gio-hang.html', 2000);
            return;
        }
        
        let html = '';
        let subtotal = 0;
        
        pendingOrder.items.forEach(item => {
            const itemTotal = Core.extractPrice(item.price) * item.quantity;
            subtotal += itemTotal;
            
            html += `
                <div class="checkout-item">
                    <div class="checkout-item-info">
                        <img src="${item.image}" alt="${item.name}"
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/60x60/00796B/FFFFFF?text=P'">
                        <div class="checkout-item-details">
                            <h4>${item.name}</h4>
                            <p>Số lượng: ${item.quantity}</p>
                            <p>${item.origin}</p>
                        </div>
                    </div>
                    <div class="checkout-item-price">
                        ${Core.formatPrice(itemTotal)} VNĐ
                    </div>
                </div>
            `;
        });
        
        itemsContainer.innerHTML = html;
        
        // Cập nhật tổng tiền
        const shipping = 30000;
        const total = subtotal + shipping;
        
        document.getElementById('subtotal').textContent = Core.formatPrice(subtotal) + ' VNĐ';
        document.getElementById('shipping').textContent = Core.formatPrice(shipping) + ' VNĐ';
        document.getElementById('total').textContent = Core.formatPrice(total) + ' VNĐ';
    },

    setupValidation() {
        const checkoutForm = document.getElementById('checkoutForm');
        if (!checkoutForm) return;
        
        // Real-time validation
        const inputs = checkoutForm.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
        });
        
        // Form submission
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate all fields
            let isValid = true;
            inputs.forEach(input => {
                if (!this.validateField(input)) isValid = false;
            });
            
            if (!isValid) {
                Core.showNotification('Vui lòng kiểm tra lại thông tin', 'error');
                return;
            }
            
            this.processOrder();
        });
    },

    validateField(input) {
        const value = input.value.trim();
        const errorElement = input.parentNode.querySelector('.error-message');
        
        // Remove existing error
        input.classList.remove('error');
        if (errorElement) errorElement.remove();
        
        // Check required
        if (input.required && !value) {
            this.showError(input, 'Trường này là bắt buộc');
            return false;
        }
        
        // Specific validations
        switch(input.type) {
            case 'email':
                if (!Core.validateEmail(value)) {
                    this.showError(input, 'Email không hợp lệ');
                    return false;
                }
                break;
                
            case 'tel':
                if (!Core.validatePhone(value)) {
                    this.showError(input, 'Số điện thoại không hợp lệ');
                    return false;
                }
                break;
                
            case 'text':
                if (input.id === 'fullName' && value.length < 3) {
                    this.showError(input, 'Tên phải có ít nhất 3 ký tự');
                    return false;
                }
                break;
        }
        
        return true;
    },

    showError(input, message) {
        input.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#f44336';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        
        input.parentNode.appendChild(errorElement);
    },

    setupPaymentMethods() {
        const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
        const codDetails = document.getElementById('codDetails');
        const bankDetails = document.getElementById('bankDetails');
        
        paymentMethods.forEach(method => {
            method.addEventListener('change', () => {
                if (method.value === 'cod') {
                    codDetails.classList.add('active');
                    bankDetails.classList.remove('active');
                } else {
                    bankDetails.classList.add('active');
                    codDetails.classList.remove('active');
                }
            });
        });
    },

    setupOrderSummary() {
        const discountBtn = document.getElementById('applyDiscount');
        const discountInput = document.getElementById('discountCode');
        
        if (discountBtn && discountInput) {
            discountBtn.addEventListener('click', () => {
                const code = discountInput.value.trim();
                
                if (code === 'PHITHUY10') {
                    const totalElement = document.getElementById('total');
                    const totalText = totalElement.textContent;
                    const total = Core.extractPrice(totalText);
                    const discounted = total * 0.9;
                    
                    totalElement.innerHTML = `
                        <span style="text-decoration: line-through; color: #999; margin-right: 10px;">
                            ${Core.formatPrice(total)} VNĐ
                        </span>
                        <span style="color: #e53935; font-weight: bold;">
                            ${Core.formatPrice(discounted)} VNĐ
                        </span>
                    `;
                    
                    Core.showNotification('Áp dụng mã giảm giá 10% thành công!', 'success');
                } else {
                    Core.showNotification('Mã giảm giá không hợp lệ', 'error');
                }
            });
        }
    },

    processOrder() {
        const submitBtn = document.querySelector('#checkoutForm button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ĐANG XỬ LÝ...';
        submitBtn.disabled = true;
        
        // Simulate order processing
        setTimeout(() => {
            // Get form data
            const formData = {
                customerInfo: {
                    fullName: document.getElementById('fullName').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    address: document.getElementById('address').value,
                    note: document.getElementById('note').value
                },
                paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
                discountCode: document.getElementById('discountCode').value || null,
                timestamp: Date.now(),
                orderId: 'DH' + Date.now().toString().slice(-8)
            };
            
            // Save order to localStorage
            const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder'));
            const order = {
                ...formData,
                items: pendingOrder.items,
                total: document.getElementById('total').textContent
            };
            
            // Save to orders history
            let ordersHistory = JSON.parse(localStorage.getItem('ordersHistory')) || [];
            ordersHistory.push(order);
            localStorage.setItem('ordersHistory', JSON.stringify(ordersHistory));
            
            // Remove pending order and cart items
            localStorage.removeItem('pendingOrder');
            shoppingCart = shoppingCart.filter(item => {
                const pendingItems = pendingOrder.items.map(i => i.id);
                return !pendingItems.includes(item.id);
            });
            Core.saveCartToStorage();
            Core.updateCartCount();
            
            // Redirect to confirmation
            localStorage.setItem('lastOrderId', order.orderId);
            window.location.href = 'xac-nhan-don-hang.html';
            
        }, 2000);
    }
};

// ============================ //
// TRANG XÁC NHẬN ĐƠN HÀNG
// ============================ //
const ConfirmationPage = {
    init() {
        if (!document.querySelector('.confirmation-container')) return;
        
        this.loadOrderConfirmation();
    },

    loadOrderConfirmation() {
        const orderId = localStorage.getItem('lastOrderId');
        const ordersHistory = JSON.parse(localStorage.getItem('ordersHistory')) || [];
        const order = ordersHistory.find(o => o.orderId === orderId);
        
        if (!order) {
            Core.showNotification('Không tìm thấy thông tin đơn hàng', 'error');
            setTimeout(() => window.location.href = 'index.html', 3000);
            return;
        }
        
        // Update confirmation details
        document.getElementById('orderId').textContent = order.orderId;
        document.getElementById('customerName').textContent = order.customerInfo.fullName;
        document.getElementById('customerEmail').textContent = order.customerInfo.email;
        document.getElementById('customerPhone').textContent = order.customerInfo.phone;
        document.getElementById('customerAddress').textContent = order.customerInfo.address;
        document.getElementById('paymentMethod').textContent = 
            order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng';
        document.getElementById('orderTotal').textContent = order.total;
        document.getElementById('orderNote').textContent = order.customerInfo.note || 'Không có ghi chú';
        
        // Setup continue button
        const continueBtn = document.getElementById('continueShoppingBtn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
        
        // Show success message
        Core.showNotification('Đơn hàng đã được xác nhận thành công!', 'success');
    }
};

// ============================ //
// TRANG LIÊN HỆ
// ============================ //
const ContactPage = {
    init() {
        if (!document.querySelector('.contact-container')) return;
        
        this.setupContactForm();
        this.setupMap();
        this.setupBusinessHours();
    },

    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('contactName').value.trim(),
                email: document.getElementById('contactEmail').value.trim(),
                phone: document.getElementById('contactPhone').value.trim(),
                subject: document.getElementById('contactSubject').value.trim(),
                message: document.getElementById('contactMessage').value.trim()
            };
            
            // Validation
            if (!formData.name || formData.name.length < 3) {
                Core.showNotification('Vui lòng nhập tên hợp lệ (ít nhất 3 ký tự)', 'error');
                return;
            }
            
            if (!Core.validateEmail(formData.email)) {
                Core.showNotification('Vui lòng nhập email hợp lệ', 'error');
                return;
            }
            
            if (!Core.validatePhone(formData.phone)) {
                Core.showNotification('Vui lòng nhập số điện thoại hợp lệ', 'error');
                return;
            }
            
            if (!formData.subject) {
                Core.showNotification('Vui lòng nhập chủ đề', 'error');
                return;
            }
            
            if (!formData.message || formData.message.length < 10) {
                Core.showNotification('Vui lòng nhập nội dung tin nhắn (ít nhất 10 ký tự)', 'error');
                return;
            }
            
            // Simulate sending
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ĐANG GỬI...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                Core.showNotification('Tin nhắn đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.', 'success');
            }, 2000);
        });
    },

    setupMap() {
        const mapContainer = document.getElementById('mapContainer');
        if (!mapContainer) return;
        
        // Simulated map coordinates
        const mapHTML = `
            <div class="map-placeholder">
                <div class="map-marker">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
                <div class="map-info">
                    <h4>Phỉ Thúy Chi Bảo</h4>
                    <p>Số 123, Đường Trần Hưng Đạo, Quận 1, TP.HCM</p>
                    <p>Điện thoại: 028 1234 5678</p>
                </div>
            </div>
        `;
        
        mapContainer.innerHTML = mapHTML;
    },

    setupBusinessHours() {
        const hoursList = document.getElementById('businessHours');
        if (!hoursList) return;
        
        const hours = [
            { day: 'Thứ 2 - Thứ 6', time: '8:00 - 20:00' },
            { day: 'Thứ 7', time: '9:00 - 18:00' },
            { day: 'Chủ nhật', time: '9:00 - 16:00' }
        ];
        
        let html = '';
        hours.forEach(hour => {
            html += `
                <div class="hour-item">
                    <span class="day">${hour.day}</span>
                    <span class="time">${hour.time}</span>
                </div>
            `;
        });
        
        hoursList.innerHTML = html;
    }
};

// ============================ //
// MAIN INITIALIZATION
// ============================ //
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo các module chung
    Header.init();
    Footer.init();
    BackToTop.init();
    Popup.init();
    
    // Kiểm tra trang hiện tại và khởi tạo module tương ứng
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    switch(page) {
        case '':
        case 'index.html':
            HomePage.init();
            break;
            
        case 'san-pham.html':
            ProductsPage.init();
            break;
            
        case 'tin-tuc.html':
            NewsPage.init();
            break;
            
        case 'gio-hang.html':
            CartPage.init();
            break;
            
        case 'thanh-toan.html':
            CheckoutPage.init();
            break;
            
        case 'xac-nhan-don-hang.html':
            ConfirmationPage.init();
            break;
            
        case 'lien-he.html':
            ContactPage.init();
            break;
    }
    
    // Setup global event listeners
    setupGlobalListeners();
});

// ============================ //
// GLOBAL EVENT LISTENERS
// ============================ //
function setupGlobalListeners() {
    // Xử lý tất cả các nút "Thêm vào giỏ hàng"
    document.addEventListener('click', function(e) {
        const addToCartBtn = e.target.closest('.add-to-cart-btn:not([data-bound])');
        if (addToCartBtn) {
            const productId = parseInt(addToCartBtn.dataset.productId);
            if (productId) {
                e.preventDefault();
                e.stopPropagation();
                Core.addToCart(productId);
            }
        }
    });
    
    // Xử lý tất cả các nút "Xem chi tiết"
    document.addEventListener('click', function(e) {
        const viewDetailBtn = e.target.closest('.view-detail-btn:not([data-bound])');
        if (viewDetailBtn) {
            const productId = parseInt(viewDetailBtn.dataset.productId);
            if (productId) {
                e.preventDefault();
                e.stopPropagation();
                Core.showProductModal(productId);
            }
        }
    });
}

// ============================ //
// EXPORT CHO CÁC MODULE
// ============================ //
// Xuất các module để có thể truy cập từ global scope
window.Core = Core;
window.Header = Header;
window.HomePage = HomePage;
window.ProductsPage = ProductsPage;
window.NewsPage = NewsPage;
window.CartPage = CartPage;
window.CheckoutPage = CheckoutPage;
window.ContactPage = ContactPage;