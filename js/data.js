/* ============================================
   SkillBridge - Data File
   ============================================ */

const coursesData = [
    {
        id: 1,
        title: "Web Development",
        category: "Frontend",
        icon: "🌐",
        description: "Learn to build modern, responsive websites",
        duration: "12 weeks",
        level: "Beginner",
        students: "5.2K",
        rating: 4.8,
        fullDescription: "Master the fundamentals of web development and build stunning, interactive websites. Learn HTML, CSS, JavaScript, and modern frameworks.",
        prerequisites: ["Basic computer knowledge", "Text editor familiarity"],
        courseDuration: "12 weeks (30-35 hours)",
        skillsGained: [
            "HTML5 and CSS3",
            "JavaScript ES6+",
            "Responsive Design",
            "Version Control (Git)",
            "Web Performance Optimization"
        ],
        curriculumTopics: [
            "HTML Fundamentals",
            "CSS Styling & Layouts",
            "JavaScript Basics",
            "DOM Manipulation",
            "API Integration",
            "React Basics",
            "Deployment"
        ],
        careerPaths: [
            "Frontend Developer",
            "Full Stack Developer",
            "Web Designer",
            "UI Developer",
            "WordPress Developer"
        ]
    },
    {
        id: 2,
        title: "Python Programming",
        category: "Backend",
        icon: "🐍",
        description: "Master Python for backend development and automation",
        duration: "10 weeks",
        level: "Beginner",
        students: "8.5K",
        rating: 4.9,
        fullDescription: "Learn Python programming from scratch and become proficient in one of the most popular languages. Perfect for beginners and experienced programmers alike.",
        prerequisites: ["No prior programming experience needed", "Logical thinking"],
        courseDuration: "10 weeks (25-30 hours)",
        skillsGained: [
            "Python Basics & OOP",
            "Data Structures",
            "File Handling",
            "Web Frameworks (Django/Flask)",
            "Database Integration",
            "API Development",
            "Testing & Debugging"
        ],
        curriculumTopics: [
            "Variables & Data Types",
            "Control Flow",
            "Functions & Modules",
            "Object-Oriented Programming",
            "Working with Files",
            "Web Scraping",
            "Database Operations"
        ],
        careerPaths: [
            "Python Developer",
            "Backend Developer",
            "Data Analyst",
            "Automation Engineer",
            "Machine Learning Engineer"
        ]
    },
    {
        id: 3,
        title: "Data Analytics",
        category: "Data",
        icon: "📊",
        description: "Transform raw data into actionable insights",
        duration: "14 weeks",
        level: "Intermediate",
        students: "4.1K",
        rating: 4.7,
        fullDescription: "Learn to analyze data using Python, SQL, and visualization tools. Make data-driven decisions and become a skilled data analyst.",
        prerequisites: ["Basic math knowledge", "Familiarity with Excel"],
        courseDuration: "14 weeks (40-45 hours)",
        skillsGained: [
            "Data Cleaning & Preprocessing",
            "SQL Queries",
            "Python for Data Analysis (Pandas, NumPy)",
            "Data Visualization",
            "Statistical Analysis",
            "Business Intelligence",
            "Dashboard Creation"
        ],
        curriculumTopics: [
            "Data Fundamentals",
            "SQL Basics & Advanced Queries",
            "Excel Advanced Features",
            "Python for Analytics",
            "Statistical Analysis",
            "Data Visualization with Tableau",
            "Business Reporting"
        ],
        careerPaths: [
            "Data Analyst",
            "Business Analyst",
            "SQL Developer",
            "BI Developer",
            "Data Scientist"
        ]
    },
    {
        id: 4,
        title: "Cloud Computing",
        category: "Infrastructure",
        icon: "☁️",
        description: "Deploy and manage applications on cloud platforms",
        duration: "11 weeks",
        level: "Intermediate",
        students: "3.8K",
        rating: 4.6,
        fullDescription: "Master cloud computing with AWS, Azure, and Google Cloud. Learn to deploy, scale, and manage applications in the cloud.",
        prerequisites: ["Linux basics", "Networking fundamentals"],
        courseDuration: "11 weeks (32-38 hours)",
        skillsGained: [
            "AWS Fundamentals",
            "Cloud Architecture",
            "Containerization (Docker)",
            "Orchestration (Kubernetes)",
            "Serverless Computing",
            "Cloud Security",
            "Infrastructure as Code"
        ],
        curriculumTopics: [
            "Cloud Computing Basics",
            "AWS Services Overview",
            "EC2 & Storage",
            "Networking & Security",
            "Docker Containerization",
            "Kubernetes Basics",
            "CI/CD Pipelines"
        ],
        careerPaths: [
            "Cloud Engineer",
            "DevOps Engineer",
            "Solutions Architect",
            "Cloud Administrator",
            "Infrastructure Engineer"
        ]
    },
    {
        id: 5,
        title: "Cyber Security",
        category: "Security",
        icon: "🔒",
        description: "Protect systems and networks from cyber threats",
        duration: "13 weeks",
        level: "Intermediate",
        students: "3.2K",
        rating: 4.8,
        fullDescription: "Learn cybersecurity principles, ethical hacking, and security best practices to protect digital assets and networks.",
        prerequisites: ["Basic networking knowledge", "Operating systems understanding"],
        courseDuration: "13 weeks (36-40 hours)",
        skillsGained: [
            "Network Security",
            "Ethical Hacking",
            "Penetration Testing",
            "Cryptography",
            "Threat Detection",
            "Incident Response",
            "Compliance & Governance"
        ],
        curriculumTopics: [
            "Cybersecurity Fundamentals",
            "Network Security",
            "Firewalls & IDS/IPS",
            "Cryptography Basics",
            "Ethical Hacking Tools",
            "Penetration Testing",
            "Security Best Practices"
        ],
        careerPaths: [
            "Security Analyst",
            "Penetration Tester",
            "Security Engineer",
            "SOC Analyst",
            "Chief Information Security Officer (CISO)"
        ]
    },
    {
        id: 6,
        title: "UI/UX Design",
        category: "Design",
        icon: "🎨",
        description: "Create beautiful and user-friendly interfaces",
        duration: "10 weeks",
        level: "Beginner",
        students: "6.3K",
        rating: 4.7,
        fullDescription: "Master UI/UX design principles and tools like Figma. Create intuitive, beautiful user interfaces that users love.",
        prerequisites: ["Basic design sense", "Creative thinking"],
        courseDuration: "10 weeks (28-32 hours)",
        skillsGained: [
            "Design Principles",
            "Wireframing & Prototyping",
            "User Research",
            "Color Theory",
            "Typography",
            "Figma Mastery",
            "Design Systems"
        ],
        curriculumTopics: [
            "Design Fundamentals",
            "User Research Methods",
            "Wireframing & Sketching",
            "Prototyping with Figma",
            "Visual Design",
            "Interaction Design",
            "Usability Testing"
        ],
        careerPaths: [
            "UI/UX Designer",
            "Product Designer",
            "Interaction Designer",
            "Visual Designer",
            "Design Lead"
        ]
    }
];

