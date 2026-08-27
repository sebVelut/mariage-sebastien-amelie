/* =========================================================================
   Site de mariage — logique
   Tout le contenu vient de assets/js/config.js (objet global WEDDING).
   Aucun framework, aucune dépendance.
   ========================================================================= */
(function () {
  "use strict";

  // `const WEDDING` déclaré dans config.js n'est pas attaché à window :
  // on va chercher la variable globale, avec un repli sur window.WEDDING.
  const C = (typeof WEDDING !== "undefined" && WEDDING) || window.WEDDING || {};
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* petit wrapper : sessionStorage peut lever une exception (mode privé,
     aperçu embarqué…). On ne doit jamais casser le site pour ça. */
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } },
  };

  /* ===================================================================== */
  /* 1. INJECTION DU CONTENU                                               */
  /* ===================================================================== */
  const TPL = {
    prenomA: C.couple?.prenomA,
    prenomB: C.couple?.prenomB,
    initiales: C.couple?.initiales,
    jourTexte: C.date?.jourTexte,
    jourChiffre: C.date?.jourChiffre,
    moisChiffre: C.date?.moisChiffre,
    annee: C.date?.annee,
    lieuNom: C.lieu?.nom,
    lieuAdresse: C.lieu?.adresse,
    infoParking: C.lieu?.infoParking,
    accroche: C.textes?.accroche,
    carton: C.textes?.carton,
    invitationTitre: C.textes?.invitationTitre,
    signature: C.textes?.signature,
    footerMsg: C.textes?.footer,
    dateLimite: C.rsvp?.dateLimite,
  };

  function hydrate() {
    $$("[data-tpl]").forEach((el) => {
      const v = TPL[el.dataset.tpl];
      if (v != null && v !== "") el.textContent = v;
    });

    document.title = `${TPL.prenomA} & ${TPL.prenomB} — Notre mariage`;

    // paragraphes de l'invitation
    const prose = $("#invitationProse");
    if (prose) {
      prose.innerHTML = "";
      (C.textes?.invitationParagraphes || []).forEach((t) => {
        const p = document.createElement("p");
        p.textContent = t;
        prose.appendChild(p);
      });
    }

    // contact du formulaire
    const mail = $("#mailContact");
    if (mail && C.rsvp?.emailContact) {
      mail.textContent = C.rsvp.emailContact;
      mail.href = "mailto:" + C.rsvp.emailContact;
    }
    const tel = $("#telContact");
    if (tel && C.rsvp?.telContact) tel.textContent = " · " + C.rsvp.telContact;

    // nombre de personnes
    const nb = $("#f-nb");
    if (nb) {
      const max = C.rsvp?.maxInvites || 6;
      for (let i = 1; i <= max; i++) {
        const o = document.createElement("option");
        o.value = String(i);
        o.textContent = i === 1 ? "1 personne" : i + " personnes";
        nb.appendChild(o);
      }
    }
  }

  /* --------------------------------------------------------- photos ---- */
  function loadPhoto(frame, conf) {
    const img = frame.querySelector("img");
    if (!img || !conf?.src) return;
    const probe = new Image();
    probe.onload = () => {
      img.src = conf.src;
      img.alt = conf.alt || "";
      frame.classList.add("has-img");
    };
    probe.onerror = () => { /* on garde le cadre « photo à venir » */ };
    probe.src = conf.src;
  }

  function buildPhotos() {
    const coupleFrame = $('[data-photo="couple"] .frame');
    if (coupleFrame) loadPhoto(coupleFrame, C.photos?.couple);

    const gal = $("#gallery");
    if (!gal) return;
    gal.innerHTML = "";
    (C.photos?.galerie || []).forEach((ph, i) => {
      const fig = document.createElement("figure");
      fig.className = "reveal";
      fig.dataset.delay = String((i % 3) + 1);
      fig.innerHTML = `
        <div class="frame">
          <img alt="">
          <div class="frame__fallback">
            <svg viewBox="0 0 48 48" width="30" height="30" aria-hidden="true">
              <path d="M6 38V14a3 3 0 0 1 3-3h6l3-4h12l3 4h6a3 3 0 0 1 3 3v24a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3Z" fill="none" stroke="currentColor" stroke-width="1.4"/>
              <circle cx="24" cy="25" r="8" fill="none" stroke="currentColor" stroke-width="1.4"/>
            </svg>
            <span>Photo à venir</span>
          </div>
        </div>
        <figcaption></figcaption>`;
      fig.querySelector("figcaption").textContent = ph.alt || "";
      gal.appendChild(fig);
      loadPhoto(fig.querySelector(".frame"), ph);
    });
  }

  /* ------------------------------------------------------- programme ---- */
  const ICONS = {
    arrivee:   '<path d="M3 20h18M6 20V9l6-5 6 5v11M10 20v-6h4v6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>',
    ceremonie: '<path d="M12 3v6M9 6h6M6 21V13c0-3.3 2.7-6 6-6s6 2.7 6 6v8M4 21h16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
    anneaux:   '<circle cx="9" cy="14" r="5.2" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="15" cy="14" r="5.2" fill="none" stroke="currentColor" stroke-width="1.3"/>',
    cocktail:  '<path d="M4 4h16l-8 9v7M8 20h8M6.5 8h11" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>',
    photo:     '<rect x="3" y="7" width="18" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M9 7l1.6-2.5h2.8L15 7" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="12" cy="13.5" r="3.6" fill="none" stroke="currentColor" stroke-width="1.3"/>',
    diner:     '<path d="M6 3v8a2.5 2.5 0 0 0 5 0V3M8.5 3v6M17 3c-1.6 1-2.4 2.7-2.4 4.6 0 1.5.8 2.6 2.4 2.9M17 3v18M6 12v9" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
    danse:     '<path d="M9 18V6l10-2v12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="2.6" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="16.5" cy="16" r="2.6" fill="none" stroke="currentColor" stroke-width="1.3"/>',
    brunch:    '<path d="M4 11h13a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M17 11h1.6a2.2 2.2 0 1 1 0 4.4H17M4 19h14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M8 7.5c0-1 1-1.4 1-2.5M12 7.5c0-1 1-1.4 1-2.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
  };

  function buildTimeline() {
    const tl = $("#timeline");
    if (!tl) return;
    tl.innerHTML = "";
    (C.programme || []).forEach((it) => {
      const li = document.createElement("li");
      li.className = "tl-item reveal";
      li.innerHTML = `
        <div class="tl-item__card">
          <span class="tl-item__hour"></span>
          <h3 class="tl-item__title"></h3>
          <p class="tl-item__place"></p>
          <p class="tl-item__text"></p>
        </div>
        <div class="tl-item__dot" aria-hidden="true">
          <svg viewBox="0 0 24 24">${ICONS[it.icone] || ICONS.ceremonie}</svg>
        </div>`;
      li.querySelector(".tl-item__hour").textContent = it.heure || "";
      li.querySelector(".tl-item__title").textContent = it.titre || "";
      li.querySelector(".tl-item__place").textContent = it.lieu || "";
      li.querySelector(".tl-item__text").textContent = it.texte || "";
      if (!it.lieu) li.querySelector(".tl-item__place").remove();
      if (!it.texte) li.querySelector(".tl-item__text").remove();
      tl.appendChild(li);
    });
  }

  /* ------------------------------------------------------------ carte -- */
  function buildMap() {
    const q = encodeURIComponent(C.lieu?.rechercheMaps || C.lieu?.adresse || "");
    const frame = $("#mapFrame");
    if (frame && q) frame.src = `https://www.google.com/maps?q=${q}&hl=fr&z=14&output=embed`;

    const url = C.lieu?.lienItineraire
      || `https://www.google.com/maps/dir/?api=1&destination=${q}`;
    ["#btnItineraire", "#btnItineraire2"].forEach((sel) => {
      const a = $(sel);
      if (a) a.href = url;
    });
  }

  /* --------------------------------------------------- compte à rebours -- */
  function countdown() {
    const box = $("#countdown");
    if (!box || C.options?.compteARebours === false || !C.date?.iso) return;
    const target = new Date(C.date.iso).getTime();
    if (isNaN(target)) return;
    box.hidden = false;
    const cell = { j: $('[data-cd="j"]'), h: $('[data-cd="h"]'), m: $('[data-cd="m"]'), s: $('[data-cd="s"]') };

    const tick = () => {
      let d = target - Date.now();
      if (d <= 0) {
        box.innerHTML = '<p class="countdown__done">C\'est aujourd\'hui&nbsp;!</p>';
        clearInterval(timer);
        return;
      }
      d = Math.floor(d / 1000);
      const j = Math.floor(d / 86400);
      const h = Math.floor((d % 86400) / 3600);
      const m = Math.floor((d % 3600) / 60);
      const s = d % 60;
      cell.j.textContent = j;
      cell.h.textContent = String(h).padStart(2, "0");
      cell.m.textContent = String(m).padStart(2, "0");
      cell.s.textContent = String(s).padStart(2, "0");
    };
    tick();
    const timer = setInterval(tick, 1000);
  }

  /* ===================================================================== */
  /* 2. NAVIGATION                                                         */
  /* ===================================================================== */
  function nav() {
    const bar = $("#nav");
    const burger = $("#navBurger");
    const links = $("#navLinks");

    const onScroll = () => {
      bar.classList.toggle("is-stuck", window.scrollY > 60);
      $("#toTop").classList.toggle("is-vis", window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    burger.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        links.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });

    $("#toTop").addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });

    // lien actif selon la section visible
    const anchors = $$('#navLinks a[href^="#"]');
    const sections = anchors
      .map((a) => document.getElementById(a.getAttribute("href").slice(1)))
      .filter(Boolean);
    if (!sections.length || !("IntersectionObserver" in window)) return;

    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        anchors.forEach((a) =>
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* ===================================================================== */
  /* 3. ANIMATIONS AU SCROLL + PARALLAXE                                   */
  /* ===================================================================== */
  function scrollFx() {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
      $$(".reveal").forEach((el) => io.observe(el));
    } else {
      $$(".reveal").forEach((el) => el.classList.add("is-in"));
    }

    if (reduceMotion) return;
    const left = $(".side-botanic--left .side-botanic__img");
    const right = $(".side-botanic--right .side-botanic__img");
    if (!left || !right) return;
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        left.style.transform = `translate3d(0,${-y * 0.05}px,0)`;
        right.style.transform = `translate3d(0,${y * 0.05}px,0)`;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ===================================================================== */
  /* 4. ENVELOPPE                                                          */
  /* ===================================================================== */
  function petals(overlay) {
    if (reduceMotion) return;
    const colors = ["#EFD0CE", "#DFAFAF", "#B7C9AC", "#E3ECF1", "#C8AE8D"];
    const n = window.innerWidth < 600 ? 16 : 30;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("i");
      p.className = "petal";
      const size = 6 + Math.random() * 11;
      p.style.cssText =
        `left:${Math.random() * 100}%;width:${size}px;height:${size * 0.7}px;` +
        `background:${colors[i % colors.length]};` +
        `--dx:${(Math.random() - 0.5) * 220}px;--rot:${360 + Math.random() * 720}deg;` +
        `animation-duration:${4.5 + Math.random() * 4}s;` +
        `animation-delay:${Math.random() * 1.6}s;`;
      overlay.appendChild(p);
    }
  }

  function envelope() {
    const overlay = $("#envelopeOverlay");
    const seal = $("#waxSeal");
    const skip = $("#envSkip");
    if (!overlay) return finish(true);

    const already = C.options?.enveloppeUneSeuleFois && store.get("faire-part-ouvert") === "1";
    if (C.options?.enveloppe === false || already || reduceMotion) return finish(true);

    let opened = false;

    function open(instant) {
      if (opened) return;
      opened = true;
      store.set("faire-part-ouvert", "1");

      if (instant) return finish(true);

      overlay.classList.add("is-opening");
      petals(overlay);
      setTimeout(() => {
        overlay.classList.add("is-gone");
        finish(false);
      }, 2350);
      setTimeout(() => { overlay.style.display = "none"; }, 3500);
    }

    seal?.addEventListener("click", () => open(false));
    $("#envelope")?.addEventListener("click", (e) => {
      if (e.target.closest(".wax-seal")) return;
      open(false);
    });
    skip?.addEventListener("click", () => open(true));
    document.addEventListener("keydown", function onKey(e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        if (document.activeElement === skip) return;
        open(e.key === "Escape");
        document.removeEventListener("keydown", onKey);
      }
    });

    function finishNow() { open(true); }
    window.__openInvitation = finishNow;
  }

  function finish(instant) {
    document.body.classList.remove("is-locked");
    document.body.classList.add("is-open");
    if (instant) {
      const ov = $("#envelopeOverlay");
      if (ov) { ov.classList.add("is-gone"); setTimeout(() => (ov.style.display = "none"), 600); }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  /* ===================================================================== */
  /* 5. FORMULAIRE RSVP                                                    */
  /* ===================================================================== */
  function rsvp() {
    const form = $("#rsvpForm");
    if (!form) return;
    const cond = $("#rsvpYes");
    const status = $("#rsvpStatus");
    const submit = $("#rsvpSubmit");
    const thanks = $("#rsvpThanks");

    // ouverture / fermeture du bloc conditionnel
    $$('input[name="presence"]').forEach((r) => {
      r.addEventListener("change", () => {
        const yes = r.value.startsWith("Oui") && r.checked;
        cond.hidden = false;
        cond.classList.toggle("is-open", yes);
        if (!yes) {
          setTimeout(() => { if (!cond.classList.contains("is-open")) cond.hidden = true; }, 700);
        }
      });
    });

    function say(msg, kind) {
      status.textContent = msg;
      status.className = "rsvp__status" + (kind ? " is-" + kind : "");
    }

    function validate() {
      let ok = true;
      [["#f-nom", "text"], ["#f-email", "email"]].forEach(([sel, type]) => {
        const el = $(sel);
        const v = el.value.trim();
        const bad = !v || (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v));
        el.classList.toggle("is-error", bad);
        if (bad) ok = false;
      });
      const pres = form.querySelector('input[name="presence"]:checked');
      if (!pres) ok = false;
      if (!ok) say("Merci de remplir votre nom, votre e-mail et d'indiquer si vous serez présent·e.", "err");
      return ok;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      say("");
      if (!validate()) return;

      const id = (C.rsvp?.formspreeId || "").trim();
      const data = Object.fromEntries(new FormData(form).entries());
      data._subject = `RSVP mariage — ${data.nom}`;

      if (!id) {
        console.warn(
          "[RSVP] Aucun identifiant Formspree n'est configuré.\n" +
          "Ouvre assets/js/config.js et renseigne rsvp.formspreeId.\n" +
          "Réponse qui aurait été envoyée :", data
        );
        say("Le formulaire n'est pas encore relié (identifiant Formspree manquant dans config.js).", "err");
        return;
      }

      submit.classList.add("is-loading");
      submit.disabled = true;
      say("Envoi en cours…");

      try {
        const res = await fetch("https://formspree.io/f/" + id, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("HTTP " + res.status);

        const venue = String(data.presence || "").startsWith("Oui");
        $("#thanksText").textContent = venue
          ? "Votre réponse est bien enregistrée. Nous avons hâte de vous voir le jour J !"
          : "Merci de nous avoir prévenus. Vous nous manquerez — on pensera à vous.";
        form.hidden = true;
        thanks.hidden = false;
        thanks.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      } catch (err) {
        console.error(err);
        say("L'envoi a échoué. Réessayez, ou écrivez-nous directement par e-mail.", "err");
      } finally {
        submit.classList.remove("is-loading");
        submit.disabled = false;
      }
    });

    $("#rsvpAgain")?.addEventListener("click", () => {
      form.reset();
      cond.hidden = true;
      cond.classList.remove("is-open");
      say("");
      thanks.hidden = true;
      form.hidden = false;
      form.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    });
  }

  /* ===================================================================== */
  /* INITIALISATION                                                        */
  /* ===================================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    hydrate();
    buildPhotos();
    buildTimeline();
    buildMap();
    countdown();
    nav();
    scrollFx();
    rsvp();
    envelope();
  });
})();
