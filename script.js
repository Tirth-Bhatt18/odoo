// Global State Management
let currentUser = null;
let products = [];
let cart = [];
let purchases = [];
let currentScreen = 'login-screen';

// Sample data for demonstration
const sampleProducts = [
    {
        id: 1,
        title: "Vintage Camera",
        description: "Beautiful vintage camera in excellent condition. Perfect for photography enthusiasts.",
        category: "electronics",
        price: 150.00,
        image: null,
        sellerId: "user1",
        sellerName: "John Doe"
    },
    {
        id: 2,
        title: "Designer Jacket",
        description: "Stylish designer jacket, barely worn. Great for fashion-conscious individuals.",
        category: "clothing",
        price: 75.00,
        image: null,
        sellerId: "user2",
        sellerName: "Jane Smith"
    },
    {
        id: 3,
        title: "Wooden Bookshelf",
        description: "Solid wood bookshelf with 5 shelves. Perfect for organizing books and decorations.",
        category: "furniture",
        price: 120.00,
        image: null,
        sellerId: "user3",
        sellerName: "Mike Johnson"
    },
    {
        id: 4,
        title: "Programming Books",
        description: "Collection of programming books including JavaScript, Python, and React guides.",
        category: "books",
        price: 45.00,
        image: null,
        sellerId: "user1",
        sellerName: "John Doe"
    },
    {
        id: 5,
        title: "Tennis Racket",
        description: "Professional tennis racket, used but in good condition. Great for intermediate players.",
        category: "sports",
        price: 85.00,
        image: null,
        sellerId: "user2",
        sellerName: "Jane Smith"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load sample data
    products = [...sampleProducts];
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showScreen('product-feed');
        updateNavbar();
    } else {
        showScreen('login-screen');
    }
    
    // Load saved data
    loadSavedData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize screens
    initializeScreens();
});

// Event Listeners Setup
function setupEventListeners() {
    // Authentication forms
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    
    // Product form
    document.getElementById('add-product-form').addEventListener('submit', handleAddProduct);
    
    // Profile form
    document.getElementById('profile-form').addEventListener('submit', handleProfileUpdate);
    
    // Search functionality
    document.getElementById('search-input').addEventListener('input', handleSearch);
    
    // Image upload
    document.getElementById('image-input').addEventListener('change', handleImageUpload);
    
    // Mobile menu toggle
    document.getElementById('hamburger').addEventListener('click', toggleMobileMenu);
}

// Screen Management
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
    
    // Load screen-specific content
    switch(screenId) {
        case 'product-feed':
            loadProductFeed();
            break;
        case 'my-listings':
            loadMyListings();
            break;
        case 'user-dashboard':
            loadUserDashboard();
            break;
        case 'cart':
            loadCart();
            break;
        case 'previous-purchases':
            loadPurchaseHistory();
            break;
    }
}

function goBack() {
    if (currentScreen === 'product-detail') {
        showScreen('product-feed');
    } else if (currentScreen === 'previous-purchases') {
        showScreen('user-dashboard');
    } else {
        showScreen('product-feed');
    }
}

