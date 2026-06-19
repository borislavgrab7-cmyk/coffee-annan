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

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Nisu pronađene Supabase varijable u .env datoteci!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mapiranje artikala na prelijepe profesionalne slike sa Unsplash-a
const getUnsplashUrl = (item) => {
  const name = item.name.toLowerCase();
  const category = item.category;

  if (category === "Brunch meni") {
    if (name.includes("bagel") || name.includes("losos")) {
      return "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80"; // salmon bagel
    }
    if (name.includes("tacos") || name.includes("takosi")) {
      return "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80"; // tacos
    }
    if (name.includes("benedikt") || name.includes("benedict") || name.includes("jaja")) {
      return "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=600&q=80"; // eggs benedict
    }
    if (name.includes("tartar") || name.includes("tuna")) {
      return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"; // tuna tartare
    }
    if (name.includes("protein") || name.includes("doručak")) {
      return "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80"; // breakfast plate
    }
    return "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80";
  }

  if (category === "Hladna predjela") {
    if (name.includes("bruskete") || name.includes("brusketi")) {
      return "https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=600&q=80"; // bruschetta
    }
    if (name.includes("humus") || name.includes("hummus")) {
      return "https://images.unsplash.com/photo-1577906096429-f73df2c3e273?auto=format&fit=crop&w=600&q=80"; // hummus
    }
    if (name.includes("karpaćo") || name.includes("carpaccio")) {
      return "https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?auto=format&fit=crop&w=600&q=80"; // carpaccio
    }
    if (name.includes("plata") || name.includes("daska")) {
      return "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80"; // meat plate
    }
    if (name.includes("rolnice")) {
      return "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"; // rolls
    }
    return "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80";
  }

  if (category === "Topla međujela") {
    if (name.includes("rižoto") || name.includes("rizoto")) {
      return "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=600&q=80"; // risotto
    }
    if (name.includes("torteline") || name.includes("pasta") || name.includes("sicilijana") || name.includes("marseljeza") || name.includes("rezanci")) {
      return "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"; // pasta
    }
    return "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80";
  }

  if (category === "Supe i čorbe") {
    return "https://images.unsplash.com/photo-1547592165-e1d17fed6006?auto=format&fit=crop&w=600&q=80"; // soup
  }

  if (category === "Pice") {
    return "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"; // pizza
  }

  if (category.includes("Riba")) {
    if (name.includes("hobotnica")) {
      return "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80"; // octopus
    }
    if (name.includes("lignje")) {
      return "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80"; // squid
    }
    return "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80"; // salmon/fish
  }

  if (category.includes("Piletina") || category.includes("Ćuretina")) {
    return "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80"; // chicken/turkey
  }

  if (category.includes("Svinjetina") || category.includes("Jagnjetina") || category.includes("Govedina")) {
    return "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"; // meat / steak
  }

  if (category.includes("Burgeri")) {
    return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"; // burger
  }

  if (category === "Obrok salate" || category === "Salate i dodaci") {
    return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80"; // salad
  }

  if (category === "Deserti") {
    if (name.includes("sufle")) {
      return "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80"; // chocolate souffle
    }
    return "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80"; // dessert cake
  }

  if (category === "Topli napici") {
    if (name.includes("cappuccino")) {
      return "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80"; // cappuccino
    }
    if (name.includes("čokolada")) {
      return "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80"; // topla čokolada
    }
    if (name.includes("čaj")) {
      return "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80"; // čaj
    }
    return "https://images.unsplash.com/photo-151097252790b-af4f42d91dfa?auto=format&fit=crop&w=600&q=80"; // espresso / kafa
  }

  if (category === "Vode") {
    if (name.includes("exotic")) {
      return "https://images.unsplash.com/photo-1559839914-17aae19cec71?auto=format&fit=crop&w=600&q=80"; // egzotična voda
    }
    return "https://images.unsplash.com/photo-1608885898957-a599fb1b14b4?auto=format&fit=crop&w=600&q=80"; // voda sa mjehurićima
  }

  if (category === "Cijeđeni sokovi") {
    if (name.includes("limunada")) {
      return "https://images.unsplash.com/photo-1534706936160-d5ee67737249?auto=format&fit=crop&w=600&q=80"; // limunada
    }
    return "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80"; // narandža
  }

  if (category === "Sokići") {
    if (name.includes("cola")) {
      return "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80"; // koka kola
    }
    if (name.includes("cedevita") || name.includes("fanta") || name.includes("orangina")) {
      return "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80"; // narandžasti sok
    }
    if (name.includes("tonik") || name.includes("tonic") || name.includes("bitter") || name.includes("schweppes")) {
      return "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80"; // tonik
    }
    if (name.includes("somersby") || name.includes("cider")) {
      return "https://images.unsplash.com/photo-1568901839119-631418a381fb?auto=format&fit=crop&w=600&q=80"; // cider
    }
    if (name.includes("red bull") || name.includes("energija")) {
      return "https://images.unsplash.com/photo-1622543953490-0b70039a7b7c?auto=format&fit=crop&w=600&q=80"; // energetski napitak
    }
    return "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80"; // ostali sokići (Vitaminka)
  }

  if (category === "Flaširano pivo") {
    if (name.includes("tamno") || name.includes("dunkel")) {
      return "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?auto=format&fit=crop&w=600&q=80"; // tamno pivo
    }
    return "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=600&q=80"; // svetlo pivo
  }

  if (category === "Točeno pivo") {
    return "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?auto=format&fit=crop&w=600&q=80"; // točeno pivo
  }

  if (category === "Vina") {
    if (name.includes("chardonnay") || name.includes("tamjanika") || name.includes("smederevka")) {
      return "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80"; // belo vino
    }
    return "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80"; // crno vino
  }

  if (category === "Žestice") {
    if (name.includes("gin") || name.includes("džin")) {
      return "https://images.unsplash.com/photo-1547592165-e1d17fed6006?auto=format&fit=crop&w=600&q=80"; // džin
    }
    if (name.includes("rakija") || name.includes("šljiva") || name.includes("dunja") || name.includes("viljamovka") || name.includes("travarica") || name.includes("ljepotica")) {
      return "https://images.unsplash.com/photo-1569701813229-3309a60112be?auto=format&fit=crop&w=600&q=80"; // rakija / čašica
    }
    if (name.includes("tequila") || name.includes("vodka") || name.includes("absolut")) {
      return "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80"; // tekila/vodka
    }
    return "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=600&q=80"; // viski
  }

  if (category === "Likeri") {
    if (name.includes("jager") || name.includes("biljni") || name.includes("gorki list") || name.includes("pelinkovac")) {
      return "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80"; // biljni liker
    }
    return "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=600&q=80"; // slatki liker
  }

  return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"; // default
};

