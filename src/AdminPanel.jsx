import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";


const badgeOptions = [
  { value: null,          label: "—  Bez badge-a" },
  { value: "popular",     label: "⭐ Popularno" },
  { value: "recommended", label: "⭐ Preporučeno" },
  { value: "new",         label: "✨ Novo" },
];

function LoginScreen({ onLogin, dark, adminPassword }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const bg       = dark ? "#0f0a05" : "#ffffff";
  const cardBg   = dark ? "#1c1410" : "#f9f5f0";
  const textMain = dark ? "#ffffff" : "#1a1208";
  const textSub  = dark ? "#78716c" : "#9ca3af";
  const borderCol= dark ? "#2a2220" : "#f0ece8";

  const attempt = () => {
    if (pw === (adminPassword || "admin123")) { onLogin(); }
    else { setErr(true); setTimeout(() => setErr(false), 1500); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 font-body" style={{ background: bg }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4"
            style={{ background: "#f97316" }}>🔐</div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: textMain }}>Admin panel</h1>
          <p className="text-sm" style={{ color: textSub }}>Unesite lozinku za pristup</p>
        </div>
        <div className="rounded-3xl p-6" style={{ background: cardBg, border: `1px solid ${borderCol}` }}>
          <input
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setErr(false); }}
            onKeyDown={e => e.key === "Enter" && attempt()}
            placeholder="Lozinka..."
            className="w-full px-4 py-3.5 rounded-2xl outline-none border text-base mb-3"
            style={{
              background: dark ? "#2a2220" : "#fff",
              color: textMain,
              borderColor: err ? "#ef4444" : "#f97316"
            }}
            autoFocus
          />
          {err && (
            <p className="text-red-400 text-sm text-center mb-3">Pogrešna lozinka</p>
          )}
          <button onClick={attempt}
            className="w-full py-4 rounded-2xl font-bold text-base"
            style={{ background: "#f97316", color: "#fff" }}>
            Prijava
          </button>
          <p className="text-center text-xs mt-3" style={{ color: textSub }}>
            Podrazumevana lozinka: <span className="font-bold" style={{ color: "#f97316" }}>admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, textSub }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: textSub }}>{label}</p>
      {children}
    </div>
  );
}

