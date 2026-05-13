
// ====== الكتب الأساسية في المشروع ======
var defaultBooks = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Classic",
        status: "Available",
        coverImage: "The_Great_Gatsby_Cover_1925_Retouched.jpg",
        description: "The Great Gatsby (1925) by F. Scott Fitzgerald is a classic American novel set in the Roaring Twenties. Narrated by Nick Carraway, it explores themes of love, obsession, and the corruption of the American Dream as mysterious millionaire Jay Gatsby tries to win back his former love, Daisy Buchanan, amid the decadence of Long Island."
    },
    {
        id: 2,
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Programming",
        status: "Borrowed",
        coverImage: "71nj3JM-igL._AC_UF1000,1000_QL80_.jpg",
        description: "A foundational programming book that teaches developers how to write, read, and clean code. It highlights that 'clean' code is readable, simple, maintainable, and efficient, helping developers avoid the technical debt and failure caused by poorly written software"
    },
    {
        id: 3,
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        category: "Fantasy",
        status: "Available",
        coverImage: "9781408855652.jpg",
        description: "Harry Potter and the Philosopher's Stone (1997) by J.K. Rowling is a fantasy novel introducing an orphaned boy who discovers on his eleventh birthday that he is a wizard. Harry escapes his abusive aunt and uncle to attend Hogwarts School of Witchcraft and Wizardry, making friends (Ron and Hermione) and uncovering a plot to steal an ancient stone."
    }
];
// إضافة localStorage
if (!localStorage.getItem("defaultBooks")) {
    localStorage.setItem("defaultBooks", JSON.stringify(defaultBooks));
}

// ====== تحميل كل الكتب (الأساسية + اللي أضافها الأدمن) ======
function getAllBooks() {
    //  تعديل: جلب الكتب الأساسية من localStorage مش من defaultBooks الثابتة
    let defaultBooksFromStorage = JSON.parse(localStorage.getItem("defaultBooks")) || defaultBooks;
    var adminBooks = JSON.parse(localStorage.getItem("books")) || [];

    var formattedAdminBooks = adminBooks.map(function(book, index) {
        return {
            id: "admin_" + index,
            title: book.title || "No Title",
            author: book.author || "Unknown",
            category: book.category || "General",
            status: book.status || "Available",
            coverImage: book.image || "no_cover_available.png",
            description: book.description || "No description available.",
            isAdminBook: true
        };
    });

    return defaultBooksFromStorage.concat(formattedAdminBooks);
}
// ====== Phase 3: البحث باستخدام Django API ======

let booksDatabase = [];
let searchHistory = [];

// تحميل الصفحة
window.onload = function() {
    fetchBooksFromAPI();
    loadHistory();
    
    let form = document.getElementById("searchForm");
    if (form) {
        form.onsubmit = handleSearch;
    }
};

// ====== جلب الكتب من Django API ======
function fetchBooksFromAPI() {
    fetch('/api/books/')
        .then(response => response.json())
        .then(data => {
            booksDatabase = data.map(book => ({
                id: book.id,
                title: book.title || "No Title",
                author: book.author || "Unknown",
                category: book.category || "General",
                status: book.is_available === true ? "Available" : "Borrowed",
                coverImage: book.image || "/static/images/no_cover_available.png",
                description: book.description || "No description available."
            }));
            displayAllBooks();
        })
        .catch(error => {
            console.error("Error fetching books:", error);
            showMessage("Failed to load books from server!", "error");
        });
}

// ====== عرض جميع الكتب ======
function displayAllBooks() {
    displayResults(booksDatabase, "", "All");
}

// ====== معالجة البحث ======
function handleSearch(event) {
    event.preventDefault(); 
    let searchTerm = document.getElementById("searchInput").value;
    
    if (searchTerm === "" || searchTerm.trim() === "") {
        showMessage("Please enter a search term!", "error");
        return false;
    }
    
    let searchType = getSelectedSearchType();
    performSearch(searchTerm, searchType);
    return true;
}