async function processImages() {
  console.log("=== POČETAK PREUZIMANJA I UVOZA SLIKA MENIJA ===");

  // 1. Dobijanje svih artikala iz baze
  const { data: items, error: fetchError } = await supabase
    .from('menu_items')
    .select('id, name, category');

  if (fetchError) {
    console.error("Greška pri čitanju artikala iz baze:", fetchError.message);
    return;
  }

  console.log(`Učitano ${items.length} artikala iz baze.`);

  // 2. Prolazak kroz svaki artikal
  let successCount = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const targetUrl = getUnsplashUrl(item);
    const progress = `[${i + 1}/${items.length}]`;

    console.log(`${progress} Preuzimanje slike za artikal "${item.name}"...`);

    try {
      // Preuzimanje slike
      const response = await fetch(targetUrl);
      if (!response.ok) {
        throw new Error(`Neuspešan download, status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Naziv fajla za skladištenje
      const cleanName = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const fileName = `item-${item.id}-${cleanName}.jpg`;

      // Upload u Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(fileName, buffer, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Upload greška: ${uploadError.message}`);
      }

      // Dobijanje javnog linka slike
      const { data: { publicUrl } } = supabase.storage
        .from('menu-images')
        .getPublicUrl(fileName);

      // Ažuriranje stavke u bazi
      const { error: updateError } = await supabase
        .from('menu_items')
        .update({ image_url: publicUrl })
        .eq('id', item.id);

      if (updateError) {
        throw new Error(`Baza greška: ${updateError.message}`);
      }

      console.log(` -> Uspešno povezana slika za "${item.name}"!`);
      successCount++;
    } catch (err) {
      console.error(` ❌ Greška kod "${item.name}":`, err.message);
    }
  }

  console.log(`\n=== UVOZ SLIKA ZAVRŠEN! Uspešno povezano: ${successCount}/${items.length} ===`);
}

processImages();
