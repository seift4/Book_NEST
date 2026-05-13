#!/usr/bin/env python
"""
Run this script to populate the BookNest database with default books.
Place book cover images in: media/book_images/
Usage: python populate_books.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'online_library.settings')
django.setup()

from django.conf import settings
from django.core.files import File
from booknest_library.models import Book

# Images are in media/book_images/
STATIC_IMAGES_DIR = os.path.join(settings.BASE_DIR, 'media', 'book_images')

image_map = {
    "BK001": "The_Great_Gatsby_Cover_1925_Retouched.jpg", "BK002": "9781408855652.jpg", "BK003": "81aY1lxk+9L._SY466_.jpg",
    "BK004": "1984.jpg", "BK005": "pride.jpg", "BK006": "BK006_cover.jpg",
    "BK007": "Thehobbit.jpg", "BK008": "alchemist.jpg", "BK009": "sapiens.jpg",
    "BK010": "educated.jpg", "BK011": "BK009_cover.jpg", "BK012": "selfishgene.jpg",
    "BK013": "carlsegan.jpg", "BK014": "guns.jpg", "BK015": "genghis.jpg",
    "BK016": "71nj3JM-igL._AC_UF1000,1000_QL80_.jpg", "BK017": "prog.jpg", "BK018": "BK018_cover.jpg",
    "BK019": "design.jpg", "BK020": "js.jpg", "BK021": "lean.jpg",
    "BK022": "zero.jpg", "BK023": "invest.jpg", "BK024": "habit.jpg",
    "BK025": "seven.jpg", "BK026": "friend.jpg", "BK027": "web.jpg",
    "BK028": "hungry.jpg", "BK029": "matilda.jpg", "BK030": "wild.jpg",
}

for book in Book.objects.all():
    if book.image and book.image.name:
        print(f"Skipping {book.title} (already has image)")
        continue
    
    filename = image_map.get(book.book_id)
    if not filename:
        continue
    
    source = os.path.join(STATIC_IMAGES_DIR, filename)
    if not os.path.exists(source):
        print(f"Missing image for {book.title}: {filename}")
        continue
    
    ext = os.path.splitext(filename)[1]
    dest_name = f"{book.book_id}_cover{ext}"
    
    with open(source, 'rb') as f:
        book.image.save(dest_name, File(f), save=True)
    
    print(f"Added image to: {book.title}")