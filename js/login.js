// Import Firebase functions
import { auth, firestore } from "./firebase_config.js";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged,
    updateProfile
} from "firebase/auth";
import { 
    doc, 
    setDoc, 
    getDoc 
} from "firebase/firestore";

// Ensure DOM elements exist before proceeding
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded - initializing authentication elements");
    
    // Tab navigation elements
    const loginTab = document.getElementById("login-tab");
    const signupTab = document.getElementById("signup-tab");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const switchToSignup = document.getElementById("switch-to-signup");
    const switchToLogin = document.getElementById("switch-to-login");
    const loginMessage = document.getElementById("login-message");
    const signupMessage = document.getElementById("signup-message");

    // Form elements
    const loginButton = document.querySelector(".login-btn");
    const signupButton = document.querySelector(".signup-btn");
    const logoutButton = document.querySelector(".logout-btn");
    
    // Login form fields
    const loginEmail = document.getElementById("login-email");
    const loginPassword = document.getElementById("login-password");
    
    // Signup form fields
    const signupName = document.getElementById("signup-name");
    const signupEmail = document.getElementById("signup-email");
    const signupPassword = document.getElementById("signup-password");
    const signupConfirm = document.getElementById("signup-confirm");

    // Tab switching functionality
    function switchTab(activeTab, activeForm, activeMessage, inactiveTab, inactiveForm, inactiveMessage) {
        if (!activeTab || !activeForm || !activeMessage || !inactiveTab || !inactiveForm || !inactiveMessage) {
            console.error("Missing elements for tab switching");
            return;
        }
        
        activeTab.classList.add("active");
        activeForm.classList.add("active");
        activeMessage.style.display = "block";
        inactiveTab.classList.remove("active");
        inactiveForm.classList.remove("active");
        inactiveMessage.style.display = "none";
    }

    // Switch to signup tab
    if (signupTab) {
        signupTab.addEventListener("click", () => {
            console.log("Switching to signup tab");
            switchTab(signupTab, signupForm, signupMessage, loginTab, loginForm, loginMessage);
        });
    } else {
        console.warn("Signup tab element not found");
    }

    // Switch to login tab
    if (loginTab) {
        loginTab.addEventListener("click", () => {
            console.log("Switching to login tab");
            switchTab(loginTab, loginForm, loginMessage, signupTab, signupForm, signupMessage);
        });
    } else {
        console.warn("Login tab element not found");
    }

    // Alternative tab switches
    if (switchToSignup) {
        switchToSignup.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("Switching to signup via link");
            switchTab(signupTab, signupForm, signupMessage, loginTab, loginForm, loginMessage);
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("Switching to login via link");
            switchTab(loginTab, loginForm, loginMessage, signupTab, signupForm, signupMessage);
        });
    }

    // Activate role selector functionality
    const roleOptions = document.querySelectorAll('.role-option');
    let selectedRole = "student"; // Default role
    
    if (roleOptions.length > 0) {
        console.log("Role options found:", roleOptions.length);
        
        roleOptions.forEach(option => {
            option.addEventListener('click', function() {
                console.log("Role selected:", this.getAttribute('data-role'));
                // Remove active class from all options
                roleOptions.forEach(opt => opt.classList.remove('active'));
                // Add active class to selected option
                this.classList.add('active');
                // Update selected role
                selectedRole = this.getAttribute('data-role');
            });
        });
    } else {
        console.warn("No role option elements found");
    }

    // Handle Login
    if (loginButton) {
        loginButton.addEventListener("click", function() {
            const email = loginEmail.value.trim();
            const password = loginPassword.value.trim();
            
            console.log("Login attempt with email:", email);

            if (email && password) {
                signInWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        console.log("User logged in successfully:", user.email);
                        
                        // Get user data from Firestore
                        getUserData(user.uid).then((userData) => {
                            if (userData) {
                                // Store user data in session storage
                                sessionStorage.setItem("userData", JSON.stringify(userData));
                                console.log("User data stored in session:", userData);
                                
                                alert(`Logged in as ${user.email}`);
                                window.location.href = "dashboard.html"; // Redirect after login
                            } else {
                                console.warn("No user data found in Firestore");
                                alert(`Logged in as ${user.email} but no profile data found.`);
                                window.location.href = "dashboard.html";
                            }
                        }).catch(error => {
                            console.error("Error fetching user data:", error);
                            alert("Logged in but could not fetch user data. Please contact support.");
                        });
                    })
                    .catch((error) => {
                        console.error("Login error:", error.code, error.message);
                        alert("Login Failed: " + error.message);
                    });
            } else {
                alert("Please enter email and password.");
            }
        });
    } else {
        console.warn("Login button not found");
    }

    // Handle Signup
    if (signupButton) {
        signupButton.addEventListener("click", function() {
            const name = signupName.value.trim();
            const email = signupEmail.value.trim();
            const password = signupPassword.value.trim();
            const confirmPassword = signupConfirm.value.trim();
            
            console.log("Signup attempt with email:", email, "and role:", selectedRole);

            // Validation
            if (!name) {
                alert("Please enter your name.");
                return;
            }
            
            if (!email) {
                alert("Please enter your email.");
                return;
            }
            
            if (password.length < 6) {
                alert("Password should be at least 6 characters.");
                return;
            }
            
            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            // Create new user
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log("User created:", user.uid);
                    
                    // Update user profile with display name
                    return updateProfile(user, {
                        displayName: name
                    }).then(() => {
                        console.log("Profile updated with name:", name);
                        return user;
                    });
                })
                .then((user) => {
                    // Store additional user data in Firestore
                    const userData = {
                        name: name,
                        email: email,
                        role: selectedRole,
                        createdAt: new Date().toISOString()
                    };
                    
                    return saveUserData(user.uid, userData).then(() => {
                        // Store in session for immediate use
                        sessionStorage.setItem("userData", JSON.stringify(userData));
                        return user;
                    });
                })
                .then((user) => {
                    console.log("Complete signup process finished for:", user.email);
                    alert("Signup Successful!");
                    window.location.href = "dashboard.html"; // Redirect after signup
                })
                .catch((error) => {
                    console.error("Signup error:", error.code, error.message);
                    alert("Signup Failed: " + error.message);
                });
        });
    } else {
        console.warn("Signup button not found");
    }

    // Save user data to Firestore
    async function saveUserData(userId, userData) {
        try {
            await setDoc(doc(firestore, "users", userId), userData);
            console.log("User data saved successfully to Firestore");
            return true;
        } catch (error) {
            console.error("Error saving user data:", error);
            throw error;
        }
    }
    
    // Get user data from Firestore
    async function getUserData(userId) {
        try {
            const docRef = doc(firestore, "users", userId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                console.log("User data retrieved from Firestore");
                return docSnap.data();
            } else {
                console.log("No user data found in Firestore");
                return null;
            }
        } catch (error) {
            console.error("Error getting user data:", error);
            throw error;
        }
    }

    // Handle Logout
    if (logoutButton) {
        logoutButton.addEventListener("click", function() {
            signOut(auth)
                .then(() => {
                    console.log("User logged out");
                    sessionStorage.removeItem("userData"); // Clear user data
                    alert("Logged out successfully!");
                    window.location.href = "index.html"; // Redirect to home page
                })
                .catch((error) => {
                    console.error("Logout error:", error.message);
                    alert("Logout Failed: " + error.message);
                });
        });
    }

    // Listen for authentication state changes
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is logged in:", user.email);
            document.body.classList.add("authenticated"); // Update UI
        } else {
            console.log("No user logged in");
            document.body.classList.remove("authenticated");
        }
    });

    // Handle mobile navigation
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    const overlay = document.querySelector('.overlay');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
            overlay.classList.toggle('active');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', function() {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
    
    console.log("Authentication setup complete");
});