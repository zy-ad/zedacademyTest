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

  // ======================= نظام الإشعارات =======================
  function showNotification(message, type = "success") {
    const notification = document.getElementById("notification");
    const notificationText = notification.querySelector(".notification-text");

    notification.className = `notification ${type}`;
    notificationText.textContent = message;

    // تغيير الأيقونة حسب النوع
    const icon = notification.querySelector("i");
    if (type === "success") {
      icon.className = "fas fa-check-circle";
    } else if (type === "error") {
      icon.className = "fas fa-exclamation-circle";
    } else {
      icon.className = "fas fa-info-circle";
    }

    notification.classList.add("show");

    // إخفاء الإشعار بعد 5 ثواني
    setTimeout(() => {
      notification.classList.remove("show");
    }, 5000);
  }

  // ======================= التحقق من حالة تسجيل الدخول =======================
  async function checkAuth() {
    try {
      // التحقق من التخزين المحلي
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateUIForLoggedInUser();
        return true;
      }
      return false;
    } catch (error) {
      console.error("خطأ في التحقق من المصادقة:", error);
      return false;
    }
  }

  function updateUIForLoggedInUser() {
    if (currentUser) {
      // إخفاء أيقونة المستخدم وإظهار البروفايل
      const userIconContainer = document.getElementById("userIconContainer");
      const loggedInUser = document.getElementById("loggedInUser");
      const displayUserName = document.getElementById("displayUserName");
      const ctaButton = document.getElementById("ctaButton");

      userIconContainer.style.display = "none";
      loggedInUser.style.display = "flex";
      displayUserName.textContent = currentUser.full_name;

      // تحديث زر ابدأ الآن
      if (ctaButton) {
        ctaButton.textContent = `مرحباً ${currentUser.full_name.split(" ")[0]}`;
        ctaButton.classList.add("registered");
        ctaButton.href = "#";
        ctaButton.onclick = () => {
          showNotification("أنت مسجل بالفعل!", "info");
          return false;
        };
      }

      // تحديث أيقونة المستخدم في الأدوات
      const userIcon = document.querySelector(".user-icon");
      userIconContainer.setAttribute(
        "data-tooltip",
        "مرحباً " + currentUser.full_name
      );
      userIcon.style.color = "var(--primary-color)";
    }
  }

  function updateUIForLoggedOutUser() {
    const userIconContainer = document.getElementById("userIconContainer");
    const loggedInUser = document.getElementById("loggedInUser");
    const ctaButton = document.getElementById("ctaButton");

    userIconContainer.style.display = "block";
    loggedInUser.style.display = "none";
    userIconContainer.setAttribute("data-tooltip", "تسجيل الدخول");

    if (ctaButton) {
      ctaButton.textContent = "ابدأ الآن";
      ctaButton.classList.remove("registered");
      ctaButton.href = "store.html";
      ctaButton.onclick = null;
    }

    currentUser = null;
    localStorage.removeItem("user");
  }

  // ======================= نافذة تأكيد تسجيل الخروج =======================
  function showLogoutConfirm() {
    const logoutModal = document.getElementById("logoutConfirmModal");
    logoutModal.classList.add("active");
  }

  function hideLogoutConfirm() {
    const logoutModal = document.getElementById("logoutConfirmModal");
    logoutModal.classList.remove("active");
  }

  // ======================= 1. سلايدر Hero التلقائي =======================
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

  // ======================= 2. مودال تسجيل الدخول =======================
  const loginModal = document.getElementById("loginModal");
  const openLoginBtn = document.getElementById("openLoginModal");
  const closeBtn = document.querySelector(".close-btn");

  if (openLoginBtn) {
    openLoginBtn.addEventListener("click", () => {
      if (currentUser) {
        showNotification("أنت مسجل الدخول بالفعل!", "info");
        return;
      }
      loginModal.classList.add("active", "fadeIn");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      loginModal.classList.remove("active", "fadeIn");
    });
  }

  window.addEventListener("click", (event) => {
    if (event.target === loginModal) {
      loginModal.classList.remove("active", "fadeIn");
    }
  });

  // ======================= 3. العدادات المتحركة =======================
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

      counter.innerText = value;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target;
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

  // ======================= 4. سلايدر صور المنتجات =======================
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

  // ======================= 5. حركات ظهور الكاردات =======================
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

  // ======================= 6. التحكم في الانتقال =======================
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

  // ======================= 7. زر التبديل المنزلق =======================
  const switchBtns = document.querySelectorAll(".switch-btn");
  const switchSlider = document.getElementById("switchSlider");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  function updateSwitchSlider(activeTab) {
    if (!switchSlider) return;

    if (activeTab === "login") {
      switchSlider.style.right = "5px";
      switchSlider.style.transform = "translateX(0)";
    } else {
      switchSlider.style.right = "calc(50% + 2.5px)";
      switchSlider.style.transform = "translateX(50%)";
    }
  }

  if (switchBtns.length > 0) {
    switchBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const tab = this.getAttribute("data-tab");

        // تحديث الأزرار النشطة
        switchBtns.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        // تحديث المنزلق
        updateSwitchSlider(tab);

        // تبديل النماذج
        if (tab === "login") {
          loginForm.classList.add("active");
          registerForm.classList.remove("active");
        } else {
          registerForm.classList.add("active");
          loginForm.classList.remove("active");
        }
      });
    });

    // التهيئة الأولية
    updateSwitchSlider("login");
  }

  // ======================= 8. معالجة نموذج التسجيل =======================
  const registerFormElement = document.getElementById("registerFormElement");
  if (registerFormElement) {
    registerFormElement.addEventListener("submit", async (e) => {
      e.preventDefault();

      const fullName = document.getElementById("registerFullName").value;
      const phone = document.getElementById("registerPhone").value;
      const email = document.getElementById("registerEmail").value;
      const securityCode = document.getElementById(
        "registerSecurityCode"
      ).value;
      const submitBtn = document.getElementById("registerSubmitBtn");

      // التحقق الأساسي
      if (!fullName || !phone || !securityCode) {
        showNotification("يرجى ملء جميع الحقول المطلوبة!", "error");
        return;
      }

      if (securityCode !== "909090") {
        showNotification(
          "رمز الأمان غير صحيح! الرمز الصحيح هو 909090",
          "error"
        );
        return;
      }

      // التحقق من رقم الجوال
      const phoneRegex = /^05\d{8}$/;
      if (!phoneRegex.test(phone)) {
        showNotification(
          "يرجى إدخال رقم جوال صحيح (يبدأ بـ 05 ويحتوي على 10 أرقام)",
          "error"
        );
        return;
      }

      try {
        // عرض حالة التحميل
        submitBtn.classList.add("loading");
        submitBtn.disabled = true;

        // إنشاء بيانات المستخدم
        const userData = {
          full_name: fullName,
          phone: phone,
          email: email || `${phone}@temp.com`,
          security_code: securityCode,
          created_at: new Date().toISOString(),
        };

        // محاولة الحفظ في Supabase
        let savedToDatabase = false;
        let dbUser = null;

        try {
          const { data, error } = await supabase
            .from("users")
            .insert([userData])
            .select();

          if (error) {
            console.log("ملاحظة: فشل حفظ في قاعدة البيانات:", error.message);
          } else if (data && data.length > 0) {
            savedToDatabase = true;
            dbUser = data[0];
            console.log("✅ تم حفظ المستخدم في Supabase:", dbUser);
          }
        } catch (dbError) {
          console.log("⚠️ خطأ في الاتصال بقاعدة البيانات:", dbError.message);
        }

        // الحفظ في التخزين المحلي (كتأمين احتياطي)
        const localUser = {
          id: savedToDatabase ? dbUser.id : Date.now(),
          ...userData,
        };

        // التحقق من وجود مستخدم بنفس الرقم
        const existingUsers = JSON.parse(
          localStorage.getItem("localUsers") || "[]"
        );
        const userExists = existingUsers.some((u) => u.phone === phone);

        if (userExists && !savedToDatabase) {
          showNotification(
            "رقم الجوال مسجل بالفعل! يرجى تسجيل الدخول.",
            "error"
          );
          submitBtn.classList.remove("loading");
          submitBtn.disabled = false;

          // التبديل إلى تسجيل الدخول
          document.querySelector('.switch-btn[data-tab="login"]').click();
          document.getElementById("loginPhone").value = phone;
          return;
        }

        if (!savedToDatabase) {
          existingUsers.push(localUser);
          localStorage.setItem("localUsers", JSON.stringify(existingUsers));
        }

        // حفظ المستخدم الحالي
        currentUser = savedToDatabase ? dbUser : localUser;
        localStorage.setItem("user", JSON.stringify(currentUser));

        // تحديث الواجهة
        updateUIForLoggedInUser();

        // إغلاق المودال
        loginModal.classList.remove("active", "fadeIn");

        // إظهار إشعار نجاح
        showNotification(
          `🎉 مرحباً ${fullName}! تم إنشاء حسابك بنجاح.`,
          "success"
        );
      } catch (err) {
        console.error("فشل التسجيل:", err);
        showNotification("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.", "error");
      } finally {
        // إخفاء حالة التحميل
        const submitBtn = document.getElementById("registerSubmitBtn");
        if (submitBtn) {
          submitBtn.classList.remove("loading");
          submitBtn.disabled = false;
        }
      }
    });
  }

  // ======================= 9. معالجة نموذج تسجيل الدخول =======================
  const loginFormElement = document.getElementById("loginFormElement");
  if (loginFormElement) {
    loginFormElement.addEventListener("submit", async (e) => {
      e.preventDefault();

      const phone = document.getElementById("loginPhone").value;
      const securityCode = document.getElementById("loginSecurityCode").value;
      const submitBtn = document.getElementById("loginSubmitBtn");

      if (!phone || !securityCode) {
        showNotification("يرجى ملء جميع الحقول المطلوبة!", "error");
        return;
      }

      if (securityCode !== "909090") {
        showNotification("رمز الأمان غير صحيح!", "error");
        return;
      }

      try {
        // عرض حالة التحميل
        submitBtn.classList.add("loading");
        submitBtn.disabled = true;

        let foundUser = null;

        // البحث في قاعدة البيانات أولاً
        try {
          const { data: users, error } = await supabase
            .from("users")
            .select("*")
            .eq("phone", phone)
            .eq("security_code", securityCode);

          if (!error && users && users.length > 0) {
            foundUser = users[0];
          }
        } catch (dbError) {
          console.log("لا يمكن الاتصال بقاعدة البيانات:", dbError.message);
        }

        // إذا لم يتم العثور في قاعدة البيانات، ابحث في التخزين المحلي
        if (!foundUser) {
          const localUsers = JSON.parse(
            localStorage.getItem("localUsers") || "[]"
          );
          const localUser = localUsers.find(
            (u) => u.phone === phone && u.security_code === securityCode
          );

          if (localUser) {
            foundUser = localUser;
          }
        }

        if (!foundUser) {
          showNotification("رقم الجوال أو رمز الأمان غير صحيحين!", "error");
          submitBtn.classList.remove("loading");
          submitBtn.disabled = false;
          return;
        }

        // حفظ بيانات المستخدم
        currentUser = foundUser;
        localStorage.setItem("user", JSON.stringify(currentUser));

        // تحديث الواجهة
        updateUIForLoggedInUser();

        // إغلاق المودال
        loginModal.classList.remove("active", "fadeIn");

        // إظهار إشعار نجاح
        showNotification(
          `🎉 مرحباً بعودتك ${currentUser.full_name}!`,
          "success"
        );
      } catch (err) {
        console.error("فشل تسجيل الدخول:", err);
        showNotification(
          "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.",
          "error"
        );
      } finally {
        // إخفاء حالة التحميل
        if (submitBtn) {
          submitBtn.classList.remove("loading");
          submitBtn.disabled = false;
        }
      }
    });
  }

  // ======================= 10. وظيفة تسجيل الخروج =======================
  window.logout = function () {
    hideLogoutConfirm();
    updateUIForLoggedOutUser();
    showNotification("✅ تم تسجيل الخروج بنجاح.", "success");
  };

  // ======================= 11. التحقق من تسجيل الدخول قبل الشراء =======================
  function handlePurchase(e) {
    e.preventDefault();

    if (!currentUser) {
      showNotification("يجب تسجيل الدخول أولاً للقيام بالشراء!", "error");
      loginModal.classList.add("active", "fadeIn");
      return;
    }

    const button = e.target.closest("button") || e.target;
    const productId = button.getAttribute("data-product");
    const productName =
      button.closest(".product-card")?.querySelector(".product-title")
        ?.textContent ||
      button.closest(".course-card")?.querySelector(".course-title")
        ?.textContent ||
      "المنتج";

    // عرض حالة التحميل على الزر
    button.classList.add("loading");
    button.disabled = true;

    // محاكاة عملية الشراء
    setTimeout(() => {
      // حفظ في سلة المشتريات
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
      cartItems.push({
        productId: productId,
        productName: productName,
        userId: currentUser.id,
        date: new Date().toISOString(),
        price:
          button.closest(".product-card")?.querySelector(".new-price")
            ?.textContent || "غير محدد",
      });
      localStorage.setItem("cart", JSON.stringify(cartItems));

      // إظهار إشعار النجاح
      showNotification(
        `✅ تمت إضافة "${productName}" إلى سلة المشتريات`,
        "success"
      );

      // إخفاء حالة التحميل
      button.classList.remove("loading");
      button.disabled = false;

      // التوجيه إلى صفحة الدفع بعد ثانيتين
      setTimeout(() => {
        window.location.href = "دفع.html";
      }, 2000);
    }, 1500);
  }

  // إضافة مستمعين لأزرار الشراء
  const addToCartButtons = document.querySelectorAll(".product-buy-btn");
  const exploreButtons = document.querySelectorAll(".course-buy-btn");

  addToCartButtons.forEach((btn) => {
    btn.addEventListener("click", handlePurchase);
  });

  exploreButtons.forEach((btn) => {
    btn.addEventListener("click", handlePurchase);
  });

  // ======================= 12. تهيئة التطبيق =======================

  // التحقق من حالة تسجيل الدخول
  checkAuth();

  // اختبار اتصال Supabase
  async function testSupabaseConnection() {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("count", { count: "exact", head: true });

      if (error && error.code === "42P01") {
        console.log(
          "ملاحظة: جدول users غير موجود في Supabase. سيتم استخدام التخزين المحلي."
        );
      } else if (!error) {
        console.log("✅ اتصال Supabase ناجح!");
      }
    } catch (err) {
      console.log("❌ فشل اختبار الاتصال:", err.message);
    }
  }

  testSupabaseConnection();

  console.log("✅ تم تحميل التطبيق بنجاح!");
});

// ======================= وظائف عامة =======================
window.showLogoutConfirm = function () {
  const logoutModal = document.getElementById("logoutConfirmModal");
  if (logoutModal) {
    logoutModal.classList.add("active");
  }
};

window.hideLogoutConfirm = function () {
  const logoutModal = document.getElementById("logoutConfirmModal");
  if (logoutModal) {
    logoutModal.classList.remove("active");
  }
};
