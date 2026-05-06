// State Management
const DEFAULT_IMAGE = './assets/interior.png';
const BASE_PATH = window.location.pathname.includes('/Paint-Shop/') ? '/Paint-Shop/' : '/';

let products = JSON.parse(localStorage.getItem('products')) || [
    { id: 1, name: 'Asian Paints Royale Luxury', category: 'Interior', price: 45.00, stock: 120, image: 'assets/interior.png', description: 'Experience luxury with Asian Paints Royale. A perfect silk finish for your walls.' },
    { id: 2, name: 'Dulux Weathershield Pro', category: 'Exterior', price: 65.00, stock: 85, image: 'assets/exterior.png', description: 'Advanced protection from Dulux for your homes exterior walls.' },
    { id: 3, name: 'Berger Silk Glamor', category: 'Interior', price: 50.00, stock: 60, image: 'assets/interior.png', description: 'Ultra-luxurious interior finish from Berger Paints.' },
    { id: 4, name: 'Nippon Paint Weatherbond', category: 'Exterior', price: 55.00, stock: 40, image: 'assets/exterior.png', description: 'High-performance exterior paint for extreme weather.' },
    { id: 5, name: 'Professional Paint Set', category: 'Supplies', price: 25.00, stock: 100, image: 'assets/supplies.png', description: 'Premium quality brushes and rollers for a perfect finish.' }
];


let cart = JSON.parse(localStorage.getItem('cart')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [
    { id: 'ORD001', customer: 'John Doe', items: 2, total: 110.00, status: 'Delivered', date: '2023-10-20' },
    { id: 'ORD002', customer: 'Jane Smith', items: 1, total: 45.00, status: 'Processing', date: '2023-10-21' }
];

let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
    name: '', email: '', phone: '', address: '', city: '', avatar: null, language: 'en'
};

// Helper to get correct asset path
const getAssetPath = (path) => {
    if (!path) return DEFAULT_IMAGE;
    if (path.startsWith('data:')) return path;
    // Remove leading slashes and base paths to normalize
    let cleanPath = path.replace(/^\/?(Paint-Shop\/)?/, '');
    return BASE_PATH + cleanPath;
};

// Fix paths in loaded state
products = products.map(p => ({ ...p, image: getAssetPath(p.image) }));
cart     = cart.map(p =>     ({ ...p, image: getAssetPath(p.image) }));


// Language dictionary
const LANG = {
    en: {
        home: 'Home', products: 'Paint Products', supplies: 'Supplies', about: 'About Us',
        shopNow: 'Shop Now', learnMore: 'Learn More', addCart: 'Add to Cart', buyNow: 'Buy Now',
        featured: 'Featured Products', categories: 'Our Categories', heroTitle: 'Multi-Brand',
        heroSpan: 'Painting Solutions', heroSub: 'Authorized dealers for Asian Paints, Dulux, Berger, and more.',
        checkout: 'Checkout Now', myOrders: 'My Orders', myProfile: 'My Profile', settings: 'Settings',
        language: 'Language', save: 'Save Changes', logout: 'Logout', login: 'Login', dashboard: 'Dashboard'
    },
    hi: {
        home: 'होम', products: 'पेंट उत्पाद', supplies: 'आपूर्ति', about: 'हमारे बारे में',
        shopNow: 'अभी खरीदें', learnMore: 'अधिक जानें', addCart: 'कार्ट में डालें', buyNow: 'अभी खरीदें',
        featured: 'विशेष उत्पाद', categories: 'हमारी श्रेणियाँ', heroTitle: 'मल्टी-ब्रांड',
        heroSpan: 'पेंटिंग समाधान', heroSub: 'एशियन पेंट्स, डुलक्स, बर्जर और अधिक के अधिकृत डीलर।',
        checkout: 'चेकआउट करें', myOrders: 'मेरे ऑर्डर', myProfile: 'मेरी प्रोफ़ाइल', settings: 'सेटिंग्स',
        language: 'भाषा', save: 'परिवर्तन सहेजें', logout: 'लॉग आउट', login: 'लॉगिन', dashboard: 'डैशबोर्ड'
    },
    es: {
        home: 'Inicio', products: 'Pinturas', supplies: 'Suministros', about: 'Sobre Nosotros',
        shopNow: 'Comprar Ahora', learnMore: 'Saber Más', addCart: 'Añadir al Carrito', buyNow: 'Comprar Ya',
        featured: 'Productos Destacados', categories: 'Nuestras Categorías', heroTitle: 'Multi-Marca',
        heroSpan: 'Soluciones de Pintura', heroSub: 'Distribuidores autorizados de Asian Paints, Dulux, Berger y más.',
        checkout: 'Pagar Ahora', myOrders: 'Mis Pedidos', myProfile: 'Mi Perfil', settings: 'Configuración',
        language: 'Idioma', save: 'Guardar Cambios', logout: 'Cerrar Sesión', login: 'Iniciar Sesión', dashboard: 'Panel'
    },
    fr: {
        home: 'Accueil', products: 'Peintures', supplies: 'Fournitures', about: 'À Propos',
        shopNow: 'Acheter Maintenant', learnMore: 'En Savoir Plus', addCart: 'Ajouter au Panier', buyNow: 'Acheter',
        featured: 'Produits Vedettes', categories: 'Nos Catégories', heroTitle: 'Multi-Marque',
        heroSpan: 'Solutions de Peinture', heroSub: 'Distributeurs agréés d\'Asian Paints, Dulux, Berger et plus.',
        checkout: 'Passer la Commande', myOrders: 'Mes Commandes', myProfile: 'Mon Profil', settings: 'Paramètres',
        language: 'Langue', save: 'Enregistrer', logout: 'Se Déconnecter', login: 'Connexion', dashboard: 'Tableau de Bord'
    }
};
const t = (key) => (LANG[userProfile.language] || LANG.en)[key] || key;

// Save state
const saveState = () => {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
};

// Auth Helper
const isAdmin = () => currentUser && currentUser.role === 'admin';

// In-page section hashes — these live inside the store view
const SECTION_HASHES = new Set(['#products', '#about', '#supplies', '#categories', '#stats']);

