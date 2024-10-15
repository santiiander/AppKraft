import os

# Ruta de la carpeta que contiene las imágenes
ruta_carpeta = r'C:\Users\Santiago\Desktop\Negocios\AppKraft\Packs\MegaPack19'

# Extensiones de imágenes comunes que queremos renombrar
extensiones_validas = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff']

# Obtener todas las imágenes en la carpeta
imagenes = [archivo for archivo in os.listdir(ruta_carpeta) 
            if os.path.isfile(os.path.join(ruta_carpeta, archivo)) 
            and os.path.splitext(archivo)[1].lower() in extensiones_validas]

# Renombrar las imágenes secuencialmente
for indice, imagen in enumerate(imagenes, start=1):
    extension = os.path.splitext(imagen)[1]
    nuevo_nombre = f'{indice}{extension}'
    ruta_imagen_actual = os.path.join(ruta_carpeta, imagen)
    ruta_imagen_nueva = os.path.join(ruta_carpeta, nuevo_nombre)
    
    os.rename(ruta_imagen_actual, ruta_imagen_nueva)
    print(f'Imagen renombrada: {imagen} -> {nuevo_nombre}')
