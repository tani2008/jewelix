/* ========================================
   JEWELIX — script.js
   PART 1: Products, Search and Filters
======================================== */

const products = [
  {
    id: 1,
    name: "Golden Bloom Necklace",
    category: "Necklaces",
    price: 1299,
    description: "A delicate golden necklace for everyday elegance.",
    image:"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80" 
},
  {
    id: 2,
    name: "Pearl Dream Earrings",
    category: "Earrings",
    price: 799,
    description: "Elegant pearl-inspired earrings for special moments.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80%22"
  },
  {
    id: 3,
    name: "Rose Gold Charm",
    category: "Necklaces",
    price: 999,
    description: "A rose-gold look with a minimal and modern style.",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=80%22"
  },
  {
    id: 4,
    name: "Floral Hair Clip",
    category: "Hair Accessories",
    price: 499,
    description: "A floral accessory to complete your hairstyle.",
    image: "https://c.pxhere.com/photos/fa/b6/jewelry_the_first_flower_hair_clips-1081890.jpg!d"
  },
  {
    id: 5,
    name: "Classic Silver Chain",
    category: "Necklaces",
    price: 1099,
    description: "A timeless silver-style chain for every occasion.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Golden Hair Pin",
    category: "Hair Accessories",
    price: 399,
    description: "A simple gold-tone hair pin with a stylish finish.",
image: "https://images.unsplash.com/photo-1744177762258-c98418b7a4eb?auto=format&fit=crop&w=700&q=80",
 },
  {
    id: 7,
    name: "Everyday Hoop Earrings",
    category: "Earrings",
    price: 649,
    description: "Lightweight hoops that pair easily with your outfits.",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=700&q=80%22"
  },
  {
    id: 8,
    name: "Personalised Initial Pendant",
    category: "Necklaces",
    price: 1499,
    description: "A personal touch with a beautiful initial pendant.",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=80",  }
];

const productGrid = document.querySelector("#product-grid");
const searchInput = document.querySelector("#search-input");
const filterButtons = document.querySelectorAll(".filter-chip");
const emptyMessage = document.querySelector("#empty-message");

let selectedCategory = "All";
let cart = JSON.parse(localStorage.getItem("jewelixCart")) || [];
function addToCart(product) {
  const existingItem = cart.find(
    item => String(item.id) === String(product.id)
  );

  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  localStorage.setItem("jewelixCart", JSON.stringify(cart));

  updateCounters();
  renderSidePanel();

  showToast(`${product.name} added to your cart!`);
}
let wishlist = JSON.parse(localStorage.getItem("jewelixWishlist")) || [];
let selectedProduct = null;

const money = amount =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);

/* Show a small message on the screen */

function showToast(message) {
  const toast = document.querySelector("#toast");

  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* Display product cards */

function renderProducts() {
  if (!productGrid) return;

  const searchTerm = searchInput
    ? searchInput.value.trim().toLowerCase()
    : "";

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = filteredProducts.map(product => `
    <article class="product-card">
      <img
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
      >

      <div class="product-card-content">
        <h3>${product.name}</h3>
        <p>${product.category}</p>

        <div class="product-card-bottom">
          <span class="product-price">${money(product.price)}</span>

          <div class="product-card-actions">
            <button
              type="button"
              data-action="wishlist"
              data-id="${product.id}"
              aria-label="Add ${product.name} to wishlist"
              title="Add to wishlist"
            >♡</button>

            <button
              type="button"
              data-action="details"
              data-id="${product.id}"
              aria-label="View ${product.name}"
              title="View details"
            >↗</button>
          </div>
        </div>
      </div>
    </article>
  `).join("");

  if (emptyMessage) {
    emptyMessage.hidden = filteredProducts.length > 0;
  }
}

/* Search products */

if (searchInput) {
  searchInput.addEventListener("input", renderProducts);
}

/* Filter by category */

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    selectedCategory = button.dataset.filter || "All";

    renderProducts();
  });
});

/* Product card actions */

if (productGrid) {
  productGrid.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const product = products.find(
      item => item.id === Number(button.dataset.id)
    );

    if (!product) return;

    if (button.dataset.action === "wishlist") {
      toggleWishlist(product);
    }

    if (button.dataset.action === "details") {
      openProductModal(product);
    }
  });
}

