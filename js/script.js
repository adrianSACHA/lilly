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

  /* ===== HIDE HEADER ON SCROLL (MOBILE) ===== */
  let lastScroll = 0;
  const scrollThreshold = 10;

  window.addEventListener("scroll", () => {
    if (!header) return;
    if (window.innerWidth > 899) return;
    if (header.classList.contains("menu-open")) return;

    const currentScroll = window.scrollY;

    if (Math.abs(currentScroll - lastScroll) < scrollThreshold) return;

    if (currentScroll > lastScroll && currentScroll > 80) {
      header.classList.add("header-hidden");
    } else {
      header.classList.remove("header-hidden");
    }

    lastScroll = currentScroll;
  }, { passive: true });

  /* ===== REVEAL ON SCROLL — ONCE PER SECTION ===== */
  const revealItems = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const navLinkMap = new Map();
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      navLinkMap.set(href.slice(1), link);
    }
  });

  const setActiveLink = (id) => {
    navLinkMap.forEach((link, key) => {
      link.classList.toggle("active", key === id);
    });
  };

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 60, 240)}ms`;
      revealObserver.observe(item);
    });
  }

  /* ===== ACTIVE NAV LINK ON SCROLL ===== */
  const sections = document.querySelectorAll("main section[id]");

  if (sections.length && navLinkMap.size && "IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveLink(visible[0].target.id);
        }
      },
      {
        rootMargin: "-100px 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((section) => navObserver.observe(section));
  }
});