import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Pronalaženje .env datoteke i čitanje Supabase kredencijala
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnvVar = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const getFilenameFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split('/menu-images/');
  if (parts.length > 1) {
    // Može sadržati query parametre, uzimamo samo naziv fajla
    return parts[1].split('?')[0];
  }
  return null;
};

async function cleanupStorage() {
  console.log("=== ČIŠĆENJE NEPOTREBNIH SLIKA IZ STORAGE-A ===");

  // 1. Dobijanje svih aktivnih slika iz menu_items tabele
  const { data: items, error: itemsError } = await supabase
    .from('menu_items')
    .select('image_url');

  if (itemsError) {
    console.error("❌ Greška pri učitavanju stavki menija:", itemsError.message);
    return;
  }

  // 2. Dobijanje logotipa iz cafe_info tabele
  const { data: cafeInfo, error: cafeError } = await supabase
    .from('cafe_info')
    .select('logo_url')
    .eq('id', 1)
    .maybeSingle();

  if (cafeError) {
    console.error("❌ Greška pri učitavanju informacija o kafiću:", cafeError.message);
    return;
  }

  // 3. Sakupljanje svih aktivnih naziva fajlova
  const activeFiles = new Set();
  
  if (cafeInfo && cafeInfo.logo_url) {
    const logoFile = getFilenameFromUrl(cafeInfo.logo_url);
    if (logoFile) activeFiles.add(logoFile);
  }

  items.forEach(item => {
    if (item.image_url) {
      const filename = getFilenameFromUrl(item.image_url);
      if (filename) activeFiles.add(filename);
    }
  });

  console.log(`Pronađeno aktivnih slika u bazi podataka: ${activeFiles.size}`);

  // 4. Izlistavanje svih fajlova u storage-u
  const { data: storageFiles, error: storageError } = await supabase.storage
    .from('menu-images')
    .list('', { limit: 1000 }); // Učitaj do 1000 slika

  if (storageError) {
    console.error("❌ Greška pri listanju fajlova u Storage-u:", storageError.message);
    return;
  }

  console.log(`Ukupno fajlova u 'menu-images' storage-u: ${storageFiles.length}`);

  // 5. Identifikovanje neaktivnih fajlova
  const filesToDelete = [];
  storageFiles.forEach(file => {
    // Preskačemo foldere ili sistemske placeholder fajlove ako ih ima
    if (file.id === undefined || file.name === '.emptyFolderPlaceholder') return;

    if (!activeFiles.has(file.name)) {
      filesToDelete.push(file.name);
    }
  });

  if (filesToDelete.length === 0) {
    console.log("✅ Nema nepotrebnih slika u Storage-u. Sve slike se trenutno koriste!");
    return;
  }

  console.log(`\nPronađeno neaktivnih slika za brisanje: ${filesToDelete.length}`);
  console.log("Spisak slika koje se brišu:", filesToDelete);

  // 6. Brisanje neaktivnih fajlova
  console.log("\nPokrećem brisanje...");
  const { data: deleteData, error: deleteError } = await supabase.storage
    .from('menu-images')
    .remove(filesToDelete);

  if (deleteError) {
    console.error("❌ Greška tokom brisanja:", deleteError.message);
  } else {
    console.log(`✅ Uspješno obrisano ${filesToDelete.length} neaktivnih slika iz Storage-a!`);
  }
}

cleanupStorage();
