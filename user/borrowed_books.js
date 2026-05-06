
document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    const title = params.get('title');

    // لو جه من صفحة الكتاب بعد الاستعارة - احفظ الكتاب في localStorage
    if (title) {
        const newBook = {
            title: title,
            author: params.get('author'),
            category: params.get('category'),
            dateBorrowed: params.get('dateBorrowed'),
            dueDate: params.get('dueDate')
        };

        // تحميل الكتب المستعارة الموجودة وإضافة الجديد
        let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
        
        // تحقق إنه مش موجود بالفعل
        const alreadyExists = borrowedBooks.some(b => b.title === newBook.title);
        if (!alreadyExists) {
            borrowedBooks.push(newBook);
            localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));
        }

        // نظف الـ URL من الـ params
        window.history.replaceState({}, document.title, "borrowed_books.html");
    }

    // عرض كل الكتب المستعارة من localStorage
    renderBorrowedBooks();
});

function renderBorrowedBooks() {
    const tableBody = document.getElementById("tableBody");
    if (!tableBody) return;

    let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];

    if (borrowedBooks.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px;">
                    <i>No books borrowed yet. Use the Search page to find a book!</i>
                </td>
            </tr>`;
        return;
    }

    tableBody.innerHTML = "";
    borrowedBooks.forEach(function(book, index) {
        const row = tableBody.insertRow(-1);
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.category}</td>
            <td>${book.dateBorrowed}</td>
            <td>${book.dueDate}</td>
            <td><button onclick="returnBook(${index})">Return</button></td>`;
    });
}

function returnBook(index) {
    let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
    borrowedBooks.splice(index, 1);
    localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));
    renderBorrowedBooks();
}
