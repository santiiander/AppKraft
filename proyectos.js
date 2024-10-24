document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('proyectos-container');
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeButton = document.querySelector('.close-button');
    
    // Load images
    for (let i = 1; i <= 12; i++) {
        const img = document.createElement('img');
        img.src = `Proyectos/Proyecto${i}.jpg`;
        img.alt = `Proyecto ${i}`;
        img.onerror = () => {
            img.src = '/placeholder.svg?height=200&width=200&text=Imagen no encontrada';
        };
        img.addEventListener('click', () => openModal(img.src));
        container.appendChild(img);
    }

    // Open modal
    function openModal(imageSrc) {
        modalImage.src = imageSrc;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Close modal when clicking the close button
    closeButton.addEventListener('click', closeModal);

    // Close modal when clicking outside the image
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // Adjust modal image size
    modalImage.addEventListener('load', () => {
        const aspectRatio = modalImage.naturalWidth / modalImage.naturalHeight;
        const maxWidth = window.innerWidth * 0.9;
        const maxHeight = window.innerHeight * 0.9;

        if (aspectRatio > maxWidth / maxHeight) {
            modalImage.style.width = maxWidth + 'px';
            modalImage.style.height = 'auto';
        } else {
            modalImage.style.width = 'auto';
            modalImage.style.height = maxHeight + 'px';
        }
    });
});