const quizData = {
    1: { // Web Development
        title: "Web Development Fundamentals Quiz",
        questions: [
            {
                id: 1,
                question: "What does HTML stand for?",
                options: [
                    "Hyper Text Markup Language",
                    "High Tech Modern Language",
                    "Home Tool Markup Language",
                    "Hyperlinks and Text Markup Language"
                ],
                correct: 0,
                explanation: "HTML stands for Hyper Text Markup Language - the standard markup language for creating web pages."
            },
            {
                id: 2,
                question: "Which CSS property is used to add space inside an element?",
                options: ["margin", "padding", "spacing", "gap"],
                correct: 1,
                explanation: "Padding adds space inside an element, while margin adds space outside."
            },
            {
                id: 3,
                question: "What is the correct syntax for a JavaScript function?",
                options: [
                    "function = myFunction() {}",
                    "function myFunction() {}",
                    "myFunction() function {}",
                    "function: myFunction() {}"
                ],
                correct: 1,
                explanation: "The correct syntax is 'function myFunction() {}' to declare a JavaScript function."
            },
            {
                id: 4,
                question: "Which HTML element is used for the main heading?",
                options: ["<heading>", "<h1>", "<head>", "<header>"],
                correct: 1,
                explanation: "The <h1> tag defines the most important heading on a page."
            },
            {
                id: 5,
                question: "What does CSS stand for?",
                options: [
                    "Computer Style Sheets",
                    "Cascading Style Sheets",
                    "Creative Style Sheets",
                    "Colorful Style Sheets"
                ],
                correct: 1,
                explanation: "CSS stands for Cascading Style Sheets - used to style HTML elements."
            }
        ]
    },
    2: { // Python Programming
        title: "Python Programming Basics Quiz",
        questions: [
            {
                id: 1,
                question: "Which symbol is used for comments in Python?",
                options: ["//", "#", "/*", "--"],
                correct: 1,
                explanation: "In Python, the '#' symbol is used to write single-line comments."
            },
            {
                id: 2,
                question: "What is the correct way to create a list in Python?",
                options: [
                    "myList = {1, 2, 3}",
                    "myList = [1, 2, 3]",
                    "myList = (1, 2, 3)",
                    "myList = <1, 2, 3>"
                ],
                correct: 1,
                explanation: "Lists in Python are created using square brackets []."
            },
            {
                id: 3,
                question: "Which function is used to get the length of a list?",
                options: ["size()", "length()", "len()", "count()"],
                correct: 2,
                explanation: "The len() function returns the number of items in a list."
            },
            {
                id: 4,
                question: "What is the output of print(2 ** 3)?",
                options: ["6", "5", "8", "23"],
                correct: 2,
                explanation: "The ** operator is used for exponentiation. 2 ** 3 = 2^3 = 8."
            },
            {
                id: 5,
                question: "Which of these is a mutable data type in Python?",
                options: ["String", "Tuple", "List", "Integer"],
                correct: 2,
                explanation: "Lists are mutable (can be changed), while strings and tuples are immutable."
            }
        ]
    },
    3: { // Data Analytics
        title: "Data Analytics Fundamentals Quiz",
        questions: [
            {
                id: 1,
                question: "What does OLAP stand for?",
                options: [
                    "Online Analytical Processing",
                    "Online Application Processing",
                    "Open Language Analytical Platform",
                    "Operational Learning Analytics Platform"
                ],
                correct: 0,
                explanation: "OLAP stands for Online Analytical Processing - used for data analysis."
            },
            {
                id: 2,
                question: "Which SQL clause is used to filter records?",
                options: ["FILTER", "WHERE", "SELECT", "ORDER"],
                correct: 1,
                explanation: "The WHERE clause is used to filter records in SQL queries."
            },
            {
                id: 3,
                question: "What is the purpose of data normalization?",
                options: [
                    "To increase data size",
                    "To reduce data redundancy and improve consistency",
                    "To speed up queries",
                    "To encrypt data"
                ],
                correct: 1,
                explanation: "Data normalization reduces redundancy and ensures data consistency."
            },
            {
                id: 4,
                question: "Which visualization is best for showing data distribution?",
                options: ["Pie Chart", "Histogram", "Line Chart", "Bar Chart"],
                correct: 1,
                explanation: "Histograms are best for showing the distribution of continuous data."
            },
            {
                id: 5,
                question: "What does KPI stand for?",
                options: [
                    "Key Performance Indicator",
                    "Knowledge Processing Index",
                    "Key Profit Indicator",
                    "Knowledge Performance Index"
                ],
                correct: 0,
                explanation: "KPI stands for Key Performance Indicator - metrics used to measure success."
            }
        ]
    }
};

