from PIL import Image
import os

def crop_image(input_path, output_path):
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        
        # Get the bounding box of the non-transparent pixels
        bbox = img.getbbox()
        
        if bbox:
            # Crop the image to the bounding box
            cropped_img = img.crop(bbox)
            # Add a small padding if needed, but user asked to crop top/bottom specifically. 
            # Auto-crop is usually safer.
            cropped_img.save(output_path)
            print(f"Successfully cropped {input_path} to {output_path}")
        else:
            print("Image is empty or transparent.")
            
    except Exception as e:
        print(f"Error cropping image: {e}")

if __name__ == "__main__":
    input_file = "public/navbar-logo.png"
    # Overwrite the file
    crop_image(input_file, input_file)
