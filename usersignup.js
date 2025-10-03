function signUp(role) {
  let firstName = document.getElementById("firstName").value.trim();
  let lastName = document.getElementById("lastName").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let repassword = document.getElementById("repassword").value.trim();
  let message = document.getElementById("message");

  if (!firstName || !lastName || !email || !password || !repassword) {
    message.innerText = "Please fill all fields!";
    message.style.color = "red";
    return;
  }

  if (password !== repassword) {
    message.innerText = "Passwords do not match!";
    message.style.color = "red";
    return;
  }

  let accounts = JSON.parse(localStorage.getItem("accounts")) || {};

  if (!accounts[role]) {
    accounts[role] = {};
  }

  if (accounts[role][email]) {
    message.innerText = "Account already exists!";
    message.style.color = "red";
  } else {
    // Store full details, not just password
    accounts[role][email] = { 
      firstName: firstName, 
      lastName: lastName, 
      password: password 
    };
    localStorage.setItem("accounts", JSON.stringify(accounts));

    message.innerText = "Account created successfully!";
    message.style.color = "green";
  }
}