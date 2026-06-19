import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function SuperAdminLoginScreen({ onLogin, dark }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const bg       = dark ? "#0f0a05" : "#ffffff";
  const cardBg   = dark ? "#1c1410" : "#f9f5f0";
  const textMain = dark ? "#ffffff" : "#1a1208";
  const textSub  = dark ? "#78716c" : "#9ca3af";
  const borderCol= dark ? "#2a2220" : "#f0ece8";

  const attempt = async () => {
    const { data, error } = await supabase
      .from("cafe_info")
      .select("superadmin_password")
      .eq("id", 1)
      .maybeSingle();
    if (!error && data) {
      const correctPw = data.superadmin_password || "superadmin999";
      if (pw === correctPw) {
        onLogin();
      } else {
        setErr(true);
        setTimeout(() => setErr(false), 1500);
      }
    } else {
      alert("Greška pri povezivanju sa bazom podataka.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 font-body" style={{ background: bg }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4"
            style={{ background: "#8b5cf6" }}>👑</div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: textMain }}>Super Admin</h1>
          <p className="text-sm" style={{ color: textSub }}>Unesite super-lozinku za pristup</p>
        </div>
        <div className="rounded-3xl p-6 border shadow-sm" style={{ background: cardBg, borderColor: borderCol }}>
          <input type="password" placeholder="••••••••" value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && attempt()}
            className="w-full px-4 py-3.5 rounded-2xl border outline-none text-center text-lg font-bold tracking-widest mb-4 transition-all"
            style={{
              background: dark ? "#0f0a05" : "#ffffff",
              color: textMain,
              borderColor: err ? "#ef4444" : "#8b5cf6"
            }} />
          <button onClick={attempt}
            className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
            style={{ background: "#8b5cf6", color: "#fff" }}>Prijavi se</button>
        </div>
      </div>
    </div>
  );
}

