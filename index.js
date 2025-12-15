document.addEventListener("DOMContentLoaded", () => {
  // ======================= تهيئة Supabase =======================
  const SUPABASE_URL = "https://ffwgsrffvzbrmbgjxtbf.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmd2dzcmZmdnpicm1iZ2p4dGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MzE1MjgsImV4cCI6MjA4MTMwNzUyOH0.iv12xp4D2Bp603_PlgcuYN6Kll_Oz9ZdQX0jl6QTWPI";

  const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  let currentUser = null;
  let cartItems = [];
  let currentReviewsProduct = null;

  // ======================= تهيئة التطبيق =======================
  async function initApp() {
    showLoadingScreen();

    try {
      // تحميل العربة من التخزين المحلي
      loadCart();

      // التحقق من تسجيل الدخول
      await checkAuth();

      // اختبار اتصال Supabase
      await testSupabaseConnection();

      // تحديث واجهة العربة
      updateCartUI();

      // تهيئة السلايدر
      initHeroSlider();

      // تهيئة العدادات
      initCounters();

      // تهيئة سلايدر المنتجات
      initProductSliders();

      // تهيئة حركات الكروت
      initCardAnimations();

      // تهيئة أزرار التبديل
      initSwitchTabs();

      // تهيئة نظام المراجعات
      initReviewsSystem();

      // تهيئة نظام المودالات
      initModals();

      // تهيئة نظام الانتقال
      initNavigation();
    } catch (error) {
      console.error("خطأ في تهيئة التطبيق:", error);
    } finally {
      hideLoadingScreen();
    }
  }

  // ======================= نظام الإشعارات =======================
  function showNotification(message, type = "success") {
    const notification = document.getElementById("notification");
    const notificationText = notification.querySelector(".notification-text");

    notification.className = `notification ${type}`;
    notificationText.textContent = message;

    // تغيير الأيقونة حسب النوع
    const icon = notification.querySelector("i");
    switch (type) {
      case "success":
        icon.className = "fas fa-check-circle";
        break;
      case "error":
        icon.className = "fas fa-exclamation-circle";
        break;
      case "info":
        icon.className = "fas fa-info-circle";
        break;
      default:
        icon.className = "fas fa-bell";
    }

    notification.classList.add("show");

    // إخفاء الإشعار بعد 4 ثواني
    setTimeout(() => {
      notification.classList.remove("show");
    }, 4000);
  }

  // ======================= شاشة التحميل =======================
  function showLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.classList.add("is-active");
    }
  }

  function hideLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.classList.remove("is-active");
    }
  }

  // ======================= نظام العربة =======================
  function loadCart() {
    const savedCart = localStorage.getItem("cart");
    cartItems = savedCart ? JSON.parse(savedCart) : [];
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }

  function addToCart(item) {
    // التحقق من وجود المنتج في العربة
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.id === item.id && cartItem.type === item.type
    );

    if (existingItemIndex > -1) {
      // تحديث الكمية إذا كان موجوداً
      cartItems[existingItemIndex].quantity += item.quantity || 1;
      showNotification(`تم تحديث كمية ${item.name} في العربة`, "info");
    } else {
      // إضافة منتج جديد
      cartItems.push({
        ...item,
        quantity: item.quantity || 1,
        addedAt: new Date().toISOString(),
      });
      showNotification(`تم إضافة ${item.name} إلى العربة`, "success");
    }

    saveCart();
    updateCartUI();
  }

  function updateCartUI() {
    const cartCount = document.getElementById("cartCount");
    if (cartCount) {
      const totalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0 ? "flex" : "none";
    }
  }

  // ======================= نظام المستخدم =======================
  async function checkAuth() {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        currentUser = JSON.parse(storedUser);
        await updateUIForLoggedInUser();
        return true;
      }
      updateUIForLoggedOutUser();
      return false;
    } catch (error) {
      console.error("خطأ في التحقق من المصادقة:", error);
      updateUIForLoggedOutUser();
      return false;
    }
  }

  async function updateUIForLoggedInUser() {
    // إظهار Dropdown المستخدم
    const guestUser = document.getElementById("guestUser");
    const loggedInUser = document.getElementById("loggedInUser");
    const ctaButton = document.getElementById("ctaButton");

    if (guestUser) guestUser.style.display = "none";
    if (loggedInUser) loggedInUser.style.display = "flex";

    // تحديث معلومات المستخدم
    const displayUserName = document.getElementById("displayUserName");
    const dropdownUserName = document.getElementById("dropdownUserName");
    const dropdownUserEmail = document.getElementById("dropdownUserEmail");
    const userAvatar = document.getElementById("currentUserAvatar");
    const dropdownAvatar = document.getElementById("dropdownAvatar");

    if (currentUser) {
      if (displayUserName) displayUserName.textContent = currentUser.full_name;
      if (dropdownUserName)
        dropdownUserName.textContent = currentUser.full_name;
      if (dropdownUserEmail)
        dropdownUserEmail.textContent =
          currentUser.email || currentUser.phone + "@temp.com";

      // تحديث الصورة
      const avatarSrc = currentUser.avatar || "11.svg";
      if (userAvatar) userAvatar.src = avatarSrc;
      if (dropdownAvatar) dropdownAvatar.src = avatarSrc;
    }

    // تحديث زر ابدأ الآن
    if (ctaButton && currentUser) {
      const firstName = currentUser.full_name.split(" ")[0];
      ctaButton.innerHTML = `<i class="fas fa-user-circle" style="margin-left: 8px"></i>مرحباً ${firstName}`;
      ctaButton.classList.add("registered");
      ctaButton.href = "#";
      ctaButton.onclick = (e) => {
        e.preventDefault();
        showNotification("أنت مسجل بالفعل!", "info");
      };
    }

    // إضافة مستمعين لـ Dropdown
    initDropdown();
  }

  function updateUIForLoggedOutUser() {
    const guestUser = document.getElementById("guestUser");
    const loggedInUser = document.getElementById("loggedInUser");
    const ctaButton = document.getElementById("ctaButton");

    if (guestUser) guestUser.style.display = "flex";
    if (loggedInUser) loggedInUser.style.display = "none";

    if (ctaButton) {
      ctaButton.innerHTML = "ابدأ الآن";
      ctaButton.classList.remove("registered");
      ctaButton.href = "store.html";
      ctaButton.onclick = null;
    }

    currentUser = null;
    localStorage.removeItem("user");
  }

  // ======================= Dropdown المستخدم =======================
  function initDropdown() {
    const userProfileBtn = document.getElementById("userProfileBtn");
    const dropdownMenu = document.getElementById("dropdownMenu");

    if (!userProfileBtn || !dropdownMenu) return;

    // فتح/إغلاق Dropdown
    userProfileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isActive = userProfileBtn.classList.contains("active");

      // إغلاق جميع Dropdowns الأخرى
      closeAllDropdowns();

      if (!isActive) {
        userProfileBtn.classList.add("active");
        dropdownMenu.classList.add("active");
      }
    });

    // إغلاق Dropdown عند النقر خارجها
    document.addEventListener("click", (e) => {
      if (
        !userProfileBtn.contains(e.target) &&
        !dropdownMenu.contains(e.target)
      ) {
        closeAllDropdowns();
      }
    });

    // منع إغلاق Dropdown عند النقر داخلها
    dropdownMenu.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  function closeAllDropdowns() {
    const userProfileBtn = document.getElementById("userProfileBtn");
    const dropdownMenu = document.getElementById("dropdownMenu");

    if (userProfileBtn) userProfileBtn.classList.remove("active");
    if (dropdownMenu) dropdownMenu.classList.remove("active");
  }

  // ======================= سلايدر Hero التلقائي =======================
  function initHeroSlider() {
    const heroSliderImages = document.querySelectorAll(
      ".hero-slider .slider-image"
    );
    const heroSliderDots = document.querySelectorAll(".hero-slider .dot");
    let currentSlide = 0;
    const slideInterval = 5000;

    function showHeroSlide(index) {
      heroSliderImages.forEach((img) => img.classList.remove("active"));
      heroSliderDots.forEach((dot) => dot.classList.remove("active"));

      heroSliderImages[index].classList.add("active");
      heroSliderDots[index].classList.add("active");
      currentSlide = index;
    }

    function nextHeroSlide() {
      const nextIndex = (currentSlide + 1) % heroSliderImages.length;
      showHeroSlide(nextIndex);
    }

    let heroSlideTimer = setInterval(nextHeroSlide, slideInterval);

    heroSliderDots.forEach((dot) => {
      dot.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        clearInterval(heroSlideTimer);
        showHeroSlide(index);
        heroSlideTimer = setInterval(nextHeroSlide, slideInterval);
      });
    });
  }

  // ======================= العدادات المتحركة =======================
  function initCounters() {
    const counters = document.querySelectorAll(".counter");
    const aboutSection = document.getElementById("about");
    const aboutImage = document.querySelector(".about-image");
    let hasAnimated = false;

    function animateCounter(counter) {
      const target = +counter.getAttribute("data-target");
      const duration = 1500;
      const startTime = performance.now();

      function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(progress * target);

        counter.innerText = value.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target.toLocaleString();
        }
      }
      requestAnimationFrame(updateCount);
    }

    const aboutObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasAnimated) {
              counters.forEach(animateCounter);
              if (aboutImage) {
                aboutImage.style.opacity = 1;
                aboutImage.classList.add("animate-from-bottom");
              }
              hasAnimated = true;
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (aboutSection) {
      aboutObserver.observe(aboutSection);
    }
  }

  // ======================= سلايدر صور المنتجات =======================
  function initProductSliders() {
    const productCards = document.querySelectorAll(
      ".product-card[data-product-id]"
    );

    function showProductSlide(productId, step) {
      const sliderWrapper = document.querySelector(
        `.product-image-slider[data-product-id="${productId}"]`
      );
      const images = sliderWrapper.querySelectorAll(".product-image");

      let currentIndex = 0;

      images.forEach((img, index) => {
        if (img.classList.contains("active")) {
          currentIndex = index;
        }
        img.classList.remove("active");
      });

      let newIndex = currentIndex + step;
      if (newIndex >= images.length) {
        newIndex = 0;
      } else if (newIndex < 0) {
        newIndex = images.length - 1;
      }

      images[newIndex].classList.add("active");
    }

    productCards.forEach((card) => {
      const productId = card.getAttribute("data-product-id");
      const prevBtn = card.querySelector(".prev-btn");
      const nextBtn = card.querySelector(".next-btn");

      if (prevBtn) {
        prevBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          showProductSlide(productId, -1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          showProductSlide(productId, 1);
        });
      }
    });
  }

  // ======================= حركات ظهور الكروت =======================
  function initCardAnimations() {
    const cardsToAnimate = document.querySelectorAll(
      ".course-card, .product-card"
    );

    const cardObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const delay = card.getAttribute("data-delay") || "0";

            setTimeout(() => {
              card.classList.add("visible");
            }, delay);

            observer.unobserve(card);
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    cardsToAnimate.forEach((card, index) => {
      const delay = index * 100;
      card.setAttribute("data-delay", delay);
      cardObserver.observe(card);
    });
  }

  // ======================= نظام الانتقال =======================
  function initNavigation() {
    const loadingScreen = document.getElementById("loading-screen");
    const navLinks = document.querySelectorAll(".nav-links a.nav-item");

    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        if (this.classList.contains("active")) {
          e.preventDefault();
          return;
        }

        e.preventDefault();
        const targetUrl = this.href;
        loadingScreen.classList.add("is-active");

        setTimeout(() => {
          window.location.href = targetUrl;
        }, 500);
      });
    });

    window.addEventListener("load", () => {
      setTimeout(() => {
        if (loadingScreen) {
          loadingScreen.classList.remove("is-active");
        }
      }, 100);
    });
  }

  // ======================= أزرار التبديل =======================
  function initSwitchTabs() {
    const switchTabs = document.querySelector(".switch-tabs");
    const switchBtns = document.querySelectorAll(".switch-btn");
    const switchSlider = document.getElementById("switchSlider");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    function updateSwitchSlider(tab) {
      if (!switchTabs || !switchSlider) return;

      switchTabs.className = `switch-tabs ${tab}-active`;

      // تحديث الأزرار
      switchBtns.forEach((btn) => {
        btn.classList.toggle("active", btn.getAttribute("data-tab") === tab);
      });

      // تبديل النماذج
      if (loginForm && registerForm) {
        if (tab === "login") {
          loginForm.classList.add("active");
          registerForm.classList.remove("active");
        } else {
          registerForm.classList.add("active");
          loginForm.classList.remove("active");
        }
      }
    }

    if (switchBtns.length > 0) {
      switchBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
          const tab = this.getAttribute("data-tab");
          updateSwitchSlider(tab);
        });
      });

      // التهيئة الأولية
      updateSwitchSlider("login");
    }
  }

  // ======================= نظام المراجعات =======================
  function initReviewsSystem() {
    // مستمعين لزر المراجعات
    document.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("reviews-btn") ||
        e.target.closest(".reviews-btn")
      ) {
        const button = e.target.closest(".reviews-btn");
        const productCard = button.closest(".product-card");
        const productId = productCard?.getAttribute("data-product-id");
        const productTitle =
          productCard?.querySelector(".product-title")?.textContent;

        if (productId && productTitle) {
          openReviewsModal(productId, productTitle);
        }
      }
    });

    // مستمعين لتقييم النجوم
    document.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("stars-input") ||
        e.target.closest(".stars-input i")
      ) {
        const star =
          e.target.tagName === "I" ? e.target : e.target.closest("i");
        if (!star) return;

        const rating = parseInt(star.getAttribute("data-rating"));
        window.currentRating = rating;

        // تحديث النجوم
        const stars = document.querySelectorAll(".stars-input i");
        stars.forEach((s, index) => {
          s.className = index < rating ? "fas fa-star" : "far fa-star";
        });

        document.getElementById("selectedRating").textContent = rating;
      }
    });

    // زر إرسال المراجعة
    document
      .getElementById("submitReviewBtn")
      ?.addEventListener("click", submitReview);
  }

  // ======================= نظام المودالات =======================
  function initModals() {
    // مودال تسجيل الدخول
    const loginModal = document.getElementById("loginModal");
    const openLoginBtn = document.getElementById("openLoginModalBtn");
    const closeBtns = document.querySelectorAll(".close-btn");

    // فتح المودال
    if (openLoginBtn) {
      openLoginBtn.addEventListener("click", () => {
        if (currentUser) {
          showNotification("أنت مسجل الدخول بالفعل!", "info");
          return;
        }
        openModal(loginModal);
      });
    }

    // إغلاق المودال
    closeBtns.forEach((btn) => {
      if (btn.parentElement === loginModal.querySelector(".modal-content")) {
        btn.addEventListener("click", () => closeModal(loginModal));
      }
    });

    // إغلاق عند النقر خارج المودال
    window.addEventListener("click", (event) => {
      if (event.target === loginModal) {
        closeModal(loginModal);
      }
    });

    // مودال الإعدادات
    const settingsModal = document.getElementById("settingsModal");
    const openSettingsBtn = document.getElementById("openSettingsModalBtn");

    if (openSettingsBtn) {
      openSettingsBtn.addEventListener("click", () => {
        if (!currentUser) {
          showNotification("يجب تسجيل الدخول أولاً!", "error");
          return;
        }
        openSettingsModal();
      });
    }

    // مستمعين للنماذج
    const registerFormElement = document.getElementById("registerFormElement");
    const loginFormElement = document.getElementById("loginFormElement");
    const saveSettingsBtn = document.getElementById("saveSettingsBtn");

    if (registerFormElement) {
      registerFormElement.addEventListener("submit", handleRegister);
    }

    if (loginFormElement) {
      loginFormElement.addEventListener("submit", handleLogin);
    }

    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener("click", handleSaveSettings);
    }

    // مستمعين لأزرار الشراء
    document.addEventListener("click", handlePurchase);
  }

  // ======================= وظائف المودالات =======================
  function openModal(modal) {
    if (!modal) return;

    modal.classList.add("active");
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";
  }

  function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "auto";
  }

  // ======================= فتح مودال الإعدادات =======================
  function openSettingsModal() {
    if (!currentUser) return;

    // تعبئة البيانات
    document.getElementById("settingsFullName").value = currentUser.full_name;
    document.getElementById("settingsPhone").value = currentUser.phone;
    document.getElementById("settingsEmail").value = currentUser.email || "";
    document.getElementById("settingsPassword").value = "";

    // تعيين الصورة
    const avatarPreview = document.getElementById("avatarPreview");
    if (avatarPreview) {
      avatarPreview.src = currentUser.avatar || "11.svg";
    }

    // تحديد الصورة الحالية
    const avatarOptions = document.querySelectorAll(".avatar-option");
    avatarOptions.forEach((option) => {
      const avatarSrc = option.getAttribute("data-avatar");
      option.classList.toggle("selected", avatarSrc === currentUser.avatar);
    });

    // إعداد رفع الصورة
    const avatarUpload = document.getElementById("avatarUpload");
    const avatarUploadContainer = document.querySelector(
      ".avatar-upload-container"
    );

    if (avatarUpload && avatarUploadContainer) {
      avatarUploadContainer.addEventListener("click", () =>
        avatarUpload.click()
      );

      avatarUpload.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            // رفع الصورة إلى Supabase Storage
            const fileName = `${Date.now()}-${file.name}`;
            const { data, error } = await supabase.storage
              .from("avatars")
              .upload(fileName, file);

            if (error) throw error;

            // الحصول على رابط الصورة
            const { data: urlData } = supabase.storage
              .from("avatars")
              .getPublicUrl(fileName);

            if (urlData.publicUrl) {
              currentUser.avatar = urlData.publicUrl;
              avatarPreview.src = urlData.publicUrl;
              showNotification("تم رفع الصورة بنجاح!", "success");
            }
          } catch (error) {
            console.error("خطأ في رفع الصورة:", error);
            showNotification(
              "فشل رفع الصورة، سيتم استخدام التخزين المحلي",
              "error"
            );

            // استخدام التخزين المحلي كبديل
            const reader = new FileReader();
            reader.onload = (e) => {
              currentUser.avatar = e.target.result;
              avatarPreview.src = e.target.result;
              showNotification("تم حفظ الصورة محلياً", "info");
            };
            reader.readAsDataURL(file);
          }
        }
      });
    }

    openModal(settingsModal);
  }

  function closeSettingsModal() {
    closeModal(document.getElementById("settingsModal"));
  }

  // ======================= فتح مودال المراجعات =======================
  function openReviewsModal(productId, productTitle) {
    currentReviewsProduct = { id: productId, title: productTitle };

    // تعيين عنوان المنتج
    document.getElementById("reviewsProductTitle").textContent = productTitle;

    // إظهار/إخفاء قسم كتابة مراجعة
    const writeReviewSection = document.getElementById("writeReviewSection");
    if (currentUser) {
      writeReviewSection.style.display = "block";

      // إعادة تعيين التقييم
      window.currentRating = 0;
      document.querySelectorAll(".stars-input i").forEach((star) => {
        star.className = "far fa-star";
      });
      document.getElementById("selectedRating").textContent = "0";
      document.getElementById("reviewText").value = "";
    } else {
      writeReviewSection.style.display = "none";
    }

    // تحميل المراجعات
    loadProductReviews(productId);

    openModal(document.getElementById("reviewsModal"));
  }

  function closeReviewsModal() {
    closeModal(document.getElementById("reviewsModal"));
  }

  // ======================= تحميل مراجعات المنتج =======================
  async function loadProductReviews(productId) {
    const reviewsList = document.getElementById("reviewsList");
    const noReviewsMessage = document.getElementById("noReviewsMessage");

    if (!reviewsList) return;

    reviewsList.innerHTML = "";

    try {
      // محاولة جلب المراجعات من Supabase
      const { data: reviews, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (reviews && reviews.length > 0) {
        noReviewsMessage.style.display = "none";

        reviews.forEach((review) => {
          const reviewElement = createReviewElement(review);
          reviewsList.appendChild(reviewElement);
        });
      } else {
        noReviewsMessage.style.display = "block";
      }
    } catch (error) {
      console.log("لا يمكن تحميل المراجعات من قاعدة البيانات:", error.message);

      // استخدام التخزين المحلي كبديل
      const localReviews = JSON.parse(
        localStorage.getItem(`reviews_${productId}`) || "[]"
      );

      if (localReviews.length > 0) {
        noReviewsMessage.style.display = "none";
        localReviews.forEach((review) => {
          const reviewElement = createReviewElement(review);
          reviewsList.appendChild(reviewElement);
        });
      } else {
        noReviewsMessage.style.display = "block";
      }
    }
  }

  function createReviewElement(review) {
    const div = document.createElement("div");
    div.className = "review-item";

    div.innerHTML = `
      <div class="review-header">
        <img src="${
          review.user_avatar || "11.svg"
        }" alt="صورة المستخدم" class="review-avatar" />
        <div class="review-info">
          <h5>${review.user_name}</h5>
          <div class="review-date">${new Date(
            review.created_at
          ).toLocaleDateString("ar-SA")}</div>
        </div>
      </div>
      <div class="review-stars">
        ${Array(5)
          .fill()
          .map(
            (_, i) =>
              `<i class="fas fa-star${i < review.rating ? "" : "-o"}"></i>`
          )
          .join("")}
        <span style="color: #666; margin-right: 10px;">${review.rating}.0</span>
      </div>
      <p>${review.comment}</p>
    `;

    return div;
  }

  // ======================= إرسال مراجعة =======================
  async function submitReview() {
    if (!currentUser) {
      showNotification("يجب تسجيل الدخول لكتابة مراجعة!", "error");
      return;
    }

    if (!window.currentRating || window.currentRating === 0) {
      showNotification("يرجى اختيار تقييم!", "error");
      return;
    }

    const comment = document.getElementById("reviewText").value.trim();
    if (!comment) {
      showNotification("يرجى كتابة مراجعة!", "error");
      return;
    }

    const review = {
      product_id: currentReviewsProduct.id,
      product_name: currentReviewsProduct.title,
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      user_avatar: currentUser.avatar,
      rating: window.currentRating,
      comment: comment,
      created_at: new Date().toISOString(),
    };

    try {
      // محاولة الحفظ في Supabase
      const { data, error } = await supabase.from("reviews").insert([review]);

      if (error) throw error;

      showNotification("تم نشر مراجعتك بنجاح!", "success");

      // الحفظ محلياً كنسخة احتياطية
      const localKey = `reviews_${currentReviewsProduct.id}`;
      const localReviews = JSON.parse(localStorage.getItem(localKey) || "[]");
      localReviews.unshift(review);
      localStorage.setItem(localKey, JSON.stringify(localReviews));

      // تحديث القائمة
      loadProductReviews(currentReviewsProduct.id);

      // إعادة تعيين النموذج
      document.getElementById("reviewText").value = "";
      window.currentRating = 0;
      document.querySelectorAll(".stars-input i").forEach((star) => {
        star.className = "far fa-star";
      });
      document.getElementById("selectedRating").textContent = "0";
    } catch (error) {
      console.error("خطأ في حفظ المراجعة:", error);
      showNotification("تم حفظ المراجعة محلياً فقط", "info");

      // الحفظ في التخزين المحلي
      const localKey = `reviews_${currentReviewsProduct.id}`;
      const localReviews = JSON.parse(localStorage.getItem(localKey) || "[]");
      localReviews.unshift(review);
      localStorage.setItem(localKey, JSON.stringify(localReviews));

      // تحديث القائمة
      loadProductReviews(currentReviewsProduct.id);

      // إعادة تعيين النموذج
      document.getElementById("reviewText").value = "";
      window.currentRating = 0;
    }
  }

  // ======================= معالجة التسجيل =======================
  async function handleRegister(e) {
    e.preventDefault();

    const fullName = document.getElementById("registerFullName").value;
    const phone = document.getElementById("registerPhone").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const securityCode = document.getElementById("registerSecurityCode").value;
    const submitBtn = document.getElementById("registerSubmitBtn");

    // التحقق من البيانات
    if (!fullName || !phone || !password || !securityCode) {
      showNotification("يرجى ملء جميع الحقول المطلوبة!", "error");
      return;
    }

    if (securityCode !== "909090") {
      showNotification("رمز الأمان غير صحيح!", "error");
      return;
    }

    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(phone)) {
      showNotification("يرجى إدخال رقم جوال صحيح!", "error");
      return;
    }

    if (password.length < 6) {
      showNotification("كلمة المرور يجب أن تكون 6 أحرف على الأقل!", "error");
      return;
    }

    try {
      // عرض حالة التحميل
      submitBtn.classList.add("loading");
      submitBtn.disabled = true;

      // التحقق من عدم وجود مستخدم بنفس الرقم
      let userExists = false;

      try {
        const { data: existingUsers, error } = await supabase
          .from("users")
          .select("id")
          .eq("phone", phone);

        if (!error && existingUsers && existingUsers.length > 0) {
          userExists = true;
        }
      } catch (dbError) {
        console.log("لا يمكن التحقق من قاعدة البيانات:", dbError.message);
      }

      // التحقق من التخزين المحلي
      if (!userExists) {
        const localUsers = JSON.parse(
          localStorage.getItem("localUsers") || "[]"
        );
        userExists = localUsers.some((u) => u.phone === phone);
      }

      if (userExists) {
        showNotification("رقم الجوال مسجل بالفعل! يرجى تسجيل الدخول.", "error");
        document.querySelector('.switch-btn[data-tab="login"]').click();
        document.getElementById("loginPhone").value = phone;
        return;
      }

      // إنشاء بيانات المستخدم
      const userData = {
        full_name: fullName,
        phone: phone,
        email: email || `${phone}@temp.com`,
        password: password,
        security_code: securityCode,
        avatar: "11.svg",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      let savedToDatabase = false;
      let dbUser = null;

      // محاولة الحفظ في Supabase
      try {
        const { data, error } = await supabase
          .from("users")
          .insert([userData])
          .select();

        if (error) throw error;

        if (data && data.length > 0) {
          savedToDatabase = true;
          dbUser = data[0];
          console.log("✅ تم حفظ المستخدم في Supabase");
        }
      } catch (dbError) {
        console.log("⚠️ خطأ في قاعدة البيانات:", dbError.message);
      }

      // الحفظ في التخزين المحلي
      const localUser = {
        id: savedToDatabase ? dbUser.id : `local_${Date.now()}`,
        ...userData,
      };

      const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
      localUsers.push(localUser);
      localStorage.setItem("localUsers", JSON.stringify(localUsers));

      // حفظ المستخدم الحالي
      currentUser = savedToDatabase ? dbUser : localUser;
      localStorage.setItem("user", JSON.stringify(currentUser));

      // تحديث الواجهة
      await updateUIForLoggedInUser();

      // إغلاق المودال
      closeModal(document.getElementById("loginModal"));

      showNotification(
        `🎉 مرحباً ${fullName}! تم إنشاء حسابك بنجاح.`,
        "success"
      );
    } catch (error) {
      console.error("فشل التسجيل:", error);
      showNotification("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.", "error");
    } finally {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  }

  // ======================= معالجة تسجيل الدخول =======================
  async function handleLogin(e) {
    e.preventDefault();

    const phone = document.getElementById("loginPhone").value;
    const password = document.getElementById("loginPassword").value;
    const securityCode = document.getElementById("loginSecurityCode").value;
    const submitBtn = document.getElementById("loginSubmitBtn");

    if (!phone || !password || !securityCode) {
      showNotification("يرجى ملء جميع الحقول!", "error");
      return;
    }

    if (securityCode !== "909090") {
      showNotification("رمز الأمان غير صحيح!", "error");
      return;
    }

    try {
      submitBtn.classList.add("loading");
      submitBtn.disabled = true;

      let foundUser = null;

      // البحث في Supabase
      try {
        const { data: users, error } = await supabase
          .from("users")
          .select("*")
          .eq("phone", phone)
          .eq("password", password)
          .eq("security_code", securityCode);

        if (!error && users && users.length > 0) {
          foundUser = users[0];
        }
      } catch (dbError) {
        console.log("لا يمكن الاتصال بقاعدة البيانات:", dbError.message);
      }

      // البحث في التخزين المحلي
      if (!foundUser) {
        const localUsers = JSON.parse(
          localStorage.getItem("localUsers") || "[]"
        );
        foundUser = localUsers.find(
          (u) =>
            u.phone === phone &&
            u.password === password &&
            u.security_code === securityCode
        );
      }

      if (!foundUser) {
        showNotification("بيانات الدخول غير صحيحة!", "error");
        return;
      }

      currentUser = foundUser;
      localStorage.setItem("user", JSON.stringify(currentUser));

      await updateUIForLoggedInUser();
      closeModal(document.getElementById("loginModal"));

      showNotification(`🎉 مرحباً بعودتك ${currentUser.full_name}!`, "success");
    } catch (error) {
      console.error("فشل تسجيل الدخول:", error);
      showNotification("حدث خطأ أثناء تسجيل الدخول.", "error");
    } finally {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  }

  // ======================= حفظ الإعدادات =======================
  async function handleSaveSettings() {
    const fullName = document.getElementById("settingsFullName").value;
    const phone = document.getElementById("settingsPhone").value;
    const email = document.getElementById("settingsEmail").value;
    const password = document.getElementById("settingsPassword").value;
    const selectedAvatar =
      document
        .querySelector(".avatar-option.selected")
        ?.getAttribute("data-avatar") || currentUser.avatar;

    if (!fullName || !phone) {
      showNotification("الاسم ورقم الجوال مطلوبان!", "error");
      return;
    }

    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(phone)) {
      showNotification("رقم الجوال غير صحيح!", "error");
      return;
    }

    try {
      // تحديث بيانات المستخدم
      const updatedUser = {
        ...currentUser,
        full_name: fullName,
        phone: phone,
        email: email,
        avatar: selectedAvatar,
        updated_at: new Date().toISOString(),
      };

      // تحديث كلمة المرور إذا تم إدخالها
      if (password) {
        updatedUser.password = password;
      }

      // تحديث في Supabase إن أمكن
      try {
        const { error } = await supabase
          .from("users")
          .update(updatedUser)
          .eq("id", currentUser.id);

        if (error) console.log("⚠️ فشل تحديث قاعدة البيانات:", error.message);
      } catch (dbError) {
        console.log("لا يمكن تحديث قاعدة البيانات:", dbError.message);
      }

      // تحديث في التخزين المحلي
      const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
      const userIndex = localUsers.findIndex((u) => u.id === currentUser.id);
      if (userIndex !== -1) {
        localUsers[userIndex] = updatedUser;
        localStorage.setItem("localUsers", JSON.stringify(localUsers));
      }

      // حفظ المستخدم الحالي
      currentUser = updatedUser;
      localStorage.setItem("user", JSON.stringify(currentUser));

      // تحديث الواجهة
      await updateUIForLoggedInUser();

      closeSettingsModal();
      showNotification("✅ تم تحديث بياناتك بنجاح!", "success");
    } catch (error) {
      console.error("فشل تحديث البيانات:", error);
      showNotification("حدث خطأ أثناء تحديث البيانات!", "error");
    }
  }

  // ======================= معالجة أزرار الشراء =======================
  function handlePurchase(e) {
    // أزرار إضافة إلى العربة
    if (
      e.target.classList.contains("add-to-cart-btn") ||
      e.target.closest(".add-to-cart-btn")
    ) {
      e.preventDefault();
      const button = e.target.classList.contains("add-to-cart-btn")
        ? e.target
        : e.target.closest(".add-to-cart-btn");
      if (!button || button.classList.contains("loading")) return;

      const productCard = button.closest(".product-card");
      if (!productCard) return;

      const productId = productCard.getAttribute("data-product-id");
      const productTitle =
        productCard.querySelector(".product-title")?.textContent;
      const productPrice = productCard.querySelector(".new-price")?.textContent;

      if (!currentUser) {
        showNotification("يجب تسجيل الدخول أولاً!", "error");
        openModal(document.getElementById("loginModal"));
        return;
      }

      const item = {
        id: productId,
        type: "product",
        name: productTitle || "منتج",
        price: productPrice || "0 ر.س",
        quantity: 1,
      };

      addToCart(item);

      // تأثير التحميل على الزر
      button.classList.add("loading");
      setTimeout(() => button.classList.remove("loading"), 1000);
    }

    // أزرار حجز الدورة
    if (
      e.target.classList.contains("course-buy-btn") ||
      e.target.closest(".course-buy-btn")
    ) {
      e.preventDefault();
      const button = e.target.classList.contains("course-buy-btn")
        ? e.target
        : e.target.closest(".course-buy-btn");
      if (!button) return;

      const courseCard = button.closest(".course-card");
      if (!courseCard) return;

      const courseTitle =
        courseCard.querySelector(".course-title")?.textContent;
      const coursePrice =
        courseCard.querySelector(".new-price")?.textContent ||
        courseCard.querySelector(".course-price")?.textContent;

      if (!currentUser) {
        showNotification("يجب تسجيل الدخول أولاً!", "error");
        openModal(document.getElementById("loginModal"));
        return;
      }

      const item = {
        id: `course_${Date.now()}`,
        type: "course",
        name: courseTitle || "دورة",
        price: coursePrice,
        quantity: 1,
      };

      addToCart(item);

      // تأثير التحميل على الزر
      button.classList.add("loading");
      setTimeout(() => button.classList.remove("loading"), 1000);
    }
  }

  // ======================= تسجيل الخروج =======================
  window.logout = function () {
    hideLogoutConfirm();
    updateUIForLoggedOutUser();
    showNotification("✅ تم تسجيل الخروج بنجاح.", "success");
  };

  window.showLogoutConfirm = function () {
    closeAllDropdowns();
    document.getElementById("logoutConfirmModal")?.classList.add("active");
  };

  window.hideLogoutConfirm = function () {
    document.getElementById("logoutConfirmModal")?.classList.remove("active");
  };

  window.openSettingsModal = openSettingsModal;
  window.closeSettingsModal = closeSettingsModal;
  window.openReviewsModal = openReviewsModal;
  window.closeReviewsModal = closeReviewsModal;

  // ======================= اختبار اتصال Supabase =======================
  async function testSupabaseConnection() {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("count", { count: "exact", head: true })
        .limit(1);

      if (error && error.code === "42P01") {
        console.log("ملاحظة: جدول users غير موجود في Supabase");
      } else if (!error) {
        console.log("✅ اتصال Supabase ناجح!");
      }
    } catch (err) {
      console.log("❌ فشل اختبار الاتصال:", err.message);
    }
  }

  // ======================= تهيئة النظام =======================
  initApp();
  console.log("✅ تم تحميل التطبيق بنجاح!");
  async function handleRegister(e) {
    e.preventDefault();

    const fullName = document.getElementById("registerFullName").value;
    const phone = document.getElementById("registerPhone").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const securityCode = document.getElementById("registerSecurityCode").value;

    // التحقق من البيانات
    if (!fullName || !phone || !password || !securityCode) {
      showNotification("يرجى ملء جميع الحقول المطلوبة!", "error");
      return;
    }

    if (securityCode !== "909090") {
      showNotification("رمز الأمان غير صحيح!", "error");
      return;
    }

    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(phone)) {
      showNotification("يرجى إدخال رقم جوال صحيح!", "error");
      return;
    }
  }
});
