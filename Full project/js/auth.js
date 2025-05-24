// auth.js - Authentication and user management functions

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    updateAuthUI();
    setupAuthForms();
});

// Check if user is logged in using stored token
function checkAuthStatus() {
    const token = localStorage.getItem('sudoku_auth_token');
    if (token) {
        fetch('/api/validateToken', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => {
            if (!res.ok) throw new Error('Invalid token');
            return res.json();
        })
        .then(data => {
            currentUser = data.user;
            updateAuthUI();
        })
        .catch(err => {
            console.error('Token validation failed:', err);
            localStorage.removeItem('sudoku_auth_token');
            currentUser = null;
            updateAuthUI();
        });
    }
}

// Update navbar or menu based on login state
function updateAuthUI() {
    const authMenu = document.querySelector('.auth-menu');
    if (!authMenu) return;

    if (currentUser) {
        authMenu.innerHTML = `
            <span class="username">Welcome, ${currentUser.name}</span>
            <div class="dropdown">
                <button class="dropdown-btn">My Account</button>
                <div class="dropdown-content">
                    <a href="profile.html">Profile</a>
                    <a href="stats.html">My Stats</a>
                    <a href="#" id="logout-btn">Logout</a>
                </div>
            </div>`;
        document.getElementById('logout-btn').addEventListener('click', logout);
    } else {
        authMenu.innerHTML = `
            <a href="signin.html" class="auth-btn">Sign In</a>
            <a href="signup.html" class="auth-btn">Sign Up</a>`;
    }
}

// Attach form listeners for login and register
function setupAuthForms() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            login(email, password);
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const dob = document.getElementById('register-dob').value;
            const gender = document.querySelector('input[name="gender"]:checked')?.value;

            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }

            register(name, email, password, dob, gender);
        });
    }
}

// Login API call
function login(email, password) {
    const button = document.querySelector('#login-form button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Signing in...';

    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => {
        if (!res.ok) throw new Error('Login failed');
        return res.json();
    })
    .then(data => {
        localStorage.setItem('sudoku_auth_token', data.token);
        currentUser = data.user;
        showNotification('Login successful', 'success');

        const redirectURL = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
        setTimeout(() => window.location.href = redirectURL, 1000);
    })
    .catch(err => {
        console.error('Login failed:', err);
        showNotification('Invalid credentials', 'error');
    })
    .finally(() => {
        button.disabled = false;
        button.textContent = 'Sign In';
    });
}

// Register API call
function register(name, email, password, dob, gender) {
    const button = document.querySelector('#register-form button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Creating account...';

    fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, dob, gender })
    })
    .then(res => {
        if (!res.ok) return res.json().then(data => { throw new Error(data.message || 'Failed'); });
        return res.json();
    })
    .then(() => {
        showNotification('Account created. Please login.', 'success');
        setTimeout(() => window.location.href = 'signin.html', 1500);
    })
    .catch(err => {
        console.error('Registration error:', err);
        showNotification(err.message, 'error');
    })
    .finally(() => {
        button.disabled = false;
        button.textContent = 'Sign Up';
    });
}

// Logout function
function logout(e) {
    e?.preventDefault();
    localStorage.removeItem('sudoku_auth_token');
    currentUser = null;
    updateAuthUI();
    showNotification('Logged out successfully', 'info');
    setTimeout(() => window.location.href = 'index.html', 1000);
}

// Simple notification popup
function showNotification(message, type = 'info') {
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
    }

    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = message;
    container.appendChild(notif);

    setTimeout(() => {
        notif.classList.add('fade-out');
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Redirect protection for specific pages
function checkProtectedRoute() {
    const protectedPages = ['profile.html', 'stats.html', 'play.html'];
    const path = window.location.pathname.split('/').pop();
    if (protectedPages.includes(path) && !localStorage.getItem('sudoku_auth_token')) {
        window.location.href = `signin.html?redirect=${path}`;
        return false;
    }
    return true;
}

// Expose functions if needed globally
window.auth = {
    login,
    register,
    logout,
    getCurrentUser: () => currentUser,
    isLoggedIn: () => Boolean(currentUser),
    checkProtectedRoute
};
