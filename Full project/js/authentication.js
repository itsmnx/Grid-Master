// auth.js - Authentication and user management functions

// Global auth state
let currentUser = null;

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    updateAuthUI();
    
    // Set up event listeners for auth forms if they exist
    setupAuthForms();
});

// Check authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('sudoku_auth_token');
    if (token) {
        // Validate token with backend
        fetch('/api/validateToken', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                // Token invalid or expired
                localStorage.removeItem('sudoku_auth_token');
                throw new Error('Invalid token');
            }
        })
        .then(data => {
            currentUser = data.user;
            updateAuthUI();
        })
        .catch(error => {
            console.error('Auth validation error:', error);
            currentUser = null;
            updateAuthUI();
        });
    } else {
        currentUser = null;
    }
}

// Update UI based on authentication status
function updateAuthUI() {
    const authMenu = document.querySelector('.auth-menu');
    if (!authMenu) return;
    
    if (currentUser) {
        // User is logged in
        authMenu.innerHTML = `
            <span class="username">Welcome, ${currentUser.name}</span>
            <div class="dropdown">
                <button class="dropdown-btn">My Account</button>
                <div class="dropdown-content">
                    <a href="profile.html">Profile</a>
                    <a href="stats.html">My Stats</a>
                    <a href="#" id="logout-btn">Logout</a>
                </div>
            </div>
        `;
        
        // Add logout event listener
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    } else {
        // User is not logged in
        authMenu.innerHTML = `
            <a href="signin.html" class="auth-btn">Sign In</a>
            <a href="signup.html" class="auth-btn">Sign Up</a>
        `;
    }
}

// Setup authentication forms
function setupAuthForms() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            login(email, password);
        });
    }
    
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const dob = document.getElementById('register-dob').value;
            const gender = document.querySelector('input[name="gender"]:checked').value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            register(name, email, password, dob, gender);
        });
    }
}

// Login function
function login(email, password) {
    // Show loading state
    const loginButton = document.querySelector('#login-form button[type="submit"]');
    if (loginButton) {
        loginButton.disabled = true;
        loginButton.textContent = 'Signing in...';
    }
    
    // Call backend API
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Login failed');
        }
    })
    .then(data => {
        // Store token
        localStorage.setItem('sudoku_auth_token', data.token);
        currentUser = data.user;
        
        // Show success message
        showNotification('Login successful', 'success');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    })
    .catch(error => {
        console.error('Login error:', error);
        showNotification('Invalid email or password', 'error');
    })
    .finally(() => {
        // Reset loading state
        if (loginButton) {
            loginButton.disabled = false;
            loginButton.textContent = 'Sign In';
        }
    });
}

// Register function
function register(name, email, password, dob, gender) {
    // Show loading state
    const registerButton = document.querySelector('#register-form button[type="submit"]');
    if (registerButton) {
        registerButton.disabled = true;
        registerButton.textContent = 'Creating account...';
    }
    
    // Call backend API
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, dob, gender })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(data => {
                throw new Error(data.message || 'Registration failed');
            });
        }
    })
    .then(data => {
        // Show success message
        showNotification('Registration successful', 'success');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'signin.html';
        }, 1500);
    })
    .catch(error => {
        console.error('Registration error:', error);
        showNotification(error.message || 'Registration failed', 'error');
    })
    .finally(() => {
        // Reset loading state
        if (registerButton) {
            registerButton.disabled = false;
            registerButton.textContent = 'Sign Up';
        }
    });
}

// Logout function
function logout() {
    // Clear local storage
    localStorage.removeItem('sudoku_auth_token');
    currentUser = null;
    
    // Update UI
    updateAuthUI();
    
    // Show notification
    showNotification('Logged out successfully', 'success');
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Notification helper
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Auto-remove after delay
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Check if path is protected and redirect if not authenticated
function checkProtectedRoute() {
    const protectedRoutes = ['profile.html', 'stats.html'];
    const currentPath = window.location.pathname.split('/').pop();
    
    if (protectedRoutes.includes(currentPath)) {
        if (!localStorage.getItem('sudoku_auth_token')) {
            // Redirect to login
            window.location.href = 'signin.html?redirect=' + currentPath;
            return false;
        }
    }
    
    return true;
}

// Expose functions for other scripts
window.auth = {
    login,
    register,
    logout,
    getCurrentUser: () => currentUser,
    isLoggedIn: () => Boolean(currentUser),
    checkProtectedRoute
};