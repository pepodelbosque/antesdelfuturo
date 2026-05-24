const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const contactWhatsappButton = document.querySelector(".contact-whatsapp");
const revealNodes = document.querySelectorAll("[data-reveal]");
const heroSection = document.querySelector("#inicio");
const sectionTwo = document.querySelector("main > section.section:not(#inicio)");
const bootLoader = document.querySelector("#boot-loader");

const WHATSAPP_NUMBER = "56900000000";
const NAV_PREOPEN_PX = 160;

const forceHeroStart = () => {
  const target = heroSection instanceof HTMLElement ? heroSection : document.body;
  const previousScrollBehavior = document.documentElement.style.scrollBehavior;

  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo(0, target.offsetTop);
  document.documentElement.style.scrollBehavior = previousScrollBehavior;
};

let heroIntroRan = false;
const runHeroIntro = () => {
  if (heroIntroRan) {
    return;
  }

  if (!(heroSection instanceof HTMLElement)) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    return;
  }

  heroIntroRan = true;

  const heroText = heroSection.querySelector(".hero-text");
  const heroTextNode = heroText instanceof HTMLElement ? heroText : null;
  const fullText = heroTextNode?.textContent?.replace(/\s+/g, " ").trim() ?? "";

  heroSection.classList.add("is-hero-intro");
  window.requestAnimationFrame(() => heroSection.classList.add("is-hero-run"));

  if (!heroTextNode || !fullText) {
    heroSection.classList.add("is-hero-rest");
    return;
  }

  heroTextNode.textContent = "";

  const startTypingAtMs = 980;
  const charDelayMs = 10;

  window.setTimeout(() => {
    let index = 0;

    const step = () => {
      index += 1;
      heroTextNode.textContent = fullText.slice(0, index);

      if (index >= fullText.length) {
        window.setTimeout(() => heroSection.classList.add("is-hero-rest"), 120);
        return;
      }

      window.setTimeout(step, charDelayMs);
    };

    step();
  }, startTypingAtMs);
};

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("pageshow", forceHeroStart);

const closeMobileNav = () => {
  if (!siteNav || !navToggle) {
    return;
  }

  siteNav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
};

const openMobileNav = () => {
  if (!siteNav || !navToggle) {
    return;
  }

  siteNav.classList.add("is-open");
  navToggle.setAttribute("aria-expanded", "true");
};

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });
}

if (bootLoader instanceof HTMLDivElement) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    forceHeroStart();
    document.body.classList.remove("is-loading");
    bootLoader.remove();
  } else {
    window.setTimeout(() => {
      bootLoader.classList.add("is-double");
    }, 2000);

    window.setTimeout(() => {
      bootLoader.classList.add("is-fast");
    }, 2800);

    window.setTimeout(() => {
      forceHeroStart();
      document.body.classList.remove("is-loading");
      runHeroIntro();
      bootLoader.classList.add("is-hidden");
    }, 3000);

    window.setTimeout(() => {
      bootLoader.remove();
    }, 3200);
  }
} else {
  document.body.classList.remove("is-loading");
  runHeroIntro();
}

const updateHeaderState = () => {
  if (!siteHeader) {
    return;
  }

  siteHeader.classList.toggle("is-scrolled", window.scrollY > 18);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

const setHeaderHidden = (hidden) => {
  if (!siteHeader) {
    return;
  }

  siteHeader.classList.toggle("is-hidden", hidden);

  if (hidden) {
    closeMobileNav();
  }
};

const updateHeaderVisibility = () => {
  if (!heroSection) {
    setHeaderHidden(false);
    return;
  }

  const heroEnd = heroSection.offsetTop + heroSection.offsetHeight;
  const shouldHide = window.scrollY < heroEnd - NAV_PREOPEN_PX;
  setHeaderHidden(shouldHide);
};

let headerTicking = false;
const onHeaderScroll = () => {
  if (headerTicking) {
    return;
  }

  headerTicking = true;
  window.requestAnimationFrame(() => {
    updateHeaderVisibility();
    headerTicking = false;
  });
};

updateHeaderVisibility();
window.addEventListener("scroll", onHeaderScroll, { passive: true });
window.addEventListener("resize", updateHeaderVisibility);

let autoOpenedNav = false;
const maybeAutoOpenNav = () => {
  if (!siteNav || !navToggle) {
    return;
  }

  if (autoOpenedNav) {
    return;
  }

  if (!window.matchMedia("(max-width: 860px)").matches) {
    return;
  }

  if (siteHeader?.classList.contains("is-hidden")) {
    return;
  }

  openMobileNav();
  autoOpenedNav = true;
};

window.addEventListener("scroll", maybeAutoOpenNav, { passive: true });
window.addEventListener("resize", maybeAutoOpenNav);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

if (contactWhatsappButton instanceof HTMLButtonElement) {
  contactWhatsappButton.addEventListener("click", () => {
    const whatsappMessage = "Hola Antes del Futuro, quiero solicitar una demo.";
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

    const previousLabel = contactWhatsappButton.textContent;
    contactWhatsappButton.textContent = "Abriendo WhatsApp...";
    contactWhatsappButton.disabled = true;

    window.setTimeout(() => {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      contactWhatsappButton.textContent = previousLabel;
      contactWhatsappButton.disabled = false;
    }, 450);
  });
}
