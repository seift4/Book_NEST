
document.addEventListener('DOMContentLoaded', () => {
    
    
    const borrowedData = localStorage.getItem('borrowedBooks');
    const borrowedBooks = JSON.parse(borrowedData) || [];
    
    const table = document.querySelector("table");
    if (!table) {
        return;
    }

    
    if (borrowedBooks.length > 0) {
        
        
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }

        borrowedBooks.forEach((book, index) => {
            const row = table.insertRow(-1); 
            row.innerHTML = `
                <td> 
                    <a href="book_details.html?id=${book.id}">
                    ${book.title || 'Unknown'}
                    </a>
                </td>
                <td>${book.author || 'Unknown'}</td>
                <td>${book.category || 'N/A'}</td>
                <td>${book.dateBorrowed || 'N/A'}</td>
                <td>${book.dueDate || 'N/A'}</td>
                <td>
                    <center>
                        <button type="button" onclick="returnBook(${index})" style="background-color: #2643D1; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                            Return
                        </button>
                    </center>
                </td>
            `;
        });
    } 
});


function returnBook(index) {
    let borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
    borrowedBooks.splice(index, 1);
    localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
    location.reload();
}