function ItemModal({ item, category, categories, onSave, onClose, dark }) {
  const isNew = !item;
  const [form, setForm] = useState(item ? { ...item } : {
    name: "", name_en: "", desc: "", desc_en: "", price: "", img: "", badge: null, orders: 0, is_available: true
  });
  const [cat, setCat] = useState(category || categories[0]);

  const bg       = dark ? "#1c1410" : "#fff";
  const textMain = dark ? "#ffffff" : "#1a1208";
  const textSub  = dark ? "#78716c" : "#9ca3af";
  const borderCol= dark ? "#2a2220" : "#f0ece8";
  const inputBg  = dark ? "#2a2220" : "#f9f9f9";

  const handleImg = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('menu-images')
      .upload(fileName, file);

    if (!error) {
      const { data: { publicUrl } } = supabase.storage
        .from('menu-images')
        .getPublicUrl(fileName);

      setForm(p => ({ ...p, img: publicUrl }));
    } else {
      console.error("Error uploading image:", error);
      alert("Greška prilikom uvoza slike na server.");
    }
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const price = parseFloat(form.price);
    if (isNaN(price) || price < 0) return;
    onSave({ ...form, price, id: form.id || Date.now() }, cat);
  };

  const inputStyle = {
    background: inputBg, color: textMain, borderColor: borderCol
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center p-0 md:p-6" style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full md:max-w-xl rounded-t-3xl md:rounded-3xl p-5 overflow-y-auto" style={{ background: bg, maxHeight: "90vh" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg" style={{ color: textMain }}>
            {isNew ? "Nova stavka" : "Uredi stavku"}
          </h2>
          <button onClick={onClose} className="text-2xl" style={{ color: textSub }}>×</button>
        </div>

        {/* Slika */}
        <Field label="Slika" textSub={textSub}>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center shrink-0"
              style={{ background: dark ? "#2a1f14" : "#f5f0e8" }}>
              {form.img
                ? <img src={form.img} alt="" className="w-full h-full object-cover" />
                : <span className="text-3xl">🍽️</span>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="cursor-pointer text-sm font-semibold px-4 py-2 rounded-xl"
                style={{ background: "#f97316", color: "#fff" }}>
                📷 Upload
                <input type="file" accept="image/*" className="hidden" onChange={handleImg} />
              </label>
              <input
                type="text"
                placeholder="ili URL slike..."
                value={form.img?.startsWith("blob:") ? "" : (form.img || "")}
                onChange={e => setForm(p => ({ ...p, img: e.target.value }))}
                className="text-xs px-3 py-2 rounded-xl border outline-none"
                style={inputStyle}
              />
            </div>
          </div>
        </Field>

        {/* Naziv */}
        <Field label="Naziv *" textSub={textSub}>
          <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            placeholder="npr. Cappuccino"
            className="w-full px-4 py-3 rounded-xl border outline-none text-base font-semibold"
            style={{ ...inputStyle, borderColor: !form.name.trim() ? "#ef4444" : borderCol }} />
        </Field>

        {/* Naziv (EN) */}
        <Field label="Naziv (EN)" textSub={textSub}>
          <input type="text" value={form.name_en || ""} onChange={e => setForm(p => ({ ...p, name_en: e.target.value }))}
            placeholder="e.g. Cappuccino"
            className="w-full px-4 py-3 rounded-xl border outline-none text-base font-semibold"
            style={inputStyle} />
        </Field>

        {/* Opis */}
        <Field label="Opis" textSub={textSub}>
          <textarea value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))}
            placeholder="Kratki opis..."
            rows={2}
            className="w-full px-4 py-3 rounded-xl border outline-none text-sm resize-none"
            style={inputStyle} />
        </Field>

        {/* Opis (EN) */}
        <Field label="Opis (EN)" textSub={textSub}>
          <textarea value={form.desc_en || ""} onChange={e => setForm(p => ({ ...p, desc_en: e.target.value }))}
            placeholder="English description..."
            rows={2}
            className="w-full px-4 py-3 rounded-xl border outline-none text-sm resize-none"
            style={inputStyle} />
        </Field>

        {/* Cijena */}
        <Field label="Cijena (KM) *" textSub={textSub}>
          <input type="number" step="0.50" min="0" value={form.price}
            onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
            placeholder="0.00"
            className="w-full px-4 py-3 rounded-xl border outline-none text-base font-bold"
            style={{ ...inputStyle, borderColor: "#f97316" }} />
        </Field>

        {/* Kategorija */}
        <Field label="Kategorija" textSub={textSub}>
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className="px-4 py-2 rounded-full text-sm font-semibold border transition-all"
                style={{
                  background: cat === c ? "#f97316" : (dark ? "#2a2220" : "#f5f0e8"),
                  color: cat === c ? "#fff" : textSub,
                  borderColor: cat === c ? "#f97316" : borderCol
                }}>
                {c}
              </button>
            ))}
          </div>
        </Field>

        {/* Badge */}
        <Field label="Badge" textSub={textSub}>
          <div className="flex flex-wrap gap-2">
            {badgeOptions.map(b => (
              <button key={String(b.value)} onClick={() => setForm(p => ({ ...p, badge: b.value }))}
                className="px-4 py-2 rounded-full text-sm font-semibold border transition-all"
                style={{
                  background: form.badge === b.value ? "#f97316" : (dark ? "#2a2220" : "#f5f0e8"),
                  color: form.badge === b.value ? "#fff" : textSub,
                  borderColor: form.badge === b.value ? "#f97316" : borderCol
                }}>
                {b.label}
              </button>
            ))}
          </div>
        </Field>

        {/* Dostupnost */}
        <Field label="Dostupnost" textSub={textSub}>
          <div className="flex gap-2">
            <button onClick={() => setForm(p => ({ ...p, is_available: true }))}
              className="px-4 py-2 rounded-full text-sm font-semibold border transition-all"
              style={{
                background: form.is_available !== false ? "#22c55e" : (dark ? "#2a2220" : "#f5f0e8"),
                color: form.is_available !== false ? "#fff" : textSub,
                borderColor: form.is_available !== false ? "#22c55e" : borderCol
              }}>
              Na stanju
            </button>
            <button onClick={() => setForm(p => ({ ...p, is_available: false }))}
              className="px-4 py-2 rounded-full text-sm font-semibold border transition-all"
              style={{
                background: form.is_available === false ? "#ef4444" : (dark ? "#2a2220" : "#f5f0e8"),
                color: form.is_available === false ? "#fff" : textSub,
                borderColor: form.is_available === false ? "#ef4444" : borderCol
              }}>
              Nema na stanju
            </button>
          </div>
        </Field>

        <div className="flex gap-3 mt-2">
          <button onClick={onClose}
            className="flex-1 py-4 rounded-2xl font-semibold"
            style={{ background: dark ? "#292524" : "#f0ece4", color: textSub }}>
            Odustani
          </button>
          <button onClick={handleSave}
            className="flex-1 py-4 rounded-2xl font-bold"
            style={{ background: "#f97316", color: "#fff" }}>
            {isNew ? "Dodaj" : "Sačuvaj"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ item, onConfirm, onClose, dark }) {
  const bg       = dark ? "#1c1410" : "#fff";
  const textMain = dark ? "#ffffff" : "#1a1208";
  const textSub  = dark ? "#78716c" : "#9ca3af";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-sm rounded-3xl p-6 text-center" style={{ background: bg }}>
        <div className="text-4xl mb-3">🗑️</div>
        <h3 className="font-bold text-lg mb-2" style={{ color: textMain }}>Obriši stavku?</h3>
        <p className="text-sm mb-5" style={{ color: textSub }}>
          <span className="font-semibold" style={{ color: "#f97316" }}>{item.name}</span> će biti trajno obrisana.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-2xl font-semibold"
            style={{ background: dark ? "#292524" : "#f0ece4", color: textSub }}>
            Odustani
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl font-bold"
            style={{ background: "#ef4444", color: "#fff" }}>
            Obriši
          </button>
        </div>
      </div>
    </div>
  );
}

