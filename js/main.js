/* ============================================
   SkillBridge - Main JavaScript File
   ============================================ */

const DEMO_USERS = [
    { fullName: 'Demo Student', username: 'student', email: 'student@skillbridge.com', password: 'student123', role: 'student' },
    { fullName: 'Demo Admin', username: 'admin', email: 'admin@skillbridge.com', password: 'admin123', role: 'admin' }
];

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    checkOnboardingRedirect();
    seedDemoUsers();
    setupAuthHelpers();
    renderDynamicNavbar();
    setupNavigation();
    setupThemeToggle();
    setupPasswordToggles();
    loadProgressFromStorage();
    initializeSkillCards();
    setupLogoDblClick();
    // Render saved home-page content and show edit controls for admins.
    maybeApplyAdminHomeContent();
    applyAdminHomeInlineEdits();
    applySkillBridgeContactDetails();
    setupAdminHomeEditor();
    setupHomeFeedbackForm();
}

function setupPasswordToggles() {
    document.querySelectorAll('[data-toggle-password]').forEach((button) => {
        button.addEventListener('click', function() {
            const input = document.getElementById(this.dataset.togglePassword);
            if (!input) return;

            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            this.textContent = isPassword ? '🙈' : '👁️';
            this.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        });
    });
}

// ============================================
// AUTH HELPERS (LOCALSTORAGE DEMO)
// ============================================
function seedDemoUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let changed = false;

    DEMO_USERS.forEach((demo) => {
        const existing = users.find((u) => u.username === demo.username);
        if (!existing) {
            users.push({
                ...demo,
                createdAt: new Date().toLocaleString()
            });
            changed = true;
            return;
        }

        ['fullName', 'email', 'password', 'role'].forEach((key) => {
            if (!existing[key]) {
                existing[key] = demo[key];
                changed = true;
            }
        });
    });

    if (changed) {
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Create demo accounts as soon as main.js loads
seedDemoUsers();
function setupAuthHelpers() {
    // Expose helpers on window so HTML pages can call them.
    window.getSession = getSession;
    window.requireRole = requireRole;
    window.logoutUser = logoutUser;
    window.registerUser = registerUser;
    window.loginUser = loginUser;
    window.resetPassword = resetPassword;
}

function getSession() {
    return JSON.parse(localStorage.getItem('session')) || null;
}

function requireRole(expectedRole) {
    const session = getSession();
    if (!session || session.role !== expectedRole) {
        window.location.href = getLoginPath(expectedRole);
        return false;
    }
    return true;
}

function getLoginPath(expectedRole) {
    const path = window.location.pathname.replace(/\\/g, '/');
    const inAdmin = path.includes('/admin/');
    const inStudent = path.includes('/student/');

    if (expectedRole === 'admin') {
        return inAdmin ? 'admin-login.html' : 'admin/admin-login.html';
    }
    if (inStudent || inAdmin) {
        return '../register.html';
    }
    return 'register.html';
}

function logoutUser() {
    localStorage.removeItem('session');
}

function normalizeEmail(email) {
    return (email || '').trim().toLowerCase();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function registerUser({ fullName, username, email, password, role }) {
    seedDemoUsers();

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const uname = (username || '').trim();
    const fname = (fullName || '').trim();
    const emailValue = normalizeEmail(email);

    if (!uname || !fname || !emailValue || !password) {
        return { ok: false, message: 'Please fill all fields.' };
    }

    if (!isValidEmail(emailValue)) {
        return { ok: false, message: 'Please enter a valid email address.' };
    }

    if (users.some(u => u.username === uname)) {
        return { ok: false, message: 'Username already exists. Please login.' };
    }

    if (users.some(u => normalizeEmail(u.email) === emailValue)) {
        return { ok: false, message: 'Email already registered. Please login or reset password.' };
    }

    const user = {
        fullName: fname,
        username: uname,
        email: emailValue,
        // Demo only (NOT secure). Avoid real hashes for this exercise.
        password: password,
        role: role === 'admin' ? 'admin' : 'student',
        createdAt: new Date().toLocaleString()
    };

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));

    // Prime certificate name usage
    localStorage.setItem('userFullName', fname);

    return { ok: true, message: 'Account created successfully! Please login.' };
}

function loginUser({ username, password, role }) {
    seedDemoUsers();

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const loginId = (username || '').trim();
    const loginEmail = normalizeEmail(loginId);

    if (!loginId || !password) {
        return { ok: false, message: 'Please enter username/email and password.' };
    }

    const matches = users.filter((u) => {
        const sameUsername = u.username === loginId;
        const sameEmail = normalizeEmail(u.email) === loginEmail;
        return (sameUsername || sameEmail) && u.password === password;
    });
    if (!matches.length) {
        return { ok: false, message: 'Invalid username or password.' };
    }

    const expectedRole = role === 'admin' ? 'admin' : 'student';
    const user = matches.find((u) => u.role === expectedRole) || matches[0];

    if (user.role !== expectedRole && matches.length > 1) {
        return {
            ok: false,
            message: `Please select "${user.role === 'admin' ? 'Admin' : 'Student'}" in Login as.`
        };
    }

    localStorage.setItem('session', JSON.stringify({
        username: user.username,
        email: user.email || '',
        fullName: user.fullName,
        role: user.role
    }));

    localStorage.setItem('userFullName', user.fullName);

    return {
        ok: true,
        role: user.role,
        message: `Welcome, ${user.fullName}! Redirecting...`
    };
}

function resetPassword({ username, newPassword, role }) {
    seedDemoUsers();

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const uname = (username || '').trim();

    if (!uname || !newPassword) {
        return { ok: false, message: 'Please enter username and new password.' };
    }

    if (newPassword.length < 6) {
        return { ok: false, message: 'Password must be at least 6 characters.' };
    }

    const expectedRole = role === 'admin' ? 'admin' : 'student';
    const user = users.find((u) => u.username === uname && u.role === expectedRole);

    if (!user) {
        return { ok: false, message: 'No account found with this username.' };
    }

    user.password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));

    return { ok: true, message: 'Password reset successfully. Please login with your new password.' };
}

// ============================================
// NAVIGATION SETUP
// ============================================
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (hamburger && navLinks && !hamburger.contains(event.target) && !navLinks.contains(event.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// ============================================
// THEME TOGGLE (DARK MODE / LIGHT MODE)
// ============================================
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeToggleButton(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeToggleButton(newTheme);
        });
    }
}

function updateThemeToggleButton(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// ============================================
// SKILL CARDS INITIALIZATION
// ============================================
function initializeSkillCards() {
    const skillsContainer = document.querySelector('.skills-grid');
    if (skillsContainer) {
        const limit = skillsContainer.dataset.featuredLimit;
        const courses = limit ? coursesData.slice(0, parseInt(limit, 10)) : coursesData;
        renderSkillCards(courses);
    }
}

function renderSkillCards(courses) {
    const skillsContainer = document.querySelector('.skills-grid');
    if (!skillsContainer) return;

    skillsContainer.innerHTML = courses.map(course => `
        <div class="skill-card" data-id="${course.id}">
            <div class="skill-card-image" onclick="viewCourseDetails(${course.id})" style="cursor: pointer;">
                ${course.image ? `<img src="${course.image}" alt="${course.title}" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''}
                <div style="${course.image ? 'display: none;' : ''} place-items: center; width: 100%; height: 100%; font-size: 3rem; cursor: pointer;">${course.icon}</div>
            </div>
            <div class="skill-card-content">
                <h3 class="skill-card-title">${course.title}</h3>
                <p class="skill-card-description">${course.description}</p>
                <div class="skill-card-meta">
                    <span>📚 ${course.duration}</span>
                    <span>⭐ ${course.rating}</span>
                </div>
                <div class="skill-card-footer">
                    <button class="btn btn-primary" onclick="viewCourseDetails(${course.id})">
                        View Details
                    </button>
                    <button class="btn btn-secondary" onclick="markAsCompleted(${course.id}, '${course.title}')">
                        Enroll Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================
function setupSearch() {
    const searchInput = document.getElementById('skillSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = coursesData.filter(course =>
                course.title.toLowerCase().includes(searchTerm) ||
                course.description.toLowerCase().includes(searchTerm)
            );
            renderSkillCards(filtered);
        });
    }
}

