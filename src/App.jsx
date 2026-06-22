import { useState, useEffect, useRef } from "react";
import AdminPanel from "./AdminPanel.jsx";
import SuperAdmin from "./SuperAdmin.jsx";
import { supabase } from "./supabaseClient";

const t = {
  SR: {
    brand: "Amber & Oak", menu: "Meni", table: "Sto", waiterView: "Konobar",
    backToMenu: "Nazad", yourOrder: "Vaša porudžbina", empty: "Korpa je prazna",
    emptyHint: "Dodajte nešto ukusno iz menija",
    total: "Ukupno", placeOrder: "Pošalji porudžbinu",
    reviewOrder: "Pregledaj porudžbinu", addNote: "Napomena (npr. bez šećera)...",
    orders: "Porudžbine", noOrders: "Nema aktivnih porudžbina", noOrdersHint: "Čekamo nove porudžbine...",
    statusNew: "Nova", statusPreparing: "U pripremi", statusReady: "Spremno", statusDelivered: "Dostavljeno",
    btnPrepare: "Pripremi", btnReady: "Spremno", btnDeliver: "Dostavljeno", add: "Dodaj",
    myOrderStatus: "Status porudžbine",
    cats: {
      Kafa: "Kafa", kafa: "Kafa",
      Sokovi: "Sokovi", sokovi: "Sokovi",
      Piva: "Piva", piva: "Piva",
      Napitci: "Napitci", napitci: "Napitci", papitci: "Napitci",
      Grickalice: "Grickalice", grickalice: "Grickalice",
      "Topli napici": "Topli napici",
      "Vode": "Vode",
      "Cijeđeni sokovi": "Cijeđeni sokovi",
      "Sokići": "Sokići",
      "Flaširano pivo": "Flaširano pivo",
      "Točeno pivo": "Točeno pivo",
      "Vina": "Vina",
      "Žestice": "Žestice",
      "Likeri": "Likeri",
      "Brunch meni": "Brunch meni",
      "Hladna predjela": "Hladna predjela",
      "Topla međujela": "Topla međujela",
      "Supe i čorbe": "Supe i čorbe",
      "Pice": "Pice",
      "Glavna jela - Riba": "Riba",
      "Glavna jela - Piletina": "Piletina",
      "Glavna jela - Ćuretina": "Ćuretina",
      "Glavna jela - Svinjetina": "Svinjetina",
      "Glavna jela - Jagnjetina": "Jagnjetina",
      "Glavna jela - Govedina": "Govedina",
      "Burgeri": "Burgeri",
      "S vremena na vrijeme": "S vremena na vrijeme",
      "Trans Sibir Express": "Trans Sibir Express",
      "Obrok salate": "Obrok salate",
      "Salate i dodaci": "Salate i dodaci",
      "Dječiji meni": "Dječiji meni",
      "Deserti": "Deserti"
    },
    popular: "Popularno", badgePopular: "Popularno", badgeNew: "Novo", badgeRecommended: "Preporučeno",
    topPicks: "Top izbori", orderedTimes: "×",
    uploadImg: "Slika",
    callWaiter: "Pozovi konobara", callWaiterConfirm: "Konobar obavešten", callWaiterSub: "Stižemo za koji minut",
    callWaiterHint: "Trebate pomoć? Konobar dolazi za koji minut.",
    requestBill: "Zatraži račun", billConfirm: "Račun u pripremi", billSub: "Konobar donosi račun",
    billHint: "Pripremamo vaš račun.",
    payCard: "Karticom", payCash: "Gotovinom", payHow: "Kako želite da platite?",
    callsAlerts: "Pozivi i zahtevi", callWaiterAlert: "🙋 Poziv — Sto", billAlert: "🧾 Račun — Sto",
    dismiss: "Rešeno", exitToast: "Pritisnite ponovo NAZAD za izlaz",
    quickNotes: {
      kafa: ["Toplo mleko", "Hladno mleko", "Bez šećera", "Slađa"],
      "topli napici": ["Toplo mleko", "Hladno mleko", "Bez šećera", "Slađa"],
      sokovi: ["Hladan", "Sa ledom", "Bez leda", "Sa limunom"],
      "cijeđeni sokovi": ["Hladan", "Sa ledom", "Bez leda", "Sa limunom"],
      "sokići": ["Hladan", "Sa ledom", "Bez leda", "Sa limunom"],
      "vode": ["Hladna", "Sa ledom", "Bez leda", "Sa limunom"],
      piva: ["Hladno", "Iz čaše", "Točeno"],
      "flaširano pivo": ["Hladno", "Iz čaše"],
      "točeno pivo": ["Hladno"],
      napitci: ["Sa ledom", "Bez leda", "Bez šećera"],
      "vina": ["Hladno", "Sa kiselom", "Sa ledom"],
      "žestice": ["Hladno", "Sa ledom", "Bez leda"],
      "likeri": ["Hladno", "Sa ledom"],
      grickalice: ["Slanije", "Manje pečeno"],
      "brunch meni": ["Bez luka", "Dobro pečeno", "Rovitije jaje", "Sos sa strane"],
      "hladna predjela": ["Bez parmezana", "Bez kiselog", "Bez hljeba"],
      "topla međujela": ["Bez parmezana", "Bez luka", "Pikantnije", "Manje soli"],
      "supe i čorbe": ["Sa limunom", "Bez hljeba", "Toplije"],
      pice: ["Bez origana", "Bez maslina", "Dodatni sir", "Ketchup sa strane"],
      "glavna jela - riba": ["Dobro pečeno", "Bez limuna", "Sos sa strane"],
      "glavna jela - piletina": ["Reš pečeno", "Sos sa strane", "Bez soli"],
      "glavna jela - ćuretina": ["Reš pečeno", "Sos sa strane", "Bez mlinaca"],
      "glavna jela - svinjetina": ["Reš pečeno", "Jače začinjeno", "Bez soli"],
      "glavna jela - jagnjetina": ["Reš pečeno", "Bez lavande", "Sos sa strane"],
      "glavna jela - govedina": ["Srednje pečeno", "Reš pečeno", "Krvavo", "Sos sa strane"],
      burgeri: ["Bez luka", "Bez paradajza", "Jače pečeno", "Dodatni sir"],
      "s vremena na vrijeme": ["Sos sa strane", "Toplije"],
      "trans sibir express": ["Bez luka", "Srednje pečeno", "Reš pečeno"],
      "obrok salate": ["Bez dresinga", "Bez sira", "Dresing sa strane"],
      "salate i dodaci": ["Bez ulja", "Bez sirćeta", "Bez soli"],
      "dječiji meni": ["Bez kečapa", "Manje slano"],
      deserti: ["Sa šlagom", "Bez sladoleda", "Bez oraha"],
      default: ["Hladno", "Sa ledom", "Bez leda"]
    },
  },
  BS: {
    brand: "Amber & Oak", menu: "Meni", table: "Sto", waiterView: "Konobar",
    backToMenu: "Nazad", yourOrder: "Vaša narudžba", empty: "Korpa je prazna",
    emptyHint: "Dodajte nešto ukusno iz menija",
    total: "Ukupno", placeOrder: "Pošalji narudžbu",
    reviewOrder: "Pregledaj narudžbu", addNote: "Napomena (npr. bez šećera)...",
    orders: "Narudžbe", noOrders: "Nema aktivnih narudžbi", noOrdersHint: "Čekamo nove narudžbe...",
    statusNew: "Nova", statusPreparing: "U pripremi", statusReady: "Spremno", statusDelivered: "Dostavljeno",
    btnPrepare: "Pripremi", btnReady: "Spremno", btnDeliver: "Dostavljeno", add: "Dodaj",
    myOrderStatus: "Status narudžbe",
    cats: {
      Kafa: "Kafa", kafa: "Kafa",
      Sokovi: "Sokovi", sokovi: "Sokovi",
      Piva: "Piva", piva: "Piva",
      Napitci: "Napitci", napitci: "Napitci", papitci: "Napitci",
      Grickalice: "Grickalice", grickalice: "Grickalice",
      "Topli napici": "Topli napici",
      "Vode": "Vode",
      "Cijeđeni sokovi": "Cijeđeni sokovi",
      "Sokići": "Sokići",
      "Flaširano pivo": "Flaširano pivo",
      "Točeno pivo": "Točeno pivo",
      "Vina": "Vina",
      "Žestice": "Žestice",
      "Likeri": "Likeri",
      "Brunch meni": "Brunch meni",
      "Hladna predjela": "Hladna predjela",
      "Topla međujela": "Topla međujela",
      "Supe i čorbe": "Supe i čorbe",
      "Pice": "Pice",
      "Glavna jela - Riba": "Riba",
      "Glavna jela - Piletina": "Piletina",
      "Glavna jela - Ćuretina": "Ćuretina",
      "Glavna jela - Svinjetina": "Svinjetina",
      "Glavna jela - Jagnjetina": "Jagnjetina",
      "Glavna jela - Govedina": "Govedina",
      "Burgeri": "Burgeri",
      "S vremena na vrijeme": "S vremena na vrijeme",
      "Trans Sibir Express": "Trans Sibir Express",
      "Obrok salate": "Obrok salate",
      "Salate i dodaci": "Salate i dodaci",
      "Dječiji meni": "Dječji meni",
      "Deserti": "Deserti"
    },
    popular: "Popularno", badgePopular: "Popularno", badgeNew: "Novo", badgeRecommended: "Preporučeno",
    topPicks: "Top izbori", orderedTimes: "×",
    uploadImg: "Slika",
    callWaiter: "Pozovi konobara", callWaiterConfirm: "Konobar obaviješten", callWaiterSub: "Stižemo za koji minut",
    callWaiterHint: "Trebate pomoć? Konobar dolazi za koji minut.",
    requestBill: "Zatraži račun", billConfirm: "Račun u pripremi", billSub: "Konobar donosi račun",
    billHint: "Pripremamo vaš račun.",
    payCard: "Karticom", payCash: "Gotovinom", payHow: "Kako želite platiti?",
    callsAlerts: "Pozivi i zahtevi", callWaiterAlert: "🙋 Poziv — Sto", billAlert: "🧾 Račun — Sto",
    dismiss: "Riješeno", exitToast: "Pritisnite ponovo NAZAD za izlaz",
    quickNotes: {
      kafa: ["Toplo mlijeko", "Hladno mlijeko", "Bez šećera", "Slađa"],
      "topli napici": ["Toplo mlijeko", "Hladno mlijeko", "Bez šećera", "Slađa"],
      sokovi: ["Hladan", "Sa ledom", "Bez leda", "Sa limunom"],
      "cijeđeni sokovi": ["Hladan", "Sa ledom", "Bez leda", "Sa limunom"],
      "sokići": ["Hladan", "Sa ledom", "Bez leda", "Sa limunom"],
      "vode": ["Hladna", "Sa ledom", "Bez leda", "Sa limunom"],
      piva: ["Hladno", "Iz čaše", "Točeno"],
      "flaširano pivo": ["Hladno", "Iz čaše"],
      "točeno pivo": ["Hladno"],
      napitci: ["Sa ledom", "Bez leda", "Bez šećera"],
      "vina": ["Hladno", "Sa kiselom", "Sa ledom"],
      "žestice": ["Hladno", "Sa ledom", "Bez leda"],
      "likeri": ["Hladno", "Sa ledom"],
      grickalice: ["Slanije", "Manje pečeno"],
      "brunch meni": ["Bez luka", "Dobro pečeno", "Rovitije jaje", "Sos sa strane"],
      "hladna predjela": ["Bez parmezana", "Bez kiselog", "Bez hljeba"],
      "topla međujela": ["Bez parmezana", "Bez luka", "Pikantnije", "Manje soli"],
      "supe i čorbe": ["Sa limunom", "Bez hljeba", "Toplije"],
      pice: ["Bez origana", "Bez maslina", "Dodatni sir", "Ketchup sa strane"],
      "glavna jela - riba": ["Dobro pečeno", "Bez limuna", "Sos sa strane"],
      "glavna jela - piletina": ["Reš pečeno", "Sos sa strane", "Bez soli"],
      "glavna jela - ćuretina": ["Reš pečeno", "Sos sa strane", "Bez mlinaca"],
      "glavna jela - svinjetina": ["Reš pečeno", "Jače začinjeno", "Bez soli"],
      "glavna jela - jagnjetina": ["Reš pečeno", "Bez lavande", "Sos sa strane"],
      "glavna jela - govedina": ["Srednje pečeno", "Reš pečeno", "Krvavo", "Sos sa strane"],
      burgeri: ["Bez luka", "Bez paradajza", "Jače pečeno", "Dodatni sir"],
      "s vremena na vrijeme": ["Sos sa strane", "Toplije"],
      "trans sibir express": ["Bez luka", "Srednje pečeno", "Reš pečeno"],
      "obrok salate": ["Bez dresinga", "Bez sira", "Dresing sa strane"],
      "salate i dodaci": ["Bez ulja", "Bez sirćeta", "Bez soli"],
      "dječiji meni": ["Bez kečapa", "Manje slano"],
      deserti: ["Sa šlagom", "Bez sladoleda", "Bez oraha"],
      default: ["Hladno", "Sa ledom", "Bez leda"]
    },
  },
  EN: {
    brand: "Amber & Oak", menu: "Menu", table: "Table", waiterView: "Waiter",
    backToMenu: "Back", yourOrder: "Your order", empty: "Cart is empty",
    emptyHint: "Add something delicious from the menu",
    total: "Total", placeOrder: "Place order",
    reviewOrder: "Review order", addNote: "Note (e.g. no sugar)...",
    orders: "Orders", noOrders: "No active orders", noOrdersHint: "Waiting for new orders...",
    statusNew: "New", statusPreparing: "Preparing", statusReady: "Ready", statusDelivered: "Delivered",
    btnPrepare: "Prepare", btnReady: "Ready", btnDeliver: "Delivered", add: "Add",
    myOrderStatus: "Order status",
    cats: {
      Kafa: "Coffee", kafa: "Coffee",
      Sokovi: "Juices", sokovi: "Juices",
      Piva: "Beers", piva: "Beers",
      Napitci: "Drinks", napitci: "Drinks", papitci: "Drinks",
      Grickalice: "Snacks", grickalice: "Snacks",
      "Topli napici": "Hot Drinks",
      "Vode": "Water",
      "Cijeđeni sokovi": "Squeezed Juices",
      "Sokići": "Soft Drinks",
      "Flaširano pivo": "Bottled Beer",
      "Točeno pivo": "Draft Beer",
      "Vina": "Wines",
      "Žestice": "Spirits",
      "Likeri": "Liqueurs",
      "Brunch meni": "Brunch Menu",
      "Hladna predjela": "Cold Appetizers",
      "Topla međujela": "Warm Entrees",
      "Supe i čorbe": "Soups & Broths",
      "Pice": "Pizzas",
      "Glavna jela - Riba": "Fish",
      "Glavna jela - Piletina": "Chicken",
      "Glavna jela - Ćuretina": "Turkey",
      "Glavna jela - Svinjetina": "Pork",
      "Glavna jela - Jagnjetina": "Lamb",
      "Glavna jela - Govedina": "Beef & Veal",
      "Burgeri": "Burgers",
      "S vremena na vrijeme": "From Time to Time",
      "Trans Sibir Express": "Trans Siberian Express",
      "Obrok salate": "Meal Salads",
      "Salate i dodaci": "Salads & Sides",
      "Dječiji meni": "Kids Menu",
      "Deserti": "Desserts"
    },
    popular: "Popular", badgePopular: "Popular", badgeNew: "New", badgeRecommended: "Chef's pick",
    topPicks: "Top picks", orderedTimes: "×",
    uploadImg: "Photo",
    callWaiter: "Call waiter", callWaiterConfirm: "Waiter notified", callWaiterSub: "We'll be right with you",
    callWaiterHint: "Need help? Your waiter will be right with you.",
    requestBill: "Request bill", billConfirm: "Bill coming", billSub: "Waiter is on the way",
    billHint: "We're preparing your bill.",
    payCard: "Card", payCash: "Cash", payHow: "How would you like to pay?",
    callsAlerts: "Calls & requests", callWaiterAlert: "🙋 Call — Table", billAlert: "🧾 Bill — Table",
    dismiss: "Dismiss", exitToast: "Press BACK again to exit",
    quickNotes: {
      kafa: ["Warm milk", "Cold milk", "No sugar", "Sweeter"],
      "topli napici": ["Warm milk", "Cold milk", "No sugar", "Sweeter"],
      sokovi: ["Cold", "With ice", "No ice", "With lemon"],
      "cijeđeni sokovi": ["Cold", "With ice", "No ice", "With lemon"],
      "sokići": ["Cold", "With ice", "No ice", "With lemon"],
      "vode": ["Cold", "With ice", "No ice", "With lemon"],
      piva: ["Cold", "With glass", "Draft"],
      "flaširano pivo": ["Cold", "With glass"],
      "točeno pivo": ["Cold"],
      napitci: ["With ice", "No ice", "No sugar"],
      "vina": ["Cold", "With soda", "With ice"],
      "žestice": ["Cold", "With ice", "No ice"],
      "likeri": ["Cold", "With ice"],
      grickalice: ["Saltier", "Less baked"],
      "brunch meni": ["No onions", "Well done", "Runny yolk", "Sauce on side"],
      "hladna predjela": ["No parmesan", "No bread", "No gluten"],
      "topla međujela": ["No parmesan", "No onions", "Spicy", "Less salt"],
      "supe i čorbe": ["With lemon", "No bread", "Hotter"],
      pice: ["No oregano", "No olives", "Extra cheese", "Ketchup on side"],
      "glavna jela - riba": ["Well done", "No lemon", "Sauce on side"],
      "glavna jela - piletina": ["Well done", "Sauce on side", "No salt"],
      "glavna jela - ćuretina": ["Well done", "Sauce on side"],
      "glavna jela - svinjetina": ["Well done", "Spicy", "No salt"],
      "glavna jela - jagnjetina": ["Well done", "No lavender", "Sauce on side"],
      "glavna jela - govedina": ["Medium", "Well done", "Rare", "Sauce on side"],
      burgeri: ["No onions", "No tomato", "Well done", "Extra cheese"],
      "s vremena na vrijeme": ["Sauce on side", "Hotter"],
      "trans sibir express": ["No onions", "Medium", "Well done"],
      "obrok salate": ["No dressing", "No cheese", "Dressing on side"],
      "salate i dodaci": ["No oil", "No vinegar", "No salt"],
      "dječiji meni": ["No ketchup", "Less salt"],
      deserti: ["With whipped cream", "No ice cream", "No nuts"],
      default: ["Cold", "With ice", "No ice"]
    },
  },
};


