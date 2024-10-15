import os

# Ruta de la carpeta que contiene las imágenes
folder_path = r'C:\Users\Santiago\Desktop\Negocios\AppKraft\Proyectos'  # Cambia esto por la ruta real de tu carpeta

# Obtén una lista de todos los archivos en la carpeta
files = os.listdir(folder_path)

# Filtra solo las imágenes (puedes agregar más extensiones si es necesario)
image_extensions = ('.jpg', '.jpeg', '.png', '.webp')
images = [f for f in files if f.lower().endswith(image_extensions)]

# Renombrar las imágenes
for index, filename in enumerate(images, start=1):
    # Obtén la extensión del archivo
    file_extension = os.path.splitext(filename)[1]
    # Crea el nuevo nombre de archivo
    new_name = f"Proyecto{index}{file_extension}"
    # Construye las rutas completas
    old_path = os.path.join(folder_path, filename)
    new_path = os.path.join(folder_path, new_name)
    # Renombra el archivo
    os.rename(old_path, new_path)
    print(f'Renombrado: {filename} a {new_name}')

print("Renombramiento completado.")
