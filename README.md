# SkillBridge - Online Learning and Career Guidance System

## 🎓 Project Overview

SkillBridge is a complete, responsive web application built with **HTML, CSS, and JavaScript only**. It provides a comprehensive platform for online learning, skill development, and career guidance across six major technology domains.

---

## 📁 Project Structure

```
SkillBridge/
├── index.html                 # Home page with hero section and featured courses
├── skills.html                # All courses page with search and filter
├── course-details.html        # Individual course details page
├── quiz.html                  # Skill assessment quiz page
├── progress.html              # Learning progress and statistics tracking
│
├── css/
│   └── styles.css            # Complete responsive styling with dark mode
│
├── js/
│   ├── data.js               # Course data, quizzes, and roadmap information
│   └── main.js               # Core functionality and feature implementations
│
└── README.md                 # This file
```

---

## 🚀 Features

### 1. **Home Page**
- Modern hero section with gradient background
- Featured skills/courses section (showing first 3 courses)
- Career opportunities showcase for all skill categories
- Why Choose SkillBridge section with benefits
- Responsive navigation and footer

### 2. **Skills/Courses Page**
- Display all 6 skill courses with detailed cards
- **Search Functionality**: Search courses by title or description in real-time
- **Category Filtering**: Filter courses by categories (Frontend, Backend, Data, Infrastructure, Security, Design)
- Each card shows:
  - Course icon
  - Title and description
  - Duration and rating
  - View Details button
  - Mark Complete button

### 3. **Course Details Page**
- Comprehensive course overview
- Prerequisites section
- Skills you'll gain
- Curriculum topics
- Career opportunities related to the course
- Learning roadmap (Beginner → Fundamentals → Projects → Intermediate → Advanced → Career Ready)
- Future career opportunities and growth paths
- Salary ranges and market demand insights
- Industry insights and trends
- Enroll Now button
- Take Quiz button

### 4. **Quiz/Assessment**
- Multiple-choice questions (5 questions per course)
- Interactive quiz interface with progress tracking
- Question progress bar
- Next/Previous navigation
- Automatic scoring calculation
- Result display with percentage
- Detailed answer review with explanations
- Pass/Fail feedback

### 5. **Career Opportunities Section**
- 6 skill categories with related job roles:
  - **Web Development**: Frontend Developer, Full Stack Developer, UI Developer, etc.
  - **Python Programming**: Python Developer, Backend Developer, Data Analyst, etc.
  - **Data Analytics**: Data Analyst, Business Analyst, BI Developer, etc.
  - **Cloud Computing**: Cloud Engineer, DevOps Engineer, Solutions Architect, etc.
  - **Cyber Security**: Security Analyst, Penetration Tester, SOC Analyst, etc.
  - **UI/UX Design**: UI/UX Designer, Product Designer, Interaction Designer, etc.

### 6. **Learning Roadmap**
- Visual 6-stage progression:
  1. 🌱 Beginner - Learn Fundamentals
  2. 📚 Fundamentals - Build Foundation
  3. 🛠️ Projects - Hands-on Work
  4. ⚙️ Intermediate - Advanced Topics
  5. 🚀 Advanced - Expert Level
  6. 🎯 Career Ready - Job Preparation

### 7. **Search Functionality**
- Real-time search across all courses
- Searches by title and description
- Dynamic filtering as you type
- Integrated on the Skills page

### 8. **Category Filter**
- Filter by 7 categories:
  - All
  - Frontend
  - Backend
  - Data
  - Infrastructure
  - Security
  - Design
- Visual feedback for active category
- Smooth category switching

### 9. **Skill Assessment Quiz**
- Multiple-choice questions for:
  - Web Development (5 questions)
  - Python Programming (5 questions)
  - Data Analytics (5 questions)
- Auto-calculated scoring
- Answer review with explanations
- Pass/Fail indication (70% passing score)

### 10. **Progress Tracking**
- **Local Storage Integration**:
  - Completed courses tracking
  - Quiz scores and dates
  - Average score calculation
- Progress page displays:
  - Total courses completed
  - Total quizzes taken
  - Average quiz score
  - Completed courses list with timestamps
  - Quiz scores table with details
  - Clear all data option