// Router
const router = () => {
    const hash = window.location.hash || '#home';
    const mainContent = document.getElementById('main-content');

    updateNavbar();

    // If it's an in-page section anchor and the store is already rendered, just scroll
    if (SECTION_HASHES.has(hash) && mainContent.querySelector('.hero')) {
        const target = document.querySelector(hash);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
    }

    if (hash === '#admin') {
        if (!isAdmin()) {
            window.location.hash = '#login';
            return;
        }
        renderAdmin(mainContent);
        window.scrollTo(0, 0);
    } else if (hash === '#login') {
        renderLogin(mainContent);
        window.scrollTo(0, 0);
    } else {
        renderStore(mainContent);
        // For section hashes on fresh load, scroll after render
        if (SECTION_HASHES.has(hash)) {
            setTimeout(() => {
                const target = document.querySelector(hash);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        } else {
            window.scrollTo(0, 0);
        }
    }
};

const getAvatarHTML = (size = 'nav') => {
    if (userProfile.avatar) return `<img src="${userProfile.avatar}" alt="Avatar" class="nav-avatar-img">`;
    const letter = userProfile.name ? userProfile.name.trim()[0].toUpperCase() : '?';
    return `<span class="nav-avatar-initials">${letter}</span>`;
};

const updateNavbar = () => {
    const authStatus = document.getElementById('auth-status');
    // Update nav link text with language
    const navLinks = document.querySelectorAll('.nav-links a');
    if (navLinks.length >= 4) {
        navLinks[0].textContent = t('home');
        navLinks[1].textContent = t('products');
        navLinks[2].textContent = t('supplies');
        navLinks[3].textContent = t('about');
    }
    if (isAdmin()) {
        authStatus.innerHTML = `
            <a href="#admin" class="auth-btn auth-btn-login" style="margin-right:10px">${t('dashboard')}</a>
            <div class="nav-avatar" onclick="openProfile()" title="Profile">${getAvatarHTML()}</div>
        `;
    } else {
        authStatus.innerHTML = `
            <div class="nav-avatar" onclick="openProfile()" title="My Profile">${getAvatarHTML()}</div>
            <a href="#login" class="auth-btn auth-btn-login" style="margin-left:12px">${t('login')}</a>
        `;
    }
};

// --- Storefront Rendering ---
const renderStore = (container) => {
    container.innerHTML = `
        <section id="home" class="hero">
            <div class="hero-content">
                <div class="reveal">
                    <h1>Multi-Brand <span>Painting Solutions</span></h1>
                    <p>Authorized dealers for Nerolac Paints, Asian Paints, Dulux, Berger, and more. Saw & Sons Enterprises brings you the world's best paint brands under one roof.</p>
                    <div class="hero-btns">
                        <a href="#products" class="btn btn-primary">Shop Now</a>
                        <a href="#about" class="btn" style="margin-left: 15px;">Learn More</a>
                    </div>
                </div>
            </div>
        </section>

        <section id="categories" class="categories">
            <div class="section-title reveal">
                <h2>Our Categories</h2>
                <div class="underline"></div>
            </div>
            <div class="category-grid">
                ${['Interior Paints', 'Exterior Paints', 'Supplies', 'Specialty'].map((cat, i) => `
                    <div class="category-card reveal" style="transition-delay: ${i * 0.1}s">
                        <img src="${getAssetPath('assets/' + (cat.toLowerCase().includes('interior') ? 'interior.png' : cat.toLowerCase().includes('supplies') ? 'supplies.png' : 'exterior.png'))}" alt="${cat}">

                        <div class="category-overlay">
                            <h3>${cat}</h3>
                            <p>Explore high-quality ${cat.toLowerCase()}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>

        <section id="products" class="categories" style="background: #f8fafc;">
            <div class="section-title reveal">
                <h2>Featured Products</h2>
                <div class="underline"></div>
            </div>
            <div class="category-grid">
                ${products.map(product => `
                    <div class="product-card reveal" onclick="showProductDetail(${product.id})">
                        <div class="product-card-img-wrap">
                            <img src="${product.image || DEFAULT_IMAGE}" alt="${product.name}" onerror="this.src='${DEFAULT_IMAGE}'">
                            <span class="product-card-badge">${product.category}</span>
                        </div>
                        <div class="product-card-body">
                            <h3 class="product-card-title">${product.name}</h3>
                            <p class="product-card-desc">${product.description}</p>
                            <div class="product-card-footer">
                                <span class="product-card-price">₹${product.price}</span>
                                <span class="product-card-stock ${product.stock > 20 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-stock'}">
                                    ${product.stock > 20 ? '✓ In Stock' : product.stock > 0 ? '⚠ Low Stock' : '✗ Out of Stock'}
                                </span>
                            </div>
                            <div class="product-card-actions" onclick="event.stopPropagation()">
                                <button onclick="addToCart(${product.id}, this)" class="btn btn-outline-cart"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
                                <button onclick="buyNow(${product.id}, this)" class="btn btn-primary btn-buy"><i class="fas fa-bolt"></i> Buy Now</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>


        <!-- Product Detail Modal -->
        <div id="product-detail-modal" class="modal" onclick="closeProductDetail()">
            <div class="product-detail-content" onclick="event.stopPropagation()">
                <button class="product-detail-close" onclick="closeProductDetail()"><i class="fas fa-times"></i></button>
                <div id="product-detail-body"></div>
            </div>
        </div>

        <section id="about" class="categories">
            <div class="category-grid" style="align-items: center;">
                <div class="reveal">
                    <h2 style="font-size: 2.5rem; color: var(--primary); margin-bottom: 20px;">Why Choose Saw & Sons?</h2>
                    <p style="color: #475569; margin-bottom: 20px;">We are more than just a paint shop. We are your partners in transformation. With over 30 years of experience, we provide authorized solutions from the world's leading brands.</p>
                    <ul style="list-style: none; color: #475569;">
                        <li style="margin-bottom: 10px;"><i class="fas fa-check-circle" style="color: var(--accent-orange); margin-right: 10px;"></i> Authorized Multi-Brand Dealer</li>
                        <li style="margin-bottom: 10px;"><i class="fas fa-check-circle" style="color: var(--accent-orange); margin-right: 10px;"></i> Expert Color Consultation</li>
                        <li style="margin-bottom: 10px;"><i class="fas fa-check-circle" style="color: var(--accent-orange); margin-right: 10px;"></i> Next-Day Delivery Services</li>
                    </ul>
                </div>
                <div class="reveal" style="position: relative; height: 400px; border-radius: 20px; overflow: hidden; transition-delay: 0.2s">
                    <img src="${getAssetPath('assets/hero.png')}" alt="About Us" style="width: 100%; height: 100%; object-fit: cover;">
                </div>

            </div>
        </section>

        <section id="stats" class="categories" style="background: var(--bg-alt); border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
            <div class="category-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); text-align: center;">
                <div class="reveal">
                    <h2 style="font-size: 3rem; color: var(--primary);">30K+</h2>
                    <p style="color: #64748b;">Happy Customers</p>
                </div>
                <div class="reveal" style="transition-delay: 0.1s">
                    <h2 style="font-size: 3rem; color: var(--accent-orange);">512K</h2>
                    <p style="color: #64748b;">Projects Completed</p>
                </div>
                <div class="reveal" style="transition-delay: 0.2s">
                    <h2 style="font-size: 3rem; color: var(--accent-magenta);">150+</h2>
                    <p style="color: #64748b;">Unique Shades</p>
                </div>
                <div class="reveal" style="transition-delay: 0.3s">
                    <h2 style="font-size: 3rem; color: var(--accent-yellow);">24/7</h2>
                    <p style="color: #64748b;">Expert Support</p>
                </div>
            </div>
        </section>
    `;
    initReveal();
};

// --- Login Rendering ---
const renderLogin = (container) => {
    container.innerHTML = `
        <div class="login-container reveal">
            <h2>Admin Login</h2>
            <p style="margin-bottom: 25px; color: #64748b;">Please enter your credentials to access the admin panel.</p>
            <form id="login-form">
                <div class="form-group" style="text-align: left;">
                    <label>Email Address</label>
                    <input type="email" id="l-email" required placeholder="admin@sawandsons.com">
                </div>
                <div class="form-group" style="text-align: left;">
                    <label>Password</label>
                    <input type="password" id="l-pass" required placeholder="••••••••">
                </div>
                <button type="button" id="login-btn" class="btn btn-primary" style="width: 100%; margin-top: 10px;">Sign In</button>
            </form>
            <p style="margin-top: 20px; font-size: 0.8rem; color: #94a3b8;">Default: admin@sawandsons.com / admin123</p>
        </div>
    `;

    document.getElementById('login-btn').addEventListener('click', () => {
        const email = document.getElementById('l-email').value;
        const pass = document.getElementById('l-pass').value;

        if (email === 'admin@sawandsons.com' && pass === 'admin123') {
            currentUser = { email, role: 'admin', name: 'Super Admin' };
            saveState();
            window.location.hash = '#admin';
        } else {
            alert('Invalid credentials!');
        }
    });

    initReveal();
};

window.logout = () => {
    currentUser = null;
    saveState();
    window.location.hash = '#home';
};

// --- Admin Panel Rendering ---
const renderAdmin = (container) => {
    container.innerHTML = `
        <div id="admin-panel">
            <div class="admin-header reveal">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Manage your stock and orders effectively.</p>
                </div>
                <a href="#home" class="btn btn-primary">Back to Store</a>
            </div>

            <div class="category-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); margin-bottom: 40px;">
                <div class="admin-card reveal">
                    <h3>Total Inventory</h3>
                    <p style="font-size: 2rem; font-weight: 700; color: var(--primary);">${products.reduce((acc, p) => acc + p.stock, 0)} Units</p>
                </div>
                <div class="admin-card reveal" style="transition-delay: 0.1s">
                    <h3>Active Orders</h3>
                    <p style="font-size: 2rem; font-weight: 700; color: var(--accent-orange);">${orders.length}</p>
                </div>
                <div class="admin-card reveal" style="transition-delay: 0.2s">
                    <h3>Revenue</h3>
                    <p style="font-size: 2rem; font-weight: 700; color: var(--accent-magenta);">₹${orders.reduce((acc, o) => acc + o.total, 0).toFixed(2)}</p>
                </div>
            </div>

            <div class="admin-card reveal">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2>Inventory Management</h2>
                    <button onclick="showAddProductModal()" class="btn btn-primary" style="padding: 0.5rem 1rem;">Add Product</button>
                </div>
                <table class="inventory-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map(p => `
                            <tr>
                                <td>${p.name}</td>
                                <td>${p.category}</td>
                                <td>₹${p.price}</td>
                                <td>
                                    <input type="number" value="${p.stock}" onchange="updateStock(${p.id}, this.value)" style="width: 60px; padding: 5px;">
                                </td>
                                <td>
                                    <span class="status-badge ${p.stock > 20 ? 'status-instock' : p.stock > 0 ? 'status-low' : 'status-out'}">
                                        ${p.stock > 20 ? 'In Stock' : p.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                                    </span>
                                </td>
                                <td>
                                    <button onclick="removeProduct(${p.id})" style="color: #ef4444; border: none; background: none; cursor: pointer;"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div class="admin-card reveal">
                <h2>Recent Orders</h2>
                <table class="inventory-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders.map(o => `
                            <tr>
                                <td>${o.id}</td>
                                <td>${o.customer}</td>
                                <td>${o.date}</td>
                                <td>₹${o.total.toFixed(2)}</td>
                                <td>${o.status}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    initReveal();
};

// --- Logic ---

// Product Detail Modal

window.showProductDetail = (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const modal = document.getElementById('product-detail-modal');
    const body = document.getElementById('product-detail-body');
    const stockClass = product.stock > 20 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-stock';
    const stockLabel = product.stock > 20 ? '✓ In Stock' : product.stock > 0 ? `⚠ Low Stock (${product.stock} left)` : '✗ Out of Stock';
    body.innerHTML = `
        <div class="detail-img-wrap">
            <img src="${product.image || DEFAULT_IMAGE}" alt="${product.name}" onerror="this.src='${DEFAULT_IMAGE}'">
        </div>
        <div class="detail-info">
            <span class="product-card-badge" style="margin-bottom:12px; display:inline-block;">${product.category}</span>
            <h2 class="detail-title">${product.name}</h2>
            <p class="detail-price">₹${product.price.toFixed(2)}</p>
            <span class="product-card-stock ${stockClass}" style="margin-bottom:16px; display:inline-block;">${stockLabel}</span>
            <p class="detail-desc">${product.description}</p>
            <hr class="detail-divider">
            <div class="detail-meta">
                <div><span class="meta-label">Category</span><span class="meta-value">${product.category}</span></div>
                <div><span class="meta-label">SKU</span><span class="meta-value">SSE-${String(product.id).padStart(4, '0')}</span></div>
                <div><span class="meta-label">Availability</span><span class="meta-value">${product.stock > 0 ? product.stock + ' units' : 'Unavailable'}</span></div>
            </div>
            <div class="detail-actions">
                <button onclick="addToCart(${product.id}, this); closeProductDetail();" class="btn btn-outline-cart" style="flex:1;"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
                <button onclick="buyNow(${product.id}, this); closeProductDetail();" class="btn btn-primary btn-buy" style="flex:1;"><i class="fas fa-bolt"></i> Buy Now</button>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

window.closeProductDetail = () => {
    const modal = document.getElementById('product-detail-modal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
};

window.buyNow = (id, btnEl) => {
    const product = products.find(p => p.id === id);
    if (!product || product.stock === 0) { showToast('This product is out of stock!', 'fa-times-circle', '#ef4444'); return; }
    if (btnEl) createRipple(btnEl, 'rgba(255,255,255,0.4)');
    cart.push(product);
    product.stock--;
    document.getElementById('cart-count').innerText = cart.length;
    bounceBadge();
    saveState();
    showToast(`Going to checkout…`, 'fa-bolt', '#f97316');
    setTimeout(() => openCheckout(), 400);
};

// ---- Ripple helper ----
const createRipple = (btn, color = 'rgba(255,255,255,0.5)') => {
    const circle = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    circle.style.cssText = `
        position:absolute; border-radius:50%; transform:scale(0); animation:rippleAnim 0.55s linear;
        width:${Math.max(rect.width, rect.height) * 2}px; height:${Math.max(rect.width, rect.height) * 2}px;
        left:${-Math.max(rect.width, rect.height)}px; top:${-Math.max(rect.width, rect.height)}px;
        background:${color}; pointer-events:none;
    `;
    btn.style.position = 'relative'; btn.style.overflow = 'hidden';
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
};

// ---- Toast notification ----
const showToast = (msg, icon = 'fa-check-circle', color = '#22c55e') => {
    let wrap = document.getElementById('toast-wrap');
    if (!wrap) {
        wrap = document.createElement('div');
        wrap.id = 'toast-wrap';
        wrap.style.cssText = 'position:fixed;bottom:28px;right:28px;z-index:9999;display:flex;flex-direction:column;gap:10px;';
        document.body.appendChild(wrap);
    }
    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML = `<i class="fas ${icon}" style="color:${color}"></i> ${msg}`;
    wrap.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2800);
};

// ---- Cart badge bounce ----
const bounceBadge = () => {
    const badge = document.getElementById('cart-count');
    badge.classList.remove('bounce'); void badge.offsetWidth;
    badge.classList.add('bounce');
    setTimeout(() => badge.classList.remove('bounce'), 600);
};

window.addToCart = (id, btnEl) => {
    const product = products.find(p => p.id === id);
    if (product && product.stock > 0) {
        if (btnEl) createRipple(btnEl);
        cart.push(product);
        product.stock--;
        document.getElementById('cart-count').innerText = cart.length;
        bounceBadge();
        saveState();
        showToast(`<strong>${product.name}</strong> added to cart!`, 'fa-shopping-cart', '#0369a1');
        if (window.location.hash === '#admin') renderAdmin(document.getElementById('main-content'));
    } else {
        showToast('This product is out of stock!', 'fa-times-circle', '#ef4444');
    }
};

window.updateStock = (id, newStock) => {
    const product = products.find(p => p.id === id);
    product.stock = parseInt(newStock);
    saveState();
    renderAdmin(document.getElementById('main-content'));
};

window.removeProduct = (id) => {
    if (confirm('Are you sure you want to remove this product?')) {
        products = products.filter(p => p.id !== id);
        saveState();
        renderAdmin(document.getElementById('main-content'));
    }
};

window.showAddProductModal = () => {
    const modal = document.getElementById('product-modal');
    modal.style.display = 'block';

    // Preview logic
    const fileInput = document.getElementById('p-image-file');
    const preview = document.getElementById('image-preview');
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    };

    // Close logic
    const closeBtn = document.querySelector('.close-modal');
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = 'none';
    };
};

// Form Submission
document.getElementById('product-form').onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('p-name').value;
    const category = document.getElementById('p-category').value;
    const price = parseFloat(document.getElementById('p-price').value);
    const stock = parseInt(document.getElementById('p-stock').value);
    const desc = document.getElementById('p-desc').value;
    const previewImg = document.querySelector('#image-preview img');
    const image = previewImg ? previewImg.src : getAssetPath('assets/interior.png');

    if (name && !isNaN(price) && !isNaN(stock)) {
        products.push({
            id: Date.now(),
            name,
            price,
            stock,
            category,
            image,
            description: desc
        });
        saveState();
        document.getElementById('product-modal').style.display = 'none';
        document.getElementById('product-form').reset();
        document.getElementById('image-preview').innerHTML = 'No image selected';
        renderAdmin(document.getElementById('main-content'));
    }
};

// Intersection Observer for Reveal
const initReveal = () => {
    const revealAll = () => {
        document.querySelectorAll('.reveal:not(.active)').forEach(el => el.classList.add('active'));
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Fallback: activate all reveals after 600ms in case observer misses them
    setTimeout(revealAll, 600);
};

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// --- UI Components ---
const renderFooter = () => {
    return `
        <footer id="footer">
            <div class="footer-grid">
                <div class="footer-col">
                    <div class="logo" style="margin-bottom: 20px; color: white;">
                        <img src="${getAssetPath('assets/logo.png')}" alt="Saw & Sons">
                        <span>SAW & SONS</span>
                    </div>

                    <p style="color: #94a3b8;">Authorized retail partners for leading paint brands. Providing quality solutions since 1990.</p>
                </div>
                <div class="footer-col">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#products">Products</a></li>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#admin">Admin Panel</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Products</h4>
                    <ul>
                        <li><a href="#">Interior Paints</a></li>
                        <li><a href="#">Exterior Paints</a></li>
                        <li><a href="#">Wood & Metal</a></li>
                        <li><a href="#">Supplies</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Contact Us</h4>
                    <ul style="color: #94a3b8;">
                        <li><i class="fas fa-map-marker-alt"></i> 123 Paint Street, Design City</li>
                        <li><i class="fas fa-phone"></i> +1 234 567 890</li>
                        <li><i class="fas fa-envelope"></i> info@sawandsons.com</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 Saw & Sons Enterprises. All rights reserved.</p>
            </div>
        </footer>
    `;
};

const renderCartDrawer = () => {
    const drawer = document.getElementById('cart-drawer');
    const total = cart.reduce((acc, item) => acc + item.price, 0);

    drawer.innerHTML = `
        <div class="drawer-header">
            <h2>Shopping Cart</h2>
            <i class="fas fa-times" id="close-cart" style="cursor: pointer; font-size: 1.5rem;"></i>
        </div>
        <div style="flex-grow: 1; overflow-y: auto;">
            ${cart.length === 0 ? '<p style="text-align: center; margin-top: 50px; color: #64748b;">Your cart is empty</p>' :
            cart.map((item, index) => `
                    <div class="cart-item">
                        <img src="${item.image || DEFAULT_IMAGE}" alt="${item.name}" onerror="this.src='${DEFAULT_IMAGE}'">
                        <div style="flex-grow: 1;">
                            <h4 style="margin-bottom: 5px;">${item.name}</h4>
                            <p style="color: var(--accent-orange); font-weight: 600;">₹${item.price.toFixed(2)}</p>
                        </div>
                        <button onclick="removeFromCart(${index})" style="background: none; border: none; color: #94a3b8; cursor: pointer;"><i class="fas fa-times"></i></button>
                    </div>
                `).join('')
        }
        </div>
        <div class="cart-footer">
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                <span style="font-weight: 600; font-size: 1.2rem;">Total</span>
                <span style="font-weight: 700; font-size: 1.2rem; color: var(--primary);">₹${total.toFixed(2)}</span>
            </div>
            <button onclick="checkout()" class="btn btn-primary" style="width: 100%;" ${cart.length === 0 ? 'disabled' : ''}>Checkout Now</button>
        </div>
    `;

    document.getElementById('close-cart').addEventListener('click', toggleCart);
};

// --- Logic ---
window.toggleCart = () => {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('overlay');
    drawer.classList.toggle('open');
    overlay.classList.toggle('active');
    if (drawer.classList.contains('open')) renderCartDrawer();
};

window.removeFromCart = (index) => {
    const item = cart.splice(index, 1)[0];
    const product = products.find(p => p.id === item.id);
    if (product) product.stock++;
    document.getElementById('cart-count').innerText = cart.length;
    saveState();
    renderCartDrawer();
    if (window.location.hash === '#admin') renderAdmin(document.getElementById('main-content'));
};

// ========== PROFILE MODAL ==========
window.openProfile = () => {
    injectProfileModal();
    document.getElementById('profile-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    switchProfileTab('orders');
};

window.closeProfile = () => {
    document.getElementById('profile-modal').style.display = 'none';
    document.body.style.overflow = '';
};

window.switchProfileTab = (tab) => {
    document.querySelectorAll('.profile-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    document.querySelectorAll('.profile-tab-panel').forEach(p => p.style.display = p.dataset.panel === tab ? 'block' : 'none');
    if (tab === 'orders') renderOrdersTab();
    if (tab === 'profile') renderProfileEditTab();
    if (tab === 'settings') renderSettingsTab();
};

const renderOrdersTab = () => {
    const panel = document.getElementById('tab-orders');
    if (!orders.length) {
        panel.innerHTML = `<div class="empty-orders"><i class="fas fa-box-open"></i><p>No orders yet.</p></div>`;
        return;
    }
    panel.innerHTML = orders.map(o => `
        <div class="order-card" onclick="viewOrderDetail('${o.id}')">
            <div class="order-card-header">
                <span class="order-id">${o.id}</span>
                <span class="order-badge ${o.status === 'Delivered' ? 'badge-delivered' : o.status === 'Processing' ? 'badge-processing' : 'badge-cancelled'}">${o.status}</span>
            </div>
            <div class="order-card-body">
                <span><i class="fas fa-calendar-alt"></i> ${o.date}</span>
                <span><i class="fas fa-box"></i> ${o.items} item(s)</span>
                <span class="order-total"><i class="fas fa-tag"></i> ₹${o.total.toFixed(2)}</span>
            </div>
            <div class="order-card-footer">
                <span>Customer: <strong>${o.customer}</strong></span>
                <span class="view-detail-link">View Details <i class="fas fa-chevron-right"></i></span>
            </div>
        </div>
    `).join('');
};

window.viewOrderDetail = (orderId) => {
    const o = orders.find(x => x.id === orderId);
    if (!o) return;
    const panel = document.getElementById('tab-orders');
    panel.innerHTML = `
        <button onclick="renderOrdersTab()" class="btn btn-outline-cart" style="margin-bottom:18px;font-size:0.85rem;">
            <i class="fas fa-arrow-left"></i> Back to Orders
        </button>
        <div class="order-detail-box">
            <div class="order-detail-header">
                <div>
                    <h3>${o.id}</h3>
                    <p style="color:#64748b;margin-top:4px;">Placed on ${o.date}</p>
                </div>
                <span class="order-badge ${o.status === 'Delivered' ? 'badge-delivered' : o.status === 'Processing' ? 'badge-processing' : 'badge-cancelled'}">${o.status}</span>
            </div>
            <div class="order-detail-grid">
                <div class="order-detail-item"><span class="meta-label">Customer</span><span class="meta-value">${o.customer}</span></div>
                <div class="order-detail-item"><span class="meta-label">Items</span><span class="meta-value">${o.items} item(s)</span></div>
                <div class="order-detail-item"><span class="meta-label">Total Amount</span><span class="meta-value" style="color:var(--primary);font-size:1.2rem;font-weight:800;">₹${o.total.toFixed(2)}</span></div>
                <div class="order-detail-item"><span class="meta-label">Delivery Status</span><span class="meta-value">${o.status}</span></div>
            </div>
            <div class="order-timeline">
                <div class="timeline-step done"><i class="fas fa-check-circle"></i><span>Order Placed</span></div>
                <div class="timeline-line ${o.status !== 'Processing' ? 'done' : ''}"></div>
                <div class="timeline-step ${o.status !== 'Processing' ? 'done' : 'pending'}"><i class="fas fa-truck"></i><span>Shipped</span></div>
                <div class="timeline-line ${o.status === 'Delivered' ? 'done' : ''}"></div>
                <div class="timeline-step ${o.status === 'Delivered' ? 'done' : 'pending'}"><i class="fas fa-home"></i><span>Delivered</span></div>
            </div>
        </div>
    `;
    window.renderOrdersTab = () => { switchProfileTab('orders'); };
};

const renderProfileEditTab = () => {
    const panel = document.getElementById('tab-profile');
    panel.innerHTML = `
        <div class="profile-avatar-section">
            <div class="profile-avatar-big" id="profile-avatar-display">
                ${userProfile.avatar ? `<img src="${userProfile.avatar}" alt="avatar">` : `<span>${userProfile.name ? userProfile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?'}</span>`}
            </div>
            <label class="avatar-upload-btn" for="avatar-file-input"><i class="fas fa-camera"></i> Change Photo</label>
            <input type="file" id="avatar-file-input" accept="image/*" style="display:none" onchange="handleAvatarUpload(event)">
        </div>
        <div class="co-grid">
            <div class="form-group"><label>Full Name</label><input id="prof-name" type="text" value="${userProfile.name}" placeholder="Your Name"></div>
            <div class="form-group"><label>Email</label><input id="prof-email" type="email" value="${userProfile.email}" placeholder="email@example.com"></div>
        </div>
        <div class="co-grid">
            <div class="form-group"><label>Phone</label><input id="prof-phone" type="tel" value="${userProfile.phone}" placeholder="+91 98765 43210"></div>
            <div class="form-group"><label>City</label><input id="prof-city" type="text" value="${userProfile.city}" placeholder="Mumbai"></div>
        </div>
        <div class="form-group"><label>Address</label><input id="prof-address" type="text" value="${userProfile.address}" placeholder="House No., Street, Locality"></div>
        <button onclick="saveProfile()" class="btn btn-primary" style="width:100%;margin-top:8px;">${t('save')} <i class="fas fa-check"></i></button>
    `;
};

window.handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        userProfile.avatar = ev.target.result;
        saveState();
        const disp = document.getElementById('profile-avatar-display');
        if (disp) disp.innerHTML = `<img src="${ev.target.result}" alt="avatar">`;
        updateNavbar();
    };
    reader.readAsDataURL(file);
};

window.saveProfile = () => {
    userProfile.name = document.getElementById('prof-name').value.trim();
    userProfile.email = document.getElementById('prof-email').value.trim();
    userProfile.phone = document.getElementById('prof-phone').value.trim();
    userProfile.city = document.getElementById('prof-city').value.trim();
    userProfile.address = document.getElementById('prof-address').value.trim();
    saveState();
    updateNavbar();
    showToast('Profile saved!', 'fa-user-check', '#22c55e');
    renderProfileEditTab();
};

const renderSettingsTab = () => {
    const panel = document.getElementById('tab-settings');
    const langs = [
        { code: 'en', label: '🇬🇧 English' },
        { code: 'hi', label: '🇮🇳 हिन्दी' },
        { code: 'es', label: '🇪🇸 Español' },
        { code: 'fr', label: '🇫🇷 Français' }
    ];
    panel.innerHTML = `
        <h3 class="settings-section-title"><i class="fas fa-globe"></i> ${t('language')}</h3>
        <div class="lang-grid">
            ${langs.map(l => `
                <div class="lang-option ${userProfile.language === l.code ? 'selected' : ''}" onclick="changeLanguage('${l.code}')">
                    <span class="lang-flag">${l.label.split(' ')[0]}</span>
                    <span class="lang-name">${l.label.split(' ').slice(1).join(' ')}</span>
                    <i class="fas fa-check-circle lang-check"></i>
                </div>
            `).join('')}
        </div>
        <h3 class="settings-section-title" style="margin-top:28px"><i class="fas fa-bell"></i> Notifications</h3>
        <div class="toggle-row"><span>Order updates</span><label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><span>Promotional offers</span><label class="toggle-switch"><input type="checkbox"><span class="toggle-slider"></span></label></div>
    `;
};

window.changeLanguage = (code) => {
    userProfile.language = code;
    saveState();
    renderSettingsTab();
    updateNavbar();
    // Refresh store text if on home
    if (!isAdmin() && window.location.hash !== '#login') {
        const mc = document.getElementById('main-content');
        if (mc) renderStore(mc);
    }
    showToast('Language updated!', 'fa-globe', '#8b5cf6');
};

const injectProfileModal = () => {
    if (document.getElementById('profile-modal')) return;
    document.body.insertAdjacentHTML('beforeend', `
    <div id="profile-modal" style="display:none;position:fixed;inset:0;z-index:5500;background:rgba(15,23,42,0.65);backdrop-filter:blur(8px);align-items:center;justify-content:center;padding:20px;" onclick="event.target===this&&closeProfile()">
      <div class="profile-box" onclick="event.stopPropagation()">
        <button class="product-detail-close" onclick="closeProfile()"><i class="fas fa-times"></i></button>
        <div class="profile-header-banner">
            <div class="profile-header-avatar" id="modal-avatar">${getAvatarHTML()}</div>
            <div>
                <h2 class="profile-display-name">${userProfile.name || 'My Profile'}</h2>
                <p class="profile-display-email">${userProfile.email || 'No email set'}</p>
            </div>
        </div>
        <div class="profile-tabs">
            <button class="profile-tab-btn" data-tab="orders" onclick="switchProfileTab('orders')"><i class="fas fa-box"></i> ${t('myOrders')}</button>
            <button class="profile-tab-btn" data-tab="profile" onclick="switchProfileTab('profile')"><i class="fas fa-user-edit"></i> ${t('myProfile')}</button>
            <button class="profile-tab-btn" data-tab="settings" onclick="switchProfileTab('settings')"><i class="fas fa-cog"></i> ${t('settings')}</button>
        </div>
        <div class="profile-tab-body">
            <div id="tab-orders" class="profile-tab-panel" data-panel="orders"></div>
            <div id="tab-profile" class="profile-tab-panel" data-panel="profile" style="display:none"></div>
            <div id="tab-settings" class="profile-tab-panel" data-panel="settings" style="display:none"></div>
        </div>
        <div class="profile-modal-footer">
            <button onclick="closeProfile(); logout();" class="btn-logout-profile"><i class="fas fa-sign-out-alt"></i> ${t('logout')}</button>
        </div>
      </div>
    </div>`);
};

// ========== CHECKOUT FLOW ==========

window.checkout = () => openCheckout();

window.openCheckout = () => {
    if (cart.length === 0) { showToast('Your cart is empty!', 'fa-cart-shopping', '#ef4444'); return; }
    // Close cart drawer first
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('overlay');
    drawer.classList.remove('open');
    overlay.classList.remove('active');

    document.getElementById('checkout-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    goToCheckoutStep(1);
};

window.closeCheckout = () => {
    document.getElementById('checkout-modal').style.display = 'none';
    document.body.style.overflow = '';
};

window.goToCheckoutStep = (step) => {
    document.querySelectorAll('.checkout-step-panel').forEach((p, i) => {
        p.style.display = i + 1 === step ? 'block' : 'none';
    });
    document.querySelectorAll('.step-dot').forEach((d, i) => {
        d.classList.toggle('active', i + 1 === step);
        d.classList.toggle('done', i + 1 < step);
    });
};

window.proceedToPayment = () => {
    const name = document.getElementById('co-name').value.trim();
    const phone = document.getElementById('co-phone').value.trim();
    const address = document.getElementById('co-address').value.trim();
    const city = document.getElementById('co-city').value.trim();
    const pincode = document.getElementById('co-pincode').value.trim();
    if (!name || !phone || !address || !city || !pincode) {
        showToast('Please fill all delivery details.', 'fa-exclamation-circle', '#f59e0b'); return;
    }
    goToCheckoutStep(2);
};

window.selectPayment = (method) => {
    document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
    document.getElementById('pay-' + method).classList.add('selected');
    document.querySelectorAll('.payment-fields').forEach(el => el.style.display = 'none');
    const fields = document.getElementById('fields-' + method);
    if (fields) fields.style.display = 'block';
};

window.proceedToConfirm = () => {
    const selected = document.querySelector('.payment-option.selected');
    if (!selected) { showToast('Please select a payment method.', 'fa-exclamation-circle', '#f59e0b'); return; }
    const method = selected.dataset.method;
    // Validate card fields if card
    if (method === 'card') {
        const num = document.getElementById('card-number').value.trim();
        const exp = document.getElementById('card-exp').value.trim();
        const cvv = document.getElementById('card-cvv').value.trim();
        if (!num || !exp || !cvv) { showToast('Please fill card details.', 'fa-exclamation-circle', '#f59e0b'); return; }
    }
    if (method === 'upi') {
        const upi = document.getElementById('upi-id').value.trim();
        if (!upi || !upi.includes('@')) { showToast('Enter a valid UPI ID (e.g. name@upi).', 'fa-exclamation-circle', '#f59e0b'); return; }
    }
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    const orderId = 'ORD' + Math.floor(1000 + Math.random() * 9000);
    // Populate confirmation
    document.getElementById('confirm-order-id').textContent = orderId;
    document.getElementById('confirm-items').textContent = cart.length + ' item(s)';
    document.getElementById('confirm-total').textContent = '$' + total.toFixed(2);
    document.getElementById('confirm-address').textContent =
        `${document.getElementById('co-name').value}, ${document.getElementById('co-address').value}, ${document.getElementById('co-city').value} - ${document.getElementById('co-pincode').value}`;
    document.getElementById('confirm-payment').textContent = selected.querySelector('.pay-label').textContent;
    goToCheckoutStep(3);
};

window.placeOrder = () => {
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    const orderId = document.getElementById('confirm-order-id').textContent;
    const customer = document.getElementById('co-name').value;
    const order = {
        id: orderId, customer, items: cart.length, total,
        status: 'Processing', date: new Date().toISOString().split('T')[0]
    };
    orders.unshift(order);
    cart = [];
    document.getElementById('cart-count').innerText = 0;
    saveState();
    closeCheckout();
    // Success animation
    setTimeout(() => showToast(`🎉 Order ${orderId} placed! Estimated delivery in 3-5 days.`, 'fa-box', '#22c55e'), 300);
    if (window.location.hash === '#admin') renderAdmin(document.getElementById('main-content'));
};

// Initialization
const initMobileMenu = () => {
    const toggle = document.getElementById('menu-toggle');
    const close = document.getElementById('menu-close');
    const menu = document.getElementById('mobile-menu');
    const links = document.querySelectorAll('.mobile-nav-links a');

    if (toggle && menu) {
        toggle.onclick = () => menu.classList.add('active');
    }

    if (close && menu) {
        close.onclick = () => menu.classList.remove('active');
    }

    links.forEach(link => {
        link.onclick = () => menu.classList.remove('active');
    });
};

window.addEventListener('hashchange', router);

document.addEventListener('DOMContentLoaded', () => {
    router();
    initMobileMenu();
    
    // Add overlay if it doesn't exist
    const app = document.getElementById('app');
    if (app && !document.getElementById('overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'overlay';
        app.appendChild(overlay);
        overlay.addEventListener('click', toggleCart);
    }

    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) cartBtn.addEventListener('click', toggleCart);



    // Append footer
    if (app && !document.getElementById('footer')) {
        app.insertAdjacentHTML('beforeend', renderFooter());
    }

    // Inject checkout modal
    if (!document.getElementById('checkout-modal')) {
        document.body.insertAdjacentHTML('beforeend', `
        <div id="checkout-modal" style="display:none;position:fixed;inset:0;z-index:5000;background:rgba(15,23,42,0.65);backdrop-filter:blur(8px);align-items:center;justify-content:center;padding:20px;" onclick="event.target===this&&closeCheckout()">
          <div class="checkout-box" onclick="event.stopPropagation()">
            <button class="product-detail-close" onclick="closeCheckout()" style="top:16px;right:16px;"><i class="fas fa-times"></i></button>

            <!-- Step indicator -->
            <div class="checkout-steps">
              <div class="step-dot active" title="Delivery"><i class="fas fa-map-marker-alt"></i></div>
              <div class="step-line"></div>
              <div class="step-dot" title="Payment"><i class="fas fa-credit-card"></i></div>
              <div class="step-line"></div>
              <div class="step-dot" title="Confirm"><i class="fas fa-check"></i></div>
            </div>

            <!-- Step 1: Delivery -->
            <div class="checkout-step-panel">
              <h2 class="checkout-title"><i class="fas fa-map-marker-alt"></i> Delivery Details</h2>
              <div class="co-grid">
                <div class="form-group"><label>Full Name</label><input id="co-name" type="text" placeholder="Anand Kumar"></div>
                <div class="form-group"><label>Phone Number</label><input id="co-phone" type="tel" placeholder="+91 98765 43210"></div>
              </div>
              <div class="form-group"><label>Address Line</label><input id="co-address" type="text" placeholder="House No., Street, Locality"></div>
              <div class="co-grid">
                <div class="form-group"><label>City</label><input id="co-city" type="text" placeholder="Mumbai"></div>
                <div class="form-group"><label>PIN Code</label><input id="co-pincode" type="text" placeholder="400001"></div>
              </div>
              <button class="btn btn-primary" style="width:100%;margin-top:8px;" onclick="proceedToPayment()">Continue to Payment <i class="fas fa-arrow-right"></i></button>
            </div>

            <!-- Step 2: Payment -->
            <div class="checkout-step-panel" style="display:none">
              <h2 class="checkout-title"><i class="fas fa-credit-card"></i> Payment Method</h2>
              <div class="payment-options">
                <div class="payment-option" id="pay-cod" data-method="cod" onclick="selectPayment('cod')">
                  <i class="fas fa-money-bill-wave pay-icon" style="color:#22c55e"></i>
                  <span class="pay-label">Cash on Delivery</span>
                  <i class="fas fa-check-circle pay-check"></i>
                </div>
                <div class="payment-option" id="pay-upi" data-method="upi" onclick="selectPayment('upi')">
                  <i class="fas fa-mobile-alt pay-icon" style="color:#8b5cf6"></i>
                  <span class="pay-label">UPI Payment</span>
                  <i class="fas fa-check-circle pay-check"></i>
                </div>
                <div class="payment-option" id="pay-card" data-method="card" onclick="selectPayment('card')">
                  <i class="fas fa-credit-card pay-icon" style="color:#0369a1"></i>
                  <span class="pay-label">Credit / Debit Card</span>
                  <i class="fas fa-check-circle pay-check"></i>
                </div>
                <div class="payment-option" id="pay-netbank" data-method="netbank" onclick="selectPayment('netbank')">
                  <i class="fas fa-university pay-icon" style="color:#f97316"></i>
                  <span class="pay-label">Net Banking</span>
                  <i class="fas fa-check-circle pay-check"></i>
                </div>
              </div>
              <!-- Dynamic fields -->
              <div id="fields-upi" class="payment-fields" style="display:none">
                <div class="form-group" style="margin-top:16px"><label>UPI ID</label><input id="upi-id" type="text" placeholder="yourname@upi"></div>
              </div>
              <div id="fields-card" class="payment-fields" style="display:none">
                <div class="form-group" style="margin-top:16px"><label>Card Number</label><input id="card-number" type="text" placeholder="1234 5678 9012 3456" maxlength="19"></div>
                <div class="co-grid">
                  <div class="form-group"><label>Expiry (MM/YY)</label><input id="card-exp" type="text" placeholder="08/27" maxlength="5"></div>
                  <div class="form-group"><label>CVV</label><input id="card-cvv" type="password" placeholder="•••" maxlength="3"></div>
                </div>
              </div>
              <div id="fields-netbank" class="payment-fields" style="display:none">
                <div class="form-group" style="margin-top:16px"><label>Select Bank</label>
                  <select style="width:100%;padding:12px;border:1px solid #e2e8f0;border-radius:10px;font-family:inherit;font-size:1rem;">
                    <option>State Bank of India</option><option>HDFC Bank</option><option>ICICI Bank</option>
                    <option>Axis Bank</option><option>Kotak Mahindra Bank</option><option>Punjab National Bank</option>
                  </select>
                </div>
              </div>
              <div style="display:flex;gap:12px;margin-top:20px;">
                <button class="btn btn-outline-cart" style="flex:1" onclick="goToCheckoutStep(1)"><i class="fas fa-arrow-left"></i> Back</button>
                <button class="btn btn-primary" style="flex:2" onclick="proceedToConfirm()">Review Order <i class="fas fa-arrow-right"></i></button>
              </div>
            </div>

            <!-- Step 3: Confirm -->
            <div class="checkout-step-panel" style="display:none">
              <div class="confirm-success-icon"><i class="fas fa-box-open"></i></div>
              <h2 class="checkout-title" style="text-align:center">Order Summary</h2>
              <div class="confirm-table">
                <div class="confirm-row"><span>Order ID</span><strong id="confirm-order-id"></strong></div>
                <div class="confirm-row"><span>Items</span><strong id="confirm-items"></strong></div>
                <div class="confirm-row"><span>Total</span><strong id="confirm-total" style="color:var(--primary);font-size:1.2rem"></strong></div>
                <div class="confirm-row"><span>Deliver to</span><strong id="confirm-address"></strong></div>
                <div class="confirm-row"><span>Payment</span><strong id="confirm-payment"></strong></div>
              </div>
              <div style="display:flex;gap:12px;margin-top:24px;">
                <button class="btn btn-outline-cart" style="flex:1" onclick="goToCheckoutStep(2)"><i class="fas fa-arrow-left"></i> Back</button>
                <button class="btn btn-primary" style="flex:2" onclick="placeOrder()"><i class="fas fa-check"></i> Place Order</button>
              </div>
            </div>
          </div>
        </div>`);
    }

    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.innerText = cart.length;
});

