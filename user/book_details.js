document.addEventListener('DOMContentLoaded', () => {

    const savedBook = localStorage.getItem('selectedBook');

    if (!savedBook) {
        alert("No book selected!");
        window.location.href = "search.html";
        return;
    }

    const book = JSON.parse(savedBook);
    document.getElementById('bookTitle').innerText = book.title || "No info.";
    document.getElementById('bookAuthor').innerText = book.author || "No info.";
    document.getElementById('bookCategory').innerText = book.category || "No info.";
    document.getElementById('bookStatus').innerText = book.status || "No info.";
    document.getElementById('bookDescription').innerText = book.description || "No info.";
    document.getElementById('bookCover').src = book.coverImage || "no_cover_available.png";

    const borrowBtn = document.getElementById('borrowBtn');
    
    if(book.status === "Borrowed") {
        borrowBtn.innerText = "Already Borrowed";
        borrowBtn.disabled = true;
        borrowBtn.style.backgroundColor = "grey";
        borrowBtn.style.cursor = "not-allowed";
    } 
    else if(borrowBtn) {
        
        borrowBtn.onclick = () => {
            const today = new Date();
            const due = new Date();
            due.setDate(today.getDate() + 14);

            const newBook = {
            title: book.title,
            author: book.author,
            category: book.category,
            dateBorrowed: today.toDateString(),
            dueDate: due.toDateString()
            };

            const currentBorrowed = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
            currentBorrowed.push(newBook);
            localStorage.setItem('borrowedBooks', JSON.stringify(currentBorrowed));
            alert("Book borrowed successfully!");
            window.location.href = "borrowed_books.html";
        };
    }
});