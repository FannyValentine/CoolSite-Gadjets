// Загрузка данных из JSON файла
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
        console.error('Ошибка загрузки базы данных:', error);
        showErrorMessage();
    }
}

// Отображение категорий
function renderCategories(categories) {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;
    
    container.innerHTML = categories.map(cat => `
        <div class="cat-item">
            <div class="cat-img">
                <img src="${cat.image_url}" alt="${cat.name}" loading="lazy" onerror="this.src='https://placehold.co/164x164?text=${cat.name}'">
            </div>
            <div>${cat.name}</div>
        </div>
    `).join('');
}

// Отображение статистики
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

// Отображение новинок
function renderNewProducts(products) {
    const container = document.getElementById('newProductsGrid');
    if (!container) return;
    
    const newProducts = products.filter(p => p.is_new === true).slice(0, 4);
    
    container.innerHTML = newProducts.map(product => `
        <div class="product-card">
            <img class="product-img" src="${product.image_url}" alt="${product.name}" loading="lazy" onerror="this.src='https://placehold.co/232x156?text=${product.name}'">
            <div class="product-category">${product.category_name}</div>
            <div class="product-name">${product.name}</div>
            <div class="price-block">
                <span class="current-price">${product.price.toLocaleString('ru-RU')} ₽</span>
                ${product.old_price ? `<span class="old-price">${product.old_price.toLocaleString('ru-RU')} ₽</span>` : ''}
            </div>
        </div>
    `).join('');
}

// Отображение обзоров
function renderReviews(reviews) {
    const container = document.getElementById('reviewsGrid');
    if (!container) return;
    
    const displayReviews = reviews.slice(0, 4);
    
    container.innerHTML = displayReviews.map(review => `
        <div class="review-card" onclick="alert('Обзор: ${review.title}')">
            <div class="review-img">
                <img src="${review.image_url}" alt="${review.title}" loading="lazy" onerror="this.style.backgroundColor='#E9EDF2'">
            </div>
            <div class="review-content">
                <div class="review-title">${review.title}</div>
                <div class="review-excerpt">${review.excerpt}</div>
                <a href="#" class="view-link">Смотреть →</a>
            </div>
        </div>
    `).join('');
}

// Отображение топ товаров
function renderTopProducts(products) {
    const container = document.getElementById('top10Grid');
    if (!container) return;
    
    const smartphones = products.filter(p => p.category_name === 'Смартфоны').slice(0, 3);
    const laptops = products.filter(p => p.category_name === 'Ноутбуки').slice(0, 3);
    const earphones = products.filter(p => p.category_name === 'Наушники').slice(0, 3);
    
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
            <h4>Наушники</h4>
            <ul>
                ${earphones.map(p => `<li>• ${p.name}</li>`).join('')}
            </ul>
        </div>
    `;
}

// Сообщение об ошибке
function showErrorMessage() {
    const containers = ['categoriesGrid', 'newProductsGrid', 'reviewsGrid', 'statsGrid', 'top10Grid'];
    containers.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.innerHTML === '') {
            el.innerHTML = '<div style="text-align: center; padding: 40px; color: #FF4D4D;">⚠️ Ошибка загрузки данных. Проверьте подключение.</div>';
        }
    });
}

// Поиск товаров
function setupSearch() {
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            console.log('Поиск:', query);
            // Здесь можно добавить live поиск по товарам
        });
    }
}
// Глобальный массив всех товаров
let allProducts = [];

// Загрузка данных из JSON и localStorage
async function loadDatabase() {
    try {
        // Загружаем основные товары из JSON
        const response = await fetch('data/database.json');
        const data = await response.json();
        
        // Загружаем кастомные товары из localStorage
        const customProducts = JSON.parse(localStorage.getItem('behoof_custom_products') || '[]');
        
        // Объединяем товары (кастомные имеют приоритет и уникальные ID)
        allProducts = [...data.products, ...customProducts];
        
        renderCategories(data.categories);
        renderStats(data.stats);
        renderNewProducts(allProducts);
        renderReviews(data.reviews);
        renderTopProducts(allProducts);
        
        return data;
    } catch (error) {
        console.error('Ошибка загрузки базы данных:', error);
        showErrorMessage();
    }
}

// Отображение новинок (с учётом добавленных товаров)
function renderNewProducts(products) {
    const container = document.getElementById('newProductsGrid');
    if (!container) return;
    
    const newProducts = products.filter(p => p.is_new === true).slice(0, 4);
    
    container.innerHTML = newProducts.map(product => `
        <div class="product-card">
            <img class="product-img" src="${product.image_url}" alt="${product.name}" loading="lazy" onerror="this.src='https://placehold.co/232x156?text=${product.name}'">
            <div class="product-category">${product.category_name}</div>
            <div class="product-name">${product.name}</div>
            <div class="price-block">
                <span class="current-price">${product.price.toLocaleString('ru-RU')} ₽</span>
                ${product.old_price ? `<span class="old-price">${product.old_price.toLocaleString('ru-RU')} ₽</span>` : ''}
            </div>
        </div>
    `).join('');
}

// Отображение топ товаров (с учётом добавленных)
function renderTopProducts(products) {
    const container = document.getElementById('top10Grid');
    if (!container) return;
    
    const smartphones = products.filter(p => p.category_name === 'Смартфоны').slice(0, 3);
    const laptops = products.filter(p => p.category_name === 'Ноутбуки').slice(0, 3);
    const earphones = products.filter(p => p.category_name === 'Наушники').slice(0, 3);
    
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
            <h4>Наушники</h4>
            <ul>
                ${earphones.map(p => `<li>• ${p.name}</li>`).join('')}
            </ul>
        </div>
    `;
}

// Остальные функции остаются без изменений...
function renderCategories(categories) {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;
    
    container.innerHTML = categories.map(cat => `
        <div class="cat-item">
            <div class="cat-img">
                <img src="${cat.image_url}" alt="${cat.name}" loading="lazy" onerror="this.src='https://placehold.co/164x164?text=${cat.name}'">
            </div>
            <div>${cat.name}</div>
        </div>
    `).join('');
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

function renderReviews(reviews) {
    const container = document.getElementById('reviewsGrid');
    if (!container) return;
    
    const displayReviews = reviews.slice(0, 4);
    
    container.innerHTML = displayReviews.map(review => `
        <div class="review-card" onclick="alert('Обзор: ${review.title}')">
            <div class="review-img">
                <img src="${review.image_url}" alt="${review.title}" loading="lazy" onerror="this.style.backgroundColor='#E9EDF2'">
            </div>
            <div class="review-content">
                <div class="review-title">${review.title}</div>
                <div class="review-excerpt">${review.excerpt}</div>
                <a href="#" class="view-link">Смотреть →</a>
            </div>
        </div>
    `).join('');
}

function showErrorMessage() {
    const containers = ['categoriesGrid', 'newProductsGrid', 'reviewsGrid', 'statsGrid', 'top10Grid'];
    containers.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.innerHTML === '') {
            el.innerHTML = '<div style="text-align: center; padding: 40px; color: #FF4D4D;">⚠️ Ошибка загрузки данных. Проверьте подключение.</div>';
        }
    });
}

function setupSearch() {
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            console.log('Поиск:', query);
        });
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadDatabase();
    setupSearch();
    
    const catalogBtn = document.querySelector('.catalog-btn');
    if (catalogBtn) {
        catalogBtn.addEventListener('click', () => {
            alert('📱 Открыть полный каталог товаров');
        });
    }
});
