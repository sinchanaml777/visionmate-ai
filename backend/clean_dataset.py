import os
from PIL import Image

dataset_path = "dataset"
bad_files = 0

for folder in os.listdir(dataset_path):
    folder_path = os.path.join(dataset_path, folder)

    if os.path.isdir(folder_path):
        for file in os.listdir(folder_path):
            file_path = os.path.join(folder_path, file)

            try:
                img = Image.open(file_path)
                img.verify()  # Check corruption

            except Exception:
                print("❌ Removing corrupt image:", file_path)
                os.remove(file_path)
                bad_files += 1

print(f"\n🎯 Cleaning complete. Removed {bad_files} corrupt images.")