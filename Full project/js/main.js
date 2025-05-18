// main.js - JavaScript for the homepage and common functionality

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the navigation menu
    initNavMenu();
    
    // Initialize homepage elements if they exist
    if (document.querySelector('.hero-section')) {
        initHeroSection();
    }
    
    // Initialize features section if it exists
    if (document.querySelector('.features-section')) {
        initFeaturesSection();
    }
    
    // Initialize stats counter if it exists
    if (document.querySelector('.stats-counter')) {
        initStatsCounter();
    }
    
    // Add dark mode toggle
    initDarkModeToggle();
});

// Initialize the navigation menu
function initNavMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
    
    // Add active class to current page in nav
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

// Initialize the hero section with animated Sudoku grid
function initHeroSection() {
    const heroGrid = document.querySelector('.hero-grid');
    if (!heroGrid) return;
    
    // Create a 4x4 mini Sudoku grid for animation
    const miniGrid = [
        [5, 3, 0, 0],
        [6, 0, 0, 1],
        [0, 9, 8, 0],
        [0, 0, 0, 0]
    ];
    
    // Fill in the hero grid
    heroGrid.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const cell = document.createElement('div');
            cell.className = 'hero-cell';
            
            if (miniGrid[i][j] !== 0) {
                cell.textContent = miniGrid[i][j];
                cell.classList.add('filled');
            } else {
                cell.classList.add('empty');
            }
            
            heroGrid.appendChild(cell);
        }
    }
    
    // Animate filling in some cells
    const emptyCells = document.querySelectorAll('.hero-cell.empty');
    const numbers = [4, 2, 7, 1, 5];
    let index = 0;
    
    // Fill in empty cells one by one with a delay
    const fillInterval = setInterval(() => {
        if (index >= emptyCells.length || index >= numbers.length) {
            clearInterval(fillInterval);
            return;
        }
        
        const cell = emptyCells[index];
        cell.textContent = numbers[index];
        cell.classList.add('animate-fill');
        
        index++;
    }, 800);
}

// Initialize the features section
function initFeaturesSection() {
    const featureItems = document.querySelectorAll('.feature-item');
    
    // Add hover animation
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('feature-hover');
        });
        
        item.addEventListener('mouseleave', () => {
            item.classList.remove('feature-hover');
        });
    });
    
    // Add intersection observer for animate-on-scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    featureItems.forEach(item => {
        observer.observe(item);
    });
}

// Initialize the stats counter
function initStatsCounter() {
    const counters = document.querySelectorAll('.stat-counter');
    
    // Function to animate number count
    function animateCounter(counter, target) {
        let current = 0;
        const step = target / 100; // Divide animation into 100 steps
        const interval = 20; // Update every 20ms
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                clearInterval(timer);
                counter.textContent = target.toLocaleString();
            } else {
                counter.textContent = Math.floor(current).toLocaleString();
            }
        }, interval);
    }
    
    // Use Intersection Observer to trigger counter animation when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Initialize dark mode toggle
function initDarkModeToggle() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (!darkModeToggle) return;
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && systemDarkMode)) {
        document.body.classList.add('dark-mode');
        darkModeToggle.classList.add('active');
    }
    
    // Toggle dark mode on click
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        darkModeToggle.classList.toggle('active');
        
        // Save preference
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
}

// Function to scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize difficulty selection buttons
function initDifficultyButtons() {
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const difficulty = button.getAttribute('data-difficulty');
            window.location.href = `play.html?difficulty=${difficulty}`;
        });
    });
}

// Add event listeners to learning section tabs (if they exist)
function initLearningTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding content
            const targetId = button.getAttribute('data-tab');
            tabContents.forEach(content => {
                if (content.getAttribute('id') === targetId) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });
}

// Initialize play buttons
if (document.querySelector('.play-btn')) {
    initDifficultyButtons();
}

// Initialize learning tabs
if (document.querySelector('.tab-btn')) {
    initLearningTabs();
}

// Add event listeners to CTA buttons
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('scroll-to-btn')) {
        e.preventDefault();
        const targetSection = e.target.getAttribute('data-target');
        scrollToSection(targetSection);
    }
});

// Initialize testimonial slider if it exists
function initTestimonialSlider() {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (!testimonialSlider) return;
    
    const slides = testimonialSlider.querySelectorAll('.testimonial-slide');
    const prevBtn = testimonialSlider.querySelector('.prev-btn');
    const nextBtn = testimonialSlider.querySelector('.next-btn');
    let currentSlide = 0;
    
    // Show initial slide
    updateSlides();
    
    // Navigate to previous slide
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlides();
    });
    
    // Navigate to next slide
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlides();
    });
    
    // Update slides
    function updateSlides() {
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }
    
    // Auto-advance slides
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlides();
    }, 5000);
}

// Initialize testimonial slider
initTestimonialSlider();