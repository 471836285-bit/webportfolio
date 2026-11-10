document.addEventListener("DOMContentLoaded", () => {
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".global-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }

  const targets = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(target => observer.observe(target));
  } else {
    targets.forEach(target => target.classList.add("is-visible"));
  }

  // Independent mobile screenshot sliders on project pages
  document.querySelectorAll("[data-slider]").forEach(slider => {
    const track = slider.querySelector("[data-track]");
    const slides = Array.from(slider.querySelectorAll("[data-slide]"));
    const dotsWrap = slider.querySelector("[data-dots]");
    const count = slider.querySelector("[data-count]");
    const prev = slider.querySelector("[data-prev]");
    const next = slider.querySelector("[data-next]");
    if (!track || slides.length < 1) return;
    let index = 0;
    const dots = slides.map((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button"; dot.className = "sp-dot";
      dot.setAttribute("aria-label", `画像 ${i + 1} を表示`);
      dot.addEventListener("click", () => show(i));
      dotsWrap.appendChild(dot); return dot;
    });
    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => dot.setAttribute("aria-current", String(i === index)));
      if (count) count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    }
    prev?.addEventListener("click", () => show(index - 1));
    next?.addEventListener("click", () => show(index + 1));
    let startX = 0;
    track.addEventListener("touchstart", e => { startX = e.changedTouches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", e => {
      const delta = e.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 45) show(index + (delta < 0 ? 1 : -1));
    }, { passive: true });
    show(0);
  });

});


// Practice Slider
document.querySelectorAll('[data-slider2]').forEach(slider => {
  const slides = slider.querySelectorAll('.practice-slide');
  const prev = slider.querySelector('.practice-prev');
  const next = slider.querySelector('.practice-next');
  const current = slider.querySelector('.current');

  let index = 0;

  function showSlide(newIndex) {
    index = (newIndex + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    current.textContent = String(index + 1).padStart(2, '0');
  }

  prev.addEventListener('click', () => {
    showSlide(index - 1);
  });

  next.addEventListener('click', () => {
    showSlide(index + 1);
  });

  // Touch swipe
  let startX = 0;

  slider.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  slider.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - startX;

    if (Math.abs(diff) > 50) {
      showSlide(index + (diff < 0 ? 1 : -1));
    }
  }, { passive: true });
});

// Practice Lightbox
document.querySelectorAll('[data-lightbox]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    const overlay = document.createElement('div');
    overlay.className = 'practice-lightbox';

    const img = document.createElement('img');
    img.src = link.href;
    img.alt = link.querySelector('img').alt;

    const close = document.createElement('button');
    close.className = 'lightbox-close';
    close.textContent = '×';
    close.setAttribute('aria-label', '閉じる');

    overlay.append(close, img);
    document.body.appendChild(overlay);

    close.addEventListener('click', () => overlay.remove());

    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.remove();
    });

    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', escHandler);
      }
    });
  });
});