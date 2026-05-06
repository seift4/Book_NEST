
document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    const title = params.get('title');

    if(title) {
        const table = document.querySelector("table");
        
        if(table.rows.length > 1) {
            table.deleteRow(1);
        }
        
        const row = table.insertRow(-1);

        row.innerHTML = `<td>${title}</td>
            <td>${params.get('author')}</td>
            <td>${params.get('category')}</td>
            <td>${params.get('dateBorrowed')}</td>
            <td>${params.get('dueDate')}</td>
            <td><button onclick="returnBook(this)">Return</button></td>`;
    }
});

function returnBook(button) {
    const table = document.querySelector("table");
    const row = button.closest('tr');
    
    row.remove();
    if(table.rows.length === 1) {
        const emptyRow = table.insertRow(-1);
        emptyRow.innerHTML = `
            <td colspan="6" style="text-align: center; padding: 20px;"> 
                <i>No books borrowed yet. Use the Search page to find a book!</i> 
            </td>`;
    }
}