function NewCategoryModal({ onSave, onClose, dark }) {
  const [name, setName] = useState("");
  const bg       = dark ? "#1c1410" : "#fff";
  const textMain = dark ? "#ffffff" : "#1a1208";
  const textSub  = dark ? "#78716c" : "#9ca3af";
  const borderCol= dark ? "#2a2220" : "#f0ece8";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-sm rounded-3xl p-6" style={{ background: bg }}>
        <h3 className="font-bold text-lg mb-4" style={{ color: textMain }}>Nova kategorija</h3>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && name.trim() && onSave(name.trim())}
          placeholder="npr. Deserti"
          autoFocus
          className="w-full px-4 py-3 rounded-xl border outline-none text-base font-semibold mb-4"
          style={{ background: dark ? "#2a2220" : "#f9f9f9", color: textMain, borderColor: "#f97316" }}
        />
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-2xl font-semibold"
            style={{ background: dark ? "#292524" : "#f0ece4", color: textSub }}>
            Odustani
          </button>
          <button onClick={() => name.trim() && onSave(name.trim())}
            className="flex-1 py-3 rounded-2xl font-bold"
            style={{ background: name.trim() ? "#f97316" : "#ccc", color: "#fff" }}>
            Dodaj
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel({ menuData, setMenuData, cafeInfo, setCafeInfo, dark, onBack }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("Popularno");
  const [editItem, setEditItem] = useState(null);       // { item, category } | "new"
  const [deleteItem, setDeleteItem] = useState(null);   // { item, category }
  const [showNewCat, setShowNewCat] = useState(false);
  const [showCafeEdit, setShowCafeEdit] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [tableCount, setTableCount] = useState(10);
  const [showReorderCat, setShowReorderCat] = useState(false);
  const [categoryOrder, setCategoryOrder] = useState([]);

  // Sync categoryOrder from menuData keys (and cafeInfo.categoryOrder if set)
  useEffect(() => {
    const keys = Object.keys(menuData);
    if (keys.length === 0) return;
    const saved = cafeInfo?.categoryOrder;
    if (saved && Array.isArray(saved) && saved.length > 0) {
      // Merge: keep saved order, append any new cats at end
      const merged = [...saved.filter(c => keys.includes(c)), ...keys.filter(c => !saved.includes(c))];
      setCategoryOrder(merged);
    } else {
      setCategoryOrder(keys);
    }
  }, [menuData, cafeInfo?.categoryOrder]);

  // Sync activeTab when menuData loads or changes
  useEffect(() => {
    const categories = Object.keys(menuData);
    if (categories.length > 0) {
      if (!activeTab || (activeTab !== "Popularno" && !categories.includes(activeTab))) {
        setActiveTab("Popularno");
      }
    }
  }, [menuData]);

  const bg       = dark ? "#0f0a05" : "#f4f0eb";
  const cardBg   = dark ? "#1c1410" : "#ffffff";
  const textMain = dark ? "#ffffff" : "#1a1208";
  const textSub  = dark ? "#78716c" : "#9ca3af";
  const borderCol= dark ? "#2a2220" : "#f0ece8";
  const headerBg = dark ? "#0f0a05" : "#ffffff";

  const categories = categoryOrder.length > 0 ? categoryOrder : Object.keys(menuData);
  const displayTabs = ["Popularno", ...categories];

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} dark={dark} adminPassword={cafeInfo?.adminPassword} />;

  const handleSaveItem = async (updatedItem, category) => {
    const itemPayload = {
      name: updatedItem.name,
      name_en: updatedItem.name_en || null,
      description: updatedItem.desc,
      description_en: updatedItem.desc_en || null,
      price: updatedItem.price,
      image_url: updatedItem.img,
      category: category,
      badge: updatedItem.badge,
      orders_count: updatedItem.orders,
      sort_order: updatedItem.sort_order || 0,
      is_available: updatedItem.is_available !== false
    };

    const isNew = typeof updatedItem.id === 'number';

    if (isNew) {
      const currentCatItems = menuData[category] || [];
      const nextSortOrder = currentCatItems.length > 0 
        ? Math.max(...currentCatItems.map(i => i.sort_order || 0)) + 1 
        : 1;
      itemPayload.sort_order = nextSortOrder;

      const { error } = await supabase
        .from("menu_items")
        .insert(itemPayload);
      if (error) {
        console.error("Error inserting menu item:", error);
        alert("Greška pri dodavanju stavke.");
      }
    } else {
      const { error } = await supabase
        .from("menu_items")
        .update(itemPayload)
        .eq("id", updatedItem.id);
      if (error) {
        console.error("Error updating menu item:", error);
        alert("Greška pri čuvanju stavke.");
      }
    }

    if (activeTab !== "Popularno" && category !== activeTab) setActiveTab(category);
    setEditItem(null);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", deleteItem.item.id);
    if (error) {
      console.error("Error deleting menu item:", error);
      alert("Greška pri brisanju stavke.");
    }
    setDeleteItem(null);
  };

  const handleAddCategory = (name) => {
    if (menuData[name]) return;
    setMenuData(prev => ({ ...prev, [name]: [] }));
    setCategoryOrder(prev => [...prev, name]);
    setActiveTab(name);
    setShowNewCat(false);
  };

  const handleMoveCategory = (idx, dir) => {
    const arr = [...categoryOrder];
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    setCategoryOrder(arr);
  };

  const handleSaveCategoryOrder = async () => {
    const { error } = await supabase
      .from("cafe_info")
      .update({ category_order: JSON.stringify(categoryOrder) })
      .eq("id", 1);
    if (error) {
      console.error("Error saving category order:", error);
      alert("Greška pri čuvanju redosljeda.");
    } else {
      setCafeInfo(prev => ({ ...prev, categoryOrder }));
      setShowReorderCat(false);
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Obrisati kategoriju "${cat}" i sve stavke u njoj?`)) return;
    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("category", cat);
    if (error) {
      console.error("Error deleting category items:", error);
      alert("Greška pri brisanju kategorije.");
    }
    
    setMenuData(prev => {
      const next = { ...prev };
      delete next[cat];
      return next;
    });
    setActiveTab(Object.keys(menuData).find(c => c !== cat) || "");
  };

  const moveItem = async (cat, idx, dir) => {
    const arr = [...menuData[cat]];
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;

    const item1 = arr[idx];
    const item2 = arr[target];

    const temp = item1.sort_order;
    item1.sort_order = item2.sort_order || target;
    item2.sort_order = temp || idx;

    const { error1 } = await supabase
      .from("menu_items")
      .update({ sort_order: item1.sort_order })
      .eq("id", item1.id);

    const { error2 } = await supabase
      .from("menu_items")
      .update({ sort_order: item2.sort_order })
      .eq("id", item2.id);

    if (error1 || error2) {
      console.error("Error moving items:", error1 || error2);
    }
  };

  const allItems = Object.values(menuData).flat();
  const currentItems = activeTab === "Popularno"
    ? allItems.filter(i => i.badge === "popular" || i.badge === "recommended").sort((a, b) => b.orders - a.orders)
    : (menuData[activeTab] || []);
  const totalItems = allItems.length;

  return (
    <div className="min-h-screen flex flex-col font-body" style={{ background: bg }}>

      {/* ── HEADER ── */}
      <div className="sticky top-0 z-20 px-4 pt-5 pb-3 border-b"
        style={{ background: headerBg, borderColor: borderCol }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: dark ? "#292524" : "#f5f0e8", color: "#f97316" }}>←</button>
            <div>
              <p className="text-xs uppercase tracking-widest" style={{ color: textSub }}>Admin</p>
              <h1 className="font-bold text-lg leading-tight" style={{ color: textMain }}>Upravljanje menijem</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowQR(true)}
              className="text-xs border px-3 py-1.5 rounded-full font-semibold"
              style={{ color: "#22c55e", borderColor: "#22c55e" }}>
              📱 QR
            </button>
            <button onClick={() => setShowCafeEdit(true)}
              className="text-xs border px-3 py-1.5 rounded-full font-semibold"
              style={{ color: "#f97316", borderColor: "#f97316" }}>
              ⚙️ Kafić
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mt-3">
          <div className="flex-1 rounded-2xl px-3 py-2 text-center" style={{ background: dark ? "#1c1410" : "#fff7ed", border: `1px solid ${borderCol}` }}>
            <p className="text-lg font-bold" style={{ color: "#f97316" }}>{totalItems}</p>
            <p className="text-xs" style={{ color: textSub }}>Stavki</p>
          </div>
          <div className="flex-1 rounded-2xl px-3 py-2 text-center" style={{ background: dark ? "#1c1410" : "#fff7ed", border: `1px solid ${borderCol}` }}>
            <p className="text-lg font-bold" style={{ color: "#f97316" }}>{categories.length}</p>
            <p className="text-xs" style={{ color: textSub }}>Kategorija</p>
          </div>
          <div className="flex-1 rounded-2xl px-3 py-2 text-center" style={{ background: dark ? "#1c1410" : "#fff7ed", border: `1px solid ${borderCol}` }}>
            <p className="text-lg font-bold" style={{ color: "#f97316" }}>{currentItems.length}</p>
            <p className="text-xs" style={{ color: textSub }}>U kategoriji</p>
          </div>
        </div>
      </div>

      {/* ── CATEGORY TABS ── */}
      <div className="flex overflow-x-auto px-4 pt-3 pb-2 gap-2 shrink-0" style={{ scrollbarWidth: "none" }}>
        {displayTabs.map(cat => (
          <button key={cat} onClick={() => setActiveTab(cat)}
            className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all"
            style={{
              background: activeTab === cat ? "#f97316" : (dark ? "#1c1410" : "#fff"),
              color: activeTab === cat ? "#fff" : textSub,
              borderColor: activeTab === cat ? "#f97316" : borderCol
            }}>
            {cat === "Popularno" ? "⭐ Popularno" : cat}
          </button>
        ))}
        <button onClick={() => setShowNewCat(true)}
          className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold border border-dashed"
          style={{ color: "#f97316", borderColor: "#f97316", background: "transparent" }}>
          + Nova
        </button>
        <button onClick={() => setShowReorderCat(true)}
          className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold border"
          style={{ color: "#8b5cf6", borderColor: "#8b5cf6", background: dark ? "transparent" : "#f5f3ff" }}>
          ⇅ Poredaj
        </button>
      </div>

      {/* ── CATEGORY ACTIONS ── */}
      <div className="flex items-center justify-between px-4 pb-2">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: textSub }}>
          {activeTab === "Popularno" ? "Popularno" : activeTab} ({currentItems.length})
        </p>
        {activeTab !== "Popularno" && (
          <button onClick={() => handleDeleteCategory(activeTab)}
            className="text-xs px-3 py-1 rounded-full"
            style={{ background: dark ? "#2a0a0a" : "#fef2f2", color: "#ef4444" }}>
            🗑 Obriši kategoriju
          </button>
        )}
      </div>

      {/* ── ITEMS LIST ── */}
      <div className="flex-1 px-4 pb-28 overflow-y-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 content-start">
        {currentItems.length === 0 ? (
          <div className="text-center py-16 col-span-full">
            <div className="text-5xl mb-3">🍽️</div>
            <p className="font-semibold" style={{ color: textMain }}>Nema stavki</p>
            <p className="text-sm mt-1" style={{ color: textSub }}>Dodaj prvu stavku u ovu kategoriju</p>
          </div>
        ) : (
          currentItems.map((item, idx) => (
            <div key={item.id} className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: cardBg, border: `1px solid ${borderCol}` }}>

              {/* Slika */}
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                style={{ background: dark ? "#2a1f14" : "#f5f0e8" }}>
                {item.img
                  ? <img src={item.img} alt={item.name} className="w-full h-full object-cover" onError={e => e.target.style.display="none"} />
                  : <span className="text-2xl">🍽️</span>}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-bold text-sm truncate" style={{ color: textMain }}>{item.name}</span>
                  {item.is_available === false && (
                    <span className="text-xs px-2 py-0.5 rounded-full shrink-0 bg-red-500 text-white font-bold">
                      Nema na stanju
                    </span>
                  )}
                  {item.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: item.badge === "new" ? "#8b5cf6" : "#f97316", color: "#fff" }}>
                      {item.badge === "new" ? "Novo" : item.badge === "popular" ? "Pop." : "Preporučeno"}
                    </span>
                  )}
                  {activeTab === "Popularno" && (
                    <span className="text-xs px-2 py-0.5 rounded-full shrink-0 font-semibold"
                      style={{ background: dark ? "#2a2220" : "#f5f0e8", color: textSub }}>
                      {item.category}
                    </span>
                  )}
                </div>
                {item.name_en && (
                  <p className="text-[10px] font-semibold opacity-60 truncate mb-0.5" style={{ color: textSub }}>
                    🇬🇧 {item.name_en}
                  </p>
                )}
                <p className="text-xs truncate mb-1" style={{ color: textSub }}>{item.desc}</p>
                {item.desc_en && (
                  <p className="text-[10px] italic truncate mb-1" style={{ color: textSub, opacity: 0.8 }}>
                    🇬🇧 {item.desc_en}
                  </p>
                )}
                <p className="font-bold text-base" style={{ color: "#f97316" }}>{item.price.toFixed(2)} KM</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1.5 shrink-0">
                {activeTab !== "Popularno" && (
                  <div className="flex gap-1">
                    <button onClick={() => moveItem(activeTab, idx, -1)}
                      disabled={idx === 0}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                      style={{ background: dark ? "#292524" : "#f5f0e8", color: idx === 0 ? textSub : textMain, opacity: idx === 0 ? 0.4 : 1 }}>↑</button>
                    <button onClick={() => moveItem(activeTab, idx, 1)}
                      disabled={idx === currentItems.length - 1}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                      style={{ background: dark ? "#292524" : "#f5f0e8", color: idx === currentItems.length - 1 ? textSub : textMain, opacity: idx === currentItems.length - 1 ? 0.4 : 1 }}>↓</button>
                  </div>
                )}
                <button onClick={() => setEditItem({ item, category: item.category })}
                  className="w-full py-1 rounded-lg text-xs font-semibold"
                  style={{ background: dark ? "#1a2a1a" : "#f0fdf4", color: "#22c55e" }}>✏️ Uredi</button>
                <button onClick={() => setDeleteItem({ item, category: item.category })}
                  className="w-full py-1 rounded-lg text-xs font-semibold"
                  style={{ background: dark ? "#2a0a0a" : "#fef2f2", color: "#ef4444" }}>🗑</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── FAB: Dodaj stavku ── */}
      <div className="fixed bottom-6 left-0 right-0 px-4 z-20">
        <button onClick={() => setEditItem("new")}
          className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2"
          style={{ background: "#f97316", color: "#fff", boxShadow: "0 8px 30px rgba(249,115,22,0.4)" }}>
          <span className="text-xl">+</span> {activeTab === "Popularno" ? "Dodaj stavku" : `Dodaj stavku u ${activeTab}`}
        </button>
      </div>

      {/* ── MODALS ── */}
      {editItem && (
        <ItemModal
          item={editItem === "new" ? null : editItem.item}
          category={editItem === "new" ? (activeTab === "Popularno" ? categories[0] : activeTab) : editItem.category}
          categories={categories}
          onSave={handleSaveItem}
          onClose={() => setEditItem(null)}
          dark={dark}
        />
      )}

      {deleteItem && (
        <DeleteConfirm
          item={deleteItem.item}
          onConfirm={handleDelete}
          onClose={() => setDeleteItem(null)}
          dark={dark}
        />
      )}

      {/* ── QR KODOVI MODAL ── */}
      {showQR && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={e => e.target === e.currentTarget && setShowQR(false)}>
          <div className="min-h-full flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-6" style={{ background: dark ? "#1c1410" : "#fff" }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-lg" style={{ color: textMain }}>📱 QR kodovi za stolove</h2>
                  <p className="text-xs mt-0.5" style={{ color: textSub }}>Skeniranjem QR koda gost automatski dobija broj stola</p>
                </div>
                <button onClick={() => setShowQR(false)} className="text-2xl" style={{ color: textSub }}>×</button>
              </div>

              {/* Broj stolova */}
              <div className="mb-5 flex items-center gap-3">
                <p className="text-sm font-semibold shrink-0" style={{ color: textMain }}>Broj stolova:</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setTableCount(n => Math.max(1, n - 1))}
                    className="w-8 h-8 rounded-full font-bold text-lg flex items-center justify-center"
                    style={{ background: dark ? "#292524" : "#f5f0e8", color: textMain }}>−</button>
                  <span className="font-bold text-xl w-8 text-center" style={{ color: "#f97316" }}>{tableCount}</span>
                  <button onClick={() => setTableCount(n => Math.min(50, n + 1))}
                    className="w-8 h-8 rounded-full font-bold text-lg flex items-center justify-center"
                    style={{ background: dark ? "#292524" : "#f5f0e8", color: textMain }}>+</button>
                </div>
              </div>

              {/* Grid QR kodova */}
              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {Array.from({ length: tableCount }, (_, i) => i + 1).map(num => {
                  const appUrl = window.location.origin;
                  const tableUrl = `${appUrl}/?table=${num}`;
                  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(tableUrl)}&margin=10`;
                  return (
                    <div key={num} className="rounded-2xl p-3 text-center" style={{ background: dark ? "#0f0a05" : "#f9f5f0", border: `1px solid ${borderCol}` }}>
                      <p className="font-bold text-sm mb-2" style={{ color: textMain }}>Sto {num}</p>
                      <img src={qrSrc} alt={`QR Sto ${num}`} className="w-full aspect-square rounded-xl" />
                      <a href={qrSrc} download={`sto-${num}-qr.png`}
                        className="mt-2 block text-xs font-semibold py-1.5 rounded-xl"
                        style={{ background: "#f97316", color: "#fff" }}>
                        ⬇ Preuzmi
                      </a>
                    </div>
                  );
                })}
              </div>

              <button onClick={() => window.print()}
                className="w-full mt-4 py-3 rounded-2xl font-bold text-sm"
                style={{ background: dark ? "#292524" : "#f5f0e8", color: textMain }}>
                🖨️ Štampaj sve
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewCat && (
        <NewCategoryModal
          onSave={handleAddCategory}
          onClose={() => setShowNewCat(false)}
          dark={dark}
        />
      )}

      {/* ── CAFE EDIT MODAL ── */}
      {showCafeEdit && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center p-0 md:p-6" style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={e => e.target === e.currentTarget && setShowCafeEdit(false)}>
          <div className="w-full md:max-w-xl rounded-t-3xl md:rounded-3xl p-6 overflow-y-auto" style={{ background: dark ? "#1c1410" : "#fff", maxHeight: "90vh" }}>
            <h2 className="font-bold text-lg mb-4" style={{ color: textMain }}>Podešavanja kafića</h2>

            <p className="text-sm mb-4 animate-fadeIn" style={{ color: textSub }}>Naziv, logo i ostale postavke kafića mijenjaju se u Super Admin panelu (👑).</p>

            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: textSub }}>Šifra za konobare</p>
              <input type="text" value={cafeInfo.waiterPasscode || "1357"}
                onChange={e => setCafeInfo(p => ({ ...p, waiterPasscode: e.target.value }))}
                placeholder="npr. 1357"
                maxLength={8}
                className="w-full px-4 py-3 rounded-xl border outline-none text-base font-bold tracking-widest text-center"
                style={{ background: dark ? "#2a2220" : "#f9f9f9", color: textMain, borderColor: "#f97316" }} />
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: textSub }}>Lozinka za Admin Panel</p>
              <input type="text" value={cafeInfo.adminPassword || "admin123"}
                onChange={e => setCafeInfo(p => ({ ...p, adminPassword: e.target.value }))}
                placeholder="npr. admin123"
                className="w-full px-4 py-3 rounded-xl border outline-none text-base font-semibold"
                style={{ background: dark ? "#2a2220" : "#f9f9f9", color: textMain, borderColor: "#f97316" }} />
            </div>

            <button onClick={async () => {
              const { error } = await supabase
                .from("cafe_info")
                .update({
                  waiter_passcode: cafeInfo.waiterPasscode || "1357",
                  admin_password: cafeInfo.adminPassword || "admin123"
                })
                .eq("id", 1);
              if (error) {
                console.error("Error saving cafe settings:", error);
                alert("Greška pri čuvanju podešavanja.");
              } else {
                setShowCafeEdit(false);
              }
            }}
              className="w-full py-4 rounded-2xl font-bold text-base"
              style={{ background: "#f97316", color: "#fff" }}>
              Sačuvaj
            </button>
            <button onClick={() => setShowCafeEdit(false)}
              className="w-full mt-2 py-3 rounded-2xl text-sm font-medium"
              style={{ background: dark ? "#292524" : "#f0ece4", color: textSub }}>
              Odustani
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
