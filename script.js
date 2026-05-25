const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const contactWhatsappButton = document.querySelector(".contact-whatsapp");
const revealNodes = document.querySelectorAll("[data-reveal]");
const heroSection = document.querySelector("#inicio");
const bootLoader = document.querySelector("#boot-loader");

const WHATSAPP_NUMBER = "56900000000";
const NAV_PREOPEN_PX = 160;
const NAV_IDLE_CLOSE_MS = 3000;

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

let navIdleCloseTimeout = null;
let navActivityListening = false;

const scheduleNavAutoClose = () => {
  if (!siteNav || !siteNav.classList.contains("is-open")) {
    return;
  }

  if (navIdleCloseTimeout) {
    window.clearTimeout(navIdleCloseTimeout);
  }

  navIdleCloseTimeout = window.setTimeout(() => {
    closeMobileNav();
  }, NAV_IDLE_CLOSE_MS);
};

const onNavActivity = () => {
  scheduleNavAutoClose();
};

const addNavActivityListeners = () => {
  if (navActivityListening) {
    return;
  }

  const options = { passive: true };
  document.addEventListener("pointerdown", onNavActivity, options);
  document.addEventListener("pointermove", onNavActivity, options);
  document.addEventListener("touchstart", onNavActivity, options);
  document.addEventListener("wheel", onNavActivity, options);
  document.addEventListener("keydown", onNavActivity);

  navActivityListening = true;
};

const removeNavActivityListeners = () => {
  if (!navActivityListening) {
    return;
  }

  const options = { passive: true };
  document.removeEventListener("pointerdown", onNavActivity, options);
  document.removeEventListener("pointermove", onNavActivity, options);
  document.removeEventListener("touchstart", onNavActivity, options);
  document.removeEventListener("wheel", onNavActivity, options);
  document.removeEventListener("keydown", onNavActivity);

  navActivityListening = false;
};

const closeMobileNav = () => {
  if (!siteNav || !navToggle) {
    return;
  }

  siteNav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");

  if (navIdleCloseTimeout) {
    window.clearTimeout(navIdleCloseTimeout);
    navIdleCloseTimeout = null;
  }

  removeNavActivityListeners();
};

const openMobileNav = () => {
  if (!siteNav || !navToggle) {
    return;
  }

  siteNav.classList.add("is-open");
  navToggle.setAttribute("aria-expanded", "true");
  addNavActivityListeners();
  scheduleNavAutoClose();
};

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    if (siteNav.classList.contains("is-open")) {
      closeMobileNav();
      return;
    }

    openMobileNav();
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

const downloadModal = document.querySelector("#download-modal");
const downloadModalWindow = downloadModal?.querySelector(".download-modal-window");
const downloadTrigger = document.querySelector("[data-download-trigger]");
const downloadCloseNodes = document.querySelectorAll("[data-download-close]");

let downloadModalPreviouslyFocused = null;

const getDownloadModalFocusable = () => {
  if (!(downloadModalWindow instanceof HTMLElement)) {
    return [];
  }

  const nodes = Array.from(
    downloadModalWindow.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  );

  return nodes.filter(
    (node) =>
      node instanceof HTMLElement &&
      !node.hasAttribute("disabled") &&
      node.getAttribute("aria-hidden") !== "true"
  );
};

const closeDownloadModal = () => {
  if (!(downloadModal instanceof HTMLElement)) {
    return;
  }

  downloadModal.classList.remove("is-open");
  downloadModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-modal-open");
  document.removeEventListener("keydown", onDownloadModalKeydown);

  if (downloadModalPreviouslyFocused instanceof HTMLElement) {
    downloadModalPreviouslyFocused.focus();
  }

  downloadModalPreviouslyFocused = null;
};

const openDownloadModal = () => {
  if (!(downloadModal instanceof HTMLElement)) {
    return;
  }

  if (downloadModal.classList.contains("is-open")) {
    return;
  }

  downloadModalPreviouslyFocused =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;

  downloadModal.classList.add("is-open");
  downloadModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-modal-open");
  document.addEventListener("keydown", onDownloadModalKeydown);

  const focusable = getDownloadModalFocusable();
  const closeButton = downloadModal.querySelector(".download-modal-close");

  if (closeButton instanceof HTMLElement) {
    closeButton.focus();
  } else if (focusable[0] instanceof HTMLElement) {
    focusable[0].focus();
  }
};

const onDownloadModalKeydown = (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeDownloadModal();
    return;
  }

  if (event.key !== "Tab") {
    return;
  }

  const focusable = getDownloadModalFocusable();
  if (!focusable.length) {
    event.preventDefault();
    return;
  }

  const activeElement = document.activeElement;
  const currentIndex = focusable.findIndex((node) => node === activeElement);

  if (event.shiftKey) {
    if (currentIndex <= 0) {
      event.preventDefault();
      focusable[focusable.length - 1].focus();
    }
    return;
  }

  if (currentIndex === -1 || currentIndex >= focusable.length - 1) {
    event.preventDefault();
    focusable[0].focus();
  }
};

if (downloadTrigger instanceof HTMLElement) {
  downloadTrigger.addEventListener("click", openDownloadModal);
  downloadTrigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDownloadModal();
    }
  });
}

if (downloadModal instanceof HTMLElement) {
  downloadCloseNodes.forEach((node) => {
    if (node instanceof HTMLElement) {
      node.addEventListener("click", closeDownloadModal);
    }
  });
}
