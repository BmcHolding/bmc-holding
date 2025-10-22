import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

// SPOSTATA FUORI dal componente per rispettare le regole dei React Hooks e per stabilità
function initAnalytics() {
  // Qui potrai incollare in futuro GA4/Pixel (es. Google Analytics, Facebook Pixel)
}

export default function App() {
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");
  const [consent, setConsent] = useState(false);
  // Cookie banner
  const [cookieChoice, setCookieChoice] = useState(null); // 'accepted' | 'rejected' | null
  const [showCookie, setShowCookie] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("cookieConsent") : null;
    if (!stored) {
      setShowCookie(true);
    } else {
      setCookieChoice(stored);
      if (stored === "accepted") initAnalytics();
    }
  }, []);

  function handleCookieConsent(decision) {
    setCookieChoice(decision);
    setShowCookie(false);
    try { localStorage.setItem("cookieConsent", decision); } catch {}
    if (decision === "accepted") initAnalytics();
  }

  function reopenCookieBanner() {
    setShowCookie(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setOk(false);
    setErr("");

    const FORMSPREE_ENDPOINT = "https://formspree.io/f/xzzaqzeb";
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);

    const data = {
      name: (fd.get("name") || "").toString(),
      email: (fd.get("email") || "").toString(),
      phone: (fd.get("phone") || "").toString(),
      zone: (fd.get("zone") || "").toString(),
      message: (fd.get("message") || "").toString(),
      consent: consent ? "true" : "false",
      source: "bmc-holding-website",
    };

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setOk(true);
        formEl.reset();
        setConsent(false);
      } else {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Invio non riuscito (${res.status})`);
      }
    } catch (e2) {
      setErr(e2.message || "Si è verificato un errore. Riprova.");
    } finally {
      setSubmitting(false);
    }
  }

  // Dev tests facoltativi
  function runDevTests() {
    console.groupCollapsed("[BMC] Dev Tests");
    try {
      console.assert(typeof reopenCookieBanner === "function", "reopenCookieBanner deve essere una funzione");
      const orig = typeof window !== "undefined" ? localStorage.getItem("cookieConsent") : null;
      handleCookieConsent("rejected");
      console.assert(localStorage.getItem("cookieConsent") === "rejected", "Dovrebbe salvare 'rejected'");
      handleCookieConsent("accepted");
      console.assert(localStorage.getItem("cookieConsent") === "accepted", "Dovrebbe salvare 'accepted'");
      if (orig === null) localStorage.removeItem("cookieConsent");
      else localStorage.setItem("cookieConsent", orig);
      console.info("✅ Dev tests eseguiti");
    } catch (e) {
      console.error("❌ Dev tests error:", e);
    } finally {
      console.groupEnd();
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined" && window.__BMC_RUN_TESTS__) {
      runDevTests();
    }
  }, []);

  // --- Scroll helpers (header sticky offset) ---
  const HEADER_OFFSET = 72;

  function scrollToTop(e) {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function scrollToId(id, e, offset = HEADER_OFFSET) {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    const el = document.getElementById(id);
    if (!el) { scrollToTop(); return; }
    const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  return (
    // Questo è l'UNICO elemento radice del componente
    <div id="home" className="min-h-screen w-full text-slate-900 bg-white">
      
      {/* === SEO META START (Unificato) === */}
      {/* Ora c'è UN SOLO tag Helmet con tutti i metadati */}
      <Helmet>
        {/* Base */}
        <title>BMC Holding — Property Manager per Affitti Brevi e Case Vacanza</title>
        <meta
          name="description"
          content="Gestione professionale e completa per i tuoi immobili. Offriamo check-in, pulizie, tariffe dinamiche e report trasparenti. Affidati a BMC Holding."
        />
        <meta name="keywords" content="Property Manager, Affitti Brevi, Case Vacanza, Gestione Immobiliare, Co-hosting, BMC Holding, Airbnb, Booking, Formia, Lazio, Turismo, Locazioni Turistiche" />
        <meta name="author" content="BMC Holding" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://bmcholding.it/" />
        <link rel="icon" href="/favicon.png" type="image/png" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="it_IT" />
        <meta property="og:site_name" content="BMC Holding" />
        <meta
          property="og:title"
          content="BMC Holding — Property Manager per Affitti Brevi e Case Vacanza"
        />
        <meta
          property="og:description"
          content="Gestione professionale e completa per i tuoi immobili. Offriamo check-in, pulizie, tariffe dinamiche e report trasparenti. Affidati a BMC Holding."
        />
        <meta property="og:url" content="https://bmcholding.it/" />
        <meta property="og:image" content="https://bmcholding.it/logo-bmc-transparent.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="BMC Holding — Property Manager per Affitti Brevi e Case Vacanza"
        />
        <meta
          name="twitter:description"
          content="Gestione completa per i tuoi affitti brevi. Aumenta il guadagno con BMC Holding."
        />
        <meta
          name="twitter:image"
          content="https://bmcholding.it/logo-bmc-transparent.png"
        />

        {/* JSON-LD (come stringa) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "BMC Holding",
              "url": "https://bmcholding.it",
              "logo": "https://bmcholding.it/logo-bmc-transparent.png",
              "sameAs": [
                "https://www.facebook.com/profile.php?id=615658369803479",
                "https://www.instagram.com/bmc.holding_",
                "https://www.linkedin.com/company/bmc-holding"
              ],
              "description":
                "BMC Holding è una società specializzata nella gestione di affitti brevi e locazioni turistiche. Offriamo soluzioni professionali di property management, massimizzando i rendimenti immobiliari."
            }),
          }}
        />
      </Helmet>
      {/* === SEO META END === */}
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0A2740] backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          {/* Logo cliccabile */}
          <a
            href="#home"
            onClick={(e) => scrollToId("home", e)}
            className="flex items-center gap-3 cursor-pointer"
            aria-label="BMC Holding - Home"
          >
            <img
              src="/logo-bmc-transparent.png?v=1"
              alt="BMC Holding Property Management"
              className="h-12 w-auto drop-shadow-md"
            />
            <div>
              <p className="font-semibold tracking-tight text-white">BMC Holding</p>
              <p className="text-xs text-slate-300">
                Società di acquisizione e gestione Property Manager
              </p>
            </div>
          </a>
          {/* Navbar */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-white">
            <a
              href="#home"
              onClick={(e) => scrollToId("home", e)}
              className="hover:text-[#FF8C42] transition"
            >
              Home
            </a>
            {/* Link Servizi */}
            <a
              href="#servizi"
              onClick={(e) => scrollToId("servizi", e)}
              className="hover:text-[#FF8C42] transition"
            >
              Servizi
            </a>
            <a
              href="#perche"
              onClick={(e) => scrollToId("perche", e)}
              className="hover:text-[#FF8C42] transition"
            >
              Perché noi
            </a>

            <a
              href="#processo"
              onClick={(e) => scrollToId("processo", e)}
              className="hover:text-[#FF8C42] transition"
            >
              Come operiamo
            </a>
            <a
              href="#risultati"
              onClick={(e) => scrollToId("risultati", e)}
              className="hover:text-[#FF8C42] transition"
            >
              Risultati
            </a>
            <a
              href="#contatti"
              onClick={(e) => scrollToId("contatti", e)}
              className="hover:text-[#FF8C42] transition"
            >
              Contatti
            </a>
          </nav>
          <a
            href="#contatti"
            onClick={(e) => scrollToId("contatti", e)}
            className="hidden md:inline-flex items-center gap-2 rounded-xl bg-[#FF8C42] text-white px-4 py-2 text-sm hover:bg-orange-500 transition"
          >
            Contattaci
          </a>
        </div>
      </header>
      
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A2740] via-[#1E3A8A] to-white text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Più guadagni dai tuoi immobili, <span className="text-[#FF8C42]">zero pensieri</span>.
            </h1>
            <p className="mt-5 text-blue-100 leading-relaxed">
              BMC Holding è una società specializzata nell’acquisizione e nella gestione professionale di property manager per affitti brevi e locazioni turistiche.
              Offriamo annunci ottimizzati, prezzi dinamici, check-in, pulizie e gestione burocratica. Tu incassi, al resto pensiamo noi.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#contatti" onClick={(e)=>scrollToId("contatti", e)} className="inline-flex items-center justify-center rounded-xl bg-[#FF8C42] text-white px-5 py-3 text-sm font-medium hover:bg-orange-500 transition">Richiedi una consulenza gratuita</a>
              <a href="#servizi" onClick={(e)=>scrollToId("servizi", e)} className="inline-flex items-center justify-center rounded-xl border border-[#FF8C42] text-white px-5 py-3 text-sm font-medium hover:bg-orange-500 transition">Scopri i nostri servizi</a>
            </div>
            <ul className="mt-6 text-sm text-blue-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <li>✔ Gestione completa</li>
              <li>✔ Tariffe dinamiche</li>
              <li>✔ Report mensili</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 p-6 shadow-sm bg-white text-slate-900">
            <div className="text-sm text-slate-500 mb-2">Simulazione esempio (città turistica)</div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-xs text-slate-500">Occupazione</div>
                <div className="text-2xl font-semibold">65–85%</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-xs text-slate-500">Ricavo annuo stimato</div>
                <div className="text-2xl font-semibold">€ 11.400</div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 col-span-2">
                <div className="text-xs text-slate-500">Nota</div>
                <div className="text-sm">Valori indicativi: personalizziamo la stima dopo un sopralluogo.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Trust strip */}
      <section className="border-y border-slate-200 bg-[#F3F4F6]">
        <div className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-[#0A2740]">
          <div className="text-sm"><span className="font-semibold text-[#FF8C42]">+24h</span> supporto ospiti</div>
          <div className="text-sm"><span className="font-semibold text-[#FF8C42]">SOP</span> operativi chiari</div>
          <div className="text-sm"><span className="font-semibold text-[#FF8C42]">Compliance</span> Alloggiati/ISTAT</div>
          <div className="text-sm"><span className="font-semibold text-[#FF8C42]">Report</span> mensili trasparenti</div>
        </div>
      </section>
      {/* Servizi */}
      <section id="servizi" className="mx-auto max-w-6xl px-4 py-16 bg-white scroll-mt-36">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#0A2740]">I nostri servizi</h2>
        <p className="mt-2 text-slate-600">Pacchetti flessibili: dal co-hosting base al servizio completo.</p>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            { title: "Marketing & Annunci", pts: ["Foto e descrizioni ottimizzate", "Pubblicazione su Airbnb/Booking", "Calendario sincronizzato"] },
            { title: "Operatività & Ospiti", pts: ["Check-in/out e assistenza", "Pulizie professionali", "Kit cortesia e biancheria"] },
            { title: "Pricing & Compliance", pts: ["Prezzi dinamici per stagione/eventi", "Alloggiati Web & imposta soggiorno", "Flussi ISTAT regionali"] },
          ].map((c, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 p-6 hover:shadow-sm transition bg-[#F3F4F6]">
              <h3 className="font-semibold text-lg text-[#0A2740]">{c.title}</h3>
              <ul className="mt-3 space-y-2 text-slate-600 text-sm">
                {c.pts.map((p, j) => <li key={j}>• {p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
      {/* Perché noi */}
      <section id="perche" className="mx-auto max-w-6xl px-4 pb-16 scroll-mt-24">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Perché scegliere BMC Holding</h2>
            <ul className="mt-4 space-y-3 text-slate-600">
              <li>• <span className="font-medium text-slate-900">Approccio da partner</span>: condividiamo obiettivi e risultati con i nostri clienti.</li>
              <li>• <span className="font-medium text-slate-900">Trasparenza</span>: rendiconti chiari, nessun costo nascosto.</li>
              <li>• <span className="font-medium text-slate-900">Flessibilità</span>: contratti snelli, test iniziale di 3 mesi.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 p-6 bg-white">
            <h3 className="font-semibold">KPI che monitoriamo</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-xs text-slate-500">Occupazione</div>
                <div className="text-2xl font-semibold">65–85%</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-xs text-slate-500">ADR</div>
                <div className="text-2xl font-semibold">€€</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-xs text-slate-500">Recensioni</div>
                <div className="text-xl font-semibold">★★★★★</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-xs text-slate-500">Tempi risposta</div>
                <div className="text-xl font-semibold">&lt; 1h</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Processo */}
      <section id="processo" className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Come operiamo (in 4 passi)</h2>
        <div className="mt-8 grid md:grid-cols-4 gap-6">
          {[
            { n: "1", t: "Sopralluogo", d: "Valutazione immobile e dotazioni." },
            { n: "2", t: "Setup", d: "Foto, annunci, pricing dinamico." },
            { n: "3", t: "Go-Live", d: "Check-in, pulizie, assistenza ospiti." },
            { n: "4", t: "Ottimizzazione", d: "Report e miglioramento continuo." },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 p-6 bg-white">
              <div className="h-8 w-8 rounded-full bg-[#FF8C42] text-white grid place-items-center text-sm font-semibold">{s.n}</div>
              <h3 className="mt-3 font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Risultati */}
      <section id="risultati" className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Casi & testimonianze</h2>
        <p className="mt-2 text-slate-600">Inseriremo case study reali e recensioni una volta attivi i primi immobili.</p>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl border border-slate-200 p-4 bg-white h-32 grid place-items-center text-slate-400 text-sm">Segnaposto</div>
          ))}
        </div>
      </section>
      {/* Contatti */}
      <section id="contatti" className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-2xl border border-slate-200 p-6 bg-white">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Parliamo dei tuoi immobili</h2>
          <p className="mt-2 text-slate-600">Compila il form o scrivici su WhatsApp: prepariamo una simulazione gratuita e senza impegno.</p>
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm text-slate-600">Nome e Cognome</label>
                <input name="name" required className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300" placeholder="Mario Rossi" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-slate-600">Email</label>
                  <input name="email" type="email" required className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="nome@email.it" />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Telefono</label>
                  <input name="phone" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="333 1234567" />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-600">Zona/Immobile</label>
                <input name="zone" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Es. Roma – Trastevere, bilocale" />
              </div>
              <div>
                <label className="text-sm text-slate-600">Messaggio</label>
                <textarea name="message" rows={4} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Raccontaci l'immobile e le esigenze" />
              </div>
              <label className="flex items-start gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>Acconsento al trattamento dei dati ai fini di contatto e preventivo (GDPR). <a href="#privacy" className="underline decoration-slate-300">Informativa privacy</a></span>
              </label>
              <button disabled={!consent || submitting} type="submit" className="w-full md:w-auto inline-flex items-center gap-2 rounded-xl bg-[#FF8C42] disabled:opacity-60 text-white px-5 py-3 text-sm font-medium hover:bg-orange-500">
                {submitting ? "Invio in corso…" : "Invia richiesta"}
              </button>
              {ok && <p className="text-green-700 text-sm">Grazie! Richiesta inviata. Ti ricontattiamo entro 24 ore lavorative.</p>}
              {err && <p className="text-red-700 text-sm">{err}</p>}
            </form>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-xs text-slate-500">Contatti diretti</div>
                <div className="mt-1">📞 <a href="tel:+393298988141" className="underline decoration-slate-300">329 8988141</a></div>
                <div>✉️ <a href="mailto:gioia.bmc@gmail.com" className="underline decoration-slate-300">gioia.bmc@gmail.com</a></div>
                <div>📍 Formia, Latina</div>
                <div className="mt-2"><a href="https://wa.me/393298988141" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 hover:bg-slate-50">Scrivici su WhatsApp</a></div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-xs text-slate-500">Documenti utili</div>
                <ul className="mt-1 list-disc list-inside text-slate-600">
                  <li>Checklist operativa</li>
                  <li>Contratto co-hosting (bozza)</li>
                  <li>Slide di presentazione</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Cookie banner */}
      {showCookie && (
        <div className="fixed inset-x-4 bottom-4 z-50">
          <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white shadow-lg p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-sm text-slate-700">
              Usiamo cookie tecnici e, previo consenso, cookie di misurazione/marketing. Puoi leggere la <a className="underline" href="#cookie">Cookie Policy</a>.
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleCookieConsent("rejected")} className="rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Rifiuta</button>
              <button onClick={() => handleCookieConsent("accepted")} className="rounded-xl bg-[#FF8C42] text-white px-4 py-2 text-sm hover:bg-orange-500">Accetta</button>
            </div>
          </div>
        </div>
      )}
      {/* Footer */}
      <footer className="border-t border-slate-200 bg-[#0A2740] text-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm grid md:grid-cols-2 gap-4">
          <div>© {new Date().getFullYear()} BMC Holding. Tutti i diritti riservati.</div>
          <div className="md:text-right">
            <a href="#privacy" className="hover:text-[#FF8C42]">Privacy</a>
            <span className="px-2">·</span>
            <a href="#cookie" className="hover:text-[#FF8C42]">Cookie</a>
            <span className="px-2">·</span>
            <button onClick={reopenCookieBanner} className="underline decoration-slate-400 hover:text-[#FF8C42]">Gestisci cookie</button>
            <span className="px-2">·</span>
            <a href="#contatti" onClick={(e)=>scrollToId("contatti", e)} className="hover:text-[#FF8C42]">Contatti</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