// Authentication Functions
function switchAuthTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    
    if (tab === 'login') {
        document.querySelector('.tab-btn').classList.add('active');
        document.getElementById('login-form').classList.add('active');
    } else {
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        document.getElementById('signup-form').classList.add('active');
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simple validation (in real app, this would be server-side)
    if (email && password) {
        currentUser = {
            id: 'user1',
            email: email,
            username: email.split('@')[0],
            phone: '',
            address: ''
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showScreen('product-feed');
        updateNavbar();
        showMessage('Login successful!', 'success');
    } else {
        showMessage('Please fill in all fields', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    if (email && username && password) {
        currentUser = {
            id: 'user' + Date.now(),
            email: email,
            username: username,
            phone: '',
            address: ''
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showScreen('product-feed');
        updateNavbar();
        showMessage('Account created successfully!', 'success');
    } else {
        showMessage('Please fill in all fields', 'error');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showScreen('login-screen');
    updateNavbar();
    showMessage('Logged out successfully', 'success');
}

// Product Management
function loadProductFeed() {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>No products available</h3>
                <p>Be the first to add a product!</p>
            </div>
        `;
        return;
    }
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => showProductDetail(product);
    
    card.innerHTML = `
        <div class="product-image">
            <i class="fas fa-image"></i>
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <span class="product-category">${product.category}</span>
        </div>
    `;
    
    return card;
}

function showProductDetail(product) {
    const detailContent = document.getElementById('product-detail-content');
    detailContent.innerHTML = `
        <div class="detail-image">
            <i class="fas fa-image"></i>
        </div>
        <div class="detail-info">
            <h1 class="detail-title">${product.title}</h1>
            <div class="detail-price">$${product.price.toFixed(2)}</div>
            <span class="detail-category">${product.category}</span>
            <p class="detail-description">${product.description}</p>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
        </div>
    `;
    
    showScreen('product-detail');
}

function handleAddProduct(e) {
    e.preventDefault();
    
    const title = document.getElementById('product-title').value;
    const category = document.getElementById('product-category').value;
    const description = document.getElementById('product-description').value;
    const price = parseFloat(document.getElementById('product-price').value);
    
    if (!title || !category || !description || !price) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    const newProduct = {
        id: Date.now(),
        title: title,
        description: description,
        category: category,
        price: price,
        image: null,
        sellerId: currentUser.id,
        sellerName: currentUser.username
    };
    
    products.push(newProduct);
    saveData();
    
    // Reset form
    document.getElementById('add-product-form').reset();
    document.getElementById('image-preview').innerHTML = '';
    
    showScreen('product-feed');
    showMessage('Product added successfully!', 'success');
}

function loadMyListings() {
    const listingsGrid = document.getElementById('my-listings-grid');
    listingsGrid.innerHTML = '';
    
    const userProducts = products.filter(product => product.sellerId === currentUser.id);
    
    if (userProducts.length === 0) {
        listingsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-plus-circle"></i>
                <h3>No listings yet</h3>
                <p>Start by adding your first product!</p>
            </div>
        `;
        return;
    }
    
    userProducts.forEach(product => {
        const listingCard = createListingCard(product);
        listingsGrid.appendChild(listingCard);
    });
}

function createListingCard(product) {
    const card = document.createElement('div');
    card.className = 'listing-card';
    
    card.innerHTML = `
        <div class="product-image">
            <i class="fas fa-image"></i>
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <span class="product-category">${product.category}</span>
        </div>
        <div class="listing-actions">
            <button class="edit-btn" onclick="editProduct(${product.id})">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="delete-btn" onclick="deleteProduct(${product.id})">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    
    return card;
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Fill form with product data
    document.getElementById('product-title').value = product.title;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-price').value = product.price;
    
    // Store the product ID for updating
    document.getElementById('add-product-form').dataset.editingId = productId;
    
    showScreen('add-product');
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        saveData();
        loadMyListings();
        showMessage('Product deleted successfully', 'success');
    }
}

// Search and Filter Functions
function handleSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    
    displayFilteredProducts(filteredProducts);
}

function filterByCategory(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    displayFilteredProducts(filteredProducts);
}

function displayFilteredProducts(filteredProducts) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartCount();
    saveData();
    showMessage('Product added to cart!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    saveData();
    loadCart();
    showMessage('Product removed from cart', 'success');
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

function loadCart() {
    const cartContent = document.getElementById('cart-content');
    const cartSummary = document.getElementById('cart-summary');
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
            </div>
        `;
        cartSummary.style.display = 'none';
        return;
    }
    
    cartContent.innerHTML = '';
    cartSummary.style.display = 'block';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <i class="fas fa-image"></i>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
            </div>
            <button class="remove-from-cart" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartContent.appendChild(cartItem);
    });
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total').textContent = total.toFixed(2);
}

function checkout() {
    if (cart.length === 0) {
        showMessage('Your cart is empty', 'error');
        return;
    }
    
    // Add to purchase history
    const purchase = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    
    purchases.push(purchase);
    
    // Clear cart
    cart = [];
    updateCartCount();
    saveData();
    
    showMessage('Purchase completed successfully!', 'success');
    showScreen('product-feed');
}

// User Dashboard Functions
function loadUserDashboard() {
    if (!currentUser) return;
    
    document.getElementById('user-name').textContent = currentUser.username;
    document.getElementById('profile-username').value = currentUser.username;
    document.getElementById('profile-email').value = currentUser.email;
    document.getElementById('profile-phone').value = currentUser.phone || '';
    document.getElementById('profile-address').value = currentUser.address || '';
    
    // Update stats
    const userProducts = products.filter(p => p.sellerId === currentUser.id);
    document.getElementById('total-listings').textContent = userProducts.length;
    document.getElementById('total-purchases').textContent = purchases.length;
}

function handleProfileUpdate(e) {
    e.preventDefault();
    
    currentUser.username = document.getElementById('profile-username').value;
    currentUser.email = document.getElementById('profile-email').value;
    currentUser.phone = document.getElementById('profile-phone').value;
    currentUser.address = document.getElementById('profile-address').value;
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateNavbar();
    showMessage('Profile updated successfully!', 'success');
}

// Purchase History Functions
function loadPurchaseHistory() {
    const purchasesList = document.getElementById('purchases-list');
    purchasesList.innerHTML = '';
    
    if (purchases.length === 0) {
        purchasesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <h3>No purchase history</h3>
                <p>Your completed purchases will appear here</p>
            </div>
        `;
        return;
    }
    
    purchases.forEach(purchase => {
        const purchaseItem = document.createElement('div');
        purchaseItem.className = 'purchase-item';
        
        const purchaseDate = new Date(purchase.date).toLocaleDateString();
        const totalItems = purchase.items.reduce((sum, item) => sum + item.quantity, 0);
        
        purchaseItem.innerHTML = `
            <div class="purchase-item-image">
                <i class="fas fa-receipt"></i>
            </div>
            <div class="purchase-item-info">
                <div class="purchase-date">${purchaseDate}</div>
                <div class="purchase-items">${totalItems} items</div>
                <div class="purchase-total">Total: $${purchase.total.toFixed(2)}</div>
            </div>
        `;
        
        purchasesList.appendChild(purchaseItem);
    });
}

// Utility Functions
function updateNavbar() {
    const navMenu = document.getElementById('nav-menu');
    if (currentUser) {
        navMenu.style.display = 'flex';
    } else {
        navMenu.style.display = 'none';
    }
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('image-preview');
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

function showMessage(message, type) {
    // Remove existing messages
    document.querySelectorAll('.message').forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(messageDiv, container.firstChild);
    }
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function saveData() {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('purchases', JSON.stringify(purchases));
}

function loadSavedData() {
    const savedProducts = localStorage.getItem('products');
    const savedCart = localStorage.getItem('cart');
    const savedPurchases = localStorage.getItem('purchases');
    
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
    if (savedPurchases) {
        purchases = JSON.parse(savedPurchases);
    }
}

function initializeScreens() {
    // Initialize any screen-specific functionality
    updateCartCount();
}