#!/usr/bin/env python
"""
Run this script to populate the BookNest database with many default books.
Usage: python populate_books.py
"""

import os
import sys
import django
import urllib.request
import ssl

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'online_library.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.core.files import File
from django.conf import settings
from booknest_library.models import Book

# Create SSL context that doesn't verify certificates (for downloading images)
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# Default books to populate - many more books across categories
# Using placeholder image URLs that will be downloaded
books_data = [
    # Fiction
    {
        "book_id": "BK001",
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "category": "fiction",
        "description": "The Great Gatsby (1925) by F. Scott Fitzgerald is a classic American novel set in the Roaring Twenties. Narrated by Nick Carraway, it explores themes of love, obsession, and the corruption of the American Dream as mysterious millionaire Jay Gatsby tries to win back his former love, Daisy Buchanan, amid the decadence of Long Island.",
        "price": 15.99,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg"
    },
    {
        "book_id": "BK002",
        "title": "Harry Potter and the Philosopher's Stone",
        "author": "J.K. Rowling",
        "category": "fiction",
        "description": "Harry Potter and the Philosopher's Stone (1997) by J.K. Rowling is a fantasy novel introducing an orphaned boy who discovers on his eleventh birthday that he is a wizard. Harry escapes his abusive aunt and uncle to attend Hogwarts School of Witchcraft and Wizardry, making friends (Ron and Hermione) and uncovering a plot to steal an ancient stone.",
        "price": 12.99,
        "is_available": True,
        "image_url": "https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg"
    },
    {
        "book_id": "BK003",
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "category": "fiction",
        "description": "To Kill a Mockingbird (1960) is a Pulitzer Prize-winning novel by Harper Lee. Set in the American South during the 1930s, it follows young Scout Finch as her father, lawyer Atticus Finch, defends a Black man falsely accused of rape. The novel explores themes of racial injustice, moral growth, and compassion.",
        "price": 14.50,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg"
    },
    {
        "book_id": "BK004",
        "title": "1984",
        "author": "George Orwell",
        "category": "fiction",
        "description": "1984 (1949) by George Orwell is a dystopian social science fiction novel and cautionary tale. It follows Winston Smith, a low-ranking member of 'the Party' in London, in a nation of Oceania, where the Party scrutinizes every human action with ever-watchful Big Brother.",
        "price": 13.99,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/5/51/1984_first_edition_cover.jpg"
    },
    {
        "book_id": "BK005",
        "title": "Pride and Prejudice",
        "author": "Jane Austen",
        "category": "fiction",
        "description": "Pride and Prejudice (1813) is a romantic novel of manners by Jane Austen. The novel follows the character development of Elizabeth Bennet, the dynamic protagonist, who learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.",
        "price": 11.99,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/1/17/PrideAndPrejudiceTitlePage.jpg"
    },
    {
        "book_id": "BK006",
        "title": "The Catcher in the Rye",
        "author": "J.D. Salinger",
        "category": "fiction",
        "description": "The Catcher in the Rye (1951) is a novel by J. D. Salinger. It follows Holden Caulfield, a teenager who has been expelled from prep school, as he wanders around New York City over the course of a few days, grappling with adolescence, alienation, and the 'phoniness' of the adult world.",
        "price": 13.50,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/8/89/The_Catcher_in_the_Rye_%281951%2C_first_edition_cover%29.jpg"
    },
    {
        "book_id": "BK007",
        "title": "The Hobbit",
        "author": "J.R.R. Tolkien",
        "category": "fiction",
        "description": "The Hobbit (1937) is a children's fantasy novel by J.R.R. Tolkien. It follows the quest of home-loving Bilbo Baggins, the titular hobbit, to win a share of the treasure guarded by a dragon named Smaug. Along the way, Bilbo meets Goblins, Elves, and a creature named Gollum.",
        "price": 14.99,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/4/4a/TheHobbit_FirstEdition.jpg"
    },
    {
        "book_id": "BK008",
        "title": "The Alchemist",
        "author": "Paulo Coelho",
        "category": "fiction",
        "description": "The Alchemist (1988) is a novel by Brazilian author Paulo Coelho. It follows Santiago, a young Andalusian shepherd, in his journey to the pyramids of Egypt, after having a recurring dream of finding a treasure there. The novel is about following one's dreams and listening to one's heart.",
        "price": 16.00,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/c/c4/TheAlchemist.jpg"
    },

    # Non-Fiction
    {
        "book_id": "BK009",
        "title": "Sapiens: A Brief History of Humankind",
        "author": "Yuval Noah Harari",
        "category": "non-fiction",
        "description": "Sapiens: A Brief History of Humankind (2011) by Yuval Noah Harari explores the history of humankind from the Stone Age to the twenty-first century. The book surveys the history of humankind from the evolution of archaic human species in the Stone Age up to the twenty-first century.",
        "price": 22.99,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/0/06/%D7%A1%D7%A4%D7%99%D7%99%D7%A0%D7%A1_%D7%A7%D7%99%D7%A6%D7%95%D7%A8_%D7%94%D7%94%D7%99%D7%A1%D7%98%D7%95%D7%A8%D7%99%D7%94_%D7%A9%D7%9C_%D7%94%D7%90%D7%A0%D7%95%D7%A9%D7%95%D7%AA.jpg"
    },
    {
        "book_id": "BK010",
        "title": "Educated",
        "author": "Tara Westover",
        "category": "non-fiction",
        "description": "Educated (2018) is a memoir by Tara Westover. It details her life growing up in a survivalist Mormon family in rural Idaho, her struggle for self-invention, and her journey to earn a PhD from Cambridge University despite having no formal education until age 17.",
        "price": 18.99,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/5/5f/Educated_%28Tara_Westover%29.png"
    },

    # Science
    {
        "book_id": "BK011",
        "title": "A Brief History of Time",
        "author": "Stephen Hawking",
        "category": "science",
        "description": "A Brief History of Time: From the Big Bang to Black Holes (1988) is a popular-science book on cosmology by English physicist Stephen Hawking. It attempts to explain a range of subjects in cosmology, including the Big Bang, black holes, and light cones, to the nonspecialist reader.",
        "price": 19.99,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/0/0c/A_Brief_History_of_Time.jpg"
    },
    {
        "book_id": "BK012",
        "title": "The Selfish Gene",
        "author": "Richard Dawkins",
        "category": "science",
        "description": "The Selfish Gene (1976) is a book on evolution by the ethologist Richard Dawkins, in which the author builds upon the principal theory of George Williams's Adaptation and Natural Selection (1966). Dawkins uses the term 'selfish gene' as a way of expressing the gene-centred view of evolution.",
        "price": 17.50,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/7/7c/TheSelfishGene.jpg"
    },
    {
        "book_id": "BK013",
        "title": "Cosmos",
        "author": "Carl Sagan",
        "category": "science",
        "description": "Cosmos (1980) is a science book by astronomer and Pulitzer Prize-winning author Carl Sagan. It was published as a companion piece to the documentary television series Cosmos: A Personal Voyage, which Sagan co-wrote and narrated. The book explores the mutual development of science and civilization.",
        "price": 20.00,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/7/7c/Cosmos_book_cover.jpg"
    },

    # History
    {
        "book_id": "BK014",
        "title": "The Guns of August",
        "author": "Barbara Tuchman",
        "category": "history",
        "description": "The Guns of August (1962) is a volume of history by Barbara Tuchman. It is centered on the first month of World War I. The book was awarded the Pulitzer Prize for General Nonfiction in 1963. It provides a detailed account of the earliest stages of World War I.",
        "price": 16.99,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/8/8f/TheGunsOfAugust.jpg"
    },
    {
        "book_id": "BK015",
        "title": "Genghis Khan and the Making of the Modern World",
        "author": "Jack Weatherford",
        "category": "history",
        "description": "Genghis Khan and the Making of the Modern World (2004) is a history book by Jack Weatherford. It describes the rise and impact of Genghis Khan and the Mongol Empire. The book argues that the Mongol Empire was the first to create a truly international society.",
        "price": 18.00,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/3/3e/Genghis_Khan_and_the_Making_of_the_Modern_World.jpg"
    },

    # Technology
    {
        "book_id": "BK016",
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "category": "technology",
        "description": "A foundational programming book that teaches developers how to write, read, and clean code. It highlights that 'clean' code is readable, simple, maintainable, and efficient, helping developers avoid the technical debt and failure caused by poorly written software.",
        "price": 35.00,
        "is_available": True,
        "image_url": "https://m.media-amazon.com/images/I/41xShlnTZ7L._AC_UF1000,1000_QL80_.jpg"
    },
    {
        "book_id": "BK017",
        "title": "The Pragmatic Programmer",
        "author": "Andrew Hunt & David Thomas",
        "category": "technology",
        "description": "The Pragmatic Programmer: From Journeyman to Master (1999) is a book about software engineering by Andrew Hunt and David Thomas. It covers topics ranging from personal responsibility and career development to architectural techniques for keeping your code flexible and easy to adapt.",
        "price": 42.00,
        "is_available": True,
        "image_url": "https://m.media-amazon.com/images/I/71f743sOAoL._AC_UF1000,1000_QL80_.jpg"
    },
    {
        "book_id": "BK018",
        "title": "Introduction to Algorithms",
        "author": "Thomas H. Cormen et al.",
        "category": "technology",
        "description": "Introduction to Algorithms is a book on computer algorithms by Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein. It is used as the textbook for algorithms courses at many universities and is commonly cited as a reference for algorithms in published papers.",
        "price": 85.00,
        "is_available": True,
        "image_url": "https://m.media-amazon.com/images/I/61Mw06x2XcL._AC_UF1000,1000_QL80_.jpg"
    },
    {
        "book_id": "BK019",
        "title": "Design Patterns",
        "author": "Gang of Four (GoF)",
        "category": "technology",
        "description": "Design Patterns: Elements of Reusable Object-Oriented Software (1994) is a software engineering book describing software design patterns. The book was written by Erich Gamma, Richard Helm, Ralph Johnson, and John Vlissides, with a foreword by Grady Booch.",
        "price": 55.00,
        "is_available": True,
        "image_url": "https://m.media-amazon.com/images/I/51szD9HC9pL._AC_UF1000,1000_QL80_.jpg"
    },
    {
        "book_id": "BK020",
        "title": "You Don't Know JS: Scope & Closures",
        "author": "Kyle Simpson",
        "category": "technology",
        "description": "No matter how much experience you have with JavaScript, odds are you don't fully understand the language. This concise yet in-depth guide takes you inside scope and closures, two core concepts you need to know to become a more efficient and effective JavaScript programmer.",
        "price": 24.99,
        "is_available": True,
        "image_url": "https://m.media-amazon.com/images/I/7186Y7nYuiL._AC_UF1000,1000_QL80_.jpg"
    },

    # Business
    {
        "book_id": "BK021",
        "title": "The Lean Startup",
        "author": "Eric Ries",
        "category": "business",
        "description": "The Lean Startup (2011) is a book by Eric Ries describing his proposed lean startup strategy for startup businesses. Ries argues that startup companies can shorten their product development cycles by adopting a combination of business-hypothesis-driven experimentation, iterative product releases, and validated learning.",
        "price": 28.00,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/1/11/Lean_Startup.png"
    },
    {
        "book_id": "BK022",
        "title": "Zero to One",
        "author": "Peter Thiel",
        "category": "business",
        "description": "Zero to One: Notes on Startups, or How to Build the Future (2014) is a book by the American entrepreneur and investor Peter Thiel. The book presents Thiel's business philosophy, which emphasizes creating new things (going from 0 to 1) rather than copying existing ones (going from 1 to n).",
        "price": 27.00,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/6/6f/Zero_to_One.jpg"
    },
    {
        "book_id": "BK023",
        "title": "The Intelligent Investor",
        "author": "Benjamin Graham",
        "category": "business",
        "description": "The Intelligent Investor (1949) is a widely acclaimed book on value investing. Written by Benjamin Graham, it teaches readers strategies for investing in stocks and bonds. Warren Buffett has called it 'by far the best book on investing ever written.'",
        "price": 25.00,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/4/4c/The_Intelligent_Investor.jpg"
    },

    # Self-Help
    {
        "book_id": "BK024",
        "title": "Atomic Habits",
        "author": "James Clear",
        "category": "self-help",
        "description": "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones (2018) by James Clear is a self-help book that provides a comprehensive guide on how to change your habits and get 1% better every day. It focuses on small changes that lead to remarkable results.",
        "price": 21.00,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/1/1f/Atomic_Habits.jpg"
    },
    {
        "book_id": "BK025",
        "title": "The 7 Habits of Highly Effective People",
        "author": "Stephen R. Covey",
        "category": "self-help",
        "description": "The 7 Habits of Highly Effective People (1989) is a self-help book written by Stephen R. Covey. It has sold more than 25 million copies worldwide since its first publication. The book presents an approach to being effective in attaining goals by aligning oneself to 'true north' principles.",
        "price": 19.99,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/a/a2/The_7_Habits_of_Highly_Effective_People.jpg"
    },
    {
        "book_id": "BK026",
        "title": "How to Win Friends and Influence People",
        "author": "Dale Carnegie",
        "category": "self-help",
        "description": "How to Win Friends and Influence People (1936) is a self-help book by Dale Carnegie. It has sold over 30 million copies worldwide and is one of the best-selling books of all time. The book provides advice on how to successfully interact with people and win them over to your way of thinking.",
        "price": 16.00,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/5/55/How_to_Win_Friends_and_Influence_People.jpg"
    },

    # Children
    {
        "book_id": "BK027",
        "title": "Charlotte's Web",
        "author": "E.B. White",
        "category": "children",
        "description": "Charlotte's Web (1952) is a children's novel by American author E. B. White. It tells the story of a livestock pig named Wilbur and his friendship with a barn spider named Charlotte. When Wilbur is in danger of being slaughtered, Charlotte writes messages in her web praising Wilbur to save him.",
        "price": 9.99,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/5/51/CharlotteWeb.png"
    },
    {
        "book_id": "BK028",
        "title": "The Very Hungry Caterpillar",
        "author": "Eric Carle",
        "category": "children",
        "description": "The Very Hungry Caterpillar (1969) is a children's picture book designed, illustrated, and written by Eric Carle. It features a caterpillar who eats his way through a wide variety of foodstuffs before pupating and emerging as a butterfly. The book has been translated into over 60 languages.",
        "price": 10.99,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/4/45/The_Very_Hungry_Caterpillar_-_book_cover.jpg"
    },
    {
        "book_id": "BK029",
        "title": "Matilda",
        "author": "Roald Dahl",
        "category": "children",
        "description": "Matilda (1988) is a children's novel by British writer Roald Dahl. It tells the story of Matilda Wormwood, an extraordinarily gifted girl whose powers help her deal with her neglectful parents and a cruel headmistress, Miss Trunchbull. The book celebrates the power of reading and imagination.",
        "price": 11.50,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/3/3e/MatildaCover.jpg"
    },
    {
        "book_id": "BK030",
        "title": "Where the Wild Things Are",
        "author": "Maurice Sendak",
        "category": "children",
        "description": "Where the Wild Things Are (1963) is a children's picture book written and illustrated by Maurice Sendak. It follows Max, a young boy who sails to an island inhabited by the Wild Things, fearsome creatures who crown him their king. The book has sold over 19 million copies worldwide.",
        "price": 10.00,
        "is_available": True,
        "image_url": "https://upload.wikimedia.org/wikipedia/en/8/8f/Where_The_Wild_Things_Are_%28book%29_cover.jpg"
    },
]

