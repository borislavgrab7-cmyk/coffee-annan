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

const menuData = {
  "Brunch meni": [
    { name: "Dimljeni losos bagel", nameEn: "Smoked salmon bagel", price: 19.00, desc: "Dimljeni losos bagel sa krem sirom", descEn: "Smoked salmon bagel with cream cheese", badge: "recommended", orders: 48 },
    { name: "Takosi", nameEn: "Tacos", price: 17.00, desc: "Pikantni takosi sa mljevenim mesom i salsom", descEn: "Spicy tacos with minced meat and salsa" },
    { name: "Benedikt jaja ala Mala Stanica", nameEn: "Eggs Benedict ala Mala Stanica", price: 15.00, desc: "Poširana jaja sa holandez sosom na tostu", descEn: "Poated eggs with hollandaise sauce on toast", badge: "popular", orders: 120 },
    { name: "Tuna tartar", nameEn: "Tuna tartare", price: 25.00, desc: "Svježi tuna tartar sa avokadom i začinima", descEn: "Fresh tuna tartare with avocado and spices" },
    { name: "Protein doručak", nameEn: "Protein breakfast", price: 14.00, desc: "Visokoproteinski doručak sa jajima i šunkom", descEn: "High-protein breakfast plate with eggs and ham" }
  ],
  "Hladna predjela": [
    { name: "Bruskete \"Mala Stanica\" (4 komada)", nameEn: "Bruschetta \"Mala Stanica\" (4 pieces)", price: 15.00, desc: "Sastojci: pršut, kulen, kozji sir, gorgonzola, paradajz", descEn: "Ingredients: prosciutto, kulen (spicy salami), goat cheese, gorgonzola, tomato", badge: "recommended", orders: 64 },
    { name: "Bruskete sa paradajzom", nameEn: "Tomato bruschetta", price: 13.00, desc: "Bruskete sa paradajzom, mocarelom, bosiljkom i maslinovim uljem (4 komada)", descEn: "Bruschetta with tomatoes, mozzarella, basil and olive oil (4 pieces)" },
    { name: "Bruskete sa vrganjima", nameEn: "Mushroom bruschetta", price: 17.00, desc: "Bruskete sa vrganjima, pinjolama i kozjim sirom (4 komada)", descEn: "Bruschetta with porcini mushrooms, pine nuts and goat cheese (4 pieces)" },
    { name: "Pikantni humus sa hrskavim krostinima", nameEn: "Spicy hummus with crispy crostini", price: 14.00, desc: "Pikantni humus sa hrskavim krostinima", descEn: "Spicy chickpea hummus with crispy crostini" },
    { name: "Karpaćo od dimljenog bifteka (100 gr)", nameEn: "Smoked beef carpaccio (100 g)", price: 22.00, desc: "Sastojci: marinirani dimljeni biftek iz maslinovog ulja, rukola, listići parmezana", descEn: "Ingredients: marinated smoked beef tenderloin in olive oil, arugula, parmesan shavings" },
    { name: "Karpaćo od dimljenog lososa (100 gr)", nameEn: "Smoked salmon carpaccio (100 g)", price: 24.00, desc: "Sastojci: dimljeni losos, rukola, namaz od maskarpone sira", descEn: "Ingredients: smoked salmon, arugula, mascarpone cheese spread" },
    { name: "Karpaćo od tune (100 gr)", nameEn: "Tuna carpaccio (100 g)", price: 22.00, desc: "Sastojci: emulzija od maslinovog ulja, himalajske soli i majčine dušice", descEn: "Ingredients: olive oil, Himalayan salt and thyme emulsion" },
    { name: "Plata Mala Stanica", nameEn: "Platter Mala Stanica", price: 33.00, desc: "Sastojci: hercegovački pršut, goveđa peka, kozji sir, livanjski sir, vlašićki sir, paradajz", descEn: "Ingredients: Herzegovinian prosciutto, smoked beef peka, goat cheese, Livanjski cheese, Vlasićki cheese, tomato" },
    { name: "Velika daska Mala Stanica", nameEn: "Large board Mala Stanica", price: 44.00, desc: "Sastojci: hercegovački pršut, goveđa peka, kozji sir, livanjski sir, vlašićki sir, paradajz", descEn: "Ingredients: Herzegovinian prosciutto, smoked beef peka, goat cheese, Livanjski cheese, Vlasićki cheese, tomato" },
    { name: "Hrskave rolnice sa biftekom", nameEn: "Crispy beef rolls", price: 23.00, desc: "Hrskave rolnice sa biftekom i puterom od bundevinih sjemenki (4 komada)", descEn: "Crispy rolls with beef and pumpkin seed butter (4 pieces)" }
  ],
  "Topla međujela": [
    { name: "Rižoto sa vrganjima", nameEn: "Porcini mushroom risotto", price: 23.00, desc: "Sastojci: parmezan, mladi luk", descEn: "Ingredients: parmesan, spring onion" },
    { name: "Black & White Rižoto", nameEn: "Black & White risotto", price: 27.00, desc: "Sastojci: rižoto sa lignjama (150 gr), hobotnicom (200 gr) i krem sirom", descEn: "Ingredients: risotto with squid (150 g), octopus (200 g) and cream cheese" },
    { name: "Rižoto sa gamborima i piletinom", nameEn: "Shrimp and chicken risotto", price: 25.00, desc: "Rižoto sa gamborima, kozicama i piletinom", descEn: "Risotto with shrimp, prawns and chicken" },
    { name: "Domaće torteline sa špinatom", nameEn: "Homemade spinach tortellini", price: 24.00, desc: "Domaće torteline punjene špinatom i gorgonzolom u sosu od lisičarki i vrganja", descEn: "Homemade tortellini filled with spinach and gorgonzola in chanterelle and porcini sauce" },
    { name: "Pasta Sicilijana", nameEn: "Pasta Siciliana", price: 23.00, desc: "Sastojci: piletina (120 gr), peperonccini, sušeni paradajz, praziluk ili mladi luk", descEn: "Ingredients: chicken (120 g), pepperoncini, sun-dried tomatoes, leek or spring onions", badge: "popular", orders: 145 },
    { name: "Pasta Marseljeza", nameEn: "Pasta Marseillaise", price: 26.00, desc: "Sastojci: gambori (200 gr), parmezan, paradajz, konjak", descEn: "Ingredients: prawns (200 g), parmesan, tomato, cognac" },
    { name: "Pasta sa gamborima i lignjama", nameEn: "Pasta with shrimp and squid", price: 26.00, desc: "Pasta sa gamborima i lignjama u domaćem paradajz sosu (gambori 150 gr, lignje 150 gr)", descEn: "Pasta with shrimp and squid in homemade tomato sauce (shrimp 150 g, squid 150 g)" },
    { name: "Pasta sa biftekom i vrganjima", nameEn: "Pasta with beef and porcini", price: 26.00, desc: "Sastojci: biftek (100 gr), sos sa vrganjima", descEn: "Ingredients: beef (100 g), porcini mushroom sauce" },
    { name: "Pasta sa piletinom i lješnikom", nameEn: "Pasta with chicken and hazelnuts", price: 23.00, desc: "Sastojci: piletina (120 gr), lješnik", descEn: "Ingredients: chicken (120 g), hazelnuts" },
    { name: "Pasta sa ćuretinom i lisičarkama", nameEn: "Pasta with turkey and chanterelles", price: 25.00, desc: "Sastojci: ćuretina, lisičarke, kajmak i tostirani orah", descEn: "Ingredients: turkey, chanterelle mushrooms, kajmak and toasted walnuts" }
  ],
  "Supe i čorbe": [
    { name: "Minestra supa sa povrćem", nameEn: "Minestra vegetable soup", price: 9.00, desc: "U cijenu uračunato domaće pecivo", descEn: "Homemade bread included in the price" },
    { name: "Pačja supa (Na upit)", nameEn: "Duck soup (On request)", price: 12.00, desc: "U cijenu uračunato domaće pecivo", descEn: "Homemade bread included in the price" },
    { name: "Riblja čorba (Na upit)", nameEn: "Fish broth (On request)", price: 11.00, desc: "U cijenu uračunato domaće pecivo", descEn: "Homemade bread included in the price" },
    { name: "Teleća čorba", nameEn: "Veal broth", price: 11.00, desc: "U cijenu uračunato domaće pecivo", descEn: "Homemade bread included in the price", badge: "recommended", orders: 72 },
    { name: "Potaž dana", nameEn: "Soup of the day", price: 10.00, desc: "U cijenu uračunato domaće pecivo", descEn: "Homemade bread included in the price" }
  ],
  "Pice": [
    { name: "Kaprićoza / Capricciosa", nameEn: "Capricciosa Pizza", price: 14.00, desc: "Pelat, sir, šunka, šampinjoni, masline", descEn: "Tomato sauce, cheese, ham, mushrooms, olives" },
    { name: "Margerita / Margherita", nameEn: "Margherita Pizza", price: 12.00, desc: "Pelat, mocarela, bosiljak, maslinovo ulje", descEn: "Tomato sauce, mozzarella, basil, olive oil" },
    { name: "Pica Mala Stanica / Pizza Mala Stanica", nameEn: "Pizza Mala Stanica", price: 18.00, desc: "Pelat, sir, hercegovački pršut, rukola, šeri paradajz, masline", descEn: "Tomato sauce, cheese, Herzegovinian prosciutto, arugula, cherry tomato, olives", badge: "recommended", orders: 98 },
    { name: "Kvatro Formadži / Quattro Formaggi", nameEn: "Quattro Formaggi Pizza", price: 16.00, desc: "Pelat, mocarela, gorgonzola, kozji sir, parmezan", descEn: "Tomato sauce, mozzarella, gorgonzola, goat cheese, parmesan" },
    { name: "Vegetarijana / Vegetariana", nameEn: "Vegetariana Pizza", price: 13.00, desc: "Pelat, sir, sezonsko povrće", descEn: "Tomato sauce, cheese, seasonal vegetables" }
  ],
  "Glavna jela - Riba": [
    { name: "Lignje sa grila u vijencu od riže (300 gr)", nameEn: "Grilled squid in rice wreath (300 g)", price: 33.00, desc: "Lignje sa grila u vijencu od riže", descEn: "Grilled squid in a wreath of rice" },
    { name: "Grilovana hobotnica (100gr) (Na upit)", nameEn: "Grilled octopus (100g) (On request)", price: 21.00, desc: "Grilovana hobotnica na palenti sa tartufima (cijena po 100gr)", descEn: "Grilled octopus on polenta with truffles (price per 100g)" },
    { name: "Gratinirani stek lososa (250 gr)", nameEn: "Gratinated salmon steak (250 g)", price: 46.00, desc: "Gratinirani stek lososa u bijelom sosu od kozica, kapara i brokule", descEn: "Gratinated salmon steak in white sauce of shrimp, capers and broccoli", badge: "recommended", orders: 42 },
    { name: "Losos sa zelenom jabukom (250 gr)", nameEn: "Salmon with green apple (250 g)", price: 42.50, desc: "Losos sa zelenom jabukom i tikvicama na maslacu", descEn: "Salmon with green apple and zucchini on butter" },
    { name: "Brancin iz krušne peći (350 gr)", nameEn: "Seabass from clay oven (350 g)", price: 37.00, desc: "Brancin iz krušne peći na povrću iz wok-a i pekarskim krompirom", descEn: "Seabass from clay oven on wok vegetables and baker's potatoes" },
    { name: "Smuđ u papiru (300 gr)", nameEn: "Perch in paper (300 g)", price: 36.00, desc: "Smuđ u papiru sa pekarskim krompirom u sosu od svježeg kopra", descEn: "Perch in paper with baker's potatoes in fresh dill sauce" },
    { name: "Tuna stek na rukoli (250 gr)", nameEn: "Tuna steak on arugula (250 g)", price: 48.00, desc: "Tuna stek na rukoli", descEn: "Tuna steak on arugula" }
  ],
  "Glavna jela - Piletina": [
    { name: "Rezanci od piletine iz woka (180 gr)", nameEn: "Wok chicken strips (180 g)", price: 24.00, desc: "Rezanci od piletine sa hrskavo prepečenim povrćem iz woka", descEn: "Chicken strips with crispy wok vegetables" },
    { name: "Pesto piletina sa pršutom (240 gr)", nameEn: "Pesto chicken with prosciutto (240 g)", price: 28.00, desc: "Pesto piletina sa pršutom i tikvicama", descEn: "Pesto chicken with prosciutto and zucchini" },
    { name: "Kornfleks piletina (180 gr)", nameEn: "Cornflakes chicken (180 g)", price: 28.00, desc: "Kornfleks piletina sa brokolima u sosu od kikirikija", descEn: "Cornflakes chicken with broccoli in peanut sauce" },
    { name: "Provansalska piletina u vinu (240 gr)", nameEn: "Provencal chicken in wine (240 g)", price: 29.00, desc: "Sastojci: majčina dušica, šeri, luk, mladi ili pekarski krompir", descEn: "Ingredients: thyme, sherry, onion, baby or baker's potatoes" },
    { name: "Piletina u kremi od konjaka (240 gr)", nameEn: "Chicken in cognac cream (240 g)", price: 30.00, desc: "Sastojci: konjak, zeleni biber, rižoto s batatom", descEn: "Ingredients: cognac, green pepper, sweet potato risotto" },
    { name: "Piletina sa pršutom i mocarelom (350 gr)", nameEn: "Chicken with prosciutto & mozzarella (350 g)", price: 30.00, desc: "Sastojci: piletina punjena pršutom i mocarelom, grilovano povrće", descEn: "Ingredients: chicken stuffed with prosciutto and mozzarella, grilled vegetables" },
    { name: "Supreme piletina", nameEn: "Supreme chicken", price: 34.00, desc: "Sastojci: pileći file, pršut, mascarpone sir, pesto, mozzarella, aromatični pire", descEn: "Ingredients: chicken fillet, prosciutto, mascarpone cheese, pesto, mozzarella, aromatic mashed potatoes", badge: "popular", orders: 110 },
    { name: "Pileća saltimboka", nameEn: "Chicken Saltimbocca", price: 34.00, desc: "Sastojci: pileći file, pršut, mladi krompir, pesto, žalfija", descEn: "Ingredients: chicken fillet, prosciutto, baby potatoes, pesto, sage" }
  ],
  "Glavna jela - Ćuretina": [
    { name: "Ćuretina sa domaćim mlincima (200 gr)", nameEn: "Turkey with domestic mlinci (200 g)", price: 37.00, desc: "Ćuretina sa domaćim mlincima", descEn: "Turkey breast with traditional mlinci, cheese and kajmak", badge: "recommended", orders: 58 },
    { name: "Ćuretina u španskom sosu (300 gr)", nameEn: "Turkey in Spanish sauce (300 g)", price: 36.00, desc: "Ćuretina u španskom sosu sa vrganjima, kremom od tartufa. Prilog: mladi ili pekarski krompir", descEn: "Turkey in Spanish sauce with porcini, truffle cream. Side: baby or baker's potatoes" },
    { name: "Ćuretina u sosu od borovnica (240 gr)", nameEn: "Turkey in blueberry sauce (240 g)", price: 36.00, desc: "Sastojci: slanina, praziluk", descEn: "Ingredients: bacon, leek" }
  ],
  "Glavna jela - Svinjetina": [
    { name: "Karađorđeva šnicla (300 gr)", nameEn: "Karadjordjeva schnitzel (300 g)", price: 31.00, desc: "Karađorđeva šnicla sa pomfritom i tartar sosom", descEn: "Karadjordjeva schnitzel with French fries and tartar sauce", badge: "popular", orders: 160 },
    { name: "Nudle sa svinjskim fileom (250 gr)", nameEn: "Noodles with pork tenderloin (250 g)", price: 32.00, desc: "Nudle od povrća sa mariniranim svinjskim fileom", descEn: "Vegetable noodles with marinated pork tenderloin" },
    { name: "Svinjski file sa pistacijama (250 gr)", nameEn: "Pork tenderloin with pistachios (250 g)", price: 36.00, desc: "Svinjski file sa pistacijama na podlozi od batata", descEn: "Pork tenderloin with pistachios on sweet potato mash" }
  ],
  "Glavna jela - Jagnjetina": [
    { name: "Pohovani jagnjeći but (250 gr)", nameEn: "Breaded leg of lamb (250 g)", price: 36.50, desc: "Pohovani jagnjeći but u parmezanu sa puterom od lavande", descEn: "Breaded leg of lamb in parmesan with lavender butter" },
    { name: "Braciole sa mentom (300 gr) (Na upit)", nameEn: "Braciole with mint (300 g) (On request)", price: 36.00, desc: "Sastojci: knedle sa parmezanom, sos sa pistacijama", descEn: "Ingredients: dumplings with parmesan, pistachio sauce" },
    { name: "Jagnjeća bajadera", nameEn: "Lamb bajadera", price: 36.50, desc: "Jagnjeća bajadera", descEn: "Lamb bajadera (slow roasted juicy pulled lamb)" }
  ],
  "Glavna jela - Govedina": [
    { name: "Taljata od ramsteka na rukoli (300 gr)", nameEn: "Rump steak tagliata on arugula (300 g)", price: 34.50, desc: "Sastojci: listići parmezana, rukola", descEn: "Ingredients: parmesan shavings, arugula" },
    { name: "Ramstek sa začinskim biljem (300 gr)", nameEn: "Rump steak with herbs (300 g)", price: 38.00, desc: "Prilog: pire od celera", descEn: "Side: celery mash" },
    { name: "Natur biftek sa krompirom (300 gr)", nameEn: "Natur beef steak with potatoes (300 g)", price: 52.00, desc: "Natur biftek sa mladim ili pekarskim krompirom. Opcija: sos ili puter", descEn: "Beef steak with baby or baker's potatoes. Option: sauce or butter", badge: "recommended", orders: 84 },
    { name: "Biftek sa emulzijom od divljeg šipka (300 gr)", nameEn: "Beef steak with rosehip emulsion (300 g)", price: 57.00, desc: "Biftek sa emulzijom od divljeg šipka, konjaka i zelenog bibera", descEn: "Beef steak with wild rosehip, cognac and green pepper emulsion" },
    { name: "Biftek u maslinovom ulju (300 gr)", nameEn: "Beef steak in olive oil (300 g)", price: 62.00, desc: "Sastojci: majčina dušica, grilovano povrće, aceto balsamico", descEn: "Ingredients: thyme, grilled vegetables, balsamic vinegar" },
    { name: "Biftek na način kuće (300 gr)", nameEn: "Beef steak house style (300 g)", price: 58.50, desc: "Sastojci: krema od tartufa, mladi ili pekarski krompir", descEn: "Ingredients: truffle cream, baby or baker's potatoes" }
  ],
  "Burgeri": [
    { name: "Dry-Aged Burger", nameEn: "Dry-Aged Burger", price: 23.00, desc: "200 g junetine, cheddar sir, dip na bazi majoneze i kiselih krastavaca, luk, zelena salata, krompirići", descEn: "200g beef patty, cheddar cheese, mayo and pickle dip, onion, lettuce, French fries", badge: "popular", orders: 175 },
    { name: "Sunny Side Burger", nameEn: "Sunny Side Burger", price: 23.00, desc: "Hot mayo, kiseli krastavci, jaje, karamelizovani luk, panceta", descEn: "Hot mayo, pickles, egg, caramelized onion, pancetta" },
    { name: "T-Bone Steak (100g) (Na upit)", nameEn: "T-Bone Steak (100g) (On request)", price: 10.00, desc: "Cijena po 100g (100 KM / 1 kg)", descEn: "Price per 100g (100 KM / 1 kg)" },
    { name: "Rib-Eye Steak (100g) (Na upit)", nameEn: "Rib-Eye Steak (100g) (On request)", price: 10.00, desc: "Cijena po 100g (100 KM / 1 kg)", descEn: "Price per 100g (100 KM / 1 kg)" }
  ],
  "S vremena na vrijeme": [
    { name: "Glazirana teleća rebra (Na upit)", nameEn: "Glazed veal ribs (On request)", price: 45.00, desc: "Glazirana teleća rebra u sweet chilli sosu", descEn: "Glazed veal ribs in sweet chilli sauce" },
    { name: "Rolovana teletina (Na upit)", nameEn: "Rolled veal (On request)", price: 42.00, desc: "Rolovana teletina u sopstvenom sosu", descEn: "Rolled veal in its own gravy" },
    { name: "Paté od pačjeg mesa", nameEn: "Duck paté", price: 21.00, desc: "Sastojci: karamelizovani luk, krema od crvenog voća, tostirana fokača", descEn: "Ingredients: caramelized onion, red fruit cream, toasted focaccia" }
  ],
  "Trans Sibir Express": [
    { name: "Kompletan slijed / Meni paket", nameEn: "Complete menu package", price: 72.00, desc: "Humus brusketi, punjene torteline, provansalska piletina, ramstek taljata, sufle Mala Stanica", descEn: "Hummus bruschetta, stuffed spinach tortellini, Provencal chicken, rump steak tagliata, chocolate souffle" }
  ],
  "Obrok salate": [
    { name: "Salata sa lososom i feta sirom (120 gr)", nameEn: "Salmon and feta salad (120 g)", price: 24.50, desc: "Salata sa lososom, feta sirom i listićima badema", descEn: "Salad with salmon, feta cheese and almond flakes" },
    { name: "Tokio Ekspres / Tokyo Express", nameEn: "Tokyo Express Salad", price: 24.00, desc: "Sastojci: tuna (120 gr), feta sir, cvekla, rukola, sjemenke bundeve", descEn: "Ingredients: tuna (120 g), feta cheese, beetroot, arugula, pumpkin seeds" },
    { name: "Proljetna salata sa halumi sirom", nameEn: "Spring salad with halloumi", price: 14.00, desc: "Sastojci: avokado, sjemenke bundeve, mini paradajz, radič, rukola, zelena salata, maslinovo ulje, limun", descEn: "Ingredients: avocado, pumpkin seeds, cherry tomato, radicchio, arugula, lettuce, olive oil, lemon" },
    { name: "Proljetna salata sa piletinom i avokadom", nameEn: "Spring salad with chicken & avocado", price: 15.00, desc: "Sastojci: avokado, mrkva, kus kus, radič, rukola, zelena salata, maslinovo ulje, limun", descEn: "Ingredients: avocado, carrot, couscous, radicchio, arugula, lettuce, olive oil, lemon" },
    { name: "Mare E Monte", nameEn: "Mare E Monte Salad", price: 26.50, desc: "Sastojci: hobotnica (150 gr), gambori (80 gr), vrganji", descEn: "Ingredients: octopus (150 g), shrimp (80 g), porcini mushrooms" },
    { name: "Cezar salata / Caesar salad", nameEn: "Caesar salad", price: 23.50, desc: "Sastojci: piletina (120 gr), krispi slanina, dresing", descEn: "Ingredients: chicken (120 g), crispy bacon, dressing", badge: "popular", orders: 210 },
    { name: "Ljetna salata sa piletinom", nameEn: "Summer salad with chicken", price: 23.00, desc: "Sastojci: piletina (120 gr), mix zelenih salata, krastavac, paprika, šeri paradajz, vlašićki sir", descEn: "Ingredients: chicken (120 g), mixed green salads, cucumber, bell pepper, cherry tomato, Vlasićki cheese" },
    { name: "Salata sa piletinom i pistacijama", nameEn: "Chicken salad with pistachios", price: 23.00, desc: "Salata sa mariniranom piletinom u dresingu od pistacija (120 gr piletina)", descEn: "Salad with marinated chicken in pistachio dressing (120 g chicken)" },
    { name: "Salata sa ćuretinom i gorgonzolom", nameEn: "Turkey and gorgonzola salad", price: 25.00, desc: "Salata sa ćuretinom i toplom gorgonzolom (120 gr ćuretina)", descEn: "Salad with turkey and warm gorgonzola (120 g turkey)" },
    { name: "Dublin Spice", nameEn: "Dublin Spice Salad", price: 28.00, desc: "Sastojci: rezanci od bifteka (140 gr), indijski orah, pikantni dresing", descEn: "Ingredients: beef strips (140 g), cashews, spicy dressing" },
    { name: "Salata sa ramstekom i kozjim sirom", nameEn: "Rump steak and goat cheese salad", price: 27.00, desc: "Sastojci: ramstek (140 gr), zelena salata, radič, rukola, luk, šeri paradajz, mladi kozji sir, grčki jogurt", descEn: "Ingredients: rump steak (140 g), lettuce, radicchio, arugula, onion, cherry tomato, young goat cheese, Greek yogurt" },
    { name: "Vegetarijanska salata", nameEn: "Vegetarian salad", price: 20.00, desc: "Sastojci: masline, šeri paradajz, brokula, krastavac, mix zelenih salata, feta sir", descEn: "Ingredients: olives, cherry tomato, broccoli, cucumber, mixed green salads, feta cheese" }
  ],
  "Salate i dodaci": [
    { name: "Porcija domaćeg hljeba", nameEn: "Portion of homemade bread", price: 4.00, desc: "Porcija domaćeg hljeba", descEn: "Portion of warm homemade bread" },
    { name: "Rukola sa šeri paradajzom", nameEn: "Arugula with cherry tomato", price: 10.00, desc: "Rukola sa šeri paradajzom i listićima parmezana", descEn: "Arugula with cherry tomatoes and parmesan shavings" },
    { name: "Šopska / Sopska salad", nameEn: "Sopska salad", price: 7.50, desc: "Šopska salata", descEn: "Tomato, cucumber, onion, feta cheese" },
    { name: "Srpska / Serbian salad", nameEn: "Serbian salad", price: 7.50, desc: "Srpska salata", descEn: "Tomato, cucumber, hot pepper, onion" },
    { name: "Grčka / Greek salad", nameEn: "Greek salad", price: 11.00, desc: "Grčka salata", descEn: "Tomato, cucumber, red onion, olives, feta cheese, oregano" },
    { name: "Svježa sezonska", nameEn: "Fresh seasonal salad", price: 6.50, desc: "Svježa sezonska salata", descEn: "Fresh seasonal salad" },
    { name: "Zimska domaća / Turšija (Na upit)", nameEn: "Winter salad / Pickles (On request)", price: 8.50, desc: "Zimska domaća / Homemade winter salad (turšija)", descEn: "Traditional homemade winter pickles" }
  ],
  "Dječiji meni": [
    { name: "\"Neću da jedem\"", nameEn: "\"I don't want to eat\"", price: 10.00, desc: "Domaći makaroni sa sirom", descEn: "Homemade macaroni with cheese" },
    { name: "\"Nisam gladan\"", nameEn: "\"I'm not hungry\"", price: 14.00, desc: "Pohovani pileći file sa pomfritom i kečapom", descEn: "Breaded chicken fillet with French fries and ketchup" }
  ],
  "Deserti": [
    { name: "Dnevni kolači (Na upit)", nameEn: "Daily cakes (On request)", price: 9.00, desc: "Dnevni kolači na upit", descEn: "Fresh daily cakes from our pastry shop" },
    { name: "Sufle Mala Stanica", nameEn: "Soufflé Mala Stanica", price: 13.50, desc: "Sastojci: tamna čokolada, višnje, lješnik, sladoled", descEn: "Ingredients: dark chocolate, cherries, hazelnuts, ice cream", badge: "popular", orders: 190 },
    { name: "Sufle sa malinama (Na upit)", nameEn: "Soufflé with raspberries (On request)", price: 15.00, desc: "Sufle sa malinama", descEn: "Warm chocolate soufflé with raspberries" },
    { name: "Tanjir svježeg voća", nameEn: "Fresh fruit plate", price: 10.00, desc: "Tanjir svježeg voća", descEn: "Seasonal sliced fresh fruit" },
    { name: "Ručno pravljen sladoled sa prelivom", nameEn: "Handmade ice cream with topping", price: 8.00, desc: "Ručno pravljen sladoled sa prelivom", descEn: "Handmade ice cream with topping" },
    { name: "Krambl od voća sa sladoledom (Na upit)", nameEn: "Fruit crumble with ice cream (On request)", price: 11.00, desc: "Krambl od voća sa sladoledom", descEn: "Fruit crumble with a scoop of ice cream" }
  ],
  "Topli napici": [
    { name: "Espresso", nameEn: "Espresso Coffee", price: 2.50, desc: "Klasični espresso punog ukusa", descEn: "Classic full-flavored espresso", badge: "popular", orders: 450 },
    { name: "Cappuccino Espresso", nameEn: "Cappuccino Espresso", price: 3.00, desc: "Espresso sa bogatom mliječnom pjenom", descEn: "Espresso with rich milk foam", badge: "recommended", orders: 310 },
    { name: "Cappuccino sa biljnim mlijekom", nameEn: "Cappuccino with plant-based milk", price: 3.50, desc: "Cappuccino sa biljnim mlijekom po vašem izboru", descEn: "Cappuccino with plant-based milk of your choice" },
    { name: "Nes classic", nameEn: "Nescafe classic", price: 3.00, desc: "Omiljena instant kafa sa mlijekom", descEn: "Favorite instant coffee with milk" },
    { name: "Nes classic sa biljnim mlijekom", nameEn: "Nescafe with plant-based milk", price: 3.50, desc: "Instant Nes kafa sa biljnim mlijekom", descEn: "Instant Nescafe with plant-based milk" },
    { name: "Nes Irish", nameEn: "Nescafe Irish", price: 3.50, desc: "Nes kafa sa ukusom irskog krem likera", descEn: "Nescafe with Irish cream liqueur flavor" },
    { name: "Nes Vanilija", nameEn: "Nescafe Vanilla", price: 3.50, desc: "Kremasta Nes kafa sa aromom vanile", descEn: "Creamy Nescafe with vanilla aroma" },
    { name: "Jacobs Milka", nameEn: "Jacobs Milka Hot Chocolate", price: 3.50, desc: "Topli napitak sa ukusom Milka čokolade", descEn: "Hot drink with Milka chocolate flavor" },
    { name: "Čajevi PRANA", nameEn: "PRANA Herbal & Fruit teas", price: 2.50, desc: "Izbor vrhunskih biljnih i voćnih čajeva", descEn: "Selection of premium herbal and fruit teas" },
    { name: "Čokolada", nameEn: "Hot chocolate", price: 4.00, desc: "Gusta i topla čokolada za sladokusce", descEn: "Thick and warm chocolate for gourmets", badge: "popular", orders: 190 }
  ],
  "Vode": [
    { name: "Negazirana voda", nameEn: "Still water 0.75l", price: 3.00, desc: "Prirodna izvorska negazirana voda 0.75l", descEn: "Natural spring still water 0.75l" },
    { name: "Mineralna voda", nameEn: "Sparkling mineral water 0.25l", price: 2.50, desc: "Osvežavajuća gazirana mineralna voda 0.25l", descEn: "Refreshing sparkling mineral water 0.25l" },
    { name: "Exotic (limeta, kruška, dunja, narandža)", nameEn: "Exotic flavored water", price: 3.00, desc: "Aromatizovana gazirana voda sa ukusom voća", descEn: "Flavored sparkling water with fruit flavors" }
  ],
  "Cijeđeni sokovi": [
    { name: "Limunada 1 kom", nameEn: "Fresh Lemonade (1 pc)", price: 3.00, desc: "Sveže cijeđeni sok od domaćeg limuna", descEn: "Freshly squeezed domestic lemon juice", badge: "popular", orders: 230 },
    { name: "Narandža 2 kom", nameEn: "Fresh Orange Juice (2 pcs)", price: 5.00, desc: "Sveže cijeđeni sok od zrelih narandži", descEn: "Freshly squeezed juice from ripe oranges" }
  ],
  "Sokići": [
    { name: "Cedevita", nameEn: "Cedevita vitamins", price: 3.00, desc: "Instant vitaminski napitak", descEn: "Instant vitamin drink" },
    { name: "Coca Cola", nameEn: "Coca Cola 0.25l", price: 3.50, desc: "Originalni gazirani napitak 0.25l", descEn: "Original sparkling drink 0.25l" },
    { name: "Coca Cola Zero", nameEn: "Coca Cola Zero 0.25l", price: 3.50, desc: "Gazirani napitak bez šećera 0.25l", descEn: "Sugar-free sparkling drink 0.25l" },
    { name: "Fanta", nameEn: "Fanta Orange 0.25l", price: 3.50, desc: "Gazirani voćni sok od narandže 0.25l", descEn: "Sparkling fruit orange drink 0.25l" },
    { name: "Sprite", nameEn: "Sprite Lemon-Lime 0.25l", price: 3.50, desc: "Gazirani napitak sa ukusom limuna i limete 0.25l", descEn: "Sparkling lemon-lime drink 0.25l" },
    { name: "Schweppes Tonic", nameEn: "Schweppes Tonic 0.25l", price: 3.50, desc: "Gazirano gorko piće sa tonikom 0.25l", descEn: "Sparkling tonic drink 0.25l" },
    { name: "Schweppes Bitter Lemon", nameEn: "Schweppes Bitter Lemon 0.25l", price: 3.50, desc: "Gazirano piće sa ukusom gorkog limuna 0.25l", descEn: "Sparkling bitter lemon drink 0.25l" },
    { name: "Cockta", nameEn: "Cockta herbal drink 0.25l", price: 3.50, desc: "Legendarno biljno gazirano piće 0.25l", descEn: "Legendary herbal sparkling drink 0.25l" },
    { name: "Narandža Vitaminka", nameEn: "Vitaminka Orange Juice 0.2l", price: 3.50, desc: "Prirodni bistri sok od narandže 0.2l", descEn: "Natural clear orange juice 0.2l" },
    { name: "Borovnica Vitaminka", nameEn: "Vitaminka Blueberry Juice 0.2l", price: 3.50, desc: "Voćni sok od zrelih borovnica 0.2l", descEn: "Fruit juice from ripe blueberries 0.2l" },
    { name: "Višnja Vitaminka", nameEn: "Vitaminka Sour Cherry 0.2l", price: 3.50, desc: "Slatko-kiseli prirodni sok od višnje 0.2l", descEn: "Sweet-sour natural cherry juice 0.2l" },
    { name: "Jabuka Vitaminka", nameEn: "Vitaminka Apple Juice 0.2l", price: 3.50, desc: "Bistri voćni sok od jabuke 0.2l", descEn: "Clear fruit apple juice 0.2l" },
    { name: "Jagoda Vitaminka", nameEn: "Vitaminka Strawberry 0.2l", price: 3.50, desc: "Gusti voćni sok od jagode 0.2l", descEn: "Thick strawberry fruit juice 0.2l" },
    { name: "Breskva Vitaminka", nameEn: "Vitaminka Peach Juice 0.2l", price: 3.50, desc: "Gusti voćni sok od breskve 0.2l", descEn: "Thick peach fruit juice 0.2l" },
    { name: "Ledeni čaj breskva/brusnica", nameEn: "Iced Tea Peach/Cranberry", price: 3.00, desc: "Osvežavajući hladni čaj", descEn: "Refreshing iced tea" },
    { name: "Orangina", nameEn: "Orangina 0.25l", price: 4.00, desc: "Premium gazirani sok sa pulpom narandže 0.25l", descEn: "Premium sparkling orange juice with pulp 0.25l" },
    { name: "Cider Somersby", nameEn: "Somersby Cider 0.33l", price: 4.00, desc: "Blago alkoholno gazirano piće od voća 0.33l", descEn: "Lightly alcoholic sparkling fruit cider 0.33l" },
    { name: "Energija Red Bull", nameEn: "Red Bull Energy Drink", price: 6.00, desc: "Energetski napitak 0.25l", descEn: "Energy drink 0.25l" }
  ],
  "Flaširano pivo": [
    { name: "1664 Blanc 0,33", nameEn: "1664 Blanc Beer 0.33l", price: 3.00, desc: "Premium svetlo pšenično pivo sa aromom citrusa", descEn: "Premium light wheat beer with citrus aroma", badge: "recommended", orders: 104 },
    { name: "Tuborg 0,33", nameEn: "Tuborg Beer 0.33l", price: 3.00, desc: "Svetlo lager pivo osvežavajućeg ukusa 0.33l", descEn: "Light lager beer with refreshing taste 0.33l" },
    { name: "Tuborg 0,50", nameEn: "Tuborg Beer 0.5l", price: 3.00, desc: "Lager pivo u flaši od 0.5l", descEn: "Lager beer in a 0.5l bottle" },
    { name: "Tuborg Bezalkoh. 0,33", nameEn: "Non-alcoholic Tuborg 0.33l", price: 3.50, desc: "Osvežavajući Tuborg bez alkohola", descEn: "Refreshing alcohol-free Tuborg" },
    { name: "Carlsberg 0,33", nameEn: "Carlsberg Beer 0.33l", price: 3.50, desc: "Vrhunski svetski pilsner 0.33l", descEn: "Premium world pilsner beer 0.33l" },
    { name: "Lav Premium 0,33", nameEn: "Lav Premium Beer 0.33l", price: 3.00, desc: "Domaće lager pivo punog ukusa 0.33l", descEn: "Domestic lager beer with rich flavor 0.33l" },
    { name: "Pan Zlatni 0,50", nameEn: "Pan Zlatni Beer 0.5l", price: 3.00, desc: "Bogato zlatno lager pivo 0.5l", descEn: "Rich golden lager beer 0.5l" },
    { name: "Budweiser Svijetlo 0,33", nameEn: "Budweiser Light Beer 0.33l", price: 4.00, desc: "Originalni češki svetli lager 0.33l", descEn: "Original Czech light lager 0.33l" },
    { name: "Budweiser Tamno 0,33", nameEn: "Budweiser Dark Beer 0.33l", price: 4.00, desc: "Češko tamno pivo sa aromom karamele 0.33l", descEn: "Czech dark beer with caramel aroma 0.33l" },
    { name: "Erdinger Weissbier 0,50", nameEn: "Erdinger Wheat Beer 0.5l", price: 6.00, desc: "Vrhunsko bavarsko pšenično svetlo pivo 0.5l", descEn: "Premium Bavarian light wheat beer 0.5l" },
    { name: "Erdinger Dunkel 0,50", nameEn: "Erdinger Dark Wheat 0.5l", price: 6.00, desc: "Bavarsko pšenično tamno pivo 0.5l", descEn: "Bavarian dark wheat beer 0.5l" },
    { name: "Erdinger Bezalkoh. 0,33", nameEn: "Non-alcoholic Erdinger 0.33l", price: 4.50, desc: "Pšenično bezalkoholno pivo bogatog ukusa 0.33l", descEn: "Wheat alcohol-free beer with rich flavor 0.33l" },
    { name: "Nektar 0,33", nameEn: "Nektar Beer 0.33l", price: 3.00, desc: "Tradicionalno svetlo pivo 0.33l", descEn: "Traditional light beer 0.33l" },
    { name: "Nektar 0,50", nameEn: "Nektar Beer 0.5l", price: 3.00, desc: "Svetlo pivo u boci od 0.5l", descEn: "Light beer in a 0.5l bottle" },
    { name: "Estrella 0,66", nameEn: "Estrella Beer 0.66l", price: 7.00, desc: "Špansko premium svetlo lager pivo 0.66l", descEn: "Spanish premium light lager beer 0.66l" },
    { name: "Estrella 0,33", nameEn: "Estrella Beer 0.33l", price: 4.00, desc: "Premium svetli lager 0.33l", descEn: "Premium light lager 0.33l" },
    { name: "Karlovačko Tamno 0,50", nameEn: "Karlovacko Dark Beer 0.5l", price: 4.00, desc: "Kvalitetno tamno pivo punog ukusa 0.5l", descEn: "Quality dark beer with rich taste 0.5l" },
    { name: "Zaječarsko 0,50", nameEn: "Zajecarsko Beer 0.5l", price: 3.00, desc: "Tradicionalno svetlo pivo 0.5l", descEn: "Traditional light beer 0.5l" },
    { name: "Gorštak Kraft 0,33", nameEn: "Gorstak Craft Beer 0.33l", price: 6.00, desc: "Domaće zanatsko pivo lokalne pivare 0.33l", descEn: "Local domestic craft beer 0.33l" }
  ],
  "Točeno pivo": [
    { name: "1664 Blanc 0,33", nameEn: "Draft 1664 Blanc 0.33l", price: 3.00, desc: "Točeno pšenično pivo citrusnog ukusa 0.33l", descEn: "Draft wheat beer with citrus taste 0.33l" },
    { name: "1664 Blanc 0,50", nameEn: "Draft 1664 Blanc 0.5l", price: 4.50, desc: "Točeno pšenično pivo citrusnog ukusa 0.5l", descEn: "Draft wheat beer with citrus taste 0.5l" },
    { name: "Tuborg 0,30", nameEn: "Draft Tuborg 0.3l", price: 2.50, desc: "Sveže točeni lager 0.3l", descEn: "Fresh draft lager beer 0.3l" },
    { name: "Tuborg 0,50", nameEn: "Draft Tuborg 0.5l", price: 3.50, desc: "Točeno lager pivo 0.5l", descEn: "Draft lager beer 0.5l" }
  ],
  "Vina": [
    { name: "Jungić Tamjanika 0,10", nameEn: "Jungic Tamjanika Wine 0.1l", price: 3.00, desc: "Domaće suvo belo vino sa izraženom aromom 0.1l", descEn: "Domestic dry white wine with intense aroma 0.1l", badge: "recommended", orders: 82 },
    { name: "Dalmati Chardonnay 0,10", nameEn: "Dalmati Chardonnay 0.1l", price: 3.00, desc: "Belo vino voćnih i cvetnih tonova 0.1l", descEn: "White wine with fruity and floral tones 0.1l" },
    { name: "Dalmati Merlo 0,10", nameEn: "Dalmati Merlot 0.1l", price: 3.00, desc: "Kvalitetno crveno vino baršunastog ukusa 0.1l", descEn: "Quality red wine with velvety taste 0.1l" },
    { name: "Smederevka Tikveš 0,20", nameEn: "Smederevka Tikves Wine 0.2l", price: 4.00, desc: "Osvežavajuće belo vino 0.2l", descEn: "Refreshing white wine 0.2l" },
    { name: "Kratošija Tikveš 0,20", nameEn: "Kratocija Tikves Wine 0.2l", price: 4.00, desc: "Tradicionalno crveno vino 0.2l", descEn: "Traditional red wine 0.2l" },
    { name: "Crveni Brijeg 0,75l", nameEn: "Crveni Brijeg Wine 0.75l", price: 40.00, desc: "Vrhunsko crveno vino 0.75l", descEn: "Premium red wine 0.75l" },
    { name: "Dalmati 0,75", nameEn: "Dalmati Wine bottle 0.75l", price: 40.00, desc: "Premium vino iz vinarije Dalmati 0.75l", descEn: "Premium wine from Dalmati winery 0.75l" },
    { name: "Tikveš 0,75", nameEn: "Tikves Wine bottle 0.75l", price: 25.00, desc: "Kvalitetno stono vino 0.75l", descEn: "Quality table wine bottle 0.75l" },
    { name: "Buteljica 0,187", nameEn: "Small wine bottle 0.187l", price: 7.00, desc: "Mala boca vina 0.187l", descEn: "Small bottle of wine 0.187l" }
  ],
  "Žestice": [
    { name: "Mećava Šljiva 0,03", nameEn: "Mecava Plum Rakija 0.03l", price: 3.00, desc: "Domaća rakija od šljive 0.03l", descEn: "Domestic plum rakija brandy 0.03l" },
    { name: "Mećava Jabuka 0,03", nameEn: "Mecava Apple Rakija 0.03l", price: 3.00, desc: "Domaća rakija od jabuke 0.03l", descEn: "Domestic apple rakija brandy 0.03l" },
    { name: "Mećava Viljamovka 0,03", nameEn: "Mecava Pear Viljamovka 0.03l", price: 3.50, desc: "Premium rakija od kruške viljamovke 0.03l", descEn: "Premium Viljamovka pear rakija brandy 0.03l" },
    { name: "Mećava Travarica 0,03", nameEn: "Mecava Herbal Rakija 0.03l", price: 3.50, desc: "Domaća rakija sa lekovitim biljem 0.03l", descEn: "Domestic herbal rakija brandy 0.03l" },
    { name: "Mećava Dunja 0,03", nameEn: "Mecava Quince Rakija 0.03l", price: 4.00, desc: "Aromatična rakija od dunje 0.03l", descEn: "Aromatic quince rakija brandy 0.03l" },
    { name: "Djedova Rakija 0,03", nameEn: "Djedova Rakija Brandy 0.03l", price: 4.00, desc: "Vrhunska stara domaća rakija 0.03l", descEn: "Premium aged domestic rakija brandy 0.03l" },
    { name: "Krajiška Ljepotica 0,03", nameEn: "Krajiska Ljepotica Brandy 0.03l", price: 4.00, desc: "Kvalitetna domaća rakija 0.03l", descEn: "Quality domestic rakija brandy 0.03l" },
    { name: "Gin Beefeater 0,03", nameEn: "Beefeater Gin 0.03l", price: 3.00, desc: "Klasični londonski suvi džin 0.03l", descEn: "Classic London dry gin 0.03l" },
    { name: "Gin Bulldog 0,03", nameEn: "Bulldog Gin 0.03l", price: 3.50, desc: "Moderan i aromatičan džin 0.03l", descEn: "Modern aromatic gin 0.03l" },
    { name: "Gin Hendricks 0,03", nameEn: "Hendrick's Gin 0.03l", price: 4.50, desc: "Premium džin sa notom krastavca i ruže 0.03l", descEn: "Premium gin with cucumber and rose note 0.03l" },
    { name: "Gin Engineer 0,03", nameEn: "Engineer Craft Gin 0.03l", price: 4.50, desc: "Domaći zanatski premium džin 0.03l", descEn: "Local domestic premium craft gin 0.03l" },
    { name: "Red Label J.W. 0,03", nameEn: "J.Walker Red Label 0.03l", price: 4.00, desc: "Johnnie Walker škotski viski 0.03l", descEn: "Johnnie Walker Scotch whisky 0.03l" },
    { name: "Jack Daniels 0,03", nameEn: "Jack Daniel's Whiskey 0.03l", price: 4.00, desc: "Tenesi viski prepoznatljivog karaktera 0.03l", descEn: "Tennessee whiskey with a distinctive character 0.03l" },
    { name: "Jameson 0,03", nameEn: "Jameson Irish Whiskey 0.03l", price: 3.50, desc: "Trostruko destilovani irski viski 0.03l", descEn: "Triple distilled Irish whiskey 0.03l" },
    { name: "Jameson Black 0,03", nameEn: "Jameson Black Barrel 0.03l", price: 5.00, desc: "Premium izdanje irskog viskija 0.03l", descEn: "Premium edition Irish whiskey 0.03l" },
    { name: "Vodka Absolut 0,03", nameEn: "Absolut Vodka 0.03l", price: 3.00, desc: "Vrhunska švedska vodka 0.03l", descEn: "Premium Swedish vodka 0.03l" },
    { name: "Tequila Olmeca 0,03", nameEn: "Olmeca Tequila 0.03l", price: 3.00, desc: "Meksička tekila od plave agave 0.03l", descEn: "Mexican tequila made of blue agave 0.03l" },
    { name: "Vinjak Rubin 0,03", nameEn: "Rubin Vinjak Brandy 0.03l", price: 2.50, desc: "Tradicionalni vinjak od vinskog destilata 0.03l", descEn: "Traditional vinjak brandy from wine distillate 0.03l" }
  ],
  "Likeri": [
    { name: "Gorki List 0,03", nameEn: "Gorki List Pelinkovac 0.03l", price: 2.50, desc: "Popularni gorki biljni liker pelinkovac 0.03l", descEn: "Popular bitter herbal liqueur pelinkovac 0.03l" },
    { name: "Jagermeister 0,03", nameEn: "Jagermeister 0.03l", price: 3.00, desc: "Poznati nemački liker od 56 trava 0.03l", descEn: "Famous German liqueur made of 56 herbs 0.03l" },
    { name: "Baba Višnja 0,03", nameEn: "Baba Visnja Cherry Liqueur 0.03l", price: 3.00, desc: "Slatki domaći liker od višnje 0.03l", descEn: "Sweet domestic sour cherry liqueur 0.03l" },
    { name: "Meduška 0,03", nameEn: "Meduska Honey Liqueur 0.03l", price: 3.00, desc: "Tradicionalni liker od meda i rakije 0.03l", descEn: "Traditional honey liqueur 0.03l" },
    { name: "Pelinkovac 0,03", nameEn: "Pelinkovac Bitter Liqueur 0.03l", price: 2.50, desc: "Biljni gorki liker 0.03l", descEn: "Herbal bitter liqueur 0.03l" },
    { name: "Shankys Weep", nameEn: "Shanky's Whip Liqueur 0.03l", price: 3.00, desc: "Irski viski liker sa aromom vanile i karamele", descEn: "Irish whiskey liqueur with vanilla and caramel aroma" }
  ]
};

async function runSeeding() {
  console.log("=== BRISANJE STARIH STAVKI MENIJA ===");
  const { error: deleteError } = await supabase
    .from('menu_items')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Briše sve zapise
    
  if (deleteError) {
    console.error("Greška pri brisanju:", deleteError.message);
    process.exit(1);
  }
  console.log("Stare stavke su uspešno obrisane.");

  console.log("\n=== POČETAK UVOZA STAVKI MENIJA SA OPISIMA (NODE.JS) ===");
  
  for (const [category, items] of Object.entries(menuData)) {
    const bulkInsertData = items.map((item, index) => ({
      name: item.name,
      name_en: item.nameEn || item.name,
      description: item.desc || "",
      description_en: item.descEn || item.desc || "",
      price: item.price,
      category: category,
      badge: item.badge || null,
      orders_count: item.orders || 0,
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

runSeeding();
