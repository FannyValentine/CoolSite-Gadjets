// script.js — с подключением к Supabase
import { supabase, TABLES } from './supabase-config.js'

// Глобальная переменная для всех товаров
let allProducts = []
let allCategories = []
let allReviews = []

// ============================================
// ЗАГРУЗКА ДАННЫХ ИЗ SUPABASE
// ============================================

async function loadDatabase() {
    try {
        // Показываем индикатор загрузки
        showLoader()
        
        // 1. Загружаем товары
        const { data: products, error: productsError } = await supabase
            .from(TABLES.PRODUCTS)
            .select('*')
            .order('created_at', { ascending: false })
        
        if (productsError) throw productsError
        allProducts = products || []
        
        // 2. Загружаем категории
        const { data: categories, error: categoriesError } = await supabase
            .from(TABLES.CATEGORIES)
            .select('*')
        
        if (categoriesError) throw categoriesError
        allCategories = categories || []
        
        // 3. Загружаем обзоры
        const { data: reviews, error: reviewsError } = await supabase
            .from(TABLES.REVIEWS)
            .select('*')
        
        if (reviewsError) throw reviewsError
        allReviews = reviews || []
        
        // 4. Отрисовываем все секции
        renderCategories(allCategories)
        renderStats()
        renderNewProducts(allProducts)
        renderReviews(allReviews)
        renderTopProducts(allProducts)
        
        console.log(`✅ Загружено: ${allProducts.length} товаров, ${allCategories.length} категорий`)
        hideLoader()
        
    } catch (error) {
        console.error('Ошибка загрузки из Supabase:', error)
        showErrorMessage(error.message)
    }
}

// ============================================
// ОТРИСОВКА КОМПОНЕНТОВ
// ============================================

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
            <div class="stat-number">${allProducts.length.toLocaleString()}+</div>
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
            <div class="stat-number">${allReviews.length.toLocaleString()}+</div>
            <div>честных обзоров</div>
        </div>
    `
}

function renderNewProducts(products) {
    const container = document.getElementById('newProductsGrid')
    if (!container) return
    
    const newProducts = products.filter(p => p.is_new === true).slice(0, 8)
    
    if (newProducts.length === 0) {
        container.innerHTML = '<div class="empty-list">✨ Новинки появятся скоро</div>'
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
            ${product.is_custom ? '<div class="custom-badge">✨ Добавлено вами</div>' : ''}
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

// ============================================
// ФУНКЦИИ РАБОТЫ С ТОВАРАМИ (CRUD)
// ============================================

// Добавление нового товара
async function addProduct(productData) {
    try {
        // Проверяем подключение
        if (!supabase) {
            throw new Error('Supabase не инициализирован')
        }
        
        const newProduct = {
            name: productData.name,
            slug: productData.name.toLowerCase().replace(/[^a-zа-яё0-9]+/g, '-') + '-' + Date.now(),
            category_id: productData.category_id || 1,
            category_name: productData.category_name,
            price: productData.price,
            old_price: productData.old_price || null,
            rating: productData.rating || 4.5,
            is_new: productData.is_new || false,
            is_popular: productData.is_popular || false,
            stock: productData.stock || 10,
            image_url: productData.image_url,
            gallery: productData.gallery || [productData.image_url],
            description: productData.description || '',
            specs: productData.specs || '',
            is_custom: true,
            created_at: new Date().toISOString()
        }
        
        const { data, error } = await supabase
            .from(TABLES.PRODUCTS)
            .insert([newProduct])
            .select()
        
        if (error) throw error
        
        console.log('✅ Товар добавлен:', data)
        
        // Обновляем локальный массив
        allProducts.unshift(data[0])
        
        // Перерисовываем интерфейс
        renderNewProducts(allProducts)
        renderTopProducts(allProducts)
        
        return { success: true, data: data[0] }
        
    } catch (error) {
        console.error('❌ Ошибка добавления товара:', error)
        return { success: false, error: error.message }
    }
}

// Обновление товара
async function updateProduct(productId, updates) {
    try {
        const { data, error } = await supabase
            .from(TABLES.PRODUCTS)
            .update(updates)
            .eq('id', productId)
            .select()
        
        if (error) throw error
        
        // Обновляем локальный массив
        const index = allProducts.findIndex(p => p.id === productId)
        if (index !== -1) {
            allProducts[index] = { ...allProducts[index], ...updates }
        }
        
        renderNewProducts(allProducts)
        renderTopProducts(allProducts)
        
        return { success: true, data: data[0] }
        
    } catch (error) {
        console.error('Ошибка обновления:', error)
        return { success: false, error: error.message }
    }
}

// Удаление товара
async function deleteProduct(productId) {
    try {
        const { error } = await supabase
            .from(TABLES.PRODUCTS)
            .delete()
            .eq('id', productId)
        
        if (error) throw error
        
        // Удаляем из локального массива
        allProducts = allProducts.filter(p => p.id !== productId)
        
        renderNewProducts(allProducts)
        renderTopProducts(allProducts)
        
        return { success: true }
        
    } catch (error) {
        console.error('Ошибка удаления:', error)
        return { success: false, error: error.message }
    }
}

// ============================================
# Функции поиска и фильтрации
// ============================================

async function searchProducts(searchTerm) {
    try {
        const { data, error } = await supabase
            .from(TABLES.PRODUCTS)
            .select('*')
            .ilike('name', `%${searchTerm}%`)
            .limit(20)
        
        if (error) throw error
        return data
        
    } catch (error) {
        console.error('Ошибка поиска:', error)
        return []
    }
}

async function filterByCategory(categoryName) {
    try {
        const { data, error } = await supabase
            .from(TABLES.PRODUCTS)
            .select('*')
            .eq('category_name', categoryName)
        
        if (error) throw error
        return data
        
    } catch (error) {
        console.error('Ошибка фильтрации:', error)
        return []
    }
}

// ============================================
# ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

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
    loader.innerHTML = '<div class="loader-spinner"></div>'
    loader.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(255,255,255,0.9);z-index:9999;display:flex;justify-content:center;align-items:center'
    document.body.appendChild(loader)
}

function hideLoader() {
    const loader = document.getElementById('global-loader')
    if (loader) loader.remove()
}

function showErrorMessage(message) {
    const container = document.getElementById('reviewsGrid')
    if (container) {
        container.innerHTML = `<div class="error-message">⚠️ Ошибка: ${message}<br>Проверьте подключение к Supabase</div>`
    }
}

function setupSearch() {
    const searchInput = document.querySelector('.search-bar input')
    if (searchInput) {
        searchInput.addEventListener('input', async (e) => {
            const query = e.target.value.toLowerCase()
            if (query.length > 2) {
                const results = await searchProducts(query)
                console.log('Результаты поиска:', results)
            }
        })
    }
}

// ============================================
# ИНИЦИАЛИЗАЦИЯ
// ============================================

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
