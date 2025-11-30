// StudentQuizzes.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Calendar,
  Clock,
  Play,
  CheckCircle,
  ArrowLeft,
  XCircle,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import QuizDetailsModal from "./QuizDetailsModal";
const StudentQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showQuizDetails, setShowQuizDetails] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      setTimeout(() => {
        const mockQuizzes = [
          {
            id: 1,
            title: "Python Basics Quiz",
            course: "CS101 - Introduction to Programming",
            description: "Test your knowledge of Python fundamentals",
            duration: 30, // minutes
            totalQuestions: 4,
            totalMarks: 20,
            obtainedMarks: 18,
            status: "available",
            attemptedDate: "2024-02-10T14:30:00",
            questions: [
              {
                id: 1,
                question:
                  "Which of the following is used to define a function in Python?",
                options: ["function", "def", "define", "func"],
                correctAnswer: 1,
              },
              {
                id: 2,
                question: "What is the output of print(2 ** 3)?",
                options: ["6", "8", "9", "23"],
                correctAnswer: 1,
              },
              {
                id: 3,
                question: "Which data type is mutable in Python?",
                options: ["tuple", "string", "list", "int"],
                correctAnswer: 2,
              },
              {
                id: 4,
                question: "How do you create a comment in Python?",
                options: [
                  "// comment",
                  "/* comment */",
                  "# comment",
                  "-- comment",
                ],
                correctAnswer: 2,
              },
            ],
          },
          {
            id: 2,
            title: "Calculus Fundamentals",
            course: "MATH202 - Calculus II",
            description: "Basic calculus concepts and problems",
            duration: 45,
            totalQuestions: 4,
            totalMarks: 30,
            obtainedMarks: null,
            status: "completed",
            availableFrom: "2024-02-15T00:00:00",
            availableUntil: "2024-02-20T23:59:00",
            questions: [
              {
                id: 1,
                question: "What is the derivative of x²?",
                options: ["x", "2x", "2", "x²"],
                correctAnswer: 1,
              },
              {
                id: 2,
                question: "What is the integral of 2x?",
                options: ["x²", "x² + C", "2x²", "x"],
                correctAnswer: 1,
              },
              {
                id: 3,
                question: "What is the limit of 1/x as x approaches infinity?",
                options: ["0", "1", "Infinity", "Undefined"],
                correctAnswer: 0,
              },
              {
                id: 4,
                question: "What is the derivative of sin(x)?",
                options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
                correctAnswer: 0,
              },
            ],
          },
          {
            id: 3,
            title: "Physics Mechanics",
            course: "PHY101 - Physics Fundamentals",
            description: "Newton's laws and basic mechanics",
            duration: 60,
            totalQuestions: 4,
            totalMarks: 40,
            obtainedMarks: null,
            status: "upcoming",
            availableFrom: "2024-02-25T00:00:00",
            questions: [
              {
                id: 1,
                question: "What is Newton's First Law?",
                options: [
                  "F = ma",
                  "An object at rest stays at rest",
                  "For every action, there is an equal and opposite reaction",
                  "Energy cannot be created or destroyed",
                ],
                correctAnswer: 1,
              },
              {
                id: 2,
                question: "What is the formula for kinetic energy?",
                options: ["½mv²", "mgh", "Fd", "ma"],
                correctAnswer: 0,
              },
              {
                id: 3,
                question: "What is the unit of force?",
                options: ["Joule", "Watt", "Newton", "Pascal"],
                correctAnswer: 2,
              },
              {
                id: 4,
                question: "What is acceleration due to gravity on Earth?",
                options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "11 m/s²"],
                correctAnswer: 0,
              },
            ],
          },
        ];

        // Validate all quizzes have questions
        mockQuizzes.forEach((quiz) => {
          if (
            !quiz.questions ||
            !Array.isArray(quiz.questions) ||
            quiz.questions.length === 0
          ) {
            console.warn(`Quiz ${quiz.id} has invalid questions array`);
          }
        });

        setQuizzes(mockQuizzes);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      toast.error("Failed to load quizzes");
      setLoading(false);
    }
  };
  const handleViewDetails = (quiz) => {
    setSelectedQuiz(quiz);
    setShowQuizDetails(true);
  };
  const startQuiz = (quiz) => {
    // Validate quiz data before starting
    if (
      !quiz ||
      !quiz.questions ||
      !Array.isArray(quiz.questions) ||
      quiz.questions.length === 0
    ) {
      toast.error("Quiz questions are not available. Please try another quiz.");
      return;
    }

    console.log("Starting quiz:", quiz); // Debug log

    setActiveQuiz(quiz);
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(quiz.duration * 60); // Convert to seconds

    console.log("Quiz started with questions:", quiz.questions); // Debug log
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const nextQuestion = () => {
    if (
      activeQuiz &&
      activeQuiz.questions &&
      currentQuestion < activeQuiz.questions.length - 1
    ) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleBack = () => {
    if (quizStarted) {
      // If quiz is in progress, confirm before going back
      if (
        window.confirm(
          "Are you sure you want to leave? Your progress will be lost."
        )
      ) {
        setQuizStarted(false);
        setActiveQuiz(null);
        setCurrentQuestion(0);
        setAnswers({});
      }
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  const submitQuiz = () => {
    if (!activeQuiz || !activeQuiz.questions) {
      toast.error("Cannot submit quiz: Questions not available");
      setQuizStarted(false);
      setActiveQuiz(null);
      return;
    }

    // Calculate score
    let score = 0;
    activeQuiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        score++;
      }
    });

    const obtainedMarks = Math.round(
      (score / activeQuiz.questions.length) * activeQuiz.totalMarks
    );

    toast.success(
      `Quiz submitted! Score: ${obtainedMarks}/${activeQuiz.totalMarks}`
    );
    setQuizStarted(false);
    setActiveQuiz(null);
    setCurrentQuestion(0);
    setAnswers({});

    // Update quiz status
    setQuizzes((prev) =>
      prev.map((quiz) =>
        quiz.id === activeQuiz.id
          ? {
              ...quiz,
              status: "completed",
              obtainedMarks,
              attemptedDate: new Date().toISOString(),
            }
          : quiz
      )
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        class: "bg-success",
        text: "Completed",
        icon: <CheckCircle size={14} />,
      },
      available: {
        class: "bg-primary",
        text: "Available",
        icon: <Play size={14} />,
      },
      upcoming: {
        class: "bg-warning",
        text: "Upcoming",
        icon: <Clock size={14} />,
      },
    };

    const config = statusConfig[status] || {
      class: "bg-secondary",
      text: status,
      icon: null,
    };
    return (
      <span className={`badge ${config.class} d-flex align-items-center`}>
        {config.icon && <span className="me-1">{config.icon}</span>}
        {config.text}
      </span>
    );
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    if (filter === "all") return true;
    return quiz.status === filter;
  });

  // Timer effect
  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quizStarted) {
      submitQuiz();
      toast.info("Time's up! Quiz submitted automatically.");
    }
  }, [quizStarted, timeLeft]);

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-3">Loading Quizzes...</span>
        </div>
      </div>
    );
  }

  // Quiz Interface - Moved outside the main return for better organization
  const renderQuizInterface = () => {
    // Safety checks for active quiz
    if (!activeQuiz) {
      return (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center">
            <XCircle size={48} className="text-danger mb-3" />
            <h5>Quiz Not Found</h5>
            <p className="text-muted">The selected quiz is not available.</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setQuizStarted(false);
                setActiveQuiz(null);
              }}
            >
              Return to Quizzes
            </button>
          </div>
        </div>
      );
    }

    // Safety checks for questions
    if (
      !activeQuiz.questions ||
      !Array.isArray(activeQuiz.questions) ||
      activeQuiz.questions.length === 0
    ) {
      return (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center">
            <XCircle size={48} className="text-danger mb-3" />
            <h5>Questions Not Available</h5>
            <p className="text-muted">
              This quiz doesn't have any questions available.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setQuizStarted(false);
                setActiveQuiz(null);
              }}
            >
              Return to Quizzes
            </button>
          </div>
        </div>
      );
    }

    // Safety check for current question
    if (currentQuestion >= activeQuiz.questions.length) {
      setCurrentQuestion(0); // Reset to first question if out of bounds
      return null;
    }

    const currentQ = activeQuiz.questions[currentQuestion];

    // Final safety check for current question
    if (!currentQ) {
      return (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center">
            <XCircle size={48} className="text-danger mb-3" />
            <h5>Question Error</h5>
            <p className="text-muted">
              There was an error loading this question.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setQuizStarted(false);
                setActiveQuiz(null);
              }}
            >
              Return to Quizzes
            </button>
          </div>
        </div>
      );
    }

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    return (
      <div className="card border-0 shadow-sm">
        <div className="card-header border-1 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-secondary btn-sm me-3 d-flex align-items-center"
              onClick={handleBack}
            >
              <ArrowLeft size={16} className="me-1" />
              Back
            </button>
            <div>
              <h5 className="mb-0 fw-semibold">{activeQuiz.title}</h5>
              <small className="text-muted">{activeQuiz.course}</small>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <Clock size={20} className="text-warning me-2" />
            <h5 className="mb-0 text-warning">{formatTime(timeLeft)}</h5>
          </div>
        </div>

        <div className="card-body">
          {/* Progress */}
          <div className="mb-4">
            <div className="d-flex justify-content-between mb-2">
              <small>
                Question {currentQuestion + 1} of {activeQuiz.questions.length}
              </small>
              <small>
                {Math.round(
                  ((currentQuestion + 1) / activeQuiz.questions.length) * 100
                )}
                %
              </small>
            </div>
            <div className="progress" style={{ height: "8px" }}>
              <div
                className="progress-bar"
                style={{
                  width: `${
                    ((currentQuestion + 1) / activeQuiz.questions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="card mb-4">
            <div className="card-body">
              <h6 className="card-title">Question {currentQuestion + 1}</h6>
              <p className="card-text">{currentQ.question}</p>

              <div className="mt-3">
                {currentQ.options.map((option, index) => (
                  <div key={index} className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`question-${currentQ.id}`}
                      id={`option-${index}`}
                      checked={answers[currentQ.id] === index}
                      onChange={() => handleAnswerSelect(currentQ.id, index)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`option-${index}`}
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-outline-secondary"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </button>

            {currentQuestion === activeQuiz.questions.length - 1 ? (
              <button className="btn btn-success" onClick={submitQuiz}>
                Submit Quiz
              </button>
            ) : (
              <button className="btn btn-primary" onClick={nextQuestion}>
                Next Question
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (quizStarted) {
    return (
      <div className="container-fluid mt-4">
        <ToastContainer position="top-right" autoClose={3000} />
        {renderQuizInterface()}
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header with Back Button */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-secondary btn-sm me-3 d-flex align-items-center"
                onClick={handleBack}
              >
                <ArrowLeft size={16} className="me-1" />
                Back
              </button>
              <div>
                <h3 className="fw-bold text-dark mb-0">Quizzes</h3>
                <p className="text-muted mb-0">
                  Test your knowledge with online quizzes
                </p>
              </div>
            </div>
            <div className="d-flex gap-2">
              <select
                className="form-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Quizzes</option>
                <option value="completed">Completed</option>
                <option value="available">Available</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Quizzes List */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header border-1">
              <h5 className="mb-0 fw-semibold">
                <Award size={20} className="me-2" />
                Available Quizzes
              </h5>
            </div>
            <div className="card-body">
              {filteredQuizzes.map((quiz) => (
                <div key={quiz.id} className="card border mb-3">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-8">
                        <h6 className="card-title fw-semibold">{quiz.title}</h6>
                        <p className="text-muted small mb-2">{quiz.course}</p>
                        <p className="card-text">{quiz.description}</p>

                        <div className="d-flex flex-wrap gap-3 mb-3">
                          <div className="d-flex align-items-center">
                            <Clock size={16} className="text-muted me-1" />
                            <small className="text-muted">
                              Duration: {quiz.duration} minutes
                            </small>
                          </div>
                          <div>
                            <small className="text-muted">
                              Questions: {quiz.totalQuestions}
                            </small>
                          </div>
                          <div>
                            <small className="text-muted">
                              Marks: {quiz.totalMarks}
                            </small>
                          </div>
                          {quiz.obtainedMarks && (
                            <div>
                              <small className="text-success fw-semibold">
                                Score: {quiz.obtainedMarks}/{quiz.totalMarks}
                              </small>
                            </div>
                          )}
                        </div>

                        {quiz.status === "completed" && (
                          <div className="alert alert-success py-2">
                            <small>
                              <CheckCircle size={14} className="me-1" />
                              Completed on{" "}
                              {new Date(
                                quiz.attemptedDate
                              ).toLocaleDateString()}
                            </small>
                          </div>
                        )}

                        {quiz.status === "available" && (
                          <div className="alert alert-primary py-2">
                            <small>
                              <Calendar size={14} className="me-1" />
                              Available until{" "}
                              {new Date(
                                quiz.availableUntil
                              ).toLocaleDateString()}
                            </small>
                          </div>
                        )}

                        {quiz.status === "upcoming" && (
                          <div className="alert alert-warning py-2">
                            <small>
                              <Clock size={14} className="me-1" />
                              Available from{" "}
                              {new Date(
                                quiz.availableFrom
                              ).toLocaleDateString()}
                            </small>
                          </div>
                        )}
                      </div>

                      <div className="col-md-4">
                        <div className="d-flex flex-column h-100 justify-content-between">
                          <div className="mb-3">
                            {getStatusBadge(quiz.status)}
                          </div>

                          {quiz.status === "available" && (
                            <button
                              className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                              onClick={() => startQuiz(quiz)}
                              disabled={
                                !quiz.questions || quiz.questions.length === 0
                              }
                            >
                              <Play size={16} className="me-2" />
                              Start Quiz
                            </button>
                          )}

                          {quiz.status === "completed" && (
                            <div>
                              <div className="text-center mb-2">
                                <div className="fw-bold text-success fs-4">
                                  {quiz.obtainedMarks}/{quiz.totalMarks}
                                </div>
                                <small className="text-muted">
                                  Final Score
                                </small>
                              </div>
                              <button
                                className="btn btn-outline-secondary w-100"
                                onClick={() => handleViewDetails(quiz)}
                              >
                                View Details
                              </button>
                            </div>
                          )}

                          {quiz.status === "upcoming" && (
                            <button
                              className="btn btn-outline-secondary w-100"
                              disabled
                            >
                              Coming Soon
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredQuizzes.length === 0 && (
                <div className="text-center py-4">
                  <Award size={48} className="text-muted mb-2" />
                  <p className="text-muted">No quizzes found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <QuizDetailsModal
        quiz={selectedQuiz}
        show={showQuizDetails}
        onClose={() => setShowQuizDetails(false)}
      />
    </div>
  );
};

export default StudentQuizzes;
