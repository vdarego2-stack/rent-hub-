"""
Script to delete specific products from the database.
This script will delete all products with names: TV, Camera
"""

import sys
import os

# Add your Flask app directory to the path
sys.path.insert(0, os.path.dirname(__file__))

from app import app, db, Product

def delete_specific_products():
    """Delete TV and Camera products from database"""
    
    products_to_delete = ['TV', 'Camera']
    
    with app.app_context():
        deleted_count = 0
        
        for product_name in products_to_delete:
            # Find all products with this name
            products = Product.query.filter_by(name=product_name).all()
            
            for product in products:
                print(f"Deleting: {product.name} (ID: {product.id}) - Price: {product.price}")
                
                # Delete image file if it exists
                if product.image:
                    image_path = os.path.join(app.config.get('UPLOAD_FOLDER', 'uploads'), product.image)
                    if os.path.exists(image_path):
                        try:
                            os.remove(image_path)
                            print(f"  ✓ Image deleted: {product.image}")
                        except Exception as e:
                            print(f"  ✗ Error deleting image: {e}")
                
                # Delete from database
                db.session.delete(product)
                deleted_count += 1
        
        # Commit all deletions
        db.session.commit()
        print(f"\n✓ Successfully deleted {deleted_count} products!")
        print(f"  Deleted products: {', '.join(products_to_delete)}")

if __name__ == '__main__':
    try:
        delete_specific_products()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
