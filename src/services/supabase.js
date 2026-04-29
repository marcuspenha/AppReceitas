import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const SUPABASE_URL  = 'https://noeuoedzwheddulfmhlm.supabase.co';   // substitua
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vZXVvZWR6d2hlZGR1bGZtaGxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MjM2ODQsImV4cCI6MjA5Mjk5OTY4NH0.PtKuIV_XczmAD0F_lINokWyRZXzPyKg_QZh31uOZpqU'; // substitua

// Adaptador de storage seguro para React Native
const ExpoSecureStoreAdapter = {
  getItem:    (key)        => SecureStore.getItemAsync(key),
  setItem:    (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key)        => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    storage:          ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession:   true,
    detectSessionInUrl: false,
  },
});