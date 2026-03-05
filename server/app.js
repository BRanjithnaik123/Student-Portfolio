const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Session configuration
app.use(session({
  secret: 'professional-portfolio-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed'));
    }
  }
});

// Professional User Data
const users = [
  {
    id: 1,
    username: 'admin',
    password: '',
    email: 'admin@portfolio.com',
    name: 'Administrator',
    role: 'Super Admin'
  }
];

// Professional Portfolio Data
let portfolioData = {
  personalInfo: {
    name: "Banavath Ranjit Naik",
    title: "Full-Stack Developer & AI Engineer",
    email: "branjithnaik4@gmail.com",
    phone: "+91 9704501183",
    address: "Hyderabad, Telangana, India",
    about: "Passionate full-stack developer specializing in Python, JavaScript, and AI technologies. I build scalable applications with modern architectures and excellent user experiences.",
    bio: "3+ years of experience in web development, AI projects, and software engineering. Strong problem-solving skills and a passion for creating innovative solutions."
  },
  stats: {
    projectsCompleted: 24,
    happyClients: 18,
    yearsExperience: 3,
    awards: 5
  },
  skills: [
    { name: "Python & Django", percentage: 95, category: "backend" },
    { name: "JavaScript & React", percentage: 90, category: "frontend" },
    { name: "Node.js & Express", percentage: 88, category: "backend" },
    { name: "AI & Machine Learning", percentage: 85, category: "ai" },
    { name: "Database Design", percentage: 92, category: "backend" },
    { name: "UI/UX Design", percentage: 87, category: "design" },
    { name: "DevOps & Cloud", percentage: 80, category: "infrastructure" },
    { name: "API Development", percentage: 93, category: "backend" }
  ],
  projects: [
    {
      id: 1,
      title: 'AI-Powered Healthcare Chatbot',
      category: 'ai',
      description: 'Intelligent chatbot for medical consultations and appointment scheduling',
      image: 'app-3.jpg',
      technologies: ['Python', 'NLP', 'TensorFlow', 'React', 'Node.js'],
      client: 'Healthcare Startup',
      projectDate: '2024-01-15',
      status: 'completed',
      featured: true,
      liveUrl: '#',
      githubUrl: '#',
      details: 'Developed an AI-powered chatbot that reduced appointment scheduling time by 70% and improved patient engagement.'
    },
    {
      id: 2,
      title: 'Real-Time Voice Cloning System',
      category: 'ai',
      description: 'Advanced voice synthesis using GANs and deep learning',
      image: 'app-1.jpg',
      technologies: ['PyTorch', 'GANs', 'Python', 'Audio Processing'],
      client: 'Research Institute',
      projectDate: '2024-02-20',
      status: 'completed',
      featured: true,
      liveUrl: '#',
      githubUrl: '#',
      details: 'Built a real-time voice cloning system with 95% accuracy and low-latency inference capabilities.'
    },
    {
      id: 3,
      title: 'Enterprise Digital Wallet',
      category: 'fintech',
      description: 'Secure digital wallet with multi-currency support',
      image: 'app-2.jpg',
      technologies: ['Flutter', 'Firebase', 'Stripe', 'Node.js'],
      client: 'FinTech Company',
      projectDate: '2024-03-10',
      status: 'completed',
      featured: false,
      liveUrl: '#',
      githubUrl: '#',
      details: 'Created a secure wallet application handling 10,000+ daily transactions with bank-level security.'
    },
    {
      id: 4,
      title: 'Brand Identity - Cosmetics',
      category: 'design',
      description: 'Complete brand identity and packaging design',
      image: 'branding-1.jpg',
      technologies: ['Adobe Creative Suite', 'Brand Strategy', '3D Modeling'],
      client: 'Luxury Cosmetics Brand',
      projectDate: '2024-01-30',
      status: 'completed',
      featured: false,
      liveUrl: '#',
      githubUrl: '#',
      details: 'Designed comprehensive brand identity that increased market recognition by 150% in first quarter.'
    },
    {
      id: 5,
      title: 'Book Cover Design Series',
      category: 'design',
      description: 'Award-winning book cover designs for bestsellers',
      image: 'books-1.jpg',
      technologies: ['Illustrator', 'InDesign', 'Typography', 'Print Design'],
      client: 'Major Publishing House',
      projectDate: '2024-02-15',
      status: 'completed',
      featured: true,
      liveUrl: '#',
      githubUrl: '#',
      details: 'Designed 12 book covers with 40% higher reader engagement and multiple design awards.'
    },
    {
      id: 6,
      title: 'CBD Product Branding',
      category: 'design',
      description: 'Complete branding for wellness product line',
      image: 'branding-3.jpg',
      technologies: ['Packaging Design', 'Brand Guidelines', '3D Rendering'],
      client: 'Wellness Company',
      projectDate: '2024-03-05',
      status: 'completed',
      featured: false,
      liveUrl: '#',
      githubUrl: '#',
      details: 'Developed clean, trustworthy branding that established market leadership in 6 months.'
    }
  ],
  experience: [
    {
      title: "Senior Full-Stack Developer",
      company: "Tech Innovations Inc.",
      period: "2023 - Present",
      description: "Lead development of enterprise applications using React, Node.js, and cloud technologies.",
      achievements: [
        "Reduced application load time by 60%",
        "Led team of 5 developers",
        "Implemented CI/CD pipeline"
      ]
    },
    {
      title: "AI Engineer",
      company: "AI Research Lab",
      period: "2022 - 2023",
      description: "Developed machine learning models and AI solutions for various industries.",
      achievements: [
        "Built AI models with 95% accuracy",
        "Published 3 research papers",
        "Optimized inference speed by 3x"
      ]
    },
    {
      title: "Frontend Developer",
      company: "Digital Solutions Agency",
      period: "2021 - 2022",
      description: "Created responsive web applications and user interfaces for clients.",
      achievements: [
        "Delivered 15+ successful projects",
        "Improved user engagement by 45%",
        "Mentored junior developers"
      ]
    }
  ],
  education: [
    {
      degree: "Bachelor of Technology in Computer Science",
      institution: "Indian Institute of Technology (IIT)",
      period: "2018 - 2022",
      description: "Specialized in Artificial Intelligence and Web Technologies"
    },
    {
      degree: "Machine Learning Certification",
      institution: "Stanford University (Online)",
      period: "2021",
      description: "Advanced Machine Learning and Deep Learning"
    }
  ]
};

