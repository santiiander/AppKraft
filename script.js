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
    productsContainer.innerHTML = products.map(product => `
        <div class="product megapack">
            <h2>${product.Nombrepack}</h2>
            <div class="product-images">
                ${['Imagen1', 'Imagen2', 'Imagen3', 'Imagen4', 'Imagen5']
                    .map((imgKey, index) => product[imgKey] ? `<img src="${product[imgKey]}" alt="Figura Origami ${index + 1}" onerror="this.src='/placeholder.svg?height=120&width=120&text=Image Not Found';">` : '')
                    .join('')}
            </div>
            <p>${product.DescirpcionPack}</p>
            <div class="price">
                Precio: <span class="amount pe">${product.PrecioPE}</span> <span class="currency pe">PEN</span>
                <span class="amount usd">${product.PrecioUSD}</span> <span class="currency usd">USD</span>
            </div>
            <button class="view-content" data-drive-link="${product.LinkGoogleDrive}">Ver todo el contenido del pack!</button>
            <button class="add-to-cart">Agregar al pedido</button>
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
            const product = button.closest('.megapack');
            const productName = product.querySelector('h2').textContent;
            const productPrice = product.querySelector('.amount.pe').textContent;
            addToCart(productName, productPrice);
            
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

function addToCart(productName, productPrice) {
    cart.push({ name: productName, price: productPrice });
    updateCartCount();
    showNotification(`${productName} added to cart!`);
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.length;
    
    cartCount.classList.add('pulse');
    setTimeout(() => {
        cartCount.classList.remove('pulse');
    }, 300);
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    if (cart.length === 0) {
        cartItems.innerHTML = '<li>Your cart is empty</li>';
    } else {
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - ${item.price}`;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('remove-item');
            removeButton.addEventListener('click', () => removeFromCart(index));
            
            li.appendChild(removeButton);
            cartItems.appendChild(li);
        });
    }
}

function removeFromCart(index) {
    const removedItem = cart.splice(index, 1)[0];
    updateCartCount();
    updateCartDisplay();
    showNotification(`${removedItem.name} removed from cart!`);
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
    const message = encodeURIComponent(`Hello, I would like to inquire about the following products: ${cart.map(item => item.name).join(', ')}`);
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
}