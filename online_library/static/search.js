var booksDatabase = [];
var searchHistory = [];

window.onload = function() {
    loadHistory();
    fetchBooksFromAPI();

    var form = document.getElementById("searchForm");
    if (form) {
        form.onsubmit = handleSearch;
    }
};

function fetchBooksFromAPI() {
    fetch("/api/books/")
        .then(response => response.json())
        .then(data => {
            booksDatabase = data.map(book => ({
                id: book.id,
                title: book.title,
                author: book.author,
                category: book.category,
                status: book.is_available ? "Available" : "Borrowed",
                coverImage: book.image || "no_cover_available.png",
                description: "No description available.",
                isAdminBook: false
            }));
            displayAllBooks();
        })
        .catch(error => {
            console.error("Error fetching books:", error);
            showMessage("Failed to load books from server.", "error");
        });
}

function displayAllBooks() {
    displayResults(booksDatabase, "", "All");
}

function handleSearch(event) {
    event.preventDefault(); 
    var searchTerm = document.getElementById("searchInput").value;

    if (searchTerm === "" || searchTerm.trim() === "") {
        showMessage("Please enter a search term!", "error");
        return false;
    }

    var searchType = getSelectedSearchType();
    performSearch(searchTerm, searchType);
    return true;
}

function performSearch(searchTerm, searchType) {
    var filteredBooks = [];
    var lowerTerm = searchTerm.toLowerCase();

    for (var i = 0; i < booksDatabase.length; i++) {
        var book = booksDatabase[i];

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

function displayResults(books, searchTerm, searchType) {
    var container = document.getElementById("resultsContainer");
    var statsDiv = document.getElementById("searchStats");

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

    var htmlContent = "";
    for (var i = 0; i < books.length; i++) {
        var book = books[i];
        var statusClass = (book.status === "Available") ? "status-available" : "status-borrowed";

        htmlContent += `
            <div class="book-card">
                <h4>📖 ${book.title}</h4>
                <p><b>Author:</b> ${book.author}</p>
                <p><b>Category:</b> ${book.category}</p>
                <p><b>Status:</b> <span class="${statusClass}">${book.status}</span></p>
                <button onclick="viewBook(${book.id})">View Details</button>
            </div>
        `;
    }

    container.innerHTML = htmlContent;
}

function getSelectedSearchType() {
    var radios = document.getElementsByName("search_by");
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            if (i === 0) return "All";
            if (i === 1) return "Title";
            if (i === 2) return "Author";
            if (i === 3) return "Category";
        }
    }
    return "All";
}

function showMessage(message, type) {
    var alertDiv = document.getElementById("alertMessage");
    if (!alertDiv) return;
    alertDiv.innerHTML = message;
    alertDiv.className = "alert " + type;
    alertDiv.style.display = "block";
    setTimeout(function() { alertDiv.style.display = "none"; }, 3000);
}

function addToHistory(term, type) {
    if (term === "") return;
    searchHistory.unshift({ word: term, searchBy: type, date: new Date().toLocaleString() });
    if (searchHistory.length > 5) searchHistory.pop();
    localStorage.setItem("mySearchHistory", JSON.stringify(searchHistory));
    displayHistory();
}

function loadHistory() {
    var saved = localStorage.getItem("mySearchHistory");
    if (saved) { searchHistory = JSON.parse(saved); displayHistory(); }
}

function displayHistory() {
    var historyDiv = document.getElementById("historyList");
    if (!historyDiv) return;
    if (searchHistory.length === 0) {
        historyDiv.innerHTML = "<span style='color:gray;'>No recent searches</span>";
        return;
    }
    var html = "";
    for (var i = 0; i < searchHistory.length; i++) {
        var item = searchHistory[i];
        html += '<div class="history-item" onclick="repeatSearch(\'' + item.word + '\', \'' + item.searchBy + '\')">';
        html += item.word + " (" + item.searchBy + ")</div>";
    }
    historyDiv.innerHTML = html;
}

function repeatSearch(term, type) {
    document.getElementById("searchInput").value = term;
    var radios = document.getElementsByName("search_by");
    var typeMap = {"All":0, "Title":1, "Author":2, "Category":3};
    var index = typeMap[type];
    if (index !== undefined && radios[index]) radios[index].checked = true;
    performSearch(term, type);
}

function viewBook(bookId) {
    window.location.href = "/user/book/" + bookId + "/";
}