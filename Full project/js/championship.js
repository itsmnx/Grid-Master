// Championship Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = checkUserLoggedIn();
    
    if (isLoggedIn) {
        document.getElementById('login-prompt').classList.add('hidden');
        document.getElementById('user-stats').classList.remove('hidden');
        loadUserStats();
    } else {
        document.getElementById('login-prompt').classList.remove('hidden');
        document.getElementById('user-stats').classList.add('hidden');
    }

    // Load leaderboard data
    loadLeaderboardData('all');
    
    // Update countdown timers
    updateCountdowns();
    setInterval(updateCountdowns, 1000);
    
    // Add event listeners
    setupEventListeners();
});

// Function to check if user is logged in
function checkUserLoggedIn() {
    // Check localStorage for user token
    const token = localStorage.getItem('sudokuMasterToken');
    return !!token;
}

// Function to load leaderboard data
function loadLeaderboardData(timeFilter) {
    // In a real app, this would make an API call to fetch leaderboard data
    // For now, we'll use mock data
    
    const mockLeaderboardData = [
        { rank: 1, username: 'SudokuMaster42', points: 9874, winRate: '92%', bestTime: '1:45' },
        { rank: 2, username: 'PuzzleKing', points: 9652, winRate: '89%', bestTime: '1:52' },
        { rank: 3, username: 'NumberWizard', points: 9341, winRate: '87%', bestTime: '2:05' },
        { rank: 4, username: 'LogicQueen', points: 9103, winRate: '85%', bestTime: '2:12' },
        { rank: 5, username: 'GridSolver', points: 8967, winRate: '84%', bestTime: '2:18' },
        { rank: 6, username: 'SudokuPro', points: 8752, winRate: '82%', bestTime: '2:25' },
        { rank: 7, username: 'MathGenius', points: 8621, winRate: '81%', bestTime: '2:29' },
        { rank: 8, username: 'PuzzleMaster', points: 8459, winRate: '79%', bestTime: '2:36' },
        { rank: 9, username: 'NumberNinja', points: 8302, winRate: '78%', bestTime: '2:42' },
        { rank: 10, username: 'SudokuSensei', points: 8156, winRate: '76%', bestTime: '2:49' }
    ];
    
    const leaderboardBody = document.getElementById('leaderboard-body');
    leaderboardBody.innerHTML = '';
    
    mockLeaderboardData.forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.rank}</td>
            <td>${player.username}</td>
            <td>${player.points}</td>
            <td>${player.winRate}</td>
            <td>${player.bestTime}</td>
        `;
        leaderboardBody.appendChild(row);
    });
    
    // Update active filter button
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.filter === timeFilter) {
            button.classList.add('active');
        }
    });
}

// Function to load user stats
function loadUserStats() {
    // In a real app, this would make an API call to fetch user stats
    // For now, we'll use mock data
    
    const userData = {
        rank: 42,
        points: 6589,
        tournamentsEntered: 57,
        tournamentsWon: 12,
        achievements: [
            { icon: '🏆', name: 'First Win', description: 'Won your first tournament', date: '2 months ago' },
            { icon: '⚡', name: 'Speed Demon', description: 'Completed a puzzle in under 2 minutes', date: '3 weeks ago' },
            { icon: '🔥', name: 'On Fire', description: 'Won 3 tournaments in a row', date: '1 week ago' },
            { icon: '🧠', name: 'Mastermind', description: 'Solved 100 hard puzzles', date: '2 days ago' }
        ]
    };
    
    // Update user stats
    document.getElementById('user-rank').textContent = userData.rank;
    document.getElementById('user-points').textContent = userData.points;
    document.getElementById('tournaments-entered').textContent = userData.tournamentsEntered;
    document.getElementById('tournaments-won').textContent = userData.tournamentsWon;
    
    // Display achievements
    const achievementsContainer = document.getElementById('user-achievements');
    achievementsContainer.innerHTML = '';
    
    userData.achievements.forEach(achievement => {
        const achievementElement = document.createElement('div');
        achievementElement.className = 'achievement';
        achievementElement.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-text">
                <strong>${achievement.name}</strong>
                <p>${achievement.description}</p>
                <span class="achievement-date">${achievement.date}</span>
            </div>
        `;
        achievementsContainer.appendChild(achievementElement);
    });
}

// Function to update countdown timers
function updateCountdowns() {
    // This would normally calculate actual time remaining
    // For now, we'll just update with mock data
    
    // Daily countdown - decrease seconds every second
    const dailyTimeElement = document.getElementById('daily-time-left');
    let [hours, minutes, seconds] = dailyTimeElement.textContent.split(':').map(Number);
    
    seconds--;
    if (seconds < 0) {
        seconds = 59;
        minutes--;
        if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
                hours = 23; // Reset for demo purposes
            }
        }
    }
    
    dailyTimeElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Function to set up event listeners
function setupEventListeners() {
    // Tournament entry buttons
    document.querySelectorAll('.tournament-button').forEach(button => {
        button.addEventListener('click', function() {
            if (!checkUserLoggedIn()) {
                alert('Please sign in to enter tournaments!');
                return;
            }
            
            // In a real app, this would navigate to the tournament or display a modal
            alert('Entering tournament... In a full implementation, this would take you to the tournament page.');
        });
    });
    
    // Leaderboard filter buttons
    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            loadLeaderboardData(filter);
        });
    });
    
    // Pagination buttons
    document.getElementById('prev-page').addEventListener('click', function() {
        // In a real app, this would load the previous page of data
        alert('In a full implementation, this would load the previous page of leaderboard data.');
    });
    
    document.getElementById('next-page').addEventListener('click', function() {
        // In a real app, this would load the next page of data
        alert('In a full implementation, this would load the next page of leaderboard data.');
    });
}
