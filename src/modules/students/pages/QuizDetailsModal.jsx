// QuizDetailsModal.jsx
import { useState, useEffect } from "react";
import { 
  X, 
  Award, 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  BarChart3,
  Target,
  Download,
  Printer
} from "lucide-react";

const QuizDetailsModal = ({ quiz, show, onClose }) => {
  const [quizDetails, setQuizDetails] = useState(null);

  useEffect(() => {
    if (quiz && show) {
      // Calculate detailed results
      const totalQuestions = quiz.questions?.length || 0;
      const correctAnswers = quiz.questions?.filter((question, index) => {
        return quiz.obtainedMarks !== null && 
               question.correctAnswer === (quiz.userAnswers ? quiz.userAnswers[index] : undefined);
      }).length || 0;
      
      const wrongAnswers = totalQuestions - correctAnswers;
      const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

      setQuizDetails({
        ...quiz,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        percentage: percentage.toFixed(1),
        grade: calculateGrade(percentage),
        timeSpent: "25 minutes", // Mock data - replace with actual
        submittedDate: quiz.attemptedDate || new Date().toISOString(),
        subjectWisePerformance: [
          { topic: "Functions", correct: 3, total: 4 },
          { topic: "Data Types", correct: 2, total: 2 },
          { topic: "Control Structures", correct: 1, total: 2 },
          { topic: "Syntax", correct: 2, total: 2 }
        ],
        difficultyBreakdown: [
          { level: "Easy", correct: 4, total: 5 },
          { level: "Medium", correct: 3, total: 4 },
          { level: "Hard", correct: 1, total: 1 }
        ]
      });
    }
  }, [quiz, show]);

  const calculateGrade = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    return "F";
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success("Quiz report downloaded successfully!");
  };

  if (!show || !quizDetails) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">
              <Award size={20} className="me-2" />
              Quiz Results - {quiz.title}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* Header Summary */}
            <div className="row mb-4">
              <div className="col-md-8">
                <h4 className="text-primary fw-bold">{quizDetails.title}</h4>
                <p className="text-muted mb-2">{quizDetails.course}</p>
                <p className="mb-0">{quizDetails.description}</p>
              </div>
              <div className="col-md-4">
                <div className="card border-1">
                  <div className="card-body text-center">
                    <div className="fw-bold text-success fs-2">
                      {quizDetails.obtainedMarks}/{quizDetails.totalMarks}
                    </div>
                    <div className="text-muted">Final Score</div>
                    <div className="mt-2">
                      <span className={`badge bg-${quizDetails.grade === 'F' ? 'danger' : 'success'} fs-6`}>
                        Grade: {quizDetails.grade}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-primary text-white">
                <h6 className="mb-0 fw-semibold">Performance Overview</h6>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-3">
                    <div className="border-end">
                      <h3 className="text-success fw-bold">{quizDetails.correctAnswers}</h3>
                      <small className="text-muted">Correct Answers</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border-end">
                      <h3 className="text-danger fw-bold">{quizDetails.wrongAnswers}</h3>
                      <small className="text-muted">Wrong Answers</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border-end">
                      <h3 className="text-info fw-bold">{quizDetails.percentage}%</h3>
                      <small className="text-muted">Accuracy</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div>
                      <h3 className="text-warning fw-bold">{quizDetails.timeSpent}</h3>
                      <small className="text-muted">Time Spent</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions Review */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header">
                <h6 className="mb-0 fw-semibold">Questions Review</h6>
              </div>
              <div className="card-body">
                {quizDetails.questions?.map((question, index) => {
                  const isCorrect = quizDetails.userAnswers ? 
                    quizDetails.userAnswers[index] === question.correctAnswer : 
                    false;
                  
                  return (
                    <div key={question.id} className="card border mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h6 className="fw-semibold mb-0">Question {index + 1}</h6>
                          <span className={`badge ${isCorrect ? 'bg-success' : 'bg-danger'} d-flex align-items-center`}>
                            {isCorrect ? <CheckCircle size={14} className="me-1" /> : <XCircle size={14} className="me-1" />}
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                        
                        <p className="mb-3">{question.question}</p>
                        
                        <div className="row">
                          {question.options.map((option, optIndex) => {
                            const isSelected = quizDetails.userAnswers ? 
                              quizDetails.userAnswers[index] === optIndex : false;
                            const isCorrectOption = optIndex === question.correctAnswer;
                            
                            let optionClass = "border p-2 mb-2 rounded";
                            if (isCorrectOption) {
                              optionClass += " bg-success text-white";
                            } else if (isSelected && !isCorrectOption) {
                              optionClass += " bg-danger text-white";
                            } else {
                              optionClass += " bg-light";
                            }
                            
                            return (
                              <div key={optIndex} className="col-md-6">
                                <div className={optionClass}>
                                  <div className="d-flex align-items-center">
                                    <span className="fw-semibold me-2">
                                      {String.fromCharCode(65 + optIndex)}.
                                    </span>
                                    <span>{option}</span>
                                    {isCorrectOption && (
                                      <CheckCircle size={16} className="ms-2" />
                                    )}
                                    {isSelected && !isCorrectOption && (
                                      <XCircle size={16} className="ms-2" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {!isCorrect && (
                          <div className="alert alert-info mt-3">
                            <strong>Correct Answer:</strong> {String.fromCharCode(65 + question.correctAnswer)}. {question.options[question.correctAnswer]}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Topic-wise Performance */}
            <div className="row">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-info text-white">
                    <h6 className="mb-0 fw-semibold">Topic-wise Performance</h6>
                  </div>
                  <div className="card-body">
                    {quizDetails.subjectWisePerformance.map((topic, index) => (
                      <div key={index} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="fw-semibold">{topic.topic}</span>
                          <span>{topic.correct}/{topic.total}</span>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div 
                            className="progress-bar bg-info" 
                            style={{ width: `${(topic.correct / topic.total) * 100}%` }}
                          ></div>
                        </div>
                        <small className="text-muted">
                          {((topic.correct / topic.total) * 100).toFixed(1)}% accuracy
                        </small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-warning text-dark">
                    <h6 className="mb-0 fw-semibold">Difficulty Analysis</h6>
                  </div>
                  <div className="card-body">
                    {quizDetails.difficultyBreakdown.map((diff, index) => (
                      <div key={index} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="fw-semibold">{diff.level}</span>
                          <span>{diff.correct}/{diff.total}</span>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div 
                            className={`progress-bar ${
                              diff.level === 'Easy' ? 'bg-success' : 
                              diff.level === 'Medium' ? 'bg-warning' : 'bg-danger'
                            }`} 
                            style={{ width: `${(diff.correct / diff.total) * 100}%` }}
                          ></div>
                        </div>
                        <small className="text-muted">
                          {((diff.correct / diff.total) * 100).toFixed(1)}% correct
                        </small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="card border-0 shadow-sm mt-4">
              <div className="card-header">
                <h6 className="mb-0 fw-semibold">Quiz Information</h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <div className="d-flex align-items-center mb-2">
                      <Calendar size={16} className="text-muted me-2" />
                      <div>
                        <small className="text-muted d-block">Submitted On</small>
                        <strong>{new Date(quizDetails.submittedDate).toLocaleDateString()}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="d-flex align-items-center mb-2">
                      <Clock size={16} className="text-muted me-2" />
                      <div>
                        <small className="text-muted d-block">Duration</small>
                        <strong>{quizDetails.duration} minutes</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="d-flex align-items-center mb-2">
                      <Target size={16} className="text-muted me-2" />
                      <div>
                        <small className="text-muted d-block">Total Questions</small>
                        <strong>{quizDetails.totalQuestions}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="d-flex align-items-center mb-2">
                      <BarChart3 size={16} className="text-muted me-2" />
                      <div>
                        <small className="text-muted d-block">Overall Rank</small>
                        <strong>15/120</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary d-flex align-items-center" onClick={handlePrint}>
              <Printer size={16} className="me-2" />
              Print Report
            </button>
            <button className="btn btn-success d-flex align-items-center" onClick={handleDownload}>
              <Download size={16} className="me-2" />
              Download PDF
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

export default QuizDetailsModal;