document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 بدء تحميل صفحة أوراق العمل...");

  // ======================= تهيئة Supabase =======================
  const SUPABASE_URL = "https://ujbwtefoxgzjdtcrgfhp.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqYnd0ZWZveGd6amR0Y3JnZmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3ODgxMzIsImV4cCI6MjA4MTM2NDEzMn0.p5mLeDn6QCJTiiV_1cx14L_eYaGBRn0BkKsLeh5my30";

  console.log("📡 تهيئة اتصال Supabase...");
  const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  let currentUser = null;

  // ======================= نظام الإشعارات =======================
  function showNotification(message, type = "success") {
    console.log(`📢 إشعار [${type}]: ${message}`);
    const notification = document.getElementById("notification");
    const notificationText = notification.querySelector(".notification-text");

    notification.className = `notification ${type}`;
    notificationText.textContent = message;

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

    setTimeout(() => {
      notification.classList.remove("show");
    }, 4000);
  }

  // ======================= شاشة التحميل =======================
  function showLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      console.log("⏳ عرض شاشة التحميل...");
      loadingScreen.classList.add("is-active");
    }
  }

  function hideLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      console.log("✅ إخفاء شاشة التحميل...");
      loadingScreen.classList.remove("is-active");
    }
  }

  // ======================= نظام المستخدم =======================
  async function checkAuth() {
    try {
      console.log("🔍 فحص تخزين المستخدم المحلي...");
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        console.log("👤 تم العثور على مستخدم في التخزين المحلي");
        currentUser = JSON.parse(storedUser);

        // التحقق من أن المستخدم له id
        if (!currentUser.id) {
          console.warn(
            "⚠️ المستخدم المخزن محلياً لا يحتوي على ID، سيتم تسجيل الخروج"
          );
          updateUIForLoggedOutUser();
          return false;
        }

        // محاولة التحقق من قاعدة البيانات
        try {
          const { data: userFromDB, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", currentUser.id)
            .single();

          if (error || !userFromDB) {
            console.warn(
              "⚠️ المستخدم غير موجود في قاعدة البيانات، سيتم تسجيل الخروج"
            );
            updateUIForLoggedOutUser();
            return false;
          }

          // تحديث بيانات المستخدم من قاعدة البيانات
          currentUser = { ...currentUser, ...userFromDB };
          localStorage.setItem("user", JSON.stringify(currentUser));
        } catch (dbError) {
          console.warn(
            "⚠️ لا يمكن الاتصال بقاعدة البيانات للتحقق:",
            dbError.message
          );
          // نستمر باستخدام البيانات المحلية
        }

        await updateUIForLoggedInUser();
        return true;
      }

      console.log("👤 لا يوجد مستخدم مسجل");
      updateUIForLoggedOutUser();
      return false;
    } catch (error) {
      console.error("❌ خطأ في التحقق من المصادقة:", error);
      updateUIForLoggedOutUser();
      return false;
    }
  }

  async function updateUIForLoggedInUser() {
    console.log("🎨 تحديث الواجهة للمستخدم المسجل...");
    const guestUser = document.getElementById("guestUser");
    const loggedInUser = document.getElementById("loggedInUser");
    const ctaButton = document.getElementById("ctaButton");

    if (guestUser) guestUser.style.display = "none";
    if (loggedInUser) loggedInUser.style.display = "flex";

    const displayUserName = document.getElementById("displayUserName");
    const dropdownUserName = document.getElementById("dropdownUserName");
    const dropdownUserEmail = document.getElementById("dropdownUserEmail");
    const userAvatar = document.getElementById("currentUserAvatar");
    const dropdownAvatar = document.getElementById("dropdownAvatar");

    if (currentUser) {
      console.log(`👋 تحديث بيانات المستخدم: ${currentUser.full_name}`);

      if (displayUserName) displayUserName.textContent = currentUser.full_name;
      if (dropdownUserName)
        dropdownUserName.textContent = currentUser.full_name;
      if (dropdownUserEmail)
        dropdownUserEmail.textContent =
          currentUser.email || currentUser.phone + "@temp.com";

      const avatarSrc = currentUser.avatar || "11.svg";
      if (userAvatar) userAvatar.src = avatarSrc;
      if (dropdownAvatar) dropdownAvatar.src = avatarSrc;
    }

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

    initDropdown();
  }

  function updateUIForLoggedOutUser() {
    console.log("🎨 تحديث الواجهة للمستخدم غير المسجل...");
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

    if (!userProfileBtn || !dropdownMenu) {
      console.warn("⚠️ عناصر Dropdown غير موجودة");
      return;
    }

    userProfileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isActive = userProfileBtn.classList.contains("active");
      closeAllDropdowns();
      if (!isActive) {
        userProfileBtn.classList.add("active");
        dropdownMenu.classList.add("active");
        console.log("📂 فتح قائمة Dropdown");
      }
    });

    document.addEventListener("click", (e) => {
      if (
        !userProfileBtn.contains(e.target) &&
        !dropdownMenu.contains(e.target)
      ) {
        closeAllDropdowns();
      }
    });

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

  // ======================= نظام المودالات =======================
  function initModals() {
    console.log("🗂️ تهيئة نظام المودالات...");

    // إعداد جميع أزرار الإغلاق (X)
    const closeBtns = document.querySelectorAll(".close-btn");
    closeBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        console.log("❌ النقر على زر الإغلاق");
        // إغلاق المودال الأقرب
        const modal = this.closest(".modal");
        if (modal) {
          closeModal(modal);
        }
      });
    });

    // مودال تسجيل الدخول والتسجيل
    const loginModal = document.getElementById("loginModal");
    const openLoginBtn = document.getElementById("openLoginModalBtn");

    // فتح مودال تسجيل الدخول
    if (openLoginBtn) {
      openLoginBtn.addEventListener("click", () => {
        if (currentUser) {
          showNotification("أنت مسجل الدخول بالفعل!", "info");
          return;
        }
        console.log("🔓 فتح مودال تسجيل الدخول والتسجيل");
        openModal(loginModal);

        // إظهار نموذج تسجيل الدخول افتراضياً
        showLoginForm();
      });
    } else {
      console.warn("⚠️ زر فتح مودال تسجيل الدخول غير موجود");
    }

    // إغلاق عند النقر خارج المودال
    window.addEventListener("click", (event) => {
      if (event.target.classList.contains("modal")) {
        console.log("📌 النقر خارج المودال، إغلاقه");
        closeModal(event.target);
      }
    });

    // أزرار التبديل بين التسجيل وتسجيل الدخول
    const showLoginBtn = document.getElementById("showLoginBtn");
    const showRegisterBtn = document.getElementById("showRegisterBtn");

    if (showLoginBtn) {
      showLoginBtn.addEventListener("click", showLoginForm);
    }

    if (showRegisterBtn) {
      showRegisterBtn.addEventListener("click", showRegisterForm);
    }

    // مودال الإعدادات
    const settingsModal = document.getElementById("settingsModal");
    const openSettingsBtn = document.getElementById("openSettingsModalBtn");

    if (openSettingsBtn) {
      openSettingsBtn.addEventListener("click", () => {
        if (!currentUser) {
          showNotification("يجب تسجيل الدخول أولاً!", "error");
          return;
        }
        console.log("⚙️ فتح مودال الإعدادات");
        openSettingsModal();
      });
    }

    // مستمعين للنماذج
    const registerFormElement = document.getElementById("registerFormElement");
    const loginFormElement = document.getElementById("loginFormElement");
    const saveSettingsBtn = document.getElementById("saveSettingsBtn");

    if (registerFormElement) {
      console.log("✅ إعداد نموذج التسجيل");
      registerFormElement.addEventListener("submit", handleRegister);
    } else {
      console.warn("⚠️ نموذج التسجيل غير موجود");
    }

    if (loginFormElement) {
      console.log("✅ إعداد نموذج تسجيل الدخول");
      loginFormElement.addEventListener("submit", handleLogin);
    } else {
      console.warn("⚠️ نموذج تسجيل الدخول غير موجود");
    }

    if (saveSettingsBtn) {
      console.log("✅ إعداد زر حفظ الإعدادات");
      saveSettingsBtn.addEventListener("click", handleSaveSettings);
    } else {
      console.warn("⚠️ زر حفظ الإعدادات غير موجود");
    }

    console.log("✅ تم تهيئة جميع المودالات");
  }

  // ======================= وظائف المودالات =======================
  function openModal(modal) {
    if (!modal) {
      console.warn("⚠️ محاولة فتح مودال غير موجود");
      return;
    }

    console.log(`📂 فتح مودال: ${modal.id}`);
    modal.classList.add("active");
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";
  }

  function closeModal(modal) {
    if (!modal) {
      console.warn("⚠️ محاولة إغلاق مودال غير موجود");
      return;
    }

    console.log(`📂 إغلاق مودال: ${modal.id}`);
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "auto";
  }

  // ======================= وظائف التبديل بين التسجيل والدخول =======================
  function showLoginForm() {
    console.log("🔐 إظهار نموذج تسجيل الدخول");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const showLoginBtn = document.getElementById("showLoginBtn");
    const showRegisterBtn = document.getElementById("showRegisterBtn");

    if (loginForm) loginForm.style.display = "block";
    if (registerForm) registerForm.style.display = "none";

    // تحديث حالة الأزرار
    if (showLoginBtn) showLoginBtn.classList.add("active");
    if (showRegisterBtn) showRegisterBtn.classList.remove("active");
  }

  function showRegisterForm() {
    console.log("📝 إظهار نموذج التسجيل");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const showLoginBtn = document.getElementById("showLoginBtn");
    const showRegisterBtn = document.getElementById("showRegisterBtn");

    if (loginForm) loginForm.style.display = "none";
    if (registerForm) registerForm.style.display = "block";

    // تحديث حالة الأزرار
    if (showLoginBtn) showLoginBtn.classList.remove("active");
    if (showRegisterBtn) showRegisterBtn.classList.add("active");
  }

  // ======================= فتح مودال الإعدادات =======================
  async function openSettingsModal() {
    if (!currentUser) {
      console.warn("⚠️ محاولة فتح الإعدادات بدون مستخدم");
      return;
    }

    console.log(`⚙️ تحميل إعدادات المستخدم: ${currentUser.full_name}`);

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
      option.classList.remove("selected");
      const avatarSrc = option.getAttribute("data-avatar");
      if (avatarSrc === currentUser.avatar) {
        option.classList.add("selected");
      }
    });

    // إعداد رفع الصورة
    const avatarUpload = document.getElementById("avatarUpload");
    const avatarUploadContainer = document.querySelector(
      ".avatar-upload-container"
    );

    if (avatarUpload && avatarUploadContainer) {
      // إزالة المستمعين القديمين لمنع التكرار
      const newContainer = avatarUploadContainer.cloneNode(true);
      avatarUploadContainer.parentNode.replaceChild(
        newContainer,
        avatarUploadContainer
      );

      const newUpload = document.getElementById("avatarUpload");

      newContainer.addEventListener("click", () => {
        console.log("🖼️ فتح نافذة اختيار الصورة");
        newUpload.click();
      });

      newUpload.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        console.log(`📄 محاولة رفع ملف: ${file?.name}`);

        if (file && file.size < 5 * 1024 * 1024) {
          if (!file.type.startsWith("image/")) {
            showNotification("الرجاء رفع صورة فقط!", "error");
            return;
          }

          try {
            showLoadingScreen();
            console.log("⬆️ بدء رفع الصورة إلى Supabase Storage...");

            // رفع الصورة إلى Supabase Storage
            const fileExt = file.name.split(".").pop();
            const fileName = `${currentUser.id}_${Date.now()}.${fileExt}`;

            const { data, error } = await supabase.storage
              .from("avatars")
              .upload(`public/${fileName}`, file, {
                cacheControl: "3600",
                upsert: true,
              });

            if (error) throw error;
            console.log("✅ تم رفع الصورة بنجاح");

            // الحصول على رابط الصورة
            const {
              data: { publicUrl },
            } = supabase.storage
              .from("avatars")
              .getPublicUrl(`public/${fileName}`);

            console.log(`🔗 رابط الصورة: ${publicUrl}`);

            // تحديث المستخدم في قاعدة البيانات
            const { error: updateError } = await supabase
              .from("users")
              .update({ avatar: publicUrl })
              .eq("id", currentUser.id);

            if (updateError) throw updateError;
            console.log("✅ تم تحديث بيانات المستخدم في قاعدة البيانات");

            // تحديث بيانات المستخدم الحالي
            currentUser.avatar = publicUrl;
            localStorage.setItem("user", JSON.stringify(currentUser));

            // تحديث الصورة في الواجهة
            avatarPreview.src = publicUrl;

            showNotification("تم رفع وتحديث الصورة بنجاح!", "success");
          } catch (error) {
            console.error("❌ خطأ في رفع الصورة:", error);
            showNotification("فشل رفع الصورة!", "error");
          } finally {
            hideLoadingScreen();
          }
        } else {
          showNotification("حجم الصورة كبير جداً! الحد الأقصى 5MB", "error");
        }
      });
    }

    // إضافة مستمعين للصور المحددة مسبقاً
    avatarOptions.forEach((option) => {
      option.addEventListener("click", function () {
        const avatarSrc = this.getAttribute("data-avatar");
        console.log(`🖼️ اختيار صورة: ${avatarSrc}`);

        // إزالة التحديد من الجميع
        avatarOptions.forEach((opt) => opt.classList.remove("selected"));

        // إضافة التحديد للصورة المختارة
        this.classList.add("selected");

        // حفظ الصورة المختارة مؤقتاً
        window.selectedAvatar = avatarSrc;
      });
    });

    openModal(document.getElementById("settingsModal"));
  }

  function closeSettingsModal() {
    closeModal(document.getElementById("settingsModal"));
  }

  // ======================= معالجة التسجيل =======================
  async function handleRegister(e) {
    e.preventDefault();
    console.log("📝 بدء عملية التسجيل...");

    const fullName = document.getElementById("registerFullName").value;
    const phone = document.getElementById("registerPhone").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const securityCode = document.getElementById("registerSecurityCode").value;
    const submitBtn = document.getElementById("registerSubmitBtn");

    console.log("📋 بيانات التسجيل:", {
      fullName,
      phone,
      email,
      password: "******",
      securityCode,
    });

    // التحقق من البيانات
    if (!fullName || !phone || !password || !securityCode) {
      console.warn("⚠️ حقل مطلوب مفقود");
      showNotification("يرجى ملء جميع الحقول المطلوبة!", "error");
      return;
    }

    if (securityCode !== "909090") {
      console.warn("⚠️ رمز الأمان غير صحيح");
      showNotification("رمز الأمان غير صحيح!", "error");
      return;
    }

    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(phone)) {
      console.warn("⚠️ رقم الجوال غير صحيح:", phone);
      showNotification("يرجى إدخال رقم جوال صحيح!", "error");
      return;
    }

    if (password.length < 6) {
      console.warn("⚠️ كلمة المرور قصيرة:", password.length);
      showNotification("كلمة المرور يجب أن تكون 6 أحرف على الأقل!", "error");
      return;
    }

    try {
      // عرض حالة التحميل
      submitBtn.classList.add("loading");
      submitBtn.disabled = true;
      console.log("⏳ التحقق من رقم الجوال في قاعدة البيانات...");

      // التحقق من عدم وجود مستخدم بنفس الرقم
      const { data: existingUsers, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("phone", phone);

      if (checkError) {
        console.error("❌ خطأ في التحقق من رقم الجوال:", checkError);
        throw checkError;
      }

      if (existingUsers && existingUsers.length > 0) {
        console.warn("⚠️ رقم الجوال مسجل بالفعل:", phone);
        showNotification("رقم الجوال مسجل بالفعل! يرجى تسجيل الدخول.", "error");
        showLoginForm();
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
      };

      console.log("⬆️ محاولة حفظ المستخدم في Supabase:", userData);

      // حفظ المستخدم في Supabase
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([userData])
        .select()
        .single(); // مهم: .single() لجلب سجل واحد فقط

      if (insertError) {
        console.error("❌ خطأ في إدراج المستخدم:", insertError);
        throw insertError;
      }

      console.log("✅ تم إنشاء المستخدم في Supabase:", newUser);

      if (!newUser || !newUser.id) {
        throw new Error("لم يتم إنشاء المستخدم بشكل صحيح في قاعدة البيانات");
      }

      // حفظ المستخدم الحالي
      currentUser = newUser;
      localStorage.setItem("user", JSON.stringify(currentUser));
      console.log("💾 تم حفظ المستخدم في التخزين المحلي");

      // تحديث الواجهة
      await updateUIForLoggedInUser();

      // إغلاق المودال
      closeModal(document.getElementById("loginModal"));

      showNotification(
        `🎉 مرحباً ${fullName}! تم إنشاء حسابك بنجاح.`,
        "success"
      );
    } catch (error) {
      console.error("❌ فشل التسجيل بالتفصيل:", error);

      let errorMessage = "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";

      if (error.code === "23505") {
        errorMessage = "رقم الجوال مسجل بالفعل! يرجى تسجيل الدخول.";
      } else if (error.message.includes("violates check constraint")) {
        errorMessage = "رقم الجوال غير صحيح! يجب أن يبدأ بـ 05 ويحتوي 10 أرقام";
      } else if (error.message.includes("duplicate key")) {
        errorMessage = "رقم الجوال مسجل بالفعل!";
      }

      showNotification(errorMessage, "error");
    } finally {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  }

  // ======================= معالجة تسجيل الدخول =======================
  async function handleLogin(e) {
    e.preventDefault();
    console.log("🔐 بدء عملية تسجيل الدخول...");

    const phone = document.getElementById("loginPhone").value;
    const password = document.getElementById("loginPassword").value;
    const securityCode = document.getElementById("loginSecurityCode").value;
    const submitBtn = document.getElementById("loginSubmitBtn");

    console.log("📋 بيانات تسجيل الدخول:", {
      phone,
      password: "******",
      securityCode,
    });

    if (!phone || !password || !securityCode) {
      console.warn("⚠️ حقل مطلوب مفقود في تسجيل الدخول");
      showNotification("يرجى ملء جميع الحقول!", "error");
      return;
    }

    if (securityCode !== "909090") {
      console.warn("⚠️ رمز الأمان غير صحيح في تسجيل الدخول");
      showNotification("رمز الأمان غير صحيح!", "error");
      return;
    }

    try {
      submitBtn.classList.add("loading");
      submitBtn.disabled = true;
      console.log("🔍 البحث عن المستخدم في قاعدة البيانات...");

      // البحث في Supabase
      const { data: users, error } = await supabase
        .from("users")
        .select("*")
        .eq("phone", phone)
        .eq("password", password)
        .eq("security_code", securityCode);

      if (error) {
        console.error("❌ خطأ في البحث عن المستخدم:", error);
        throw error;
      }

      console.log("📊 نتيجة البحث عن المستخدم:", users);

      if (!users || users.length === 0) {
        console.warn("⚠️ بيانات الدخول غير صحيحة");
        showNotification("بيانات الدخول غير صحيحة!", "error");
        return;
      }

      const foundUser = users[0];
      console.log("✅ تم العثور على المستخدم:", foundUser);

      currentUser = foundUser;
      localStorage.setItem("user", JSON.stringify(currentUser));
      console.log("💾 تم حفظ المستخدم في التخزين المحلي");

      await updateUIForLoggedInUser();
      closeModal(document.getElementById("loginModal"));

      showNotification(`🎉 مرحباً بعودتك ${currentUser.full_name}!`, "success");
    } catch (error) {
      console.error("❌ فشل تسجيل الدخول بالتفصيل:", error);
      showNotification("حدث خطأ أثناء تسجيل الدخول.", "error");
    } finally {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  }

  // ======================= حفظ الإعدادات =======================
  async function handleSaveSettings() {
    console.log("💾 بدء حفظ الإعدادات...");

    const fullName = document.getElementById("settingsFullName").value;
    const phone = document.getElementById("settingsPhone").value;
    const email = document.getElementById("settingsEmail").value;
    const password = document.getElementById("settingsPassword").value;
    const selectedAvatar =
      window.selectedAvatar ||
      document
        .querySelector(".avatar-option.selected")
        ?.getAttribute("data-avatar") ||
      currentUser.avatar;

    console.log("📋 بيانات الإعدادات:", {
      fullName,
      phone,
      email,
      hasPassword: !!password,
      selectedAvatar,
    });

    if (!fullName || !phone) {
      console.warn("⚠️ الاسم ورقم الجوال مطلوبان");
      showNotification("الاسم ورقم الجوال مطلوبان!", "error");
      return;
    }

    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(phone)) {
      console.warn("⚠️ رقم الجوال غير صحيح:", phone);
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
        console.log("🔑 تم تضمين تحديث كلمة المرور");
      }

      console.log("⬆️ محاولة تحديث بيانات المستخدم في Supabase:", updatedUser);

      // تحديث في Supabase
      const { error } = await supabase
        .from("users")
        .update(updatedUser)
        .eq("id", currentUser.id);

      if (error) {
        console.error("❌ خطأ في تحديث بيانات المستخدم:", error);
        throw error;
      }

      console.log("✅ تم تحديث بيانات المستخدم في Supabase");

      // حفظ المستخدم الحالي
      currentUser = updatedUser;
      localStorage.setItem("user", JSON.stringify(currentUser));
      console.log("💾 تم تحديث المستخدم في التخزين المحلي");

      // تحديث الواجهة
      await updateUIForLoggedInUser();

      closeSettingsModal();
      showNotification("✅ تم تحديث بياناتك بنجاح!", "success");
    } catch (error) {
      console.error("❌ فشل تحديث البيانات:", error);
      showNotification("حدث خطأ أثناء تحديث البيانات!", "error");
    }
  }

  // ======================= تسجيل الخروج =======================
  window.logout = function () {
    console.log("🚪 تسجيل خروج المستخدم...");
    hideLogoutConfirm();
    updateUIForLoggedOutUser();
    showNotification("✅ تم تسجيل الخروج بنجاح.", "success");
  };

  window.showLogoutConfirm = function () {
    console.log("❓ عرض تأكيد تسجيل الخروج...");
    closeAllDropdowns();
    document.getElementById("logoutConfirmModal")?.classList.add("active");
  };

  window.hideLogoutConfirm = function () {
    console.log("❌ إخفاء تأكيد تسجيل الخروج...");
    document.getElementById("logoutConfirmModal")?.classList.remove("active");
  };

  // ======================= وظائف إضافية للتصحيح =======================
  window.openSettingsModal = openSettingsModal;
  window.closeSettingsModal = closeSettingsModal;

  // ======================= نظام البحث والتصفية لأوراق العمل =======================
  const worksheetsGrid = document.getElementById("worksheetsGrid");
  const worksheetCards = worksheetsGrid
    ? Array.from(worksheetsGrid.querySelectorAll(".worksheet-card"))
    : [];
  const worksheetCountElement = document.getElementById("worksheetCount");
  const noResultsElement = document.getElementById("noResults");
  const searchInput = document.getElementById("worksheetSearch");
  const gradeFilter = document.getElementById("gradeFilter");
  const subjectFilter = document.getElementById("subjectFilter");
  const semesterFilter = document.getElementById("semesterFilter");
  const typeFilter = document.getElementById("typeFilter");
  const filterTags = document.querySelectorAll(".filter-tag");
  const resetFiltersBtn = document.getElementById("resetFiltersBtn");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const viewButtons = document.querySelectorAll(".view-btn");

  // تحديث عدد أوراق العمل
  function updateWorksheetCount(count) {
    if (worksheetCountElement) {
      worksheetCountElement.textContent = count;
    }
  }

  // وظيفة التصفية والبحث
  function filterWorksheets() {
    console.log("🔍 تطبيق التصفية والبحث...");
    let visibleCount = 0;

    // جمع معايير التصفية
    const activeFilters = {
      grade: gradeFilter.value,
      subject: subjectFilter.value,
      semester: semesterFilter.value,
      type: typeFilter.value,
    };

    const searchTerm = searchInput
      ? searchInput.value.trim().toLowerCase()
      : "";
    const activeTag =
      document.querySelector(".filter-tag.active")?.dataset.filter;

    // تطبيق الفلاتر على كل كارد
    worksheetCards.forEach((card) => {
      const cardGrade = card.getAttribute("data-grade");
      const cardSubject = card.getAttribute("data-subject");
      const cardSemester = card.getAttribute("data-semester");
      const cardType = card.getAttribute("data-type");
      const cardLessons = card.getAttribute("data-lessons") || "";
      const title =
        card.querySelector(".worksheet-title")?.textContent.toLowerCase() || "";
      const gradeText =
        card.querySelector(".grade-badge")?.textContent.toLowerCase() || "";
      const subjectText =
        card.querySelector(".subject-badge")?.textContent.toLowerCase() || "";

      // فحص البحث النصي
      const matchesSearch =
        searchTerm === "" ||
        title.includes(searchTerm) ||
        cardLessons.toLowerCase().includes(searchTerm) ||
        gradeText.includes(searchTerm) ||
        subjectText.includes(searchTerm);

      // فحص الفلاتر
      const matchesGrade =
        !activeFilters.grade || activeFilters.grade === cardGrade;
      const matchesSubject =
        !activeFilters.subject || activeFilters.subject === cardSubject;
      const matchesSemester =
        !activeFilters.semester || activeFilters.semester === cardSemester;
      const matchesType =
        !activeFilters.type || activeFilters.type === cardType;

      // فحص التصفية السريعة
      let matchesTag = true;
      if (activeTag && activeTag !== "all") {
        if (activeTag === "new") {
          // يمكن إضافة منطق للجديد
        } else if (activeTag === "popular") {
          // يمكن إضافة منطق للأكثر تحميلاً
        } else if (activeTag === "midterm") {
          matchesTag = cardType === "midterm";
        } else if (activeTag === "final") {
          matchesTag = cardType === "final";
        }
      }

      // إظهار/إخفاء الكارد
      if (
        matchesSearch &&
        matchesGrade &&
        matchesSubject &&
        matchesSemester &&
        matchesType &&
        matchesTag
      ) {
        card.style.display = "flex";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    // تحديث العداد ورسالة عدم وجود نتائج
    updateWorksheetCount(visibleCount);
    if (visibleCount === 0) {
      noResultsElement.style.display = "flex";
      worksheetsGrid.style.display = "none";
    } else {
      noResultsElement.style.display = "none";
      worksheetsGrid.style.display = "grid";
    }

    // إضافة حركات الظهور للكروت الجديدة
    animateVisibleCards();
  }

  // حركات الظهور للكروت
  function animateVisibleCards() {
    const visibleCards = Array.from(worksheetCards).filter(
      (card) => card.style.display !== "none"
    );

    visibleCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.remove("animated");
      void card.offsetWidth; // إعادة التدفق للقوة
      card.classList.add("animated");
    });
  }

  // إعادة تعيين الفلاتر
  function resetFilters() {
    console.log("🔄 إعادة تعيين جميع الفلاتر...");

    if (searchInput) searchInput.value = "";
    if (gradeFilter) gradeFilter.value = "";
    if (subjectFilter) subjectFilter.value = "";
    if (semesterFilter) semesterFilter.value = "";
    if (typeFilter) typeFilter.value = "";

    // إعادة تعيين التصنيفات السريعة
    filterTags.forEach((tag) => {
      tag.classList.remove("active");
      if (tag.dataset.filter === "all") {
        tag.classList.add("active");
      }
    });

    filterWorksheets();
    showNotification("تم إعادة تعيين الفلاتر", "info");
  }

  // تغيير طريقة العرض (شبكة/قائمة)
  function changeViewMode(viewMode) {
    console.log(`👁️ تغيير طريقة العرض إلى: ${viewMode}`);

    if (viewMode === "list") {
      worksheetsGrid.classList.add("list-view");
      worksheetsGrid.classList.remove("grid-view");
    } else {
      worksheetsGrid.classList.add("grid-view");
      worksheetsGrid.classList.remove("list-view");
    }

    // تحديث حالة الأزرار
    viewButtons.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.dataset.view === viewMode) {
        btn.classList.add("active");
      }
    });
  }

  // فتح معاينة ورقة العمل
  function openWorksheetPreview(worksheetId) {
    console.log(`👁️ فتح معاينة ورقة العمل: ${worksheetId}`);

    // هنا يمكن فتح نافذة معاينة أو توجيه إلى رابط
    // حالياً نفتح رابط افتراضي (يمكن تغييره لاحقاً)
    window.open(
      `https://drive.google.com/viewer?url=SAMPLE_URL_${worksheetId}`,
      "_blank"
    );

    showNotification("جاري فتح معاينة ورقة العمل...", "info");
  }

  // إعداد مستمعي الأحداث
  function initEventListeners() {
    console.log("🎯 تهيئة مستمعي الأحداث...");

    // البحث
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        console.log("🔍 تغيير نص البحث");
        filterWorksheets();
      });
    }

    // الفلاتر
    if (gradeFilter) gradeFilter.addEventListener("change", filterWorksheets);
    if (subjectFilter)
      subjectFilter.addEventListener("change", filterWorksheets);
    if (semesterFilter)
      semesterFilter.addEventListener("change", filterWorksheets);
    if (typeFilter) typeFilter.addEventListener("change", filterWorksheets);

    // التصنيفات السريعة
    filterTags.forEach((tag) => {
      tag.addEventListener("click", function () {
        console.log(`🏷️ اختيار تصنيف: ${this.dataset.filter}`);
        filterTags.forEach((t) => t.classList.remove("active"));
        this.classList.add("active");
        filterWorksheets();
      });
    });

    // إعادة تعيين الفلاتر
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener("click", resetFilters);
    }

    // تحميل المزيد
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        console.log("📥 تحميل المزيد من أوراق العمل");
        showNotification("جاري تحميل المزيد من أوراق العمل...", "info");
        // هنا يمكن إضافة منطق لتحميل المزيد من البطاقات
      });
    }

    // تغيير طريقة العرض
    viewButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        changeViewMode(this.dataset.view);
      });
    });

    // أزرار معاينة أوراق العمل
    const previewButtons = document.querySelectorAll(".preview-btn");
    previewButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        const worksheetId = this.getAttribute("data-worksheet-id");
        openWorksheetPreview(worksheetId);
      });
    });
  }

  // ======================= نظام الانتقال =======================
  function initNavigation() {
    console.log("🧭 تهيئة نظام الانتقال...");
    const loadingScreen = document.getElementById("loading-screen");
    const navLinks = document.querySelectorAll(".nav-links a.nav-item");

    if (navLinks.length === 0) {
      console.warn("⚠️ لا توجد روابط تنقل للتهيئة");
      return;
    }

    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        if (this.classList.contains("active")) {
          e.preventDefault();
          return;
        }

        e.preventDefault();
        const targetUrl = this.href;
        console.log(`➡️ الانتقال إلى: ${targetUrl}`);

        if (loadingScreen) {
          loadingScreen.classList.add("is-active");
        }

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

  // ======================= تهيئة النظام =======================
  async function initSummariesPage() {
    console.log("🔄 تهيئة صفحة أوراق العمل...");
    showLoadingScreen();

    try {
      console.log("🔐 التحقق من تسجيل الدخول...");
      const isAuthenticated = await checkAuth();
      console.log(`✅ حالة المصادقة: ${isAuthenticated ? "مسجل" : "غير مسجل"}`);

      console.log("🎨 تهيئة المكونات...");
      initModals();
      initNavigation();
      initEventListeners();

      // التصفية الأولية
      filterWorksheets();

      // إضافة CSS للعرض القائم إذا لزم
      const style = document.createElement("style");
      style.textContent = `
        .worksheets-grid.list-view {
          grid-template-columns: 1fr !important;
        }
        .worksheets-grid.list-view .worksheet-card {
          flex-direction: row !important;
          max-width: 100% !important;
        }
        .worksheets-grid.list-view .card-content {
          flex: 2 !important;
        }
        .worksheets-grid.list-view .paper-icon {
          margin-bottom: 0 !important;
        }
      `;
      document.head.appendChild(style);

      console.log("✅ تم تحميل صفحة أوراق العمل بنجاح!");
      console.log(`📊 عدد أوراق العمل: ${worksheetCards.length}`);
    } catch (error) {
      console.error("❌ خطأ في تهيئة الصفحة:", error);
      showNotification("حدث خطأ في تحميل الصفحة", "error");
    } finally {
      hideLoadingScreen();
    }
  }

  // بدء تشغيل الصفحة
  initSummariesPage();
});
