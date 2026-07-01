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
    // Check and clear old cached courses if schema is outdated or missing Finance courses (ID 21)
    const stored = localStorage.getItem('coursesData') || localStorage.getItem('customCourses');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            const financeCourse = parsed.find(c => c.id === 21);
            if (!financeCourse) {
                localStorage.removeItem('coursesData');
                localStorage.removeItem('customCourses');
                window.location.reload();
                return;
            }
        } catch(e) {}
    }

    // Sync and clear old cached quiz data if version is outdated
    if (localStorage.getItem('quizDataVersion') !== '3.0') {
        localStorage.removeItem('customQuizzes');
        localStorage.removeItem('quizEditorData');
        localStorage.setItem('quizDataVersion', '3.0');
    }

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
    localStorage.removeItem('userFullName');
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
    const uname = (username || '').trim().toLowerCase();
    const fname = (fullName || '').trim();
    const emailValue = normalizeEmail(email);

    if (!uname || !fname || !emailValue || !password) {
        return { ok: false, message: 'Please fill all fields.' };
    }

    if (!isValidEmail(emailValue)) {
        return { ok: false, message: 'Please enter a valid email address.' };
    }

    if (users.some(u => u.username.toLowerCase() === uname)) {
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
    const loginId = (username || '').trim().toLowerCase();
    const loginEmail = normalizeEmail(loginId);

    if (!loginId || !password) {
        return { ok: false, message: 'Please enter username/email and password.' };
    }

    const matches = users.filter((u) => {
        const sameUsername = u.username.toLowerCase() === loginId;
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
    const uname = (username || '').trim().toLowerCase();

    if (!uname || !newPassword) {
        return { ok: false, message: 'Please enter username and new password.' };
    }

    if (newPassword.length < 6) {
        return { ok: false, message: 'Password must be at least 6 characters.' };
    }

    const expectedRole = role === 'admin' ? 'admin' : 'student';
    const user = users.find((u) => u.username.toLowerCase() === uname && u.role === expectedRole);

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
        themeToggle.textContent = theme === 'light' ? '☀️' : '🌙';
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

function getSkillCardButtons(course) {
    const enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    const completed = JSON.parse(localStorage.getItem('completedCourses') || '[]');
    const isEnrolled = enrolled.some(e => String(e.id) === String(course.id));
    const isCompleted = completed.some(c => String(c.id) === String(course.id));

    if (isCompleted) {
        return `
            <button class="btn btn-primary" onclick="viewCourseDetails(${course.id})">View Details</button>
            <button class="btn btn-secondary" style="background:#10b981; border-color:#10b981; color:white; font-weight:700;" disabled>✅ Completed</button>
        `;
    } else if (isEnrolled) {
        return `
            <button class="btn btn-primary" onclick="viewCourseDetails(${course.id})">View Details</button>
            <button class="btn btn-secondary" style="background:rgba(59,130,246,0.1); color:#3b82f6; border-color:#3b82f6; font-weight:700;" onclick="viewCourseDetails(${course.id})">Resume Study</button>
        `;
    } else {
        return `
            <button class="btn btn-primary" onclick="viewCourseDetails(${course.id})">View Details</button>
            <button class="btn btn-secondary" onclick="enrollCourse(${course.id}, '${escapeQuote(course.title)}')">Enroll Now</button>
        `;
    }
}

function escapeQuote(str) {
    return str.replace(/'/g, "\\'");
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
                    ${getSkillCardButtons(course)}
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
                <style>
                    .course-detail-banner-container {
                        position: relative;
                        width: 100%;
                        height: 420px;
                        overflow: hidden;
                        background: #0a0e1a;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-bottom: 2px solid var(--border-color, #1e293b);
                    }
                    .course-detail-banner-bg {
                        position: absolute;
                        inset: -20px;
                        background-image: url('${course.detailImage}');
                        background-size: cover;
                        background-position: center;
                        filter: blur(18px) brightness(0.35);
                        transform: scale(1.1);
                        z-index: 0;
                    }
                    .course-detail-banner-img {
                        position: relative;
                        z-index: 1;
                        max-width: 100%;
                        max-height: 400px;
                        width: auto;
                        height: auto;
                        object-fit: contain;
                        display: block;
                        border-radius: 6px;
                        box-shadow: 0 8px 40px rgba(0,0,0,0.5);
                    }
                    @media (max-width: 768px) {
                        .course-detail-banner-container {
                            height: 260px;
                        }
                        .course-detail-banner-img {
                            max-height: 230px;
                        }
                    }
                </style>
                <section class="course-detail-banner-container">
                    <div class="course-detail-banner-bg"></div>
                    <img src="${course.detailImage}" alt="${course.title}" class="course-detail-banner-img">
                </section>`;
}

function renderCourseVideoEmbed(course) {
    const { videoId, title } = getCourseVideoInfo(course.id);
    if (!videoId) return '';

    const enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    const isEnrolled = enrolled.some(e => String(e.id) === String(course.id));

    const watched = JSON.parse(localStorage.getItem('watchedVideos') || '[]');
    const isWatched = watched.includes(String(course.id));

    let actionBtn = '';
    if (isWatched) {
        actionBtn = `
            <button class="btn" style="background:#10b981; border:1px solid #10b981; color:white; font-weight:700; width:100%; max-width:320px; padding:0.65rem; margin-top:1.5rem;" disabled>
                ✅ Video Lesson Completed
            </button>
        `;
    } else if (isEnrolled) {
        actionBtn = `
            <button class="btn btn-secondary" onclick="markVideoAsWatched(${course.id})" style="font-weight:700; width:100%; max-width:320px; padding:0.65rem; margin-top:1.5rem;">
                🎥 Mark Video Lesson as Completed
            </button>
        `;
    } else {
        actionBtn = `
            <button class="btn btn-outline" onclick="enrollCourse(${course.id}, '${escapeQuote(course.title)}')" style="font-weight:700; width:100%; max-width:320px; padding:0.65rem; margin-top:1.5rem;">
                🔔 Enroll to Unlock Progress Tracking
            </button>
        `;
    }

    return `
                    <div style="margin-bottom: 3rem; display:flex; flex-direction:column; align-items:center;">
                        <div style="background: #000; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.3); width:100%;">
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
                        ${actionBtn}
                        <p style="text-align: center; margin-top: 1rem; color: var(--text-light); font-size: 0.9rem;">
                            ℹ️ <strong>Video plays on live server.</strong> In development (file://) there may be restrictions, but it works perfectly when deployed!
                        </p>
                    </div>`;
}

function getDetailsHeroEnrollSection(course) {
    const enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    const completed = JSON.parse(localStorage.getItem('completedCourses') || '[]');
    const isEnrolled = enrolled.some(e => String(e.id) === String(course.id));
    const isCompleted = completed.some(c => String(c.id) === String(course.id));

    if (isCompleted) {
        return `
            <div class="section" style="text-align: center; padding: 1.5rem 0;">
                <div class="container" style="display: flex; justify-content: center;">
                    <div style="background: rgba(16,185,129,0.08); border: 2px solid #10b981; border-radius: 12px; padding: 1.5rem; width: 100%; max-width: 500px; text-align: center;">
                        <h4 style="color: #10b981; font-weight: 800; margin-bottom: 0.4rem; font-size: 1.25rem;">🎉 Course Completed!</h4>
                        <p style="margin: 0 0 1rem 0; color: var(--text-light); font-size: 0.95rem;">You have completed the video lesson and successfully passed the quiz.</p>
                        <a href="certificate.html" class="btn btn-primary" style="display: inline-block; padding: 0.7rem 1.6rem; font-size: 0.95rem; font-weight: 700; text-decoration: none; border-radius: 8px;">🎓 View Your Certificate</a>
                    </div>
                </div>
            </div>
        `;
    } else if (isEnrolled) {
        const watched = JSON.parse(localStorage.getItem('watchedVideos') || '[]');
        const isVideoWatched = watched.includes(String(course.id));

        const quizScores = JSON.parse(localStorage.getItem('quizScores') || '[]');
        const attempts = quizScores.filter(q => String(q.courseId) === String(course.id));
        const hasPassedQuiz = attempts.some(q => q.percentage >= 70);

        return `
            <div class="section" style="text-align: center; padding: 1.5rem 0;">
                <div class="container" style="display: flex; justify-content: center;">
                    <div style="background: var(--bg-secondary); border: 1.5px solid var(--border-color); border-radius: 12px; padding: 1.5rem; width: 100%; max-width: 500px; text-align: left; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <h4 style="color: var(--text-dark); font-weight: 800; margin-bottom: 1rem; font-size: 1.1rem; border-bottom: 1.5px solid var(--border-color); padding-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">🧭 Course Completion Progress</h4>
                        <div style="display:flex; flex-direction:column; gap:0.8rem;">
                            <div style="display:flex; align-items:center; gap:0.75rem;">
                                <span style="font-size:1.2rem; flex-shrink: 0;">${isVideoWatched ? '✅' : '⏳'}</span>
                                <span style="font-size:0.95rem; color:${isVideoWatched ? '#10b981' : 'var(--text-light)'}; font-weight:${isVideoWatched ? '700' : '500'};">Watch the Video Lesson</span>
                            </div>
                            <div style="display:flex; align-items:center; gap:0.75rem;">
                                <span style="font-size:1.2rem; flex-shrink: 0;">${hasPassedQuiz ? '✅' : '⏳'}</span>
                                <span style="font-size:0.95rem; color:${hasPassedQuiz ? '#10b981' : 'var(--text-light)'}; font-weight:${hasPassedQuiz ? '700' : '500'};">Pass the Assessment Quiz (>= 70%)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="section" style="text-align: center; padding: 1.5rem 0;">
                <div class="container" style="display: flex; justify-content: center;">
                    <button class="btn btn-primary" style="width: 100%; max-width: 420px; padding: 1.1rem; font-size: 1.15rem; font-weight: 800; border-radius: 10px; box-shadow: 0 4px 14px rgba(59,130,246,0.35);" onclick="enrollCourse(${course.id}, '${escapeQuote(course.title)}')">
                        ✨ Enroll Now - Start Learning
                    </button>
                </div>
            </div>
        `;
    }
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
        const session = JSON.parse(localStorage.getItem('session')) || null;
        const isAdmin = session?.role === 'admin';
        const adminBtn = isAdmin ? `<button onclick="window.location.href='admin/image-editor.html?courseId=${course.id}'" style="position: absolute; top: 10px; right: 10px; background: linear-gradient(135deg, #ff6b6b, #ee5a6f); color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 8px; cursor: pointer; font-weight: 600; z-index: 10; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">🎨 Edit Image</button>` : '';
        
        const enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
        const isEnrolled = enrolled.some(e => String(e.id) === String(course.id));
        const watched = JSON.parse(localStorage.getItem('watchedVideos') || '[]');
        const isVideoWatched = watched.includes(String(course.id));

        let quizBtn = '';
        if (!isEnrolled) {
            quizBtn = `
                <button class="btn btn-quiz" style="width: 100%; padding: 1rem; margin-top: 1rem; background: #4b5563; border-color: #4b5563; opacity: 0.6; cursor: not-allowed;" onclick="alert('⚠️ Please enroll in this course first.')">
                    🔒 Take Quiz (Enroll first)
                </button>
            `;
        } else if (!isVideoWatched) {
            quizBtn = `
                <button class="btn btn-quiz" style="width: 100%; padding: 1rem; margin-top: 1rem; background: #4b5563; border-color: #4b5563; opacity: 0.6; cursor: not-allowed;" onclick="alert('⚠️ Please watch and complete the course video first.')">
                    🔒 Take Quiz (Watch video first)
                </button>
            `;
        } else {
            quizBtn = `
                <button class="btn btn-quiz" style="width: 100%; padding: 1rem; margin-top: 1rem;" onclick="startQuiz(${course.id})">
                    📝 Take Quiz
                </button>
            `;
        }

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

            ${getDetailsHeroEnrollSection(course)}

            <div class="section">
                <div class="details-container">
                    <div class="details-main">

                        <!-- Course Overview -->
                        <div class="details-section" style="background: linear-gradient(135deg, rgba(16,185,129,0.07), rgba(59,130,246,0.07)); border: 1.5px solid var(--border-color); border-radius: 14px; padding: 1.6rem 1.8rem;">
                            <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">📖 Course Overview</h3>
                            <p style="margin: 0; color: var(--text-muted); line-height: 1.75; font-size: 0.97rem;">${course.fullDescription}</p>
                        </div>

                        <!-- Prerequisites -->
                        <div class="details-section" style="border: 1.5px solid var(--border-color); border-radius: 14px; padding: 1.6rem 1.8rem; background: var(--bg-card);">
                            <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">🎯 Prerequisites</h3>
                            <div style="display: flex; flex-direction: column; gap: 0.7rem;">
                                ${course.prerequisites.map(prereq => `
                                    <div style="display: flex; align-items: flex-start; gap: 0.75rem; background: var(--bg-secondary); border-radius: 8px; padding: 0.75rem 1rem; border-left: 3px solid var(--primary-color);">
                                        <span style="color: var(--primary-color); font-size: 1rem; flex-shrink: 0; margin-top: 1px;">✓</span>
                                        <span style="color: var(--text-muted); font-size: 0.93rem; line-height: 1.5;">${prereq}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Skills You'll Gain -->
                        <div class="details-section" style="border: 1.5px solid var(--border-color); border-radius: 14px; padding: 1.6rem 1.8rem; background: var(--bg-card);">
                            <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">💡 Skills You'll Gain</h3>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.6rem;">
                                ${course.skillsGained.map(skill => `
                                    <span style="background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.15)); border: 1px solid rgba(16,185,129,0.3); color: var(--text-dark); padding: 0.45rem 1rem; border-radius: 999px; font-size: 0.88rem; font-weight: 500;">🔹 ${skill}</span>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Curriculum Topics -->
                        <div class="details-section" style="border: 1.5px solid var(--border-color); border-radius: 14px; padding: 1.6rem 1.8rem; background: var(--bg-card);">
                            <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">📚 Curriculum Topics</h3>
                            <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                                ${course.curriculumTopics.map((topic, i) => `
                                    <div style="display: flex; align-items: center; gap: 1rem; padding: 0.7rem 1rem; background: var(--bg-secondary); border-radius: 8px;">
                                        <span style="background: var(--primary-color); color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.78rem; font-weight: 700; flex-shrink: 0;">${i + 1}</span>
                                        <span style="color: var(--text-muted); font-size: 0.93rem;">${topic}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Career Opportunities -->
                        <div class="details-section" style="border: 1.5px solid var(--border-color); border-radius: 14px; padding: 1.6rem 1.8rem; background: var(--bg-card);">
                            <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">🚀 Career Opportunities</h3>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.6rem;">
                                ${course.careerPaths.map(path => `
                                    <span style="background: linear-gradient(135deg, rgba(249,115,22,0.12), rgba(168,85,247,0.12)); border: 1px solid rgba(249,115,22,0.3); color: var(--text-dark); padding: 0.45rem 1rem; border-radius: 999px; font-size: 0.88rem; font-weight: 500;">💼 ${path}</span>
                                `).join('')}
                            </div>
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

                        ${quizBtn}
                    </div>
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">Learning Roadmap</h2>
                <div class="roadmap-container">
                    ${renderRoadmap(course.id)}
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
function renderRoadmap(courseId) {
    const data = courseRoadmapData && courseRoadmapData[courseId];
    const stages = data ? data.stages : roadmapStages.map(s => ({ ...s, topics: [], tools: [], outcome: '' }));
    const uid = 'roadmap_' + courseId;

    return `
        <div id="${uid}" style="display: flex; flex-direction: column; gap: 0.9rem; margin-top: 1.5rem;">
            ${stages.map((stage, i) => {
                const sid = uid + '_' + i;
                return `
                <div class="rm-stage-card" id="${sid}" onclick="rmToggle('${sid}')">
                    <div class="rm-stage-header">
                        <span style="font-size: 2rem; flex-shrink:0;">${stage.icon}</span>
                        <div style="flex:1;">
                            <div style="font-weight:700; font-size:1.05rem;">${stage.stage}</div>
                            <div style="font-size:0.85rem; opacity:0.85;">${stage.duration}</div>
                        </div>
                        <span id="${sid}_arrow" style="font-size:1.1rem; transition:transform 0.25s;">▼</span>
                    </div>
                    <div class="rm-stage-body" id="${sid}_body">
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.2rem; margin-bottom:1.2rem;">
                            <div>
                                <p style="font-weight:700; margin:0 0 0.6rem; font-size:0.95rem; color:var(--text-dark);">📚 What to Learn</p>
                                <div style="display:flex; flex-direction:column; gap:0.45rem;">
                                    ${(stage.topics||[]).map(t => `
                                        <div style="display:flex;align-items:flex-start;gap:0.5rem;padding:0.5rem 0.75rem;background:var(--bg-secondary);border-radius:8px;border-left:3px solid var(--primary-color);">
                                            <span style="color:var(--primary-color);flex-shrink:0;">›</span>
                                            <span style="font-size:0.88rem;color:var(--text-muted);">${t}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <div>
                                <p style="font-weight:700; margin:0 0 0.6rem; font-size:0.95rem; color:var(--text-dark);">🔧 Tools & Resources</p>
                                <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
                                    ${(stage.tools||[]).map(t => `<span class="rm-chip" style="background:linear-gradient(135deg,rgba(59,130,246,0.12),rgba(168,85,247,0.12));border:1px solid rgba(59,130,246,0.25);color:var(--text-dark);">🔧 ${t}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                        ${stage.outcome ? `
                        <div style="background:linear-gradient(135deg,rgba(16,185,129,0.1),rgba(59,130,246,0.08));border:1.5px solid var(--primary-color);border-radius:10px;padding:0.9rem 1.1rem;display:flex;align-items:flex-start;gap:0.75rem;">
                            <span style="font-size:1.3rem;flex-shrink:0;">🎯</span>
                            <div>
                                <p style="font-weight:700;margin:0 0 0.2rem;font-size:0.9rem;color:var(--primary-color);">Stage Outcome</p>
                                <p style="margin:0;font-size:0.9rem;color:var(--text-muted);">${stage.outcome}</p>
                            </div>
                        </div>` : ''}
                    </div>
                </div>
                `;
            }).join('')}
    `;
}

// Global toggle for roadmap stages (so it runs even when elements are injected via innerHTML)
window.rmToggle = function(id) {
    const card = document.getElementById(id);
    const body = document.getElementById(id + '_body');
    const arrow = document.getElementById(id + '_arrow');
    if (!card || !body || !arrow) return;
    const isOpen = body.classList.contains('rm-open');
    body.classList.toggle('rm-open', !isOpen);
    card.classList.toggle('rm-active', !isOpen);
    arrow.style.transform = isOpen ? '' : 'rotate(180deg)';
};

// ============================================
// FUTURE OPPORTUNITIES DISPLAY
// ============================================
function renderFutureOpportunities(courseId) {
    const opportunities = futureOpportunitiesData[courseId];
    if (!opportunities) {
        return '<p>Career growth data coming soon.</p>';
    }

    return `
        <div style="display: flex; flex-direction: column; gap: 2.5rem;">

            <!-- Growth Paths Grid -->
            <div>
                <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 1.2rem; display: flex; align-items: center; gap: 0.5rem;">
                    🚀 Growth Paths
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
                    ${opportunities.growthPaths.map(path => `
                        <div class="opportunity-card">
                            <h4 style="margin-bottom: 1rem; font-size: 1.05rem;">${path.title}</h4>
                            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
                                <p style="margin:0;"><strong>💰 Salary Range:</strong> ${path.salary}</p>
                                <p style="margin:0;"><strong>📈 Market Demand:</strong> ${path.demand}</p>
                                <p style="margin:0;"><strong>🎯 Career Path:</strong> ${path.growth}</p>
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

            <!-- Industry Insights — full width below -->
            <div style="background: linear-gradient(135deg, rgba(16,185,129,0.08), rgba(59,130,246,0.08)); border: 1.5px solid var(--border-color); border-radius: 14px; padding: 1.8rem 2rem;">
                <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 1.2rem; display: flex; align-items: center; gap: 0.5rem; color: var(--text-dark);">
                    📊 Industry Insights
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
                    ${opportunities.industryInsights.map(insight => `
                        <div style="display: flex; align-items: flex-start; gap: 0.75rem; background: var(--bg-card); border-radius: 10px; padding: 1rem 1.2rem; border: 1px solid var(--border-color);">
                            <span style="font-size: 1.3rem; flex-shrink: 0; margin-top: 2px;">💡</span>
                            <p style="margin: 0; font-size: 0.92rem; color: var(--text-muted); line-height: 1.55;">${insight}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

        </div>
    `;
}

// ============================================
// QUIZ FUNCTIONALITY
// ============================================
function startQuiz(courseId) {
    const cid = String(courseId);

    const enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    const isEnrolled = enrolled.some(e => String(e.id) === String(courseId));
    if (!isEnrolled) {
        alert('⚠️ Please enroll in this course first before taking the assessment quiz.');
        return;
    }

    const watched = JSON.parse(localStorage.getItem('watchedVideos') || '[]');
    const isVideoWatched = watched.includes(String(courseId));
    if (!isVideoWatched) {
        alert('⚠️ Please watch and complete the course video first before taking the assessment quiz.');
        return;
    }

    // Prefer admin-managed quizzes (customQuizzes from admin/quizzes.html & quiz-editor.html)
    let quiz = null;
    try {
        const custom = JSON.parse(localStorage.getItem('customQuizzes') || 'null');
        if (custom && custom[cid] && custom[cid].questions) {
            quiz = custom[cid];
        }
    } catch (e) {}

    // Fallback to built-in quizData
    if (!quiz) {
        quiz = quizData[courseId];
    }

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

    const quizCourseId = sessionStorage.getItem('quizCourseId');
    if (quizCourseId) {
        const enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
        const isEnrolled = enrolled.some(e => String(e.id) === String(quizCourseId));
        if (!isEnrolled) {
            quizContainer.innerHTML = `
                <div style="background: rgba(239,68,68,0.1); border: 2px solid #ef4444; border-radius: 12px; padding: 2rem; text-align: center; margin-top: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                    <h3 style="color: #f87171; font-weight: 700; margin-bottom: 0.5rem;">Access Denied</h3>
                    <p style="color: var(--text-light); margin-bottom: 1.5rem;">Please enroll in this course first before taking the assessment quiz.</p>
                    <a href="skills.html" class="btn btn-primary">Browse Courses</a>
                </div>
            `;
            return;
        }

        const watched = JSON.parse(localStorage.getItem('watchedVideos') || '[]');
        const isVideoWatched = watched.includes(String(quizCourseId));
        if (!isVideoWatched) {
            quizContainer.innerHTML = `
                <div style="background: rgba(239,68,68,0.1); border: 2px solid #ef4444; border-radius: 12px; padding: 2rem; text-align: center; margin-top: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔒</div>
                    <h3 style="color: #f87171; font-weight: 700; margin-bottom: 0.5rem;">Quiz Locked</h3>
                    <p style="color: var(--text-light); margin-bottom: 1.5rem;">Please watch and complete the course video lesson first before attempting this quiz.</p>
                    <a href="course-details.html?id=${quizCourseId}" class="btn btn-primary">Go to Course Video</a>
                </div>
            `;
            return;
        }
    }

    let currentQuestion = 0;
    let score = 0;
    const userAnswers = [];

    function showQuestion() {
        const question = quizData.questions[currentQuestion];
        quizContainer.innerHTML = `
            <style>
                .quiz-option-label {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    background: var(--bg-secondary);
                    border: 1.5px solid var(--border-color);
                    border-radius: 8px;
                    padding: 0.9rem 1.2rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-weight: 500;
                    color: var(--text-dark);
                    margin-bottom: 0.8rem;
                }
                .quiz-option-label:hover {
                    border-color: var(--primary-color);
                    background: rgba(16,185,129,0.03);
                }
                .quiz-option-label input[type="radio"]:checked {
                    accent-color: var(--primary-color);
                }
            </style>
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
                
                <h4 class="quiz-question" style="margin-bottom: 1.5rem; font-size: 1.15rem; font-weight: 700; line-height: 1.5; color: var(--text-dark);">${question.question}</h4>
                
                <div class="quiz-options-list" style="display: flex; flex-direction: column; margin: 1.5rem 0;">
                    ${question.options.map((option, index) => `
                        <label class="quiz-option-label">
                            <input type="radio" name="answer" value="${index}" style="width: 18px; height: 18px; cursor: pointer; flex-shrink: 0;">
                            <span style="line-height: 1.4;">${option}</span>
                        </label>
                    `).join('')}
                </div>

                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button class="btn btn-outline" ${currentQuestion === 0 ? 'disabled' : ''} onclick="previousQuestion()">
                        ← Previous
                    </button>
                    <button class="btn btn-primary" onclick="nextQuestion(${currentQuestion})" style="${currentQuestion === quizData.questions.length - 1 ? 'background: linear-gradient(135deg, #10b981, #059669); border-color: #10b981; box-shadow: 0 4px 12px rgba(16,185,129,0.25);' : ''}">
                        ${currentQuestion === quizData.questions.length - 1 ? '✅ Submit Quiz' : 'Next →'}
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

        // Trigger course completion checks (which will issue the single unified Course Completion certificate if all conditions are met)
        if (passed) {
            checkAndTriggerCourseCompletion(quizCourseId);
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
function checkAndTriggerCourseCompletion(courseId) {
    const course = coursesData.find(c => String(c.id) === String(courseId));
    if (!course) return;

    // Check if enrolled
    const enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    const isEnrolled = enrolled.some(e => String(e.id) === String(courseId));
    if (!isEnrolled) return;

    // Check if video watched
    const watched = JSON.parse(localStorage.getItem('watchedVideos') || '[]');
    const isVideoWatched = watched.includes(String(courseId));
    if (!isVideoWatched) return;

    // Check if passed quiz (>= 70%)
    const quizScores = JSON.parse(localStorage.getItem('quizScores') || '[]');
    const attempts = quizScores.filter(q => String(q.courseId) === String(courseId));
    const hasPassedQuiz = attempts.some(q => q.percentage >= 70);
    if (!hasPassedQuiz) return;

    // All conditions met! Let's mark as completed
    let completedCourses = JSON.parse(localStorage.getItem('completedCourses')) || [];
    if (!completedCourses.find(c => String(c.id) === String(courseId))) {
        completedCourses.push({
            id: parseInt(courseId),
            title: course.title,
            completedAt: new Date().toLocaleString()
        });
        localStorage.setItem('completedCourses', JSON.stringify(completedCourses));
        
        // Generate Course Certificate
        generateCertificate(parseInt(courseId), course.title, 'course');
        
        showCertificateNotification(`Congratulations! You completed ${course.title} and earned your Certificate of Achievement! 📜`);
        updateProgressDisplay();
    }
}

window.markVideoAsWatched = function(courseId) {
    let watched = JSON.parse(localStorage.getItem('watchedVideos')) || [];
    if (!watched.includes(String(courseId))) {
        watched.push(String(courseId));
        localStorage.setItem('watchedVideos', JSON.stringify(watched));
        alert('🎥 Video lesson marked as completed!');
        
        // Check if this triggers overall course completion
        checkAndTriggerCourseCompletion(courseId);
        
        // Reload details page
        window.location.reload();
    }
};

function enrollCourse(courseId, courseTitle) {
    const session = getSession();
    if (!session) {
        alert('⚠️ Please register or login to enroll in this course.');
        sessionStorage.setItem('pendingEnrollId', courseId);
        sessionStorage.setItem('pendingEnrollTitle', courseTitle);
        window.location.href = 'register.html';
        return;
    }

    let enrolled = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
    if (!enrolled.some(e => String(e.id) === String(courseId))) {
        enrolled.push({
            id: parseInt(courseId),
            title: courseTitle,
            enrolledAt: new Date().toLocaleString()
        });
        localStorage.setItem('enrolledCourses', JSON.stringify(enrolled));
        alert(`🎉 Successfully enrolled in ${courseTitle}! Watch the video lesson and pass the quiz to earn your certificate.`);
        window.location.reload();
    } else {
        alert('You are already enrolled in this course.');
    }
}

function saveQuizProgress(courseId, score, total) {
    let quizScores = JSON.parse(localStorage.getItem('quizScores')) || [];
    const session = getSession();
    
    quizScores.push({
        courseId: courseId,
        score: score,
        total: total,
        percentage: Math.round((score / total) * 100),
        date: new Date().toLocaleString(),
        studentName: session?.fullName || localStorage.getItem('userFullName') || 'Unknown Student',
        studentUsername: session?.username || 'unknown'
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
    // Quiz certificates are disabled — only course completion certs are issued
    if (certificateType === 'quiz') return null;

    const certificates = JSON.parse(localStorage.getItem('certificates')) || [];

    // Get user name from any input or use default
    const session = JSON.parse(localStorage.getItem('session')) || null;
    const userName = session?.fullName || localStorage.getItem('userFullName') || 'Learner';

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
    let certificates = JSON.parse(localStorage.getItem('certificates')) || [];
    if (certificates.some(c => c.type === 'quiz')) {
        certificates = certificates.filter(c => c.type !== 'quiz');
        localStorage.setItem('certificates', JSON.stringify(certificates));
    }
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
    
    certificatesGrid.innerHTML = certificates.map((cert, index) => {
        // Resolve student's name dynamically
        let displayName = cert.userName;
        if (!displayName || displayName === 'Learner' || displayName === 'Demo Admin') {
            const session = JSON.parse(localStorage.getItem('session') || 'null');
            if (session && session.fullName) {
                displayName = session.fullName;
            } else {
                displayName = localStorage.getItem('userFullName') || 'Learner';
            }
        }
        
        return `
        <div class="certificate-card ${cert.type}-type" data-certificate-id="${cert.id}" data-type="${cert.type}" onclick="viewCertificate('${cert.id}')" style="cursor: pointer;">
            <div class="certificate-badge">
                <div class="certificate-badge-icon">${cert.type === 'quiz' ? '🎓' : '🏆'}</div>
            </div>
            <div class="certificate-info">
                <h3>${cert.courseTitle}</h3>
                <div class="certificate-type-tag">${cert.type === 'quiz' ? 'Quiz Certificate' : 'Course Certificate'}</div>
                <div class="certificate-details">
                    <p><span>📅 Date:</span> ${cert.issuedDate}</p>
                    <p><span>👤 Student:</span> ${displayName}</p>
                </div>
                <div class="certificate-meta">
                    <button class="certificate-action-btn" onclick="event.stopPropagation(); viewCertificate('${cert.id}')">View Certificate</button>
                </div>
            </div>
        </div>
        `;
    }).join('');
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
    
    const session = JSON.parse(localStorage.getItem('session')) || null;
    const currentUserName = session?.fullName || localStorage.getItem('userFullName') || 'Learner';
    const displayName = (certificate.userName && certificate.userName !== 'Learner' && certificate.userName !== 'Demo Admin') ? certificate.userName : currentUserName;
    
    const completionTypeText = 'completed the course';
    const completionLabel = 'Course Completion Certificate';
    
    certificateDisplay.innerHTML = `
        <div class="certificate-display">
            <div class="certificate-header">
                <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary-color); margin-bottom: 0.5rem; letter-spacing: 1px;">SkillBridge</div>
                <h2>${completionLabel}</h2>
                <p>IN RECOGNITION OF DEDICATION AND EXCELLENCE</p>
            </div>
            
            <div class="certificate-body">
                <h3>This is to certify that</h3>
                <div class="certificate-recipient">${displayName}</div>
                <p>has successfully ${completionTypeText}</p>
                <h3 style="font-size: 1.4rem; color: var(--primary-color); font-weight: bold;">${certificate.courseTitle}</h3>
                <p><strong>Completion date:</strong> ${certificate.issuedDate}</p>
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
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 36px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('SkillBridge', canvas.width / 2, 120);

    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 48px Georgia, serif';
    ctx.fillText('Certificate of Achievement', canvas.width / 2, 190);
    
    ctx.fillStyle = '#666';
    ctx.font = '18px Georgia, serif';
    ctx.fillText('IN RECOGNITION OF DEDICATION AND EXCELLENCE', canvas.width / 2, 250);
    
    ctx.font = 'normal 24px Georgia, serif';
    ctx.fillText('This is to certify that', canvas.width / 2, 380);
    
    ctx.fillStyle = '#000';
    ctx.font = 'bold 36px Georgia, serif';
    const session = JSON.parse(localStorage.getItem('session')) || null;
    const currentUserName = session?.fullName || localStorage.getItem('userFullName') || 'Learner';
    const displayName = (certificate.userName && certificate.userName !== 'Learner' && certificate.userName !== 'Demo Admin') ? certificate.userName : currentUserName;
    ctx.fillText(displayName, canvas.width / 2, 480);
    
    ctx.fillStyle = '#666';
    ctx.font = 'normal 24px Georgia, serif';
    const completionTypeText = 'completed the course';
    ctx.fillText('has successfully ' + completionTypeText, canvas.width / 2, 580);
    
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.fillText(certificate.courseTitle, canvas.width / 2, 660);
    
    ctx.fillStyle = '#666';
    ctx.font = 'normal 20px Georgia, serif';
    ctx.fillText('on this ' + certificate.issuedDate, canvas.width / 2, 750);
    
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
    // Deprecated wrapper - now handled dynamically in checkAndTriggerCourseCompletion
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

        const heroSection = document.querySelector('.hero');
        if (heroSection && content.heroBgImage) {
            heroSection.style.background = `linear-gradient(135deg, rgba(17, 24, 39, 0.78), rgba(99, 102, 241, 0.72)), url("${content.heroBgImage}") center/cover`;
        }

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
            
            // Helper to resolve '#' to active files
            const resolveHref = (text, href) => {
                if (href && href !== '#') return href;
                const txt = String(text).toLowerCase().trim();
                if (txt.includes('about') || txt.includes('mission') || txt.includes('team')) return 'index.html#about-us';
                if (txt.includes('course') || txt.includes('cat') || txt.includes('trend')) return 'skills.html';
                if (txt.includes('help') || txt.includes('contact') || txt.includes('faq') || txt.includes('feedback')) return 'feedback.html';
                return 'index.html';
            };

            footerSections.forEach((sec, i) => {
                const block = content.footer[i];
                if (!block) return;
                const h4 = sec.querySelector('h4');
                if (h4) h4.textContent = block.title || '';
                const ul = sec.querySelector('ul');
                if (ul) {
                    const seenHrefs = new Set();
                    const uniqueLinks = [];

                    cleanRepeatedLinks(block.links).forEach(l => {
                        const targetHref = resolveHref(l.text, l.href);
                        if (!seenHrefs.has(targetHref)) {
                            seenHrefs.add(targetHref);
                            uniqueLinks.push({ text: l.text, href: targetHref });
                        }
                    });

                    ul.innerHTML = uniqueLinks.map(l => `<li><a href="${l.href}">${l.text || ''}</a></li>`).join('');
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
            let target = 'admin/admin-login.html';
            if (path.includes('/student/')) {
                target = '../admin/admin-login.html';
            } else if (path.includes('/admin/')) {
                target = 'admin-login.html';
            }
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
        const isRoadmap = pageName === 'roadmap.html';
        
        const studentPath = inSubfolder ? '' : 'student/';
        const initials = session.fullName ? session.fullName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : '👤';

        html += `
            <li><a href="${prefix}index.html" class="${pageName === 'index.html' ? 'active' : ''}">Home</a></li>
            <li><a href="${prefix}skills.html" class="${isSkills ? 'active' : ''}">Skills</a></li>
            <li><a href="${prefix}progress.html" class="${isProgress ? 'active' : ''}">Progress</a></li>
            <li><a href="${prefix}roadmap.html" class="${isRoadmap ? 'active' : ''}">Roadmap</a></li>
            <li class="profile-dropdown-container">
                <div class="profile-avatar-trigger" onclick="toggleProfileDropdown(event)">${initials}</div>
                <div class="profile-dropdown-card" id="profileDropdownCard">
                    <div class="dropdown-user-info">
                        <div class="dropdown-user-name">${session.fullName}</div>
                        <div class="dropdown-user-username">@${session.username}</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <a href="${inSubfolder ? '' : 'student/'}dashboard.html" class="${isDashboard ? 'active' : ''}">📊 Dashboard</a>
                    <a href="${inSubfolder ? '' : 'student/'}profile.html" class="${isProfile ? 'active' : ''}">👤 My Profile</a>
                    <a href="${inSubfolder ? '' : 'student/'}mycourses.html" class="${isMyCourses ? 'active' : ''}">📚 My Courses</a>
                    <a href="${inSubfolder ? '' : 'student/'}certificates.html" class="${isMyCerts ? 'active' : ''}">📜 My Certificates</a>
                    <div class="dropdown-divider"></div>
                    <button onclick="logoutAndRedirect()" class="dropdown-logout-btn">🚪 Log Out</button>
                </div>
            </li>
        `;
    } else if (session && session.role === 'admin') {
        // Logged in as admin
        const isDashboard = pageName === 'dashboard.html' && path.includes('/admin/');
        const isStudents = pageName === 'students.html';
        const isCourses = pageName === 'courses.html';
        const isReports = pageName === 'reports.html';
        const isSettings = pageName === 'settings.html';
        const isSiteEditor = pageName === 'site-editor.html';
        const isRoadmapEditor = pageName === 'roadmap-editor.html';

        const initials = session.fullName ? session.fullName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'AD';

        html += `
            <li><a href="${prefix}index.html" class="${pageName === 'index.html' ? 'active' : ''}">Home</a></li>
            <li class="profile-dropdown-container">
                <div class="profile-avatar-trigger" onclick="toggleProfileDropdown(event)" style="background: rgba(99, 102, 241, 0.2); border-color: rgba(99, 102, 241, 0.4);">${initials}</div>
                <div class="profile-dropdown-card" id="profileDropdownCard">
                    <div class="dropdown-user-info">
                        <div class="dropdown-user-name">${session.fullName} (Admin)</div>
                        <div class="dropdown-user-username">@${session.username}</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <a href="${inSubfolder ? '' : 'admin/'}dashboard.html" class="${isDashboard ? 'active' : ''}">📊 Dashboard</a>
                    <a href="${inSubfolder ? '' : 'admin/'}students.html" class="${isStudents ? 'active' : ''}">👥 Students</a>
                    <a href="${inSubfolder ? '' : 'admin/'}courses.html" class="${isCourses ? 'active' : ''}">📚 Courses</a>
                    <a href="${inSubfolder ? '' : 'admin/'}roadmap-editor.html" class="${isRoadmapEditor ? 'active' : ''}">🧭 Roadmaps</a>
                    <a href="${inSubfolder ? '' : 'admin/'}reports.html" class="${isReports ? 'active' : ''}">📈 Reports</a>
                    <a href="${inSubfolder ? '' : 'admin/'}settings.html" class="${isSettings ? 'active' : ''}">⚙️ Settings</a>
                    <a href="${inSubfolder ? '' : 'admin/'}site-editor.html" class="${isSiteEditor ? 'active' : ''}">🖊️ Site Editor</a>
                    <div class="dropdown-divider"></div>
                    <button onclick="logoutAndRedirect()" class="dropdown-logout-btn">🚪 Log Out</button>
                </div>
            </li>
        `;
    } else {
        // Guest user (not logged in)
        const isSkills = pageName === 'skills.html';
        const isProgress = pageName === 'progress.html';
        const isRoadmap = pageName === 'roadmap.html';
        const isRegister = pageName === 'register.html';

        html += `
            <li><a href="${prefix}index.html" class="${pageName === 'index.html' ? 'active' : ''}">Home</a></li>
            <li><a href="${prefix}skills.html" class="${isSkills ? 'active' : ''}">Skills</a></li>
            <li><a href="${prefix}progress.html" class="${isProgress ? 'active' : ''}">Progress</a></li>
            <li><a href="${prefix}roadmap.html" class="${isRoadmap ? 'active' : ''}">Roadmap</a></li>
            <li><a href="${prefix}register.html" class="${isRegister ? 'active' : ''}">Register</a></li>
        `;
    }

    // Append theme toggle to the list
    const currentTheme = localStorage.getItem('theme') || 'light';
    html += `<li><button id="themeToggle" class="theme-toggle-btn">${currentTheme === 'dark' ? '🌙' : '☀️'}</button></li>`;

    navLinksEl.innerHTML = html;
}

// Float Dropdown toggler action
function toggleProfileDropdown(event) {
    event.stopPropagation();
    const card = document.getElementById('profileDropdownCard');
    if (card) card.classList.toggle('open');
}
window.toggleProfileDropdown = toggleProfileDropdown;

document.addEventListener('click', function() {
    const card = document.getElementById('profileDropdownCard');
    if (card) card.classList.remove('open');
});

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
