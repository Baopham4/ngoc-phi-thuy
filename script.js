// =========================================== //
// JAVASCRIPT CHUNG CHO CẢ 2 TRANG
// =========================================== //

import { studentInfo, productsData, newsData, shoppingCart } from './data.js';

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
};

// ============================ //
// HEADER MODULE
// ============================ //
const Header = {
    init() {
        this.setupMobileMenu();
        this.setupActiveNav();
        this.updateCartCount();
    },

    setupMobileMenu() {
        const mobileBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileBtn) {
            mobileBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileBtn.innerHTML = navMenu.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });
        }
    },

    setupActiveNav() {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = shoppingCart.length;
        }
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
        const newsletterForm = document.getElementById('newsletterForm');
        if (!newsletterForm) return;

        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (!Core.validateEmail(email)) {
                Core.showNotification('Vui lòng nhập email hợp lệ', 'error');
                return;
            }

            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
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
// TRANG CHỦ MODULE (index.html)
// ============================ //
const HomePage = {
    init() {
        if (!document.querySelector('.products-grid')) return;
        
        this.loadProducts();
        this.setupParticles();
        this.setupContactForm();
        this.setupScrollIndicator();
    },

    loadProducts() {
        const productsContainer = document.getElementById('productsContainer');
        if (!productsContainer) return;
        
        let productsHTML = '';
        productsData.forEach(product => {
            productsHTML += `
                <div class="product-card" data-id="${product.id}">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    <div class="product-img-container">
                        <img src="${product.image}" alt="${product.name}" class="product-img">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-desc">${product.description}</p>
                        <p class="product-price">${product.price}</p>
                        <a href="#" class="product-link" onclick="HomePage.showProductModal(${product.id}); return false;">
                            <i class="fas fa-gem"></i> XEM CHI TIẾT
                        </a>
                    </div>
                </div>
            `;
        });
        
        productsContainer.innerHTML = productsHTML;
    },

    setupParticles() {
        if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
            particlesJS("particles-js", {
                particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } },
                    color: { value: ["#d4af37", "#ffffff", "#80cbc4"] },
                    opacity: { value: 0.7, random: true },
                    size: { value: 3, random: true },
                    line_linked: { enable: true, distance: 150, color: "#d4af37", opacity: 0.2, width: 1 },
                    move: { enable: true, speed: 2, direction: "none" }
                }
            });
        }
    },

    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = contactForm.querySelector('input[type="text"]').value.trim();
            const phone = contactForm.querySelector('input[type="tel"]').value.trim();
            const email = contactForm.querySelector('input[type="email"]').value.trim();
            const message = contactForm.querySelector('textarea').value.trim();
            
            // Validation
            if (!name || !phone || !email || !message) {
                Core.showNotification('Vui lòng điền đầy đủ thông tin', 'error');
                return;
            }
            
            if (!Core.validateEmail(email)) {
                Core.showNotification('Email không hợp lệ', 'error');
                return;
            }
            
            if (!Core.validatePhone(phone)) {
                Core.showNotification('Số điện thoại không hợp lệ', 'error');
                return;
            }
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Hiệu ứng loading
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ĐANG GỬI...';
            submitBtn.disabled = true;
            
            // Giả lập gửi
            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerHTML = '<i class="fas fa-check"></i> ĐÃ GỬI';
                Core.showNotification('Yêu cầu tư vấn đã được gửi thành công!', 'success');
                
                // Reset sau 3 giây
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }, 2000);
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

    showProductModal(productId) {
        const product = productsData.find(p => p.id === productId);
        if (!product) return;
        
        const modal = document.createElement('div');
        modal.className = 'product-modal active';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close"><i class="fas fa-times"></i></button>
                <div style="display: flex;">
                    <div style="flex: 1; padding: 30px;">
                        <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 10px;">
                    </div>
                    <div style="flex: 1; padding: 40px;">
                        <h3 style="font-size: 32px; margin-bottom: 15px;">${product.name}</h3>
                        <p style="color: var(--gray-text); margin-bottom: 20px;">${product.description}</p>
                        
                        <div style="background: var(--jade-very-light); padding: 20px; border-radius: 10px; margin: 25px 0;">
                            <p><strong>Chất liệu:</strong> ${product.material}</p>
                            <p><strong>Xuất xứ:</strong> ${product.origin}</p>
                            <p><strong>Bảo hành:</strong> ${product.warranty}</p>
                            <p><strong>Kiểm định:</strong> ${product.certification}</p>
                        </div>
                        
                        <div style="font-size: 36px; color: var(--gold); font-weight: bold; margin: 20px 0; text-align: center;">
                            ${product.price}
                        </div>
                        
                        <div style="display: flex; gap: 15px; margin-top: 30px;">
                            <button class="btn-primary" onclick="HomePage.addToCart(${product.id})">
                                <i class="fas fa-shopping-cart"></i> THÊM VÀO GIỎ
                            </button>
                            <button class="btn-secondary" onclick="Core.showNotification('Yêu cầu tư vấn đã được gửi!', 'success'); document.querySelector('.product-modal.active').classList.remove('active');">
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
        
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        overlay.addEventListener('click', () => modal.classList.remove('active'));
        
        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.classList.remove('active');
            }
        });
    },

    addToCart(productId) {
        const product = productsData.find(p => p.id === productId);
        if (product) {
            shoppingCart.push(product);
            Header.updateCartCount();
            Core.showNotification(`Đã thêm "${product.name}" vào giỏ hàng`, 'success');
            
            // Close modal
            const modal = document.querySelector('.product-modal.active');
            if (modal) {
                modal.classList.remove('active');
            }
        }
    }
};

