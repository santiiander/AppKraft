document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('testimonios-container');
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeButton = document.querySelector('.close-button');
    
    // Function to load images
    function loadImages() {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        let loadedImages = 0;
        const totalImagesToTry = 100; // Ajusta este número según la cantidad máxima de imágenes que esperas tener

        for (let i = 1; i <= totalImagesToTry; i++) {
            imageExtensions.forEach(ext => {
                const img = new Image();
                img.src = `Testimonios/Testimonio${i}.${ext}`;
                img.alt = `Testimonio ${i}`;
                img.loading = 'lazy'; // Add lazy loading for better performance

                img.onload = () => {
                    loadedImages++;
                    img.addEventListener('click', () => openModal(img.src));
                    container.appendChild(img);
                };

                img.onerror = () => {
                    if (ext === imageExtensions[imageExtensions.length - 1]) {
                        // Si hemos probado todas las extensiones y ninguna funcionó, no hacemos nada
                    }
                };
            });
        }

        // Mostrar un mensaje si no se cargaron imágenes
        setTimeout(() => {
            if (loadedImages === 0) {
                container.innerHTML = '<p>No se encontraron imágenes. Por favor, verifica la carpeta "Testimonios".</p>';
            }
        }, 5000); // Espera 5 segundos antes de mostrar el mensaje de error
    }

    // Load images
    loadImages();

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