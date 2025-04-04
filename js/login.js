document.addEventListener("DOMContentLoaded", function () {
    // Get UI elements
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const loginTab = document.getElementById("login-tab");
    const signupTab = document.getElementById("signup-tab");
    const switchToLogin = document.getElementById("switch-to-login");
    const switchToSignup = document.getElementById("switch-to-signup");
    const loginMessage = document.getElementById("login-message");
    const signupMessage = document.getElementById("signup-message");

    // Switch between Login and Signup tabs
    switchToSignup.addEventListener("click", function () {
        loginTab.style.display = "none";
        signupTab.style.display = "block";
    });

    switchToLogin.addEventListener("click", function () {
        signupTab.style.display = "none";
        loginTab.style.display = "block";
    });

    // Handle Signup
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("signup-name").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const password = document.getElementById("signup-password").value;
        const role = document.getElementById("signup-role").value; // Get user role

        if (!name || !email || !password || !role) {
            signupMessage.innerText = "All fields are required!";
            signupMessage.style.color = "red";
            return;
        }

        if (localStorage.getItem(email)) {
            signupMessage.innerText = "User already exists!";
            signupMessage.style.color = "red";
            return;
        }

        // Store user data including role
        localStorage.setItem(email, JSON.stringify({ name, password, role }));
        signupMessage.innerText = "Signup successful! You can now log in.";
        signupMessage.style.color = "green";

        // Automatically switch to login tab after successful signup
        setTimeout(() => {
            signupTab.style.display = "none";
            loginTab.style.display = "block";
        }, 1500);
    });

    // Handle Login
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;

        const storedUser = localStorage.getItem(email);
        if (!storedUser) {
            loginMessage.innerText = "User not found! Please sign up.";
            loginMessage.style.color = "red";
            return;
        }

        const userData = JSON.parse(storedUser);
        if (userData.password !== password) {
            loginMessage.innerText = "Incorrect password!";
            loginMessage.style.color = "red";
            return;
        }

        loginMessage.innerText = "Login successful! Redirecting...";
        loginMessage.style.color = "green";

        // Store logged-in user info
        localStorage.setItem("loggedInUser", JSON.stringify(userData));

        // Redirect based on role
        setTimeout(() => {
            if (userData.role === "student") {
                window.location.href = "student-dashboard.html";
            } else if (userData.role === "teacher") {
                window.location.href = "faculty-dashboard.html";
            } else {
                window.location.href = "admin-dashboard.html"; // Default
            }
        }, 1500);
    });
});
