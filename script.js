// script.js
import { supabase, TABLES, getAllProducts } from './supabase-config.js'

let allProducts = []
let allCategories = []
let allReviews = []

async function loadDatabase() {
    try {
        showLoader()
        
        // Загружаем товары из Supabase
        const { data: products, error: productsError } = await supabase
            .from(TABLES.PRODUCTS)
            .select('*')
            .order('created_at', { ascending: false })
        
        if (productsError) throw productsError
        allProducts = products || []
        
        // Загружаем категории из JSON (или можно тоже из Supabase)
        const response = await fetch('data/database.json')
        const data = await response.json()
        allCategories = data.categories
        allReviews = data.reviews
        
        console.log(`✅ Загружено ${allProducts.length} товаров из Supabase`)
        
        renderCategories(allCategories)
        renderStats()
        renderNewProducts(allProducts)
        renderReviews(allReviews)
        renderTopProducts(allProducts)
        
        hideLoader()
    } catch (error) {
        console.error('Ошибка загрузки:', error)
        showErrorMessage(error.message)
    }
}

function renderCategories(categories) {
    const container = document.getElementById('categoriesGrid')
    if (!container) return
    
    container.innerHTML = categories.map(cat => `
        <div class="cat-item">
            <div class="cat-img">
                <img src="${cat.image_url}" alt="${cat.name}" loading="lazy" 
                     onerror="this.src='https://placehold.co/164x164?text=${cat.icon}'">
            </div>
            <div>${cat.name}</div>
        </div>
    `).join('')
}

function renderStats() {
    const container = document.getElementById('statsGrid')
    if (!container) return
    
    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-number">${allProducts.length}+</div>
            <div>товаров в каталоге</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">2 272+</div>
            <div>магазинов-партнёров</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">15 000+</div>
            <div>довольных клиентов</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">5 380+</div>
            <div>честных обзоров</div>
        </div>
    `
}

function renderNewProducts(products) {
    const container = document.getElementById('newProductsGrid')
    if (!container) return
    
    const newProducts = products.filter(p => p.is_new === true).slice(0, 8)
    
    if (newProducts.length === 0) {
        container.innerHTML = '<div class="empty-list" style="text-align:center;padding:40px;">✨ Новинки появятся скоро</div>'
        return
    }
    
    container.innerHTML = newProducts.map(product => `
        <div class="product-card">
            <img class="product-img" src="${product.image_url}" alt="${product.name}" loading="lazy" 
                 onerror="this.src='https://placehold.co/232x156?text=${product.name}'">
            <div class="product-category">${product.category_name}</div>
            <div class="product-name">${escapeHtml(product.name)}</div>
            <div class="price-block">
                <span class="current-price">${product.price.toLocaleString('ru-RU')} ₽</span>
                ${product.old_price ? `<span class="old-price">${product.old_price.toLocaleString('ru-RU')} ₽</span>` : ''}
            </div>
            ${product.is_custom ? '<div style="font-size: 10px; color: #FF4D4D; margin-top: 8px;">✨ Добавлено вами</div>' : ''}
        </div>
    `).join('')
}

function renderReviews(reviews) {
    const container = document.getElementById('reviewsGrid')
    if (!container) return
    
    const displayReviews = reviews.slice(0, 4)
    
    container.innerHTML = displayReviews.map(review => `
        <div class="review-card" onclick="alert('Обзор: ${review.title}')">
            <div class="review-img">
                <img src="${review.image_url}" alt="${review.title}" loading="lazy" 
                     onerror="this.style.backgroundColor='#E9EDF2'">
            </div>
            <div class="review-content">
                <div class="review-title">${review.title}</div>
                <div class="review-excerpt">${review.excerpt}</div>
                <a href="#" class="view-link">Смотреть →</a>
            </div>
        </div>
    `).join('')
}

function renderTopProducts(products) {
    const container = document.getElementById('top10Grid')
    if (!container) return
    
    const smartphones = products.filter(p => p.category_name === 'Смартфоны').slice(0, 3)
    const laptops = products.filter(p => p.category_name === 'Ноутбуки').slice(0, 3)
    const earphones = products.filter(p => p.category_name === 'Наушники').slice(0, 3)
    
    container.innerHTML = `
        <div class="top10-col">
            <h4>Смартфоны</h4>
            <ul>
                ${smartphones.map(p => `<li>• ${escapeHtml(p.name)}</li>`).join('')}
                ${smartphones.length === 0 ? '<li>• Нет товаров</li>' : ''}
            </ul>
        </div>
        <div class="top10-col">
            <h4>Ноутбуки</h4>
            <ul>
                ${laptops.map(p => `<li>• ${escapeHtml(p.name)}</li>`).join('')}
                ${laptops.length === 0 ? '<li>• Нет товаров</li>' : ''}
            </ul>
        </div>
        <div class="top10-col">
            <h4>Наушники</h4>
            <ul>
                ${earphones.map(p => `<li>• ${escapeHtml(p.name)}</li>`).join('')}
                ${earphones.length === 0 ? '<li>• Нет товаров</li>' : ''}
            </ul>
        </div>
    `
}

function escapeHtml(str) {
    if (!str) return ''
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;'
        if (m === '<') return '&lt;'
        if (m === '>') return '&gt;'
        return m
    })
}

function showLoader() {
    const loader = document.createElement('div')
    loader.id = 'global-loader'
    loader.innerHTML = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(255,255,255,0.9);z-index:9999;display:flex;justify-content:center;align-items:center">⏳ Загрузка...</div>'
    document.body.appendChild(loader)
}

function hideLoader() {
    const loader = document.getElementById('global-loader')
    if (loader) loader.remove()
}

function showErrorMessage(message) {
    console.error('Ошибка:', message)
}

function setupSearch() {
    const searchInput = document.querySelector('.search-bar input')
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase()
            console.log('Поиск:', query)
        })
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadDatabase()
    setupSearch()
    
    const catalogBtn = document.querySelector('.catalog-btn')
    if (catalogBtn) {
        catalogBtn.addEventListener('click', () => {
            alert('📱 Открыть полный каталог товаров')
        })
    }
})