// ============================================
// CATEGORY FILTER
// ============================================
function filterByCategory(category) {
    let filtered = coursesData;
    
    if (category !== 'All') {
        filtered = coursesData.filter(course => course.category === category);
    }
    
    renderSkillCards(filtered);
}

function setupCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            filterByCategory(category);
        });
    });
}

// ============================================
// COURSE DETAILS
// ============================================
function viewCourseDetails(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;

    // Store course data in sessionStorage for details page
    sessionStorage.setItem('selectedCourse', JSON.stringify(course));
    
    // Navigate to details page
    window.location.href = `course-details.html?id=${courseId}`;
}

function getCourseVideoInfo(courseId) {
    const id = parseInt(courseId, 10);
    const course = coursesData.find(c => c.id === id);
    const stored = JSON.parse(localStorage.getItem('courseVideos') || '{}');
    const override = stored[id] || stored[String(id)];

    if (override?.videoId) {
        return {
            videoId: override.videoId,
            title: override.title || course?.youtubeVideoTitle || 'Course Video'
        };
    }

    return {
        videoId: course?.youtubeVideoId || '',
        title: course?.youtubeVideoTitle || 'Course Video'
    };
}

function renderCourseDetailHero(course) {
    if (!course.detailImage) return '';
    return `
                <section style="padding: 0; overflow: hidden;">
                    <img src="${course.detailImage}" alt="${course.title}" style="width: 100%; height: auto; display: block;">
                </section>`;
}

function renderCourseVideoEmbed(course) {
    const { videoId, title } = getCourseVideoInfo(course.id);
    if (!videoId) return '';

    return `
                    <div style="margin-bottom: 3rem;">
                        <div style="background: #000; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                            <div style="position: relative; padding-bottom: 56.25%; height: 0;">
                                <iframe
                                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                                    src="https://www.youtube.com/embed/${videoId}"
                                    title="${title}"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen="">
                                </iframe>
                            </div>
                        </div>
                        <p style="text-align: center; margin-top: 1rem; color: var(--text-light); font-size: 0.9rem;">
                            ℹ️ <strong>Video plays on live server.</strong> In development (file://) there may be restrictions, but it works perfectly when deployed!
                        </p>
                    </div>`;
}

