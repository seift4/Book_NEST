document.addEventListener('DOMContentLoaded', () => {

    const pathParts = window.location.pathname.split('/');
    const bookId = pathParts[pathParts.length - 2];

    fetch(`/api/book/${bookId}/`).then(response => response.json())
        .then(book => {
            document.getElementById('bookTitle').innerText = book.title || "No info.";
            document.getElementById('bookAuthor').innerText = book.author || "No info.";
            document.getElementById('bookCategory').innerText = book.category || "No info.";
            document.getElementById('bookStatus').innerHTML = book.is_available ? '<span class="status-available">Available</span>' : '<span class="status-borrowed">Borrowed</span>';
            document.getElementById('bookDescription').innerText = book.description || "No info.";

            const staticPath = "/static/images/";
            document.getElementById('bookCover').src = book.image ? book.image : staticPath + "no_cover_available.png";

            setupBorrowButton(bookId, book.is_available);
        })

        .catch(error => {console.error('Error fetching book:', error);
            alert("Failed to load book details");
        });
});

function setupBorrowButton(bookId, isAvailable) {
    const borrowBtn = document.getElementById('borrowBtn');
    
    if(!isAvailable) {
        borrowBtn.innerText = "Currently Unavailable";
        borrowBtn.disabled = true;
        borrowBtn.style.backgroundColor = "grey";
        borrowBtn.style.cursor = "not-allowed";
        return;
    }

    borrowBtn.onclick = () => {
        borrowBtn.disabled = true;
        borrowBtn.innerText = "Processing...";

        fetch(`/api/borrow-book/${bookId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
                // REMOVED: 'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        }).then(data => {
            if(data.success) {
                document.getElementById('bookStatus').innerHTML = '<span class="status-borrowed">Borrowed</span>';
                borrowBtn.innerText = "Already Borrowed";
                borrowBtn.style.backgroundColor = "grey";
                borrowBtn.style.cursor = "not-allowed";
                alert("Book borrowed successfully! Due: " + data.due_date);
            } 
            else {
                borrowBtn.disabled = false;
                borrowBtn.innerText = "Borrow This Book";
                alert(data.error || "Failed to borrow book");
            }
        })
        
        .catch(error => {
            console.error('Error:', error);
            borrowBtn.disabled = false;
            borrowBtn.innerText = "Borrow This Book";
            alert("An error occurred: " + error.message);
        });
    };
}