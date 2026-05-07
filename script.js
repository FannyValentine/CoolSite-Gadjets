// ============================================
// Глобальные переменные
// ============================================
let productsData = [];
let categoriesData = [];
let reviewsData = [];
let statsData = {};
let likedProducts = {};

// ============================================
// Загрузка данных из JSON файла
// ============================================
// Загрузка данных из JSON
async function loadDatabase() {
    try {
        const response = await fetch('data/database.json');
        const data = await response.json();
        
        renderCategories(data.categories);
        renderStats(data.stats);
        renderNewProducts(data.products);
        renderReviews(data.reviews);
        renderTopProducts(data.products);
        
        return data;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
}

function renderCategories(categories) {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;
    
    container.innerHTML = categories.map(cat => {
        let imageClass = '';
        if (cat.name === 'Смартфоны') imageClass = 'https://avatars.mds.yandex.net/i?id=720c61829d3be5d4f6a0b200f01252fd8e1c9d0b-3480111-images-thumbs&n=13';
        else if (cat.name === 'Ноутбуки') imageClass = 'https://avatars.mds.yandex.net/i?id=a32472083453a94e5047c30b7969dd29ddc647e8-5209664-images-thumbs&n=13';
        else if (cat.name === 'Наушники') imageClass = 'https://avatars.mds.yandex.net/i?id=bd99e8296a51eafa8c4751fc9d6d60961b65107c-9289753-images-thumbs&n=13';
        else if (cat.name === 'Телевизоры') imageClass = 'https://avatars.mds.yandex.net/i?id=390e186ce199e430c7290d5758297fb4a0464e29-5877103-images-thumbs&n=13';
        else if (cat.name === 'Умные часы') imageClass = 'https://avatars.mds.yandex.net/i?id=b6fac31393bb5a25960da37e4f1049af5f436e37-10360812-images-thumbs&n=13';
        else imageClass = 'https://avatars.mds.yandex.net/i?id=720c61829d3be5d4f6a0b200f01252fd8e1c9d0b-3480111-images-thumbs&n=13';
        
        return `
            <div class="cat-item">
                <div class="cat-img ${imageClass}">${cat.icon}</div>
                <div>${cat.name}</div>
            </div>
        `;
    }).join('');
}

function renderStats(stats) {
    const container = document.getElementById('statsGrid');
    if (!container) return;
    
    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-number">${stats.products_count.toLocaleString()}+</div>
            <div>товаров в каталоге</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${stats.stores_count.toLocaleString()}+</div>
            <div>магазинов-партнёров</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${stats.customers_count.toLocaleString()}+</div>
            <div>довольных клиентов</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${stats.reviews_count.toLocaleString()}+</div>
            <div>честных обзоров</div>
        </div>
    `;
}

function renderNewProducts(products) {
    const container = document.getElementById('newProductsGrid');
    if (!container) return;
    
    const newProducts = products.filter(p => p.is_new).slice(0, 4);
    
    container.innerHTML = newProducts.map(product => {
        let imageClass = '';
        if (product.category_name === 'Смартфоны') imageClass = 'https://avatars.mds.yandex.net/i?id=720c61829d3be5d4f6a0b200f01252fd8e1c9d0b-3480111-images-thumbs&n=13';
        else if (product.category_name === 'Ноутбуки') imageClass = 'https://avatars.mds.yandex.net/i?id=a32472083453a94e5047c30b7969dd29ddc647e8-5209664-images-thumbs&n=13';
        else if (product.category_name === 'Наушники') imageClass = 'https://avatars.mds.yandex.net/i?id=bd99e8296a51eafa8c4751fc9d6d60961b65107c-9289753-images-thumbs&n=13';
        else if (product.category_name === 'Телевизоры') imageClass = 'https://avatars.mds.yandex.net/i?id=390e186ce199e430c7290d5758297fb4a0464e29-5877103-images-thumbs&n=13';
        else if (product.category_name === 'Умные часы') imageClass = 'https://avatars.mds.yandex.net/i?id=b6fac31393bb5a25960da37e4f1049af5f436e37-10360812-images-thumbs&n=13'';
        else imageClass = 'https://avatars.mds.yandex.net/i?id=720c61829d3be5d4f6a0b200f01252fd8e1c9d0b-3480111-images-thumbs&n=13';
        
        return `
            <div class="product-card">
                <div class="${imageClass}" style="height: 156px; margin-bottom: 12px;"></div>
                <div class="product-category">${product.category_name}</div>
                <div class="product-name">${product.name}</div>
                <div class="price-block">
                    <span class="current-price">${product.price.toLocaleString('ru-RU')} ₽</span>
                    ${product.old_price ? `<span class="old-price">${product.old_price.toLocaleString('ru-RU')} ₽</span>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function renderReviews(reviews) {
    const container = document.getElementById('reviewsGrid');
    if (!container) return;
    
    container.innerHTML = reviews.slice(0, 4).map(review => `
        <div class="review-card">
            <div class="empty-image-review"></div>
            <div class="review-content">
                <div class="review-title">${review.title}</div>
                <div class="review-excerpt">${review.excerpt}</div>
                <a href="#" class="view-link">Смотреть →</a>
            </div>
        </div>
    `).join('');
}

function renderTopProducts(products) {
    const container = document.getElementById('top10Grid');
    if (!container) return;
    
    const smartphones = products.filter(p => p.category_name === 'Смартфоны').slice(0, 3);
    const laptops = products.filter(p => p.category_name === 'Ноутбуки').slice(0, 3);
    const earphones = products.filter(p => p.category_name === 'Наушники').slice(0, 3);
    
    container.innerHTML = `
        <div class="top10-col">
            <h4>Смартфоны</h4>
            <ul>${smartphones.map(p => `<li>• ${p.name}</li>`).join('')}</ul>
        </div>
        <div class="top10-col">
            <h4>Ноутбуки</h4>
            <ul>${laptops.map(p => `<li>• ${p.name}</li>`).join('')}</ul>
        </div>
        <div class="top10-col">
            <h4>Наушники</h4>
            <ul>${earphones.map(p => `<li>• ${p.name}</li>`).join('')}</ul>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    loadDatabase();
}

// ============================================
// Работа с лайками (localStorage)
// ============================================
function loadLikesFromStorage() {
    const saved = localStorage.getItem('behoof_likes');
    if (saved) {
        likedProducts = JSON.parse(saved);
    }
}

function saveLikesToStorage() {
    localStorage.setItem('behoof_likes', JSON.stringify(likedProducts));
}

function toggleLike(productId) {
    if (likedProducts[productId]) {
        delete likedProducts[productId];
    } else {
        likedProducts[productId] = true;
    }
    saveLikesToStorage();
    updateLikeButtons();
}

function isProductLiked(productId) {
    return likedProducts[productId] === true;
}

function updateLikeButtons() {
    document.querySelectorAll('.like-btn').forEach(btn => {
        const productId = parseInt(btn.dataset.id);
        if (isProductLiked(productId)) {
            btn.classList.add('liked');
            btn.innerHTML = '❤️';
        } else {
            btn.classList.remove('liked');
            btn.innerHTML = '❤️';
        }
    });
}

// ============================================
// Отрисовка всех компонентов
// ============================================
function renderAll() {
    renderCategories();
    renderTopProducts();
    renderStats();
    renderNewProducts();
    renderReviews();
}
// ============================================
// Отрисовка сайта
// ============================================

// ============================================
// 1. Категории
// ============================================
function renderCategories() {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;
    
    container.innerHTML = categoriesData.map(cat => `
        <div class="cat-item">
            <div class="cat-img">
                <img src="${cat.image_url || 'https://avatars.mds.yandex.net/i?id=b4d32f099cd1dd57c64c6372ea619e238e77f861-4578587-images-thumbs&n=13' + cat.name}" 
                     alt="${cat.name}"
                     onerror="this.src='https://placehold.co/124x124?text=📱'">
            </div>
            <div>${cat.name}</div>
        </div>
    `).join('');
}

// ============================================
// 2. Топ товаров (для блока "Топ-10")
// ============================================
function renderTopProducts() {
    const container = document.getElementById('top10Grid');
    if (!container) return;
    
    const topProducts = productsData.filter(p => p.is_popular).slice(0, 6);
    const smartphones = topProducts.filter(p => p.category_name === 'Смартфоны').slice(0, 3);
    const laptops = topProducts.filter(p => p.category_name === 'Ноутбуки').slice(0, 3);
    
    container.innerHTML = `
        <div class="top10-col">
            <h4>Смартфоны</h4>
            <ul>
                ${smartphones.map(p => `<li>• ${p.name}</li>`).join('')}
            </ul>
        </div>
        <div class="top10-col">
            <h4>Ноутбуки</h4>
            <ul>
                ${laptops.map(p => `<li>• ${p.name}</li>`).join('')}
            </ul>
        </div>
        <div class="top10-col">
            <h4>Наушники и аксессуары</h4>
            <ul>
                <li>• Sony WH-1000XM5</li>
                <li>• Apple AirPods Pro 2</li>
                <li>• Samsung Buds2 Pro</li>
            </ul>
        </div>
    `;
}

// ============================================
// 3. Статистика
// ============================================
function renderStats() {
    const container = document.getElementById('statsGrid');
    if (!container) return;
    
    container.innerHTML = `
        <div class="stat-card"><div class="stat-number">${formatNumber(statsData.products_count || 8000)}+</div><div>товаров в каталоге</div></div>
        <div class="stat-card"><div class="stat-number">${formatNumber(statsData.stores_count || 2272)}+</div><div>магазинов-партнёров</div></div>
        <div class="stat-card"><div class="stat-number">${formatNumber(statsData.reviews_count || 12500)}+</div><div>честных обзоров</div></div>
        <div class="stat-card"><div class="stat-number">${formatNumber(statsData.customers_count || 15000)}+</div><div>довольных клиентов</div></div>
    `;
}

// ============================================
// 4. Новинки
// ============================================
function renderNewProducts() {
    const container = document.getElementById('newProductsGrid');
    if (!container) return;
    
    const newProducts = productsData.filter(p => p.is_new).slice(0, 6);
    
    container.innerHTML = newProducts.map(product => `
        <div class="product-card">
            <img class="product-img" 
                 src="${product.image_url || 'https://avatars.mds.yandex.net/i?id=ad5ad5beb9abfc53c2252a84ddd3e093bb1e98a7-10355051-images-thumbs&n=13' + product.name}" 
                 alt="${product.name}"
                 onerror="this.src='https://placehold.co/232x156?text=📱'">
            <div class="product-category">${product.category_name}</div>
            <div class="product-name">${product.name}</div>
            <div class="price-block">
                <span class="current-price">${formatPrice(product.price)} ₽</span>
                ${product.old_price ? `<span class="old-price">${formatPrice(product.old_price)} ₽</span>` : ''}
            </div>
            <div class="action-icons">
                <div class="like-btn" data-id="${product.id}">❤️</div>
                <div class="compare-btn" data-id="${product.id}">📊</div>
            </div>
        </div>
    `).join('');
    
    // Привязываем обработчики лайков
    attachLikeHandlers();
}

// ============================================
// 5. Обзоры
// ============================================
function renderReviews() {
    const container = document.getElementById('reviewsGrid');
    if (!container) return;
    
    const displayReviews = reviewsData.slice(0, 4);
    
    container.innerHTML = displayReviews.map(review => `
        <div class="review-card" onclick="alert('Обзор: ${review.title}')">
            <div class="review-img" style="background-image: url('${review.image_url || 'https://avatars.mds.yandex.net/i?id=f5545fd438f77b909fe88fc8809369d64dfde207-9150622-images-thumbs&n=13'}')"></div>
            <div class="review-content">
                <div class="review-title">${review.title}</div>
                <div class="review-excerpt">${review.excerpt}</div>
                <a href="#" class="view-link">Смотреть →</a>
            </div>
        </div>
    `).join('');
}

// ============================================
// Вспомогательные функции
// ============================================
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function attachLikeHandlers() {
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.removeEventListener('click', handleLikeClick);
        btn.addEventListener('click', handleLikeClick);
    });
    
    document.querySelectorAll('.compare-btn').forEach(btn => {
        btn.removeEventListener('click', handleCompareClick);
        btn.addEventListener('click', handleCompareClick);
    });
}

function handleLikeClick(e) {
    e.stopPropagation();
    const btn = e.currentTarget;
    const productId = parseInt(btn.dataset.id);
    toggleLike(productId);
}

function handleCompareClick(e) {
    e.stopPropagation();
    alert('📊 Товар добавлен в сравнение (демо-режим)');
}

function showErrorMessage() {
    const containers = ['categoriesGrid', 'newProductsGrid', 'reviewsGrid'];
    containers.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '<div class="loader">⚠️ Ошибка загрузки данных. Проверьте подключение к интернету.</div>';
    });
}

// ============================================
// Поиск товаров
// ============================================
function setupSearch() {
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = productsData.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.category_name.toLowerCase().includes(query)
            );
            // Здесь можно добавить отображение результатов поиска
            console.log('Найдено товаров:', filtered.length);
        });
    }
}
// ============================================
// Инициализация
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadDatabase();
    setupSearch();
    
    // Кнопка каталога
    const catalogBtn = document.querySelector('.catalog-btn');
    if (catalogBtn) {
        catalogBtn.addEventListener('click', () => {
            alert('📱 Открыть полный каталог товаров');
        });
    }
});
