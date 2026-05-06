/* =====================================================================
   Deniz Can Dursun · Portfolio V7
   Site interactions: mobile nav, scroll spy, project filters,
   email copy, reveal-on-scroll
   ===================================================================== */

(function () {
  "use strict";

  /* ---------- mobile drawer ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const drawer = document.getElementById("mobileDrawer");

  function setMenu(open) {
    if (!menuToggle || !drawer) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    drawer.setAttribute("data-open", String(open));
    document.body.classList.toggle("menu-open", open);
  }
  if (menuToggle && drawer) {
    menuToggle.addEventListener("click", function () {
      const open = menuToggle.getAttribute("aria-expanded") !== "true";
      setMenu(open);
    });
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
  }

  /* ---------- scroll spy (active nav link) ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link[data-section]");
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const linkBySection = new Map();
    navLinks.forEach(function (link) {
      const key = link.getAttribute("data-section");
      if (!linkBySection.has(key)) linkBySection.set(key, []);
      linkBySection.get(key).push(link);
    });
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(function (l) { l.classList.remove("is-active"); });
          const list = linkBySection.get(id) || [];
          list.forEach(function (l) { l.classList.add("is-active"); });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------- project filters ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn[data-filter]");
  const projectCards = document.querySelectorAll(".project-card[data-category]");
  if (filterBtns.length && projectCards.length) {
    function applyFilter(filter, updateUrl) {
      let matched = false;
      filterBtns.forEach(function (b) {
        const isActive = b.getAttribute("data-filter") === filter;
        b.setAttribute("aria-pressed", isActive ? "true" : "false");
        if (isActive) matched = true;
      });
      if (!matched) {
        // unknown filter, default to "all"
        filter = "all";
        filterBtns.forEach(function (b) {
          b.setAttribute("aria-pressed", b.getAttribute("data-filter") === "all" ? "true" : "false");
        });
      }
      projectCards.forEach(function (card) {
        const cat = card.getAttribute("data-category");
        const show = filter === "all" || cat === filter;
        card.hidden = !show;
      });
      if (updateUrl && history && history.replaceState) {
        try {
          const url = new URL(window.location.href);
          if (filter === "all") {
            url.searchParams.delete("filter");
          } else {
            url.searchParams.set("filter", filter);
          }
          history.replaceState(null, "", url.toString());
        } catch (e) { /* ignore */ }
      }
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyFilter(btn.getAttribute("data-filter"), true);
      });
    });

    // restore from URL on load
    try {
      const params = new URLSearchParams(window.location.search);
      const initial = params.get("filter");
      if (initial) applyFilter(initial, false);
    } catch (e) { /* ignore */ }
  }

  /* ---------- email copy ---------- */
  const copyBtn = document.getElementById("copyEmail");
  const toast = document.getElementById("toast");
  let toastTimer = null;
  if (copyBtn && toast) {
    copyBtn.addEventListener("click", function () {
      const email = copyBtn.getAttribute("data-email") || "";
      const fallback = function () {
        try {
          const ta = document.createElement("textarea");
          ta.value = email;
          ta.setAttribute("readonly", "");
          ta.style.position = "absolute";
          ta.style.left = "-9999px";
          document.body.appendChild(ta);
          ta.select();
          const ok = document.execCommand("copy");
          document.body.removeChild(ta);
          if (ok) { showToast(); } else { showToast(true); }
        } catch (e) { showToast(true); }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () { showToast(); }, fallback);
      } else {
        fallback();
      }
    });
  }
  function showToast(isError) {
    if (!toast) return;
    if (isError) {
      toast.textContent = toast.getAttribute("data-error-text") || "Kopyalama başarısız. Lütfen elle kopyalayın.";
      toast.classList.add("is-error");
    } else {
      toast.textContent = toast.getAttribute("data-success-text") || toast.textContent;
      toast.classList.remove("is-error");
    }
    toast.classList.add("is-visible");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2400);
  }

  /* ---------- contact form (mailto: handoff) ---------- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    const statusEl = document.getElementById("cf-status");
    const isEnglish = document.documentElement.lang === "en";
    const t = isEnglish
      ? { fillAll: "Please fill in all fields.", invalidEmail: "Please enter a valid email.", opening: "Opening your email app…" }
      : { fillAll: "Lütfen tüm alanları doldurun.", invalidEmail: "Geçerli bir e-posta adresi girin.", opening: "E-posta uygulamanız açılıyor…" };

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const target = contactForm.getAttribute("data-target-email") || "";
      const name = (contactForm.querySelector("#cf-name") || {}).value || "";
      const email = (contactForm.querySelector("#cf-email") || {}).value || "";
      const subject = (contactForm.querySelector("#cf-subject") || {}).value || "";
      const message = (contactForm.querySelector("#cf-message") || {}).value || "";

      if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
        setStatus(t.fillAll, true);
        return;
      }
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email.trim())) {
        setStatus(t.invalidEmail, true);
        return;
      }
      const body =
        (isEnglish ? "From: " : "Gönderen: ") + name + " <" + email + ">\n\n" +
        message + "\n\n— " + (isEnglish ? "Sent via portfolio contact form" : "Portfolyo iletişim formu üzerinden gönderildi");
      const href = "mailto:" + encodeURIComponent(target) +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      setStatus(t.opening, false);
      window.location.href = href;
    });

    function setStatus(msg, isError) {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.classList.toggle("is-error", !!isError);
    }
  }

  /* ---------- reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    if ("IntersectionObserver" in window) {
      const ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            ro.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
      reveals.forEach(function (el) { ro.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add("is-visible"); });
    }
  }

  /* ---------- close drawer on resize to desktop ---------- */
  let resizeTimer = null;
  window.addEventListener("resize", function () {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth > 980) setMenu(false);
    }, 120);
  });

  /* ---------- live readout pulse (HMI breathing) ---------- */
  /* Subtle visual life: occasionally re-emphasize the operational dot. */
  /* Implemented purely via CSS animation already; no JS needed. */
})();
