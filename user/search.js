// ------------------------------------------------------------
// بيانات الكتب (تم تخزينها هنا عشان ميبقاش في hard coded values)
// ------------------------------------------------------------
var booksDatabase = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Classic",
        status: "Available"
    },
    {
        id: 2,
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Programming",
        status: "Borrowed"
    },
    {
        id: 3,
        title: "Harry Potter",
        author: "J.K. Rowling",
        category: "Fantasy",
        status: "Available"
    }
];

// ------------------------------------------------------------
// سجل البحث (بيتخزن في localStorage)
// ------------------------------------------------------------
var searchHistory = [];

// ------------------------------------------------------------
// لما الصفحة تفتح، ننفذ الكود ده
// ------------------------------------------------------------
window.onload = function() {
    loadHistory();
    displayAllBooks();
    
    var form = document.getElementById("searchForm");
    if (form) {
        form.onsubmit = handleSearch;
    }
};

// ------------------------------------------------------------
// عرض كل الكتب (لما الصفحة تفتح أول مرة)
// ------------------------------------------------------------
function displayAllBooks() {
    displayResults(booksDatabase, "", "All");
}

// ------------------------------------------------------------
// دالة البحث الرئيسية
// ------------------------------------------------------------
function handleSearch(event) {
    event.preventDefault(); // منع إعادة تحميل الصفحة
    
    // 1. نجيب النص اللي كتبه المستخدم
    var searchTerm = document.getElementById("searchInput").value;
    
    // 2. VALIDATION: نتأكد إنه مش فاضي
    if (searchTerm === "" || searchTerm.trim() === "") {
        showMessage("Please enter a search term!", "error");
        return false;
    }
    
    // 3. نجيب نوع البحث (All, Title, Author, Category)
    var searchType = getSelectedSearchType();
    
    // 4. ننفذ البحث
    performSearch(searchTerm, searchType);
    
    return true;
}

// ------------------------------------------------------------
// دالة تنفيذ البحث الفعلية
// ------------------------------------------------------------
function performSearch(searchTerm, searchType) {
    var filteredBooks = [];
    var lowerTerm = searchTerm.toLowerCase();
    
    // تصفية الكتب حسب نوع البحث
    for (var i = 0; i < booksDatabase.length; i++) {
        var book = booksDatabase[i];
        
        if (searchType === "All") {
            if (book.title.toLowerCase().indexOf(lowerTerm) !== -1 ||
                book.author.toLowerCase().indexOf(lowerTerm) !== -1 ||
                book.category.toLowerCase().indexOf(lowerTerm) !== -1) {
                filteredBooks.push(book);
            }
        }
        else if (searchType === "Title") {
            if (book.title.toLowerCase().indexOf(lowerTerm) !== -1) {
                filteredBooks.push(book);
            }
        }
        else if (searchType === "Author") {
            if (book.author.toLowerCase().indexOf(lowerTerm) !== -1) {
                filteredBooks.push(book);
            }
        }
        else if (searchType === "Category") {
            if (book.category.toLowerCase().indexOf(lowerTerm) !== -1) {
                filteredBooks.push(book);
            }
        }
    }
    
    // حفظ البحث في السجل
    addToHistory(searchTerm, searchType);
    
    // عرض النتائج
    displayResults(filteredBooks, searchTerm, searchType);
    
    // لو مفيش نتائج، نعرض رسالة
    if (filteredBooks.length === 0) {
        showMessage("No books found for '" + searchTerm + "'", "error");
    }
}

// ------------------------------------------------------------
// دالة لعرض النتائج على الصفحة
// ------------------------------------------------------------
function displayResults(books, searchTerm, searchType) {
    var container = document.getElementById("resultsContainer");
    var statsDiv = document.getElementById("searchStats");
    
    if (!container) return;
    
    // تحديث إحصائية البحث
    if (statsDiv) {
        if (searchTerm === "") {
            statsDiv.innerHTML = "Showing all " + books.length + " books";
        } else {
            statsDiv.innerHTML = "Found " + books.length + " result(s) for '" + searchTerm + "' in " + searchType;
        }
    }
    
    // لو مفيش كتب
    if (books.length === 0) {
        container.innerHTML = "<p style='color:gray;'>No books to display</p>";
        return;
    }
    
    // بناء HTML لكل كتاب
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
                <a href="book_details.html?id=${book.id}">View Details →</a>
            </div>
        `;
    }
    
    container.innerHTML = htmlContent;
}

// ------------------------------------------------------------
// دالة لمعرفة نوع البحث المختار من الراديو
// ------------------------------------------------------------
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
    
    return "All"; // default
}

// ------------------------------------------------------------
// دالة لإظهار رسائل (خطأ أو تأكيد)
// ------------------------------------------------------------
function showMessage(message, type) {
    var alertDiv = document.getElementById("alertMessage");
    if (!alertDiv) return;
    
    alertDiv.innerHTML = message;
    alertDiv.className = "alert " + type;
    
    // إخفاء الرسالة بعد 3 ثواني
    setTimeout(function() {
        alertDiv.style.display = "none";
    }, 3000);
}

// ------------------------------------------------------------
// دوال سجل البحث (Search History) باستخدام localStorage
// ------------------------------------------------------------

// إضافة بحث جديد للسجل
function addToHistory(term, type) {
    if (term === "") return;
    
    var searchRecord = {
        word: term,
        searchBy: type,
        date: new Date().toLocaleString()
    };
    
    // نضيف في البداية
    searchHistory.unshift(searchRecord);
    
    // نخلي آخر 5 بس
    if (searchHistory.length > 5) {
        searchHistory.pop();
    }
    
    // نحفظ في localStorage
    localStorage.setItem("mySearchHistory", JSON.stringify(searchHistory));
    
    // نعرض السجل المحدث
    displayHistory();
}

// تحميل السجل من localStorage
function loadHistory() {
    var saved = localStorage.getItem("mySearchHistory");
    if (saved) {
        searchHistory = JSON.parse(saved);
        displayHistory();
    }
}

// عرض السجل على الصفحة
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
        html += item.word + " (" + item.searchBy + ")";
        html += '</div>';
    }
    
    historyDiv.innerHTML = html;
}

// تكرار بحث قديم (لما المستخدم يدوس على حاجة من السجل)
function repeatSearch(term, type) {
    document.getElementById("searchInput").value = term;
    
    // نحدد الراديو المناسب
    var radios = document.getElementsByName("search_by");
    var typeMap = {"All":0, "Title":1, "Author":2, "Category":3};
    var index = typeMap[type];
    if (index !== undefined && radios[index]) {
        radios[index].checked = true;
    }
    
    // ننفذ البحث
    performSearch(term, type);
}