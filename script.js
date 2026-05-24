const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const contactWhatsappButton = document.querySelector(".contact-whatsapp");
const revealNodes = document.querySelectorAll("[data-reveal]");
const heroSection = document.querySelector("#inicio");
const sectionTwo = document.querySelector("main > section.section:not(#inicio)");

const WHATSAPP_NUMBER = "56900000000";
const NAV_PREOPEN_PX = 160;

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