### 11. **Dark Mode / Light Mode**
- Toggle button in navigation bar
- Smooth theme switching
- Theme preference saved in Local Storage
- Fully styled dark theme:
  - Dark backgrounds
  - Light text
  - Adjusted card styling
  - Optimized for readability

### 12. **Responsive Design**
- **Desktop**: Full layout with all features
- **Tablet (768px and below)**:
  - Hamburger menu navigation
  - Stacked layout
  - Optimized spacing
- **Mobile (480px and below)**:
  - Single column layouts
  - Optimized font sizes
  - Touch-friendly buttons
  - Adjusted padding and margins

### 13. **Future Scope Section**
- Career growth paths for each skill
- Salary ranges
- Market demand indicators
- Required skills for advancement
- Career progression paths
- Industry insights and trends

---

## 📊 Courses Data

### Available Courses

1. **Web Development** 🌐
   - Duration: 12 weeks
   - Level: Beginner
   - Students: 5.2K
   - Rating: 4.8★

2. **Python Programming** 🐍
   - Duration: 10 weeks
   - Level: Beginner
   - Students: 8.5K
   - Rating: 4.9★

3. **Data Analytics** 📊
   - Duration: 14 weeks
   - Level: Intermediate
   - Students: 4.1K
   - Rating: 4.7★

4. **Cloud Computing** ☁️
   - Duration: 11 weeks
   - Level: Intermediate
   - Students: 3.8K
   - Rating: 4.6★

5. **Cyber Security** 🔒
   - Duration: 13 weeks
   - Level: Intermediate
   - Students: 3.2K
   - Rating: 4.8★

6. **UI/UX Design** 🎨
   - Duration: 10 weeks
   - Level: Beginner
   - Students: 6.3K
   - Rating: 4.7★

---

## 🎨 UI/UX Features

