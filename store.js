// ======================= تهيئة Supabase للمتجر =======================
const SUPABASE_URL = "https://ujbwtefoxgzjdtcrgfhp.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqYnd0ZWZveGd6amR0Y3JnZmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3ODgxMzIsImV4cCI6MjA4MTM2NDEzMn0.p5mLeDn6QCJTiiV_1cx14L_eYaGBRn0BkKsLeh5my30";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ======================= بيانات المنتجات (Mock Data) =======================
const productsData = {
  1: {
    id: 1,
    name: "تصميم موقع شخصي (Portfolio)",
    category: "تصميم مواقع",
    price: 999,
    oldPrice: 1500,
    discount: 34,
    deliveryTime: "7 أيام عمل",
    description:
      "تصميم موقع احترافي يعرض مهاراتك وخبراتك، متجاوب مع جميع الشاشات مع لوحة تحكم عربية كاملة. يشمل نظام إدارة المحتوى وسهولة التحديث.",
    features: [
      "تصميم مخصص لمرة واحدة",
      "صفحة واحدة/مقالات (Blog)",
      "لوحة تحكم عربية متكاملة",
      "دعم فني شهر مجاني",
      "تحسين لمحركات البحث (SEO)",
      "تجاوب مع جميع الأجهزة",
    ],
    images: ["info.svg", "hero1.svg", "hero2.svg", "hero3.svg"],
    rating: 4.5,
    reviews: 45,
    inStock: true,
    support: [
      "دعم فني لمدة 30 يوم",
      "تدريب على استخدام الموقع",
      "تحديثات أمنية مجانية",
      "استضافة مجانية لمدة شهر",
    ],
  },
  2: {
    id: 2,
    name: "تطوير موقع أكاديمية تعليمية (LMS)",
    category: "منصات تعليمية",
    price: 5500,
    oldPrice: 7000,
    discount: 22,
    deliveryTime: "30 يوم عمل",
    description:
      "إنشاء منصة تعليمية متكاملة لبيع الدورات وإدارة الطلاب واختباراتهم مع نظام شهادات متقدم. تدعم الفيديو والصوت والنصوص التفاعلية.",
    features: [
      "نظام إدارة متكامل (LMS)",
      "بوابة دفع متعددة الخيارات",
      "إصدار شهادات تخرج",
      "نظام اختبارات وتقييم",
      "لوحة تحكم للمدرس والطالب",
      "تدريب على الاستخدام لمدة شهر",
    ],
    images: ["chatwep.svg", "course1.svg", "hero1.svg", "hero2.svg"],
    rating: 5.0,
    reviews: 22,
    inStock: true,
    support: [
      "تدريب لمدة 30 يوم",
      "دعم فني لمدة 3 أشهر",
      "تحديثات نظام مجانية",
      "استضافة مجانية لمدة شهرين",
    ],
  },
  3: {
    id: 3,
    name: "إنشاء متجر إلكتروني احترافي",
    category: "تجارة إلكترونية",
    price: 2800,
    oldPrice: 4000,
    discount: 30,
    deliveryTime: "15 يوم عمل",
    description:
      "متجر متكامل، جاهز لقبول المدفوعات والشحن المحلي والدولي مع لوحة تحكم متقدمة. يدعم جميع وسائل الدفع الإلكتروني.",
    features: [
      "تصميم مخصص و 50 منتج",
      "ربط بجميع شركات الشحن",
      "تحسين محركات البحث (SEO)",
      "نظام تقييم المنتجات",
      "إدارة المخزون والمبيعات",
      "تقارير مبيعات متقدمة",
    ],
    images: ["hero3.svg", "info.svg", "course1.svg", "chatwep.svg"],
    rating: 4.5,
    reviews: 98,
    inStock: true,
    support: [
      "دعم فني لمدة 45 يوم",
      "تدريب على إدارة المتجر",
      "تحديثات أمنية مجانية",
      "استضافة مجانية لمدة شهر",
    ],
  },
  4: {
    id: 4,
    name: "تصميم واجهة تسجيل دخول/إنشاء حساب",
    category: "تصميم واجهات",
    price: 850,
    oldPrice: 1200,
    discount: 29,
    deliveryTime: "5 أيام عمل",
    description:
      "تصميم 5 واجهات مختلفة وجذابة (مودال، صفحة كاملة، جانبي) وتسليم ملفات Figma و Sketch مع دعم لأنظمة Dark/Light Mode.",
    features: [
      "5 أنماط تصميم مختلفة",
      "تسليم ملفات Figma & Sketch",
      "دعم لأنظمة Dark/Light Mode",
      "تصميم متجاوب مع جميع الشاشات",
      "أيقونات وخطوط مخصصة",
      "ملفات المصدر كاملة",
    ],
    images: ["hero2.svg", "hero3.svg", "info.svg", "course1.svg"],
    rating: 4.0,
    reviews: 12,
    inStock: true,
    support: [
      "تعديلات مجانية لمدة 7 أيام",
      "تسليم ملفات المصدر",
      "دعم تقني للملفات",
      "شرح تفصيلي للاستخدام",
    ],
  },
  5: {
    id: 5,
    name: "بناء موقع فاخر لشركة ناشئة",
    category: "تصميم مواقع",
    price: 6500,
    oldPrice: 8000,
    discount: 19,
    deliveryTime: "25 يوم عمل",
    description:
      "تصميم موقع يعتمد على المينيمالية والحركات المتقدمة (Motion Graphics) ليناسب الهوية الفاخرة للشركات الناشئة.",
    features: [
      "تصميم 6-8 صفحات مخصصة",
      "30 ثانية Motion Graphics متحركة",
      "ضمان 3 أشهر على الكود",
      "تحسين سرعة متقدم",
      "تصميم متجاوب وفاخر",
      "لوحة تحكم متقدمة",
    ],
    images: ["course1.svg", "hero1.svg", "hero2.svg", "hero3.svg"],
    rating: 5.0,
    reviews: 10,
    inStock: true,
    support: [
      "ضمان لمدة 3 أشهر",
      "دعم فني متقدم",
      "تحديثات مجانية",
      "استضافة مجانية لمدة شهرين",
    ],
  },
  6: {
    id: 6,
    name: "تصميم موقع تعريفي لشركة",
    category: "تصميم مواقع",
    price: 2500,
    oldPrice: 3200,
    discount: 22,
    deliveryTime: "10 أيام عمل",
    description:
      "تصميم احترافي يعكس هوية شركتك، ويشمل معرض أعمال ونموذج اتصال متقدم مع تحسين للSEO وسرعة التحميل.",
    features: [
      "تصميم 5-7 صفحات مخصصة",
      "تحسين سرعة وأمان الموقع",
      "تسليم ملفات المشروع (Source Code)",
      "معرض أعمال تفاعلي",
      "نموذج اتصال متقدم",
      "تحسين لمحركات البحث",
    ],
    images: ["hero1.svg", "info.svg", "chatwep.svg", "course1.svg"],
    rating: 5.0,
    reviews: 30,
    inStock: true,
    support: [
      "دعم فني لمدة شهر",
      "تسليم ملفات المصدر",
      "تدريب على إدارة الموقع",
      "تحديثات أمنية مجانية",
    ],
  },
};

