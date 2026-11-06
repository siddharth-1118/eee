const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'supabase.json');

function loadCredentials() {
  let url = process.env.SUPABASE_URL || '';
  let key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || '';

  if ((!url || !key) && fs.existsSync(CONFIG_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
      url = url || data.supabaseUrl || '';
      key = key || data.supabaseKey || '';
    } catch (e) {
      console.warn('Could not read supabase.json:', e.message);
    }
  }

  return { url, key };
}

const { url, key } = loadCredentials();
let supabaseClient = null;

if (url && key && url.startsWith('http')) {
  try {
    supabaseClient = createClient(url, key);
    console.log('[Supabase] Initialized client successfully with endpoint:', url);
  } catch (err) {
    console.error('[Supabase] Failed to initialize client:', err.message);
  }
}

function updateCredentials(newUrl, newKey) {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({
      supabaseUrl: newUrl,
      supabaseKey: newKey,
      updated_at: new Date().toISOString()
    }, null, 2), 'utf-8');
    
    if (newUrl && newKey && newUrl.startsWith('http')) {
      supabaseClient = createClient(newUrl, newKey);
      return { success: true, message: 'Supabase credentials saved and client initialized' };
    }
    return { success: true, message: 'Credentials saved' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = {
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
