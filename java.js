// Variables globales
let cart = [];

// Función para guardar el carrito en localStorage
function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Función para cargar el carrito desde localStorage
function loadCartFromLocalStorage() {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    cart = JSON.parse(storedCart);
    renderCart();
    updateCartBadge();
  }
}

// Función para agregar productos al carrito
function addToCart(event) {
  const button = event.target;
  const name = button.getAttribute("data-name");
  const price = parseFloat(button.getAttribute("data-price"));

  // Buscar si el producto ya está en el carrito
  const existingProduct = cart.find(product => product.name === name);
  if (existingProduct) {
    existingProduct.quantity += 1;
    existingProduct.total = existingProduct.quantity * existingProduct.price;
  } else {
    cart.push({ name, price, quantity: 1, total: price });
  }

  renderCart();
  updateCartBadge();
  saveCartToLocalStorage();
}

// Función para renderizar el carrito
function renderCart() {
  const cartTableBody = document.querySelector("#cart tbody");
  const cartTotal = document.getElementById("cart-total");

  // Limpiar el contenido anterior
  cartTableBody.innerHTML = "";

  let totalPrice = 0;

  cart.forEach(product => {
    totalPrice += product.total;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>${product.quantity}</td>
      <td>$${product.total.toFixed(2)}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="removeFromCart('${product.name}')">Eliminar</button>
      </td>
    `;
    cartTableBody.appendChild(row);
  });

  // Actualizar total del carrito
  cartTotal.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

// Función para eliminar un producto del carrito
function removeFromCart(name) {
  cart = cart.filter(product => product.name !== name);
  renderCart();
  updateCartBadge();
  saveCartToLocalStorage();
}

// Actualizar el contador de productos en el carrito
function updateCartBadge() {
  const cartCount = document.getElementById("cart-count");
  const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
  cartCount.textContent = totalItems;
}

// Al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  loadCartFromLocalStorage();
  const buttons = document.querySelectorAll(".add-to-cart");
  buttons.forEach(button => {
    button.addEventListener("click", addToCart);
  });
});
