// ChineseMaster UI Demo - Main Application Logic

// Utility Functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function calculateDaysLeft(targetDate) {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function playAudio() {
    // Simulate audio playback
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '🔊 Playing...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
    }, 1500);
}

function analyzeTry() {
    const input = document.getElementById('tryInput').value;
    const result = document.getElementById('tryResult');
    
    if (!input.trim()) {
        result.innerHTML = `
            <div style="color: var(--error);">
                Please enter some Chinese text first!
            </div>
        `;
        return;
    }
    
    // Simulate analysis
    result.innerHTML = `
        <div style="padding: 1rem; background: white; border-radius: 0.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h4 style="margin: 0;">Analysis Result</h4>
                <span class="badge badge-primary">HSK 2-3</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1rem;">
                <div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">Characters</div>
                    <div style="font-size: 1.5rem; font-weight: 700;">${input.length}</div>
                </div>
                <div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">Unique Words</div>
                    <div style="font-size: 1.5rem; font-weight: 700;">8</div>
                </div>
                <div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">Difficulty</div>
                    <div style="font-size: 1.5rem; font-weight: 700;">Beginner</div>
                </div>
            </div>
            <p style="margin: 0; color: var(--success); font-weight: 600;">
                ✓ This text is perfect for HSK 2 learners!
            </p>
            <a href="dashboard.html" class="btn btn-primary btn-sm" style="margin-top: 1rem;">
                Start Learning →
            </a>
        </div>
    `;
}

function playDemo() {
    alert('🎬 Demo video would play here!\n\nIn the real app, this would open a 2-minute product demo video showing:\n- How to use daily missions\n- Word learning flow\n- Progress tracking\n- HSK exam preparation');
}

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on and initialize accordingly
    const path = window.location.pathname;
    
    if (path.includes('dashboard.html')) {
        initDashboard();
    } else if (path.includes('onboarding.html')) {
        initOnboarding();
    } else if (path.includes('word-detail.html')) {
        initWordDetail();
    } else if (path.includes('hsk-library.html')) {
        initHSKLibrary();
    } else if (path.includes('index.html') || path === '/') {
        initLandingPage();
    }
    
    // Add smooth scroll behavior to all anchor links
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

// Dashboard Initialization
function initDashboard() {
    console.log('Dashboard initialized');
    
    // Animate progress rings on load
    setTimeout(() => {
        animateProgressRings();
    }, 300);
    
    // Add interactivity to quick add input
    const quickAddInput = document.querySelector('.quick-add-input');
    if (quickAddInput) {
        quickAddInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleQuickAdd();
            }
        });
    }
}

function animateProgressRings() {
    // Animate the exam countdown ring
    const countdownRing = document.querySelector('.progress-ring-circle');
    if (countdownRing) {
        const percentage = 64; // 64% ready
        const circumference = 2 * Math.PI * 85; // r=85
        const offset = circumference - (percentage / 100) * circumference;
        countdownRing.style.strokeDasharray = circumference;
        countdownRing.style.strokeDashoffset = offset;
    }
}

function handleQuickAdd() {
    const input = document.querySelector('.quick-add-input');
    if (input && input.value.trim()) {
        // Show success animation
        showNotification(`✅ Added "${input.value}" to your word bank!`, 'success');
        input.value = '';
        
        // Update mission progress
        updateMissionProgress(3, 1);
    }
}

function updateMissionProgress(taskId, increment) {
    const tasks = document.querySelectorAll('.mission-task');
    if (tasks[taskId]) {
        const task = tasks[taskId];
        const progressText = task.querySelector('.task-progress-text');
        // In real app, this would update the actual progress
        // For demo, we'll just show a visual feedback
        task.style.borderColor = 'var(--success)';
        setTimeout(() => {
            task.style.borderColor = '';
        }, 1000);
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--success)' : 'var(--primary)'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Onboarding Initialization
function initOnboarding() {
    console.log('Onboarding initialized');
    
    // Goal selection handler
    const goalRadios = document.querySelectorAll('input[name="goal"]');
    goalRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const hskDetails = document.querySelector('.hsk-details');
            if (hskDetails) {
                if (e.target.value === 'hsk') {
                    hskDetails.style.display = 'block';
                } else {
                    hskDetails.style.display = 'none';
                }
            }
        });
    });
}

// Word Detail Initialization
function initWordDetail() {
    console.log('Word Detail page initialized');
}

// HSK Library Initialization
function initHSKLibrary() {
    console.log('HSK Library initialized');
    
    // Add hover effects to level cards
    const levelCards = document.querySelectorAll('.hsk-level-card');
    levelCards.forEach(card => {
        if (!card.classList.contains('locked')) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        }
    });
}

// Landing Page Initialization
function initLandingPage() {
    console.log('Landing page initialized');
    
    // Intersection Observer for scroll animations
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
    
    // Observe sections
    const sections = document.querySelectorAll('.features-section, .testimonials-section, .why-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s, transform 0.6s';
        observer.observe(section);
    });
    
    // Animate feature cards on hover
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Animate numbers (counters)
    animateCounters();
}

function animateCounters() {
    const counters = document.querySelectorAll('.words-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/,/g, ''));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        // Start animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const menu = document.querySelector('.mobile-nav');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Theme toggle (dark mode) - for future enhancement
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Load theme preference
function loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

// Progress tracking (for demo purposes)
let userProgress = {
    wordsLearned: 750,
    streak: 30,
    level: 12,
    xp: 2450
};

function updateProgress(type, value) {
    userProgress[type] += value;
    saveProgress();
    updateProgressDisplay();
}

function saveProgress() {
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
}

function loadProgress() {
    const saved = localStorage.getItem('userProgress');
    if (saved) {
        userProgress = JSON.parse(saved);
        updateProgressDisplay();
    }
}

function updateProgressDisplay() {
    // Update progress indicators in the UI
    const streakElement = document.querySelector('.streak-number');
    if (streakElement) {
        streakElement.textContent = userProgress.streak;
    }
    
    const levelElement = document.querySelector('.level-number');
    if (levelElement) {
        levelElement.textContent = `Level ${userProgress.level}`;
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
`;
document.head.appendChild(style);

// Initialize on load
loadTheme();
loadProgress();

console.log('ChineseMaster UI Demo loaded successfully! 🎓');

