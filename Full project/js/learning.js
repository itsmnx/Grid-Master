// Learning Page JavaScript

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const demoSection = document.getElementById('demo-section');

// Sample Sudoku grids for demonstrations
const sampleGrids = {
    basic: [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ],
    nakedSingles: [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 0] // Last cell is naked single (9)
    ]
};

// Demo data for different techniques
const demoData = {
    'naked-singles': {
        title: 'Naked Singles Technique',
        grid: sampleGrids.nakedSingles,
        steps: [
            {
                highlight: [8, 8],
                explanation: 'Look at the bottom-right cell. What numbers are already used in this row?',
                text: 'In the bottom row, we can see: 3, 4, 5, 2, 8, 6, 1, 7. Only 9 is missing!'
            },
            {
                highlight: [8, 8],
                solution: [8, 8],
                value: 9,
                explanation: 'Since 9 is the only number missing from this row, column, and box, it must go here.',
                text: 'This is a naked single - a cell that can only contain one possible number.'
            }
        ]
    },
    'hidden-singles': {
        title: 'Hidden Singles Technique',
        grid: sampleGrids.basic,
        steps: [
            {
                highlight: [0, 2],
                explanation: 'Look at the first row. Which numbers are missing?',
                text: 'Row 1 has: 5, 3, 7. Missing: 1, 2, 4, 6, 8, 9'
            },
            {
                highlight: [0, 2],
                solution: [0, 2],
                value: 4,
                explanation: 'But if we check the column and box constraints, only 4 can go here.',
                text: 'This is a hidden single - the only place 4 can go in this region.'
            }
        ]
    },
    'elimination': {
        title: 'Elimination Process',
        grid: sampleGrids.basic,
        steps: [
            {
                highlight: [0, 6, 0, 7, 0, 8],
                explanation: 'Look at the top-right box. What numbers are already placed?',
                text: 'This 3×3 box is completely empty. We need to find where each number 1-9 can go.'
            },
            {
                highlight: [0, 6],
                explanation: 'For this cell, check what numbers are impossible due to row and column constraints.',
                text: 'By elimination, we can narrow down the possibilities for each empty cell.'
            }
        ]
    },
    'naked-pairs': {
        title: 'Naked Pairs Technique',
        grid: sampleGrids.basic,
        steps: [
            {
                highlight: [1, 1, 1, 2],
                explanation: 'When two cells in the same unit can only contain the same two numbers...',
                text: 'These cells form a "naked pair" - they must contain these two numbers exclusively.'
            },
            {
                highlight: [1, 1, 1, 2],
                explanation: 'This means we can eliminate these numbers from other cells in the same unit.',
                text: 'Naked pairs help eliminate possibilities from other cells in the row, column, or box.'
            }
        ]
    },
    'pointing-pairs': {
        title: 'Pointing Pairs Technique',
        grid: sampleGrids.basic,
        steps: [
            {
                highlight: [6, 0, 7, 0, 8, 0],
                explanation: 'When a number in a box is restricted to one row or column...',
                text: 'If a number can only go in one row within a box, it affects the entire row.'
            },
            {
                highlight: [6, 0, 7, 0],
                explanation: 'We can eliminate this number from the rest of the row outside this box.',
                text: 'This creates a "pointing" effect that helps solve other areas.'
            }
        ]
    },
    'box-line': {
        title: 'Box/Line Reduction',
        grid: sampleGrids.basic,
        steps: [
            {
                highlight: [0, 0, 0, 1, 0, 2],
                explanation: 'When a number in a row/column is restricted to one box...',
                text: 'If a number can only appear in one box within a row, it affects the entire box.'
            },
            {
                highlight: [1, 0, 2, 0],
                explanation: 'We can eliminate this number from other rows within the same box.',
                text: 'This reduction technique opens up new solving opportunities.'
            }
        ]
    }
};

let currentDemo = null;
let currentStep = 0;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeNavigation();
    createExampleGrid();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Tab functionality
function initializeTabs() {
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Scroll to top of content
            document.querySelector('.tab-content').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}

