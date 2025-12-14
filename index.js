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

  // ======================= التحقق من حالة تسجيل الدخول =======================
  async function checkAuth() {
    try {
      // التحقق من التخزين المحلي أولاً
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateUIForLoggedInUser();
        return;
      }

      // جلب المستخدمين من قاعدة البيانات للتحقق
      const { data: users, error } = await supabase
        .from("users")
        .select("*")
        .limit(1);

      if (error) {
        console.log(
          "ملاحظة: لا يمكن الاتصال بجدول المستخدمين، سيتم استخدام التخزين المحلي فقط:",
          error.message
        );
      }
    } catch (error) {
      console.error("خطأ في التحقق من المصادقة:", error);
    }
  }

  function updateUIForLoggedInUser() {
    if (currentUser) {
      // تحديث أيقونة المستخدم
      const userIconContainer = document.getElementById("userIconContainer");
      const userIcon = document.querySelector(".user-icon");
      userIconContainer.setAttribute(
        "data-tooltip",
        "مرحباً " + currentUser.full_name
      );
      userIcon.style.color = "var(--primary-color)";

      // إظهار رسالة الترحيب
      const userWelcome = document.getElementById("userWelcome");
      const userName = document.getElementById("userName");
      userName.textContent = currentUser.full_name;
      userWelcome.style.display = "block";

      // تغيير نص أزرار الشراء
      const buyButtons = document.querySelectorAll(
        ".add-to-cart-btn, .explore-btn"
      );
      buyButtons.forEach((btn) => {
        if (btn.classList.contains("add-to-cart-btn")) {
          btn.innerHTML = '<i class="fas fa-cart-plus"></i> شراء الآن';
        }
      });
    }
  }

  function updateUIForLoggedOutUser() {
    const userIconContainer = document.getElementById("userIconContainer");
    const userIcon = document.querySelector(".user-icon");
    userIconContainer.setAttribute("data-tooltip", "تسجيل الدخول");
    userIcon.style.color = "var(--light-gray)";

    const userWelcome = document.getElementById("userWelcome");
    userWelcome.style.display = "none";

    // إعادة نص أزرار الشراء
    const buyButtons = document.querySelectorAll(
      ".add-to-cart-btn, .explore-btn"
    );
    buyButtons.forEach((btn) => {
      if (btn.classList.contains("add-to-cart-btn")) {
        btn.innerHTML = '<i class="fas fa-cart-plus"></i> شراء';
      }
    });
  }

  // ======================= اختبار الاتصال بـ Supabase =======================
  async function testSupabaseConnection() {
    try {
      console.log("جاري اختبار اتصال Supabase...");
      const { data, error } = await supabase
        .from("users")
        .select("count", { count: "exact", head: true });

      if (error) {
        if (error.code === "42P01") {
          console.log("⚠️ جدول users غير موجود في قاعدة البيانات.");
          console.log("ℹ️ سيتم استخدام التخزين المحلي لحفظ بيانات المستخدمين.");
        } else {
          console.log("اتصال Supabase يعمل ولكن مع وجود خطأ:", error.message);
        }
      } else {
        console.log("✅ اتصال Supabase ناجح!");
      }
    } catch (err) {
      console.log("❌ فشل اختبار الاتصال:", err.message);
    }
  }

  // ======================= 1. سلايدر Hero التلقائي =======================
  const heroSliderImages = document.querySelectorAll(
    ".hero-slider .slider-image"
  );
  const heroSliderDots = document.querySelectorAll(".hero-slider .dot");
  let currentSlide = 0;
  const slideInterval = 5000; // 5 ثواني

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

  openLoginBtn.addEventListener("click", () => {
    loginModal.classList.add("active", "fadeIn");
  });

  closeBtn.addEventListener("click", () => {
    loginModal.classList.remove("active", "fadeIn");
  });

  window.addEventListener("click", (event) => {
    if (event.target === loginModal) {
      loginModal.classList.remove("active", "fadeIn");
    }
  });

  // ======================= 3. العدادات المتحركة (Animated Counters) =======================
  const counters = document.querySelectorAll(".counter");
  const aboutSection = document.getElementById("about");
  const aboutImage = document.querySelector(".about-image");
  let hasAnimated = false;

  function animateCounter(counter) {
    const target = +counter.getAttribute("data-target");
    const duration = 1500; // 1.5 ثانية
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
            // تشغيل العدادات
            counters.forEach(animateCounter);
            // تفعيل حركة ظهور الصورة
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

  // ======================= 4. سلايدر صور المنتجات (لكل الكاردات) =======================
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

    // حساب الفهرس الجديد والانتقال الدوري
    let newIndex = currentIndex + step;
    if (newIndex >= images.length) {
      newIndex = 0;
    } else if (newIndex < 0) {
      newIndex = images.length - 1;
    }

    images[newIndex].classList.add("active");
  }

  // تفعيل أزرار التنقل (prev/next) لجميع المنتجات
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

  // ======================= 5. حركات ظهور الكاردات (Scroll Animation) =======================
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

  // ======================= 6. التحكم في الانتقال عبر النافبار =======================
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

      const loadingDuration = 500;

      setTimeout(() => {
        window.location.href = targetUrl;
      }, loadingDuration);
    });
  });

  // ======================= 7. إخفاء شاشة التحميل =======================
  window.addEventListener("load", () => {
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.classList.remove("is-active");
      }
    }, 100);
  });

  // ======================= 8. التحكم في علامات التبويب للمودال =======================
  const loginTab = document.getElementById("loginTab");
  const registerTab = document.getElementById("registerTab");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginTab && registerTab) {
    loginTab.addEventListener("click", () => {
      loginTab.classList.add("active");
      registerTab.classList.remove("active");
      loginForm.classList.add("active");
      registerForm.classList.remove("active");
    });

    registerTab.addEventListener("click", () => {
      registerTab.classList.add("active");
      loginTab.classList.remove("active");
      registerForm.classList.add("active");
      loginForm.classList.remove("active");
    });
  }

  // ======================= 9. معالجة نموذج التسجيل =======================
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

      // التحقق الأساسي
      if (!fullName || !phone || !securityCode) {
        alert("يرجى ملء جميع الحقول المطلوبة!");
        return;
      }

      if (securityCode !== "909090") {
        alert("رمز الأمان غير صحيح! الرمز الصحيح هو 909090");
        return;
      }

      // التحقق من رقم الجوال (يجب أن يكون 10 أرقام)
      const phoneRegex = /^05\d{8}$/;
      if (!phoneRegex.test(phone)) {
        alert("يرجى إدخال رقم جوال صحيح (يبدأ بـ 05 ويحتوي على 10 أرقام)");
        return;
      }

      try {
        // إنشاء بيانات المستخدم
        const userData = {
          full_name: fullName,
          phone: phone,
          email: email || `${phone}@temp.com`,
          security_code: securityCode,
          created_at: new Date().toISOString(),
        };

        console.log("محاولة تسجيل مستخدم جديد:", userData);

        let savedToDatabase = false;
        let dbUser = null;

        // محاولة الحفظ في Supabase
        try {
          const { data, error } = await supabase
            .from("users")
            .insert([userData])
            .select();

          if (error) {
            // إذا كان الجدول غير موجود، سنستخدم التخزين المحلي فقط
            if (
              error.code === "42P01" ||
              error.message.includes("does not exist")
            ) {
              console.log(
                "✅ سيتم استخدام التخزين المحلي (جدول users غير موجود)"
              );
            } else {
              console.log("⚠️ خطأ في Supabase:", error.message);
            }
          } else if (data && data.length > 0) {
            savedToDatabase = true;
            dbUser = data[0];
            console.log("✅ تم حفظ المستخدم في قاعدة البيانات:", dbUser);
          }
        } catch (dbError) {
          console.log("⚠️ فشل الاتصال بقاعدة البيانات:", dbError.message);
        }

        // الحفظ في التخزين المحلي (كتأمين احتياطي)
        const localUser = {
          id: savedToDatabase ? dbUser.id : Date.now(),
          ...userData,
        };

        // التحقق من وجود مستخدم بنفس الرقم في التخزين المحلي
        const existingUsers = JSON.parse(
          localStorage.getItem("localUsers") || "[]"
        );
        const userExists = existingUsers.some((u) => u.phone === phone);

        if (userExists && !savedToDatabase) {
          alert("رقم الجوال مسجل بالفعل! يرجى تسجيل الدخول بدلاً من ذلك.");
          if (loginTab) loginTab.click();
          return;
        }

        if (!savedToDatabase) {
          // إضافة المستخدم إلى القائمة المحلية
          existingUsers.push(localUser);
          localStorage.setItem("localUsers", JSON.stringify(existingUsers));
          console.log("✅ تم حفظ المستخدم في التخزين المحلي");
        }

        // حفظ المستخدم الحالي
        currentUser = savedToDatabase ? dbUser : localUser;
        localStorage.setItem("user", JSON.stringify(currentUser));

        // تحديث الواجهة
        updateUIForLoggedInUser();

        // إغلاق المودال
        if (loginModal) {
          loginModal.classList.remove("active", "fadeIn");
        }

        // إظهار رسالة ترحيبية
        alert(
          `🎉 مرحباً ${fullName}! ${
            savedToDatabase
              ? "تم إنشاء حسابك بنجاح في قاعدة البيانات."
              : "تم حفظ بياناتك محلياً."
          }`
        );
      } catch (err) {
        console.error("فشل التسجيل:", err);
        alert("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
      }
    });
  }

  // ======================= 10. معالجة نموذج تسجيل الدخول =======================
  const loginFormElement = document.getElementById("loginFormElement");
  if (loginFormElement) {
    loginFormElement.addEventListener("submit", async (e) => {
      e.preventDefault();

      const phone = document.getElementById("loginPhone").value;
      const securityCode = document.getElementById("loginSecurityCode").value;

      if (!phone || !securityCode) {
        alert("يرجى ملء جميع الحقول المطلوبة!");
        return;
      }

      if (securityCode !== "909090") {
        alert("رمز الأمان غير صحيح! الرمز الصحيح هو 909090");
        return;
      }

      try {
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
            console.log("✅ تم العثور على المستخدم في قاعدة البيانات");
          }
        } catch (dbError) {
          console.log("⚠️ لا يمكن الاتصال بقاعدة البيانات:", dbError.message);
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
            console.log("✅ تم العثور على المستخدم في التخزين المحلي");
          }
        }

        if (!foundUser) {
          alert("رقم الجوال أو رمز الأمان غير صحيحين!");
          return;
        }

        // حفظ بيانات المستخدم
        currentUser = foundUser;
        localStorage.setItem("user", JSON.stringify(currentUser));

        // تحديث الواجهة
        updateUIForLoggedInUser();

        // إغلاق المودال
        if (loginModal) {
          loginModal.classList.remove("active", "fadeIn");
        }

        // إظهار رسالة ترحيبية
        alert(`🎉 مرحباً بعودتك ${currentUser.full_name}!`);
      } catch (err) {
        console.error("فشل تسجيل الدخول:", err);
        alert("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.");
      }
    });
  }

  // ======================= 11. وظيفة تسجيل الخروج =======================
  window.logout = function () {
    if (confirm("هل أنت متأكد من تسجيل الخروج؟")) {
      localStorage.removeItem("user");
      currentUser = null;
      updateUIForLoggedOutUser();
      alert("✅ تم تسجيل الخروج بنجاح.");
    }
  };

  // ======================= 12. التحقق من تسجيل الدخول قبل الشراء =======================
  function handlePurchase(e) {
    if (!currentUser) {
      e.preventDefault();
      e.stopPropagation();
      alert("يجب تسجيل الدخول أولاً للقيام بالشراء!");
      if (loginModal) {
        loginModal.classList.add("active", "fadeIn");
      }
      return false;
    }

    const productId = e.target.getAttribute("data-product");
    const productName =
      e.target.closest(".product-card")?.querySelector(".product-title")
        ?.textContent ||
      e.target.closest(".course-card")?.querySelector(".course-title")
        ?.textContent ||
      "المنتج";

    alert(
      `🎉 شكراً ${currentUser.full_name}!\nتمت إضافة "${productName}" إلى سلة المشتريات.`
    );

    // هنا يمكنك إضافة منطق إضافة المنتج إلى سلة المشتريات
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    cartItems.push({
      productId: productId,
      productName: productName,
      userId: currentUser.id,
      date: new Date().toISOString(),
    });
    localStorage.setItem("cart", JSON.stringify(cartItems));

    return true;
  }

  // إضافة مستمعين لأزرار الشراء
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  const exploreButtons = document.querySelectorAll(".explore-btn");

  addToCartButtons.forEach((btn) => {
    btn.addEventListener("click", handlePurchase);
  });

  exploreButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      if (!currentUser) {
        e.preventDefault();
        alert("يجب تسجيل الدخول أولاً لحجز الدورة!");
        if (loginModal) {
          loginModal.classList.add("active", "fadeIn");
        }
      } else {
        const courseName =
          this.closest(".course-card")?.querySelector(".course-title")
            ?.textContent || "الدورة";
        alert(
          `🎉 شكراً ${currentUser.full_name}!\nتم حجز "${courseName}" بنجاح.`
        );
      }
    });
  });

  // ======================= 13. تهيئة التطبيق =======================

  // اختبار الاتصال بـ Supabase
  testSupabaseConnection();

  // التحقق من حالة تسجيل الدخول
  checkAuth();

  // عرض عدد المستخدمين المخزنين محلياً (للتطوير فقط)
  const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
  console.log(`👥 عدد المستخدمين المخزنين محلياً: ${localUsers.length}`);

  console.log("✅ تم تحميل التطبيق بنجاح!");
});
