// دالة لجلب الـ Token الأمني لـ Django
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function logout() {
    console.log("Logging out...");
    
    localStorage.removeItem("currentUser");
  
    window.location.href = "/logout/"; 
}

function checkPass() {
    const password = document.getElementById("pass").value;
    const confirmPassword = document.getElementById("confirmPass").value;
    const errorMsg = document.getElementById("error");

    if (password !== confirmPassword) {
        errorMsg.style.display = "block";
        errorMsg.innerText = "Passwords do not match!";
        return false;
    }
    return true;}