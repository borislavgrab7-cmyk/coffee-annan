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

async function checkStorage() {
  console.log("=== PROVJERA SUPABASE STORAGE BUCKETA ===");

  // 1. Izlistavanje svih bucket-a
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    console.error("Greška pri listanju bucket-a:", listError.message);
    console.log("\nSavjet: Provjerite da li su vaši API ključevi u .env ispravni i da li imate pristup internetu.");
    return;
  }

  console.log("Pronađeni buckets u Supabase-u:", buckets.map(b => b.name));

  const bucketExists = buckets.some(b => b.name === 'menu-images');

  if (bucketExists) {
    console.log("✅ Bucket 'menu-images' postoji!");
    
    // Provjera da li je javan
    const menuBucket = buckets.find(b => b.name === 'menu-images');
    console.log(`Podešavanja bucketa: Javan = ${menuBucket.public}`);

    // Probaćemo uraditi probni upload malog tekstualnog fajla
    console.log("\nPokušavam probni upload u 'menu-images'...");
    const testFileName = `test-connection-${Date.now()}.txt`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(testFileName, Buffer.from("test"), {
        contentType: 'text/plain'
      });

    if (uploadError) {
      console.error("❌ Probni upload nije uspio:", uploadError.message);
      console.log("\nRazlog greške:");
      console.log("- Ako piše 'Row-level security policy violated' ili slično, to znači da nemate ispravne RLS polise za storage u Supabase.");
      console.log("- Ako piše '404', možda je bucket pogrešno konfigurisan.");
    } else {
      console.log("✅ Probni upload uspješan!");
      console.log("Putanja fajla:", uploadData.path);
      
      // Brišemo probni fajl
      await supabase.storage.from('menu-images').remove([testFileName]);
      console.log("Obrisan probni fajl.");
    }

  } else {
    console.log("❌ Bucket 'menu-images' NE POSTOJI!");
    console.log("\nPokušavam da automatski kreiram bucket...");
    
    // Napomena: Anonimni ključ obično ne može kreirati bucket, ali probaćemo
    const { data: createData, error: createError } = await supabase.storage.createBucket('menu-images', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/*']
    });

    if (createError) {
      console.log("❌ Automatsko kreiranje nije uspjelo (što je očekivano za anonimni ključ):", createError.message);
      console.log("\nKako to da rešite manualno:");
      console.log("1. Otvorite vaš Supabase Dashboard: https://supabase.com");
      console.log("2. Idite na sekciju 'Storage' sa lijeve strane.");
      console.log("3. Kliknite na 'New Bucket'.");
      console.log("4. Nazovite ga tačno: menu-images");
      console.log("5. Označite opciju 'Public' (ovo je obavezno kako bi slike bile vidljive svima!).");
      console.log("6. Sačuvajte.");
      console.log("\nNakon toga, pokrenite RLS polise iz datoteke 'supabase_setup.sql' (sekcija 5) u SQL Editoru u Supabase.");
    } else {
      console.log("✅ Uspješno kreiran javni bucket 'menu-images'!");
    }
  }
}

checkStorage();
