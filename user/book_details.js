document.addEventListener('DOMContentLoaded', () => {
    
    const book = JSON.parse(localStorage.getItem('selectedBook'));

    if (book) {
        
        document.getElementById('bookTitle').innerText = book.title;
        document.getElementById('bookAuthor').innerText = book.author;
        document.getElementById('bookCategory').innerText = book.category;
        document.getElementById('bookStatus').innerText = book.status;
        document.getElementById('bookDescription').innerText = book.description || "No info.";
        if(book.coverImage) document.getElementById('bookCover').src = book.coverImage;
        else document.getElementById('bookCover').src = "no_cover_available.png";

        const borrowBtn = document.getElementById('borrowBtn');
        if (borrowBtn) {
            borrowBtn.onclick = () => {
                let borrowed = JSON.parse(localStorage.getItem('borrowedBooks')) || [];

                
                const isAlreadyBorrowed = borrowed.some(b => b.title === book.title);

                if (isAlreadyBorrowed) {
                    alert("You have already borrowed this book!");
                    return; 
                }
                
                if (book.status === "Borrowed") {
                    alert("This book is currently borrowed by someone else.");
                    return;
                }

                
                const today = new Date();
                const due = new Date();
                due.setDate(today.getDate() + 14);

                const bookToSave = {
                    ...book,
                    dateBorrowed: today.toDateString(), 
                    dueDate: due.toDateString()
                };

                borrowed.push(bookToSave);
                localStorage.setItem('borrowedBooks', JSON.stringify(borrowed));
                
                alert("Book borrowed successfully!");
                window.location.href = 'borrowed_books.html';
            };

        }
    }
});
