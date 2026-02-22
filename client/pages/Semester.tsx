import { Link, useParams } from "react-router-dom";
import { Layers } from "lucide-react";

const courseData: Record<
  string,
  { name: string; color: string }
> = {
  cse: {
    name: "Computer Science Engineering",
    color: "from-red-600 to-red-700",
  },
  aiml: {
    name: "AI & Machine Learning",
    color: "from-red-500 to-red-700",
  },
  ece: {
    name: "Electronics & Communication",
    color: "from-red-700 to-red-800",
  },
  me: {
    name: "Mechanical Engineering",
    color: "from-red-600 to-red-800",
  },
};

const subjectsBySemester: Record<number, string[]> = {
  1: ["Mathematics-I", "Physics", "Chemistry", "Programming", "Engineering Drawing"],
  2: ["Mathematics-II", "Data Structures", "Web Development", "Digital Logic", "Workshop"],
  3: ["Database Systems", "Operating Systems", "Algorithms", "Networks", "Software Engineering"],
  4: ["Compiler Design", "Artificial Intelligence", "Cryptography", "Cloud Computing", "Web APIs"],
  5: ["Machine Learning", "Big Data Analytics", "Distributed Systems", "Computer Vision", "NLP"],
  6: ["Deep Learning", "Mobile App Dev", "Cybersecurity", "DevOps", "System Design"],
  7: ["Project Management", "Advanced ML", "IoT Systems", "Blockchain", "Capstone Project-I"],
  8: ["Capstone Project-II", "Professional Ethics", "Emerging Technologies", "Internship", "Research"],
};

const Semester = () => {
  const { courseId, semesterId } = useParams<{
    courseId: string;
    semesterId: string;
  }>();
  const course = courseId ? courseData[courseId] : null;
  const semesterNum = semesterId ? parseInt(semesterId, 10) : 0;
  const subjects = semesterNum ? subjectsBySemester[semesterNum] || [] : [];

  if (!course || !semesterNum || !subjects.length) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-muted-foreground">Semester not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Link
              to={`/course/${courseId}`}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-primary/10 transition-colors group"
              aria-label="Go back"
            >
              <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                Semester {semesterNum}
              </h1>
              <p className="text-muted-foreground text-xs">
                {subjects.length} subjects
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-foreground mb-2">
            Subjects
          </h2>
          <p className="text-muted-foreground">
            Choose a subject to view its learning modules
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-stagger">
          {subjects.map((subject, index) => (
            <Link
              key={subject}
              to={`/course/${courseId}/semester/${semesterNum}/subject/${encodeURIComponent(subject)}`}
              className="group cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-full bg-card rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-border hover:border-primary/50 card-hover p-4 flex flex-col">
                {/* Logo/Icon Top-Left */}
                <div className="mb-4">
                  <div
                    className={`p-2 bg-gradient-to-br ${course.color} rounded-lg logo-rotate transition-all w-fit`}
                  >
                    <Layers className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-foreground mb-1 line-clamp-2">
                    {subject}
                  </h3>
                  <p className="text-muted-foreground text-xs mb-3">
                    Comprehensive materials for learning
                  </p>

                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-4">
                    <span className="inline-flex w-1.5 h-1.5 bg-primary rounded-full"></span>
                    <span>5 modules + QB</span>
                  </div>

                  {/* Arrow indicator */}
                  <div className="flex items-center text-primary font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Learn</span>
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Semester;
