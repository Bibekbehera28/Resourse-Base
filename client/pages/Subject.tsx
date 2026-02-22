import { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { FileText, Download, ExternalLink } from "lucide-react";
import { PDFViewer } from "@/components/PDFViewer";
import { getCachedPdfUrl, setCachedPdfUrl } from "@/utils/pdfCache";

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

const Subject = () => {
  const { courseId, semesterId, subject } = useParams<{
    courseId: string;
    semesterId: string;
    subject: string;
  }>();
  const [selectedPdf, setSelectedPdf] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const course = courseId ? courseData[courseId] : null;
  const semesterNum = semesterId ? parseInt(semesterId, 10) : 0;
  const subjectName = subject ? decodeURIComponent(subject) : "";

  if (!course || !semesterNum || !subjectName) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-muted-foreground">Subject not found</p>
        </div>
      </div>
    );
  }

  // Format subject name for PDF path (replace spaces with underscores)
  const subjectForPath = subjectName.replace(/\s+/g, "_");
  const semesterForPath = `Semester${semesterNum}`;

  const modules = Array.from({ length: 5 }, (_, i) => ({
    number: i + 1,
    title: `${subjectName} - Module ${i + 1}`,
    pdfUrl: `https://github.com/Bibekbehera28/ResourceBase_Notes/raw/main/${courseId.toUpperCase()}/${semesterForPath}/${subjectForPath}/Module${i + 1}.pdf`,
  }));

  const questionBankModule = {
    number: "QB",
    title: `${subjectName} - Question Bank`,
    pdfUrl: `https://github.com/Bibekbehera28/ResourceBase_Notes/raw/main/${courseId.toUpperCase()}/${semesterForPath}/${subjectForPath}/QuestionBank.pdf`,
    isQuestionBank: true,
  };

  // Pre-fetch PDF on hover
  const prefetchPdf = (pdfUrl: string) => {
    // Check if already cached
    const proxyUrl = pdfUrl.includes("github.com") && pdfUrl.includes("/raw/")
      ? `/api/pdf-proxy?url=${encodeURIComponent(pdfUrl)}`
      : pdfUrl;
    
    if (getCachedPdfUrl(proxyUrl)) {
      return; // Already cached
    }

    // Start pre-fetching in background
    fetch(proxyUrl)
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
        return null;
      })
      .then((blob) => {
        if (blob && blob.size > 0) {
          const pdfBlob = blob.type === "application/pdf" 
            ? blob 
            : new Blob([blob], { type: "application/pdf" });
          const objectUrl = URL.createObjectURL(pdfBlob);
          setCachedPdfUrl(proxyUrl, objectUrl);
        }
      })
      .catch(() => {
        // Silently fail - will fetch on click
      });
  };

  const handlePdfView = (pdfUrl: string, title: string) => {
    setSelectedPdf({ url: pdfUrl, title });
  };

  const closePdfViewer = () => {
    setSelectedPdf(null);
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Link
              to={`/course/${courseId}/semester/${semesterNum}`}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-primary/10 transition-colors group"
              aria-label="Go back"
            >
              <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                {subjectName}
              </h1>
              <p className="text-muted-foreground text-xs">
                5 modules + QB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-foreground mb-2">
            Learning Modules
          </h2>
          <p className="text-muted-foreground">
            Download and open study materials for this subject
          </p>
        </div>

        {/* Info Box */}
        <div className="mb-8 bg-primary/10 border border-primary/30 rounded-lg p-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-sm text-primary">
            <strong>Repository:</strong> PDFs are hosted at{" "}
            <a
              href="https://github.com/Bibekbehera28/ResourceBase_Notes"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80"
            >
              Bibekbehera28/ResourceBase_Notes
            </a>
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-stagger">
          {modules.map((module, index) => (
            <div
              key={module.number}
              className="group cursor-pointer h-full animate-fade-in-up"
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              <div className="h-full bg-card rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-border hover:border-primary/50 card-hover p-4 flex flex-col">
                {/* Logo/Icon Top-Left */}
                <div className="mb-4">
                  <div
                    className={`p-2 bg-gradient-to-br ${course.color} rounded-lg logo-rotate transition-all w-fit`}
                  >
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-foreground mb-1 line-clamp-2">
                    Module {module.number}
                  </h3>
                  <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
                    Learning materials
                  </p>

                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-4">
                    <span className="inline-flex w-1.5 h-1.5 bg-primary rounded-full"></span>
                    <span>PDF</span>
                  </div>

                  {/* Buttons */}
                  <div className="mt-auto space-y-1.5">
                    <button
                      onMouseEnter={() => prefetchPdf(module.pdfUrl)}
                      onClick={() => handlePdfView(module.pdfUrl, module.title)}
                      className="w-full px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-1.5 group/btn hover:scale-105"
                    >
                      <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      Open
                    </button>
                    <a
                      href={module.pdfUrl}
                      download
                      className="w-full px-3 py-1.5 bg-card border border-border text-foreground rounded-lg text-sm font-semibold hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-1.5 group/btn"
                    >
                      <Download className="w-3.5 h-3.5 group-hover/btn:translate-y-1 transition-transform" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Question Bank Card */}
          <div
            key="question-bank"
            className="group cursor-pointer h-full animate-fade-in-up"
            style={{ animationDelay: `${6 * 0.1}s` }}
          >
            <div className="h-full bg-card rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-border hover:border-primary/50 card-hover p-4 flex flex-col">
              {/* Logo/Icon Top-Left - Different color for Question Bank */}
              <div className="mb-4">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg logo-rotate transition-all w-fit">
                  <FileText className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-sm font-bold text-foreground mb-1 line-clamp-2">
                  Question Bank
                </h3>
                <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
                  Practice questions & papers
                </p>

                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-4">
                  <span className="inline-flex w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                  <span>PDF</span>
                </div>

                {/* Buttons */}
                <div className="mt-auto space-y-1.5">
                  <button
                    onMouseEnter={() => prefetchPdf(questionBankModule.pdfUrl)}
                    onClick={() =>
                      handlePdfView(
                        questionBankModule.pdfUrl,
                        questionBankModule.title
                      )
                    }
                    className="w-full px-3 py-1.5 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-orange-600/30 transition-all flex items-center justify-center gap-1.5 group/btn hover:scale-105"
                  >
                    <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    Open
                  </button>
                  <a
                    href={questionBankModule.pdfUrl}
                    download
                    className="w-full px-3 py-1.5 bg-card border border-border text-foreground rounded-lg text-sm font-semibold hover:border-orange-600/50 hover:bg-orange-600/5 transition-all flex items-center justify-center gap-1.5 group/btn"
                  >
                    <Download className="w-3.5 h-3.5 group-hover/btn:translate-y-1 transition-transform" />
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Repository Info */}
        <div className="mt-20 bg-card rounded-xl p-8 border border-border animate-fade-in-up" style={{ animationDelay: "0.9s" }}>
          <h3 className="text-2xl font-bold text-foreground mb-4">
            GitHub Repository Structure
          </h3>
          <div className="space-y-4 text-muted-foreground">
            <p>
              PDFs are organized in the GitHub repository as:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>
                Repository:
                <a
                  href="https://github.com/Bibekbehera28/ResourceBase_Notes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline ml-2"
                >
                  Bibekbehera28/ResourceBase_Notes
                </a>
              </li>
              <li>
                Directory structure:
              </li>
              <li className="ml-8">
                <code className="bg-card/50 px-2 py-1 rounded text-sm border border-border">
                  /CSE/Semester1/Math/Module1.pdf
                </code>
              </li>
              <li>
                PDF format: <code className="bg-card/50 px-2 py-1 rounded text-sm border border-border">
                  /COURSE/SemesterX/SubjectName/ModuleY.pdf
                </code>
              </li>
              <li>
                All PDFs are accessible via raw GitHub links (raw.githubusercontent.com)
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <PDFViewer
          isOpen={true}
          pdfUrl={selectedPdf.url}
          title={selectedPdf.title}
          onClose={closePdfViewer}
        />
      )}
    </div>
  );
};

export default Subject;
