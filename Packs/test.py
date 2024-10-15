import os

# Ruta a la carpeta que contiene las subcarpetas MegaPack
base_dir = r'C:\Users\Santiago\Desktop\Negocios\AppKraft\Packs'

# Iterar sobre las carpetas MegaPack1 a MegaPack16
for i in range(1, 17):
    folder_name = f'MegaPack{i}'
    folder_path = os.path.join(base_dir, folder_name)

    # Verificar si la carpeta existe
    if os.path.exists(folder_path):
        # Iterar sobre los archivos en la carpeta
        for filename in os.listdir(folder_path):
            # Comprobar si el archivo tiene la extensión .PNG
            if filename.endswith('.PNG'):
                # Renombrar el archivo a .png
                new_filename = filename[:-4] + '.png'
                old_file = os.path.join(folder_path, filename)
                new_file = os.path.join(folder_path, new_filename)
                
                # Renombrar el archivo
                os.rename(old_file, new_file)
                print(f'Renombrado: {old_file} a {new_file}')

print('Renombrado completado.')
