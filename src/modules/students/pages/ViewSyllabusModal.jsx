// ViewSyllabusModal.jsx
import { useState, useEffect } from "react";
import { X, Download, BookOpen, Clock, Calendar, FileText } from "lucide-react";

const ViewSyllabusModal = ({ exam, show, onClose }) => {
  const [syllabus, setSyllabus] = useState(null);

  useEffect(() => {
    if (exam && show) {
      // Mock syllabus data - replace with API call
      setSyllabus({
        course: exam.course,
        examTitle: exam.title,
        chapters: [
          {
            chapter: 1,
            title: "Introduction to Programming",
            topics: [
              "Programming Fundamentals",
              "Algorithms and Flowcharts",
              "Data Types and Variables",
              "Input/Output Operations"
            ],
            weightage: "20%"
          },
          {
            chapter: 2,
            title: "Control Structures",
            topics: [
              "Conditional Statements",
              "Loops and Iterations",
              "Switch Cases",
              "Nested Control Structures"
            ],
            weightage: "25%"
          },
          {
            chapter: 3,
            title: "Functions and Modules",
            topics: [
              "Function Definition and Calling",
              "Parameters and Return Values",
              "Scope of Variables",
              "Built-in Functions"
            ],
            weightage: "30%"
          },
          {
            chapter: 4,
            title: "Data Structures",
            topics: [
              "Arrays and Strings",
              "Lists and Tuples",
              "Dictionaries",
              "Basic File Handling"
            ],
            weightage: "25%"
          }
        ],
        referenceBooks: [
          "Introduction to Programming - John Doe",
          "Programming Fundamentals - Jane Smith",
          "Computer Science Basics - Robert Johnson"
        ],
        importantTopics: [
          "Function parameters and return types",
          "Loop control statements",
          "Array manipulation",
          "String operations"
        ],
        examPattern: {
          sectionA: { type: "Multiple Choice", questions: 20, marks: 20 },
          sectionB: { type: "Short Answer", questions: 5, marks: 25 },
          sectionC: { type: "Programming", questions: 3, marks: 35 },
          sectionD: { type: "Case Study", questions: 1, marks: 20 }
        }
      });
    }
  }, [exam, show]);

  const handleDownload = () => {
    // Mock download functionality
    toast.success("Syllabus downloaded successfully!");
  };

  if (!show || !syllabus) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">
              <BookOpen size={20} className="me-2" />
              Exam Syllabus - {exam.course}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* Course Header */}
            <div className="text-center mb-4">
              <h4 className="text-primary fw-bold">{syllabus.course}</h4>
              <h5 className="text-dark">{syllabus.examTitle}</h5>
              <p className="text-muted">Complete syllabus and exam pattern</p>
            </div>

            {/* Exam Pattern */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-info text-white">
                <h6 className="mb-0 fw-semibold">Exam Pattern</h6>
              </div>
              <div className="card-body">
                <div className="row">
                  {Object.entries(syllabus.examPattern).map(([section, details]) => (
                    <div key={section} className="col-md-3 mb-3">
                      <div className="card border-1">
                        <div className="card-body text-center">
                          <h5 className="text-primary">{details.marks}</h5>
                          <small className="text-muted d-block">Marks</small>
                          <strong>{section.toUpperCase()}</strong>
                          <small className="text-muted d-block">{details.type}</small>
                          <small>{details.questions} Questions</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Syllabus Chapters */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header">
                <h6 className="mb-0 fw-semibold">Syllabus Chapters</h6>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th width="10%">Chapter</th>
                        <th width="40%">Title</th>
                        <th width="40%">Topics</th>
                        <th width="10%">Weightage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {syllabus.chapters.map((chapter) => (
                        <tr key={chapter.chapter}>
                          <td className="fw-bold">Chapter {chapter.chapter}</td>
                          <td>{chapter.title}</td>
                          <td>
                            <ul className="mb-0 small">
                              {chapter.topics.map((topic, index) => (
                                <li key={index}>{topic}</li>
                              ))}
                            </ul>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-primary">{chapter.weightage}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Important Topics */}
            <div className="row">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-warning">
                    <h6 className="mb-0 fw-semibold">Important Topics</h6>
                  </div>
                  <div className="card-body">
                    <ul className="mb-0">
                      {syllabus.importantTopics.map((topic, index) => (
                        <li key={index} className="mb-1">
                          <FileText size={14} className="text-warning me-2" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-success text-white">
                    <h6 className="mb-0 fw-semibold">Reference Books</h6>
                  </div>
                  <div className="card-body">
                    <ul className="mb-0">
                      {syllabus.referenceBooks.map((book, index) => (
                        <li key={index} className="mb-1">
                          <BookOpen size={14} className="text-success me-2" />
                          {book}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-success d-flex align-items-center" onClick={handleDownload}>
              <Download size={16} className="me-2" />
              Download Syllabus
            </button>
            <button className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSyllabusModal;