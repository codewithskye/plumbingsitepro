
AOS.init({
  duration: 1000,
  easing: "ease-out-cubic",
  once: true,
  offset: 100
});


const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
    hamburger.classList.toggle("open");
  });

  document.querySelectorAll(".mobile-menu a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      hamburger.classList.remove("open");
    });
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      mobileMenu.classList.remove("active");
      hamburger.classList.remove("open");
    }
  });
}

window.addEventListener("scroll", () => {
  document.getElementById("navbar")?.classList.toggle("scrolled", window.scrollY > 50);
});


document.querySelectorAll(".faq-question").forEach(q => {
  q.addEventListener("click", () => {
    q.parentElement.classList.toggle("active");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const current = location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.classList.remove("active");

    if (link.getAttribute("href") === current ||
        (current.includes("service") && link.getAttribute("href").includes("service"))) {
      link.classList.add("active");
    }
  });
});

const form = document.getElementById("contactForm");
const toast = document.getElementById("toast");

function showToast() {
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 6000);
}

function closeToast() {
  toast.classList.remove("show");
}

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const btn = form.querySelector(".submit-btn");
    const originalText = btn.innerHTML;

    btn.innerHTML = "Sending...";
    btn.disabled = true;

    fetch("https://formspree.io/f/xpwgwkok", {
      method: "POST",
      body: new FormData(form),
      headers: { "Accept": "application/json" }
    })
    .then(response => {
      if (response.ok) {
        form.reset();
        showToast();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        throw new Error("Failed");
      }
    })
    .catch(() => {
      alert("Connection error. Please try again or email me directly.");
    })
    .finally(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
    });
  });
}

// before-after.js – FIXED + KEYBOARD ACCESSIBLE
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".before-after-container").forEach(container => {
    const beforeImg = container.querySelector(".ba-before");
    const divider  = container.querySelector(".ba-divider");
    const handle   = container.querySelector(".ba-handle");
    if (!beforeImg || !divider || !handle) return; // safety guard

    // Make container focusable & accessible
    container.setAttribute("tabindex", "0");
    container.setAttribute("role", "slider");
    container.setAttribute("aria-valuemin", "3");
    container.setAttribute("aria-valuemax", "97");

    let dragging = false;
    let percent = 50; // current position percentage (3 - 97)

    // Apply current percent to UI
    const setPosition = (p, updateAria = true) => {
      percent = Math.max(3, Math.min(97, p));
      divider.style.left = percent + "%";
      handle.style.left  = percent + "%";
      beforeImg.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
      if (updateAria) container.setAttribute("aria-valuenow", Math.round(percent));
    };

    // Initialize
    setPosition(50, true);

    // Move logic (accepts clientX)
    const moveDividerToClientX = (clientX, allowWhileNotDragging = false) => {
      if (!dragging && !allowWhileNotDragging) return;

      const rect = container.getBoundingClientRect();
      let x = clientX - rect.left;
      let newPercent = (x / rect.width) * 100;
      newPercent = Math.max(3, Math.min(97, newPercent));
      setPosition(newPercent);
    };

    // Mouse events
    container.addEventListener("mousedown", (e) => {
      dragging = true;
      moveDividerToClientX(e.clientX, true);
    });

    window.addEventListener("mousemove", (e) => {
      moveDividerToClientX(e.clientX);
    });

    window.addEventListener("mouseup", () => {
      dragging = false;
    });

    // Touch events (mobile)
    container.addEventListener("touchstart", (e) => {
      dragging = true;
      moveDividerToClientX(e.touches[0].clientX, true);
      e.preventDefault();
    }, { passive: false });

    container.addEventListener("touchmove", (e) => {
      moveDividerToClientX(e.touches[0].clientX);
      e.preventDefault();
    }, { passive: false });

    window.addEventListener("touchend", () => {
      dragging = false;
    });

    // Keyboard accessibility
    container.addEventListener("keydown", (e) => {
      // left: 37, right: 39, home:36, end:35, enter:13, pageup/pagedown also optional
      const step = e.shiftKey ? 10 : 2; // shift+arrow = larger jump
      if (e.key === "ArrowLeft" || e.key === "Left") {
        e.preventDefault();
        setPosition(percent - step);
      } else if (e.key === "ArrowRight" || e.key === "Right") {
        e.preventDefault();
        setPosition(percent + step);
      } else if (e.key === "Home") {
        e.preventDefault();
        setPosition(3);
      } else if (e.key === "End") {
        e.preventDefault();
        setPosition(97);
      } else if (e.key === "Enter" || e.key === " ") {
        // Reset to center on Enter or Space
        e.preventDefault();
        setPosition(50);
      }
    });

    // Prevent image dragging
    container.querySelectorAll("img").forEach(img => {
      img.addEventListener("dragstart", e => e.preventDefault());
    });

    // Keep slider correct on resize (debounced)
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // reapply the same percent (clip-path uses percent so it remains valid)
        setPosition(percent, false);
      }, 120);
    });

    // Update aria value initially
    container.setAttribute("aria-valuenow", Math.round(percent));
  });
});