const seedOrders = [
  { id: "ORD-001", table: 3, time: "21:32", status: "preparing", items: [{ name: "Cappuccino", qty: 2, note: "" }, { name: "Cheesecake", qty: 1, note: "bez šećera" }] },
  { id: "ORD-002", table: 5, time: "21:38", status: "new", items: [{ name: "Club sendvič", qty: 1, note: "" }, { name: "Ledeni čaj", qty: 2, note: "" }] },
];

const statusColor = { new: "bg-amber-500", preparing: "bg-blue-500", ready: "bg-emerald-500", delivered: "bg-green-600" };
const statusNext = { new: "preparing", preparing: "ready", ready: "delivered" };

const badgeConfig = {
  popular:     { label: "⭐ ", color: "#f97316" },
  recommended: { label: "⭐ ", color: "#f97316" },
  new:         { label: "✨ ", color: "#8b5cf6" },
};

const globalStyles = `
  * { box-sizing: border-box; }
  .font-display { font-family: 'Playfair Display', serif; }
  .font-body { font-family: 'Inter', sans-serif; }

  /* ── CORE ANIMATIONS ── */
  @keyframes fadeIn {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes fadeInUp {
    from { opacity:0; transform:translateY(22px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes fadeInLeft {
    from { opacity:0; transform:translateX(-16px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes fadeInRight {
    from { opacity:0; transform:translateX(16px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes slideUp {
    from { opacity:0; transform:translateY(50px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes slideDown {
    from { opacity:0; transform:translateY(-20px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ── SPRING ANIMATIONS ── */
  @keyframes bounceIn {
    0%   { transform:scale(0.4); opacity:0; }
    55%  { transform:scale(1.08); opacity:1; }
    75%  { transform:scale(0.95); }
    100% { transform:scale(1); opacity:1; }
  }
  @keyframes popIn {
    0%   { transform:scale(0.8); opacity:0; }
    60%  { transform:scale(1.05); opacity:1; }
    100% { transform:scale(1); }
  }
  @keyframes cartBounce {
    0%,100% { transform:scale(1); }
    30%      { transform:scale(1.12); }
    60%      { transform:scale(0.95); }
  }
  @keyframes addBounce {
    0%   { transform:scale(1); }
    20%  { transform:scale(0.82) rotate(-8deg); }
    50%  { transform:scale(1.32) rotate(6deg); }
    70%  { transform:scale(0.92) rotate(-3deg); }
    88%  { transform:scale(1.08); }
    100% { transform:scale(1) rotate(0deg); }
  }
  @keyframes badgePop {
    0%   { transform:scale(1); }
    30%  { transform:scale(1.55) translateY(-2px); }
    60%  { transform:scale(0.88); }
    80%  { transform:scale(1.15); }
    100% { transform:scale(1); }
  }
  @keyframes ringPulse {
    0%   { transform:scale(1); opacity:0.7; }
    100% { transform:scale(2.6); opacity:0; }
  }

  /* ── SPLASH ── */
  @keyframes splashOut {
    0%   { opacity:1; transform:scale(1); }
    70%  { opacity:1; transform:scale(1.05); }
    100% { opacity:0; transform:scale(1.1); }
  }
  @keyframes logoReveal {
    0%   { opacity:0; transform:scale(0.6) translateY(16px); }
    70%  { transform:scale(1.04) translateY(-2px); }
    100% { opacity:1; transform:scale(1) translateY(0); }
  }
  @keyframes taglineReveal {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes dotsAppear {
    from { opacity:0; }
    to   { opacity:1; }
  }
  @keyframes dotPulse {
    0%,80%,100% { transform:scale(0.6); opacity:0.4; }
    40%          { transform:scale(1); opacity:1; }
  }

  /* ── MODAL ── */
  @keyframes modalIn {
    from { opacity:0; transform:translateY(100%) scale(0.98); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }
  @keyframes modalOut {
    from { opacity:1; transform:translateY(0) scale(1); }
    to   { opacity:0; transform:translateY(100%) scale(0.98); }
  }
  @keyframes overlayIn {
    from { opacity:0; }
    to   { opacity:1; }
  }
  @keyframes overlayOut {
    from { opacity:1; }
    to   { opacity:0; }
  }

  /* ── MISC ── */
  @keyframes pulse-soft {
    0%,100% { opacity:1; }
    50%      { opacity:0.45; }
  }
  @keyframes timerTick {
    0%   { transform:scale(1); }
    8%   { transform:scale(1.06); }
    18%  { transform:scale(0.97); }
    30%  { transform:scale(1); }
    100% { transform:scale(1); }
  }
  @keyframes timerGlow {
    0%,100% { box-shadow: 0 0 0 0 rgba(249,115,22,0.0); }
    50%      { box-shadow: 0 0 0 6px rgba(249,115,22,0.12); }
  }
  @keyframes shimmer {
    0%   { background-position:-200% 0; }
    100% { background-position:200% 0; }
  }
  @keyframes ripple {
    0%   { transform:scale(0); opacity:0.5; }
    100% { transform:scale(4); opacity:0; }
  }
  @keyframes tabLine {
    from { transform:scaleX(0); }
    to   { transform:scaleX(1); }
  }
  @keyframes statusPop {
    0%   { transform:scale(0.85); opacity:0; }
    60%  { transform:scale(1.06); }
    100% { transform:scale(1); opacity:1; }
  }
  @keyframes swayPulse {
    0%, 100% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.08) rotate(3deg); }
    75% { transform: scale(1.04) rotate(-3deg); }
  }

  /* ── CLASSES ── */
  .animate-fadeIn       { animation: fadeIn 0.38s cubic-bezier(0.22,1,0.36,1) both; }
  .animate-fadeInUp     { animation: fadeInUp 0.45s cubic-bezier(0.22,1,0.36,1) both; }
  .animate-fadeInLeft   { animation: fadeInLeft 0.38s cubic-bezier(0.22,1,0.36,1) both; }
  .animate-fadeInRight  { animation: fadeInRight 0.38s cubic-bezier(0.22,1,0.36,1) both; }
  .animate-slideUp      { animation: slideUp 0.42s cubic-bezier(0.22,1,0.36,1) forwards; }
  .animate-slideDown    { animation: slideDown 0.35s cubic-bezier(0.22,1,0.36,1) forwards; }
  .animate-bounceIn     { animation: bounceIn 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .animate-popIn        { animation: popIn 0.4s cubic-bezier(0.34,1.4,0.64,1) forwards; }
  .animate-cartBounce   { animation: cartBounce 0.4s ease forwards; }
  .animate-addBounce    { animation: addBounce 0.48s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .animate-badgePop     { animation: badgePop 0.42s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .animate-ringPulse    { animation: ringPulse 0.5s ease-out forwards; }
  .animate-splashOut    { animation: splashOut 0.65s cubic-bezier(0.4,0,0.2,1) forwards; }
  .animate-logoReveal   { animation: logoReveal 0.9s cubic-bezier(0.34,1.4,0.64,1) forwards; }
  .animate-taglineReveal{ animation: taglineReveal 0.5s ease forwards; animation-delay: 0.5s; opacity:0; }
  .animate-dotsAppear   { animation: dotsAppear 0.4s ease forwards; animation-delay: 0.8s; opacity:0; }
  .animate-modalIn      { animation: modalIn 0.4s cubic-bezier(0.34,1.2,0.64,1) forwards; }
  .animate-modalOut     { animation: modalOut 0.3s cubic-bezier(0.34,1.2,0.64,1) forwards; }
  .animate-overlayIn    { animation: overlayIn 0.25s ease forwards; }
  .animate-overlayOut   { animation: overlayOut 0.25s ease forwards; }
  .animate-pulse-soft   { animation: pulse-soft 2s ease infinite; }
  .animate-statusPop    { animation: statusPop 0.45s cubic-bezier(0.34,1.4,0.64,1) forwards; }
  .animate-timerTick    { animation: timerTick 1s ease infinite; }
  .animate-timerGlow    { animation: timerGlow 2s ease-in-out infinite; }
  .animate-tabLine      { animation: tabLine 0.25s cubic-bezier(0.22,1,0.36,1) forwards; transform-origin: left; }
  .animate-swayPulse    { animation: swayPulse 3s ease-in-out infinite; }

  .shimmer-light {
    background: linear-gradient(90deg, #f5f0e8 25%, #eadecb 50%, #f5f0e8 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite linear;
  }
  .shimmer-dark {
    background: linear-gradient(90deg, #1c1410 25%, #2a2220 50%, #1c1410 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite linear;
  }

  /* dot animation delays */
  .dot-1 { animation: dotPulse 1.2s ease infinite 0s; }
  .dot-2 { animation: dotPulse 1.2s ease infinite 0.2s; }
  .dot-3 { animation: dotPulse 1.2s ease infinite 0.4s; }

  /* stagger helpers */
  .stagger-1{animation-delay:0.05s;opacity:0;}
  .stagger-2{animation-delay:0.12s;opacity:0;}
  .stagger-3{animation-delay:0.20s;opacity:0;}
  .stagger-4{animation-delay:0.28s;opacity:0;}

  /* touch feedback */
  .row-press { transition: background 0.15s ease; }
  .row-press:active { background: rgba(249,115,22,0.06); }
  .btn-press { transition: transform 0.12s ease; }
  .btn-press:active { transform: scale(0.94); }

  /* card hover */
  .card-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .card-lift:active { transform: scale(0.98); }

  ::-webkit-scrollbar { display:none; }
  * { scrollbar-width:none; }
`

