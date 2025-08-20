document.addEventListener("DOMContentLoaded", () => {

  /************ مودال المنتج ************/
  const modal = document.getElementById("productModal");
  const closeModal = document.getElementById("closeModal");
  const mainModalImg = document.getElementById("mainModalImg");
  const smallModalImgs = document.querySelectorAll(".small-modal-img");
  const products = document.querySelectorAll(".pro");

  if (products.length && modal) {
    products.forEach(pro => {
      pro.addEventListener("click", (e) => {
        e.preventDefault();
        modal.style.display = "flex";
      });
    });
  }

  if (smallModalImgs.length && mainModalImg) {
    smallModalImgs.forEach(img => {
      img.addEventListener("click", () => {
        mainModalImg.src = img.src;
      });
    });
  }

  if (closeModal && modal) {
    closeModal.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });
  }

  /************ إضافة المنتج للسلة وتحديث أيقونة السلة ************/
  const addToCartBtn = document.querySelector(".add-to-cart-btn");

  function updateCartIcon() {
    const cartIcon = document.querySelector("#lg-bag i");
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);

    let badge = document.querySelector("#lg-bag .cart-count");
    if (!badge) {
      badge = document.createElement("span");
      badge.classList.add("cart-count");
      badge.style.cssText = "position:absolute; top:-5px; right:-10px; background:red; color:white; border-radius:50%; padding:2px 6px; font-size:12px;";
      document.querySelector("#lg-bag").appendChild(badge);
    }
    badge.textContent = totalQty;
  }

 if (addToCartBtn) {
  addToCartBtn.addEventListener("click", () => {
    const title = document.querySelector(".product-title").textContent;
    const price = parseFloat(document.querySelector(".product-price").textContent.replace('$',''));
    const img = document.getElementById("mainModalImg").src;
    const qty = parseInt(document.getElementById("productQty").value);

    // جلب المنتجات من localStorage
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    // إضافة المنتج كصف جديد دائمًا
    cartItems.push({ title, price, img, qty });

    localStorage.setItem("cart", JSON.stringify(cartItems));
    modal.style.display = "none";
    updateCartIcon();
    renderCart();
  });
}


  updateCartIcon();

  /************ عرض السلة ديناميكياً ************/
  const cartTableBody = document.querySelector("#chart tbody");

  function renderCart() {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    cartTableBody.innerHTML = "";
    let subtotal = 0;

    cartItems.forEach((item, index) => {
      const totalPrice = item.price * item.qty;
      subtotal += totalPrice;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><a href="#" class="remove-item" data-index="${index}"><i class="far fa-times-circle"></i></a></td>
        <td><img src="${item.img}" alt=""></td>
        <td>${item.title}</td>
        <td class="price">${item.price}</td>
        <td>
          <div class="quantity-container">
            <button class="qty-btn minus" data-index="${index}">−</button>
            <input type="text" value="${item.qty}" class="qty-input" data-index="${index}">
            <button class="qty-btn plus" data-index="${index}">+</button>
          </div>
        </td>
        <td class="total-price">${totalPrice}</td>
      `;
      cartTableBody.appendChild(row);
    });

    // تحديث المجموع
    const subtotalTd = document.querySelector("#subtotal table tr:nth-child(1) td:last-child");
    const totalTd = document.querySelector("#subtotal table tr:nth-child(3) td:last-child");
   if (subtotalTd) subtotalTd.textContent = subtotal.toFixed(2);
if (totalTd) totalTd.textContent = (subtotal + 4).toFixed(2); // التوصيل
  }

  renderCart();

  /************ event delegation للسلة ************/
  cartTableBody.addEventListener("click", (e) => {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const index = e.target.closest("[data-index]")?.dataset.index;

    if (!index) return;

    // حذف المنتج
    if (e.target.closest(".remove-item")) {
      cartItems.splice(index, 1);
    }

    // زيادة/نقص الكمية
    if (e.target.classList.contains("plus")) {
      cartItems[index].qty++;
    }
    if (e.target.classList.contains("minus")) {
      if (cartItems[index].qty > 1) cartItems[index].qty--;
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
    renderCart();
    updateCartIcon();
  });

  // تعديل الكمية يدويًا
  cartTableBody.addEventListener("input", (e) => {
    if (e.target.classList.contains("qty-input")) {
      const index = e.target.dataset.index;
      let value = parseInt(e.target.value);
      if (isNaN(value) || value < 1) value = 1;
      let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      cartItems[index].qty = value;
      localStorage.setItem("cart", JSON.stringify(cartItems));
      renderCart();
      updateCartIcon();
    }
  });

});