// ======================= إدارة سلة التسوق =======================
let cart = JSON.parse(localStorage.getItem("store_cart")) || [];
let currentUser = JSON.parse(localStorage.getItem("user")) || null;

// ======================= تهيئة المتجر =======================
document.addEventListener("DOMContentLoaded", () => {
  console.log("🛍️ بدء تهيئة المتجر...");

  // تهيئة شريط البحث
  initSearch();

  // تهيئة سلايدر المنتجات
  initProductSliders();

  // تهيئة أزرار المفضلة
  initWishlistButtons();

  // تهيئة أزرار الإجراءات
  initActionButtons();

  // تحديث عداد السلة
  updateCartCount();

  // إضافة تأثيرات الحركة للكروت
  addCardAnimations();

  console.log("✅ تم تهيئة المتجر بنجاح");
});

// ======================= وظائف البحث =======================
function initSearch() {
  const searchInput = document.getElementById("productSearchInput");
  const productCards = document.querySelectorAll(".product-card");

  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();

    productCards.forEach((card) => {
      const title = card
        .querySelector(".product-title")
        .textContent.toLowerCase();
      const category = card
        .querySelector(".product-category")
        .textContent.toLowerCase();
      const description = card
        .querySelector(".product-description")
        .textContent.toLowerCase();

      const matches =
        title.includes(searchTerm) ||
        category.includes(searchTerm) ||
        description.includes(searchTerm);

      card.style.display = matches ? "block" : "none";
    });
  });
}

