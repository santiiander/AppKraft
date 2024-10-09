let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.querySelector('.cart-icon');
    const cartCount = document.getElementById('cart-count');
    const modal = document.getElementById('cart-modal');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const viewMoreButtons = document.querySelectorAll('.view-more');
    const whatsappButton = document.getElementById('whatsapp-button');

    cartIcon.addEventListener('click', () => {
        openModal();
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    addToCartButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const product = button.closest('.product');
            const productName = product.querySelector('h2').textContent;
            addToCart(productName);
            
            // Button animation
            button.classList.add('added');
            setTimeout(() => {
                button.classList.remove('added');
            }, 300);
        });
    });

    viewMoreButtons.forEach((button) => {
        button.addEventListener('click', () => {
            // Replace this URL with the actual Google Drive folder URL
            window.open('https://drive.google.com/drive/folders/your-folder-id', '_blank');
        });
    });

    whatsappButton.addEventListener('click', () => {
        sendWhatsAppMessage();
    });

    // Initialize cart count
    updateCartCount();
});

function addToCart(productName) {
    cart.push(productName);
    updateCartCount();
    showNotification(`${productName} added to cart!`);
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.length;
    
    // Animate cart icon
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
            li.textContent = item;
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
    showNotification(`${removedItem} removed from cart!`);
}

function openModal() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    updateCartDisplay();
}

function closeModal() {
    const modal = document.getElementById('cart-modal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function sendWhatsAppMessage() {
    const message = encodeURIComponent(`Hello, I would like to inquire about the following products: ${cart.join(', ')}`);
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

