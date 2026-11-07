document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Navigation Drawer Toggle
  const menuBtn = document.getElementById("mobile-menu-toggle");
  const siteNav = document.getElementById("site-nav");

  if (menuBtn && siteNav) {
    menuBtn.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.textContent = isOpen ? "✕" : "☰";
    });
  }

  // 2. Gallery Category Filter (gallery.html)
  const filterButtons = document.querySelectorAll("[data-filter]");
  const galleryItems = document.querySelectorAll("[data-category]");

  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const targetCategory = btn.getAttribute("data-filter");
        galleryItems.forEach((item) => {
          const itemCat = item.getAttribute("data-category");
          if (targetCategory === "all" || itemCat === targetCategory) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  }

  // 3. Gallery Tap-to-Zoom Lightbox Modal (gallery.html)
  const lightbox = document.getElementById("gallery-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxDesc = document.getElementById("lightbox-desc");
  const lightboxClose = document.getElementById("lightbox-close");

  if (lightbox && galleryItems.length > 0) {
    galleryItems.forEach((card) => {
      card.addEventListener("click", () => {
        const imgEl = card.querySelector("img");
        const titleEl = card.querySelector("h3");
        const descEl = card.querySelector("p");

        if (imgEl && titleEl && descEl) {
          lightboxImg.src = imgEl.src;
          lightboxImg.alt = imgEl.alt;
          lightboxTitle.textContent = titleEl.textContent;
          lightboxDesc.textContent = descEl.textContent;
          lightbox.classList.add("is-open");
        }
      });
    });

    const closeModal = () => lightbox.classList.remove("is-open");
    if (lightboxClose) lightboxClose.addEventListener("click", closeModal);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeModal();
    });
  }

  // 4. Custom Domain Email Inquiry Formatter (contact.html)
  const inquiryForm = document.getElementById("client-inquiry-form");
  if (inquiryForm) {
    inquiryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("client-name").value.trim();
      const phone = document.getElementById("client-phone").value.trim();
      const service = document.getElementById("client-service").value;
      const datePref = document.getElementById("client-date").value.trim();
      const notes = document.getElementById("client-notes").value.trim();

      const subject = encodeURIComponent(`Appointment / Group Inquiry — ${name}`);
      const body = encodeURIComponent(
        `Client Name: ${name}\n` +
        `Callback Phone: ${phone}\n` +
        `Requested Service: ${service}\n` +
        `Preferred Day/Time: ${datePref}\n\n` +
        `Additional Details:\n${notes}`
      );

      window.location.href = `mailto:info@arundelluxenails.com?subject=${subject}&body=${body}`;
    });
  }
});
