import os
from pillow_heif import register_heif_opener
from PIL import Image

# Enable HEIC support for PIL
register_heif_opener()

# Folder containing HEIC images (Change this path as needed)
input_folder = r"C:\xampp\htdocs\ArcadiaLMS\arcadia-backend\app\dataset\heic"
output_folder = r"C:\xampp\htdocs\ArcadiaLMS\arcadia-backend\app\dataset\conv"

# Ensure output folder exists
os.makedirs(output_folder, exist_ok=True)

def convert_heic_to_jpg(input_folder, output_folder):
    for filename in os.listdir(input_folder):
        if filename.lower().endswith(".heic"):
            heic_path = os.path.join(input_folder, filename)
            jpg_path = os.path.join(output_folder, os.path.splitext(filename)[0] + ".jpg")

            try:
                # Open HEIC image
                image = Image.open(heic_path)
                
                # Convert and save as JPG
                image.convert("RGB").save(jpg_path, "JPEG", quality=95)
                
                print(f"Converted: {filename} → {jpg_path}")

            except Exception as e:
                print(f"Failed to convert {filename}: {e}")

# Run batch conversion
convert_heic_to_jpg(input_folder, output_folder)
print("Batch conversion complete!")
