import os
import shutil

# Set your source and destination directories
src_dir = 'src'
upload_dir = 'upload'

# Ensure the upload directory exists
if not os.path.exists(upload_dir):
    os.makedirs(upload_dir)

# Walk through the src directory
for root, dirs, files in os.walk(src_dir):
    for file in files:
        # Construct the full file path
        full_file_path = os.path.join(root, file)

        # Create a relative path for the file reflecting the folder structure
        relative_path = os.path.relpath(full_file_path, src_dir)
        new_file_name = relative_path.replace(os.sep, '_')

        # Destination file path in the upload folder
        dest_file_path = os.path.join(upload_dir, new_file_name)

        # Copy the file to the upload directory
        shutil.copy2(full_file_path, dest_file_path)

print("Files copied successfully!")
