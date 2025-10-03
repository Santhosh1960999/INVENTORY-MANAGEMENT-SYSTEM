function togglePassword() {
  let passwordInput = document.getElementById("password");
  let showPass = document.getElementById("showPass");

  if (showPass.checked) {
    passwordInput.type = "text"; // show password
  } else {
    passwordInput.type = "password"; // hide password
  }
}

function login(role) {
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let message = document.getElementById("message");

  if (!email || !password) {
    message.innerText = "Please fill all fields!";
    message.style.color = "red";
    return;
  }

  let accounts = JSON.parse(localStorage.getItem("accounts")) || {};

  if (
    accounts[role] &&
    accounts[role][email] &&
    accounts[role][email].password === password
  ) {
    message.innerText = "Login successful! Redirecting...";
    message.style.color = "green";

    setTimeout(() => {
      window.location.href = "http://127.0.0.1:5500/Interface.html"; 
    }, 1000);

  } else {
    message.innerText = "Invalid email or password!";
    message.style.color = "red";
  }
}