// ====== تنفيذ البحث ======
function performSearch(searchTerm, searchType) {
    let filteredBooks = [];
    let lowerTerm = searchTerm.toLowerCase();

    for (let i = 0; i < booksDatabase.length; i++) {
        let book = booksDatabase[i];
        
        if (searchType === "All") {
            if (book.title.toLowerCase().indexOf(lowerTerm) !== -1 ||
                book.author.toLowerCase().indexOf(lowerTerm) !== -1 ||
                book.category.toLowerCase().indexOf(lowerTerm) !== -1) {
                filteredBooks.push(book);
            }
        } else if (searchType === "Title") {
            if (book.title.toLowerCase().indexOf(lowerTerm) !== -1) filteredBooks.push(book);
        } else if (searchType === "Author") {
            if (book.author.toLowerCase().indexOf(lowerTerm) !== -1) filteredBooks.push(book);
        } else if (searchType === "Category") {
            if (book.category.toLowerCase().indexOf(lowerTerm) !== -1) filteredBooks.push(book);
        }
    }
    
    addToHistory(searchTerm, searchType);
    displayResults(filteredBooks, searchTerm, searchType);
    
    if (filteredBooks.length === 0) {
        showMessage("No books found for '" + searchTerm + "'", "error");
    }
}

// ====== عرض النتائج ======
function displayResults(books, searchTerm, searchType) {
    let container = document.getElementById("resultsContainer");
    let statsDiv = document.getElementById("searchStats");
    
    if (!container) return;
    
    if (statsDiv) {
        if (searchTerm === "") {
            statsDiv.innerHTML = "Showing all " + books.length + " books";
        } else {
            statsDiv.innerHTML = "Found " + books.length + " result(s) for '" + searchTerm + "' in " + searchType;
        }
    }
    
    if (books.length === 0) {
        container.innerHTML = "<p style='color:gray;'>No books to display</p>";
        return;
    }
    
    let htmlContent = "";
    for (let i = 0; i < books.length; i++) {
        let book = books[i];
        let statusClass = (book.status === "Available") ? "status-available" : "status-borrowed";
        
        htmlContent += `
            <div class="book-card">
                <h4>📖 ${escapeHtml(book.title)}</h4>
                <p><b>Author:</b> ${escapeHtml(book.author)}</p>
                <p><b>Category:</b> ${escapeHtml(book.category)}</p>
                <p><b>Status:</b> <span class="${statusClass}">${book.status}</span></p>
                <button onclick="viewBook(${i})">View Details</button>
            </div>
        `;
    }
    
    container.innerHTML = htmlContent;
}

// ====== منع الـ XSS (أمان) ======
function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ====== الحصول على نوع البحث ======
function getSelectedSearchType() {
    let radios = document.getElementsByName("search_by");
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            if (i === 0) return "All";
            if (i === 1) return "Title";
            if (i === 2) return "Author";
            if (i === 3) return "Category";
        }
    }
    return "All";
}

// ====== عرض رسالة ======
function showMessage(message, type) {
    let alertDiv = document.getElementById("alertMessage");
    if (!alertDiv) return;
    alertDiv.innerHTML = message;
    alertDiv.className = "alert " + type;
    alertDiv.style.display = "block";
    setTimeout(function() { alertDiv.style.display = "none"; }, 3000);
}

// ====== إضافة إلى تاريخ البحث ======
function addToHistory(term, type) {
    if (term === "") return;
    searchHistory.unshift({ word: term, searchBy: type, date: new Date().toLocaleString() });
    if (searchHistory.length > 5) searchHistory.pop();
    localStorage.setItem("mySearchHistory", JSON.stringify(searchHistory));
    displayHistory();
}

// ====== تحميل تاريخ البحث ======
function loadHistory() {
    let saved = localStorage.getItem("mySearchHistory");
    if (saved) { searchHistory = JSON.parse(saved); displayHistory(); }
}

// ====== عرض تاريخ البحث ======
function displayHistory() {
    let historyDiv = document.getElementById("historyList");
    if (!historyDiv) return;
    if (searchHistory.length === 0) {
        historyDiv.innerHTML = "<span style='color:gray;'>No recent searches</span>";
        return;
    }
    let html = "";
    for (let i = 0; i < searchHistory.length; i++) {
        let item = searchHistory[i];
        html += '<div class="history-item" onclick="repeatSearch(\'' + item.word + '\', \'' + item.searchBy + '\')">';
        html += item.word + " (" + item.searchBy + ")</div>";
    }
    historyDiv.innerHTML = html;
}

// ====== تكرار البحث ======
function repeatSearch(term, type) {
    document.getElementById("searchInput").value = term;
    let radios = document.getElementsByName("search_by");
    let typeMap = {"All":0, "Title":1, "Author":2, "Category":3};
    let index = typeMap[type];
    if (index !== undefined && radios[index]) radios[index].checked = true;
    performSearch(term, type);
}

// ====== عرض تفاصيل الكتاب ======
function viewBook(index) {
    const book = booksDatabase[index];
    window.location.href = "/user/book/" + book.id + "/";
}