// ============================ //
// TRANG TIN TỨC MODULE (news.html)
// ============================ //
const NewsPage = {
    init() {
        if (!document.querySelector('.hero-news')) return;
        
        this.loadBreakingNews();
        this.loadHeroNews();
        this.loadLatestNews();
        this.loadTrendingNews();
        this.loadCategories();
        this.loadTags();
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

    loadHeroNews() {
        const heroNews = document.querySelector('.hero-news');
        if (!heroNews) return;
        
        const hero = newsData.hero;
        heroNews.innerHTML = `
            <div class="hero-news-content">
                <span class="news-category category-phongthuy">
                    <i class="fas fa-yin-yang"></i> PHONG THỦY
                </span>
                <h1 class="hero-news-title">${hero.title}</h1>
                <p class="hero-news-excerpt">${hero.excerpt}</p>
                <div class="news-meta">
                    <span><i class="fas fa-user"></i> ${hero.author}</span>
                    <span><i class="fas fa-calendar"></i> ${hero.date}</span>
                    <span><i class="fas fa-clock"></i> Đọc ${hero.readTime}</span>
                    <span><i class="fas fa-eye"></i> ${hero.views} lượt xem</span>
                </div>
                <button class="read-hero-btn" onclick="NewsPage.openArticle(${hero.id})">
                    <i class="fas fa-book-open"></i> Đọc bài viết
                </button>
            </div>
        `;
    },

    loadLatestNews() {
        const latestNews = document.getElementById('latestNews');
        if (!latestNews) return;
        
        let newsHTML = '';
        newsData.latestNews.forEach(news => {
            const categoryClass = `category-${news.category}`;
            const categoryName = this.getCategoryName(news.category);
            const categoryIcon = this.getCategoryIcon(news.category);
            
            newsHTML += `
                <div class="news-card" onclick="NewsPage.openArticle(${news.id})">
                    <img src="${news.image}" alt="${news.title}" class="news-image">
                    <div class="news-content">
                        <span class="news-category-badge ${categoryClass}">
                            <i class="${categoryIcon}"></i> ${categoryName}
                        </span>
                        <h3 class="news-title">${news.title}</h3>
                        <p class="news-excerpt">${news.excerpt}</p>
                        <div class="news-footer">
                            <span class="news-date"><i class="far fa-calendar"></i> ${news.date}</span>
                            <span class="news-views"><i class="fas fa-eye"></i> ${news.views} lượt xem</span>
                            <a href="#" class="read-more" onclick="event.stopPropagation(); NewsPage.openArticle(${news.id}); return false;">
                                Đọc tiếp <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        });
        
        latestNews.innerHTML = newsHTML;
    },

    loadTrendingNews() {
        const trendingNews = document.getElementById('trendingNews');
        if (!trendingNews) return;
        
        let trendingHTML = '';
        newsData.trendingNews.forEach((news, index) => {
            trendingHTML += `
                <div class="trending-item" onclick="NewsPage.openArticle(${news.id})">
                    <div class="trending-number">${index + 1}</div>
                    <div class="trending-content">
                        <div class="trending-title">${news.title}</div>
                        <div class="trending-meta">
                            <span><i class="fas fa-eye"></i> ${news.views} lượt xem</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        trendingNews.innerHTML = trendingHTML;
    },

    loadCategories() {
        const categoryList = document.getElementById('categoryList');
        if (!categoryList) return;
        
        let categoryHTML = '';
        newsData.categories.forEach(category => {
            categoryHTML += `
                <a href="#" class="category-item" onclick="event.preventDefault(); NewsPage.filterByCategory('${category.name}');">
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
                <a href="#" class="tag" onclick="event.preventDefault(); NewsPage.filterByTag('${tag}');">${tag}</a>
            `;
        });
        
        tagsCloud.innerHTML = tagsHTML;
    },

    getCategoryName(category) {
        const names = {
            'phongthuy': 'PHONG THỦY',
            'ngocquy': 'NGỌC QUÝ',
            'vanhoa': 'VĂN HÓA',
            'thitruong': 'THỊ TRƯỜNG'
        };
        return names[category] || 'TIN TỨC';
    },

    getCategoryIcon(category) {
        const icons = {
            'phongthuy': 'fas fa-yin-yang',
            'ngocquy': 'fas fa-gem',
            'vanhoa': 'fas fa-landmark',
            'thitruong': 'fas fa-chart-line'
        };
        return icons[category] || 'fas fa-newspaper';
    },

    openArticle(articleId) {
        // Tìm bài viết
        let article = newsData.hero.id === articleId ? newsData.hero : 
                     newsData.latestNews.find(n => n.id === articleId) ||
                     newsData.trendingNews.find(n => n.id === articleId);
        
        if (!article) {
            Core.showNotification('Không tìm thấy bài viết', 'error');
            return;
        }
        
        const categoryClass = `category-${article.category}`;
        const categoryName = this.getCategoryName(article.category);
        const categoryIcon = this.getCategoryIcon(article.category);
        
        const modal = document.createElement('div');
        modal.className = 'product-modal active';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close"><i class="fas fa-times"></i></button>
                <div style="padding: 40px;">
                    <span class="news-category-badge ${categoryClass}" style="margin-bottom: 20px; display: inline-block;">
                        <i class="${categoryIcon}"></i> ${categoryName}
                    </span>
                    <h1 style="font-size: 36px; margin-bottom: 20px;">${article.title}</h1>
                    
                    <div style="display: flex; gap: 30px; color: var(--gray-text); margin-bottom: 30px; flex-wrap: wrap;">
                        <span><i class="fas fa-user"></i> ${article.author || 'Ngọc Báo'}</span>
                        <span><i class="fas fa-calendar"></i> ${article.date}</span>
                        <span><i class="fas fa-clock"></i> Đọc ${article.readTime || '5 phút'}</span>
                        <span><i class="fas fa-eye"></i> ${article.views} lượt xem</span>
                    </div>
                    
                    <img src="${article.image}" alt="${article.title}" style="width: 100%; border-radius: 15px; margin: 30px 0;">
                    
                    <div style="line-height: 1.8; font-size: 16px;">
                        <p>${article.excerpt}</p>
                        
                        <h2 style="margin: 30px 0 15px;">Nội dung chi tiết</h2>
                        <p>Đây là nội dung chi tiết của bài viết về ${article.title.toLowerCase()}. Trong thực tế, đây sẽ là nội dung đầy đủ của bài báo với nhiều đoạn văn, hình ảnh và thông tin chi tiết.</p>
                        
                        <h3 style="margin: 25px 0 10px;">Thông tin quan trọng</h3>
                        <ul style="margin: 15px 0 25px; padding-left: 20px;">
                            <li>Thông tin chính xác và cập nhật nhất</li>
                            <li>Phân tích từ các chuyên gia hàng đầu</li>
                            <li>Dữ liệu thống kê đáng tin cậy</li>
                            <li>Góc nhìn đa chiều về vấn đề</li>
                        </ul>
                        
                        <blockquote style="background: var(--jade-very-light); padding: 25px; border-left: 5px solid var(--gold); margin: 30px 0; font-style: italic;">
                            <i class="fas fa-quote-left" style="color: var(--gold); font-size: 24px; margin-bottom: 15px; display: block;"></i>
                            <p>"Đây là một trích dẫn quan trọng từ bài viết, thể hiện quan điểm của chuyên gia về vấn đề được đề cập."</p>
                            <cite style="display: block; margin-top: 15px; font-weight: bold; color: var(--jade-medium);">- Chuyên gia Phong Thủy</cite>
                        </blockquote>
                    </div>
                    
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--jade-very-light);">
                        <strong>Tags:</strong>
                        ${newsData.tags.slice(0, 5).map(tag => `<span class="tag" style="margin: 0 5px 5px 0; display: inline-block;">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup close events
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        overlay.addEventListener('click', () => modal.classList.remove('active'));
        
        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.classList.remove('active');
            }
        });
    },

    filterByCategory(category) {
        Core.showNotification(`Đang lọc tin tức theo danh mục: ${category}`, 'info');
    },

    filterByTag(tag) {
        Core.showNotification(`Đang tìm kiếm tin tức với tag: ${tag}`, 'info');
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
// INITIALIZE ALL MODULES
// ============================ //
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website đã tải thành công!');
    console.log(`Sinh viên: ${studentInfo.name} - MSSV: ${studentInfo.mssv}`);
    
    // Khởi tạo các module chung
    Header.init();
    Footer.init();
    Popup.init();
    BackToTop.init();
    
    // Khởi tạo module cho trang cụ thể
    const isHomePage = document.querySelector('.products-grid');
    const isNewsPage = document.querySelector('.hero-news');
    
    if (isHomePage) {
        HomePage.init();
        console.log('Đã khởi tạo trang chủ');
    }
    
    if (isNewsPage) {
        NewsPage.init();
        console.log('Đã khởi tạo trang tin tức');
    }
});

// ============================ //
// GLOBAL EXPORTS
// ============================ //
window.Core = Core;
window.HomePage = HomePage;
window.NewsPage = NewsPage;

// ============================ //
// TRANG SẢN PHẨM MODULE
// ============================ //
const ProductsPage = {
    init() {
        if (!document.querySelector('.products-grid')) return;
        
        this.loadProducts();
        this.setupFilters();
        this.setupSorting();
        this.setupViewToggle();
        this.setupSearch();
        this.loadFeaturedProducts();
    },

    loadProducts() {
        const productsGrid = document.getElementById('productsGrid');
        const productsList = document.getElementById('productsList');
        
        if (!productsGrid || !productsList) return;
        
        let gridHTML = '';
        let listHTML = '';
        
        productsData.forEach(product => {
            // Grid view
            gridHTML += `
                <div class="product-card" data-id="${product.id}" 
                     data-category="${product.category}" 
                     data-material="${product.material}" 
                     data-origin="${product.origin}" 
                     data-price="${this.extractPrice(product.price)}">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    <div class="product-img-container">
                        <img src="${product.image}" alt="${product.name}" class="product-img">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-desc">${product.description}</p>
                        <p class="product-price">${product.price}</p>
                        <a href="#" class="product-link" onclick="ProductsPage.showProductModal(${product.id}); return false;">
                            <i class="fas fa-gem"></i> XEM CHI TIẾT
                        </a>
                    </div>
                </div>
            `;
            
            // List view
            listHTML += `
                <div class="product-list-item" data-id="${product.id}" 
                     data-category="${product.category}" 
                     data-material="${product.material}" 
                     data-origin="${product.origin}" 
                     data-price="${this.extractPrice(product.price)}">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-list-info">
                        <h3>${product.name}</h3>
                        <p class="description">${product.description}</p>
                        <div class="product-list-meta">
                            <span><i class="fas fa-gem"></i> ${product.category}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${product.origin}</span>
                            <span><i class="fas fa-shield-alt"></i> ${product.warranty}</span>
                        </div>
                        <div class="product-list-price">${product.price}</div>
                        <div class="product-list-actions">
                            <button class="btn-primary" onclick="ProductsPage.showProductModal(${product.id})">
                                <i class="fas fa-eye"></i> Xem chi tiết
                            </button>
                            <button class="btn-secondary" onclick="ProductsPage.addToCart(${product.id})">
                                <i class="fas fa-cart-plus"></i> Thêm giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        productsGrid.innerHTML = gridHTML;
        productsList.innerHTML = listHTML;
        this.updateProductsCount();
    },

    loadFeaturedProducts() {
        const featuredList = document.querySelector('.featured-products-list');
        if (!featuredList) return;
        
        let html = '';
        // Lấy 3 sản phẩm đầu tiên làm featured
        productsData.slice(0, 3).forEach(product => {
            html += `
                <div class="featured-product" onclick="ProductsPage.showProductModal(${product.id})">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="featured-product-info">
                        <h4>${product.name}</h4>
                        <p class="price">${product.price}</p>
                    </div>
                </div>
            `;
        });
        
        featuredList.innerHTML = html;
    },

    setupFilters() {
        const applyBtn = document.getElementById('applyFilters');
        const resetBtn = document.getElementById('resetFilters');
        const priceMin = document.getElementById('priceMin');
        const priceMax = document.getElementById('priceMax');
        const minPriceDisplay = document.getElementById('minPrice');
        const maxPriceDisplay = document.getElementById('maxPrice');
        
        if (!applyBtn || !priceMin) return;
        
        // Update price display
        const updatePriceDisplay = () => {
            minPriceDisplay.textContent = this.formatPrice(parseInt(priceMin.value)) + ' VNĐ';
            maxPriceDisplay.textContent = this.formatPrice(parseInt(priceMax.value)) + ' VNĐ';
        };
        
        priceMin.addEventListener('input', updatePriceDisplay);
        priceMax.addEventListener('input', updatePriceDisplay);
        updatePriceDisplay();
        
        // Apply filters
        applyBtn.addEventListener('click', () => {
            this.filterProducts();
        });
        
        // Reset filters
        resetBtn.addEventListener('click', () => {
            document.querySelectorAll('.filter-option input').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Check first category by default
            const firstCategory = document.querySelector('input[name="category"]');
            if (firstCategory) firstCategory.checked = true;
            
            priceMin.value = 0;
            priceMax.value = 500000000;
            updatePriceDisplay();
            
            this.filterProducts();
        });
    },

    setupSorting() {
        const sortSelect = document.getElementById('sortBy');
        if (!sortSelect) return;
        
        sortSelect.addEventListener('change', (e) => {
            this.sortProducts(e.target.value);
        });
    },

    setupViewToggle() {
        const viewBtns = document.querySelectorAll('.view-btn');
        const productsGrid = document.getElementById('productsGrid');
        const productsList = document.getElementById('productsList');
        
        if (!viewBtns.length) return;
        
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

    setupSearch() {
        const searchInput = document.getElementById('productSearch');
        const searchBtn = document.querySelector('.search-btn');
        
        if (!searchInput) return;
        
        const performSearch = () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            if (searchTerm.length < 2) return;
            
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
            
            Core.showNotification(`Tìm thấy ${foundCount} sản phẩm`, 'success');
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
        
        const selectedMaterials = Array.from(document.querySelectorAll('input[name="material"]:checked'))
            .map(cb => cb.value);
        
        const selectedOrigins = Array.from(document.querySelectorAll('input[name="origin"]:checked'))
            .map(cb => cb.value);
        
        const minPrice = parseInt(document.getElementById('priceMin').value);
        const maxPrice = parseInt(document.getElementById('priceMax').value);
        
        const products = document.querySelectorAll('.product-card, .product-list-item');
        let visibleCount = 0;
        
        products.forEach(product => {
            const category = product.dataset.category;
            const material = product.dataset.material;
            const origin = product.dataset.origin;
            const price = parseFloat(product.dataset.price);
            
            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(category);
            const materialMatch = selectedMaterials.length === 0 || selectedMaterials.includes(material);
            const originMatch = selectedOrigins.length === 0 || selectedOrigins.includes(origin);
            const priceMatch = price >= minPrice && price <= maxPrice;
            
            if (categoryMatch && materialMatch && originMatch && priceMatch) {
                product.style.display = 'block';
                visibleCount++;
            } else {
                product.style.display = 'none';
            }
        });
        
        this.updateProductsCount(visibleCount);
        Core.showNotification(`Hiển thị ${visibleCount} sản phẩm`, 'info');
    },

    sortProducts(sortBy) {
        const isGridView = document.querySelector('.view-btn[data-view="grid"]').classList.contains('active');
        const container = isGridView ? document.getElementById('productsGrid') : document.getElementById('productsList');
        const products = Array.from(container.children);
        
        products.sort((a, b) => {
            const aPrice = parseFloat(a.dataset.price);
            const bPrice = parseFloat(b.dataset.price);
            const aName = a.querySelector('.product-name, h3').textContent;
            const bName = b.querySelector('.product-name, h3').textContent;
            
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
                    return parseInt(a.dataset.id) - parseInt(b.dataset.id);
            }
        });
        
        // Reorder products
        products.forEach(product => container.appendChild(product));
    },

    showProductModal(productId) {
        HomePage.showProductModal(productId);
    },

    addToCart(productId) {
        HomePage.addToCart(productId);
    },

    extractPrice(priceString) {
        const num = priceString.replace(/[^0-9]/g, '');
        return parseInt(num) || 0;
    },

    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN').format(price);
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
// TRANG GIỎ HÀNG MODULE
// ============================ //
const CartPage = {
    init() {
        if (!document.querySelector('.cart-container')) return;
        
        this.loadCartItems();
        this.setupCartEvents();
        this.setupCheckout();
        this.updateCartSummary();
    },

    loadCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        const cartWithItems = document.getElementById('cartWithItems');
        
        if (!cartItemsContainer) return;
        
        if (shoppingCart.length === 0) {
            emptyCart.style.display = 'block';
            cartWithItems.style.display = 'none';
            return;
        }
        
        emptyCart.style.display = 'none';
        cartWithItems.style.display = 'block';
        
        let cartHTML = '';
        shoppingCart.forEach((item, index) => {
            cartHTML += `
                <div class="cart-item" data-index="${index}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h3 class="cart-item-title">${item.name}</h3>
                        <p class="cart-item-desc">${item.description}</p>
                        <div class="cart-item-meta">
                            <span><i class="fas fa-gem"></i> ${item.category}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${item.origin}</span>
                            <span><i class="fas fa-award"></i> ${item.certification}</span>
                        </div>
                        <div class="cart-item-actions">
                            <div class="quantity-control">
                                <button class="quantity-btn minus" onclick="CartPage.updateQuantity(${index}, -1)">-</button>
                                <input type="text" class="quantity-input" value="1" readonly>
                                <button class="quantity-btn plus" onclick="CartPage.updateQuantity(${index}, 1)">+</button>
                            </div>
                            <div class="cart-item-price">${item.price}</div>
                        </div>
                    </div>
                    <button class="remove-item" onclick="CartPage.removeItem(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = cartHTML;
        this.updateCartItemCount();
    },

    setupCartEvents() {
        // Clear cart
        const clearCartBtn = document.getElementById('clearCart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
                    shoppingCart.length = 0;
                    Header.updateCartCount();
                    this.loadCartItems();
                    this.updateCartSummary();
                    Core.showNotification('Đã xóa tất cả sản phẩm', 'success');
                }
            });
        }
        
        // Update cart
        const updateCartBtn = document.getElementById('updateCart');
        if (updateCartBtn) {
            updateCartBtn.addEventListener('click', () => {
                Core.showNotification('Giỏ hàng đã được cập nhật', 'success');
            });
        }
        
        // Coupon
        const applyCouponBtn = document.getElementById('applyCoupon');
        const couponCodeInput = document.getElementById('couponCode');
        const couponTags = document.querySelectorAll('.coupon-tag');
        
        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', () => {
                const code = couponCodeInput.value.trim();
                if (!code) {
                    Core.showNotification('Vui lòng nhập mã giảm giá', 'error');
                    return;
                }
                
                this.applyCoupon(code);
            });
        }
        
        couponTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const code = tag.dataset.code;
                couponCodeInput.value = code;
                this.applyCoupon(code);
            });
        });
        
        // Shipping options
        const shippingOptions = document.querySelectorAll('input[name="shipping"]');
        shippingOptions.forEach(option => {
            option.addEventListener('change', () => {
                this.updateCartSummary();
            });
        });
    },

    setupCheckout() {
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (!checkoutBtn) return;
        
        checkoutBtn.addEventListener('click', () => {
            if (shoppingCart.length === 0) {
                Core.showNotification('Giỏ hàng trống. Vui lòng thêm sản phẩm!', 'error');
                return;
            }
            
            const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
            
            // Show checkout modal
            this.showCheckoutModal(selectedPayment);
        });
    },

    showCheckoutModal(paymentMethod) {
        const modal = document.createElement('div');
        modal.className = 'product-modal active';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close"><i class="fas fa-times"></i></button>
                <div style="padding: 40px; text-align: center;">
                    <i class="fas fa-check-circle" style="font-size: 80px; color: var(--gold); margin-bottom: 20px;"></i>
                    <h2 style="color: var(--jade-dark); margin-bottom: 20px;">ĐẶT HÀNG THÀNH CÔNG!</h2>
                    
                    <div style="background: var(--jade-very-light); padding: 25px; border-radius: 15px; margin: 25px 0; text-align: left;">
                        <h3 style="margin-bottom: 15px; color: var(--jade-medium);">
                            <i class="fas fa-receipt"></i> Thông tin đơn hàng
                        </h3>
                        <p><strong>Mã đơn hàng:</strong> DH${Date.now().toString().slice(-8)}</p>
                        <p><strong>Số lượng sản phẩm:</strong> ${shoppingCart.length}</p>
                        <p><strong>Phương thức thanh toán:</strong> ${this.getPaymentMethodName(paymentMethod)}</p>
                        <p><strong>Tổng tiền:</strong> <span id="modalTotal"></span></p>
                        <p><strong>Trạng thái:</strong> <span style="color: var(--gold);">Đang xử lý</span></p>
                    </div>
                    
                    <p style="color: var(--gray-text); margin: 20px 0;">
                        Cảm ơn bạn đã mua hàng! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
                    </p>
                    
                    <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
                        <button class="btn-primary" onclick="CartPage.completeCheckout()">
                            <i class="fas fa-home"></i> VỀ TRANG CHỦ
                        </button>
                        <button class="btn-secondary" onclick="CartPage.printOrder()">
                            <i class="fas fa-print"></i> IN HÓA ĐƠN
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Update total in modal
        const modalTotal = modal.querySelector('#modalTotal');
        if (modalTotal) {
            modalTotal.textContent = this.calculateTotal();
        }
        
        // Setup close events
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        overlay.addEventListener('click', () => modal.classList.remove('active'));
    },

    completeCheckout() {
        // Clear cart after successful checkout
        shoppingCart.length = 0;
        Header.updateCartCount();
        
        // Close modal
        const modal = document.querySelector('.product-modal.active');
        if (modal) modal.classList.remove('active');
        
        // Redirect to home page
        window.location.href = 'index.html';
    },

    printOrder() {
        window.print();
    },

    updateQuantity(index, change) {
        // In a real app, you would update quantity in shoppingCart array
        Core.showNotification('Đã cập nhật số lượng', 'success');
        this.updateCartSummary();
    },

    removeItem(index) {
        if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            shoppingCart.splice(index, 1);
            Header.updateCartCount();
            this.loadCartItems();
            this.updateCartSummary();
            Core.showNotification('Đã xóa sản phẩm khỏi giỏ hàng', 'success');
        }
    },

    applyCoupon(code) {
        let discount = 0;
        let message = '';
        
        switch(code.toUpperCase()) {
            case 'WELCOME10':
                discount = 0.1;
                message = 'Áp dụng thành công mã WELCOME10 - Giảm 10%';
                break;
            case 'FREESHIP':
                document.querySelector('input[name="shipping"][value="free"]').checked = true;
                message = 'Áp dụng thành công mã FREESHIP - Miễn phí vận chuyển';
                break;
            case 'VIP20':
                discount = 0.2;
                message = 'Áp dụng thành công mã VIP20 - Giảm 20%';
                break;
            default:
                Core.showNotification('Mã giảm giá không hợp lệ', 'error');
                return;
        }
        
        // Save discount to localStorage for persistence
        localStorage.setItem('appliedCoupon', JSON.stringify({ code, discount }));
        this.updateCartSummary();
        Core.showNotification(message, 'success');
    },

    updateCartSummary() {
        // Calculate subtotal
        let subtotal = 0;
        shoppingCart.forEach(item => {
            const price = this.extractPrice(item.price);
            subtotal += price;
        });
        
        // Calculate shipping
        const selectedShipping = document.querySelector('input[name="shipping"]:checked');
        let shippingFee = 0;
        
        if (selectedShipping) {
            switch(selectedShipping.value) {
                case 'standard':
                    shippingFee = 30000;
                    break;
                case 'express':
                    shippingFee = 60000;
                    break;
                case 'free':
                    shippingFee = 0;
                    break;
            }
        }
        
        // Calculate discount
        let discountAmount = 0;
        const couponData = localStorage.getItem('appliedCoupon');
        if (couponData) {
            const { discount } = JSON.parse(couponData);
            discountAmount = subtotal * discount;
        }
        
        // Calculate total
        const total = subtotal + shippingFee - discountAmount;
        
        // Update DOM
        const subtotalEl = document.getElementById('subtotal');
        const shippingFeeEl = document.getElementById('shippingFee');
        const discountEl = document.getElementById('discount');
        const totalEl = document.getElementById('totalAmount');
        
        if (subtotalEl) subtotalEl.textContent = this.formatPrice(subtotal) + ' VNĐ';
        if (shippingFeeEl) shippingFeeEl.textContent = this.formatPrice(shippingFee) + ' VNĐ';
        if (discountEl) discountEl.textContent = '-' + this.formatPrice(discountAmount) + ' VNĐ';
        if (totalEl) totalEl.textContent = this.formatPrice(total) + ' VNĐ';
        
        // Update cart item count
        this.updateCartItemCount();
    },

    updateCartItemCount() {
        const countElement = document.getElementById('cartItemCount');
        if (countElement) {
            countElement.textContent = shoppingCart.length;
        }
        
        // Also update cart count in header
        Header.updateCartCount();
    },

    getPaymentMethodName(method) {
        const methods = {
            'cod': 'Thanh toán khi nhận hàng',
            'banking': 'Chuyển khoản ngân hàng',
            'momo': 'Ví điện tử MoMo',
            'credit': 'Thẻ tín dụng/ghi nợ'
        };
        return methods[method] || 'Chưa chọn';
    },

    calculateTotal() {
        // Simplified calculation for modal
        let total = 0;
        shoppingCart.forEach(item => {
            total += this.extractPrice(item.price);
        });
        return this.formatPrice(total) + ' VNĐ';
    },

    extractPrice(priceString) {
        return ProductsPage.extractPrice(priceString);
    },

    formatPrice(price) {
        return ProductsPage.formatPrice(price);
    }
};

// ============================ //
// UPDATE INITIALIZATION
// ============================ //
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Khởi tạo module cho trang cụ thể
    const isProductsPage = document.querySelector('.products-container');
    const isCartPage = document.querySelector('.cart-container');
    
    if (isProductsPage) {
        ProductsPage.init();
        console.log('Đã khởi tạo trang sản phẩm');
    }
    
    if (isCartPage) {
        CartPage.init();
        console.log('Đã khởi tạo trang giỏ hàng');
    }
});

// ============================ //
// GLOBAL EXPORTS BỔ SUNG
// ============================ //
window.ProductsPage = ProductsPage;
window.CartPage = CartPage;