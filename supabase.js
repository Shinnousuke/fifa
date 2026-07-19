const SUPABASE_URL = "https://owbwjqagyvdrrvbwizmm.supabase.co";

const SUPABASE_KEY = "sb_publishable_MzfJYmzwGAQDIPp9907nQA_iG03lZzF";

const client = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Supabase Connected:", client);