document.addEventListener("DOMContentLoaded", () => {
  // العناصر الأساسية
  const loadingScreen = document.getElementById("loading-screen");
  const loginModal = document.getElementById("loginModal");
  const mainContent = document.getElementById("main-content");

  // =========================================================
  // 1. وظائف الـ Modal العامة (لتسجيل الدخول فقط)
  // =========================================================

  function openModal(modal) {
    if (modal) {
      modal.style.display = "flex";
      setTimeout(() => {
        modal.classList.add("active");
        // تطبيق التمويه على المحتوى الرئيسي
        if (mainContent) mainContent.style.filter = "blur(3px)";
      }, 10);
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove("active");
      // إزالة التمويه
      if (mainContent) mainContent.style.filter = "none";

      setTimeout(() => {
        modal.style.display = "none";
      }, 400);
    }
  }

  // ربط أزرار فتح الـ Login Modal
  const openLoginModal = document.getElementById("openLoginModal");
  if (openLoginModal) {
    openLoginModal.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(loginModal);
    });
  }

  // ربط أزرار إغلاق الـ Modal
  document.querySelectorAll(".modal .close-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.dataset.modal;
      const modal = document.getElementById(modalId);
      closeModal(modal);
    });
  });

  // إغلاق عند الضغط خارج المودال
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      const targetModal = e.target.id;
      const modalElement = document.getElementById(targetModal);
      if (modalElement) closeModal(modalElement);
    }
  });

  // =========================================================
  // 2. تفعيل سلايدر الصور القابل للتنقل + تأخير الـ Animation
  // =========================================================
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card, index) => {
    // تطبيق تأخير متزايد على الكاردات
    card.style.animationDelay = `${0.7 + index * 0.1}s`;

    const slider = card.querySelector(".product-image-slider");
    const images = Array.from(slider.querySelectorAll(".product-img"));
    const prevBtn = card.querySelector(".prev-btn");
    const nextBtn = card.querySelector(".next-btn");
    let currentIndex = 0;
    let intervalId;

    if (images.length <= 1) {
      if (prevBtn) prevBtn.style.display = "none";
      if (nextBtn) nextBtn.style.display = "none";
      return;
    }

    function showImage(index) {
      images.forEach((img, i) => {
        img.classList.remove("active");
      });
      images[index].classList.add("active");
      currentIndex = index;
    }

    function nextSlide() {
      currentIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
      showImage(currentIndex);
    }

    function prevSlide() {
      currentIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
      showImage(currentIndex);
    }

    function startSlider() {
      if (!intervalId) {
        intervalId = setInterval(nextSlide, 4000);
      }
    }

    function stopSlider() {
      clearInterval(intervalId);
      intervalId = null;
      showImage(0);
    }

    card.addEventListener("mouseenter", startSlider);
    card.addEventListener("mouseleave", stopSlider);

    // التحكم اليدوي
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      clearInterval(intervalId);
      prevSlide();
    });

    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      clearInterval(intervalId);
      nextSlide();
    });

    showImage(0);
  });

  // =========================================================
  // 3. وظيفة البحث والـ Spinner
  // =========================================================
  const searchInput = document.getElementById("productSearchInput");
  const allCards = Array.from(document.querySelectorAll(".product-card"));

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase().trim();

      allCards.forEach((card) => {
        const cardText =
          card.querySelector(".product-name").textContent.toLowerCase() +
          card.querySelector(".product-description").textContent.toLowerCase();

        if (cardText.includes(searchTerm)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  }

  // إخفاء شاشة التحميل عند انتهاء تحميل الصفحة
  window.addEventListener("load", () => {
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.classList.remove("is-active");
      }
    }, 100);
  });
});
