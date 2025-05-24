// Profile Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkLoginStatus();
    
    // Load user data
    loadUserProfile();
    
    // Tab functionality
    initTabs();
    
    // Form handling
    initFormHandlers();
    
    // Logout functionality
    initLogout();
});

function checkLoginStatus() {
    const userData = getUserData();
    if (!userData) {
        // Redirect to sign in if not logged in
        window.location.href = 'signin.html';
        return;
    }
}

function getUserData() {
    // In a real application, this would check session/token
    // For demo purposes, using sessionStorage
    const userData = sessionStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

function loadUserProfile() {
    const userData = getUserData();
    if (!userData) return;
    
    // Update profile information
    document.getElementById('profile-name').textContent = userData.name || 'User';
    document.getElementById('profile-email').textContent = userData.email || 'user@example.com';
    
    // Load form data
    if (userData.name) document.getElementById('edit-name').value = userData.name;
    if (userData.dob) document.getElementById('edit-dob').value = userData.dob;
    if (userData.gender) {
        const genderRadio = document.getElementById(`edit-${userData.gender}`);
        if (genderRadio) genderRadio.checked = true;
    }
    
    // Load game statistics (demo data)
    loadGameStats();
    
    // Load preferences
    loadPreferences();
}

function loadGameStats() {
    // In a real app, this would fetch from database
    const stats = {
        gamesPlayed: Math.floor(Math.random() * 50) + 10,
        gamesWon: Math.floor(Math.random() * 30) + 5,
        bestTime: generateRandomTime()
    };
    
    document.getElementById('games-played').textContent = stats.gamesPlayed;
    document.getElementById('games-won').textContent = stats.gamesWon;
    document.getElementById('best-time').textContent = stats.bestTime;
    
    // Update progress bars based on stats
    updateProgressBars(stats);
}

function generateRandomTime() {
    const minutes = Math.floor(Math.random() * 15) + 3;
    const seconds = Math.floor(Math.random() * 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateProgressBars(stats) {
    // Calculate win percentage for different difficulties (demo calculation)
    const totalGames = stats.gamesPlayed;
    const easyWins = Math.floor(totalGames * 0.4);
    const mediumWins = Math.floor(totalGames * 0.3);
    const hardWins = Math.floor(totalGames * 0.2);
    
    const easyPercentage = totalGames > 0 ? Math.round((easyWins / (totalGames * 0.5)) * 100) : 0;
    const mediumPercentage = totalGames > 0 ? Math.round((mediumWins / (totalGames * 0.35)) * 100) : 0;
    const hardPercentage = totalGames > 0 ? Math.round((hardWins / (totalGames * 0.15)) * 100) : 0;
    
    // Update progress bars
    const progressBars = document.querySelectorAll('.difficulty-item');
    if (progressBars[0]) {
        progressBars[0].querySelector('.progress-fill').style.width = Math.min(easyPercentage, 100) + '%';
        progressBars[0].querySelector('span:last-child').textContent = Math.min(easyPercentage, 100) + '%';
    }
    if (progressBars[1]) {
        progressBars[1].querySelector('.progress-fill').style.width = Math.min(mediumPercentage, 100) + '%';
        progressBars[1].querySelector('span:last-child').textContent = Math.min(mediumPercentage, 100) + '%';
    }
    if (progressBars[2]) {
        progressBars[2].querySelector('.progress-fill').style.width = Math.min(hardPercentage, 100) + '%';
        progressBars[2].querySelector('span:last-child').textContent = Math.min(hardPercentage, 100) + '%';
    }
}

function loadPreferences() {
    // Load saved preferences from localStorage
    const preferences = {
        soundEffects: localStorage.getItem('soundEffects') !== 'false',
        autoPencil: localStorage.getItem('autoPencil') !== 'false',
        highlightErrors: localStorage.getItem('highlightErrors') === 'true'
    };
    
    document.getElementById('sound-effects').checked = preferences.soundEffects;
    document.getElementById('auto-pencil').checked = preferences.autoPencil;
    document.getElementById('highlight-errors').checked = preferences.highlightErrors;
    
    // Add change listeners
    document.getElementById('sound-effects').addEventListener('change', function() {
        localStorage.setItem('soundEffects', this.checked);
    });
    
    document.getElementById('auto-pencil').addEventListener('change', function() {
        localStorage.setItem('autoPencil', this.checked);
    });
    
    document.getElementById('highlight-errors').addEventListener('change', function() {
        localStorage.setItem('highlightErrors', this.checked);
    });
}

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding pane
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

function initFormHandlers() {
    const profileForm = document.getElementById('profile-form');
    
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const userData = getUserData();
        
        // Update user data
        const updatedData = {
            ...userData,
            name: formData.get('name'),
            dob: formData.get('dob'),
            gender: formData.get('gender')
        };
        
        // Save updated data
        sessionStorage.setItem('currentUser', JSON.stringify(updatedData));
        
        // Update display
        document.getElementById('profile-name').textContent = updatedData.name;
        
        // Show success message
        showNotification('Profile updated successfully!', 'success');
    });
    
    // Avatar change functionality
    const avatarElement = document.querySelector('.profile-avatar');
    avatarElement.addEventListener('click', function() {
        // In a real app, this would open file picker
        showNotification('Avatar change functionality would be implemented here', 'info');
    });
}

function initLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Clear user data
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        
        // Show logout message
        showNotification('Logged out successfully!', 'success');
        
        // Redirect to home page after short delay
        setTimeout(() => {
            window.location.href = 'HOME.html';
        }, 1500);
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add close functionality
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Add CSS animation for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
