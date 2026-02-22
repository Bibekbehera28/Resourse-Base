import { Link } from "react-router-dom";
import { BookOpen, Code, Zap, Brain, Info } from "lucide-react";

const courses = [
  {
    id: "cse",
    name: "Computer Science Engineering",
    shortName: "CSE",
    icon: Code,
    color: "from-red-600 to-red-700",
    description: "Fundamental and advanced computer science concepts",
  },
  {
    id: "aiml",
    name: "AI & Machine Learning",
    shortName: "AIML",
    icon: Brain,
    color: "from-red-500 to-red-700",
    description: "Artificial Intelligence and Machine Learning techniques",
  },
  {
    id: "ece",
    name: "Electronics & Communication",
    shortName: "ECE",
    icon: Zap,
    color: "from-red-700 to-red-800",
    description: "Electronics, circuits, and communication systems",
  },
  {
    id: "me",
    name: "Mechanical Engineering",
    shortName: "ME",
    icon: BookOpen,
    color: "from-red-600 to-red-800",
    description: "Mechanics, thermodynamics, and design principles",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 group">
              <div className="p-1.5 bg-gradient-to-br from-red-600 to-red-700 rounded-lg group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-foreground">
                Resource Base
              </h1>
            </div>
            <Link
              to="/about"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-foreground hover:bg-primary/10 transition-all hover:text-primary text-sm"
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold">About</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="mb-12 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
            Explore Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
              {" "}
              Course
            </span>
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
            Browse comprehensive study materials, lecture notes, and resources
            organized by semester and subject. Click on any course to get started.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-stagger">
          {courses.map((course, index) => {
            const IconComponent = course.icon;
            return (
              <Link
                key={course.id}
                to={`/course/${course.id}`}
                className="group cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-full bg-card rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-border hover:border-primary/50 card-hover p-4 flex flex-col">
                  {/* Logo/Icon Top-Left */}
                  <div className="mb-4">
                    <div
                      className={`p-2 bg-gradient-to-br ${course.color} rounded-lg logo-rotate transition-all w-fit`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="inline-block px-2 py-0.5 bg-primary/10 rounded-full mb-2 border border-primary/30 w-fit">
                    <span className="text-xs font-semibold text-primary">
                      {course.shortName}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-foreground mb-1 line-clamp-2">
                      {course.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                      {course.description}
                    </p>

                    {/* Arrow indicator */}
                    <div className="flex items-center text-primary font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Explore</span>
                      <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-8 bg-card rounded-xl border border-border hover:border-primary/50 transition-all text-center card-hover"
            >
              <div className="text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Additional Courses Placeholder */}
        <div className="mt-20 text-center animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <p className="text-muted-foreground text-sm">
            More courses coming soon. Check back regularly for updates!
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border mt-20 py-8 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>
            © 2024 Student Resource Base. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

const stats = [
  { value: "4", label: "Engineering Courses" },
  { value: "8", label: "Semesters per Course" },
  { value: "40+", label: "Learning Modules" },
];

export default Index;