// ── SPLASH ──
function SplashScreen({ onDone, cafeInfo }) {
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    if (!cafeInfo) return;
    const t1 = setTimeout(() => setLeaving(true), 1800);
    const t2 = setTimeout(() => onDone(), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [cafeInfo, onDone]);

  if (!cafeInfo) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn" style={{ background: "#0f0a05" }}>
        {/* Sleek premium spinner */}
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${leaving ? "animate-splashOut" : ""}`}
      style={{ background: "#0f0a05" }}>
      <div className="animate-logoReveal flex flex-col items-center gap-4">
        {/* Logo */}
        <div className="w-28 h-28 rounded-3xl overflow-hidden flex items-center justify-center"
          style={{ background: cafeInfo.logoBg, boxShadow: "0 0 80px rgba(249,115,22,0.45), 0 0 30px rgba(249,115,22,0.2)" }}>
          {cafeInfo.logo
            ? <img src={cafeInfo.logo} alt="logo" className="w-full h-full object-cover" />
            : <span className="text-6xl">{cafeInfo.emoji}</span>
          }
        </div>
        <div className="text-center">
          <p className="text-orange-400 text-xs tracking-[0.3em] uppercase font-semibold mb-1 animate-taglineReveal">Digital Menu</p>
          <h1 className="text-white font-display text-3xl font-bold">{cafeInfo.name}</h1>
          {cafeInfo.tagline && <p className="text-zinc-400 text-sm mt-1 animate-taglineReveal">{cafeInfo.tagline}</p>}
        </div>
      </div>
      <div className="absolute bottom-12 animate-dotsAppear flex gap-2">
        <div className="w-2 h-2 rounded-full bg-orange-500 dot-1" />
        <div className="w-2 h-2 rounded-full bg-orange-500 dot-2" />
        <div className="w-2 h-2 rounded-full bg-orange-500 dot-3" />
      </div>
    </div>
  );
}

// ── MODAL ──
function Modal({ onClose, children, dark }) {
  const bg = dark ? "#1c1410" : "#fff";
  const cancelBg = dark ? "#292524" : "#f0ece4";
  const cancelColor = dark ? "#a8a29e" : "#78716c";
  return (
    <div className="fixed inset-0 z-40 flex items-end animate-overlayIn" style={{ background: "rgba(0,0,0,0.55)" }}>
      <div className="w-full animate-modalIn rounded-t-3xl p-6" style={{ background: bg }}>
        {children}
        <button onClick={onClose} className="w-full mt-3 py-3 rounded-2xl text-sm font-medium"
          style={{ background: cancelBg, color: cancelColor }}>
          Odustani
        </button>
      </div>
    </div>
  );
}

// ── EMPTY STATE ──
function EmptyState({ icon, title, hint, dark }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 animate-fadeInUp">
      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-4 animate-swayPulse ${dark ? "bg-zinc-800" : "bg-orange-50"}`}>{icon}</div>
      <p className={`text-lg font-semibold mb-1 ${dark ? "text-zinc-300" : "text-zinc-700"}`}>{title}</p>
      <p className={`text-sm text-center ${dark ? "text-zinc-600" : "text-zinc-400"}`}>{hint}</p>
    </div>
  );
}

function WaiterLoginScreen({ onLogin, onBack, onAdminNavigate, dark, textMain, textSub, borderCol, bg, cardBg, waiterPasscode }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  const attempt = () => {
    if (pw === (waiterPasscode || "1357")) {
      onLogin();
    } else {
      setErr(true);
      setTimeout(() => setErr(false), 1500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 font-body animate-fadeIn" style={{ background: bg }}>
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: dark ? "#292524" : "#f5f0e8", color: "#f97316" }}>←</button>
            <div>
              <p className="text-xs uppercase tracking-widest" style={{ color: textSub }}>Panel</p>
              <h1 className="font-bold text-lg leading-tight" style={{ color: textMain }}>Konobarski panel</h1>
            </div>
          </div>
          <button onClick={onAdminNavigate} className="text-xs border px-3 py-1.5 rounded-full font-semibold"
            style={{ color: "#f97316", borderColor: "#f97316" }}>Admin</button>
        </div>
        <div className="rounded-3xl p-6" style={{ background: cardBg, border: `1px solid ${borderCol}` }}>
          <div className="text-center mb-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3"
              style={{ background: "#f97316" }}>🔑</div>
            <p className="text-sm font-semibold" style={{ color: textMain }}>Unesite šifru konobara</p>
          </div>
          <input
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setErr(false); }}
            onKeyDown={e => e.key === "Enter" && attempt()}
            placeholder="Šifra..."
            className="w-full px-4 py-3.5 rounded-2xl outline-none border text-base text-center font-bold tracking-widest mb-3"
            style={{
              background: dark ? "#2a2220" : "#fff",
              color: textMain,
              borderColor: err ? "#ef4444" : "#f97316"
            }}
            autoFocus
          />
          {err && (
            <p className="text-red-400 text-sm text-center mb-3">Pogrešna šifra</p>
          )}
          <button onClick={attempt}
            className="w-full py-4 rounded-2xl font-bold text-base"
            style={{ background: "#f97316", color: "#fff" }}>
            Prijava
          </button>
        </div>
      </div>
    </div>
  );
}
const mainSections = {
  jelo: [
    "Brunch meni",
    "Hladna predjela",
    "Topla međujela",
    "Supe i čorbe",
    "Pice",
    "Glavna jela - Riba",
    "Glavna jela - Piletina",
    "Glavna jela - Ćuretina",
    "Glavna jela - Svinjetina",
    "Glavna jela - Jagnjetina",
    "Glavna jela - Govedina",
    "Burgeri",
    "S vremena na vrijeme",
    "Trans Sibir Express",
    "Obrok salate",
    "Salate i dodaci",
    "Dječiji meni",
    "Deserti"
  ],
  pice: [
    "Topli napici",
    "Vode",
    "Cijeđeni sokovi",
    "Sokići",
    "Flaširano pivo",
    "Točeno pivo",
    "Žestice",
    "Likeri"
  ],
  vina: [
    "Vina"
  ]
};