def download_image(url, book_id):
    """Download image from URL and save to media directory"""
    if not url:
        return None

    try:
        # Create media directory if it doesn't exist
        media_root = settings.MEDIA_ROOT
        book_images_dir = os.path.join(media_root, 'book_images')
        os.makedirs(book_images_dir, exist_ok=True)

        # Download the image
        file_name = f"{book_id}_cover.jpg"
        file_path = os.path.join(book_images_dir, file_name)

        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ssl_context, timeout=10) as response:
            with open(file_path, 'wb') as f:
                f.write(response.read())

        return f"book_images/{file_name}"
    except Exception as e:
        print(f"    Warning: Could not download image for {book_id}: {e}")
        return None

def populate():
    print("=" * 60)
    print("Populating BookNest Database with Books")
    print("=" * 60)

    created_count = 0
    skipped_count = 0
    image_success = 0
    image_failed = 0

    for book_data in books_data:
        book_id = book_data["book_id"]
        title = book_data["title"]
        image_url = book_data.pop("image_url", None)

        # Check if book already exists
        if Book.objects.filter(book_id=book_id).exists():
            print(f"  [SKIP] Already exists: {title}")
            skipped_count += 1
            continue

        # Download image
        image_path = None
        if image_url:
            print(f"  [DOWNLOAD] Image for: {title}")
            image_path = download_image(image_url, book_id)
            if image_path:
                image_success += 1
            else:
                image_failed += 1

        # Create book
        book = Book.objects.create(**book_data)

        # Attach image if downloaded
        if image_path and os.path.exists(os.path.join(settings.MEDIA_ROOT, image_path)):
            with open(os.path.join(settings.MEDIA_ROOT, image_path), 'rb') as f:
                book.image.save(os.path.basename(image_path), File(f), save=True)
            print(f"  [CREATE] {title} (with image)")
        else:
            print(f"  [CREATE] {title} (no image)")

        created_count += 1

    print()
    print("=" * 60)
    print("POPULATION COMPLETE")
    print("=" * 60)
    print(f"  Books created:   {created_count}")
    print(f"  Books skipped:   {skipped_count}")
    print(f"  Images success:  {image_success}")
    print(f"  Images failed:   {image_failed}")
    print(f"  Total books:     {Book.objects.count()}")
    print("=" * 60)

    # Show category breakdown
    print("\nBooks by Category:")
    categories = Book.CATEGORY_CHOICES
    for cat_code, cat_name in categories:
        count = Book.objects.filter(category=cat_code).count()
        if count > 0:
            print(f"  {cat_name}: {count}")

if __name__ == "__main__":
    populate()