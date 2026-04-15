// ===== Signup =====
function checkPass() {
  const password = document.getElementById("pass").value;
  const confirmPassword = document.getElementById("confirmPass").value;

  if (password !== confirmPassword) {
    document.getElementById("error").style.display = "block";
    return false;
  }

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const role = document.querySelector('input[name="is_admin"]:checked').value;

  const user = {
    username: username,
    email: email,
    password: password,
    role: role
  };

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Signup successful!");
  window.location.href = "login.html";

  return false;
}

// ===== Remove error =====
function removeError() {
  document.getElementById("error").style.display = "none";
}

// ===== Login =====
function loginUser() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(u =>
    (u.username === username || u.email === username) &&
    u.password === password
  );

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));

    if (user.role === "Admin") {
      window.location.href = "admin/admin_home.html";
    } else {
      window.location.href = "user/user_home.html";
    }
  } else {
    alert("Wrong username or password");
  }

  return false;
}

// ===== Logout =====
function logout() {
  console.log("Logout clicked");
  localStorage.removeItem("currentUser");
  window.location.href = "../login.html";
}