// Navigation functionality
function initializeNavigation() {
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
        
        // Close mobile menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Create example Sudoku grid
function createExampleGrid() {
    const exampleGrid = document.getElementById('example-grid');
    if (!exampleGrid) return;
    
    const grid = sampleGrids.basic;
    exampleGrid.innerHTML = '';
    
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.className = 'mini-cell';
            
            if (grid[row][col] !== 0) {
                cell.textContent = grid[row][col];
                cell.classList.add('given');
            }
            
            // Add thick borders for 3x3 boxes
            if (row % 3 === 0 && row !== 0) cell.style.borderTop = '2px solid #333';
            if (col % 3 === 0 && col !== 0) cell.style.borderLeft = '2px solid #333';
            
            exampleGrid.appendChild(cell);
        }
    }
}

// Demo functionality
function showDemo(technique) {
    if (!demoData[technique]) return;
    
    currentDemo = technique;
    currentStep = 0;
    
    const demoTitle = document.getElementById('demo-title');
    const demoGrid = document.getElementById('demo-grid');
    const demoText = document.getElementById('demo-text');
    
    if (demoTitle) demoTitle.textContent = demoData[technique].title;
    
    createDemoGrid(demoData[technique].grid);
    updateDemoStep();
    
    demoSection.style.display = 'block';
    demoSection.scrollIntoView({ behavior: 'smooth' });
}

function createDemoGrid(grid) {
    const demoGrid = document.getElementById('demo-grid');
    demoGrid.innerHTML = '';
    
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.className = 'demo-cell';
            cell.id = `demo-${row}-${col}`;
            
            if (grid[row][col] !== 0) {
                cell.textContent = grid[row][col];
                cell.classList.add('given');
            }
            
            // Add thick borders for 3x3 boxes
            if (row % 3 === 0 && row !== 0) cell.style.borderTop = '3px solid #333';
            if (col % 3 === 0 && col !== 0) cell.style.borderLeft = '3px solid #333';
            
            demoGrid.appendChild(cell);
        }
    }
}

function updateDemoStep() {
    if (!currentDemo || !demoData[currentDemo]) return;
    
    const steps = demoData[currentDemo].steps;
    const step = steps[currentStep];
    const demoText = document.getElementById('demo-text');
    
    // Clear previous highlights
    document.querySelectorAll('.demo-cell').forEach(cell => {
        cell.classList.remove('highlight', 'solution');
    });
    
    // Apply current step highlights
    if (step.highlight) {
        if (Array.isArray(step.highlight) && step.highlight.length === 2) {
            // Single cell highlight
            const cell = document.getElementById(`demo-${step.highlight[0]}-${step.highlight[1]}`);
            if (cell) cell.classList.add('highlight');
        } else if (Array.isArray(step.highlight)) {
            // Multiple cells highlight
            for (let i = 0; i < step.highlight.length; i += 2) {
                const cell = document.getElementById(`demo-${step.highlight[i]}-${step.highlight[i + 1]}`);
                if (cell) cell.classList.add('highlight');
            }
        }
    }
    
    // Apply solution if present
    if (step.solution && step.value) {
        const cell = document.getElementById(`demo-${step.solution[0]}-${step.solution[1]}`);
        if (cell) {
            cell.classList.add('solution');
            cell.textContent = step.value;
        }
    }
    
    // Update explanation text
    if (demoText) {
        demoText.innerHTML = `
            <h4>${step.explanation}</h4>
            <p>${step.text}</p>
            <div class="step-indicator">Step ${currentStep + 1} of ${steps.length}</div>
        `;
    }
}

function nextStep() {
    if (!currentDemo || !demoData[currentDemo]) return;
    
    const steps = demoData[currentDemo].steps;
    if (currentStep < steps.length - 1) {
        currentStep++;
        updateDemoStep();
    } else {
        currentStep = 0;
        updateDemoStep();
    }
}

function resetDemo() {
    if (!currentDemo) return;
    
    currentStep = 0;
    createDemoGrid(demoData[currentDemo].grid);
    updateDemoStep();
}

function closeDemoSection() {
    demoSection.style.display = 'none';
    currentDemo = null;
    currentStep = 0;
}

// Utility functions
function animateElement(element, animation = 'fadeIn') {
    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.animation = `${animation} 0.5s ease-in`;
}

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.rule-card, .technique-card, .type-card, .tip-item, .mistake-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.rule-card, .technique-card, .type-card, .practice-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effect to buttons
    const buttons = document.querySelectorAll('.demo-btn, .tab-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
            `;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .step-indicator {
        background: #f0f0f0;
        padding: 0.5rem 1rem;
        border-radius: 15px;
        text-align: center;
        margin-top: 1rem;
        font-weight: bold;
        color: #666;
    }
`;
document.head.appendChild(style);
