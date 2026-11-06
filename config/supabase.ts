import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_PATH = path.join(__dirname, 'supabase.json');

function loadCredentials() {
  let url = process.env.SUPABASE_URL || '';
  let key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || '';

  if ((!url || !key) && fs.existsSync(CONFIG_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
      url = url || data.supabaseUrl || '';
      key = key || data.supabaseKey || '';
    } catch (e: any) {
      console.warn('Could not read supabase.json:', e.message);
    }
  }

  return { url, key };
}

const { url, key } = loadCredentials();
let supabaseClient: SupabaseClient | null = null;

if (url && key && url.startsWith('http')) {
  try {
    supabaseClient = createClient(url, key);
    console.log('[Supabase] Initialized client successfully with endpoint:', url);
  } catch (err: any) {
    console.error('[Supabase] Failed to initialize client:', err.message);
  }
}

export function updateCredentials(newUrl: string, newKey: string) {
  try {
    fs.writeFileSync(
      CONFIG_PATH,
      JSON.stringify(
        {
          supabaseUrl: newUrl,
          supabaseKey: newKey,
          updated_at: new Date().toISOString()
        },
        null,
        2
      ),
      'utf-8'
    );

    if (newUrl && newKey && newUrl.startsWith('http')) {
      supabaseClient = createClient(newUrl, newKey);
      return { success: true, message: 'Supabase credentials saved and client initialized' };
    }
    return { success: true, message: 'Credentials saved' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export const supabaseManager = {
  get supabase() {
    return supabaseClient;
  },
  isConfigured: () => Boolean(supabaseClient),
  updateCredentials,
  getEndpoint: () => {
    const creds = loadCredentials();
    return creds.url ? creds.url : 'Not connected yet';
  }
};

export default supabaseManager;