export default function SuperAdmin({ dark, cafeInfo, setCafeInfo, onBack }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [localCafeInfo, setLocalCafeInfo] = useState({
    name: "",
    tagline: "",
    logo: "",
    emoji: "☕",
    logoBg: "#f97316",
    waiterPasscode: "1357",
    adminPassword: "admin123",
    superadminPassword: "superadmin999"
  });

  const bg       = dark ? "#0f0a05" : "#f4f0eb";
  const cardBg   = dark ? "#1c1410" : "#ffffff";
  const textMain = dark ? "#ffffff" : "#1a1208";
  const textSub  = dark ? "#78716c" : "#9ca3af";
  const borderCol= dark ? "#2a2220" : "#f0ece8";
  const headerBg = dark ? "#0f0a05" : "#ffffff";

  // Fetch settings from Supabase
  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("cafe_info")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (!error && data) {
      setLocalCafeInfo({
        name: data.name || "",
        tagline: data.tagline || "",
        logo: data.logo_url || "",
        emoji: data.emoji || "☕",
        logoBg: data.logo_bg || "#f97316",
        waiterPasscode: data.waiter_passcode || "1357",
        adminPassword: data.admin_password || "admin123",
        superadminPassword: data.superadmin_password || "superadmin999"
      });
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchSettings();

      // Subscribe to cafe_info changes
      const cafeSub = supabase
        .channel("super-cafe-changes")
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "cafe_info", filter: "id=eq.1" }, (payload) => {
          setLocalCafeInfo({
            name: payload.new.name || "",
            tagline: payload.new.tagline || "",
            logo: payload.new.logo_url || "",
            emoji: payload.new.emoji || "☕",
            logoBg: payload.new.logo_bg || "#f97316",
            waiterPasscode: payload.new.waiter_passcode || "1357",
            adminPassword: payload.new.admin_password || "admin123",
            superadminPassword: payload.new.superadmin_password || "superadmin999"
          });
        })
        .subscribe();

      return () => {
        supabase.removeChannel(cafeSub);
      };
    }
  }, [loggedIn]);

  const handleSave = async () => {
    if (uploadingLogo) {
      alert("Sačekajte da se prenos logotipa završi.");
      return;
    }
    const { error } = await supabase
      .from("cafe_info")
      .update({
        name: localCafeInfo.name,
        tagline: localCafeInfo.tagline,
        logo_url: localCafeInfo.logo,
        emoji: localCafeInfo.emoji,
        logo_bg: localCafeInfo.logoBg,
        waiter_passcode: localCafeInfo.waiterPasscode || "1357",
        admin_password: localCafeInfo.adminPassword || "admin123",
        superadmin_password: localCafeInfo.superadminPassword || "superadmin999"
      })
      .eq("id", 1);

    if (error) {
      console.error("Error saving settings:", error);
      alert("Greška pri čuvanju podešavanja.");
    } else {
      setCafeInfo(prev => ({
        ...prev,
        name: localCafeInfo.name,
        tagline: localCafeInfo.tagline,
        logo: localCafeInfo.logo,
        emoji: localCafeInfo.emoji,
        logoBg: localCafeInfo.logoBg,
        waiterPasscode: localCafeInfo.waiterPasscode,
        adminPassword: localCafeInfo.adminPassword,
        superadminPassword: localCafeInfo.superadminPassword
      }));
      alert("Podešavanja su uspješno sačuvana!");
    }
  };

  if (!loggedIn) {
    return <SuperAdminLoginScreen onLogin={() => setLoggedIn(true)} dark={dark} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-body animate-fadeIn pb-12" style={{ background: bg }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b shrink-0 sticky top-0 z-10" style={{ borderColor: borderCol, background: headerBg }}>
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-xl px-2 py-1" style={{ color: textMain }}>←</button>
          <div>
            <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: textSub }}>Sistem</p>
            <h1 className="text-xl font-bold" style={{ color: textMain }}>👑 Super Admin</h1>
          </div>
        </div>
        <button onClick={() => setLoggedIn(false)} className="text-xs font-semibold px-4 py-2 rounded-full border transition-all"
          style={{ color: "#ef4444", borderColor: "#fca5a5", background: dark ? "rgba(239,68,68,0.1)" : "#fef2f2" }}>
          Odjavi se
        </button>
      </div>

      {/* Main Settings Form */}
      <div className="max-w-xl w-full mx-auto px-4 mt-6">
        <div className="rounded-3xl p-6 border shadow-sm" style={{ background: cardBg, borderColor: borderCol }}>
          <h2 className="font-bold text-lg mb-4" style={{ color: textMain }}>Globalna Podešavanja</h2>

          {/* Logo Section */}
          <div className="flex items-center gap-4 mb-4">
            <label className="cursor-pointer">
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed"
                style={{ background: localCafeInfo.logo ? "transparent" : localCafeInfo.logoBg, borderColor: "#8b5cf6" }}>
                {localCafeInfo.logo
                  ? <img src={localCafeInfo.logo} alt="logo" className="w-full h-full object-cover" />
                  : <span className="text-4xl">{localCafeInfo.emoji}</span>}
              </div>
              <input type="file" accept="image/*" className="hidden"
                onChange={async e => {
                  const file = e.target.files[0]; if (!file) return;
                  setUploadingLogo(true);
                  const fileExt = file.name.split('.').pop();
                  const fileName = `logo-${Date.now()}.${fileExt}`;
                  const { data, error } = await supabase.storage
                    .from('menu-images')
                    .upload(fileName, file);
                  if (!error) {
                    const { data: { publicUrl } } = supabase.storage
                      .from('menu-images')
                      .getPublicUrl(fileName);
                    setLocalCafeInfo(p => ({ ...p, logo: publicUrl }));
                  } else {
                    console.error("Error uploading logo:", error);
                    alert("Greška pri uvozu logotipa.");
                  }
                  setUploadingLogo(false);
                }} />
            </label>
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: textMain }}>Logo</p>
              <p className="text-xs mb-1" style={{ color: textSub }}>{uploadingLogo ? "Učitavanje..." : "Klikni da zamijeniš"}</p>
              {localCafeInfo.logo && (
                <button onClick={() => setLocalCafeInfo(p => ({ ...p, logo: "" }))}
                  className="text-xs text-red-500 hover:underline">✕ Ukloni</button>
              )}
            </div>
          </div>

          {/* Naziv Kafica */}
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: textSub }}>Naziv kafića</p>
            <input type="text" value={localCafeInfo.name}
              onChange={e => setLocalCafeInfo(p => ({ ...p, name: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border outline-none text-base font-semibold"
              style={{ background: dark ? "#2a2220" : "#f9f9f9", color: textMain, borderColor: "#8b5cf6" }} />
          </div>

          {/* Podnaslov */}
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: textSub }}>Podnaslov</p>
            <input type="text" value={localCafeInfo.tagline}
              onChange={e => setLocalCafeInfo(p => ({ ...p, tagline: e.target.value }))}
              placeholder="npr. Dobrodošli, Banja Luka..."
              className="w-full px-4 py-3 rounded-xl border outline-none text-sm"
              style={{ background: dark ? "#2a2220" : "#f9f9f9", color: textMain, borderColor: borderCol }} />
          </div>

          {/* Emoji & Boja pozadine (Logo) */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: textSub }}>Logo Emoji</p>
              <input type="text" value={localCafeInfo.emoji}
                onChange={e => setLocalCafeInfo(p => ({ ...p, emoji: e.target.value }))}
                maxLength={2}
                className="w-full px-4 py-3 rounded-xl border outline-none text-center text-lg font-bold"
                style={{ background: dark ? "#2a2220" : "#f9f9f9", color: textMain, borderColor: borderCol }} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: textSub }}>Boja pozadine logoa</p>
              <div className="flex gap-2">
                <input type="color" value={localCafeInfo.logoBg}
                  onChange={e => setLocalCafeInfo(p => ({ ...p, logoBg: e.target.value }))}
                  className="w-12 h-11 p-1 rounded-xl border cursor-pointer outline-none shrink-0"
                  style={{ background: dark ? "#2a2220" : "#f9f9f9", borderColor: borderCol }} />
                <input type="text" value={localCafeInfo.logoBg}
                  onChange={e => setLocalCafeInfo(p => ({ ...p, logoBg: e.target.value }))}
                  maxLength={7}
                  placeholder="#f97316"
                  className="w-full px-3 py-3 rounded-xl border outline-none text-center text-sm font-semibold uppercase"
                  style={{ background: dark ? "#2a2220" : "#f9f9f9", color: textMain, borderColor: borderCol }} />
              </div>
            </div>
          </div>

          <hr className="my-5" style={{ borderColor: borderCol }} />

          {/* Sifra za konobare */}
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: textSub }}>Šifra za konobare</p>
            <input type="text" value={localCafeInfo.waiterPasscode}
              onChange={e => setLocalCafeInfo(p => ({ ...p, waiterPasscode: e.target.value }))}
              placeholder="npr. 1357"
              className="w-full px-4 py-3 rounded-xl border outline-none text-center font-bold tracking-widest text-lg"
              style={{ background: dark ? "#2a2220" : "#f9f9f9", color: textMain, borderColor: borderCol }} />
          </div>

          {/* Lozinka za Admin Panel */}
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: textSub }}>Lozinka za Admin Panel</p>
            <input type="text" value={localCafeInfo.adminPassword}
              onChange={e => setLocalCafeInfo(p => ({ ...p, adminPassword: e.target.value }))}
              placeholder="npr. admin123"
              className="w-full px-4 py-3 rounded-xl border outline-none text-sm font-semibold"
              style={{ background: dark ? "#2a2220" : "#f9f9f9", color: textMain, borderColor: borderCol }} />
          </div>

          {/* Lozinka za Super Admin */}
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: textSub }}>Lozinka za Super Admin</p>
            <input type="text" value={localCafeInfo.superadminPassword}
              onChange={e => setLocalCafeInfo(p => ({ ...p, superadminPassword: e.target.value }))}
              placeholder="npr. superadmin999"
              className="w-full px-4 py-3 rounded-xl border outline-none text-sm font-semibold"
              style={{ background: dark ? "#2a2220" : "#f9f9f9", color: textMain, borderColor: "#8b5cf6" }} />
          </div>

          {/* Sačuvaj dugme */}
          <button onClick={handleSave}
            className="w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98]"
            style={{ background: "#8b5cf6", color: "#fff" }}>
            Sačuvaj podešavanja
          </button>
        </div>
      </div>
    </div>
  );
}
