/* ============================================
   SkillBridge - Data File
   ============================================ */

const coursesData = [
    {
        id: 1,
        title: "Web Development",
        category: "Frontend",
        icon: "🌐",
        image: "images/courses/web-development.png",
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
        ],
        detailImage: "images/wd-detail.jpeg",
        youtubeVideoId: "qz0aGYrrlhU",
        youtubeVideoTitle: "Web Development Tutorial for Beginners"
    },
    {
        id: 2,
        title: "Python Programming",
        category: "Backend",
        icon: "🐍",
        image: "images/courses/python.jpeg",
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
        ],
        detailImage: "images/python-detail.jpeg",
        youtubeVideoId: "rfscVS0vtbw",
        youtubeVideoTitle: "Learn Python - Full Course for Beginners [Tutorial]"
    },
    {
        id: 3,
        title: "Data Analytics",
        category: "Data",
        icon: "📊",
        image: "images/courses/data-analytics.png",
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
        ],
        detailImage: "images/data-analytics-detail.jpeg",
        youtubeVideoId: "PSNXoAs2FtQ",
        youtubeVideoTitle: "Data Analyst Bootcamp for Beginners"
    },
    {
        id: 4,
        title: "Cloud Computing",
        category: "Infrastructure",
        icon: "☁️",
        image: "images/courses/cloud-computing.png",
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
        ],
        detailImage: "images/cloud-detail.jpeg",
        youtubeVideoId: "SOTamWNgDKc",
        youtubeVideoTitle: "AWS Certified Cloud Practitioner Certification Course"
    },
    {
        id: 5,
        title: "Cyber Security",
        category: "Security",
        icon: "🔒",
        image: "images/courses/cyber-security.png",
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
        ],
        detailImage: "images/cyber-detail.jpeg",
        youtubeVideoId: "XbJQthgnwCo",
        youtubeVideoTitle: "Cyber Security Full Course 2024"
    },
    {
        id: 6,
        title: "UI/UX Design",
        category: "Design",
        icon: "🎨",
        image: "images/courses/uiux-design.png",
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
        ],
        detailImage: "images/uiux-detail.jpeg",
        youtubeVideoId: "mT_Jjn8RJdo",
        youtubeVideoTitle: "Learn Figma in 6 Hours - Full UI/UX Design Course"
    },
    {
        id: 7,
        title: "Mobile Development",
        category: "Mobile",
        icon: "📱",
        image: "images/courses/mobile-development.png",
        description: "Build native and cross-platform mobile applications",
        duration: "12 weeks",
        level: "Intermediate",
        students: "4.9K",
        rating: 4.8,
        fullDescription: "Learn to develop professional mobile applications for iOS and Android. Master React Native and native development frameworks.",
        prerequisites: ["JavaScript knowledge", "Understanding of OOP concepts"],
        courseDuration: "12 weeks (35-40 hours)",
        skillsGained: [
            "React Native Fundamentals",
            "iOS Development (Swift)",
            "Android Development (Kotlin)",
            "Mobile UI/UX Principles",
            "API Integration",
            "App Performance Optimization",
            "App Publishing & Deployment"
        ],
        curriculumTopics: [
            "Mobile Development Basics",
            "React Native Setup & Components",
            "Navigation & Routing",
            "State Management",
            "Working with APIs",
            "Local Storage & Databases",
            "Testing & Debugging Mobile Apps",
            "Publishing to App Stores"
        ],
        careerPaths: [
            "Mobile Developer",
            "iOS Developer",
            "Android Developer",
            "React Native Developer",
            "Full Stack Mobile Developer"
        ],
        detailImage: "images/mobile-detail.jpeg",
        youtubeVideoId: "0-S5a0eXPoc",
        youtubeVideoTitle: "React Native Tutorial for Beginners"
    },
    {
        id: 8,
        title: "Machine Learning",
        category: "AI/ML",
        icon: "🤖",
        image: "images/courses/machine-learning.png",
        description: "Master machine learning algorithms and AI applications",
        duration: "14 weeks",
        level: "Advanced",
        students: "3.6K",
        rating: 4.9,
        fullDescription: "Deep dive into machine learning, neural networks, and AI. Build intelligent systems that learn from data and make predictions.",
        prerequisites: ["Python programming", "Linear algebra basics", "Statistics knowledge"],
        courseDuration: "14 weeks (45-50 hours)",
        skillsGained: [
            "Supervised Learning",
            "Unsupervised Learning",
            "Deep Learning & Neural Networks",
            "Natural Language Processing (NLP)",
            "Computer Vision",
            "Model Evaluation & Optimization",
            "TensorFlow & PyTorch"
        ],
        curriculumTopics: [
            "Machine Learning Fundamentals",
            "Data Preprocessing & Feature Engineering",
            "Regression & Classification",
            "Decision Trees & Random Forests",
            "Support Vector Machines (SVM)",
            "Neural Networks & Deep Learning",
            "NLP & Text Processing",
            "Model Deployment & Production"
        ],
        careerPaths: [
            "Machine Learning Engineer",
            "Data Scientist",
            "AI Engineer",
            "Computer Vision Specialist",
            "NLP Specialist"
        ],
        detailImage: "images/ml-detail.jpeg",
        youtubeVideoId: "i_LwzRVP7bg",
        youtubeVideoTitle: "Machine Learning for Everybody - Full Course"
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
    },
    4: { // Cloud Computing
        title: "Cloud Computing Fundamentals Quiz",
        questions: [
            {
                id: 1,
                question: "Which of the following is a major cloud service provider?",
                options: ["Adobe", "Amazon Web Services (AWS)", "Oracle Forms", "SAP GUI"],
                correct: 1,
                explanation: "AWS (Amazon Web Services) is one of the three major cloud providers along with Azure and Google Cloud."
            },
            {
                id: 2,
                question: "What does IaaS stand for?",
                options: [
                    "Internet as a Service",
                    "Infrastructure as a Service",
                    "Integration as a Service",
                    "Information as a Service"
                ],
                correct: 1,
                explanation: "IaaS stands for Infrastructure as a Service — providing virtualized computing resources over the internet."
            },
            {
                id: 3,
                question: "Which tool is used for containerization?",
                options: ["Jenkins", "Docker", "Ansible", "Terraform"],
                correct: 1,
                explanation: "Docker is the most popular containerization platform for packaging applications."
            },
            {
                id: 4,
                question: "What is Kubernetes primarily used for?",
                options: [
                    "Database management",
                    "Container orchestration",
                    "Code compilation",
                    "Network monitoring"
                ],
                correct: 1,
                explanation: "Kubernetes is an open-source container orchestration system for automating deployment, scaling, and management."
            },
            {
                id: 5,
                question: "What is a serverless computing model?",
                options: [
                    "Computing without any servers",
                    "Cloud provider manages infrastructure, you only write code",
                    "Using only physical servers",
                    "Computing without internet"
                ],
                correct: 1,
                explanation: "Serverless computing means the cloud provider manages the infrastructure and you focus only on writing code."
            }
        ]
    },
    5: { // Cyber Security
        title: "Cyber Security Fundamentals Quiz",
        questions: [
            {
                id: 1,
                question: "What does a firewall do?",
                options: [
                    "Speeds up internet",
                    "Monitors and filters network traffic",
                    "Stores passwords",
                    "Creates backups"
                ],
                correct: 1,
                explanation: "A firewall monitors and filters incoming and outgoing network traffic based on security rules."
            },
            {
                id: 2,
                question: "What is phishing?",
                options: [
                    "A type of malware",
                    "A social engineering attack to steal credentials",
                    "A network protocol",
                    "A firewall configuration"
                ],
                correct: 1,
                explanation: "Phishing is a social engineering attack where attackers impersonate trusted entities to steal sensitive information."
            },
            {
                id: 3,
                question: "What does SSL/TLS provide?",
                options: [
                    "Faster loading",
                    "Encrypted communication over the internet",
                    "Better UI design",
                    "Database optimization"
                ],
                correct: 1,
                explanation: "SSL/TLS provides encrypted communication between a client and server over the internet."
            },
            {
                id: 4,
                question: "What is the purpose of penetration testing?",
                options: [
                    "To test software performance",
                    "To simulate attacks and find vulnerabilities",
                    "To test user interfaces",
                    "To optimize databases"
                ],
                correct: 1,
                explanation: "Penetration testing simulates real-world attacks to identify security vulnerabilities before malicious hackers do."
            },
            {
                id: 5,
                question: "Which of these is a strong password practice?",
                options: [
                    "Using your birthday",
                    "Using the same password everywhere",
                    "Using a mix of uppercase, lowercase, numbers, and symbols",
                    "Using short passwords"
                ],
                correct: 2,
                explanation: "Strong passwords use a combination of uppercase, lowercase, numbers, and special characters."
            }
        ]
    },
    6: { // UI/UX Design
        title: "UI/UX Design Fundamentals Quiz",
        questions: [
            {
                id: 1,
                question: "What does UX stand for?",
                options: [
                    "Universal Experience",
                    "User Experience",
                    "Unified Extension",
                    "User Execution"
                ],
                correct: 1,
                explanation: "UX stands for User Experience — how a user interacts with and experiences a product."
            },
            {
                id: 2,
                question: "What is a wireframe?",
                options: [
                    "A final design mockup",
                    "A low-fidelity layout blueprint of a page",
                    "A type of animation",
                    "A coding framework"
                ],
                correct: 1,
                explanation: "A wireframe is a low-fidelity, simplified outline of a page layout used to plan structure and functionality."
            },
            {
                id: 3,
                question: "Which tool is widely used for UI/UX design?",
                options: ["Visual Studio Code", "Figma", "MySQL", "Git"],
                correct: 1,
                explanation: "Figma is a popular collaborative design tool for creating UI/UX designs, prototypes, and design systems."
            },
            {
                id: 4,
                question: "What is the purpose of usability testing?",
                options: [
                    "To test code performance",
                    "To evaluate how easily users can use a product",
                    "To test server load",
                    "To check for bugs"
                ],
                correct: 1,
                explanation: "Usability testing evaluates how easily and intuitively users can interact with a product."
            },
            {
                id: 5,
                question: "What does 'responsive design' mean in UI/UX?",
                options: [
                    "Design that responds to user clicks",
                    "Design that adapts to different screen sizes and devices",
                    "Design with fast animations",
                    "Design that loads quickly"
                ],
                correct: 1,
                explanation: "Responsive design ensures a product looks and works well across different screen sizes and devices."
            }
        ]
    },
    7: { // Mobile Development
        title: "Mobile Development Fundamentals Quiz",
        questions: [
            {
                id: 1,
                question: "Which framework is used for cross-platform mobile development?",
                options: ["React Native", "Angular", "Vue.js", "Express.js"],
                correct: 0,
                explanation: "React Native is a popular framework for building cross-platform mobile applications for iOS and Android."
            },
            {
                id: 2,
                question: "What is the primary language for iOS development?",
                options: ["Java", "Kotlin", "Swift", "C#"],
                correct: 2,
                explanation: "Swift is the primary programming language for iOS app development."
            },
            {
                id: 3,
                question: "Which language is native to Android development?",
                options: ["Swift", "Kotlin", "Objective-C", "Ruby"],
                correct: 1,
                explanation: "Kotlin is the official language for Android development, replacing Java."
            },
            {
                id: 4,
                question: "What does API stand for in the context of mobile apps?",
                options: [
                    "Advanced Programming Interface",
                    "Application Programming Interface",
                    "Application Process Integration",
                    "Advanced Process Interface"
                ],
                correct: 1,
                explanation: "API stands for Application Programming Interface - used to communicate between app and server."
            },
            {
                id: 5,
                question: "Which design pattern is most commonly used in mobile apps for state management?",
                options: ["MVC", "MVP", "MVVM", "All of the above"],
                correct: 3,
                explanation: "MVC, MVP, and MVVM are all used in mobile development for managing application state and UI."
            }
        ]
    },
    8: { // Machine Learning
        title: "Machine Learning Fundamentals Quiz",
        questions: [
            {
                id: 1,
                question: "What is the main goal of supervised learning?",
                options: [
                    "To discover hidden patterns in data",
                    "To predict outcomes based on labeled training data",
                    "To find clusters in data",
                    "To reduce dimensionality"
                ],
                correct: 1,
                explanation: "Supervised learning uses labeled data to train models that can predict outcomes for new inputs."
            },
            {
                id: 2,
                question: "Which algorithm is used for image recognition in deep learning?",
                options: [
                    "Decision Tree",
                    "K-Means Clustering",
                    "Convolutional Neural Networks (CNN)",
                    "Linear Regression"
                ],
                correct: 2,
                explanation: "Convolutional Neural Networks (CNNs) are specialized for image recognition and computer vision tasks."
            },
            {
                id: 3,
                question: "What does overfitting mean in machine learning?",
                options: [
                    "The model is too simple",
                    "The model performs well on training data but poorly on new data",
                    "The model needs more features",
                    "The model has too few parameters"
                ],
                correct: 1,
                explanation: "Overfitting occurs when a model learns the training data too well, including noise, and fails to generalize."
            },
            {
                id: 4,
                question: "Which library is most popular for machine learning in Python?",
                options: ["NumPy", "scikit-learn", "Matplotlib", "Pandas"],
                correct: 1,
                explanation: "scikit-learn is the most popular Python library for machine learning algorithms and tools."
            },
            {
                id: 5,
                question: "What is the purpose of training/testing split in ML?",
                options: [
                    "To increase data size",
                    "To evaluate model performance on unseen data",
                    "To reduce training time",
                    "To remove outliers"
                ],
                correct: 1,
                explanation: "Train/test split divides data to evaluate how well the model generalizes to new, unseen data."
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
    },
    7: { // Mobile Development
        title: "Mobile Development Career Growth",
        growthPaths: [
            {
                title: "Mobile Application Developer",
                salary: "$100K - $170K",
                demand: "Very High",
                skills: ["React Native", "Native iOS/Android", "APIs"],
                growth: "Senior Developer → Tech Lead"
            },
            {
                title: "Full Stack Mobile Developer",
                salary: "$130K - $200K",
                demand: "Very High",
                skills: ["Frontend + Backend", "Mobile Architecture", "DevOps"],
                growth: "Senior Developer → Architect"
            },
            {
                title: "Mobile Solutions Architect",
                salary: "$150K - $220K",
                demand: "High",
                skills: ["System Design", "Cross-platform Development", "Leadership"],
                growth: "Architect → Engineering Manager"
            }
        ],
        industryInsights: [
            "Mobile-first approach becoming standard",
            "React Native and Flutter gaining popularity",
            "IoT and wearable app development growing",
            "App monetization and user retention critical"
        ]
    },
    8: { // Machine Learning
        title: "Machine Learning Career Growth",
        growthPaths: [
            {
                title: "Machine Learning Engineer",
                salary: "$120K - $200K",
                demand: "Very High",
                skills: ["Algorithms", "Python/TensorFlow", "Data Processing"],
                growth: "ML Engineer → Senior ML Engineer"
            },
            {
                title: "AI Research Scientist",
                salary: "$150K - $250K",
                demand: "Very High",
                skills: ["Advanced Math", "Research", "Deep Learning"],
                growth: "Research Scientist → Principal Scientist"
            },
            {
                title: "Data Scientist with ML",
                salary: "$110K - $180K",
                demand: "Very High",
                skills: ["Statistics", "ML Algorithms", "Data Analysis"],
                growth: "Data Scientist → ML Lead"
            }
        ],
        industryInsights: [
            "AI/ML adoption accelerating across industries",
            "Generative AI and LLMs revolutionizing the field",
            "Edge AI and on-device ML growing rapidly",
            "Ethical AI and responsible ML becoming critical"
        ]
    },
    3: { // Data Analytics
        title: "Data Analytics Career Growth",
        growthPaths: [
            {
                title: "Senior Data Analyst",
                salary: "$90K - $160K",
                demand: "Very High",
                skills: ["Advanced Analytics", "SQL/Python", "Data Visualization"],
                growth: "Data Analyst → Analytics Manager"
            },
            {
                title: "Analytics Engineer",
                salary: "$110K - $180K",
                demand: "Very High",
                skills: ["Data Pipelines", "SQL", "Data Warehousing"],
                growth: "Analytics Engineer → Data Architecture Lead"
            },
            {
                title: "Business Intelligence Specialist",
                salary: "$100K - $170K",
                demand: "High",
                skills: ["BI Tools", "Dashboard Design", "Business Acumen"],
                growth: "BI Specialist → BI Architect"
            }
        ],
        industryInsights: [
            "Real-time analytics becoming standard",
            "Self-service analytics platforms growing",
            "Data storytelling becoming critical skill",
            "Analytics in every department expanding"
        ]
    },
    4: { // Cloud Computing
        title: "Cloud Computing Career Growth",
        growthPaths: [
            {
                title: "Cloud Solutions Architect",
                salary: "$130K - $210K",
                demand: "Very High",
                skills: ["AWS/Azure/GCP", "System Design", "Best Practices"],
                growth: "Architect → Enterprise Architect"
            },
            {
                title: "DevOps Engineer",
                salary: "$110K - $190K",
                demand: "Very High",
                skills: ["CI/CD", "Kubernetes", "Automation"],
                growth: "DevOps Engineer → Infrastructure Lead"
            },
            {
                title: "Cloud Security Engineer",
                salary: "$120K - $200K",
                demand: "Very High",
                skills: ["Cloud Security", "Compliance", "Network Security"],
                growth: "Security Engineer → Security Architect"
            }
        ],
        industryInsights: [
            "Hybrid and multi-cloud strategies expanding",
            "Serverless computing gaining adoption",
            "Cloud cost optimization becoming critical",
            "Cloud-native development becoming standard"
        ]
    },
    5: { // Cyber Security
        title: "Cyber Security Career Growth",
        growthPaths: [
            {
                title: "Security Engineer",
                salary: "$100K - $180K",
                demand: "Very High",
                skills: ["Penetration Testing", "Security Tools", "Risk Assessment"],
                growth: "Security Engineer → Security Lead"
            },
            {
                title: "Security Architect",
                salary: "$140K - $220K",
                demand: "Very High",
                skills: ["System Design", "Compliance", "Threat Modeling"],
                growth: "Architect → Chief Information Security Officer"
            },
            {
                title: "Incident Response Specialist",
                salary: "$110K - $190K",
                demand: "Very High",
                skills: ["Incident Management", "Forensics", "Threat Analysis"],
                growth: "IR Specialist → Security Operations Manager"
            }
        ],
        industryInsights: [
            "Zero-trust security model adoption",
            "AI-powered threat detection growing",
            "Compliance requirements increasing",
            "Ransomware defense becoming critical"
        ]
    },
    6: { // UI/UX Design
        title: "UI/UX Design Career Growth",
        growthPaths: [
            {
                title: "Product Designer",
                salary: "$90K - $160K",
                demand: "High",
                skills: ["User Research", "Prototyping", "Design Systems"],
                growth: "Designer → Design Lead"
            },
            {
                title: "UX Researcher",
                salary: "$85K - $150K",
                demand: "High",
                skills: ["User Research", "Data Analysis", "Psychology"],
                growth: "Researcher → Head of Research"
            },
            {
                title: "Design Technologist / Design Engineer",
                salary: "$110K - $180K",
                demand: "Very High",
                skills: ["Design + Development", "Prototyping", "Systems"],
                growth: "Design Engineer → Tech Lead"
            }
        ],
        industryInsights: [
            "Design systems becoming industry standard",
            "Design-to-code automation emerging",
            "Accessibility and inclusive design critical",
            "AI/ML in design tools revolutionizing workflow"
        ]
    }
};
