import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const SUPABASE_URL = 'https://noeuoedzwheddulfmhlm.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vZXVvZWR6d2hlZGR1bGZtaGxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MjM2ODQsImV4cCI6MjA5Mjk5OTY4NH0.PtKuIV_XczmAD0F_lINokWyRZXzPyKg_QZh31uOZpqU';

const ExpoSecureStoreAdapter = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};

const WebStorageAdapter = {
  getItem: (key) => {
    if (typeof window !== 'undefined') {
      return Promise.resolve(window.localStorage.getItem(key));
    }
    return Promise.resolve(null);
  },
  setItem: (key, value) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
    return Promise.resolve();
  },
  removeItem: (key) => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
    return Promise.resolve();
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    storage: Platform.OS === 'web' ? WebStorageAdapter : ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});