export default function App() {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [waiterLoggedIn, setWaiterLoggedIn] = useState(false);
  const [staffRole, setStaffRole] = useState(() => localStorage.getItem("staffRole") || "waiter");
  const [cafeInfo, setCafeInfo] = useState(null);
  const [dark, setDark] = useState(false); // default light like screenshot
  const [lang, setLang] = useState("SR");
  const tx = t[lang];
  const [view, setView] = useState(() => {
    if (typeof window !== "undefined" && window.history.state && window.history.state.view) {
      return window.history.state.view;
    }
    return "customer";
  });
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [mainSection, setMainSection] = useState("jelo");
  const [cart, setCart] = useState({});
  const [notes, setNotes] = useState({});
  const [orders, setOrders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [myOrderId, setMyOrderId] = useState(() => localStorage.getItem("myOrderId"));
  const [myOrder, setMyOrder] = useState(null);
  const [menuData, setMenuData] = useState({});
  const [tableNumber, setTableNumber] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [waiterToast, setWaiterToast] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isClosingDetail, setIsClosingDetail] = useState(false);
  const detailModalRef = useRef(null);
  const detailContentRef = useRef(null);
  const detailTouchStartY = useRef(0);
  const detailIsSwiping = useRef(false);
  const customerTabsRef = useRef(null);

  const closeDetail = () => {
    setIsClosingDetail(true);
    if (detailModalRef.current) {
      detailModalRef.current.style.transform = "";
      detailModalRef.current.style.transition = "";
    }
    setTimeout(() => {
      setSelectedItem(null);
      setIsClosingDetail(false);
    }, 300); // matches the duration of animate-modalOut
  };

  useEffect(() => {
    const el = customerTabsRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollTo({
        left: el.scrollLeft + e.deltaY,
        behavior: "auto"
      });
    };

    let isDown = false;
    let startX;
    let scrollLeft;

    const onMouseDown = (e) => {
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      el.style.cursor = "grabbing";
    };
    const onMouseLeave = () => {
      isDown = false;
      el.style.cursor = "grab";
    };
    const onMouseUp = () => {
      isDown = false;
      el.style.cursor = "grab";
    };
    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeft - walk;
    };

    el.style.cursor = "grab";
    el.style.userSelect = "none";
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mousemove", onMouseMove);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  useEffect(() => {
    if (waiterToast) {
      const t = setTimeout(() => setWaiterToast(null), 5500);
      return () => clearTimeout(t);
    }
  }, [waiterToast]);

  useEffect(() => {
    if (selectedItem && !isClosingDetail) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedItem, isClosingDetail]);

  useEffect(() => {
    const modalEl = detailModalRef.current;
    if (!modalEl) return;

    const onTouchStart = (e) => {
      const touch = e.touches[0];
      const target = e.target;
      const isContent = detailContentRef.current && detailContentRef.current.contains(target);
      
      // If the touch started inside the scrollable content container
      // and it's not scrolled to the top, let the user scroll normally instead of dragging the sheet
      if (isContent && detailContentRef.current.scrollTop > 0) {
        detailIsSwiping.current = false;
        return;
      }

      detailTouchStartY.current = touch.clientY;
      detailIsSwiping.current = true;
      modalEl.style.transition = "none";
    };

    const onTouchMove = (e) => {
      if (!detailIsSwiping.current) return;
      const touch = e.touches[0];
      const diffY = touch.clientY - detailTouchStartY.current;

      if (diffY > 0) {
        // Dragging downwards
        if (e.cancelable) e.preventDefault();
        modalEl.style.transform = `translateY(${diffY}px)`;
      } else {
        // Dragging upwards
        modalEl.style.transform = "";
      }
    };

    const onTouchEnd = (e) => {
      if (!detailIsSwiping.current) return;
      detailIsSwiping.current = false;
      const touch = e.changedTouches[0];
      const diffY = touch.clientY - detailTouchStartY.current;

      if (diffY > 100) {
        // Swiped down past threshold: slide all the way off-screen and close
        setIsClosingDetail(true);
        modalEl.style.transition = "transform 0.25s ease-in";
        modalEl.style.transform = "translateY(100%)";
        setTimeout(() => {
          setSelectedItem(null);
          setIsClosingDetail(false);
        }, 250);
      } else {
        // Snap back to open position
        modalEl.style.transition = "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)";
        modalEl.style.transform = "";
      }
    };

    modalEl.addEventListener("touchstart", onTouchStart, { passive: true });
    modalEl.addEventListener("touchmove", onTouchMove, { passive: false });
    modalEl.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      modalEl.removeEventListener("touchstart", onTouchStart);
      modalEl.removeEventListener("touchmove", onTouchMove);
      modalEl.removeEventListener("touchend", onTouchEnd);
    };
  }, [selectedItem, isClosingDetail]);

  const lastBackTime = useRef(0);
  const [showExitToast, setShowExitToast] = useState(false);

  const [currentTime, setCurrentTime] = useState(Date.now());

  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const langDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (view === "waiter") {
      const timer = setInterval(() => {
        setCurrentTime(Date.now());
      }, 10000); // 10s tick
      return () => clearInterval(timer);
    }
  }, [view]);

  const getMinutesElapsed = (createdAtString) => {
    if (!createdAtString) return 0;
    const createdTime = new Date(createdAtString).getTime();
    const diffMs = currentTime - createdTime;
    return Math.max(0, Math.floor(diffMs / 60000));
  };

  const triggerVibrate = (ms = 15) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  };

  const toggleQuickNote = (itemId, tag) => {
    triggerVibrate(15);
    setNotes(prev => {
      const current = prev[itemId] || "";
      if (current.includes(tag)) {
        const regex = new RegExp(`(?:,\\s*)?${tag}|${tag}(?:,\\s*)?`);
        let cleaned = current.replace(regex, "").trim();
        if (cleaned.startsWith(",")) cleaned = cleaned.slice(1).trim();
        if (cleaned.endsWith(",")) cleaned = cleaned.slice(0, -1).trim();
        return { ...prev, [itemId]: cleaned };
      } else {
        const updated = current ? `${current}, ${tag}` : tag;
        return { ...prev, [itemId]: updated };
      }
    });
  };

  // Manage browser history back button (popstate)
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.replaceState({ view: "customer_exit" }, "");
      window.history.pushState({ view: "customer" }, "");

      const handlePopState = (event) => {
        const targetView = event.state?.view || "customer";

        if (targetView === "customer_exit") {
          const now = Date.now();
          if (now - lastBackTime.current < 2000) {
            window.history.go(-1);
          } else {
            lastBackTime.current = now;
            setShowExitToast(true);
            triggerVibrate(30);
            setTimeout(() => setShowExitToast(false), 2000);
            window.history.pushState({ view: "customer" }, "");
            setView("customer");
          }
        } else {
          setView(targetView);
          if (targetView === "customer") {
            setWaiterLoggedIn(false);
          }
        }
      };

      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, []);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Auto-scroll active category tab into view
  useEffect(() => {
    const activeEl = document.getElementById("active-tab");
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }
  }, [activeCategory]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = endX - touchStartX.current;
    const diffY = endY - touchStartY.current;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 60) {
      const curIdx = categories.indexOf(activeCategory);
      if (diffX < 0) {
        if (curIdx < categories.length - 1) {
          handleCatChange(categories[curIdx + 1]);
        }
      } else {
        if (curIdx > 0) {
          handleCatChange(categories[curIdx - 1]);
        }
      }
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTable = params.get("table");
    const urlTs = params.get("ts");
    
    const now = Date.now();
    const THREE_HOURS = 3 * 60 * 60 * 1000;

    let activeTable = null;
    let isQrCodeExpired = false;

    if (urlTs) {
      const qrTime = parseInt(urlTs) * 1000;
      if (now - qrTime > THREE_HOURS) {
        isQrCodeExpired = true;
      }
    }

    if (urlTable && !isQrCodeExpired) {
      activeTable = urlTable;
      localStorage.setItem("cafe_session", JSON.stringify({
        table: urlTable,
        startTime: now
      }));
      
      try {
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.error("Greška pri čišćenju URL-a:", e);
      }
    } else {
      const savedSessionRaw = localStorage.getItem("cafe_session");
      if (savedSessionRaw) {
        try {
          const session = JSON.parse(savedSessionRaw);
          if (now - session.startTime < THREE_HOURS) {
            activeTable = session.table;
          } else {
            localStorage.removeItem("cafe_session");
            setSessionExpired(true);
          }
        } catch (e) {
          console.error("Greška pri parsiranju sesije:", e);
        }
      }
    }

    if (activeTable) {
      setTableNumber(activeTable);
      setSessionExpired(false);
    } else {
      setSessionExpired(true);
    }
  }, []);
  const [addedId, setAddedId] = useState(null);
  const [addedCount, setAddedCount] = useState(0);
  const [catKey, setCatKey] = useState(0);

  const isWaiterActive = view === "waiter" && waiterLoggedIn;
  const isWaiterActiveRef = useRef(isWaiterActive);
  useEffect(() => {
    isWaiterActiveRef.current = isWaiterActive;
  }, [isWaiterActive]);

  const langRef = useRef(lang);
  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  const playNotificationSound = () => {
    try {
      console.log("[Audio] Pokušavam reprodukciju zvuka...");
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') {
        console.log("[Audio] AudioContext je suspendovan, vršim rezime (resume)...");
        audioCtx.resume();
      }
      const playNote = (frequency, startTime, duration) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(frequency, startTime);
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      const now = audioCtx.currentTime;
      playNote(1046.50, now, 0.6); // C6
      playNote(1567.98, now + 0.12, 1.0); // G6
      console.log("[Audio] Zvuk uspešno poslat na zvučnike.");
    } catch (e) {
      console.error("[Audio] Greška pri puštanju zvuka:", e);
    }
  };

  // Supabase Real-time Sync
  useEffect(() => {
    // 1. Fetch menu items
    const fetchMenuItems = async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("sort_order", { ascending: true });
      if (!error && data) {
        setMenuData(prev => {
          const grouped = {};
          // Preserve any existing categories (including empty ones created in session)
          Object.keys(prev).forEach(cat => {
            grouped[cat] = [];
          });
          // Group fetched items by category
          data.forEach(item => {
            const cat = item.category;
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push({
              id: item.id,
              name: item.name,
              name_en: item.name_en,
              desc: item.description,
              desc_en: item.description_en,
              price: parseFloat(item.price),
              img: item.image_url,
              category: item.category,
              badge: item.badge,
              orders: item.orders_count,
              sort_order: item.sort_order,
              is_available: item.is_available !== false,
              allergens: item.allergens
            });
          });
          return grouped;
        });
      }
    };

    // 2. Fetch active orders (non-delivered)
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .neq("status", "delivered")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setOrders(data.map(o => ({
          id: o.id,
          table: o.table_number,
          time: o.time_string,
          status: o.status,
          items: o.items,
          created_at: o.created_at
        })));
      }
    };

    // 3. Fetch active alerts
    const fetchAlerts = async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setAlerts(data.map(a => ({
          id: a.id,
          type: a.type,
          table: a.table_number,
          payMethod: a.pay_method,
          time: a.time_string,
          created_at: a.created_at
        })));
      }
    };

    // 4. Fetch cafe settings
    const fetchCafeInfo = async () => {
      const { data, error } = await supabase
        .from("cafe_info")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (!error && data) {
        setCafeInfo({
          name: data.name,
          tagline: data.tagline,
          logo: data.logo_url,
          emoji: data.emoji,
          logoBg: data.logo_bg,
          waiterPasscode: data.waiter_passcode || "1357",
          adminPassword: data.admin_password || "admin123"
        });
      }
    };

    fetchMenuItems();
    fetchOrders();
    fetchAlerts();
    fetchCafeInfo();

    // 5. Subscribe to menu_items changes
    const menuSub = supabase
      .channel("menu-items-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "menu_items" }, () => {
        fetchMenuItems();
      })
      .subscribe((status, err) => {
        console.log("[Realtime] Status pretplate za menu_items:", status, err || "");
      });

    // 6. Subscribe to orders table postgres changes
    const ordersSub = supabase
      .channel("orders-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        if (payload.eventType === "INSERT") {
          console.log("[Realtime] Nova porudžbina primljena:", payload.new);
          const newOrder = {
            id: payload.new.id,
            table: payload.new.table_number,
            time: payload.new.time_string,
            status: payload.new.status,
            items: payload.new.items,
            created_at: payload.new.created_at
          };
          setOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id)]);
          console.log("[Realtime] Da li je konobar aktivan (isWaiterActiveRef):", isWaiterActiveRef.current);
          if (isWaiterActiveRef.current) {
            playNotificationSound();
          }
        } else if (payload.eventType === "UPDATE") {
          if (payload.new.status === "delivered") {
            setOrders(prev => prev.filter(o => o.id !== payload.new.id));
          } else {
            setOrders(prev => {
              const existing = prev.find(o => o.id === payload.new.id);
              const wasNotReady = !existing || existing.status !== "ready";
              if (wasNotReady && payload.new.status === "ready" && isWaiterActiveRef.current) {
                setWaiterToast(langRef.current === "EN" ? `Food for Table ${payload.new.table_number} is ready!` : `Hrana za Sto ${payload.new.table_number} je spremna!`);
                playNotificationSound();
              }
              return prev.map(o => o.id === payload.new.id ? {
                ...o,
                status: payload.new.status,
                items: payload.new.items
              } : o);
            });
          }
        } else if (payload.eventType === "DELETE") {
          setOrders(prev => prev.filter(o => o.id !== payload.old.id));
        }
      })
      .subscribe((status, err) => {
        console.log("[Realtime] Status pretplate za orders:", status, err || "");
      });

    // 7. Subscribe to alerts table postgres changes
    const alertsSub = supabase
      .channel("alerts-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "alerts" }, (payload) => {
        if (payload.eventType === "INSERT") {
          console.log("[Realtime] Novi poziv konobara/računa primljen:", payload.new);
          const newAlert = {
            id: payload.new.id,
            type: payload.new.type,
            table: payload.new.table_number,
            payMethod: payload.new.pay_method,
            time: payload.new.time_string,
            created_at: payload.new.created_at
          };
          setAlerts(prev => [newAlert, ...prev.filter(a => a.id !== newAlert.id)]);
          console.log("[Realtime] Da li je konobar aktivan (isWaiterActiveRef):", isWaiterActiveRef.current);
          if (isWaiterActiveRef.current) {
            playNotificationSound();
          }
        } else if (payload.eventType === "DELETE") {
          setAlerts(prev => prev.filter(a => a.id !== payload.old.id));
        }
      })
      .subscribe((status, err) => {
        console.log("[Realtime] Status pretplate za alerts:", status, err || "");
      });

    // 8. Subscribe to cafe_info changes
    const cafeSub = supabase
      .channel("cafe-info-changes")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "cafe_info", filter: "id=eq.1" }, (payload) => {
        setCafeInfo({
          name: payload.new.name,
          tagline: payload.new.tagline,
          logo: payload.new.logo_url,
          emoji: payload.new.emoji,
          logoBg: payload.new.logo_bg,
          waiterPasscode: payload.new.waiter_passcode || "1357",
          adminPassword: payload.new.admin_password || "admin123"
        });
      })
      .subscribe((status, err) => {
        console.log("[Realtime] Status pretplate za cafe_info:", status, err || "");
      });

    return () => {
      supabase.removeChannel(menuSub);
      supabase.removeChannel(ordersSub);
      supabase.removeChannel(alertsSub);
      supabase.removeChannel(cafeSub);
    };
  }, []);

  // Sync specific client order status
  useEffect(() => {
    if (!myOrderId) {
      setMyOrder(null);
      return;
    }

    const fetchMyOrder = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", myOrderId)
        .maybeSingle();
      if (!error && data) {
        setMyOrder({
          id: data.id,
          table: data.table_number,
          time: data.time_string,
          status: data.status,
          items: data.items,
          created_at: data.created_at
        });
      }
    };

    fetchMyOrder();

    const myOrderSub = supabase
      .channel(`my-order-${myOrderId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${myOrderId}` }, (payload) => {
        setMyOrder(prev => ({
          id: payload.new.id,
          table: payload.new.table_number,
          time: payload.new.time_string,
          status: payload.new.status,
          items: payload.new.items,
          created_at: prev?.created_at || payload.new.created_at
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(myOrderSub);
    };
  }, [myOrderId]);

  // ── LIVE TIMER za status narudžbe ──
  const [statusElapsedSec, setStatusElapsedSec] = useState(0);
  useEffect(() => {
    if (view !== "status" || !myOrder?.created_at) {
      setStatusElapsedSec(0);
      return;
    }
    const getElapsed = () => {
      const diffMs = Date.now() - new Date(myOrder.created_at).getTime();
      return Math.max(0, Math.floor(diffMs / 1000));
    };
    setStatusElapsedSec(getElapsed());
    const interval = setInterval(() => setStatusElapsedSec(getElapsed()), 1000);
    return () => clearInterval(interval);
  }, [view, myOrder?.created_at]);

  const formatElapsed = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    if (m === 0) return `${s}s`;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const isFoodItem = (itemName) => {
    for (const cat of mainSections.jelo) {
      const list = menuData[cat] || [];
      if (list.some(i => i.name === itemName)) return true;
    }
    return false;
  };

  const handleMainSectionChange = (sec) => {
    triggerVibrate(15);
    setMainSection(sec);
    
    const availableCats = Object.keys(menuData);
    let catsForSec = [];
    if (sec === "jelo") {
      catsForSec = ["Popular", ...mainSections.jelo.filter(c => availableCats.includes(c))];
    } else if (sec === "pice") {
      catsForSec = mainSections.pice.filter(c => availableCats.includes(c));
    } else {
      catsForSec = mainSections.vina.filter(c => availableCats.includes(c));
    }
    
    if (catsForSec.length > 0) {
      setActiveCategory(catsForSec[0]);
    } else {
      setActiveCategory("");
    }
    setCatKey(k => k + 1);
  };

  const handleCatChange = (cat) => {
    setActiveCategory(cat);
    setCatKey(k => k + 1);
  };
  const [showCallModal, setShowCallModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [callSent, setCallSent] = useState(false);
  const [billSent, setBillSent] = useState(false);
  const [billPayMethod, setBillPayMethod] = useState(null);

  // theme
  const bg       = dark ? "#0f0a05" : "#ffffff";
  const bg2      = dark ? "#1c1410" : "#fafafa";
  const cardBg   = dark ? "#1c1410" : "#ffffff";
  const imgBg    = dark ? "#2a1f14" : "#f5f0e8";
  const textMain = dark ? "#ffffff" : "#1a1208";
  const textSub  = dark ? "#78716c" : "#9ca3af";
  const textPrice= dark ? "#f97316" : "#f97316";
  const borderCol= dark ? "#2a2220" : "#f0ece8";
  const tabActiveTxt = dark ? "#f97316" : "#f97316";
  const tabInactiveTxt = dark ? "#71717a" : "#9ca3af";
  const headerBg = dark ? "#0f0a05" : "#ffffff";

  const allItems = Object.values(menuData).flat();
  const cartItems = Object.values(cart);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const navigate = (to) => {
    if (to === "customer") {
      setWaiterLoggedIn(false);
      if (to !== view) {
        window.history.replaceState({ view: "customer_exit" }, "");
        window.history.pushState({ view: "customer" }, "");
      }
    } else if (to !== view) {
      window.history.pushState({ view: to }, "");
    }
    setView(to);
    window.scrollTo(0, 0);
  };

  const addToCart = (item) => {
    triggerVibrate(15);
    setCart(p => ({ ...p, [item.id]: { ...item, qty: (p[item.id]?.qty || 0) + 1 } }));
    setAddedId(item.id);
    setAddedCount(c => c + 1);
    setTimeout(() => setAddedId(null), 500);
  };
  const removeFromCart = (id) => {
    triggerVibrate(15);
    setCart(p => {
      const u = { ...p };
      if (u[id].qty <= 1) delete u[id]; else u[id].qty -= 1;
      return u;
    });
  };

  const placeOrder = async () => {
    if (!tableNumber || sessionExpired) {
      alert("Molimo skenirajte QR kod na stolu kako biste poslali narudžbinu.");
      return;
    }
    const timeStr = new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" });
    const orderItems = cartItems.map(i => ({ name: i.name, qty: i.qty, note: notes[i.id] || "" }));
    
    const { data, error } = await supabase
      .from("orders")
      .insert({
        table_number: tableNumber,
        time_string: timeStr,
        status: "new",
        items: orderItems
      })
      .select()
      .single();
      
    if (!error && data) {
      triggerVibrate(35);
      setMyOrderId(data.id);
      localStorage.setItem("myOrderId", data.id);
      setCart({});
      setNotes({});
      navigate("status");
    } else {
      console.error("Error placing order:", error);
      alert("Došlo je do greške prilikom slanja porudžbine. Molimo pokušajte ponovo.");
    }
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);
    if (error) {
      console.error("Error updating order status:", error);
    }
  };

  const toggleItemDelivered = async (order, itemIndex) => {
    const updatedItems = order.items.map((item, idx) => 
      idx === itemIndex ? { ...item, delivered: !item.delivered } : item
    );
    const allDelivered = updatedItems.every(item => item.delivered);
    const status = allDelivered ? "delivered" : order.status;
    
    const { error } = await supabase
      .from("orders")
      .update({ items: updatedItems, status })
      .eq("id", order.id);
    if (error) {
      console.error("Error updating item delivery:", error);
    }
  };

  const activeOrders = orders.filter(o => o.status !== "delivered");

  const sendCall = async () => {
    if (!tableNumber || sessionExpired) {
      alert("Molimo skenirajte QR kod na stolu kako biste pozvali konobara.");
      return;
    }
    const timeStr = new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" });
    const { error } = await supabase
      .from("alerts")
      .insert({
        type: "call",
        table_number: tableNumber,
        time_string: timeStr
      });
    if (!error) {
      triggerVibrate(35);
      setCallSent(true);
      setTimeout(() => { setCallSent(false); setShowCallModal(false); }, 2200);
    } else {
      console.error("Error sending call alert:", error);
    }
  };

  const sendBill = async (method) => {
    if (!tableNumber || sessionExpired) {
      alert("Molimo skenirajte QR kod na stolu kako biste zatražili račun.");
      return;
    }
    setBillPayMethod(method);
    const timeStr = new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" });
    const { error } = await supabase
      .from("alerts")
      .insert({
        type: "bill",
        table_number: tableNumber,
        time_string: timeStr,
        pay_method: method
      });
    if (!error) {
      triggerVibrate(35);
      setBillSent(true);
      setTimeout(() => { setBillSent(false); setShowBillModal(false); setBillPayMethod(null); }, 2200);
    } else {
      console.error("Error sending bill alert:", error);
    }
  };

  const dismissAlert = async (id) => {
    const { error } = await supabase
      .from("alerts")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Error dismissing alert:", error);
    }
  };

  // Items to show per category
  const getItems = () => {
    if (activeCategory === "Popular") {
      return allItems.filter(i => i.badge === "popular" || i.badge === "recommended").sort((a, b) => b.orders - a.orders);
    }
    return menuData[activeCategory] || [];
  };

  const renderLangBar = () => (
    <div className="relative inline-block" ref={langDropdownRef}>
      <button onClick={() => setShowLangDropdown(!showLangDropdown)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all active:scale-95 border shrink-0"
        style={{ background: dark ? "#292524" : "#f5f0e8", color: textMain, borderColor: borderCol }}>
        {lang}
      </button>
      {showLangDropdown && (
        <div className="absolute right-0 mt-1.5 py-1 w-16 rounded-xl shadow-lg border z-50 animate-popIn"
          style={{ background: cardBg, borderColor: borderCol }}>
          {["SR","BS","EN"].map(l => (
            <button key={l} onClick={() => { setLang(l); setShowLangDropdown(false); }}
              className="w-full text-center py-2 text-xs font-semibold hover:bg-orange-50 dark:hover:bg-zinc-800 transition-colors"
              style={{ color: lang===l ? "#f97316" : textMain }}>
              {l}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderBackBtn = (to) => (
    <button onClick={() => {
      if (window.history.state && window.history.state.view && window.history.state.view !== "customer") {
        window.history.back();
      } else {
        navigate(to);
      }
    }} className="w-9 h-9 rounded-full flex items-center justify-center"
      style={{ background: dark ? "#292524" : "#f5f0e8", color: "#f97316" }}>←</button>
  );

  // ── SKELETON ROW FOR LOADING ──
  const renderSkeletonRow = (idx) => {
    const skelClass = dark ? "shimmer-dark" : "shimmer-light";
    return (
      <div key={`skel-${idx}`} className="animate-fadeIn" style={{ borderBottom: `1px solid ${borderCol}` }}>
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Image */}
          <div className={`w-24 h-24 rounded-2xl shrink-0 ${skelClass}`} />
          {/* Text content */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <div className={`h-5 w-3/4 rounded-lg ${skelClass}`} />
            <div className={`h-3.5 w-1/2 rounded-md ${skelClass}`} />
            <div className="flex items-center justify-between mt-2">
              <div className={`h-5 w-16 rounded-md ${skelClass}`} />
              <div className={`h-9 w-20 rounded-full ${skelClass}`} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── MENU ITEM ROW (horizontal layout) ──
  const renderMenuRow = (item, idx) => {
    const qty = cart[item.id]?.qty || 0;
    const justAdded = addedId === item.id;
    const badge = item.badge ? badgeConfig[item.badge] : null;
    const isAvailable = item.is_available !== false;
    return (
      <div key={`${item.id}-${activeCategory}`} className="animate-fadeIn row-press cursor-pointer"
        onClick={() => setSelectedItem(item)}
        style={{ animationDelay: `${idx * 0.05}s`, borderBottom: `1px solid ${borderCol}` }}>
        <div className="flex items-center gap-3 px-4 py-3" style={{ opacity: isAvailable ? 1 : 0.6 }}>
          {/* Image */}
          <div className="w-24 h-24 rounded-2xl overflow-hidden flex items-center justify-center shrink-0"
            style={{ background: imgBg }}>
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={e => { e.target.style.display="none"; e.target.parentNode.innerHTML=`<span style="font-size:2.5rem">${item.emoji||"🍽️"}</span>`; }}
            />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            {badge && (
              <p className="text-xs font-bold mb-0.5" style={{ color: badge.color }}>
                ⭐ {tx[`badge${item.badge.charAt(0).toUpperCase() + item.badge.slice(1)}`]}
              </p>
            )}
            <p className="font-bold text-base leading-tight" style={{ color: textMain }}>
              {lang === "EN" ? (item.name_en || item.name) : item.name}
            </p>
            <p className="text-xs mt-0.5 line-clamp-1" style={{ color: textSub }}>
              {lang === "EN" ? (item.desc_en || item.desc) : item.desc}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="font-bold text-base" style={{ color: textPrice }}>{item.price.toFixed(2)} KM</span>
              {!isAvailable ? (
                <button disabled onClick={e => e.stopPropagation()}
                  className="font-bold px-4 py-2.5 rounded-full text-xs cursor-not-allowed"
                  style={{ background: dark ? "#292524" : "#f5f0e8", color: textSub, minWidth: "80px" }}>
                  Rasprodato
                </button>
              ) : qty === 0 ? (
                <div className="relative" style={{ minWidth: "80px" }} onClick={e => e.stopPropagation()}>
                  <button onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                    className={`font-bold px-5 py-2.5 rounded-full text-sm w-full ${justAdded ? "animate-addBounce" : ""}`}
                    style={{ background: "#f97316", color: "#fff", position: "relative", zIndex: 1 }}>
                    + {tx.add}
                  </button>
                  {justAdded && (
                    <span
                      key={`ring-${item.id}-${addedCount}`}
                      className="animate-ringPulse"
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "9999px",
                        border: "2.5px solid #f97316",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </div>
              ) : (
                <div className={`flex items-center gap-2 ${justAdded ? "animate-bounceIn" : ""}`} onClick={e => e.stopPropagation()}>
                  <button onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl"
                    style={{ background: dark ? "#292524" : "#f5f0e8", color: textMain }}>−</button>
                  <span className="font-bold text-base w-5 text-center" style={{ color: textMain }}>{qty}</span>
                  <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl ${justAdded ? "animate-addBounce" : ""}`}
                      style={{ background: "#f97316", color: "#fff", position: "relative", zIndex: 1 }}>+</button>
                    {justAdded && (
                      <span
                        key={`ring2-${item.id}-${addedCount}`}
                        className="animate-ringPulse"
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "9999px",
                          border: "2.5px solid #f97316",
                          pointerEvents: "none",
                        }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── STATUS VIEW ──
  if (!showSplash && view === "status") {
    const steps = ["new", "preparing", "ready", "delivered"];
    const cur = myOrder ? steps.indexOf(myOrder.status === "pending" ? "new" : myOrder.status) : 0;
    const icons = ["📋", "👨‍🍳", "🍳", "✅"];
    const labels = [tx.statusNew, tx.statusPreparing, tx.statusReady || "Spremno", tx.statusDelivered];
    return (
      <div className="min-h-screen flex flex-col font-body animate-fadeIn" style={{ background: bg }}>
        <style>{globalStyles}</style>
        <div className="flex items-center gap-3 px-4 pt-6 pb-4 border-b" style={{ borderColor: borderCol, background: headerBg }}>
          {renderBackBtn("customer")}
          <h2 className="font-semibold text-base" style={{ color: textMain }}>{tx.myOrderStatus}</h2>
          <div className="ml-auto">{renderLangBar()}</div>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between mb-8 relative px-2">
            <div className="absolute left-6 right-6 top-5 h-0.5 z-0" style={{ background: borderCol }}>
              <div className="h-full bg-orange-500 transition-all duration-700" style={{ width: `${(cur/3)*100}%` }} />
            </div>
            {labels.map((label, i) => (
              <div key={i} className="flex flex-col items-center z-10 gap-2 w-16">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-500"
                  style={{ background: i<=cur ? "#f97316" : dark ? "#292524" : "#f5f0e8", boxShadow: i===cur ? "0 0 0 4px rgba(249,115,22,0.2)" : "none" }}>
                  {icons[i]}
                </div>
                <span className="text-xs font-medium text-center leading-tight" style={{ color: i<=cur ? "#f97316" : textSub }}>{label}</span>
              </div>
            ))}
          </div>
          {/* ── LIVE TIMER KARTICA ── */}
          {myOrder?.status !== "delivered" && myOrder?.created_at && (() => {
            const mins = Math.floor(statusElapsedSec / 60);
            const isReadyStatus = myOrder?.status === "ready";
            const timerColor = isReadyStatus ? "#10b981" : mins >= 15 ? "#ef4444" : mins >= 8 ? "#f59e0b" : "#22c55e";
            const timerBg    = isReadyStatus
              ? (dark ? "#062016" : "#ecfdf5")
              : mins >= 15
              ? (dark ? "#270f0f" : "#fef2f2")
              : mins >= 8
              ? (dark ? "#2d2208" : "#fef3c7")
              : (dark ? "#0d1f0d" : "#f0fdf4");
            const timerBorder = isReadyStatus ? "#10b981" : mins >= 15 ? "#ef4444" : mins >= 8 ? "#f59e0b" : "#22c55e";
            const timerLabel  = isReadyStatus
              ? (lang === "EN" ? "Ready for pickup!" : "Spremno za preuzimanje!")
              : mins >= 15
              ? (lang === "EN" ? "Taking longer than usual" : "Duže od uobičajenog")
              : mins >= 8
              ? (lang === "EN" ? "Almost ready" : "Skoro je gotovo")
              : (lang === "EN" ? "In preparation" : "U pripremi");
            return (
              <div className="rounded-2xl p-4 mb-4 animate-timerGlow flex items-center gap-4"
                style={{ background: timerBg, border: `1.5px solid ${timerBorder}` }}>
                {/* Pulsing dot */}
                <div className="relative shrink-0">
                  <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: timerColor }} />
                  <div className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ background: timerColor }} />
                </div>
                {/* Timer digits */}
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-widest font-bold mb-0.5" style={{ color: timerColor }}>
                    {timerLabel}
                  </p>
                  <p className="font-black text-3xl leading-none animate-timerTick font-body tabular-nums"
                    style={{ color: timerColor, fontVariantNumeric: "tabular-nums" }}>
                    {formatElapsed(statusElapsedSec)}
                  </p>
                </div>
                {/* Clock icon */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={timerColor} strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-60">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
            );
          })()}

          <div className="rounded-2xl p-4 mb-4" style={{ background: cardBg, border: `1px solid ${borderCol}` }}>
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold" style={{ color: "#f97316" }}>{tx.table} {tableNumber}</span>
              <span className="text-sm" style={{ color: textSub }}>{myOrder?.time}</span>
            </div>
            {myOrder?.items.map((item, i) => {
              const isDelivered = item.delivered === true;
              return (
                <div key={i} className="py-2 border-b last:border-0" style={{ borderColor: borderCol, opacity: isDelivered ? 0.5 : 1 }}>
                  <div className="flex justify-between text-sm items-center">
                    <span style={{ color: textMain, textDecoration: isDelivered ? "line-through" : "none" }} className="flex items-center gap-1.5">
                      {isDelivered && <span className="text-xs text-green-500 font-bold">✓</span>}
                      {lang === "EN" ? (() => {
                        for (const cat in menuData) {
                          const found = menuData[cat].find(i => i.name === item.name);
                          if (found && found.name_en) return found.name_en;
                        }
                        return item.name;
                      })() : item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      {isDelivered && (
                        <span className="text-[10px] uppercase font-bold text-green-500 bg-green-500/10 dark:bg-green-500/20 px-2 py-0.5 rounded-md">
                          {lang === "EN" ? "Delivered" : "Dostavljeno"}
                        </span>
                      )}
                      <span style={{ color: textSub }}>× {item.qty}</span>
                    </div>
                  </div>
                  {item.note ? <p className="text-orange-500 text-xs mt-0.5 italic">"{item.note}"</p> : null}
                </div>
              );
            })}
          </div>
          {myOrder?.status === "delivered" && (
            <div className="text-center animate-bounceIn">
              <div className="text-5xl mb-3">🎉</div>
              <p className="text-green-500 font-bold text-lg mb-1">{tx.statusDelivered}!</p>
              <button onClick={() => { setMyOrderId(null); localStorage.removeItem("myOrderId"); navigate("customer"); }}
                className="bg-orange-500 text-white font-bold px-8 py-3 rounded-full mt-3">
                {tx.backToMenu}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── CART VIEW ──
  if (!showSplash && view === "cart") {
    return (
      <div className="fixed inset-0 flex flex-col font-body animate-fadeIn" style={{ background: bg }}>
        <style>{globalStyles}</style>
        <div className="flex items-center gap-3 px-4 pt-6 pb-4 border-b shrink-0" style={{ borderColor: borderCol, background: headerBg }}>
          {renderBackBtn("customer")}
          <h2 className="font-semibold text-base" style={{ color: textMain }}>{tx.yourOrder}</h2>
        </div>
        <div className="flex-1 overflow-y-auto pb-6">
          {cartItems.length === 0
            ? <EmptyState icon="🛒" title={tx.empty} hint={tx.emptyHint} dark={dark} />
            : cartItems.map((item, idx) => (
              <div key={item.id} className="animate-fadeIn" style={{ animationDelay: `${idx*0.05}s`, borderBottom: `1px solid ${borderCol}` }}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-2xl" style={{ background: imgBg }}>
                    {item.img ? <img src={item.img} className="w-full h-full object-cover rounded-xl" alt="" /> : item.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm" style={{ color: textMain }}>
                      {lang === "EN" ? (item.name_en || item.name) : item.name}
                    </p>
                    <p className="font-bold text-sm mt-0.5" style={{ color: "#f97316" }}>{(item.price * item.qty).toFixed(2)} KM</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: dark ? "#292524" : "#f5f0e8", color: textMain }}>−</button>
                    <span className="font-bold w-4 text-center text-sm" style={{ color: textMain }}>{item.qty}</span>
                    <button onClick={() => addToCart(item)} className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: "#f97316", color: "#fff" }}>+</button>
                  </div>
                </div>
                <div className="px-4 pb-3 flex flex-col gap-2">
                  {(() => {
                    const catKey = (item.category || "").toLowerCase();
                    const noteList = tx.quickNotes?.[catKey] || tx.quickNotes?.default || [];
                    if (noteList.length === 0) return null;
                    return (
                      <div className="flex flex-wrap gap-1.5 mb-0.5">
                        {noteList.map(noteTag => {
                          const isSelected = (notes[item.id] || "").includes(noteTag);
                          return (
                            <button key={noteTag}
                              onClick={() => toggleQuickNote(item.id, noteTag)}
                              className="text-[10px] font-bold px-2.5 py-1 rounded-full transition-all active:scale-95"
                              style={{
                                background: isSelected ? "#f97316" : (dark ? "#292524" : "#f5f0e8"),
                                color: isSelected ? "#fff" : textMain,
                                border: `1px solid ${isSelected ? "#f97316" : borderCol}`
                              }}>
                              {noteTag}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}
                  <input type="text" placeholder={tx.addNote} value={notes[item.id] || ""}
                    onChange={e => setNotes(p => ({ ...p, [item.id]: e.target.value }))}
                    className="w-full text-xs rounded-xl px-3 py-2 outline-none border"
                    style={{ background: bg2, color: textMain, borderColor: notes[item.id] ? "#f97316" : borderCol }} />
                </div>
              </div>
            ))
          }
        </div>
        {cartItems.length > 0 && (
          <div className="p-4 border-t shrink-0" style={{ background: bg, borderColor: borderCol }}>
            <div className="flex justify-between mb-3">
              <span style={{ color: textSub }}>{tx.total}</span>
              <span className="font-bold text-lg" style={{ color: textMain }}>{cartTotal.toFixed(2)} KM</span>
            </div>
            <button onClick={placeOrder} className="w-full font-bold py-4 rounded-2xl text-base"
              style={{ background: "#f97316", color: "#fff" }}>
              {tx.placeOrder}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── SUPER ADMIN VIEW ──
  if (!showSplash && view === "superadmin") {
    return (
      <SuperAdmin
        dark={dark}
        cafeInfo={cafeInfo}
        setCafeInfo={setCafeInfo}
        onBack={() => navigate("customer")}
      />
    );
  }

  // ── ADMIN VIEW ──
  if (!showSplash && view === "admin") {
    return (
      <AdminPanel
        menuData={menuData}
        setMenuData={setMenuData}
        cafeInfo={cafeInfo}
        setCafeInfo={setCafeInfo}
        dark={dark}
        onBack={() => {
          if (window.history.state && window.history.state.view && window.history.state.view !== "customer") {
            window.history.back();
          } else {
            navigate("customer");
          }
        }}
      />
    );
  }

  // ── WAITER VIEW ──
  if (!showSplash && view === "waiter") {
    if (!waiterLoggedIn) {
      return (
        <WaiterLoginScreen
          onLogin={() => setWaiterLoggedIn(true)}
          onBack={() => {
            if (window.history.state && window.history.state.view && window.history.state.view !== "customer") {
              window.history.back();
            } else {
              navigate("customer");
            }
          }}
          onAdminNavigate={() => navigate("admin")}
          dark={dark}
          textMain={textMain}
          textSub={textSub}
          borderCol={borderCol}
          bg={bg}
          cardBg={cardBg}
          waiterPasscode={cafeInfo?.waiterPasscode || "1357"}
        />
      );
    }
    return (
      <div className="h-screen flex flex-col font-body animate-fadeIn" style={{ background: dark ? "#0a0a0a" : "#f9f9f9" }}>
        <style>{globalStyles}</style>

        {/* Waiter Toast Notification Banner */}
        {waiterToast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 animate-slideDown">
            <div className="rounded-2xl p-4 shadow-xl flex items-center gap-3 border backdrop-blur-md"
              style={{
                background: dark ? "rgba(6,95,70,0.85)" : "rgba(236,253,245,0.92)",
                borderColor: dark ? "#059669" : "#10b981",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)"
              }}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xl shrink-0 animate-bounce">
                🔔
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-widest font-extrabold text-emerald-600 dark:text-emerald-300">
                  {lang === "EN" ? "Kitchen Alert" : "Obavještenje iz kuhinje"}
                </p>
                <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50 mt-0.5">
                  {waiterToast}
                </p>
              </div>
              <button onClick={() => setWaiterToast(null)} className="w-8 h-8 rounded-full flex items-center justify-center text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 active:scale-90 shrink-0 text-lg font-bold">
                ×
              </button>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: borderCol, background: headerBg }}>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: textSub }}>Panel</p>
              <h1 className="text-xl font-bold" style={{ color: textMain }}>{tx.orders}</h1>
            </div>
            
            {/* Toggle Role */}
            <div className="flex bg-orange-50 dark:bg-orange-950/20 p-1 rounded-xl border border-orange-200/50 dark:border-orange-900/30">
              <button onClick={() => { setStaffRole("waiter"); localStorage.setItem("staffRole", "waiter"); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 active:scale-95 ${staffRole === "waiter" ? "bg-orange-500 text-white shadow-sm" : "text-orange-500"}`}>
                <span>💁</span> {lang === "EN" ? "Waiter" : "Konobar"}
              </button>
              <button onClick={() => { setStaffRole("kitchen"); localStorage.setItem("staffRole", "kitchen"); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 active:scale-95 ${staffRole === "kitchen" ? "bg-orange-500 text-white shadow-sm" : "text-orange-500"}`}>
                <span>👨‍🍳</span> {lang === "EN" ? "Kitchen" : "Kuhinja"}
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setDark(d => !d)} className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: dark ? "#292524" : "#f5f0e8" }}>{dark ? "🌙" : "☀️"}</button>
            <button onClick={() => navigate("admin")} className="text-sm border px-4 py-2 rounded-full font-semibold transition-all active:scale-95 animate-pulse-soft"
              style={{ color: "#f97316", borderColor: "#f97316" }}>Admin</button>
            <button onClick={() => { setWaiterLoggedIn(false); navigate("customer"); }} className="text-sm border px-4 py-2 rounded-full transition-all active:scale-95"
              style={{ color: "#f97316", borderColor: "#f97316" }}>Meni →</button>
          </div>
        </div>

        {/* ── TABLE OVERVIEW GRID ── */}
        <div className="px-6 py-3 border-b shrink-0 flex items-center gap-4 overflow-x-auto" style={{ borderColor: borderCol, background: dark ? "#111" : "#fff" }}>
          <span className="text-xs uppercase tracking-widest font-black shrink-0" style={{ color: textSub }}>Pregled stolova:</span>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(tNum => {
              const tableString = String(tNum);
              const hasActiveCall = staffRole !== "kitchen" && alerts.some(a => String(a.table) === tableString);
              const hasActiveOrder = activeOrders.some(o => String(o.table) === tableString && (staffRole !== "kitchen" || o.items.some(item => isFoodItem(item.name))));
              
              let tableStatusColor = dark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-500";
              let borderColOverride = dark ? "border-zinc-700" : "border-zinc-200";
              let animationClass = "";

              if (hasActiveCall) {
                tableStatusColor = "bg-orange-500 text-white font-bold";
                animationClass = "animate-pulse";
                borderColOverride = "border-orange-600 shadow-[0_0_8px_rgba(249,115,22,0.3)]";
              } else if (hasActiveOrder) {
                tableStatusColor = "bg-blue-600 text-white font-bold";
                borderColOverride = "border-blue-700";
              }

              return (
                <div key={tNum} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs border ${tableStatusColor} ${borderColOverride} ${animationClass}`}
                  style={{ transition: "all 0.25s ease" }}
                  title={`${hasActiveCall ? "🙋 Poziv" : ""} ${hasActiveOrder ? "📋 Narudžba" : ""}`}>
                  {tNum}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left Panel: Alerts (Only for Waiters) */}
          {staffRole !== "kitchen" && (
            <div className={`w-full md:w-80 lg:w-96 shrink-0 border-b md:border-b-0 md:border-r flex flex-col min-h-0 ${alerts.length === 0 ? "hidden md:flex" : "flex"}`}
              style={{ borderColor: borderCol, background: dark ? "#0f0f0f" : "#fcfcfc" }}>
              <div className="p-4 border-b shrink-0 flex items-center justify-between" style={{ borderColor: borderCol }}>
                <span className="text-xs uppercase tracking-widest font-bold" style={{ color: textSub }}>{tx.callsAlerts}</span>
                {alerts.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-2.5 py-0.5 rounded-full font-black animate-pulse">
                    {alerts.length}
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {alerts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-40">
                    <span className="text-3xl mb-2">🔔</span>
                    <p className="text-xs" style={{ color: textSub }}>Nema aktivnih poziva</p>
                  </div>
                ) : (
                  alerts.map(a => {
                    const mins = getMinutesElapsed(a.created_at);
                    const isRed = mins >= 10;
                    const isYellow = mins >= 5 && mins < 10;
                    
                    const alertBg = isRed
                      ? (dark ? "#270f0f" : "#fef2f2")
                      : isYellow
                      ? (dark ? "#2d2208" : "#fef3c7")
                      : a.type === "call"
                      ? (dark ? "#2d1a08" : "#fff7ed")
                      : (dark ? "#0d1f0d" : "#f0fdf4");

                    const alertBorder = isRed
                      ? "#ef4444"
                      : isYellow
                      ? "#f59e0b"
                      : a.type === "call"
                      ? "#f97316"
                      : "#22c55e";

                    const pulseClass = (isRed || isYellow) ? "animate-pulse" : "";

                    return (
                      <div key={a.id} className={`rounded-2xl p-4 flex flex-col gap-3 animate-fadeIn border transition-all hover:scale-[1.02] ${pulseClass}`}
                        style={{ 
                          background: alertBg, 
                          borderColor: alertBorder 
                        }}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-extrabold text-xs" style={{ color: textMain }}>
                              {a.type==="call" ? tx.callWaiterAlert : tx.billAlert}
                            </p>
                            <p className="text-2xl font-black mt-1" style={{ color: isRed ? "#ef4444" : isYellow ? "#f59e0b" : (a.type==="call" ? "#f97316" : "#22c55e") }}>
                              {a.table}
                            </p>
                          </div>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1" style={{ background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)", color: isRed ? "#ef4444" : isYellow ? "#f59e0b" : textSub }}>
                            <span>⏱️ {mins}m</span>
                            <span className="opacity-40">•</span>
                            <span>{a.time}</span>
                          </span>
                        </div>
                      
                      {a.payMethod && (
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-green-600 dark:text-green-400">
                          <span>{a.payMethod === "card" ? `💳 ${tx.payCard}` : `💵 ${tx.payCash}`}</span>
                        </div>
                      )}
                      
                      <button onClick={() => dismissAlert(a.id)} className="w-full font-bold py-2.5 rounded-xl text-xs transition-all active:scale-95"
                        style={{ 
                          background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)", 
                          color: textMain 
                        }}>
                        {tx.dismiss}
                      </button>
                    </div>
                  )})
                )}
              </div>
            </div>
          )}

          {/* Right Panel: Orders Grid */}
          {(() => {
            const displayOrders = staffRole === "kitchen"
              ? activeOrders.filter(order => (order.status === "new" || order.status === "preparing") && order.items.some(item => isFoodItem(item.name)))
              : activeOrders;

            return (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="p-4 border-b shrink-0 flex items-center justify-between shadow-sm md:shadow-none" style={{ borderColor: borderCol }}>
                  <span className="text-xs uppercase tracking-widest font-bold" style={{ color: textSub }}>
                    {staffRole === "kitchen" 
                      ? (lang === "EN" ? "Kitchen Orders" : "Kuhinjske narudžbe") 
                      : (lang === "EN" ? "Active Orders" : "Aktivne Narudžbe")}
                  </span>
                  {displayOrders.length > 0 && (
                    <span className="bg-orange-500 text-white text-[10px] px-2.5 py-0.5 rounded-full font-black animate-scaleIn">
                      {displayOrders.length}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                  {displayOrders.length === 0 ? (
                    <EmptyState 
                      icon={staffRole === "kitchen" ? "👨‍🍳" : "🍽️"} 
                      title={staffRole === "kitchen" ? (lang === "EN" ? "No kitchen orders" : "Nema narudžbi za kuhinju") : tx.noOrders} 
                      hint={staffRole === "kitchen" ? (lang === "EN" ? "Waiting for food orders..." : "Čekamo nove narudžbe za hranu...") : tx.noOrdersHint} 
                      dark={dark} 
                    />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {displayOrders.map((order, idx) => {
                        const orderStatus = order.status === "pending" ? "new" : order.status;
                        const mins = getMinutesElapsed(order.created_at);
                        const isRed = mins >= 10;
                        const isYellow = mins >= 5 && mins < 10;

                        const orderBg = isRed
                          ? (dark ? "#270f0f" : "#fef2f2")
                          : isYellow
                          ? (dark ? "#2d2208" : "#fef3c7")
                          : cardBg;

                        const orderBorder = isRed
                          ? "#ef4444"
                          : isYellow
                          ? "#f59e0b"
                          : orderStatus === "new"
                          ? "#f97316"
                          : orderStatus === "ready"
                          ? "#10b981"
                          : borderCol;

                        const pulseClass = (isRed || isYellow) ? "animate-pulse" : "";
                        const itemsToRender = staffRole === "kitchen"
                          ? order.items.filter(item => isFoodItem(item.name))
                          : order.items;

                        return (
                          <div key={order.id} className={`rounded-3xl p-5 flex flex-col justify-between animate-fadeIn border shadow-sm transition-all hover:shadow-md hover:scale-[1.01] ${pulseClass}`} 
                            style={{ 
                              background: orderBg, 
                              borderColor: orderBorder,
                              boxShadow: orderStatus === "new" && !isRed && !isYellow ? "0 4px 20px rgba(249,115,22,0.08)" : "none",
                              animationDelay: `${idx*0.05}s`
                            }}>
                            <div>
                              {/* Header */}
                              <div className="flex items-center justify-between mb-4 border-b pb-3" style={{ borderColor: borderCol }}>
                                <div>
                                  <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: textSub }}>Sto</span>
                                  <span className="font-black text-3xl" style={{ color: textMain }}>{order.table}</span>
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                  <span className="text-xs font-semibold flex items-center gap-1" style={{ color: isRed ? "#ef4444" : isYellow ? "#f59e0b" : textSub }}>
                                    <span>⏱️ {mins}m</span>
                                    <span className="opacity-40">•</span>
                                    <span>{order.time}</span>
                                  </span>
                                  <span className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full text-white ${statusColor[orderStatus]}`}>
                                    {tx[`status${orderStatus.charAt(0).toUpperCase()+orderStatus.slice(1)}`]}
                                  </span>
                                </div>
                              </div>

                              {/* Items */}
                              <div className="space-y-3 mb-6">
                                {itemsToRender.map((item, i) => {
                                  // In waiter view, show if food items are ready if order is preparing
                                  const isItemFood = isFoodItem(item.name);
                                  const showFoodReadyBadge = staffRole === "waiter" && isItemFood && orderStatus === "ready";
                                  const isDelivered = item.delivered === true;
                                  const originalIndex = order.items.indexOf(item);
                                  
                                  return (
                                    <div key={i} className="flex flex-col pb-2 last:pb-0 border-b border-dashed last:border-0" style={{ borderColor: borderCol, opacity: isDelivered ? 0.45 : 1 }}>
                                      <div className="flex justify-between items-start text-sm">
                                        <div className="flex items-center flex-1 pr-2 min-w-0">
                                          {staffRole === "waiter" && (
                                            <button 
                                              onClick={() => toggleItemDelivered(order, originalIndex)}
                                              className="w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 mr-2"
                                              style={{
                                                borderColor: isDelivered ? "#10b981" : borderCol,
                                                backgroundColor: isDelivered ? "#10b981" : (dark ? "#2a2220" : "#fff"),
                                                color: "#fff"
                                              }}
                                            >
                                              {isDelivered && (
                                                <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                  <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                              )}
                                            </button>
                                          )}
                                          <div className="flex flex-col min-w-0">
                                            <span className="font-bold truncate" style={{ color: textMain, textDecoration: isDelivered ? "line-through" : "none" }}>{item.name}</span>
                                            {showFoodReadyBadge && (
                                              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider mt-0.5">🍳 Spremno</span>
                                            )}
                                          </div>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-lg text-xs font-black shrink-0" 
                                          style={{ 
                                            background: dark ? "rgba(249,115,22,0.15)" : "#ffedd5", 
                                            color: "#f97316" 
                                          }}>
                                          × {item.qty}
                                        </span>
                                      </div>
                                      {item.note ? (
                                        <div className="mt-1.5 p-2 rounded-xl text-xs font-semibold flex gap-1 items-start" 
                                          style={{ 
                                            background: dark ? "rgba(239,68,68,0.08)" : "#fef2f2", 
                                            color: "#ef4444" 
                                          }}>
                                          <span className="shrink-0 text-sm">💡</span>
                                          <span className="italic">"{item.note}"</span>
                                        </div>
                                      ) : null}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className="flex gap-2">
                              <button onClick={() => updateStatus(order.id, statusNext[orderStatus])}
                                className="flex-1 font-bold py-3 rounded-2xl text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                                style={{ 
                                  background: orderStatus === "new" ? "#f97316" : orderStatus === "preparing" ? "#3b82f6" : "#10b981", 
                                  color: "#fff",
                                  boxShadow: orderStatus === "new" ? "0 4px 12px rgba(249,115,22,0.2)" : orderStatus === "preparing" ? "0 4px 12px rgba(59,130,246,0.2)" : "0 4px 12px rgba(16,185,129,0.2)"
                                }}>
                                <span>
                                  {orderStatus === "new" 
                                    ? `👨‍🍳 ${tx.btnPrepare}` 
                                    : orderStatus === "preparing" 
                                    ? `🍳 ${tx.btnReady || "Spremno"}` 
                                    : `✅ ${tx.btnDeliver}`}
                                </span>
                              </button>
                              {staffRole === "waiter" && orderStatus !== "ready" && (
                                <button onClick={() => updateStatus(order.id, "delivered")}
                                  className="px-3 rounded-2xl text-sm font-bold transition-all active:scale-95 border"
                                  style={{ borderColor: borderCol, color: textSub }}
                                  title={lang === "EN" ? "Quick Deliver" : "Brza dostava"}>
                                  ✓
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  }

  // ── CUSTOMER VIEW ──
  const availableCats = Object.keys(menuData);
  const categories = mainSection === "jelo"
    ? ["Popular", ...mainSections.jelo.filter(c => availableCats.includes(c))]
    : mainSection === "pice"
    ? mainSections.pice.filter(c => availableCats.includes(c))
    : mainSections.vina.filter(c => availableCats.includes(c));

  return (
    <>
      <style>{globalStyles}</style>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} cafeInfo={cafeInfo} />}

      <div className="min-h-screen flex flex-col font-body" style={{ background: bg, opacity: showSplash ? 0 : 1, transition: "opacity 0.3s" }}>

        {/* ── HEADER ── */}
        <div className="px-4 pt-5 pb-0 sticky top-0 z-20" style={{ background: headerBg, borderBottom: `1px solid ${borderCol}` }}>
          <div className="flex items-center justify-between mb-3">
            {/* Left: logo + naziv */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl overflow-hidden flex items-center justify-center shrink-0"
                style={{ background: cafeInfo?.logo ? "transparent" : (cafeInfo?.logoBg || "#f97316") }}>
                {cafeInfo?.logo
                  ? <img src={cafeInfo.logo} alt="logo" className="w-full h-full object-cover" />
                  : <span className="text-2xl">{cafeInfo?.emoji || "☕"}</span>
                }
              </div>
              <div>
                <p className="font-display font-bold text-base leading-tight" style={{ color: textMain }}>
                  {cafeInfo?.name || ""}
                </p>
                {cafeInfo?.tagline && <p className="text-xs" style={{ color: textSub }}>{cafeInfo.tagline}</p>}
              </div>
            </div>
            {/* Right: controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              {renderLangBar()}
              <button onClick={() => setDark(d => !d)} className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                style={{ background: dark ? "#292524" : "#f5f0e8" }}>{dark ? "🌙" : "☀️"}</button>
              {myOrderId && (() => {
                const st = myOrder?.status;
                // Badge boja prema statusu narudžbe
                const dotColor  = st === "delivered" ? "#22c55e"
                                : st === "preparing"  ? "#3b82f6"
                                : "#f97316"; // new / nepoznat
                const glowRgb   = st === "delivered" ? "34,197,94"
                                : st === "preparing"  ? "59,130,246"
                                : "249,115,22";
                const btnBorder = dotColor;
                // Ikona se mijenja ovisno o statusu
                const icon = st === "delivered" ? "✅"
                           : st === "preparing" ? "👨‍🍳"
                           : "📋";
                // Animacija pinga samo ako narudžba nije dostavljena
                const pingClass = st !== "delivered" ? "animate-ping" : "";
                return (
                  <div className="relative shrink-0" style={{ display: "inline-flex" }}>
                    <button
                      onClick={() => navigate("status")}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm border transition-all active:scale-95"
                      style={{
                        color: dotColor,
                        borderColor: btnBorder,
                        boxShadow: `0 0 0 3px rgba(${glowRgb},0.15)`,
                      }}
                    >
                      {icon}
                    </button>
                    {/* Pulsirajući badge dot */}
                    <span
                      className="absolute -top-1 -right-1 flex items-center justify-center"
                      style={{ width: "11px", height: "11px" }}
                    >
                      {/* Ping odjek */}
                      {st !== "delivered" && (
                        <span
                          className={`absolute inline-flex rounded-full opacity-70 ${pingClass}`}
                          style={{
                            width: "11px", height: "11px",
                            background: dotColor,
                            animationDuration: "1.2s"
                          }}
                        />
                      )}
                      {/* Čvrsta tačka */}
                      <span
                        className="relative inline-flex rounded-full"
                        style={{
                          width: "9px", height: "9px",
                          background: dotColor,
                          boxShadow: `0 0 0 1.5px ${dark ? "#0f0a05" : "#ffffff"}`
                        }}
                      />
                    </span>
                  </div>
                );
              })()}

              <button onClick={() => navigate("waiter")}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm border transition-all active:scale-95 shrink-0"
                style={{ color: textSub, borderColor: borderCol }}
                title={tx.waiterView}>
                🔑
              </button>
            </div>
          </div>

          {/* Call waiter + Bill buttons */}
          <div className="flex gap-2 pb-3">
            <button onClick={() => setShowCallModal(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border"
              style={{ background: dark ? "#2d1a08" : "#fff7ed", color: "#f97316", borderColor: "#f97316" }}>
              🙋 {tx.callWaiter}
            </button>
            <button onClick={() => setShowBillModal(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border"
              style={{ background: dark ? "#0d1f0d" : "#f0fdf4", color: "#22c55e", borderColor: "#22c55e" }}>
              🧾 {tx.requestBill}
            </button>
          </div>

          {/* ── MAIN SECTIONS (Jelo, Piće, Vina) ── */}
          <div className="flex p-1 gap-1 rounded-2xl mb-2.5" style={{ background: dark ? "#1c1410" : "#f5f0e8" }}>
            {["jelo", "pice", "vina"].map(sec => {
              const isActive = mainSection === sec;
              const label = sec === "jelo" ? (lang === "EN" ? "Food" : "Jelo")
                          : sec === "pice" ? (lang === "EN" ? "Drinks" : "Piće")
                          : (lang === "EN" ? "Wines" : "Vina");
              const icon = sec === "jelo" ? "🍽️" : sec === "pice" ? "☕" : "🍷";
              return (
                <button key={sec}
                  onClick={() => handleMainSectionChange(sec)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all btn-press"
                  style={{
                    background: isActive ? "#f97316" : "transparent",
                    color: isActive ? "#fff" : textMain,
                    boxShadow: isActive ? "0 4px 12px rgba(249,115,22,0.25)" : "none"
                  }}>
                  <span>{icon}</span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* ── CATEGORY TABS sa ikonama ── */}
          <div ref={customerTabsRef} className="flex overflow-x-auto gap-0">
            {categories.map(cat => {
              const isActive = activeCategory === cat;
              
              const defaultIcon = (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z"/>
                  <path d="M5 10v2a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-2"/>
                  <path d="M2 17h20"/>
                  <path d="M12 17v4"/>
                  <path d="M8 21h8"/>
                </svg>
              );

              const catIcons = {
                Popular:            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
                Kafa:               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>,
                Sokovi:             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2h8l1 10H7L8 2z"/><path d="M7 12c0 4 2 6 5 8"/><path d="M17 12c0 4-2 6-5 8"/><path d="M9 6h1"/><path d="M14 6h1"/></svg>,
                Piva:               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 11h1a3 3 0 0 1 0 6h-1"/><path d="M9 12v6"/><path d="M13 12v6"/><path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.44.5-3 .5"/><path d="M3 11V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M5 18h14a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z"/></svg>,
                Napitci:            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2h16l-2 7H6L4 2z"/><path d="M6 9c0 6 3 9 6 11"/><path d="M18 9c0 6-3 9-6 11"/><path d="M10 2v3"/><path d="M14 2v3"/></svg>,
                Grickalice:         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>,
                "Topli napici":     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>,
                "Vode":             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"/></svg>,
                "Cijeđeni sokovi":   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M2 12h20"/><path d="m19.07 4.93-14.14 14.14"/><path d="m4.93 4.93 14.14 14.14"/></svg>,
                "Sokići":           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 22H7a2 2 0 0 1-2-2V8h14v12a2 2 0 0 1-2 2z"/><path d="M9 22V12h6v10"/><path d="m13 8 2-6h2"/></svg>,
                "Flaširano pivo":    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v6a1 1 0 0 0 1 1h2a2 2 0 0 1 2 2v10a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V11a2 2 0 0 1 2-2h2a1 1 0 0 0 1-1V2z"/></svg>,
                "Točeno pivo":      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 11h1a3 3 0 0 1 0 6h-1"/><path d="M3 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8z"/><path d="M9 12v6"/><path d="M13 12v6"/></svg>,
                "Vina":             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 22h8"/><path d="M12 11v11"/><path d="M12 2a5 5 0 0 0-5 5v4a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z"/></svg>,
                "Žestice":          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 3-1 15a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L4 3z"/><path d="M6 8h12"/><path d="M12 13h.01"/></svg>,
                "Likeri":           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 22h8"/><path d="M12 11v11"/><path d="m19 3-7 8-7-8z"/></svg>,
                "Brunch meni":      <span className="text-[18px]">🍳</span>,
                "Hladna predjela":  <span className="text-[18px]">🥗</span>,
                "Topla međujela":  <span className="text-[18px]">🍲</span>,
                "Supe i čorbe":     <span className="text-[18px]">🥣</span>,
                "Pice":             <span className="text-[18px]">🍕</span>,
                "Glavna jela - Riba": <span className="text-[18px]">🐟</span>,
                "Glavna jela - Piletina": <span className="text-[18px]">🍗</span>,
                "Glavna jela - Ćuretina": <span className="text-[18px]">🦃</span>,
                "Glavna jela - Svinjetina": <span className="text-[18px]">🥩</span>,
                "Glavna jela - Jagnjetina": <span className="text-[18px]">🍖</span>,
                "Glavna jela - Govedina": <span className="text-[18px]">🥩</span>,
                "Burgeri":          <span className="text-[18px]">🍔</span>,
                "S vremena na vrijeme": <span className="text-[18px]">✨</span>,
                "Trans Sibir Express": <span className="text-[18px]">🚂</span>,
                "Obrok salate":     <span className="text-[18px]">🥗</span>,
                "Salate i dodaci":  <span className="text-[18px]">🥬</span>,
                "Dječiji meni":     <span className="text-[18px]">👶</span>,
                "Deserti":          <span className="text-[18px]">🍰</span>,
              };

              const getCatLabel = (categoryName) => {
                if (categoryName === "Popular") return tx.popular;
                if (!categoryName) return "";
                if (tx.cats && tx.cats[categoryName]) return tx.cats[categoryName];
                const lowerName = categoryName.toLowerCase();
                const matchedKey = Object.keys(tx.cats || {}).find(k => k.toLowerCase() === lowerName);
                if (matchedKey && tx.cats[matchedKey]) return tx.cats[matchedKey];
                return categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
              };

              const getCatIcon = (categoryName) => {
                if (!categoryName) return defaultIcon;
                if (catIcons[categoryName]) return catIcons[categoryName];
                const lowerName = categoryName.toLowerCase();
                const matchedKey = Object.keys(catIcons).find(k => k.toLowerCase() === lowerName);
                if (matchedKey) return catIcons[matchedKey];
                if (lowerName === "papitci" || lowerName === "napitci" || lowerName === "napici" || lowerName === "napitici") {
                  return catIcons.Napitci;
                }
                return defaultIcon;
              };

              const label = getCatLabel(cat);
              const icon = getCatIcon(cat);

              return (
                <button key={cat}
                  id={isActive ? "active-tab" : undefined}
                  onClick={() => handleCatChange(cat)}
                  className="shrink-0 px-4 pb-2 pt-1 text-xs font-semibold relative flex flex-col items-center gap-1 btn-press"
                  style={{ color: isActive ? "#f97316" : tabInactiveTxt, minWidth: "62px", transition: "color 0.2s ease" }}>
                  <span style={{ transition: "transform 0.2s ease", transform: isActive ? "scale(1.15)" : "scale(1)" }}>
                    {icon}
                  </span>
                  {label}
                  <div className={isActive ? "animate-tabLine" : ""}
                    style={{ height: "2.5px", borderRadius: "2px", marginTop: "2px", background: isActive ? "#f97316" : "transparent", width: "100%", transformOrigin: "left" }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* ── MENU LIST ── */}
        <div key={catKey} className="flex-1 overflow-y-auto pb-28"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}>
          {allItems.length === 0 ? (
            [1, 2, 3, 4, 5].map((idx) => renderSkeletonRow(idx))
          ) : (
            getItems().map((item, idx) => renderMenuRow(item, idx))
          )}

          {/* ── INFO DUGME NA DNU ── */}
          <div className="flex justify-center pb-6 pt-4">
            <button
              onClick={() => setShowInfoModal(true)}
              className="flex items-center gap-2 btn-press"
              style={{
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                color: "#fff",
                borderRadius: "999px",
                padding: "10px 20px",
                boxShadow: "0 4px 16px rgba(249,115,22,0.4)",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              <span style={{ fontSize: "16px" }}>📱</span>
              <span>Zelite ovakav meni za vaš lokal?</span>
            </button>
          </div>
        </div>

        {/* ── CART BAR ── */}
        {cartCount > 0 && (
          <div className="fixed bottom-0 left-0 right-0 p-4 animate-slideUp"
            style={{ background: `linear-gradient(to top, ${bg} 65%, transparent)` }}>
            <button onClick={() => navigate("cart")}
              className="w-full font-bold py-4 rounded-2xl flex items-center justify-between px-5 text-sm btn-press"
              style={{ background: "#f97316", color: "#fff", boxShadow: "0 8px 32px rgba(249,115,22,0.45)", transition: "box-shadow 0.2s ease" }}>
              {/* Badge sa badgePop animacijom — key se mijenja na svaki add */}
              <span
                key={`badge-${addedCount}`}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-black animate-badgePop`}
                style={{
                  background: "rgba(255,255,255,0.25)",
                  boxShadow: "0 0 0 2px rgba(255,255,255,0.35)",
                  color: "#fff"
                }}
              >
                {cartCount}
              </span>
              <span>{tx.reviewOrder}</span>
              <span>{cartTotal.toFixed(2)} KM</span>
            </button>
          </div>
        )}
      </div>

      {/* ── DETAIL MODAL ── */}
      {selectedItem && (() => {
        const qty = cart[selectedItem.id]?.qty || 0;
        const badge = selectedItem.badge ? badgeConfig[selectedItem.badge] : null;
        return (
          <div className={`fixed inset-0 z-40 flex items-end justify-center ${isClosingDetail ? "animate-overlayOut" : "animate-overlayIn"}`}
            style={{ background: "rgba(0,0,0,0.55)" }}
            onClick={closeDetail}>
            <div ref={detailModalRef} className={`w-full max-w-md rounded-t-3xl overflow-hidden max-h-[88vh] flex flex-col ${isClosingDetail ? "animate-modalOut" : "animate-modalIn"}`}
              style={{ background: cardBg, borderTop: `1px solid ${borderCol}` }}
              onClick={e => e.stopPropagation()}>
              
              {/* Image Section */}
              <div className="relative w-full h-[224px] shrink-0" style={{ background: imgBg }}>
                {selectedItem.img ? (
                  <img
                    src={selectedItem.img}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                    onError={e => {
                      e.target.style.display = "none";
                      e.target.parentNode.innerHTML = `<div class="w-full h-full flex items-center justify-center" style="font-size: 5rem">${selectedItem.emoji || "🍽️"}</div>`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ fontSize: "5rem" }}>
                    {selectedItem.emoji || "🍽️"}
                  </div>
                )}

                {/* X button over image (top right) */}
                <button
                  onClick={closeDetail}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-xl font-bold bg-black/40 text-white backdrop-blur-sm active:scale-95 transition-all cursor-pointer z-10"
                >
                  ×
                </button>

                {/* Badge over image (top left) */}
                {badge && (
                  <div
                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 z-10"
                    style={{ background: badge.color }}
                  >
                    {selectedItem.badge === "popular" || selectedItem.badge === "recommended" ? "⭐" : "✨"} {tx[`badge${selectedItem.badge.charAt(0).toUpperCase() + selectedItem.badge.slice(1)}`]}
                  </div>
                )}
              </div>

              {/* Middle Content Section - Scrollable */}
              <div ref={detailContentRef} className="p-6 overflow-y-auto flex-1">
                {/* Title */}
                <h3 className="font-bold text-xl mb-2" style={{ color: textMain }}>
                  {lang === "EN" ? (selectedItem.name_en || selectedItem.name) : selectedItem.name}
                </h3>

                {/* Full Description */}
                {(lang === "EN" ? (selectedItem.desc_en || selectedItem.desc) : selectedItem.desc) && (
                  <p className="text-sm leading-relaxed mb-5" style={{ color: textSub }}>
                    {lang === "EN" ? (selectedItem.desc_en || selectedItem.desc) : selectedItem.desc}
                  </p>
                )}

                {/* Allergens */}
                {selectedItem.allergens && Array.isArray(selectedItem.allergens) && selectedItem.allergens.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs uppercase tracking-wider font-bold mb-2" style={{ color: textSub }}>
                      {lang === "EN" ? "Allergens" : "Alergeni"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.allergens.map((allergen, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-full border font-semibold"
                          style={{ borderColor: borderCol, color: textSub, background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}>
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold" style={{ color: textSub }}>
                    {lang === "EN" ? "Price" : "Cijena"}
                  </span>
                  <span className="font-extrabold text-xl" style={{ color: textPrice }}>
                    {selectedItem.price.toFixed(2)} KM
                  </span>
                </div>
              </div>

              {/* Bottom Sticky Action Area */}
              <div className="p-6 pt-3 shrink-0 border-t" style={{ borderColor: borderCol, background: cardBg }}>
                {qty === 0 ? (
                  <button
                    onClick={() => addToCart(selectedItem)}
                    className={`w-full py-4 rounded-2xl font-bold text-base btn-press cursor-pointer ${addedId === selectedItem.id ? "animate-addBounce" : ""}`}
                    style={{ background: "#f97316", color: "#fff" }}
                  >
                    + {tx.add}
                  </button>
                ) : (
                  <div className={`flex items-center gap-4 ${addedId === selectedItem.id ? "animate-bounceIn" : ""}`}>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => removeFromCart(selectedItem.id)}
                        className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-2xl cursor-pointer"
                        style={{ background: dark ? "#292524" : "#f5f0e8", color: textMain }}
                      >
                        −
                      </button>
                      <span className="font-bold text-base w-5 text-center" style={{ color: textMain }}>
                        {qty}
                      </span>
                      <div className="relative">
                        <button
                          onClick={() => addToCart(selectedItem)}
                          className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-2xl cursor-pointer ${addedId === selectedItem.id ? "animate-addBounce" : ""}`}
                          style={{ background: "#f97316", color: "#fff", position: "relative", zIndex: 1 }}
                        >
                          +
                        </button>
                        {addedId === selectedItem.id && (
                          <span
                            key={`ring-detail-${selectedItem.id}-${addedCount}`}
                            className="animate-ringPulse"
                            style={{
                              position: "absolute",
                              inset: 0,
                              borderRadius: "9999px",
                              border: "2.5px solid #f97316",
                              pointerEvents: "none",
                              zIndex: 0
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <button
                      onClick={closeDetail}
                      className="flex-1 py-4 rounded-2xl font-bold text-base btn-press text-center cursor-pointer"
                      style={{ background: "#f97316", color: "#fff" }}
                    >
                      {lang === "EN" ? "Done" : "Gotovo"}
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        );
      })()}

      {/* ── CALL WAITER MODAL ── */}
      {showCallModal && (
        <Modal onClose={() => { setShowCallModal(false); setCallSent(false); }} dark={dark}>
          {callSent ? (
            <div className="text-center py-4 animate-bounceIn">
              <div className="text-5xl mb-3">🙋</div>
              <p className="font-bold text-lg mb-1" style={{ color: textMain }}>{tx.callWaiterConfirm}</p>
              <p className="text-sm" style={{ color: textSub }}>{tx.callWaiterSub}</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-5">
                <div className="text-4xl mb-3">🙋</div>
                <p className="font-bold text-lg mb-1" style={{ color: textMain }}>{tx.callWaiter}</p>
                <p className="text-sm" style={{ color: textSub }}>{tx.callWaiterHint}</p>
              </div>
              <button onClick={sendCall} className="w-full py-4 rounded-2xl font-bold text-base"
                style={{ background: "#f97316", color: "#fff" }}>{tx.callWaiter}</button>
            </>
          )}
        </Modal>
      )}

      {/* ── BILL MODAL ── */}
      {showBillModal && (
        <Modal onClose={() => { setShowBillModal(false); setBillSent(false); setBillPayMethod(null); }} dark={dark}>
          {billSent ? (
            <div className="text-center py-4 animate-bounceIn">
              <div className="text-5xl mb-3">🧾</div>
              <p className="font-bold text-lg mb-1" style={{ color: textMain }}>{tx.billConfirm}</p>
              <p className="text-sm mb-2" style={{ color: textSub }}>{tx.billSub}</p>
              {billPayMethod && (
                <p className="text-orange-500 font-semibold text-sm">
                  {billPayMethod === "card" ? `💳 ${tx.payCard}` : `💵 ${tx.payCash}`}
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="text-center mb-5">
                <div className="text-4xl mb-3">🧾</div>
                <p className="font-bold text-lg mb-1" style={{ color: textMain }}>{tx.requestBill}</p>
                <p className="text-sm" style={{ color: textSub }}>{tx.payHow}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => sendBill("card")}
                  className="flex-1 py-4 rounded-2xl font-bold flex flex-col items-center gap-1 border"
                  style={{ background: dark ? "#0d1f0d" : "#f0fdf4", color: "#22c55e", borderColor: "#22c55e" }}>
                  <span className="text-2xl">💳</span>
                  <span className="text-sm">{tx.payCard}</span>
                </button>
                <button onClick={() => sendBill("cash")}
                  className="flex-1 py-4 rounded-2xl font-bold flex flex-col items-center gap-1 border"
                  style={{ background: dark ? "#2d1a08" : "#fff7ed", color: "#f97316", borderColor: "#f97316" }}>
                  <span className="text-2xl">💵</span>
                  <span className="text-sm">{tx.payCash}</span>
                </button>
              </div>
            </>
          )}
        </Modal>
      )}

      {/* ── INFO MODAL ── */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-end animate-overlayIn" style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setShowInfoModal(false)}>
          <div className="w-full animate-modalIn rounded-t-3xl p-6 pb-8 relative"
            style={{ background: dark ? "#1c1410" : "#fff" }}
            onClick={e => e.stopPropagation()}>
            {/* Super Admin Crown button in top right corner of InfoModal */}
            <button onClick={() => { setShowInfoModal(false); navigate("superadmin"); }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-sm border transition-all active:scale-95"
              style={{ color: "#8b5cf6", borderColor: "rgba(139,92,246,0.3)", background: dark ? "rgba(139,92,246,0.08)" : "#f5f3ff" }}
              title="Super Admin">
              👑
            </button>
            {/* Handle */}
            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: dark ? "#3f3633" : "#e5e7eb" }} />
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", boxShadow: "0 6px 16px rgba(249,115,22,0.4)" }}>
                📱
              </div>
              <div>
                <p className="font-bold text-base" style={{ color: dark ? "#fff" : "#1c1410" }}>Digitalni meni za vaš lokal</p>
                <p className="text-xs" style={{ color: dark ? "#a8a29e" : "#78716c" }}>Kafić · Restoran · Bar</p>
              </div>
            </div>
            {/* Description */}
            <p className="text-sm leading-relaxed mb-5" style={{ color: dark ? "#a8a29e" : "#57534e" }}>
              Sviđa vam se ovaj digitalni meni? Možemo napraviti isti sistem za vaš lokal — QR kod, narudžbe, admin panel i sve ostalo.
            </p>
            {/* Contact buttons */}
            <div className="flex flex-col gap-2.5">
              <a href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL || 'borislavgrab7@gmail.com'}`}
                className="w-full py-3.5 rounded-2xl font-bold text-sm text-center flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", color: "#fff", boxShadow: "0 6px 20px rgba(249,115,22,0.35)" }}>
                ✉️ {import.meta.env.VITE_CONTACT_EMAIL || 'borislavgrab7@gmail.com'}
              </a>
              <a href={`tel:${import.meta.env.VITE_CONTACT_PHONE || '+38700000000'}`}
                className="w-full py-3.5 rounded-2xl font-bold text-sm text-center flex items-center justify-center gap-2 border"
                style={{ color: "#f97316", borderColor: "rgba(249,115,22,0.4)", background: dark ? "rgba(249,115,22,0.08)" : "#fff7ed" }}>
                📞 {import.meta.env.VITE_CONTACT_PHONE || '+387 00 000 000'}
              </a>
            </div>
            {/* Close */}
            <button onClick={() => setShowInfoModal(false)}
              className="w-full mt-3 py-3 rounded-2xl text-sm font-medium"
              style={{ background: dark ? "#292524" : "#f0ece4", color: dark ? "#a8a29e" : "#78716c" }}>
              Zatvori
            </button>
          </div>
        </div>
      )}

      {/* ── EXIT TOAST ── */}
      {showExitToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg border border-zinc-800 animate-bounceIn">
          {tx.exitToast}
        </div>
      )}
    </>
  );
}
