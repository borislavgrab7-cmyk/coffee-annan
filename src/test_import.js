import { supabase } from './supabaseClient.js';

const menuData = {
  "Topli napici": [
    { name: "Espresso", price: 2.50 },
    { name: "Cappuccino Espresso", price: 3.00 },
    { name: "Cappuccino sa biljnim mlijekom", price: 3.50 },
    { name: "Nes classic", price: 3.00 },
    { name: "Nes classic sa biljnim mlijekom", price: 3.50 },
    { name: "Nes Irish", price: 3.50 },
    { name: "Nes Vanilija", price: 3.50 },
    { name: "Jacobs Milka", price: 3.50 },
    { name: "Čajevi PRANA", price: 2.50 },
    { name: "Čokolada", price: 4.00 }
  ],
  "Vode": [
    { name: "Negazirana voda", price: 3.00 },
    { name: "Mineralna voda", price: 2.50 },
    { name: "Exotic (limeta, kruška, dunja, narandža)", price: 3.00 }
  ],
  "Cijeđeni sokovi": [
    { name: "Limunada 1 kom", price: 3.00 },
    { name: "Narandža 2 kom", price: 5.00 }
  ],
  "Sokići": [
    { name: "Cedevita", price: 3.00 },
    { name: "Coca Cola", price: 3.50 },
    { name: "Coca Cola Zero", price: 3.50 },
    { name: "Fanta", price: 3.50 },
    { name: "Sprite", price: 3.50 },
    { name: "Schweppes Tonic", price: 3.50 },
    { name: "Schweppes Bitter Lemon", price: 3.50 },
    { name: "Cockta", price: 3.50 },
    { name: "Narandža Vitaminka", price: 3.50 },
    { name: "Borovnica Vitaminka", price: 3.50 },
    { name: "Višnja Vitaminka", price: 3.50 },
    { name: "Jabuka Vitaminka", price: 3.50 },
    { name: "Jagoda Vitaminka", price: 3.50 },
    { name: "Breskva Vitaminka", price: 3.50 },
    { name: "Ledeni čaj breskva/brusnica", price: 3.00 },
    { name: "Orangina", price: 4.00 },
    { name: "Cider Somersby", price: 4.00 },
    { name: "Energija Red Bull", price: 6.00 }
  ],
  "Flaširano pivo": [
    { name: "1664 Blanc 0,33", price: 3.00 },
    { name: "Tuborg 0,33", price: 3.00 },
    { name: "Tuborg 0,50", price: 3.00 },
    { name: "Tuborg Bezalkoh. 0,33", price: 3.50 },
    { name: "Carlsberg 0,33", price: 3.50 },
    { name: "Lav Premium 0,33", price: 3.00 },
    { name: "Pan Zlatni 0,50", price: 3.00 },
    { name: "Budweiser Svijetlo 0,33", price: 4.00 },
    { name: "Budweiser Tamno 0,33", price: 4.00 },
    { name: "Erdinger Weissbier 0,50", price: 6.00 },
    { name: "Erdinger Dunkel 0,50", price: 6.00 },
    { name: "Erdinger Bezalkoh. 0,33", price: 4.50 },
    { name: "Nektar 0,33", price: 3.00 },
    { name: "Nektar 0,50", price: 3.00 },
    { name: "Estrella 0,66", price: 7.00 },
    { name: "Estrella 0,33", price: 4.00 },
    { name: "Karlovačko Tamno 0,50", price: 4.00 },
    { name: "Zaječarsko 0,50", price: 3.00 },
    { name: "Gorštak Kraft 0,33", price: 6.00 }
  ],
  "Točeno pivo": [
    { name: "1664 Blanc 0,33", price: 3.00 },
    { name: "1664 Blanc 0,50", price: 4.50 },
    { name: "Tuborg 0,30", price: 2.50 },
    { name: "Tuborg 0,50", price: 3.50 }
  ],
  "Vina": [
    { name: "Jungić Tamjanika 0,10", price: 3.00 },
    { name: "Dalmati Chardonnay 0,10", price: 3.00 },
    { name: "Dalmati Merlo 0,10", price: 3.00 },
    { name: "Smederevka Tikveš 0,20", price: 4.00 },
    { name: "Kratošija Tikveš 0,20", price: 4.00 },
    { name: "Crveni Brijeg 0,75l", price: 40.00 },
    { name: "Dalmati 0,75", price: 40.00 },
    { name: "Tikveš 0,75", price: 25.00 },
    { name: "Buteljica 0,187", price: 7.00 }
  ],
  "Žestice": [
    { name: "Mećava Šljiva 0,03", price: 3.00 },
    { name: "Mećava Jabuka 0,03", price: 3.00 },
    { name: "Mećava Viljamovka 0,03", price: 3.50 },
    { name: "Mećava Travarica 0,03", price: 3.50 },
    { name: "Mećava Dunja 0,03", price: 4.00 },
    { name: "Djedova Rakija 0,03", price: 4.00 },
    { name: "Krajiška Ljepotica 0,03", price: 4.00 },
    { name: "Gin Beefeater 0,03", price: 3.00 },
    { name: "Gin Bulldog 0,03", price: 3.50 },
    { name: "Gin Hendricks 0,03", price: 4.50 },
    { name: "Gin Engineer 0,03", price: 4.50 },
    { name: "Red Label J.W. 0,03", price: 4.00 },
    { name: "Jack Daniels 0,03", price: 4.00 },
    { name: "Jameson 0,03", price: 3.50 },
    { name: "Jameson Black 0,03", price: 5.00 },
    { name: "Vodka Absolut 0,03", price: 3.00 },
    { name: "Tequila Olmeca 0,03", price: 3.00 },
    { name: "Vinjak Rubin 0,03", price: 2.50 }
  ],
  "Likeri": [
    { name: "Gorki List 0,03", price: 2.50 },
    { name: "Jagermeister 0,03", price: 3.00 },
    { name: "Baba Višnja 0,03", price: 3.00 },
    { name: "Meduška 0,03", price: 3.00 },
    { name: "Pelinkovac 0,03", price: 2.50 },
    { name: "Shankys Weep", price: 3.00 }
  ]
};

export async function runSeeding() {
  console.log("=== POČETAK UVOZA STAVKI MENIJA ===");
  
  for (const [category, items] of Object.entries(menuData)) {
    const bulkInsertData = items.map((item, index) => ({
      name: item.name,
      description: "",
      price: item.price,
      category: category,
      badge: null,
      sort_order: index + 1,
      is_available: true
    }));

    console.log(`Uvoz kategorije "${category}" (${bulkInsertData.length} stavki)...`);
    
    const { data, error } = await supabase
      .from('menu_items')
      .insert(bulkInsertData);

    if (error) {
      console.error(`Greška pri uvozu kategorije "${category}":`, error.message);
    } else {
      console.log(`Kategorija "${category}" uspešno uvezena!`);
    }
  }

  console.log("=== UVOZ ZAVRŠEN ===");
}

// Pokrećemo uvoz automatski kada se skripta izvrši/uveze
runSeeding();
