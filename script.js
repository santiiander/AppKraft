let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.querySelector('.cart-icon');
    const cartCount = document.getElementById('cart-count');
    const cartModal = document.getElementById('cart-modal');
    const contentModal = document.getElementById('content-modal');
    const whatsappButton = document.getElementById('whatsapp-button');
    const countrySelect = document.getElementById('country-select');
    const closeButtons = document.querySelectorAll('.close');

    cartIcon.addEventListener('click', () => {
        openModal(cartModal);
    });

    closeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });

    whatsappButton.addEventListener('click', () => {
        sendWhatsAppMessage();
    });

    countrySelect.addEventListener('change', updatePrices);

    loadProductsFromGoogleSheet();
});

function loadProductsFromGoogleSheet() {
    const sheetId = '1_5nacrnSudilvk-QlQGwrzkSb0IVa_M_1KOAwjMrc-c';
    const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
    const sheetName = 'Sheet1';
    const query = encodeURIComponent('Select *');
    const url = `${base}&sheet=${sheetName}&tq=${query}`;

    fetch(url)
        .then(res => res.text())
        .then(rep => {
            const data = JSON.parse(rep.substr(47).slice(0, -2));
            const products = parseGoogleSheetData(data);
            displayProducts(products);
        })
        .catch(error => console.error('Error loading products:', error));
}

function parseGoogleSheetData(data) {
    const headers = data.table.cols.map(col => col.label);
    return data.table.rows.map(row => {
        const product = {};
        row.c.forEach((cell, index) => {
            product[headers[index]] = cell ? cell.v : '';
        });
        return product;
    });
}

function displayProducts(products) {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = products.map((product, index) => `
        <div class="product megapack">
            <h2>${product.Nombrepack}</h2>
            <div class="product-images">
                ${[1, 2, 3, 4, 5].map(num => `
                    <img src="Packs/MegaPack${index + 1}/${num}.jpg" alt="Figura Origami ${num}" 
                         onerror="this.src='/placeholder.svg?height=120&width=120&text=Image Not Found';">
                `).join('')}
            </div>
            <p>${product.DescirpcionPack}</p>
            <div class="price">
                Precio: <span class="amount pe">${product.PrecioPE}</span> <span class="currency pe">PEN</span>
                <span class="amount usd">${product.PrecioUSD}</span> <span class="currency usd">USD</span>
            </div>
            <button class="view-content" data-drive-link="${product.LinkGoogleDrive}">Ver todo el contenido del pack!</button>
            <button class="add-to-cart" data-product='${JSON.stringify(product)}'>Agregar al pedido</button>
        </div>
    `).join('');

    attachEventListeners();
    updatePrices();
}

function attachEventListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const viewContentButtons = document.querySelectorAll('.view-content');

    addToCartButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const product = JSON.parse(button.getAttribute('data-product'));
            addToCart(product);
            
            button.classList.add('added');
            setTimeout(() => {
                button.classList.remove('added');
            }, 300);
        });
    });

    viewContentButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const driveLink = button.getAttribute('data-drive-link');
            const contentIframe = document.getElementById('content-iframe');
            const messageDiv = document.getElementById('content-message');
            
            contentIframe.style.display = 'none';
            messageDiv.innerHTML = `
                <p>Para ver el contenido completo del pack, por favor haga clic en el siguiente enlace:</p>
                <a href="${driveLink}" target="_blank" rel="noopener noreferrer">Ver contenido en Google Drive</a>
                <p>Si el enlace no funciona, por favor contáctenos para obtener acceso.</p>
            `;
            messageDiv.style.display = 'block';
            
            openModal(document.getElementById('content-modal'));
        });
    });
}

function addToCart(product) {
    const existingItem = cart.find(item => item.Nombrepack === product.Nombrepack);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartCount();
    showNotification(`${product.Nombrepack} agregado al carrito!`);
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCount.classList.add('pulse');
    setTimeout(() => {
        cartCount.classList.remove('pulse');
    }, 300);
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<li>Tu carrito está vacío</li>';
        cartTotal.textContent = '';
    } else {
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            const price = document.getElementById('country-select').value === 'peru' ? item.PrecioPE : item.PrecioUSD;
            const itemTotal = price * item.quantity;
            total += itemTotal;

            li.innerHTML = `
                <div>
                    ${item.Nombrepack} - Cantidad: ${item.quantity} - Precio: ${price} - Total: ${itemTotal.toFixed(2)}
                </div>
                <button class="remove-item" data-index="${index}">Eliminar</button>
            `;
            cartItems.appendChild(li);
        });

        cartTotal.textContent = `Total del carrito: ${total.toFixed(2)} ${document.getElementById('country-select').value === 'peru' ? 'PEN' : 'USD'}`;
    }

    attachRemoveItemListeners();
}

function attachRemoveItemListeners() {
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            removeFromCart(index);
        });
    });
}

function removeFromCart(index) {
    const removedItem = cart.splice(index, 1)[0];
    updateCartCount();
    updateCartDisplay();
    showNotification(`${removedItem.Nombrepack} eliminado del carrito!`);
}

function openModal(modal) {
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    if (modal === document.getElementById('cart-modal')) {
        updateCartDisplay();
    }
}

function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        if (modal === document.getElementById('content-modal')) {
            const contentIframe = document.getElementById('content-iframe');
            const messageDiv = document.getElementById('content-message');
            contentIframe.style.display = 'none';
            messageDiv.style.display = 'none';
        }
    }, 300);
}

function sendWhatsAppMessage() {
    const message = encodeURIComponent(`Hola, me gustaría consultar sobre los siguientes productos: ${cart.map(item => `${item.Nombrepack} (x${item.quantity})`).join(', ')}`);
    window.open(`https://wa.me/51908642311?text=${message}`, '_blank');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.classList.add('notification');
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function updatePrices() {
    const country = document.getElementById('country-select').value;
    const priceElements = document.querySelectorAll('.price');
    
    priceElements.forEach(priceElement => {
        const peElements = priceElement.querySelectorAll('.pe');
        const usdElements = priceElement.querySelectorAll('.usd');
        
        if (country === 'peru') {
            peElements.forEach(el => el.style.display = 'inline');
            usdElements.forEach(el => el.style.display = 'none');
        } else {
            peElements.forEach(el => el.style.display = 'none');
            usdElements.forEach(el => el.style.display = 'inline');
        }
    });

    updateCartDisplay();
}