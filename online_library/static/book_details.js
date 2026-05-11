document.addEventListener('DOMContentLoaded', () => {

    const savedBook = localStorage.getItem('selectedBook');

    if (!savedBook) {
        alert("No book selected!");
        window.location.href = "/user/borrowed/";
        return;
    }

    const book = JSON.parse(savedBook);
    document.getElementById('bookTitle').innerText = book.title || "No info.";
    document.getElementById('bookAuthor').innerText = book.author || "No info.";
    document.getElementById('bookCategory').innerText = book.category || "No info.";
    document.getElementById('bookStatus').innerText = book.status || "No info.";
    document.getElementById('bookDescription').innerText = book.description || "No info.";

    const staticPath = "/static/images/"; 
    document.getElementById('bookCover').src = book.coverImage ? staticPath + book.coverImage : staticPath + "no_cover_available.png";

    const borrowBtn = document.getElementById('borrowBtn');
    
    if(book.status === "Borrowed") {
        borrowBtn.innerText = "Already Borrowed";
        borrowBtn.disabled = true;
        borrowBtn.style.backgroundColor = "grey";
        borrowBtn.style.cursor = "not-allowed";
    } 
    else if(borrowBtn) {

        borrowBtn.innerText = "Borrow";
        borrowBtn.disabled = false;
        borrowBtn.style.backgroundColor = "";
        borrowBtn.style.color = "";
        borrowBtn.style.cursor = "pointer";

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
            updateBookStatus(book.title, "Borrowed");

            localStorage.setItem('borrowedBooks', JSON.stringify(currentBorrowed));
            alert("Book borrowed successfully!");
            window.location.href = "/user/borrowed/";
        };
    }
});

function updateBookStatus(bookTitle, newStatus) {

    var books = JSON.parse(localStorage.getItem("defaultBooks")) || [];
    
    const defaultBook = books.find(b => b.title === bookTitle);
    if(defaultBook) {
        defaultBook.status = newStatus;
        localStorage.setItem("defaultBooks", JSON.stringify(books));
    }
    
    const savedBook = JSON.parse(localStorage.getItem('selectedBook'));
    if(savedBook && savedBook.title === bookTitle) {
        savedBook.status = newStatus;
        localStorage.setItem('selectedBook', JSON.stringify(savedBook));
    }
}