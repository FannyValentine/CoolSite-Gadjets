// supabase-config.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// ВАШИ ДАННЫЕ (уже вставлены)
const SUPABASE_URL = 'https://blnoyjgidguwtpnalfsn.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_cMYHh5RHnbPD6bpWYx3KRA_TLVLS1ME'

// Создаём клиент Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Имена таблиц
export const TABLES = {
    PRODUCTS: 'products',
    CATEGORIES: 'categories',
    REVIEWS: 'reviews'
}

// Функция для добавления товара
export async function addProduct(productData) {
    try {
        const newProduct = {
            name: productData.name,
            slug: productData.name.toLowerCase().replace(/[^a-zа-яё0-9]+/g, '-') + '-' + Date.now(),
            category_name: productData.category_name,
            price: productData.price,
            old_price: productData.old_price || null,
            rating: 4.5,
            is_new: productData.is_new || false,
            is_popular: productData.is_popular || false,
            stock: 10,
            image_url: productData.image_url,
            gallery: [productData.image_url],
            description: productData.description || '',
            is_custom: true,
            created_at: new Date().toISOString()
        }
        
        console.log('Отправляемые данные:', newProduct)
        
        const { data, error } = await supabase
            .from(TABLES.PRODUCTS)
            .insert([newProduct])
            .select()
        
        if (error) {
            console.error('Ошибка Supabase:', error)
            throw error
        }
        
        console.log('Товар успешно добавлен:', data)
        return { success: true, data: data[0] }
    } catch (error) {
        console.error('Ошибка добавления товара:', error)
        return { success: false, error: error.message }
    }
}

// Функция для получения всех товаров
export async function getAllProducts() {
    try {
        const { data, error } = await supabase
            .from(TABLES.PRODUCTS)
            .select('*')
            .order('created_at', { ascending: false })
        
        if (error) throw error
        return { success: true, data: data }
    } catch (error) {
        console.error('Ошибка получения товаров:', error)
        return { success: false, error: error.message, data: [] }
    }
}

// Функция для удаления товара
export async function deleteProduct(productId) {
    try {
        const { error } = await supabase
            .from(TABLES.PRODUCTS)
            .delete()
            .eq('id', productId)
        
        if (error) throw error
        return { success: true }
    } catch (error) {
        console.error('Ошибка удаления:', error)
        return { success: false, error: error.message }
    }
}
