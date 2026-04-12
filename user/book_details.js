document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    
    const book = {
        title: params.get('title'),
        author: params.get('author'),
        category: params.get('category'),
        status: params.get('status'), 
        description: params.get('description'),
        image: params.get('image')
    };

    if (book.title) {
        document.getElementById('bookTitle').innerText = book.title;
        document.getElementById('bookAuthor').innerText = book.author;
        document.getElementById('bookCategory').innerText = book.category;
        document.getElementById('bookStatus').innerText = book.status;
        document.getElementById('bookDescription').innerText = book.description;
        document.getElementById('bookCover').src = book.image || "no_cover_available.png";


        const borrowBtn = document.getElementById('borrowBtn');
        
        
        if (book.status === "Borrowed") {
            borrowBtn.innerText = "Already Borrowed";
            borrowBtn.disabled = true;
            borrowBtn.style.backgroundColor = "grey";
            borrowBtn.style.cursor = "not-allowed";
        } 
        else if (borrowBtn) {
            
            borrowBtn.onclick = () => {
                const today = new Date();
                const due = new Date();
                due.setDate(today.getDate() + 14);

                alert("Book borrowed successfully!");

                const borrowedParams = new URLSearchParams({
                    title: book.title,
                    author: book.author,
                    category: book.category,
                    dateBorrowed: today.toDateString(),
                    dueDate: due.toDateString()
                });

                window.location.href = `borrowed_books.html?${borrowedParams.toString()}`;
            };
        }
    }
});