import { Link, useParams } from "react-router-dom";
import { BookOpen } from "lucide-react";

const courseData: Record<
  string,
  { name: string; shortName: string; color: string }
> = {
  cse: {
    name: "Computer Science Engineering",
    shortName: "CSE",
    color: "from-red-600 to-red-700",
  },
  aiml: {
    name: "AI & Machine Learning",
    shortName: "AIML",
    color: "from-red-500 to-red-700",
  },
  ece: {
    name: "Electronics & Communication",
    shortName: "ECE",
    color: "from-red-700 to-red-800",
  },
  me: {
    name: "Mechanical Engineering",
    shortName: "ME",
    color: "from-red-600 to-red-800",
  },
};

const Course = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const course = courseId ? courseData[courseId] : null;

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-muted-foreground">Course not found</p>
        </div>
      </div>
    );
  }

  const semesters = Array.from({ length: 8 }, (_, i) => ({
    number: i + 1,
    subjects: Math.floor(Math.random() * 4) + 5,
  }));

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-primary/10 transition-colors group"
              aria-label="Go back"
            >
              <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            </Link>
            <div className="flex items-center gap-2">
              <div
                className={`p-1.5 bg-gradient-to-br ${course.color} rounded-lg`}
              >
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  {course.name}
                </h1>
                <p className="text-muted-foreground text-xs">
                  {semesters.length} semesters
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-foreground mb-2">
            Choose a Semester
          </h2>
          <p className="text-muted-foreground">
            Browse subjects and learning materials for each semester
          </p>
        </div>

        {/* Semesters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-stagger">
          {semesters.map((semester, index) => (
            <Link
              key={semester.number}
              to={`/course/${courseId}/semester/${semester.number}`}
              className="group cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-full bg-card rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-border hover:border-primary/50 card-hover p-4">
                {/* Logo/Icon Top-Left */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-2 bg-gradient-to-br ${course.color} rounded-lg logo-rotate transition-all`}
                  >
                    <div className="text-xl font-bold text-white">
                      {semester.number}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-1">
                    Semester {semester.number}
                  </h3>
                  <p className="text-muted-foreground text-xs mb-3">
                    Complete semester materials
                  </p>

                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-4">
                    <span className="inline-flex w-1.5 h-1.5 bg-primary rounded-full"></span>
                    <span>{semester.subjects} subjects</span>
                  </div>

                  {/* Arrow indicator */}
                  <div className="flex items-center text-primary font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Browse</span>
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
          {[
            { value: "8", label: "Semesters" },
            { value: semesters.reduce((acc, s) => acc + s.subjects, 0).toString(), label: "Total Subjects" },
            { value: "40+", label: "Learning Modules" },
          ].map((stat) => (
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
      </div>
    </div>
  );
};

export default Course;
