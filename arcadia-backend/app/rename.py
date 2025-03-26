import os

# Folder containing JPG images (Change this path as needed)
folder_path = r"C:\xampp\htdocs\ArcadiaLMS\arcadia-backend\app\dataset"

def batch_rename_by_date(folder_path):
    # Get list of JPG files with their full paths
    jpg_files = [os.path.join(folder_path, f) for f in os.listdir(folder_path) if f.lower().endswith(".jpg")]

    # Sort files by creation date (or modification date if creation date isn't available)
    jpg_files.sort(key=lambda f: os.path.getctime(f))

    # Rename files sequentially
    for index, file_path in enumerate(jpg_files, start=1):
        folder, old_filename = os.path.split(file_path)
        new_filename = f"data_{index}.jpg"
        new_path = os.path.join(folder, new_filename)

        try:
            os.rename(file_path, new_path)
            print(f"Renamed: {old_filename} → {new_filename}")
        except Exception as e:
            print(f"Failed to rename {old_filename}: {e}")

# Run batch renaming
batch_rename_by_date(folder_path)
print("Batch renaming complete!")
