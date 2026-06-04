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
            booksDatabase = data.map(book => {
                // معالجة رابط الصورة ديناميكياً بناءً على البيانات القادمة من السيرفر
                var processedCover = "/static/images/no_cover_available.png";
                if (book.image) {
                    if (book.image.startsWith('http://') || book.image.startsWith('https://') || book.image.startsWith('/')) {
                        processedCover = book.image;
                    } else {
                        processedCover = "/media/" + book.image;
                    }
                }

                return {
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    category: book.category,
                    status: book.is_available ? "Available" : "Borrowed",
                    coverImage: processedCover,
                    description: "No description available.",
                    isAdminBook: false
                };
            });
            displayAllBooks();
        })
        .catch(error => {
            console.error("Error fetching books:", error);
            showMessage("Failed to load books from server repository.", "error");
        });
}

function displayAllBooks() {
    displayResults(booksDatabase, "", "All");
}

function handleSearch(event) {
    event.preventDefault(); 
    var searchInput = document.getElementById("searchInput");
    if (!searchInput) return false;
    
    var searchTerm = searchInput.value;

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
            statsDiv.innerHTML = "Index Status: Showing " + books.length + " books";
        } else {
            statsDiv.innerHTML = "Found " + books.length + " result(s) for '" + searchTerm + "' in " + searchType;
        }
    }

    if (books.length === 0) {
        container.innerHTML = "<p class='no-results-msg'>No books to display</p>";
        return;
    }

    var htmlContent = "";
    for (var i = 0; i < books.length; i++) {
        var book = books[i];
        var statusBadgeClass = (book.status === "Available") ? "badge-available" : "badge-borrowed";

        htmlContent += `
            <div class="cyber-book-card">
                <div class="book-cover-frame">
                    <img src="${book.coverImage}" alt="${book.title}" onerror="this.src='/static/images/no_cover_available.png'">
                </div>
                <div class="book-info-block">
                    <h4>${book.title}</h4>
                    <span class="info-tag"><i class="fas fa-user-feather"></i> ${book.author}</span>
                    <span class="info-tag"><i class="fas fa-tags"></i> ${book.category}</span>
                    <div class="status-wrapper">
                        <span class="status-indicator ${statusBadgeClass}">${book.status}</span>
                    </div>
                </div>
                <button class="btn-view-details" onclick="viewBook(${book.id})">
                    <i class="fas fa-expand-arrows-alt"></i> Access Record
                </button>
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
    setTimeout(function() { alertDiv.style.display = "none"; }, 4000);
}

function addToHistory(term, type) {
    if (term === "" || term.trim() === "") return;
    if (searchHistory.length > 0 && searchHistory[0].word === term && searchHistory[0].searchBy === type) return;

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
        historyDiv.innerHTML = "<span class='no-history-text'>No recent searches</span>";
        return;
    }
    var html = "";
    for (var i = 0; i < searchHistory.length; i++) {
        var item = searchHistory[i];
        html += `
            <div class="history-tag" onclick="repeatSearch('${item.word.replace(/'/g, "\\'")}', '${item.searchBy}')">
                <i class="fas fa-code-branch"></i> ${item.word} <span class="history-type-label">${item.searchBy}</span>
            </div>
        `;
    }
    historyDiv.innerHTML = html;
}

function repeatSearch(term, type) {
    var searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = term;
    var radios = document.getElementsByName("search_by");
    var typeMap = {"All":0, "Title":1, "Author":2, "Category":3};
    var index = typeMap[type];
    if (index !== undefined && radios[index]) radios[index].checked = true;
    performSearch(term, type);
}

function viewBook(bookId) {
    window.location.href = "/user/book/" + bookId + "/";
}