### Color Scheme
- **Primary**: Indigo (#6366f1)
- **Secondary**: Pink (#ec4899)
- **Accent**: Amber (#f59e0b)
- **Dark Background**: #1f2937
- **Light Background**: #f9fafb
- **Text Dark**: #111827
- **Text Light**: #6b7280

### Design Elements
- Modern gradient backgrounds
- Smooth animations and transitions
- Hover effects on interactive elements
- Consistent spacing and typography
- Professional shadow effects
- Animated skill cards
- Progress bars and indicators

### Animations
- Slide-in effects for hero content
- Fade-in animations for cards
- Scale transitions for modals
- Smooth color transitions
- Button hover animations
- Hamburger menu animations

---

## 💾 Local Storage Keys

- **completedCourses**: Array of completed course objects
- **quizScores**: Array of quiz score objects
- **theme**: Current theme preference (light/dark)

---

## 🔧 How to Use

### 1. Open the Application
- Extract files to a folder
- Open `index.html` in a web browser

### 2. Navigation
- Use the navigation bar to move between pages
- Click "Explore Skills" to view all courses
- Use hamburger menu on mobile devices

### 3. Search & Filter
- Go to Skills page
- Use search box to find courses
- Click category buttons to filter

### 4. Take a Course
- Click "View Details" on any course card
- Review complete course information
- Click "Enroll Now" to mark as completed
- Click "Take Quiz" to test your knowledge

### 5. Take a Quiz
- Complete multiple-choice questions
- Review your score and answers
- Return to course details

### 6. Track Progress
- Click "Progress" in navigation
- View completed courses and quiz scores
- See your average performance
- Clear data if needed

### 7. Dark Mode
- Click the theme toggle button (🌙/☀️) in navigation
- Theme preference is saved automatically

---

## 📱 Browser Compatibility

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile browsers (Chrome, Safari, Firefox)

---

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Advanced styling, gradients, animations
- **JavaScript (ES6+)**: Dynamic functionality, Local Storage, DOM manipulation

---

## 📝 JavaScript Features

### Core Functions

#### Navigation & Theme
- `setupNavigation()`: Handle mobile menu toggle
- `setupThemeToggle()`: Manage dark/light mode

#### Search & Filter
- `setupSearch()`: Real-time course search
- `filterByCategory(category)`: Filter courses by category
- `renderSkillCards(courses)`: Display courses dynamically

#### Course Details
- `viewCourseDetails(courseId)`: Navigate to course details
- `displayCourseDetails()`: Render full course information
- `renderRoadmap()`: Display learning roadmap
- `renderFutureOpportunities(courseId)`: Show career growth paths

#### Quiz
- `startQuiz(courseId)`: Initialize quiz
- `displayQuiz()`: Render quiz questions
- `saveQuizProgress()`: Save quiz results

#### Progress Tracking
- `markAsCompleted(courseId, courseTitle)`: Mark course as done
- `loadProgressFromStorage()`: Load saved progress
- `updateProgressDisplay()`: Refresh progress statistics

---

## 🎯 User Flows

### 1. Learning Journey
1. Home Page → Explore featured courses
2. Skills Page → Search/filter courses
3. Course Details → Review full information
4. Take Quiz → Test knowledge
5. Progress Page → Track achievements

### 2. Career Exploration
1. Home Page → View career opportunities
2. Course Details → See related career paths
3. Review salary ranges and job roles
4. Understand market demand

### 3. Progress Tracking
1. Enroll in courses → Marked as completed
2. Take quizzes → Scores saved
3. Progress Page → View all achievements
4. Monitor learning metrics

---

## 💡 Key Features Implementation

### Local Storage
All data persists across browser sessions:
```javascript
localStorage.setItem('completedCourses', JSON.stringify(data));
localStorage.getItem('completedCourses');
```

### Dynamic Content Rendering
Courses, quizzes, and roadmaps are rendered dynamically from data objects.

### Responsive Grid System
- CSS Grid with auto-fit for automatic responsive columns
- Breakpoints at 768px and 480px for different devices

### Smooth Scrolling
- HTML `scroll-behavior: smooth`
- Navigation links for section jumping

---

## 🔐 Data Structure

### Course Object
```javascript
{
    id: 1,
    title: "Course Title",
    category: "Category",
    icon: "🎓",
    description: "Short description",
    duration: "12 weeks",
    level: "Beginner",
    students: "5.2K",
    rating: 4.8,
    fullDescription: "Detailed description",
    prerequisites: [],
    courseDuration: "12 weeks (30-35 hours)",
    skillsGained: [],
    curriculumTopics: [],
    careerPaths: []
}
```

### Quiz Object
```javascript
{
    title: "Quiz Title",
    questions: [
        {
            id: 1,
            question: "Question text?",
            options: ["A", "B", "C", "D"],
            correct: 0,
            explanation: "Explanation text"
        }
    ]
}
```

---

## 🚀 Getting Started

1. **Download/Extract Files**
   - Extract the SkillBridge folder to your desired location

2. **Open in Browser**
   - Right-click `index.html`
   - Select "Open with" → Your preferred browser
   - Or drag `index.html` to your browser window

3. **Start Learning**
   - Explore courses on the Skills page
   - View detailed information on Course Details page
   - Take quizzes to test knowledge
   - Track your progress

---

## 📄 File Descriptions

### HTML Files
- **index.html**: Landing page with featured courses and career opportunities
- **skills.html**: Complete course catalog with search and filtering
- **course-details.html**: Detailed course information with roadmap and opportunities
- **quiz.html**: Interactive quiz interface for skill assessment
- **progress.html**: Learning progress dashboard and statistics

### CSS Files
- **styles.css**: Complete styling including responsive design and dark mode

### JavaScript Files
- **data.js**: Course data, quizzes, roadmaps, and career opportunities
- **main.js**: All JavaScript functionality and features

---

## 📈 Statistics & Metrics

### Total Courses: 6
### Total Quiz Questions: 15 (5 per course × 3 courses)
### Learning Roadmap Stages: 6
### Career Opportunities: 30+ job roles
### Responsive Breakpoints: 2 (768px, 480px)
### Color Variants: 5 main + dark mode

---

## 🎓 Learning Outcomes

After completing SkillBridge courses, users will:
- Master core technical skills
- Understand career opportunities
- Build portfolio projects
- Gain industry-recognized knowledge
- Be career-ready for job applications
- Understand future growth paths

---

## 📞 Support & Feedback

For any questions or suggestions, refer to the Help Center and Contact Us links in the footer.

---

## 📅 Version

**SkillBridge v1.0** - June 2026

---

## 📜 License

This project is created for educational purposes.

---

## ✨ Credits

Created with ❤️ for learners worldwide.

**Happy Learning! 🚀**
