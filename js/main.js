(function () {
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const modal = document.querySelector("[data-modal]");
  const modalTitle = document.querySelector("#modal-portfolio-title");
  const modalLede = document.querySelector("[data-modal-lede]");
  const modalGallery = document.querySelector("[data-modal-gallery]");
  const yearEl = document.querySelector("[data-year]");

  const PORTFOLIO = {
    casamentos: {
      title: "Casamentos",
      lede: "Filmes intimistas, silêncios cuidados e memória em movimento — estrutura pronta para seus melhores takes.",
      tiles: [
        { label: "Votos", src: "assets/founders.png" },
        { label: "Detalhes", src: "assets/founders.png" },
        { label: "Dança", src: "assets/founders.png" },
        { label: "Mesa", src: "assets/surface-gray.png" },
      ],
    },
    eventos: {
      title: "Eventos",
      lede: "Cobertura elegante para encontros que pedem ritmo e sensibilidade — galeria expansível para cases e reels.",
      tiles: [
        { label: "Abertura", src: "assets/surface-gray.png" },
        { label: "Palco", src: "assets/surface-gray.png" },
        { label: "Público", src: "assets/founders.png" },
      ],
    },
    corporativo: {
      title: "Corporativo",
      lede: "Filmes e peças para marcas que valorizam estética silenciosa e narrativa estratégica.",
      tiles: [
        { label: "Manifesto", src: "assets/surface-gray.png" },
        { label: "Produto", src: "assets/founders.png" },
        { label: "Time", src: "assets/founders.png" },
        { label: "Campanha", src: "assets/surface-gray.png" },
      ],
    },
    ensaios: {
      title: "Ensaios",
      lede: "Retratos e narrativas estáticas com a mesma direção de arte do nosso cinema.",
      tiles: [
        { label: "Luz natural", src: "assets/founders.png" },
        { label: "Estúdio", src: "assets/surface-gray.png" },
      ],
    },
    bastidores: {
      title: "Bastidores · Storymaker",
      lede: "Stories sofisticados, espontâneos e pensados para acompanhar o evento com exclusividade.",
      tiles: [
        { label: "Making of", src: "assets/logo.png" },
        { label: "Bastidores", src: "assets/founders.png" },
        { label: "Reels", src: "assets/founders.png" },
      ],
    },
  };

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Header */
  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };
  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  /* Mobile nav */
  const closeNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  navToggle?.addEventListener("click", () => {
    if (!nav || !navToggle) return;
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeNav());
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 900px)").matches) closeNav();
  });

  /* Scroll reveal */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("reveal-visible"));
  }

  /* Portfolio modal */
  let lastFocus = null;

  const openModal = (key) => {
    const data = PORTFOLIO[key];
    if (!data || !modal || !modalTitle || !modalLede || !modalGallery) return;
    lastFocus = document.activeElement;
    modalTitle.textContent = data.title;
    modalLede.textContent = data.lede;
    modalGallery.innerHTML = "";
    data.tiles.forEach((tile) => {
      const div = document.createElement("div");
      div.className = "modal__tile";
      const img = document.createElement("img");
      img.src = tile.src;
      img.alt = "";
      img.loading = "lazy";
      const cap = document.createElement("span");
      cap.textContent = tile.label;
      div.append(img, cap);
      modalGallery.appendChild(div);
    });
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    const dialog = modal.querySelector(".modal__dialog");
    dialog?.focus({ preventScroll: true });
  };

  const closeModal = () => {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus({ preventScroll: true });
  };

  document.querySelectorAll("[data-open-portfolio]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-open-portfolio");
      if (key) openModal(key);
    });
  });

  modal?.addEventListener("click", (e) => {
    const t = e.target;
    if (t instanceof HTMLElement && t.hasAttribute("data-close-modal")) closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden) closeModal();
  });
})();