// ======================= سلايدر المنتجات =======================
function initProductSliders() {
  const productCards = document.querySelectorAll(
    ".product-card[data-product-id]"
  );

  productCards.forEach((card) => {
    const productId = card.getAttribute("data-product-id");
    const slider = card.querySelector(".product-image-slider");
    const images = slider.querySelectorAll(".product-image");
    const prevBtn = card.querySelector(
      '.prev-btn[data-product-id="' + productId + '"]'
    );
    const nextBtn = card.querySelector(
      '.next-btn[data-product-id="' + productId + '"]'
    );

    let currentIndex = 0;
    let interval;

    function showSlide(index) {
      images.forEach((img) => img.classList.remove("active"));
      images[index].classList.add("active");
      currentIndex = index;
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % images.length;
      showSlide(currentIndex);
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showSlide(currentIndex);
    }

    // تفعيل السلايدر التلقائي عند المرور بالماوس
    card.addEventListener("mouseenter", () => {
      interval = setInterval(nextSlide, 3000);
    });

    card.addEventListener("mouseleave", () => {
      clearInterval(interval);
    });

    // التحكم اليدوي
    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        prevSlide();
        clearInterval(interval);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        nextSlide();
        clearInterval(interval);
      });
    }

    // عرض الصورة الأولى
    showSlide(0);
  });
}

// ======================= أزرار المفضلة =======================
function initWishlistButtons() {
  const wishlistBtns = document.querySelectorAll(".wishlist-btn");

  wishlistBtns.forEach((btn) => {
    const productId = btn.getAttribute("data-product-id");
    const isInWishlist = checkWishlist(productId);

    if (isInWishlist) {
      btn.classList.add("active");
      btn.innerHTML = '<i class="fas fa-heart"></i>';
    }

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleWishlist(productId, btn);
    });
  });
}

function checkWishlist(productId) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  return wishlist.includes(productId);
}

function toggleWishlist(productId, btn) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const isInWishlist = wishlist.includes(productId);

  if (isInWishlist) {
    // إزالة من المفضلة
    wishlist = wishlist.filter((id) => id !== productId);
    btn.classList.remove("active");
    btn.innerHTML = '<i class="far fa-heart"></i>';
    showNotification("تمت إزالة المنتج من المفضلة", "info");
  } else {
    // إضافة للمفضلة
    if (!currentUser) {
      showNotification("يجب تسجيل الدخول لإضافة منتج للمفضلة", "error");
      openModal(document.getElementById("loginModal"));
      return;
    }

    wishlist.push(productId);
    btn.classList.add("active");
    btn.innerHTML = '<i class="fas fa-heart"></i>';
    showNotification("تمت إضافة المنتج للمفضلة", "success");
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// ======================= أزرار الإجراءات =======================
function initActionButtons() {
  // أزرار التفاصيل
  document.querySelectorAll(".details-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const productId = btn.getAttribute("data-product-id");
      openProductDetailsModal(productId);
    });
  });

  // أزرار المراجعات
  document.querySelectorAll(".reviews-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const productId = btn.getAttribute("data-product-id");
      const productName = btn.getAttribute("data-product-name");
      openReviewsModal(productId, productName);
    });
  });

  // أزرار إضافة للسلة
  document.querySelectorAll(".product-buy-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const productId = btn.getAttribute("data-product-id");
      addToCart(productId);
    });
  });

  // عند النقر على الكارد (يفتح التفاصيل)
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      // تأكد أن النقر ليس على زر داخلي
      if (!e.target.closest("button") && !e.target.closest(".wishlist-btn")) {
        const productId = card.getAttribute("data-product-id");
        openProductDetailsModal(productId);
      }
    });
  });
}

