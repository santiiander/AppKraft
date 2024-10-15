document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('testimonios-container');
    
    // Asumiendo que las imágenes están en una carpeta llamada 'Testimonios'
    for (let i = 1; i <= 20; i++) {  // Ajusta este número según la cantidad de imágenes que tengas
        const img = document.createElement('img');
        img.src = `Testimonios/testimonio${i}.jpg`;
        img.alt = `Testimonio ${i}`;
        img.onerror = () => {
            img.src = '/placeholder.svg?height=200&width=200&text=Imagen no encontrada';
        };
        container.appendChild(img);
    }
});