/* ========================================
   PART 2: PRODUCT DETAILS MODAL
======================================== */

function openProductModal(product) {
  selectedProduct = product;

  const modal = document.querySelector("#product-modal");
  if (!modal) return;

  document.querySelector("#modal-image").src = product.image;
  document.querySelector("#modal-image").alt = product.name;
  document.querySelector("#modal-category").textContent = product.category;
  document.querySelector("#modal-title").textContent = product.name;
  document.querySelector("#modal-description").textContent =
    product.description;
  document.querySelector("#modal-price").textContent = money(product.price);

  modal.hidden = false;
}

function closeProductModal() {
  const modal = document.querySelector("#product-modal");

  if (modal) {
    modal.hidden = true;
  }
}

document.querySelector("#modal-close")?.addEventListener(
  "click",
  closeProductModal
);

document.querySelector("#product-modal")?.addEventListener(
  "click",
  event => {
    if (event.target.id === "product-modal") {
      closeProductModal();
    }
  }
);

document.querySelector("#modal-add")?.addEventListener("click", () => {
  if (!selectedProduct) return;

  addToCart(selectedProduct);
  closeProductModal();
});


function toggleWishlist(product) {
    const exists = wishlist.some(item => item.id === product.id);

    if (exists) {
        wishlist = wishlist.filter(item => item.id !== product.id);
        showToast("Removed from your wishlist.");
    } else {
        wishlist.push(product);
        showToast("Added to your wishlist!");
    }

    localStorage.setItem("jewelixWishlist", JSON.stringify(wishlist));

    updateCounters();
    renderProducts();
    renderSidePanel();
}
function updateCounters() {
  const cartCount = document.querySelector("#cart-count");
  const wishlistCount = document.querySelector("#wishlist-count");

  if (cartCount) {
    cartCount.textContent = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  if (wishlistCount) {
    wishlistCount.textContent = wishlist.length;
  }
}

/* Open and close the side panel */

function openSidePanel(type) {
  const panel = document.querySelector("#side-panel");
  const scrim = document.querySelector("#panel-scrim");
  const title = document.querySelector("#panel-title");

  if (!panel) return;

  panel.dataset.type = type;
  panel.setAttribute("aria-hidden", "false");
  panel.classList.add("open");

  if (title) {
    title.textContent = type === "cart" ? "Your Cart" : "Your Wishlist";
  }

  if (scrim) {
    scrim.hidden = false;
  }

  renderSidePanel();
}

function closeSidePanel() {
  const panel = document.querySelector("#side-panel");
  const scrim = document.querySelector("#panel-scrim");

  if (panel) {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
  }

  if (scrim) {
    scrim.hidden = true;
  }
}

document.querySelector("#cart-toggle")?.addEventListener(
  "click",
  () => openSidePanel("cart")
);

document.querySelector("#wishlist-toggle")?.addEventListener(
  "click",
  () => openSidePanel("wishlist")
);

document.querySelector("#panel-close")?.addEventListener(
  "click",
  closeSidePanel
);

document.querySelector("#panel-scrim")?.addEventListener(
  "click",
  closeSidePanel
);

/* Render cart or wishlist contents */

function renderSidePanel() {
  const panel = document.querySelector("#side-panel");
  const itemsContainer = document.querySelector("#panel-items");
  const footer = document.querySelector("#panel-footer");

  if (!panel || !itemsContainer || !footer) return;

  const type = panel.dataset.type || "cart";
  const items = type === "wishlist" ? wishlist : cart;

  if (items.length === 0) {
    itemsContainer.innerHTML = `
      <p style="color: #85736c; text-align: center; padding: 30px 0;">
        ${type === "cart"
          ? "Your cart is empty."
          : "Your wishlist is empty."}
      </p>
    `;

    footer.innerHTML = "";
    return;
  }

  itemsContainer.innerHTML = items.map(item => `
    <div class="panel-item">
      <img src="${item.image}" alt="${item.name}">

      <div style="flex: 1;">
        <h4>${item.name}</h4>
        <p>${money(item.price)}</p>
        ${type === "cart"
          ? `<p>Quantity: ${item.quantity}</p>`
          : ""}
      </div>

      <button
        type="button"
        data-remove-id="${item.id}"
        style="border: 0; background: transparent; cursor: pointer;"
        aria-label="Remove ${item.name}"
      >✕</button>
    </div>
  `).join("");

  if (type === "cart") {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    footer.innerHTML = `
      <p><strong>Total: ${money(total)}</strong></p>
      <button type="button" class="primary-button" id="checkout-button">
        Checkout
      </button>
      <p style="color: #85736c; font-size: 11px;">
        Demo website: checkout is not connected to a payment service.
      </p>
    `;
  } else {
    footer.innerHTML = `
      <p style="color: #85736c; font-size: 12px;">
        Your favourite jewellery, all in one place.
      </p>
    `;
  }
}
/* Remove items from cart or wishlist */

document.querySelector("#panel-items")?.addEventListener(
  "click",
  event => {
    const button = event.target.closest("[data-remove-id]");
    if (!button) return;

    const id = String(button.dataset.removeId);
    const panel = document.querySelector("#side-panel");
    const type = panel?.dataset.type || "cart";

    if (type === "wishlist") {
      wishlist = wishlist.filter(item => String(item.id) !== id);
      localStorage.setItem("jewelixWishlist", JSON.stringify(wishlist));
    } else {
      cart = cart.filter(item => String(item.id) !== id);
      localStorage.setItem("jewelixCart", JSON.stringify(cart));
    }

    updateCounters();
    renderSidePanel();
    renderProducts();
    showToast("Item removed successfully!");
  }
);
/* Demo checkout button */

document.querySelector("#panel-footer")?.addEventListener(
  "click",
  event => {
    if (event.target.closest("#checkout-button")) {
      window.location.href = "checkout.html";
    }
  }
);

/* ========================================
   PART 4: CUSTOM NECKLACE STUDIO
======================================== */

const initialInput = document.querySelector("#initial-input");
const previewInitial = document.querySelector("#pendant-initial");
const previewCharm = document.querySelector("#pendant-charm");
const previewFinish = document.querySelector("#preview-finish");
const customPrice = document.querySelector("#custom-price");
const studioFeedback = document.querySelector("#studio-feedback");

let selectedFinish = "Gold";
let selectedCharm = "Heart";

const finishPrices = {
  "Gold": 799,
  "Silver": 699,
  "Rose gold": 849
};

const charmSymbols = {
  "Heart": "♥",
  "Star": "★",
  "Moon": "☾",
  "Flower": "✿"
};

/* Update the necklace preview */

function updateCustomization() {
  const initial = initialInput
    ? initialInput.value.trim().slice(0, 2).toUpperCase()
    : "J";

  if (previewInitial) {
    previewInitial.textContent = initial || "J";
  }

  if (previewCharm) {
    previewCharm.textContent = charmSymbols[selectedCharm] || "♥";
  }

  if (previewFinish) {
    previewFinish.textContent = selectedFinish;
  }

  if (customPrice) {
    customPrice.textContent = money(finishPrices[selectedFinish] || 799);
  }

  /* Update the necklace metal colour */

  const gradient = document.querySelector("#metal-gradient");

  if (gradient) {
    const stops = gradient.querySelectorAll("stop");

    let colours;

    if (selectedFinish === "Silver") {
      colours = ["#f9f9f9", "#8c8c8c", "#eeeeee"];
    } else if (selectedFinish === "Rose gold") {
      colours = ["#f8c7b8", "#b96d5d", "#f3b6a4"];
    } else {
      colours = ["#ffe9a3", "#b98524", "#f5d878"];
    }

    stops.forEach((stop, index) => {
      if (colours[index]) {
        stop.setAttribute("stop-color", colours[index]);
      }
    });
  }
}

/* Change the initial letters */

initialInput?.addEventListener("input", updateCustomization);

/* Choose the metal finish */

document.querySelectorAll(".finish-option").forEach(button => {
  button.addEventListener("click", () => {
    selectedFinish = button.dataset.finish || "Gold";

    document.querySelectorAll(".finish-option").forEach(option => {
      option.classList.remove("active");
      option.setAttribute("aria-pressed", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");

    updateCustomization();
  });
});

/* Choose a charm */

document.querySelectorAll(".charm-option").forEach(button => {
  button.addEventListener("click", () => {
    selectedCharm = button.dataset.charm || "Heart";

    document.querySelectorAll(".charm-option").forEach(option => {
      option.classList.remove("active");
      option.setAttribute("aria-pressed", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");

    updateCustomization();
  });
});

/* Add the customised necklace to cart */

document.querySelector("#add-custom-to-cart")?.addEventListener(
  "click",
  () => {
    const initial = initialInput
      ? initialInput.value.trim().slice(0, 2).toUpperCase() || "J"
      : "J";

    const customNecklace = {
      id: "custom-" + Date.now(),
      name: `Custom ${selectedFinish} Necklace (${initial})`,
      category: "Custom Jewellery",
      price: finishPrices[selectedFinish] || 799,
      description: `${selectedFinish} finish with ${selectedCharm} charm.`,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80",
      quantity: 1
    };

    cart.push(customNecklace);
    localStorage.setItem("jewelixCart", JSON.stringify(cart));

    updateCounters();

    if (studioFeedback) {
      studioFeedback.textContent =
        "Your customised necklace has been added to the cart!";
    }

    showToast("Custom necklace added to your cart!");
  }
);

/* ========================================
   PART 5: CONTACT FORM
======================================== */

const contactForm = document.querySelector("#contact-form");
const contactFeedback = document.querySelector("#contact-feedback");

contactForm?.addEventListener("submit", event => {
  event.preventDefault();

  if (contactFeedback) {
    contactFeedback.textContent =
      "Thank you! This demo form is ready, but message delivery is not connected.";
  }

  contactForm.reset();
});

/* ========================================
   PART 6: NAVIGATION AND STARTUP
======================================== */

/* Close overlays using the Escape key */

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeProductModal();
    closeSidePanel();
  }
});

/* Show the current year in the footer */

const yearElement = document.querySelector("#year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* Set default active choices */

const defaultFinish = document.querySelector(
  '.finish-option[data-finish="Gold"]'
);

if (defaultFinish) {
  defaultFinish.classList.add("active");
  defaultFinish.setAttribute("aria-pressed", "true");
}

const defaultCharm = document.querySelector(
  '.charm-option[data-charm="Heart"]'
);

if (defaultCharm) {
  defaultCharm.classList.add("active");
  defaultCharm.setAttribute("aria-pressed", "true");
}

/* Load the products and preview */

renderProducts();
updateCounters();
updateCustomization();

console.log("Jewelix website is ready!");
// Jewelix Demo Login
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    // Login page par j form hoy tyare aa code chale
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("loginName").value.trim();
            const email = document.getElementById("loginEmail").value.trim();
            const message = document.getElementById("loginMessage");

           if (!name || !email) {
    message.textContent = "Please enter your name and email.";
    return;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(email)) {
    message.textContent = "Please enter a complete valid email address.";
    return;
}

            // Demo login: browser ma user nu naam save karo
            sessionStorage.setItem("jewelixUser", name);
            sessionStorage.setItem("jewelixEmail", email);

            window.location.href = "index.html";
        });
    }

    // Home page par login/logout status batavo
    const user = sessionStorage.getItem("jewelixUser");
    const userArea = document.getElementById("userArea");

    if (userArea) {
        if (user) {
            userArea.innerHTML = `
                <span class="welcome-user">Hi, ${escapeUserText(user)}!</span>
                <button type="button" id="logoutBtn" class="logout-btn">
                    Logout
                </button>
            `;

            document.getElementById("logoutBtn").addEventListener("click", function () {
                sessionStorage.removeItem("jewelixUser");
                sessionStorage.removeItem("jewelixEmail");
                window.location.href = "index.html";
            });
        } else {
            userArea.innerHTML = `
                <a href="login.html" class="login-nav-link">Login</a>
            `;
        }
    }
});

// User name ne HTML tarike interpret thata atkaavo
function escapeUserText(value) {
    const span = document.createElement("span");
    span.textContent = value;
    return span.innerHTML;
}