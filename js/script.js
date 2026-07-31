document.addEventListener("DOMContentLoaded", () => {
  /* ===== HAMBURGER MENU ===== */
  const header = document.querySelector(".site-header");
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = navMenu ? navMenu.querySelectorAll("a") : [];
  const desktopMq = window.matchMedia("(min-width: 900px)");

  const setMenuState = (isOpen) => {
    if (!header || !hamburger) return;
    header.classList.toggle("menu-open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    hamburger.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  };

  const closeMenu = () => setMenuState(false);
  const toggleMenu = () => {
    const isOpen = hamburger?.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  };

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", toggleMenu);

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (!header.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        hamburger.focus();
      }
    });

    const handleDesktopChange = (event) => {
      if (event.matches) closeMenu();
    };

    if (typeof desktopMq.addEventListener === "function") {
      desktopMq.addEventListener("change", handleDesktopChange);
    } else {
      desktopMq.addListener(handleDesktopChange);
    }
  }

  /* ===== REVEAL ON SCROLL — RETRIGGERS EVERY TIME ===== */
  const revealItems = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 60, 240)}ms`;
      observer.observe(item);
    });
  }
});