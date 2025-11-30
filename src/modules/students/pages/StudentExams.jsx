// StudentExams.jsx
import { useState, useEffect } from "react";
import {
  BookOpen,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import ViewResultModal from "./ViewResultModal";
import HallTicketModal from "./HallTicketModal";
import ViewSyllabusModal from "./ViewSyllabusModal";

const StudentExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming");
  const [selectedExam, setSelectedExam] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showHallTicketModal, setShowHallTicketModal] = useState(false);
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  const handleViewResult = (exam) => {
    setSelectedExam(exam);
    setShowResultModal(true);
  };

  const handleViewHallTicket = (exam) => {
    setSelectedExam(exam);
    setShowHallTicketModal(true);
  };

  const handleViewSyllabus = (exam) => {
    setSelectedExam(exam);
    setShowSyllabusModal(true);
  };

  const fetchExams = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      setTimeout(() => {
        setExams([
          {
            id: 1,
            title: "Midterm Examination",
            course: "CS101 - Introduction to Programming",
            type: "midterm",
            date: "2025-12-15T09:00:00",
            duration: 180, // minutes
            totalMarks: 100,
            obtainedMarks: 85,
            venue: "Room 301, Main Building",
            status: "completed",
            instructions:
              "Bring your student ID and calculator. No electronic devices allowed.",
          },
          {
            id: 2,
            title: "Final Examination",
            course: "MATH202 - Calculus II",
            type: "final",
            date: "2026-03-20T14:00:00",
            duration: 120,
            totalMarks: 80,
            obtainedMarks: null,
            venue: "Room 205, Science Block",
            status: "upcoming",
            instructions:
              "Formula sheet will be provided. Scientific calculators required.",
          },
          {
            id: 3,
            title: "Physics Practical Exam",
            course: "PHY101 - Physics Fundamentals",
            type: "practical",
            date: "2026-02-25T10:00:00",
            duration: 90,
            totalMarks: 50,
            obtainedMarks: null,
            venue: "Physics Lab 1",
            status: "upcoming",
            instructions: "Lab coat mandatory. Bring your lab manual.",
          },
          {
            id: 4,
            title: "Database Systems Quiz",
            course: "CS201 - Database Systems",
            type: "quiz",
            date: "2025-02-28T11:00:00",
            duration: 60,
            totalMarks: 30,
            obtainedMarks: 27,
            venue: "Computer Lab 3",
            status: "completed",
            instructions:
              "Online quiz through LMS. Stable internet connection required.",
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching exams:", error);
      toast.error("Failed to load exams");
      setLoading(false);
    }
  };
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };
  const getStatusBadge = (status, date) => {
    const now = new Date();
    const examDate = new Date(date);

    if (status === "completed") {
      return (
        <span className="badge bg-success d-flex align-items-center">
          <CheckCircle size={14} className="me-1" />
          Completed
        </span>
      );
    }

    if (examDate < now) {
      return <span className="badge bg-secondary">Past</span>;
    }

    const daysUntil = Math.ceil((examDate - now) / (1000 * 60 * 60 * 24));

    if (daysUntil <= 7) {
      return (
        <span className="badge bg-warning d-flex align-items-center">
          <AlertCircle size={14} className="me-1" />
          Soon ({daysUntil}d)
        </span>
      );
    }

    return <span className="badge bg-primary">Upcoming</span>;
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      midterm: { class: "bg-info", text: "Midterm" },
      final: { class: "bg-danger", text: "Final" },
      practical: { class: "bg-warning", text: "Practical" },
      quiz: { class: "bg-success", text: "Quiz" },
    };

    const config = typeConfig[type] || { class: "bg-secondary", text: type };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getDaysUntil = (date) => {
    const now = new Date();
    const examDate = new Date(date);
    const diffTime = examDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredExams = exams.filter((exam) => {
    if (filter === "all") return true;
    if (filter === "upcoming")
      return exam.status === "upcoming" || new Date(exam.date) > new Date();
    if (filter === "completed") return exam.status === "completed";
    return true;
  });

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
          <span className="ms-3">Loading Exams...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      {/*Back Button */}
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
            </div>
          </div>
        </div>
      </div>
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="fw-bold text-dark">Exams</h3>
              <p className="text-muted mb-0">
                View your exam schedule and results
              </p>
            </div>
            <div className="d-flex gap-2">
              <select
                className="form-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="upcoming">Upcoming Exams</option>
                <option value="completed">Completed Exams</option>
                <option value="all">All Exams</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Exams List */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header border-1">
              <h5 className="mb-0 fw-semibold">
                <BookOpen size={20} className="me-2" />
                Exam Schedule
              </h5>
            </div>
            <div className="card-body">
              {filteredExams.map((exam) => (
                <div key={exam.id} className="card border mb-3">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-8">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="card-title fw-semibold mb-0">
                            {exam.title}
                          </h6>
                          <div className="d-flex gap-2">
                            {getTypeBadge(exam.type)}
                            {getStatusBadge(exam.status, exam.date)}
                          </div>
                        </div>

                        <p className="text-muted small mb-3">{exam.course}</p>

                        <div className="row mb-3">
                          <div className="col-sm-6">
                            <div className="d-flex align-items-center mb-2">
                              <Calendar size={16} className="text-muted me-2" />
                              <div>
                                <small className="text-muted d-block">
                                  Date & Time
                                </small>
                                <small className="fw-semibold">
                                  {new Date(exam.date).toLocaleDateString()} at{" "}
                                  {new Date(exam.date).toLocaleTimeString()}
                                </small>
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-6">
                            <div className="d-flex align-items-center mb-2">
                              <Clock size={16} className="text-muted me-2" />
                              <div>
                                <small className="text-muted d-block">
                                  Duration
                                </small>
                                <small className="fw-semibold">
                                  {exam.duration} minutes
                                </small>
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-6">
                            <div className="d-flex align-items-center mb-2">
                              <MapPin size={16} className="text-muted me-2" />
                              <div>
                                <small className="text-muted d-block">
                                  Venue
                                </small>
                                <small className="fw-semibold">
                                  {exam.venue}
                                </small>
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-6">
                            <div className="d-flex align-items-center mb-2">
                              <BookOpen size={16} className="text-muted me-2" />
                              <div>
                                <small className="text-muted d-block">
                                  Total Marks
                                </small>
                                <small className="fw-semibold">
                                  {exam.totalMarks}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>

                        {exam.instructions && (
                          <div className="alert alert-info">
                            <small>
                              <strong>Instructions:</strong> {exam.instructions}
                            </small>
                          </div>
                        )}

                        {exam.status === "upcoming" &&
                          getDaysUntil(exam.date) > 0 && (
                            <div className="alert alert-warning">
                              <small>
                                <Clock size={14} className="me-1" />
                                <strong>
                                  {getDaysUntil(exam.date)} days
                                </strong>{" "}
                                until exam
                              </small>
                            </div>
                          )}
                      </div>

                      <div className="col-md-4">
                        <div className="d-flex flex-column h-100 justify-content-between">
                          {exam.obtainedMarks !== null ? (
                            <div className="text-center mb-3">
                              <div className="fw-bold text-success fs-3">
                                {exam.obtainedMarks}/{exam.totalMarks}
                              </div>
                              <small className="text-muted">
                                Obtained Marks
                              </small>
                              <div className="mt-2">
                                <small className="text-muted">
                                  Percentage:{" "}
                                  {(
                                    (exam.obtainedMarks / exam.totalMarks) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </small>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center mb-3">
                              <div className="fw-bold text-primary fs-3">
                                {getDaysUntil(exam.date)}d
                              </div>
                              <small className="text-muted">
                                Days Remaining
                              </small>
                            </div>
                          )}

                          <div className="d-grid gap-2">
                            {exam.status === "upcoming" && (
                              <>
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleViewSyllabus(exam)}
                                >
                                  View Syllabus
                                </button>
                                <button className="btn btn-outline-secondary btn-sm">
                                  Add to Calendar
                                </button>
                              </>
                            )}

                            {exam.status === "completed" && (
                              <>
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => handleViewResult(exam)}
                                >
                                  View Result
                                </button>
                                <button
                                  className="btn btn-outline-info btn-sm"
                                  onClick={() => handleViewHallTicket(exam)}
                                >
                                  Download Hall Ticket
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredExams.length === 0 && (
                <div className="text-center py-4">
                  <BookOpen size={48} className="text-muted mb-2" />
                  <p className="text-muted">No exams found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Exams Summary */}
      {filter === "upcoming" && filteredExams.length > 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header border-1">
                <h6 className="mb-0 fw-semibold">Upcoming Exams Summary</h6>
              </div>
              <div className="card-body">
                <div className="row">
                  {filteredExams.slice(0, 3).map((exam) => (
                    <div key={exam.id} className="col-md-4 mb-3">
                      <div className="card border-1">
                        <div className="card-body text-center">
                          <h5 className="text-primary">
                            {getDaysUntil(exam.date)}
                          </h5>
                          <small className="text-muted d-block">
                            days until
                          </small>
                          <strong>{exam.title}</strong>
                          <small className="text-muted d-block">
                            {exam.course}
                          </small>
                          <small className="text-muted">
                            {new Date(exam.date).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ViewResultModal
        exam={selectedExam}
        show={showResultModal}
        onClose={() => setShowResultModal(false)}
      />

      <HallTicketModal
        exam={selectedExam}
        show={showHallTicketModal}
        onClose={() => setShowHallTicketModal(false)}
      />

      <ViewSyllabusModal
        exam={selectedExam}
        show={showSyllabusModal}
        onClose={() => setShowSyllabusModal(false)}
      />
    </div>
  );
};

export default StudentExams;
