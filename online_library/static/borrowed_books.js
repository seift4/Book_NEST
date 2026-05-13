document.addEventListener('DOMContentLoaded', () => {
    fetchBorrowedBooks();
});

function fetchBorrowedBooks() {
    fetch('/api/my-borrowed-books/').then(response => response.json())
        .then(data => { displayBooks(data.records); }).catch(error => {
            console.error('Error fetching borrowed books:', error);
            
            document.getElementById('tableBody').innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 20px;">
                        <i>Error loading borrowed books. Please refresh.</i>
                    </td>
                </tr>
            `;
        });
}

function displayBooks(records) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    if(records.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px;">
                    <i>No books borrowed yet. Use the Search page to find a book!</i>
                </td>
            </tr>
        `;
        return;
    }

    records.forEach(record => {
        const row = tableBody.insertRow();
        row.setAttribute('data-record-id', record.id);
        
        row.innerHTML = `<td>${record.book_title}</td>
            <td>${record.book_author}</td>
            <td>${record.book_category}</td>
            <td>${record.date_borrowed}</td>
            <td>${record.due_date}</td>
            <td><button class="return-btn" onclick="returnBook(${record.id})">Return</button></td>`;
    });
}

function returnBook(recordId) {
    if(!confirm("Are you sure you want to return this book?")) return;

    fetch(`/api/return-book/${recordId}/`, {
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

            const row = document.querySelector(`tr[data-record-id="${recordId}"]`);
            if(row) row.remove();
            
            const tbody = document.getElementById('tableBody');

            if(tbody.children.length === 0) {
                tbody.innerHTML = `<tr>
                        <td colspan="6" style="text-align: center; padding: 20px;">
                            <i>No books borrowed yet. Use the Search page to find a book!</i>
                        </td>
                    </tr>`;
            }

            alert("Book returned successfully!");
        } 
        
        else {
            alert(data.error || "Failed to return book");
        }
    })

    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred while returning the book: " + error.message);
    });
}