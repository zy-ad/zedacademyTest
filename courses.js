document.addEventListener("DOMContentLoaded", () => {
  // العناصر الأساسية
  const coursesGrid = document.getElementById("coursesGrid");
  const courseCards = coursesGrid
    ? Array.from(coursesGrid.querySelectorAll(".course-card"))
    : [];
  const courseCountElement = document.getElementById("courseCount");
  const noResultsMessage = document.getElementById("noResults");
  const searchInput = document.getElementById("courseSearchInput");
  const applyFilterBtn = document.querySelector(".apply-filter-btn");
  const resetFilterBtn = document.querySelector(".reset-filter-btn");

  // عناصر التصفية الجديدة (للوظائف التفاعلية)
  const sidebarFilter = document.getElementById("sidebarFilter");
  const toggleFilterBtn = document.getElementById("toggleFilterBtn");

  // ======================= وظيفة التصفية والبحث الرئيسية =======================

  /**
   * وظيفة تحديث عدد الدورات المعروضة
   * @param {number} count - العدد الجديد للدورات الظاهرة.
   */
  function updateCourseCount(count) {
    if (courseCountElement) {
      courseCountElement.textContent = count;
    }
  }

  /**
   * وظيفة تطبيق منطق التصفية والبحث
   */
  function filterCourses() {
    let visibleCount = 0;

    // 1. جمع معايير التصفية المحددة
    const activeFilters = {
      field: Array.from(
        document.querySelectorAll(
          '#sidebarFilter input[type="checkbox"]:checked'
        )
      ).map((input) => input.getAttribute("data-filter")),
      level: Array.from(
        document.querySelectorAll('#sidebarFilter input[name="level"]:checked')
      ).map((input) => input.getAttribute("data-filter")),
      type: Array.from(
        document.querySelectorAll('#sidebarFilter input[name="type"]:checked')
      ).map((input) => input.getAttribute("data-filter")),
    };

    const searchTerm = searchInput.value.trim().toLowerCase();

    // 2. تطبيق الفلاتر على كل كارد
    courseCards.forEach((card) => {
      const category = card.getAttribute("data-category").toLowerCase();
      const level = card.getAttribute("data-level");
      const type = card.getAttribute("data-type");
      const title = card
        .querySelector(".course-title")
        .textContent.toLowerCase();
      const description = card
        .querySelector(".course-description")
        .textContent.toLowerCase();

      // أ. فحص البحث النصي
      const matchesSearch =
        searchTerm === "" ||
        title.includes(searchTerm) ||
        description.includes(searchTerm);

      // ب. فحص فلاتر التصنيف (Checkboxes)
      const matchesCategory =
        activeFilters.field.length === 0 ||
        activeFilters.field.some((filter) => category.includes(filter));

      // ج. فحص فلاتر المستوى والنوع (Radio Buttons)
      const matchesLevel =
        activeFilters.level.length === 0 || activeFilters.level.includes(level);

      const matchesType =
        activeFilters.type.length === 0 || activeFilters.type.includes(type);

      // 3. إظهار/إخفاء الكارد
      if (matchesSearch && matchesCategory && matchesLevel && matchesType) {
        card.classList.remove("hidden");
        card.classList.add("visible");
        visibleCount++;
      } else {
        card.classList.remove("visible");
        card.classList.add("hidden");
      }
    });

    // 4. تحديث حالة العداد ورسالة لا توجد نتائج
    updateCourseCount(visibleCount);

    if (visibleCount === 0) {
      noResultsMessage.style.display = "block";
    } else {
      noResultsMessage.style.display = "none";
    }
  }

  // ======================= وظيفة الترتيب (Sorting) =======================

  /**
   * وظيفة ترتيب الدورات
   */
  function sortCourses() {
    const sortOrder = document.getElementById("sortOrder").value;

    let sortedCards = [...courseCards]; // نسخة من المصفوفة الأصلية

    sortedCards.sort((a, b) => {
      if (sortOrder === "newest") {
        // لا يوجد بيانات تاريخ، يمكن افتراض الترتيب الأولي أو لا ترتيب
        return 0;
      } else if (sortOrder === "popular") {
        // ترتيب حسب عدد الإعجابات (افتراضياً الرقم الثاني في course-meta)
        const getLikes = (card) => {
          const text = card.querySelector(
            ".course-meta span:nth-child(2)"
          ).textContent;
          const match = text.match(/(\d+)/);
          return match ? parseInt(match[0]) : 0;
        };
        return getLikes(b) - getLikes(a); // تنازلي (الأكثر أولاً)
      } else if (sortOrder === "price-low") {
        const priceA = parseFloat(a.getAttribute("data-price"));
        const priceB = parseFloat(b.getAttribute("data-price"));
        return priceA - priceB; // تصاعدي (الأقل أولاً)
      } else if (sortOrder === "price-high") {
        const priceA = parseFloat(a.getAttribute("data-price"));
        const priceB = parseFloat(b.getAttribute("data-price"));
        return priceB - priceA; // تنازلي (الأعلى أولاً)
      }
      return 0;
    });

    // إعادة ترتيب العناصر في DOM
    sortedCards.forEach((card) => {
      coursesGrid.appendChild(card);
    });
  }

  // ======================= إدارة الأحداث (Event Listeners) =======================

  // 1. تطبيق الفلاتر عند الضغط على زر "تطبيق الفلاتر"
  if (applyFilterBtn) {
    applyFilterBtn.addEventListener("click", filterCourses);
  }

  // 2. تطبيق البحث عند إدخال النص
  if (searchInput) {
    searchInput.addEventListener("input", filterCourses);
  }

  // 3. إلغاء الفلاتر
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener("click", () => {
      // إلغاء تحديد كل العناصر
      document
        .querySelectorAll("#sidebarFilter input:checked")
        .forEach((input) => {
          input.checked = false;
        });
      searchInput.value = "";
      filterCourses(); // إعادة التصفية بالقيم الافتراضية
    });
  }

  // 4. الترتيب عند تغيير الخيار
  const sortSelect = document.getElementById("sortOrder");
  if (sortSelect) {
    sortSelect.addEventListener("change", sortCourses);
  }

  // تطبيق الفلاتر والترتيب المبدئي عند تحميل الصفحة لأول مرة
  filterCourses();
  sortCourses();

  // ======================= منطق مودال تسجيل الدخول (مطابق لـ index.js) =======================
  const loginModal = document.getElementById("loginModal");
  const openLoginModalBtn = document.getElementById("openLoginModal");
  const closeBtn = document.querySelector(".modal-content .close-btn");

  if (openLoginModalBtn && loginModal && closeBtn) {
    // فتح المودال عند الضغط على الأيقونة
    openLoginModalBtn.addEventListener("click", () => {
      loginModal.classList.add("active");
    });

    // إغلاق المودال عند الضغط على زر X
    closeBtn.addEventListener("click", () => {
      loginModal.classList.remove("active");
    });

    // إغلاق المودال عند الضغط خارج نافذة المودال
    window.addEventListener("click", (event) => {
      if (event.target == loginModal) {
        loginModal.classList.remove("active");
      }
    });
  }

  // ======================= إظهار وإخفاء شريط التصفية في الجوال =======================
  if (toggleFilterBtn && sidebarFilter) {
    toggleFilterBtn.addEventListener("click", () => {
      sidebarFilter.classList.toggle("is-active");

      // تغيير نص الزر والأيقونة بناءً على الحالة
      if (sidebarFilter.classList.contains("is-active")) {
        toggleFilterBtn.innerHTML =
          '<i class="fas fa-times"></i> إخفاء التصفية';
        // إضافة فئة تدوير (اختياري)
      } else {
        toggleFilterBtn.innerHTML = '<i class="fas fa-filter"></i> تصفية';
      }
    });
  }

  // =========================================================
  // 5. حركات الظهور عند التمرير
  // =========================================================

  /**
   * دالة المراقبة لظهور العناصر
   */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null, // المراقبة بالنسبة لـ viewport
      rootMargin: "0px",
      threshold: 0.1, // يبدأ الحركة عندما يكون 10% من العنصر مرئيًا
    }
  );

  // مراقبة كاردات الدورات
  courseCards.forEach((card) => {
    observer.observe(card);
  });

  // =========================================================
  // 6. التحكم في الانتقال عبر النافبار وشاشة التحميل
  // (منطابق لـ index.js)
  // =========================================================

  const loadingScreen = document.getElementById("loading-screen");
  // تحديد جميع روابط التنقل التي تقع ضمن فئة 'nav-item'
  const navLinks = document.querySelectorAll(".nav-links a.nav-item");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // تحقق من أن الرابط ليس هو الصفحة الحالية
      if (this.classList.contains("active")) {
        e.preventDefault();
        return;
      }

      e.preventDefault(); // منع الانتقال الافتراضي فوراً

      const targetUrl = this.href;

      // أ. إظهار شاشة التحميل
      loadingScreen.classList.add("is-active");

      // ب. تحديد مدة زمنية وهمية للتحميل (1 ثانية لصفحة الدورات)
      setTimeout(() => {
        // ج. التوجيه إلى الصفحة الجديدة بعد انتهاء الوقت
        window.location.href = targetUrl;
      }, 1000); // 1000 مللي ثانية = 1 ثانية
    });
  });

  // =========================================================
  // 7. إخفاء شاشة التحميل عند تحميل محتوى الصفحة الجديدة
  // =========================================================

  // هذه الوظيفة تضمن إخفاء شاشة التحميل بمجرد اكتمال تحميل محتوى الصفحة
  window.addEventListener("load", () => {
    // تأخير بسيط لضمان رؤية شاشة التحميل للحظات
    setTimeout(() => {
      loadingScreen.classList.remove("is-active");
    }, 100);
  });
});
