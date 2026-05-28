const grid = document.querySelector("#products");
const searchInput = document.querySelector("#searchInput");
const suggestions = document.querySelector("#suggestions");
const chat = document.querySelector("#chat");
const messages = document.querySelector("#messages");

async function getJson(url, options) {
  const response = await fetch(url, options);
  return response.json();
}

async function loadProducts(query = "") {
  const products = await getJson(`/api/products?q=${encodeURIComponent(query)}`);
  grid.innerHTML = products
    .map(
      (item) => `
        <article>
          <img src="${item.image}" alt="${item.name}">
          <div>
            <small>${item.designer}</small>
            <h3>${item.name}</h3>
            <strong>$${Number(item.price).toLocaleString()}</strong>
            <button class="add-cart-btn" data-product='${JSON.stringify(item)}'>
              ADD TO BAG
            </button>
          </div>
        </article>
      `
    )
    .join("");
}

async function loadSuggestions(query) {
  if (!query.trim()) {
    suggestions.innerHTML = "";
    return;
  }

  const items = await getJson(`/api/suggestions?q=${encodeURIComponent(query)}`);
  suggestions.innerHTML = items.map((item) => `<button>${item}</button>`).join("");
}

searchInput.addEventListener("input", () => {
  loadProducts(searchInput.value);
  loadSuggestions(searchInput.value);
});

suggestions.addEventListener("click", (event) => {
  if (event.target.tagName !== "BUTTON") return;
  searchInput.value = event.target.textContent;
  suggestions.innerHTML = "";
  loadProducts(searchInput.value);
});

document.querySelector("#chatButton").addEventListener("click", () => chat.classList.remove("hidden"));
document.querySelector("#closeChat").addEventListener("click", () => chat.classList.add("hidden"));

document.querySelector("#chatForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = document.querySelector("#chatInput");
  const text = input.value.trim();
  if (!text) return;

  messages.insertAdjacentHTML("beforeend", `<p class="user">${text}</p>`);
  input.value = "";

  const data = await getJson("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });

  messages.insertAdjacentHTML("beforeend", `<p class="bot">${data.reply}</p>`);
  messages.scrollTop = messages.scrollHeight;
});

const params = new URLSearchParams(window.location.search);
const queryFromUrl = params.get("q") || "";

loadProducts(queryFromUrl);
