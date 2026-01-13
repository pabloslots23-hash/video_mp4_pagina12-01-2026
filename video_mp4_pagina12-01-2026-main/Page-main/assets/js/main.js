// DATOS DE PRODUCTOS (Simulados)
const productsDB = [
    { id: 1, name: "PARKA TÉCNICA", price: 129.00, img: "assets/images/products/parka-tecnica.jpg", cat: "men" },
    { id: 2, name: "JERSEY OVERSIZE", price: 59.90, img: "assets/images/products/jersey-oversize.jpg", cat: "women" },
    { id: 3, name: "HOODIE NO-RULES", price: 79.00, img: "assets/images/products/sudadera-capucha.jpg", cat: "men" },
    { id: 4, name: "JEANS FLARE", price: 65.00, img: "assets/images/products/jeans-flare.jpg", cat: "women" }
];

// ESTADO DEL CARRITO
let cart = JSON.parse(localStorage.getItem('vourneCart')) || [];

// 1. FUNCIONES CARRITO & SIDEBAR
function toggleCart() {
    document.querySelector('.cart-sidebar').classList.toggle('open');
    document.querySelector('.cart-overlay').classList.toggle('active');
}

function addToCart(id) {
    // Buscar si ya existe
    const existingItem = cart.find(item => item.id === id);
    if(existingItem) {
        existingItem.qty++;
    } else {
        const product = productsDB.find(p => p.id === id);
        // Ajuste de ruta de imagen si estamos en catalog/
        let imgPath = product.img;
        if(window.location.pathname.includes('catalog')) {
            imgPath = "../" + product.img;
        }
        
        cart.push({ ...product, qty: 1, displayImg: imgPath });
    }
    
    updateCartUI();
    showToast();
    // Abrir carrito al añadir
    if(!document.querySelector('.cart-sidebar').classList.contains('open')) {
        toggleCart();
    }
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    localStorage.setItem('vourneCart', JSON.stringify(cart));
    
    const container = document.querySelector('.cart-items');
    const totalEl = document.querySelector('.cart-total-price');
    const countEl = document.querySelector('.cart-count');
    
    // Calcular totales
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    
    countEl.innerText = totalQty;
    totalEl.innerText = totalPrice.toFixed(2) + " €";

    // Renderizar items
    if(cart.length === 0) {
        container.innerHTML = "<p class='empty-msg' style='text-align:center; color:#555; margin-top:20px;'>Tu carrito está vacío</p>";
    } else {
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.displayImg || item.img}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.qty} x ${item.price.toFixed(2)} €</p>
                    <span class="item-remove" onclick="removeItem(${item.id})">ELIMINAR</span>
                </div>
            </div>
        `).join('');
    }
}

// 2. RENDERIZAR PRODUCTOS (Solo en página catálogo)
function renderCatalog(category = 'all') {
    const grid = document.getElementById('product-grid');
    if(!grid) return; // Si no estamos en catalogo, salir

    const filtered = category === 'all' 
        ? productsDB 
        : productsDB.filter(p => p.cat === category);

    if(filtered.length === 0) {
        grid.innerHTML = "<p>No hay productos disponibles.</p>";
        return;
    }

    grid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <img src="../${p.img}" onerror="this.src='https://via.placeholder.com/300x400/333/fff?text=VOURNE'">
            <div class="product-info">
                <h3>${p.name}</h3>
                <span class="price">${p.price.toFixed(2)} €</span>
                <button class="btn btn-white btn-full" onclick="addToCart(${p.id})">AÑADIR</button>
            </div>
        </div>
    `).join('');
}

function filterProducts(cat) {
    renderCatalog(cat);
}

// 3. TOAST
function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    renderCatalog(); // Intentar renderizar catalogo si existe el div
});
