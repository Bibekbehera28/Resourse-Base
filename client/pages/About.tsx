import { Link } from "react-router-dom";
import {
  BookOpen,
  Zap,
  Users,
  Target,
  Github,
  Globe,
  Layers,
  CheckCircle,
  FileText,
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Navigation */}
      <div className="bg-card/50 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="flex items-center gap-3 w-fit group"
          >
            <div className="p-2 bg-gradient-to-br from-red-600 to-red-700 rounded-lg group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">
              Resource Base
            </span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              About Student
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
                {" "}
                Resource Base
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              A comprehensive platform designed to centralize and organize
              educational resources for students across multiple engineering
              disciplines.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-105"
            >
              <span>Explore Courses</span>
              <span>→</span>
            </Link>
          </div>

          <div className="animate-fade-in hidden md:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-indigo-500/20 card-hover">
                <Users className="w-8 h-8 text-indigo-500 mb-3" />
                <h3 className="font-semibold text-foreground mb-2">
                  For Students
                </h3>
                <p className="text-sm text-muted-foreground">
                  Easy access to all study materials
                </p>
              </div>
              <div className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-purple-500/20 card-hover" style={{ animationDelay: "0.1s" }}>
                <Layers className="w-8 h-8 text-purple-500 mb-3" />
                <h3 className="font-semibold text-foreground mb-2">
                  Well Organized
                </h3>
                <p className="text-sm text-muted-foreground">
                  Structured by course, semester, subject
                </p>
              </div>
              <div className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-pink-500/20 card-hover" style={{ animationDelay: "0.2s" }}>
                <Zap className="w-8 h-8 text-pink-500 mb-3" />
                <h3 className="font-semibold text-foreground mb-2">
                  Fast Access
                </h3>
                <p className="text-sm text-muted-foreground">
                  Quick navigation and instant downloads
                </p>
              </div>
              <div className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-blue-500/20 card-hover" style={{ animationDelay: "0.3s" }}>
                <Globe className="w-8 h-8 text-blue-500 mb-3" />
                <h3 className="font-semibold text-foreground mb-2">
                  Cloud Based
                </h3>
                <p className="text-sm text-muted-foreground">
                  GitHub integration for reliability
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-card/30 py-20 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Key Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need for organized learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-stagger">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-8 bg-card rounded-xl border border-border hover:border-primary/50 transition-all card-hover group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-lg transition-transform">
                    <feature.icon className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple navigation through organized course materials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-stagger">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-1 bg-gradient-to-r from-red-600/30 to-transparent -translate-y-1/2"></div>
                )}

                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-red-700 mb-4 group hover:shadow-lg hover:shadow-red-600/30 transition-all">
                    <span className="text-3xl font-bold text-white">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-card/30 py-20 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Technical Stack
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with modern, reliable technologies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-stagger">
            {techStack.map((tech, index) => (
              <div
                key={tech.category}
                className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-indigo-500" />
                  {tech.category}
                </h3>
                <ul className="space-y-2">
                  {tech.items.map((item) => (
                    <li
                      key={item}
                      className="text-muted-foreground flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to Explore?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start browsing our comprehensive collection of courses, semesters,
            and learning materials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-105"
            >
              <span>Browse Courses</span>
              <span>→</span>
            </Link>
            <a
              href="https://github.com/Bibekbehera28/ResourceBase_Notes"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border text-foreground rounded-lg font-semibold hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <Github className="w-5 h-5" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card/50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>
            © 2024 Student Resource Base. All rights reserved. | Built with ❤️
            for students
          </p>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    title: "Organized Structure",
    description:
      "Navigate easily through courses, semesters, and subjects with an intuitive hierarchy.",
    icon: Layers,
  },
  {
    title: "Direct PDF Access",
    description:
      "Download and open study materials directly from GitHub with a single click.",
    icon: FileText,
  },
  {
    title: "Multiple Courses",
    description:
      "Support for CSE, AIML, ECE, ME, and more engineering disciplines.",
    icon: BookOpen,
  },
  {
    title: "Responsive Design",
    description:
      "Seamlessly works across desktop, tablet, and mobile devices.",
    icon: Globe,
  },
  {
    title: "Fast Navigation",
    description:
      "Quick access to materials with minimal clicks and loading times.",
    icon: Zap,
  },
  {
    title: "Professional Interface",
    description:
      "Modern dark theme with smooth animations and intuitive user experience.",
    icon: Target,
  },
];

const steps = [
  {
    number: 1,
    title: "Select Course",
    description: "Choose from available engineering programs",
  },
  {
    number: 2,
    title: "Pick Semester",
    description: "Browse through 8 semesters of your course",
  },
  {
    number: 3,
    title: "Choose Subject",
    description: "Select the subject you want to study",
  },
  {
    number: 4,
    title: "Learn Modules",
    description: "Access and download study modules",
  },
];

const techStack = [
  {
    category: "Frontend",
    items: [
      "React 18 with TypeScript",
      "React Router 6 for navigation",
      "TailwindCSS 3 for styling",
      "Lucide React for icons",
    ],
  },
  {
    category: "Backend & Hosting",
    items: [
      "Express.js server",
      "GitHub integration for PDFs",
      "Vite for fast development",
      "Responsive design framework",
    ],
  },
  {
    category: "Features",
    items: [
      "Dark theme with smooth animations",
      "Organized course structure",
      "Direct PDF integration",
      "Mobile-first responsive design",
    ],
  },
  {
    category: "Deployment",
    items: [
      "Netlify or Vercel ready",
      "Cloud-based infrastructure",
      "Scalable architecture",
      "Production-ready codebase",
    ],
  },
];

export default About;
