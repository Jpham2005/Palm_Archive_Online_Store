const CART_KEY = "palmArchiveCart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  cart.push(product);
  saveCart(cart);
  alert("Added to bag");
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const cartItems = document.querySelector("#cartItems");
  const emptyCartMessage = document.querySelector("#emptyCartMessage");
  const orderInfo = document.querySelector("#orderInfo");

  if (!cartItems) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartItems.innerHTML = "";

    if (emptyCartMessage) {
      emptyCartMessage.style.display = "block";
    }

    if (orderInfo) {
      orderInfo.classList.add("hidden");
    }

    return;
  }

  if (emptyCartMessage) {
    emptyCartMessage.style.display = "none";
  }

  if (orderInfo) {
    orderInfo.classList.remove("hidden");
  }

  cartItems.innerHTML = cart
    .map(
      (item, index) => `
        <article class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <small>${item.designer}</small>
            <h3>${item.name}</h3>
            <strong>$${Number(item.price).toLocaleString()}</strong>
            <button class="remove-cart-btn" data-index="${index}">
              REMOVE
            </button>
          </div>
        </article>
      `
    )
    .join("");
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest(".add-cart-btn");
  const removeButton = event.target.closest(".remove-cart-btn");

  if (addButton) {
    const product = JSON.parse(addButton.dataset.product);
    addToCart(product);
  }

  if (removeButton) {
    removeFromCart(Number(removeButton.dataset.index));
  }
});

renderCart();