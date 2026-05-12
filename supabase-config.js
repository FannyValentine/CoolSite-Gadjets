// supabase-config.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Замените на свои данные из настроек Supabase!
const SUPABASE_URL = 'https://blnoyjgidguwtpnalfsn.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_cMYHh5RHnbPD6bpWYx3KRA_TLVLS1ME'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Константы для таблиц
export const TABLES = {
    PRODUCTS: 'products',
    CATEGORIES: 'categories',
    REVIEWS: 'reviews'
}
