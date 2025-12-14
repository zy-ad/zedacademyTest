document.addEventListener("DOMContentLoaded", () => {
  // 1. عناصر الصفحة الأساسية
  const gradeSelect = document.getElementById("gradeSelect");
  const subjectSelect = document.getElementById("subjectSelect");
  const lessonSelect = document.getElementById("lessonSelect"); // العنصر الجديد
  const applyFilterBtn = document.getElementById("applyFilterBtn");
  const searchInput = document.getElementById("summarySearchInput");
  const summariesGrid = document.getElementById("summariesGrid");
  const summaryCards = Array.from(
    summariesGrid.querySelectorAll(".summary-card")
  );
  const summaryCountElement = document.getElementById("summaryCount");
  const noResultsMessage = document.getElementById("noResults");

  // 2. هيكلة بيانات المنهج السعودي (محاكاة)
  const curriculumData = {
    "grade-1": {
      subjects: {
        math: {
          text: "الرياضيات 1-1",
          lessons: [
            { value: "lesson-1-1", text: "الدوال المثلثية" },
            { value: "lesson-1-2", text: "حل المعادلات" },
          ],
        },
        physics: {
          text: "الفيزياء 1-1",
          lessons: [
            { value: "lesson-1-3", text: "الحركة في بعدين" },
            { value: "lesson-1-4", text: "القوى في الأبعاد" },
          ],
        },
        english: {
          text: "اللغة الإنجليزية 1",
          lessons: [
            { value: "lesson-1-5", text: "Unit 1: Grammar" },
            { value: "lesson-1-6", text: "Unit 2: Vocabulary" },
          ],
        },
      },
    },
    "grade-2": {
      subjects: {
        chemistry: {
          text: "الكيمياء 2-1",
          lessons: [
            { value: "lesson-2-1", text: "الهيدروكربونات" },
            { value: "lesson-2-2", text: "تسمية المركبات" },
          ],
        },
        biology: {
          text: "الأحياء 2-1",
          lessons: [
            { value: "lesson-2-3", text: "الخلايا الجذعية" },
            { value: "lesson-2-4", text: "وظائف الأعضاء" },
          ],
        },
        islamic: {
          text: "الدراسات الإسلامية",
          lessons: [
            { value: "lesson-2-5", text: "أحكام الصيام" },
            { value: "lesson-2-6", text: "السيرة النبوية" },
          ],
        },
      },
    },
    "grade-3": {
      subjects: {
        english: {
          text: "اللغة الإنجليزية 3",
          lessons: [
            { value: "lesson-3-1", text: "Unit 3: Grammar" },
            { value: "lesson-3-2", text: "Unit 4: Reading" },
          ],
        },
        critical: {
          text: "التفكير الناقد",
          lessons: [
            { value: "lesson-3-3", text: "مهارة القياس المنطقي" },
            { value: "lesson-3-4", text: "الاستدلال الاستقرائي" },
          ],
        },
        computer: {
          text: "الحاسب الآلي",
          lessons: [
            { value: "lesson-3-5", text: "مقدمة في البرمجة" },
            { value: "lesson-3-6", text: "الأمن السيبراني" },
          ],
        },
      },
    },
  };

  // 3. وظائف تحديث القوائم المنسدلة

  /**
   * تحديث قائمة المواد المنسدلة بناءً على الصف المختار.
   */
  function updateSubjectOptions() {
    const selectedGrade = gradeSelect.value;
    subjectSelect.innerHTML = '<option value="">اختر المادة...</option>';
    lessonSelect.innerHTML = '<option value="">اختر الدرس...</option>';
    subjectSelect.disabled = true;
    lessonSelect.disabled = true;
    applyFilterBtn.disabled = true;

    if (selectedGrade && curriculumData[selectedGrade]) {
      const subjects = curriculumData[selectedGrade].subjects;
      for (const key in subjects) {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = subjects[key].text;
        subjectSelect.appendChild(option);
      }
      subjectSelect.disabled = false;
    }
  }

  /**
   * تحديث قائمة الدروس المنسدلة بناءً على المادة المختارة.
   */
  function updateLessonOptions() {
    const selectedGrade = gradeSelect.value;
    const selectedSubject = subjectSelect.value;
    lessonSelect.innerHTML = '<option value="">اختر الدرس...</option>';
    lessonSelect.disabled = true;

    if (
      selectedGrade &&
      selectedSubject &&
      curriculumData[selectedGrade].subjects[selectedSubject]
    ) {
      const lessons =
        curriculumData[selectedGrade].subjects[selectedSubject].lessons;
      lessons.forEach((lesson) => {
        const option = document.createElement("option");
        option.value = lesson.value;
        option.textContent = lesson.text;
        lessonSelect.appendChild(option);
      });
      lessonSelect.disabled = false;
    }
  }

  // 4. وظيفة التصفية والبحث الرئيسية (Live Search & Filter)

  function filterSummaries() {
    const selectedGrade = gradeSelect.value;
    const selectedSubject = subjectSelect.value;
    const selectedLesson = lessonSelect.value;
    const searchTerm = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    summaryCards.forEach((card) => {
      const cardGrade = card.getAttribute("data-grade");
      const cardSubject = card.getAttribute("data-subject");
      const cardLesson = card.getAttribute("data-lesson"); // حقل الدرس الجديد
      const cardText = card.textContent.toLowerCase();

      let matchesFilter = true;
      let matchesSearch = true;

      // أ. التصفية الهرمية
      if (selectedGrade && cardGrade !== selectedGrade) {
        matchesFilter = false;
      }
      if (selectedSubject && cardSubject !== selectedSubject) {
        matchesFilter = false;
      }
      if (selectedLesson && cardLesson !== selectedLesson) {
        // تصفية بالدرس
        matchesFilter = false;
      }

      // ب. البحث المباشر
      if (searchTerm && !cardText.includes(searchTerm)) {
        matchesSearch = false;
      }

      // إظهار أو إخفاء البطاقة
      if (matchesFilter && matchesSearch) {
        card.style.display = "flex";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    // تحديث عدد الملخصات ورسالة عدم النتائج
    summaryCountElement.textContent = visibleCount;
    noResultsMessage.style.display = visibleCount === 0 ? "block" : "none";
  }

  // 5. تفعيل المستمعات (Event Listeners)

  // عند اختيار الصف
  gradeSelect.addEventListener("change", () => {
    updateSubjectOptions();
    updateLessonOptions(); // مسح الدروس
    applyFilterBtn.disabled = true;
    filterSummaries();
  });

  // عند اختيار المادة
  subjectSelect.addEventListener("change", () => {
    updateLessonOptions();
    // تفعيل زر التصفية إذا تم اختيار الصف والمادة
    applyFilterBtn.disabled = !(gradeSelect.value && subjectSelect.value);
    filterSummaries();
  });

  // عند اختيار الدرس
  lessonSelect.addEventListener("change", () => {
    // تفعيل زر التصفية إذا تم اختيار الصف والمادة والدرس
    applyFilterBtn.disabled = !(gradeSelect.value && subjectSelect.value);
    filterSummaries();
  });

  // البحث المباشر (Live Search)
  if (searchInput) {
    searchInput.addEventListener("input", filterSummaries);
  }

  // تفعيل زر "تصفية النتائج"
  applyFilterBtn.addEventListener("click", filterSummaries);

  // تفعيل أزرار المعاينة والتنزيل (إزالة شرط تسجيل الدخول)
  summariesGrid
    .querySelectorAll(".preview-btn, .download-btn")
    .forEach((link) => {
      link.addEventListener("click", (e) => {
        // يتم توجيه المستخدم إلى الرابط المؤقت #preview أو #download
        console.log(
          `جارٍ التوجيه إلى: ${e.currentTarget.getAttribute("href")}`
        );
        // يمكن إضافة تأثير زيادة عدد المعاينات/التنزيلات هنا
      });
    });

  // تطبيق التصفية الأولية عند تحميل الصفحة
  updateSubjectOptions();
  filterSummaries();
});
document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loading-screen");
  // تحديد جميع روابط التنقل التي تقع ضمن فئة 'nav-item'
  const navLinks = document.querySelectorAll(".nav-links a.nav-item");

  // =========================================================
  // 1. التحكم في الانتقال عبر النافبار
  // =========================================================

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

      // ب. تحديد المدة الزمنية للتحميل إلى 500 مللي ثانية (نصف ثانية)
      const loadingDuration = 500;

      setTimeout(() => {
        // ج. التوجيه إلى الصفحة الجديدة بعد انتهاء الوقت
        window.location.href = targetUrl;
      }, loadingDuration);
    });
  });

  // =========================================================
  // 2. إخفاء شاشة التحميل عند تحميل محتوى الصفحة الجديدة
  // =========================================================

  window.addEventListener("load", () => {
    // تأخير بسيط لضمان الإخفاء السلس
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.classList.remove("is-active");
      }
    }, 100);
  });
});
