// This file is the single source of truth for content BEFORE Supabase is
// connected, and it is also the exact shape the database tables use.
// Every field here is taken directly from the uploaded resume. Fields the
// resume didn't specify are left as empty strings / null rather than invented
// — edit them here, or (once Supabase is set up) through /admin.

export const profile = {
  name: 'Devi Sri Prasad Uddanti',
  headline: 'Aspiring Software Developer | AI/ML Enthusiast | Full-Stack Development',
  intro:
    "I'm a final-year Information Technology student building dynamic, responsive web applications and exploring AI/ML and computer vision through hands-on projects. I enjoy solving real problems end-to-end — from REST API integration to real-time computer vision pipelines — and I'm actively looking for a software developer role where I can keep learning and shipping.",
  about:
    "I'm Devi Sri Prasad, a B.Tech Information Technology student with a strong foundation in Java, Python, and SQL, and hands-on experience building full-stack and computer-vision projects. My work spans responsive frontend interfaces that consume live REST APIs to real-time driver-monitoring systems built with OpenCV. I'm comfortable across the stack — from React UIs to MySQL-backed data — and I care about writing code that's clean, tested against real edge cases, and genuinely useful. I'm currently sharpening my AI/ML skills alongside my coursework and looking for an opportunity to apply that foundation on a real engineering team.",
  email: 'devisriprasadud311@gmail.com',
  location: 'Vijayawada, Andhra Pradesh, India',
  github: 'https://github.com/Devisriprasad75',
  linkedin: 'https://www.linkedin.com/in/devi-sri-prasad-uddanti-b5a928345',
  resumeUrl: '/resume.pdf',
  seekingOpportunities: true,
}

export const siteSettings = {
  sections: {
    home: true,
    about: true,
    education: true,
    experience: true,
    skills: true,
    projects: true,
    achievements: true,
    certifications: true,
    resume: true,
    contact: true,
  },
}

export const education = [
  {
    id: 'edu-1',
    degree: 'B.Tech in Information Technology',
    institution: 'Dhanekula Institute of Engineering & Technology',
    location: 'Vijayawada, India',
    start_date: null,
    end_date: '2027-06-01',
    end_label: 'Expected June 2027',
    details: '',
    order: 1,
  },
  {
    id: 'edu-2',
    degree: 'Intermediate',
    institution: 'Andhra Loyola College',
    location: 'Vijayawada, India',
    start_date: null,
    end_date: '2023-06-01',
    end_label: 'June 2023',
    details: '',
    order: 2,
  },
  {
    id: 'edu-3',
    degree: 'High School',
    institution: 'Zilla Parishad High School',
    location: 'Penamaluru, Vijayawada, India',
    start_date: null,
    end_date: '2021-04-01',
    end_label: 'April 2021',
    details: '',
    order: 3,
  },
]

export const skillCategories = [
  { id: 'cat-programming', name: 'Programming', icon: 'Code2', skills: ['Java', 'Python', 'SQL'] },
  { id: 'cat-frontend', name: 'Frontend Development', icon: 'LayoutTemplate', skills: ['HTML', 'CSS', 'JavaScript', 'React'] },
  { id: 'cat-backend', name: 'Backend & APIs', icon: 'Server', skills: ['REST APIs'] },
  { id: 'cat-db', name: 'Databases', icon: 'Database', skills: ['MySQL'] },
  { id: 'cat-ai', name: 'AI & Computer Vision', icon: 'ScanEye', skills: ['OpenCV'] },
  { id: 'cat-tools', name: 'Development Tools', icon: 'GitBranch', skills: ['Git', 'GitHub'] },
]

export const projects = [
  {
    id: 'proj-weather-dashboard',
    title: 'Weather Dashboard',
    summary: 'A responsive weather app that fetches live conditions for any city via a REST API.',
    description:
      'Built a dynamic, responsive weather application using HTML, CSS and JavaScript that consumes a third-party REST API to fetch and render live weather data based on user-entered city input. Handled asynchronous requests with the Fetch API, parsed JSON responses to display temperature, feels-like temperature, humidity, wind speed, pressure, and sunrise/sunset times, and implemented client-side state handling for loading, error, and empty-result conditions so the app stays usable through network failures and invalid input.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'REST API'],
    thumbnail_url: '',
    github_url: '',
    live_url: '',
    status: 'Completed',
    featured: true,
    order: 1,
  },
  {
    id: 'proj-driver-safety',
    title: 'Driver Safety System',
    summary: 'Real-time drowsiness detection using facial-landmark analysis with live visual and audio alerts.',
    description:
      'Developed a real-time driver monitoring system using HTML, CSS, JavaScript and Python with OpenCV to detect drowsiness through continuous facial-landmark analysis. Built an event-driven alert mechanism that triggers dynamic on-screen and audio warnings the moment unsafe conditions are detected, updating the interface in real time without page reloads.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Python', 'OpenCV'],
    thumbnail_url: '',
    github_url: '',
    live_url: '',
    status: 'Completed',
    featured: true,
    order: 2,
  },
]

// Training/learning, deliberately NOT framed as employment.
export const experience = [
  {
    id: 'exp-1',
    title: 'Fresher Trainee Program — Applicant',
    organization: 'HCLTech',
    type: 'Learning / Application Target',
    start_date: null,
    end_date: null,
    description:
      'Preparing for and applying to full-stack developer trainee programs, building project and interview-ready skills in Java, React, and REST API integration.',
    order: 1,
  },
]

export const achievements = [
  {
    id: 'ach-1',
    title: '3rd Prize — ELEVATEX Hackathon',
    issuer: 'Codegnan, Vijayawada',
    date: null,
    description:
      'Built a working solution within a 12-hour time constraint, demonstrating rapid problem-solving, teamwork, and end-to-end development under pressure.',
    order: 1,
  },
  {
    id: 'ach-2',
    title: '1st Prize — Prompt to Print Coding Competition',
    issuer: '',
    date: null,
    description: 'Secured first place in a competitive programming contest, demonstrating strong algorithmic problem-solving and programming skills.',
    order: 2,
  },
]

export const certifications = [
  { id: 'cert-1', title: 'Google AI-ML Certificate', issuer: 'Google', issue_date: '2026-09-01', credential_url: '', image_url: '', order: 1 },
  { id: 'cert-2', title: 'Google Cloud Cybersecurity Certificate', issuer: 'Google Cloud', issue_date: '2025-09-01', credential_url: '', image_url: '', order: 2 },
  { id: 'cert-3', title: 'AI For Beginners', issuer: '', issue_date: '2025-06-01', credential_url: '', image_url: '', order: 3 },
  { id: 'cert-4', title: 'TechA Front End Development Foundation Certificate', issuer: '', issue_date: '2025-03-01', credential_url: '', image_url: '', order: 4 },
  { id: 'cert-5', title: 'TechA Responsive Web Designing Foundation Certificate', issuer: '', issue_date: '2025-03-01', credential_url: '', image_url: '', order: 5 },
]