// Hash default password
bcrypt.hash('admin123', 10, (err, hash) => {
  if (!err && users[0]) {
    users[0].password = hash;
  }
});

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

// ================= ROUTES =================

// Main portfolio page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Login routes
app.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username);
  
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = user;
    res.redirect('/dashboard');
  } else {
    res.render('login', { error: 'Invalid username or password' });
  }
});

// Dashboard route
app.get('/dashboard', requireAuth, (req, res) => {
  const stats = {
    totalProjects: portfolioData.projects.length,
    featuredProjects: portfolioData.projects.filter(p => p.featured).length,
    aiProjects: portfolioData.projects.filter(p => p.category === 'ai').length,
    designProjects: portfolioData.projects.filter(p => p.category === 'design').length,
    totalSkills: portfolioData.skills.length,
    completedProjects: portfolioData.projects.filter(p => p.status === 'completed').length
  };
  
  res.render('dashboard', { 
    user: req.session.user,
    portfolioData: portfolioData,
    stats: stats
  });
});

// API Routes
app.get('/api/portfolio', (req, res) => {
  res.json(portfolioData);
});

app.get('/api/projects', (req, res) => {
  res.json(portfolioData.projects);
});

app.post('/api/projects', requireAuth, upload.single('image'), (req, res) => {
  const { title, category, description, technologies, client, projectDate, details, featured } = req.body;
  
  const newProject = {
    id: portfolioData.projects.length + 1,
    title,
    category: category || 'web',
    description,
    technologies: technologies ? technologies.split(',') : [],
    client: client || 'Personal Project',
    projectDate: projectDate || new Date().toISOString().split('T')[0],
    details: details || description,
    image: req.file ? 'uploads/' + req.file.filename : 'default-project.jpg',
    status: 'completed',
    featured: featured === 'true',
    liveUrl: '#',
    githubUrl: '#',
    createdAt: new Date().toISOString()
  };
  
  portfolioData.projects.push(newProject);
  res.json({ success: true, project: newProject });
});

app.put('/api/projects/:id', requireAuth, (req, res) => {
  const projectId = parseInt(req.params.id);
  const projectIndex = portfolioData.projects.findIndex(p => p.id === projectId);
  
  if (projectIndex !== -1) {
    portfolioData.projects[projectIndex] = {
      ...portfolioData.projects[projectIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    res.json({ success: true, project: portfolioData.projects[projectIndex] });
  } else {
    res.status(404).json({ success: false, message: 'Project not found' });
  }
});

app.delete('/api/projects/:id', requireAuth, (req, res) => {
  const projectId = parseInt(req.params.id);
  const projectIndex = portfolioData.projects.findIndex(p => p.id === projectId);
  
  if (projectIndex !== -1) {
    const deletedProject = portfolioData.projects.splice(projectIndex, 1);
    res.json({ success: true, project: deletedProject[0] });
  } else {
    res.status(404).json({ success: false, message: 'Project not found' });
  }
});

// Skills management
app.get('/api/skills', (req, res) => {
  res.json(portfolioData.skills);
});

app.post('/api/skills', requireAuth, (req, res) => {
  const { name, percentage, category } = req.body;
  
  const newSkill = {
    name,
    percentage: parseInt(percentage),
    category: category || 'technical'
  };
  
  portfolioData.skills.push(newSkill);
  res.json({ success: true, skill: newSkill });
});

// Personal info update
app.put('/api/personal-info', requireAuth, (req, res) => {
  portfolioData.personalInfo = {
    ...portfolioData.personalInfo,
    ...req.body
  };
  res.json({ success: true, personalInfo: portfolioData.personalInfo });
});

// File management
app.get('/api/files', requireAuth, (req, res) => {
  const imagesDir = path.join(__dirname, '../public/images');
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read files' });
    }
    
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    ).map(file => ({
      name: file,
      path: `/images/${file}`,
      size: fs.statSync(path.join(imagesDir, file)).size,
      uploaded: fs.statSync(path.join(imagesDir, file)).birthtime
    }));
    
    res.json(imageFiles);
  });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Export portfolio data
app.get('/api/export', requireAuth, (req, res) => {
  res.json({
    success: true,
    data: portfolioData,
    exportedAt: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Professional Portfolio App running on http://localhost:${PORT}`);
  console.log(`📊 Admin Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`🔐 Login: http://localhost:${PORT}/login`);
  console.log(`👤 Default credentials: admin / admin123`);
  console.log(`💼 Professional template loaded with ${portfolioData.projects.length} projects`);
});