const roadmapStages = [
    {
        stage: "Beginner",
        icon: "🌱",
        description: "Learn Fundamentals",
        duration: "Weeks 1-4",
        topics: ["Core concepts", "Basic syntax", "Fundamentals"]
    },
    {
        stage: "Fundamentals",
        icon: "📚",
        description: "Build Foundation",
        duration: "Weeks 5-8",
        topics: ["Intermediate concepts", "Best practices", "Design patterns"]
    },
    {
        stage: "Projects",
        icon: "🛠️",
        description: "Hands-on Work",
        duration: "Weeks 9-10",
        topics: ["Real projects", "Problem solving", "Portfolio building"]
    },
    {
        stage: "Intermediate",
        icon: "⚙️",
        description: "Advanced Topics",
        duration: "Weeks 11-12",
        topics: ["Advanced features", "Optimization", "Scalability"]
    },
    {
        stage: "Advanced",
        icon: "🚀",
        description: "Expert Level",
        duration: "Weeks 13-14",
        topics: ["Specialization", "Industry standards", "Leadership"]
    },
    {
        stage: "Career Ready",
        icon: "🎯",
        description: "Ready for Job",
        duration: "Week 15+",
        topics: ["Interview prep", "Job hunting", "Professional growth"]
    }
];

const futureOpportunitiesData = {
    1: { // Web Development
        title: "Web Development Career Growth",
        growthPaths: [
            {
                title: "Full Stack Developer",
                salary: "$120K - $180K",
                demand: "Very High",
                skills: ["Frontend + Backend", "Database", "DevOps"],
                growth: "Senior Developer → Tech Lead"
            },
            {
                title: "Tech Lead / Architect",
                salary: "$150K - $250K",
                demand: "High",
                skills: ["System Design", "Team Leadership", "Best Practices"],
                growth: "Director → CTO"
            },
            {
                title: "AI/ML Integration",
                salary: "$130K - $200K",
                demand: "Very High",
                skills: ["Machine Learning", "NLP", "Computer Vision"],
                growth: "ML Engineer → AI Researcher"
            }
        ],
        industryInsights: [
            "Web3 and blockchain development growing rapidly",
            "Progressive Web Apps (PWA) increasing demand",
            "Low-code/No-code platforms emergence",
            "AI integration in web applications"
        ]
    },
    2: { // Python Programming
        title: "Python Programming Career Growth",
        growthPaths: [
            {
                title: "Data Scientist",
                salary: "$110K - $180K",
                demand: "Very High",
                skills: ["Machine Learning", "Data Analysis", "Statistics"],
                growth: "ML Engineer → AI Research Lead"
            },
            {
                title: "Backend Engineer",
                salary: "$100K - $170K",
                demand: "High",
                skills: ["Django/Flask", "Databases", "APIs"],
                growth: "Senior Engineer → Tech Lead"
            },
            {
                title: "DevOps / Cloud Engineer",
                salary: "$120K - $190K",
                demand: "Very High",
                skills: ["Automation", "Cloud Platforms", "Infrastructure"],
                growth: "Cloud Engineer → Solutions Architect"
            }
        ],
        industryInsights: [
            "Python dominates AI/ML industry",
            "High demand for automation engineers",
            "Data science roles rapidly growing",
            "Python expanding to embedded systems"
        ]
    }
};