// ======================= مودال تفاصيل المنتج =======================
function openProductDetailsModal(productId) {
  const product = productsData[productId];
  if (!product) return;

  const modal = document.getElementById("productDetailsModal");
  const content = document.getElementById("productDetailsContent");

  // إنشاء محتوى المودال
  content.innerHTML = `
    <div class="product-details-slider">
      <div class="product-image-slider" data-product-id="${productId}">
        ${product.images
          .map(
            (img, index) => `
          <img src="${img}" alt="صورة المنتج ${
              index + 1
            }" class="product-image ${index === 0 ? "active" : ""}" />
        `
          )
          .join("")}
      </div>
      <button class="prev-btn" data-product-id="${productId}">
        <i class="fas fa-chevron-right"></i>
      </button>
      <button class="next-btn" data-product-id="${productId}">
        <i class="fas fa-chevron-left"></i>
      </button>
    </div>
    
    <div class="product-details-info">
      <div class="product-details-left">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <p class="product-details-description">${product.description}</p>
        
        <div class="product-details-features">
          <h5><i class="fas fa-list-check"></i> المميزات:</h5>
          <ul class="spec-list">
            ${product.features
              .map(
                (feature) => `
              <li><i class="fas fa-check-circle"></i>${feature}</li>
            `
              )
              .join("")}
          </ul>
        </div>
      </div>
      
      <div class="product-details-right">
        <div class="price-info" style="margin-top: 0">
          <span class="old-price">${product.oldPrice.toLocaleString()} ر.س</span>
          <span class="new-price">${product.price.toLocaleString()} ر.س</span>
          <span class="discount-percent">خصم ${product.discount}%</span>
        </div>
        
        <div class="delivery-info">
          <h5><i class="fas fa-shipping-fast"></i> مدة التنفيذ:</h5>
          <p>${product.deliveryTime}</p>
        </div>
        
        <div class="rating-section" style="border: none; padding: 10px 0; margin: 10px 0">
          <div class="stars">
            ${Array(5)
              .fill()
              .map(
                (_, i) => `
              <i class="fas fa-star${
                i < Math.floor(product.rating) ? "" : "-half-alt"
              } gold"></i>
            `
              )
              .join("")}
            <span class="rating-text">(${product.rating})</span>
          </div>
          <button class="reviews-btn" onclick="openReviewsModal(${productId}, '${
    product.name
  }')">
            <i class="far fa-comment"></i> ${product.reviews} مراجعة
          </button>
        </div>
        
        <div class="support-info">
          <h5><i class="fas fa-headset"></i> الدعم:</h5>
          <ul>
            ${product.support
              .map(
                (item) => `
              <li><i class="fas fa-check"></i> ${item}</li>
            `
              )
              .join("")}
          </ul>
        </div>
        
        <div class="product-details-actions">
          <button class="details-btn" onclick="addToCart(${productId}); closeProductDetailsModal()">
            <i class="fas fa-shopping-cart"></i> أضف للسلة
          </button>
          <button class="product-buy-btn" onclick="addToCart(${productId}); closeProductDetailsModal(); openCartModal()">
            <i class="fas fa-bolt"></i> شراء سريع
          </button>
        </div>
      </div>
    </div>
  `;

  // تفعيل سلايدر الصور في المودال
  initModalSlider(productId);

  // فتح المودال
  openModal(modal);
}

function initModalSlider(productId) {
  const slider = document.querySelector(
    `.product-details-slider .product-image-slider[data-product-id="${productId}"]`
  );
  if (!slider) return;

  const images = slider.querySelectorAll(".product-image");
  const prevBtn = document.querySelector(
    `.product-details-slider .prev-btn[data-product-id="${productId}"]`
  );
  const nextBtn = document.querySelector(
    `.product-details-slider .next-btn[data-product-id="${productId}"]`
  );

  let currentIndex = 0;

  function showSlide(index) {
    images.forEach((img) => img.classList.remove("active"));
    images[index].classList.add("active");
    currentIndex = index;
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % images.length;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showSlide(currentIndex);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      prevSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      nextSlide();
    });
  }

  showSlide(0);
}

function closeProductDetailsModal() {
  closeModal(document.getElementById("productDetailsModal"));
}

// ======================= إدارة سلة التسوق =======================
function addToCart(productId) {
  if (!currentUser) {
    showNotification("يجب تسجيل الدخول لإضافة منتج للسلة", "error");
    openModal(document.getElementById("loginModal"));
    return;
  }

  const product = productsData[productId];
  if (!product) return;

  // التحقق إذا كان المنتج موجود في السلة
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
    showNotification("تم زيادة كمية المنتج في السلة", "success");
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    });
    showNotification("تم إضافة المنتج إلى السلة", "success");
  }

  // حفظ السلة في localStorage
  localStorage.setItem("store_cart", JSON.stringify(cart));

  // تحديث العداد
  updateCartCount();

  // تحديث مودال السلة إذا كان مفتوح
  if (document.getElementById("cartModal").classList.contains("active")) {
    updateCartModal();
  }
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("store_cart", JSON.stringify(cart));
  updateCartCount();
  updateCartModal();
  showNotification("تم إزالة المنتج من السلة", "info");
}