function displayCourseDetails() {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('id');
    const storedCourse = sessionStorage.getItem('selectedCourse');
    
    let course;
    if (storedCourse) {
        course = JSON.parse(storedCourse);
    } else {
        course = coursesData.find(c => c.id === parseInt(courseId));
    }

    const canonicalCourse = coursesData.find(c => c.id === parseInt(courseId || course?.id, 10));
    if (canonicalCourse) {
        course = { ...canonicalCourse, ...course };
    }

    if (!course) {
        document.body.innerHTML = '<div class="container"><h1>Course not found</h1></div>';
        return;
    }

    const detailsContainer = document.querySelector('.course-details');
    if (detailsContainer) {
        const isAdmin = localStorage.getItem('userRole') === 'admin';
        const adminBtn = isAdmin ? `<button onclick="window.location.href='admin/image-editor.html?courseId=${course.id}'" style="position: absolute; top: 10px; right: 10px; background: linear-gradient(135deg, #ff6b6b, #ee5a6f); color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 8px; cursor: pointer; font-weight: 600; z-index: 10; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">🎨 Edit Image</button>` : '';
        
        detailsContainer.innerHTML = `
            <div style="position: relative;">
                ${adminBtn}
                ${renderCourseDetailHero(course)}
            </div>

            <div class="section">
                <div class="container">
                    ${renderCourseVideoEmbed(course)}
                </div>
            </div>

            <div class="section">
                <div class="container">
                    <button class="btn btn-primary" style="width: 100%; max-width: 400px; padding: 1rem; font-size: 1.1rem; margin-bottom: 2rem;" onclick="enrollCourse(${course.id}, '${course.title}')">
                        ✨ Enroll Now - Start Learning
                    </button>
                </div>
            </div>

            <div class="section">
                <div class="details-container">
                    <div class="details-main">
                        <div class="details-section">
                            <h3>📖 Course Overview</h3>
                            <p>${course.fullDescription}</p>
                        </div>

                        <div class="details-section">
                            <h3>🎯 Prerequisites</h3>
                            <ul>
                                ${course.prerequisites.map(prereq => `<li>${prereq}</li>`).join('')}
                            </ul>
                        </div>

                        <div class="details-section">
                            <h3>💡 Skills You'll Gain</h3>
                            <ul>
                                ${course.skillsGained.map(skill => `<li>${skill}</li>`).join('')}
                            </ul>
                        </div>

                        <div class="details-section">
                            <h3>📚 Curriculum Topics</h3>
                            <ul>
                                ${course.curriculumTopics.map(topic => `<li>${topic}</li>`).join('')}
                            </ul>
                        </div>

                        <div class="details-section">
                            <h3>🚀 Career Opportunities</h3>
                            <ul>
                                ${course.careerPaths.map(path => `<li>${path}</li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="details-sidebar">
                        <div class="details-info-box">
                            <div class="info-label">Duration</div>
                            <div class="info-value">${course.courseDuration}</div>
                        </div>

                        <div class="details-info-box">
                            <div class="info-label">Level</div>
                            <div class="info-value">${course.level}</div>
                        </div>

                        <div class="details-info-box">
                            <div class="info-label">Students Enrolled</div>
                            <div class="info-value">${course.students}</div>
                        </div>

                        <div class="details-info-box">
                            <div class="info-label">Rating</div>
                            <div class="info-value">⭐ ${course.rating}</div>
                        </div>

                        <button class="btn btn-quiz" style="width: 100%; padding: 1rem; margin-top: 1rem;" onclick="startQuiz(${course.id})">
                            📝 Take Quiz
                        </button>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">Learning Roadmap</h2>
                <div class="roadmap-container">
                    ${renderRoadmap()}
                </div>
            </div>

            <div class="section careers-section">
                <h2 class="section-title">Career Growth Opportunities</h2>
                <div class="future-opportunities">
                    ${renderFutureOpportunities(course.id)}
                </div>
            </div>
        `;
    }

    // Update page title
    document.title = `${course.title} - SkillBridge`;
}

// ============================================
// ROADMAP DISPLAY
// ============================================
function renderRoadmap() {
    return `
        <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: space-between; margin-top: 2rem;">
            ${roadmapStages.map((stage, index) => `
                <div style="flex: 1; min-width: 150px;">
                    <div style="text-align: center; padding: 1rem; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); border-radius: 0.5rem; color: white;">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">${stage.icon}</div>
                        <h4 style="margin-bottom: 0.5rem;">${stage.stage}</h4>
                        <p style="font-size: 0.9rem; opacity: 0.9;">${stage.duration}</p>
                    </div>
                    ${index < roadmapStages.length - 1 ? '<div style="text-align: center; margin-top: 1rem; font-size: 1.5rem;">→</div>' : ''}
                </div>
            `).join('')}
        </div>
    `;
}

// ============================================
// FUTURE OPPORTUNITIES DISPLAY
// ============================================
function renderFutureOpportunities(courseId) {
    const opportunities = futureOpportunitiesData[courseId];
    if (!opportunities) {
        return '<p>Career growth data coming soon.</p>';
    }

    return `
        <div style="margin-bottom: 2rem;">
            <h3 class="growth-paths-title">🚀 Growth Paths</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                ${opportunities.growthPaths.map(path => `
                    <div class="opportunity-card">
                        <h4>${path.title}</h4>
                        <div style="margin-bottom: 1rem;">
                            <p><strong>💰 Salary Range:</strong> ${path.salary}</p>
                            <p><strong>📈 Market Demand:</strong> ${path.demand}</p>
                            <p><strong>🎯 Career Path:</strong> ${path.growth}</p>
                        </div>
                        <div>
                            <strong>Key Skills:</strong>
                            <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                                ${path.skills.map(skill => `<li>${skill}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="insights-box">
            <h3>📊 Industry Insights</h3>
            <ul>
                ${opportunities.industryInsights.map(insight => `<li>${insight}</li>`).join('')}
            </ul>
        </div>
    `;
}

// ============================================
// QUIZ FUNCTIONALITY
// ============================================
function startQuiz(courseId) {
    const quiz = quizData[courseId];
    if (!quiz) {
        alert('Quiz not available for this course yet.');
        return;
    }

    sessionStorage.setItem('currentQuiz', JSON.stringify(quiz));
    sessionStorage.setItem('quizCourseId', courseId);
    window.location.href = 'quiz.html';
}

function displayQuiz() {
    const quizData = JSON.parse(sessionStorage.getItem('currentQuiz'));
    const quizContainer = document.getElementById('quizContainer');
    
    if (!quizData || !quizContainer) return;

    let currentQuestion = 0;
    let score = 0;
    const userAnswers = [];

    function showQuestion() {
        const question = quizData.questions[currentQuestion];
        quizContainer.innerHTML = `
            <div class="quiz-container">
                <div style="margin-bottom: 1rem;">
                    <div class="quiz-progress-header">
                        <h3>Question ${currentQuestion + 1}/${quizData.questions.length}</h3>
                        <div class="quiz-progress-percentage">
                            ${Math.round((currentQuestion / quizData.questions.length) * 100)}%
                        </div>
                    </div>
                    <div class="quiz-progress-bar">
                        <div class="quiz-progress-fill" style="width: ${(currentQuestion / quizData.questions.length) * 100}%;"></div>
                    </div>
                </div>
                
                <h4 class="quiz-question">${question.question}</h4>
                
                <div class="quiz-option" style="margin: 1.5rem 0;">
                    ${question.options.map((option, index) => `
                        <label>
                            <input type="radio" name="answer" value="${index}">
                            <span>${option}</span>
                        </label>
                    `).join('')}
                </div>

                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button class="btn btn-outline" ${currentQuestion === 0 ? 'disabled' : ''} onclick="previousQuestion()">
                        ← Previous
                    </button>
                    <button class="btn btn-primary" onclick="nextQuestion(${currentQuestion})">
                        Next →
                    </button>
                </div>
            </div>
        `;
    }

    window.nextQuestion = function(current) {
        const selected = document.querySelector('input[name="answer"]:checked');
        if (!selected) {
            alert('Please select an answer');
            return;
        }

        userAnswers[current] = parseInt(selected.value);
        const question = quizData.questions[current];
        if (parseInt(selected.value) === question.correct) {
            score++;
        }

        currentQuestion++;
        if (currentQuestion < quizData.questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    };

    window.previousQuestion = function() {
        currentQuestion--;
        showQuestion();
    };

    function showResults() {
        const percentage = Math.round((score / quizData.questions.length) * 100);
        const passed = percentage >= 70;
        const quizCourseId = sessionStorage.getItem('quizCourseId');

        saveQuizProgress(quizCourseId, score, quizData.questions.length);

        // Auto-create quiz certificates only when passed (>= 70%)
        if (passed) {
            const course = coursesData.find(c => String(c.id) === String(quizCourseId));
            const courseTitle = course?.title || 'Unknown Course';
            const issued = generateCertificate(parseInt(quizCourseId), courseTitle, 'quiz');
            if (issued) {
                showCertificateNotification(`Quiz certificate earned for ${courseTitle}! 📝`);
            }
        }

        quizContainer.innerHTML = `
            <div class="quiz-container">
                <div style="background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); color: white; padding: 3rem 2rem; border-radius: 1rem; text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">${passed ? '🎉' : '📚'}</div>
                    <h2 style="font-size: 2rem; margin-bottom: 1rem;">Quiz Complete!</h2>
                    <h3 style="font-size: 1.8rem; margin-bottom: 0.5rem;">${percentage}%</h3>
                    <p style="font-size: 1.2rem; margin-bottom: 1rem;">You scored ${score} out of ${quizData.questions.length}</p>
                    <p style="font-size: 1rem; opacity: 0.9; margin-bottom: 2rem;">
                        ${passed ? '🎊 Congratulations! You passed the quiz!' : '💪 Keep learning and try again!'}
                    </p>
                    
                    <button class="btn btn-secondary" onclick="window.history.back()">
                        Back to Course
                    </button>
                </div>

                <div style="margin-top: 2rem;">
                    <h3 style="margin-bottom: 1rem; color: var(--text-dark);">Review Answers</h3>
                    ${quizData.questions.map((q, index) => `
                        <div style="background: var(--light-bg); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border-left: 4px solid ${userAnswers[index] === q.correct ? '#10b981' : '#f59e0b'};">
                            <h4 style="color: var(--text-dark); margin-bottom: 0.5rem;">${q.question}</h4>
                            <p style="color: var(--text-light); margin-bottom: 0.25rem;"><strong>Your answer:</strong> ${q.options[userAnswers[index]]}</p>
                            <p style="color: var(--text-light); margin-bottom: 0.5rem;"><strong>Correct answer:</strong> ${q.options[q.correct]}</p>
                            <p style="color: var(--text-light); margin-top: 0.5rem;"><em>${q.explanation}</em></p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    showQuestion();
}

// ============================================
// PROGRESS TRACKING (LOCAL STORAGE)
// ============================================
function markAsCompleted(courseId, courseTitle) {
    let completedCourses = JSON.parse(localStorage.getItem('completedCourses')) || [];
    
    if (!completedCourses.find(c => c.id === courseId)) {
        completedCourses.push({
            id: courseId,
            title: courseTitle,
            completedAt: new Date().toLocaleString()
        });
        localStorage.setItem('completedCourses', JSON.stringify(completedCourses));
        alert(`✅ ${courseTitle} marked as completed!`);
        updateProgressDisplay();
    } else {
        alert('This course is already marked as completed.');
    }
}

function enrollCourse(courseId, courseTitle) {
    markAsCompleted(courseId, courseTitle);
}

function saveQuizProgress(courseId, score, total) {
    let quizScores = JSON.parse(localStorage.getItem('quizScores')) || [];
    
    quizScores.push({
        courseId: courseId,
        score: score,
        total: total,
        percentage: Math.round((score / total) * 100),
        date: new Date().toLocaleString()
    });
    
    localStorage.setItem('quizScores', JSON.stringify(quizScores));
}

function loadProgressFromStorage() {
    const completedCourses = JSON.parse(localStorage.getItem('completedCourses')) || [];
    const quizScores = JSON.parse(localStorage.getItem('quizScores')) || [];
    
    console.log('Completed Courses:', completedCourses);
    console.log('Quiz Scores:', quizScores);
}

function updateProgressDisplay() {
    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
        const completedCourses = JSON.parse(localStorage.getItem('completedCourses')) || [];
        const quizScores = JSON.parse(localStorage.getItem('quizScores')) || [];
        
        progressContainer.innerHTML = `
            <div style="background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); color: white; padding: 2rem; border-radius: 1rem; margin-bottom: 2rem;">
                <h3 style="margin-bottom: 1rem;">📊 Your Learning Progress</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    <div>
                        <div style="font-size: 2rem; font-weight: bold;">${completedCourses.length}</div>
                        <div>Courses Completed</div>
                    </div>
                    <div>
                        <div style="font-size: 2rem; font-weight: bold;">${quizScores.length}</div>
                        <div>Quizzes Taken</div>
                    </div>
                    <div>
                        <div style="font-size: 2rem; font-weight: bold;">
                            ${quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b.percentage, 0) / quizScores.length) : 0}%
                        </div>
                        <div>Average Score</div>
                    </div>
                </div>
            </div>
        `;
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ============================================
// CONTACT FORM HANDLING
// ============================================
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('contactName').value.trim(),
            email: document.getElementById('contactEmail').value.trim(),
            subject: document.getElementById('contactSubject').value.trim(),
            message: document.getElementById('contactMessage').value.trim()
        };

        // Validate form
        if (!validateContactForm(formData)) {
            showFormStatus('Please fill in all fields correctly.', 'error');
            return;
        }

        // Simulate form submission (in production, this would send to a server)
        submitContactForm(formData);
    });
}

function validateContactForm(data) {
    // Check if all fields are filled
    if (!data.name || !data.email || !data.subject || !data.message) {
        return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return false;
    }

    // Check minimum lengths
    if (data.name.length < 2) return false;
    if (data.subject.length < 3) return false;
    if (data.message.length < 10) return false;

    return true;
}

function submitContactForm(formData) {
    // Show loading state
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate API call with setTimeout
    setTimeout(() => {
        // In a real application, you would send data to a server here
        console.log('Form submitted:', formData);
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Show success message
        showFormStatus('✅ Message sent successfully! We will get back to you soon.', 'success');
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Clear message after 5 seconds
        setTimeout(() => {
            const statusEl = document.getElementById('formStatus');
            if (statusEl) {
                statusEl.textContent = '';
                statusEl.classList.remove('success', 'error');
            }
        }, 5000);
    }, 800);
}

function showFormStatus(message, type) {
    const statusEl = document.getElementById('formStatus');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.classList.remove('success', 'error');
        statusEl.classList.add(type);
    }
}

// Initialize contact form when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeContactForm);
} else {
    initializeContactForm();
}

// ============================================
// CERTIFICATE SYSTEM
// ============================================
function generateCertificate(courseId, courseTitle, certificateType = 'course') {
    const certificates = JSON.parse(localStorage.getItem('certificates')) || [];

    // Get user name from any input or use default
    const userName = localStorage.getItem('userFullName') || 'Learner';

    // Avoid duplicates for course certificates (one per course completion)
    if (certificateType === 'course') {
        const exists = certificates.some(c => String(c.courseId) === String(courseId) && c.type === 'course');
        if (exists) {
            return null;
        }
    }

    // Generate unique certificate ID
    const certificateId = 'CERT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const certificate = {
        id: certificateId,
        courseId: courseId,
        courseTitle: courseTitle,
        type: certificateType, // 'course' or 'quiz'
        userName: userName,
        issuedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        timestamp: Date.now(),
        verified: true
    };

    certificates.push(certificate);
    localStorage.setItem('certificates', JSON.stringify(certificates));

    return certificate;
}

function displayCertificates() {
    const certificates = JSON.parse(localStorage.getItem('certificates')) || [];
    const certificatesGrid = document.querySelector('.certificates-grid');
    const emptyState = document.querySelector('.empty-certificate-state');
    
    if (!certificatesGrid) return;
    
    if (certificates.length === 0) {
        certificatesGrid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    certificatesGrid.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';
    
    certificatesGrid.innerHTML = certificates.map((cert, index) => `
        <div class="certificate-card" data-certificate-id="${cert.id}" data-type="${cert.type}">
            <div class="certificate-badge">
                <div class="certificate-badge-icon">${cert.type === 'quiz' ? '📝' : '📜'}</div>
            </div>
            <div class="certificate-info">
                <h3>${cert.courseTitle}</h3>
                <p>🏆 ${cert.type === 'quiz' ? 'Quiz Completion' : 'Course Completion'}</p>
                <p>📅 ${cert.issuedDate}</p>
                <p>👤 ${cert.userName}</p>
                <div class="certificate-meta">
                    <span class="certificate-id">${cert.id}</span>
                    <button class="certificate-action-btn" onclick="viewCertificate('${cert.id}')">View</button>
                </div>
            </div>
        </div>
    `).join('');
}

function setupCertificateFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const certificates = JSON.parse(localStorage.getItem('certificates')) || [];
            const certificatesGrid = document.querySelector('.certificates-grid');
            
            let filtered = certificates;
            if (filter === 'completed') {
                filtered = certificates.filter(c => c.type === 'course');
            } else if (filter === 'quizzes') {
                filtered = certificates.filter(c => c.type === 'quiz');
            }
            
            if (filtered.length === 0) {
                certificatesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No certificates in this category</p>';
                return;
            }
            
            certificatesGrid.innerHTML = filtered.map(cert => `
                <div class="certificate-card" data-certificate-id="${cert.id}" data-type="${cert.type}">
                    <div class="certificate-badge">
                        <div class="certificate-badge-icon">${cert.type === 'quiz' ? '📝' : '📜'}</div>
                    </div>
                    <div class="certificate-info">
                        <h3>${cert.courseTitle}</h3>
                        <p>🏆 ${cert.type === 'quiz' ? 'Quiz Completion' : 'Course Completion'}</p>
                        <p>📅 ${cert.issuedDate}</p>
                        <p>👤 ${cert.userName}</p>
                        <div class="certificate-meta">
                            <span class="certificate-id">${cert.id}</span>
                            <button class="certificate-action-btn" onclick="viewCertificate('${cert.id}')">View</button>
                        </div>
                    </div>
                </div>
            `).join('');
        });
    });
}

function viewCertificate(certificateId) {
    const certificates = JSON.parse(localStorage.getItem('certificates')) || [];
    const certificate = certificates.find(c => c.id === certificateId);
    
    if (!certificate) return;
    
    const certificateDisplay = document.getElementById('certificateDisplay');
    if (!certificateDisplay) return;
    
    const currentYear = new Date().getFullYear();
    
    const completionTypeText = certificate.type === 'quiz' ? 'completed the quiz' : 'completed the course';
    const completionLabel = certificate.type === 'quiz' ? 'Quiz Completion Certificate' : 'Course Completion Certificate';
    
    certificateDisplay.innerHTML = `
        <div class="certificate-display">
            <div class="certificate-header">
                <h2>${completionLabel}</h2>
                <p>IN RECOGNITION OF DEDICATION AND EXCELLENCE</p>
            </div>
            
            <div class="certificate-body">
                <h3>This is to certify that</h3>
                <div class="certificate-recipient">${certificate.userName}</div>
                <p>has successfully ${completionTypeText}</p>
                <h3 style="font-size: 1.4rem; color: var(--primary-color); font-weight: bold;">${certificate.courseTitle}</h3>
                <p><strong>Completion date:</strong> ${certificate.issuedDate}</p>
                <p style="margin-top: 1rem; font-style: italic; font-size: 0.9rem;">Certificate ID: ${certificate.id}</p>
            </div>
            
            <div class="certificate-footer">
                <div class="certificate-signature">
                    <div class="certificate-signature-line"></div>
                    <div class="certificate-signature-text">SkillBridge Signature</div>
                </div>
                <div class="certificate-seal">✅ Verified Badge</div>
                <div class="certificate-signature">
                    <div class="certificate-signature-line"></div>
                    <div class="certificate-signature-text">${currentYear}</div>
                </div>
            </div>
        </div>
    `;
    
    // Show modal
    const modal = document.getElementById('certificateModal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
    }
    
    // Setup action buttons
    setupCertificateActions(certificate);
}

function setupCertificateModal() {
    const modal = document.getElementById('certificateModal');
    const closeBtn = document.querySelector('.modal-close');
    
    if (!modal || !closeBtn) return;
    
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            this.style.display = 'none';
        }
    });
}

function setupCertificateActions(certificate) {
    const downloadBtn = document.getElementById('downloadBtn');
    const printBtn = document.getElementById('printBtn');
    const shareBtn = document.getElementById('shareBtn');
    
    if (downloadBtn) {
        downloadBtn.onclick = function() {
            downloadCertificate(certificate);
        };
    }
    
    if (printBtn) {
        printBtn.onclick = function() {
            printCertificate();
        };
    }
    
    if (shareBtn) {
        shareBtn.onclick = function() {
            shareCertificate(certificate);
        };
    }
}

function downloadCertificate(certificate) {
    const certificateDisplay = document.getElementById('certificateDisplay');
    if (!certificateDisplay) return;
    
    // Create a canvas from the certificate
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    
    // Draw certificate background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#fff9e6');
    gradient.addColorStop(1, '#fff0cc');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    
    // Draw inner border
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);
    
    // Draw text
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 48px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Achievement', canvas.width / 2, 150);
    
    ctx.fillStyle = '#666';
    ctx.font = '18px Georgia, serif';
    ctx.fillText('IN RECOGNITION OF DEDICATION AND EXCELLENCE', canvas.width / 2, 220);
    
    ctx.font = 'normal 24px Georgia, serif';
    ctx.fillText('This is to certify that', canvas.width / 2, 380);
    
    ctx.fillStyle = '#000';
    ctx.font = 'bold 36px Georgia, serif';
    ctx.fillText(certificate.userName, canvas.width / 2, 480);
    
    ctx.fillStyle = '#666';
    ctx.font = 'normal 24px Georgia, serif';
    ctx.fillText('has successfully completed the course', canvas.width / 2, 580);
    
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.fillText(certificate.courseTitle, canvas.width / 2, 660);
    
    ctx.fillStyle = '#666';
    ctx.font = 'normal 20px Georgia, serif';
    ctx.fillText('on this ' + certificate.issuedDate, canvas.width / 2, 750);
    
    ctx.font = 'italic 16px Georgia, serif';
    ctx.fillText('Certificate ID: ' + certificate.id, canvas.width / 2, 850);
    
    // Download
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${certificate.courseTitle}_Certificate_${Date.now()}.png`;
    link.click();
}

function printCertificate() {
    const printWindow = window.open('', '', 'width=1000,height=600');
    const certificateDisplay = document.getElementById('certificateDisplay');
    
    if (!certificateDisplay) return;
    
    const certificateHTML = certificateDisplay.innerHTML;
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Certificate</title>
            <style>
                body { margin: 0; padding: 20px; font-family: Georgia, serif; }
                .certificate-display { 
                    width: 100%; 
                    aspect-ratio: 16/10; 
                    background: linear-gradient(135deg, #fff9e6 0%, #fff0cc 100%);
                    padding: 30px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    text-align: center;
                    page-break-after: always;
                }
                @media print {
                    body { padding: 0; }
                }
            </style>
        </head>
        <body>
            ${certificateHTML}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

function shareCertificate(certificate) {
    const text = `I just earned a certificate of achievement from SkillBridge for completing ${certificate.courseTitle}! 🎓 Join me on this amazing learning journey.`;
    
    // Try to use Web Share API
    if (navigator.share) {
        navigator.share({
            title: 'SkillBridge Certificate',
            text: text
        }).catch(err => console.log('Share error:', err));
    } else {
        // Fallback: copy to clipboard
        const shareText = `${text}\n\nCertificate ID: ${certificate.id}`;
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Certificate info copied to clipboard!');
        }).catch(() => {
            alert('Certificate details:\n' + shareText);
        });
    }
}

// Update markAsCompleted to also generate certificate
function updateMarkAsCompletedWithCertificate() {
    const originalMarkAsCompleted = window.markAsCompleted;
    
    window.markAsCompleted = function(courseId, courseTitle) {
        // Call original function
        originalMarkAsCompleted.call(this, courseId, courseTitle);
        
        // Generate certificate
        generateCertificate(courseId, courseTitle, 'course');
        
        // Show success message
        showCertificateNotification(`Certificate earned for ${courseTitle}! 🎓`);
    };
}

function showCertificateNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 999;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize certificate system
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateMarkAsCompletedWithCertificate);
} else {
    updateMarkAsCompletedWithCertificate();
}

// ============================================
// ONBOARDING & ADMIN REDIRECT HELPERS
// ============================================

// Pages that guests are allowed to visit without logging in
const PUBLIC_PAGES = [
    'index.html',
    'register.html',
    'login.html',
    'getting-started.html',
    'admin-login.html',
    'course-details.html',
    'roadmap.html',
    'skills.html',
    'quiz.html'
];

function maybeApplyAdminHomeContent() {
    try {
        const path = window.location.pathname.replace(/\\/g, '/');
        const isHome = !path.includes('/admin/') && !path.includes('/student/') && (path.endsWith('index.html') || path.endsWith('/') || path.split('/').pop() === 'index.html');
        if (!isHome) return;

        // If admin edited content exists, render it into index.html DOM.
        const raw = localStorage.getItem('adminSiteContent');
        if (!raw) return;
        const content = JSON.parse(raw);

        // Hero section
        const heroH1 = document.querySelector('.hero-content h1');
        const heroP = document.querySelector('.hero-content p');
        if (heroH1 && content.heroTitle) heroH1.textContent = content.heroTitle;
        if (heroP && content.heroSubtitle) heroP.textContent = content.heroSubtitle;

        // Featured section
        const featuredH2 = document.querySelector('#featured .section-title');
        if (featuredH2 && content.featuredHeader) featuredH2.textContent = content.featuredHeader;

        const skillsGrid = document.querySelector('.skills-grid');
        if (skillsGrid) {
            // Featured limit
            const limit = typeof content.featuredLimit === 'number' ? content.featuredLimit : parseInt(content.featuredLimit, 10);
            const featuredCourses = Number.isFinite(limit) && limit >= 0 ? coursesData.slice(0, limit) : coursesData.slice(0, 3);
            renderSkillCards(featuredCourses);
        }

        // About section
        const aboutH2 = document.querySelector('#about-us > .container > .section-title');
        const aboutIntroH3 = document.querySelector('#about-us .about-intro-text h3');
        const aboutIntroP = document.querySelector('#about-us .about-intro-text p');
        if (aboutH2 && content.aboutTitle) aboutH2.textContent = content.aboutTitle;
        if (aboutIntroH3 && content.aboutIntroH3) aboutIntroH3.textContent = content.aboutIntroH3;
        if (aboutIntroP && content.aboutIntroP) aboutIntroP.textContent = content.aboutIntroP;

        // Mission & Vision cards: they are in .about-grid .about-card h3 and p order
        const aboutCards = document.querySelectorAll('#about-us .about-grid .about-card');
        if (aboutCards && aboutCards.length >= 2) {
            const missionCard = aboutCards[0];
            const visionCard = aboutCards[1];

            const missionH3 = missionCard.querySelector('h3');
            const missionP = missionCard.querySelector('p');
            if (missionH3 && content.missionTitle) missionH3.textContent = content.missionTitle;
            if (missionP && content.missionP) missionP.textContent = content.missionP;

            const visionH3 = visionCard.querySelector('h3');
            const visionP = visionCard.querySelector('p');
            if (visionH3 && content.visionTitle) visionH3.textContent = content.visionTitle;
            if (visionP && content.visionP) visionP.textContent = content.visionP;
        }

        // Why choose cards
        const whyTitle = document.querySelector('#about-us > .container > div[style*="margin-top: 4rem"] h3');
        if (whyTitle && content.whyCards && content.whyCards.length) {
            // Keep the existing title text if not provided; otherwise replace by string stored in header key isn't in defaults.
            // We'll update card list only.
        }
        const featuresGrid = document.querySelector('#about-us .features-grid');
        if (featuresGrid && content.whyCards) {
            featuresGrid.innerHTML = cleanRepeatedCards(content.whyCards).map(c => `
                <div class="feature-item">
                    <div class="feature-icon">${c.icon || ''}</div>
                    <h4>${c.title || ''}</h4>
                    <p style="color: var(--text-light);">${c.paragraph || ''}</p>
                </div>
            `).join('');
        }

        // Contact section
        const contactH2 = document.querySelector('#contact-us .section-title');
        if (contactH2 && content.contactTitle) contactH2.textContent = content.contactTitle;

        const contactFormHeading = document.querySelector('#contact-us .contact-form-container h3');
        if (contactFormHeading && content.contactFormTitle) contactFormHeading.textContent = content.contactFormTitle;

        // Contact form fields labels left as-is (Full Name / Email / Subject / Message)

        const contactInfoItems = document.querySelectorAll('#contact-us .contact-info-item');
        if (contactInfoItems && content.contactInfo) {
            cleanRepeatedContactInfo(content.contactInfo).slice(0, 4).forEach((ci, idx) => {
                const item = contactInfoItems[idx];
                if (!item) return;
                const iconEl = item.querySelector('.info-icon');
                const h4El = item.querySelector('h4');
                const pEls = item.querySelectorAll('p');

                if (iconEl && (!ci.icon || String(ci.icon).length <= 6)) iconEl.textContent = ci.icon || '';
                if (h4El) h4El.textContent = ci.title || '';

                const lines = ci.lines || [];
                const textWrap = item.querySelector('div:not(.info-icon)');
                if (textWrap) {
                    textWrap.innerHTML = `<h4>${ci.title || ''}</h4>` + lines.map(line => `<p>${line}</p>`).join('');
                }
            });
        }

        // Social links
        const socialIcons = document.querySelector('#contact-us .social-icons');
        if (socialIcons && content.social) {
            socialIcons.innerHTML = uniqueByValue(content.social, (s) => `${s.label || ''}|${s.url || ''}`).map(s => `
                <a href="${s.url || '#'}" class="social-icon" title="${s.label || ''}">${s.emoji || ''}</a>
            `).join('');
        }

        // Footer links + bottom
        const footer = document.querySelector('footer');
        if (footer && content.footer) {
            const footerSections = footer.querySelectorAll('.footer-section');
            // Sections correspond roughly to 4 blocks in this template.
            footerSections.forEach((sec, i) => {
                const block = content.footer[i];
                if (!block) return;
                const h4 = sec.querySelector('h4');
                if (h4) h4.textContent = block.title || '';
                const ul = sec.querySelector('ul');
                if (ul) {
                    ul.innerHTML = cleanRepeatedLinks(block.links).map(l => `<li><a href="${l.href || '#'}">${l.text || ''}</a></li>`).join('');
                }
            });

            const footerBottomP = footer.querySelector('.footer-bottom p');
            if (footerBottomP && content.footerBottom) footerBottomP.textContent = content.footerBottom;
        }
    } catch (e) {
        // ignore
    }
}

function uniqueByValue(items, getValue) {
    const seen = new Set();
    return (items || []).filter((item) => {
        const value = String(getValue(item) || '').trim().toLowerCase();
        if (!value || seen.has(value)) return false;
        seen.add(value);
        return true;
    });
}

function cleanRepeatedLines(lines) {
    return uniqueByValue(lines || [], (line) => line);
}

function cleanRepeatedContactInfo(contactInfo) {
    return uniqueByValue(contactInfo || [], (item) => item?.title)
        .map((item) => ({
            ...item,
            lines: cleanRepeatedLines(item.lines)
        }));
}

function cleanRepeatedCards(cards) {
    return uniqueByValue(cards || [], (card) => `${card?.title || ''}|${card?.paragraph || ''}`);
}

function cleanRepeatedLinks(links) {
    return uniqueByValue(links || [], (link) => `${link?.text || ''}|${link?.href || ''}`);
}

function applySkillBridgeContactDetails() {
    if (!isRootHomePage()) return;

    const contactInfoContainer = document.querySelector('#contact-us .contact-info-container');
    if (!contactInfoContainer) return;

    contactInfoContainer.innerHTML = `
        <h3>Contact Information</h3>

        <div class="contact-info-item">
            <div class="info-icon">✉️</div>
            <div>
                <h4>Email</h4>
                <p><a href="mailto:support@skillbridge.com">support@skillbridge.com</a></p>
            </div>
        </div>

        <div class="contact-info-item">
            <div class="info-icon">📞</div>
            <div>
                <h4>Phone</h4>
                <p><a href="tel:+919876543210">+91 9876543210</a></p>
            </div>
        </div>

        <div class="contact-info-item">
            <div class="info-icon">📍</div>
            <div>
                <h4>Location</h4>
                <p>No.123, Tech Park Building<br>Anna Nagar<br>Chennai-600002<br>Tamil Nadu, India</p>
            </div>
        </div>
    `;
}

function isRootHomePage() {
    const path = window.location.pathname.replace(/\\/g, '/');
    const pageName = path.split('/').pop() || 'index.html';
    return !path.includes('/admin/') &&
        !path.includes('/student/') &&
        (pageName === 'index.html' || pageName === '');
}

function setupAdminHomeEditor() {
    const session = getSession();
    if (!session || session.role !== 'admin' || !isRootHomePage()) return;
    if (document.getElementById('adminHomeEditorBar')) return;

    const style = document.createElement('style');
    style.textContent = `
        .admin-home-editor-bar {
            position: fixed;
            left: 50%;
            bottom: 1.25rem;
            transform: translateX(-50%);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: .75rem;
            flex-wrap: wrap;
            max-width: calc(100% - 2rem);
            padding: .8rem 1rem;
            border-radius: .75rem;
            background: rgba(17, 24, 39, .94);
            color: #fff;
            box-shadow: 0 18px 45px rgba(0, 0, 0, .28);
        }
        .admin-home-editor-bar strong { white-space: nowrap; }
        .admin-home-editor-bar button,
        .admin-home-editor-bar a {
            border: 0;
            border-radius: .55rem;
            padding: .55rem .9rem;
            font-weight: 800;
            cursor: pointer;
            text-decoration: none;
            line-height: 1;
        }
        .admin-home-editor-primary { background: #10b981; color: #fff; }
        .admin-home-editor-secondary { background: #6366f1; color: #fff; }
        .admin-home-editor-danger { background: #ef4444; color: #fff; }
        .admin-home-editing [data-admin-inline-edit-id] {
            outline: 2px dashed #10b981;
            outline-offset: 5px;
            border-radius: .35rem;
            cursor: text;
        }
        .admin-home-editing [data-admin-inline-edit-id]:focus {
            outline: 3px solid #10b981;
            background: rgba(16, 185, 129, .08);
        }
        .admin-home-editing a[data-admin-inline-edit-id],
        .admin-home-editing button[data-admin-inline-edit-id] {
            pointer-events: auto;
        }
    `;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.id = 'adminHomeEditorBar';
    bar.className = 'admin-home-editor-bar';
    bar.innerHTML = `
        <strong>Admin Home Page Edit</strong>
        <button type="button" class="admin-home-editor-primary" id="adminStartEditBtn">Edit Home</button>
        <button type="button" class="admin-home-editor-primary" id="adminSaveEditBtn" style="display:none;">Save</button>
        <button type="button" class="admin-home-editor-danger" id="adminCancelEditBtn" style="display:none;">Cancel</button>
    `;
    document.body.appendChild(bar);

    document.getElementById('adminStartEditBtn')?.addEventListener('click', startAdminHomeEditMode);
    document.getElementById('adminSaveEditBtn')?.addEventListener('click', saveAdminHomeTextEdits);
    document.getElementById('adminCancelEditBtn')?.addEventListener('click', () => window.location.reload());
}

const ADMIN_HOME_INLINE_KEY = 'adminHomeInlineEdits';
const ADMIN_HOME_INLINE_VERSION_KEY = 'adminHomeInlineEditVersion';
const ADMIN_HOME_INLINE_VERSION = '2';
const ADMIN_HOME_EDIT_SELECTOR = [
    'main h1', 'main h2', 'main h3', 'main h4', 'main p', 'main li', 'main a', 'main button', 'main label',
    'section h1', 'section h2', 'section h3', 'section h4', 'section p', 'section li', 'section a', 'section button', 'section label',
    'footer h4', 'footer p', 'footer li', 'footer a',
    '.hero h1', '.hero p', '.hero a',
    '.skill-card h3', '.skill-card p', '.skill-card span', '.skill-card button',
    '.career-card h3', '.career-card li'
].join(', ');

function getAdminHomeEditableElements() {
    if (!isRootHomePage()) return [];

    return Array.from(document.querySelectorAll(ADMIN_HOME_EDIT_SELECTOR))
        .filter((el) => {
            if (!el || !el.textContent.trim()) return false;
            if (el.closest('nav') || el.closest('#adminHomeEditorBar')) return false;
            if (el.closest('script') || el.closest('style')) return false;
            if (el.querySelector('h1, h2, h3, h4, p, li, a, button, label, span')) return false;
            return true;
        });
}

function getAdminHomeInlineId(el, index) {
    const explicitId = el.id ? `#${el.id}` : '';
    const className = Array.from(el.classList || []).slice(0, 2).join('.');
    const classPart = className ? `.${className}` : '';
    return `${el.tagName.toLowerCase()}${explicitId}${classPart}:${index}`;
}

function applyAdminHomeInlineEdits() {
    if (!isRootHomePage()) return;

    if (localStorage.getItem(ADMIN_HOME_INLINE_VERSION_KEY) !== ADMIN_HOME_INLINE_VERSION) {
        localStorage.removeItem(ADMIN_HOME_INLINE_KEY);
        localStorage.setItem(ADMIN_HOME_INLINE_VERSION_KEY, ADMIN_HOME_INLINE_VERSION);
    }

    let edits = {};
    try {
        edits = JSON.parse(localStorage.getItem(ADMIN_HOME_INLINE_KEY)) || {};
    } catch (e) {
        edits = {};
    }

    getAdminHomeEditableElements().forEach((el, index) => {
        const id = getAdminHomeInlineId(el, index);
        if (Object.prototype.hasOwnProperty.call(edits, id)) {
            el.textContent = edits[id];
        }
    });
}

function startAdminHomeEditMode() {
    document.body.classList.add('admin-home-editing');

    getAdminHomeEditableElements().forEach((el, index) => {
        el.dataset.adminInlineEditId = getAdminHomeInlineId(el, index);
        el.dataset.adminOriginalHref = el.getAttribute('href') || '';
        el.setAttribute('contenteditable', 'true');
        el.setAttribute('spellcheck', 'true');
        if (el.tagName.toLowerCase() === 'a') {
            el.addEventListener('click', preventAdminEditableNavigation);
        }
    });

    const firstEditable = document.querySelector('[data-admin-inline-edit-id]');
    if (firstEditable) firstEditable.focus();

    document.getElementById('adminStartEditBtn').style.display = 'none';
    document.getElementById('adminSaveEditBtn').style.display = 'inline-flex';
    document.getElementById('adminCancelEditBtn').style.display = 'inline-flex';
}

function saveAdminHomeTextEdits() {
    const edits = {};

    getAdminHomeEditableElements().forEach((el) => {
        const id = el.dataset.adminInlineEditId;
        if (id) edits[id] = el.textContent.trim();
        el.removeAttribute('contenteditable');
        el.removeEventListener('click', preventAdminEditableNavigation);
        delete el.dataset.adminInlineEditId;
        delete el.dataset.adminOriginalHref;
    });

    localStorage.setItem(ADMIN_HOME_INLINE_KEY, JSON.stringify(edits));
    localStorage.setItem(ADMIN_HOME_INLINE_VERSION_KEY, ADMIN_HOME_INLINE_VERSION);
    document.body.classList.remove('admin-home-editing');

    const bar = document.getElementById('adminHomeEditorBar');
    if (bar) {
        bar.querySelector('strong').textContent = 'Saved. Home updated.';
    }

    document.getElementById('adminStartEditBtn').style.display = 'inline-flex';
    document.getElementById('adminSaveEditBtn').style.display = 'none';
    document.getElementById('adminCancelEditBtn').style.display = 'none';
}

function preventAdminEditableNavigation(event) {
    if (document.body.classList.contains('admin-home-editing')) {
        event.preventDefault();
    }
}

function checkOnboardingRedirect() {
    const path = window.location.pathname.replace(/\\/g, '/');
    const fileName = path.split('/').pop() || 'index.html';

    // Admin pages handle their own auth – skip
    if (path.includes('/admin/')) return;

    // Allow whitelisted public pages through
    if (PUBLIC_PAGES.includes(fileName)) return;

    // Every other page requires a valid session
    const session = getSession();
    if (!session) {
        // Build the correct relative path back to register.html
        const isInSubfolder = path.includes('/student/');
        window.location.href = isInSubfolder ? '../register.html' : 'register.html';
    }
}

function setupLogoDblClick() {
    const logos = document.querySelectorAll('.logo');
    logos.forEach(logo => {
        logo.addEventListener('dblclick', function(e) {
            e.preventDefault();
            const path = window.location.pathname.replace(/\\/g, '/');
            const inSubfolder = path.includes('/student/') || path.includes('/admin/');
            const target = inSubfolder ? 'admin-login.html' : 'admin/admin-login.html';
            window.location.href = target;
        });
    });
}

function logoutAndRedirect() {
    const session = getSession();
    const role = session?.role;
    logoutUser();
    
    const path = window.location.pathname.replace(/\\/g, '/');
    const inSubfolder = path.includes('/student/') || path.includes('/admin/');
    
    if (role === 'admin') {
        window.location.href = inSubfolder ? 'admin-login.html' : 'admin/admin-login.html';
    } else {
        window.location.href = inSubfolder ? '../register.html' : 'register.html';
    }
}

function renderDynamicNavbar() {
    const navLinksEl = document.querySelector('.nav-links');
    if (!navLinksEl) return;

    const path = window.location.pathname.replace(/\\/g, '/');
    const inSubfolder = path.includes('/student/') || path.includes('/admin/');
    const prefix = inSubfolder ? '../' : '';
    const session = getSession();

    // Determine current page filename to set 'active' class
    const pageName = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    let html = '';

    if (session && session.role === 'student') {
        // Logged in as student
        const isDashboard = pageName === 'dashboard.html' && path.includes('/student/');
        const isProfile = pageName === 'profile.html';
        const isMyCourses = pageName === 'mycourses.html';
        const isMyCerts = pageName === 'certificates.html' && path.includes('/student/');
        const isSkills = pageName === 'skills.html';
        const isProgress = pageName === 'progress.html';
        const isCertificates = pageName === 'certificate.html';
        const isRoadmap = pageName === 'roadmap.html';

        html += `
            <li><a href="${prefix}index.html" class="${pageName === 'index.html' ? 'active' : ''}">Home</a></li>
            <li><a href="${prefix}skills.html" class="${isSkills ? 'active' : ''}">Skills</a></li>
            <li><a href="${prefix}progress.html" class="${isProgress ? 'active' : ''}">Progress</a></li>
            <li><a href="${prefix}roadmap.html" class="${isRoadmap ? 'active' : ''}">Roadmap</a></li>
            <li><a href="${prefix}certificate.html" class="${isCertificates ? 'active' : ''}">Certificates</a></li>
            <li><a href="${inSubfolder ? '' : 'student/'}dashboard.html" class="${isDashboard ? 'active' : ''}">Dashboard</a></li>
            <li><a href="${inSubfolder ? '' : 'student/'}profile.html" class="${isProfile ? 'active' : ''}">My Profile</a></li>
            <li><a href="${inSubfolder ? '' : 'student/'}mycourses.html" class="${isMyCourses ? 'active' : ''}">My Courses</a></li>
            <li><a href="${inSubfolder ? '' : 'student/'}certificates.html" class="${isMyCerts ? 'active' : ''}">My Certificates</a></li>
            <li><button onclick="logoutAndRedirect()" style="padding: 0.4rem 1rem; font-size: 0.9rem; font-weight: 700; background: linear-gradient(135deg, #ef4444, #dc2626); border: none; color: #fff; border-radius: 8px; cursor: pointer; box-shadow: 0 2px 8px rgba(239,68,68,0.4); transition: opacity 0.2s;">🚪 Logout</button></li>
        `;
    } else if (session && session.role === 'admin') {
        // Logged in as admin
        const isDashboard = pageName === 'dashboard.html' && path.includes('/admin/');
        const isStudents = pageName === 'students.html';
        const isCourses = pageName === 'courses.html';
        const isQuizzes = pageName === 'quizzes.html';
        const isReports = pageName === 'reports.html';
        const isSettings = pageName === 'settings.html';
        const isSiteEditor = pageName === 'site-editor.html';
        const isFeedback = pageName === 'feedback.html';

        html += `
            <li><a href="${prefix}index.html" class="${pageName === 'index.html' ? 'active' : ''}">Home</a></li>
            <li><a href="${inSubfolder ? '' : 'admin/'}dashboard.html" class="${isDashboard ? 'active' : ''}">Dashboard</a></li>
            <li><a href="${inSubfolder ? '' : 'admin/'}students.html" class="${isStudents ? 'active' : ''}">Students</a></li>
            <li><a href="${inSubfolder ? '' : 'admin/'}courses.html" class="${isCourses ? 'active' : ''}">Courses</a></li>
            <li><a href="${inSubfolder ? '' : 'admin/'}quizzes.html" class="${isQuizzes ? 'active' : ''}">Quizzes</a></li>
            <li><a href="${inSubfolder ? '' : 'admin/'}reports.html" class="${isReports ? 'active' : ''}">Reports</a></li>
            <li><a href="${inSubfolder ? '' : 'admin/'}settings.html" class="${isSettings ? 'active' : ''}">Settings</a></li>
            <li><a href="${inSubfolder ? '' : 'admin/'}site-editor.html" class="${isSiteEditor ? 'active' : ''}">Site Editor</a></li>
            <li><button onclick="logoutAndRedirect()" style="padding: 0.4rem 1rem; font-size: 0.9rem; font-weight: 700; background: linear-gradient(135deg, #ef4444, #dc2626); border: none; color: #fff; border-radius: 8px; cursor: pointer; box-shadow: 0 2px 8px rgba(239,68,68,0.4); transition: opacity 0.2s;">🚪 Logout</button></li>
        `;
    } else {
        // Guest user (not logged in)
        const isSkills = pageName === 'skills.html';
        const isProgress = pageName === 'progress.html';
        const isCertificates = pageName === 'certificate.html';
        const isRoadmap = pageName === 'roadmap.html';
        const isRegister = pageName === 'register.html';

        html += `
            <li><a href="${prefix}index.html" class="${pageName === 'index.html' ? 'active' : ''}">Home</a></li>
            <li><a href="${prefix}skills.html" class="${isSkills ? 'active' : ''}">Skills</a></li>
            <li><a href="${prefix}progress.html" class="${isProgress ? 'active' : ''}">Progress</a></li>
            <li><a href="${prefix}roadmap.html" class="${isRoadmap ? 'active' : ''}">Roadmap</a></li>
            <li><a href="${prefix}certificate.html" class="${isCertificates ? 'active' : ''}">Certificates</a></li>
            <li><a href="${prefix}register.html" class="${isRegister ? 'active' : ''}">Register</a></li>
        `;
    }

    // Append theme toggle to the list
    html += `<li><button id="themeToggle" class="btn" style="background: rgba(255,255,255,0.2); border: 1px solid white; color: white;">🌙</button></li>`;

    navLinksEl.innerHTML = html;
}

function setupHomeFeedbackForm() {
    // Check if we're on home page with feedback form
    const feedbackForm = document.getElementById('homeFeedbackForm');
    if (!feedbackForm) return;

    // Populate course select
    const courseSelect = document.getElementById('feedbackHomeCourse');
    const coursesArray = Array.isArray(coursesData) ? coursesData : Object.values(coursesData);
    
    coursesArray.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = `${course.icon} ${course.title}`;
        courseSelect.appendChild(option);
    });

    // Setup rating buttons
    const ratingButtons = document.querySelectorAll('#homeRatingGroup .rating-btn');
    ratingButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            ratingButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('feedbackHomeRating').value = this.dataset.value;
        });
    });

    // Setup form submission
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!document.getElementById('feedbackHomeRating').value) {
            showHomeFeedbackStatus('Please select a rating', 'error');
            return;
        }

        const feedback = {
            id: Date.now(),
            name: document.getElementById('feedbackUserName').value,
            email: document.getElementById('feedbackUserEmail').value,
            course: document.getElementById('feedbackHomeCourse').value || 'Not specified',
            type: document.getElementById('feedbackHomeType').value,
            rating: document.getElementById('feedbackHomeRating').value,
            message: document.getElementById('feedbackHomeText').value,
            date: new Date().toLocaleString(),
            timestamp: Date.now()
        };

        let feedbackList = JSON.parse(localStorage.getItem('feedbackList')) || [];
        feedbackList.push(feedback);
        localStorage.setItem('feedbackList', JSON.stringify(feedbackList));

        showHomeFeedbackStatus('Thank you! Your feedback has been submitted successfully. 🎉', 'success');
        feedbackForm.reset();
        document.querySelectorAll('#homeRatingGroup .rating-btn').forEach(b => b.classList.remove('active'));
    });
}

function showHomeFeedbackStatus(message, type) {
    const statusDiv = document.getElementById('homeFeedbackStatus');
    statusDiv.textContent = message;
    statusDiv.className = `form-status ${type}`;
    statusDiv.style.marginTop = '1rem';

    if (type === 'success') {
        setTimeout(() => {
            statusDiv.textContent = '';
            statusDiv.className = '';
        }, 5000);
    }
}
