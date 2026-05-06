
function displayBooks() {

    const tableBody = document.getElementById("tableBody");
    const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];

    tableBody.innerHTML = "";

    if(borrowedBooks.length === 0) {
        tableBody.innerHTML = `<tr>
                <td colspan="6" style="text-align: center; padding: 20px;"> 
                    <i>No books borrowed yet. Use the Search page to find a book!</i> 
                </td>
            </tr>`;
        return;
    }

    borrowedBooks.forEach((book, index) => {
        const row = tableBody.insertRow();

        row.innerHTML = `<td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.category}</td>
            <td>${book.dateBorrowed}</td>
            <td>${book.dueDate}</td>
            <td><button onclick="returnBook(${index})">Return</button></td>
        `;
    });
}
document.addEventListener('DOMContentLoaded', () => { displayBooks(); });

function returnBook(index) {
    let borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];

    borrowedBooks.splice(index, 1);
    
    localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
    displayBooks();
}