function updateQuantity(productId, newQuantity) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      item.quantity = newQuantity;
      localStorage.setItem("store_cart", JSON.stringify(cart));
      updateCartModal();
    }
  }
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
  const badge = document.getElementById("cartCountBadge");
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-block" : "none";
  }
}

// ======================= مودال سلة التسوق =======================
function openCartModal() {
  const modal = document.getElementById("cartModal");
  updateCartModal();
  openModal(modal);
}

function closeCartModal() {
  closeModal(document.getElementById("cartModal"));
}

function updateCartModal() {
  const cartItems = document.getElementById("cartItems");
  const emptyCart = document.getElementById("emptyCart");
  const cartSummary = document.getElementById("cartSummary");
  const cartActions = document.getElementById("cartActions");

  if (cart.length === 0) {
    emptyCart.style.display = "block";
    cartSummary.style.display = "none";
    cartActions.style.display = "none";

    // إخفاء عناصر السلة الأخرى
    const existingItems = cartItems.querySelectorAll(".cart-item");
    existingItems.forEach((item) => item.remove());

    return;
  }

  // إخفاء رسالة السلة الفارغة
  emptyCart.style.display = "none";

  // إزالة العناصر القديمة
  const existingItems = cartItems.querySelectorAll(".cart-item");
  existingItems.forEach((item) => item.remove());

  // حساب المجموع
  let subtotal = 0;

  // إضافة العناصر الجديدة
  cart.forEach((item) => {
    const product = productsData[item.id];
    if (!product) return;

    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";
    itemElement.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.name}</h4>
        <div class="cart-item-price">${item.price.toLocaleString()} ر.س</div>
      </div>
      <div class="cart-item-quantity">
        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${
      item.quantity - 1
    })">-</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${
      item.quantity + 1
    })">+</button>
      </div>
      <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
        <i class="fas fa-trash"></i>
      </button>
    `;

    cartItems.appendChild(itemElement);
  });

  // تحديث الملخص
  const discount = 0; // يمكن إضافة نظام خصومات لاحقاً
  const total = subtotal - discount;

  document.getElementById("cartSubtotal").textContent =
    subtotal.toLocaleString() + " ر.س";
  document.getElementById("cartDiscount").textContent =
    discount.toLocaleString() + " ر.س";
  document.getElementById("cartTotal").textContent =
    total.toLocaleString() + " ر.س";

  // إظهار الملخص والأزرار
  cartSummary.style.display = "block";
  cartActions.style.display = "flex";
}

// ======================= تأثيرات الحركة =======================
function addCardAnimations() {
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card, index) => {
    card.style.setProperty("--card-index", index);
  });
}

// ======================= وظائف عامة للمودالات =======================
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

function showNotification(message, type = "success") {
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

// ======================= ربط الأحداث =======================
// فتح سلة التسوق
document.getElementById("openCartModalBtn")?.addEventListener("click", (e) => {
  e.preventDefault();
  openCartModal();
});

// فتح أيقونة السلة في الدروب داون
document.getElementById("cartDropdownItem")?.addEventListener("click", (e) => {
  e.preventDefault();
  closeAllDropdowns();
  openCartModal();
});

// ======================= تهيئة عند التحميل =======================
window.addEventListener("load", () => {
  // إخفاء شاشة التحميل
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    loadingScreen.classList.remove("is-active");
  }

  // تهيئة تأثيرات fade-in
  const fadeElements = document.querySelectorAll(".fade-in-up");
  fadeElements.forEach((el, index) => {
    el.style.animationDelay = `${0.5 + index * 0.1}s`;
  });
});

// ======================= تصدير الوظائف للاستخدام العام =======================
window.openCartModal = openCartModal;
window.closeCartModal = closeCartModal;
window.openProductDetailsModal = openProductDetailsModal;
window.closeProductDetailsModal = closeProductDetailsModal;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
