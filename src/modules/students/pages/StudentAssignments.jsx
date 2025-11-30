// StudentAssignments.jsx
import { useState, useEffect } from "react";
import {
  FileText,
  Calendar,
  Upload,
  CheckCircle,
  ArrowLeft,
  Clock,
  AlertCircle,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      setTimeout(() => {
        setAssignments([
          {
            id: 1,
            title: "Programming Assignment 1",
            course: "CS101 - Introduction to Programming",
            description: "Implement basic algorithms in Python",
            dueDate: "2024-02-15T23:59:00",
            totalMarks: 20,
            submittedMarks: 18,
            status: "submitted",
            submissionDate: "2024-02-14T15:30:00",
            file: "assignment1.py",
          },
          {
            id: 2,
            title: "Calculus Problem Set",
            course: "MATH202 - Calculus II",
            description: "Solve integration problems",
            dueDate: "2024-02-20T23:59:00",
            totalMarks: 15,
            submittedMarks: null,
            status: "pending",
            submissionDate: null,
            file: null,
          },
          {
            id: 3,
            title: "Physics Lab Report",
            course: "PHY101 - Physics Fundamentals",
            description: "Write lab report for experiment 3",
            dueDate: "2024-02-10T23:59:00",
            totalMarks: 25,
            submittedMarks: 22,
            status: "graded",
            submissionDate: "2024-02-09T14:20:00",
            file: "lab_report.pdf",
          },
          {
            id: 4,
            title: "Database Design",
            course: "CS201 - Database Systems",
            description: "Design ER diagram for library system",
            dueDate: "2024-02-25T23:59:00",
            totalMarks: 30,
            submittedMarks: null,
            status: "overdue",
            submissionDate: null,
            file: null,
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast.error("Failed to load assignments");
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };
  const handleFileUpload = (assignmentId) => {
    if (!selectedFile) {
      toast.warning("Please select a file to upload");
      return;
    }

    // Mock file upload
    toast.success("Assignment submitted successfully!");
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === assignmentId
          ? {
              ...assignment,
              status: "submitted",
              submissionDate: new Date().toISOString(),
              file: selectedFile.name,
            }
          : assignment
      )
    );
    setSelectedFile(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        class: "bg-warning",
        text: "Pending",
        icon: <Clock size={14} />,
      },
      submitted: {
        class: "bg-info",
        text: "Submitted",
        icon: <CheckCircle size={14} />,
      },
      graded: {
        class: "bg-success",
        text: "Graded",
        icon: <CheckCircle size={14} />,
      },
      overdue: {
        class: "bg-danger",
        text: "Overdue",
        icon: <AlertCircle size={14} />,
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

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysRemaining = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredAssignments = assignments.filter((assignment) => {
    if (filter === "all") return true;
    if (filter === "pending") return assignment.status === "pending";
    if (filter === "submitted") return assignment.status === "submitted";
    if (filter === "graded") return assignment.status === "graded";
    if (filter === "overdue") return assignment.status === "overdue";
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
          <span className="ms-3">Loading Assignments...</span>
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
                onClick={() => navigate(-1)}
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
              <h3 className="fw-bold text-dark">Assignments</h3>
              <p className="text-muted mb-0">
                Manage and submit your course assignments
              </p>
            </div>
            <div className="d-flex gap-2">
              <select
                className="form-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Assignments</option>
                <option value="pending">Pending</option>
                <option value="submitted">Submitted</option>
                <option value="graded">Graded</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header border-1">
              <h5 className="mb-0 fw-semibold">
                <FileText size={20} className="me-2" />
                Your Assignments
              </h5>
            </div>
            <div className="card-body">
              {filteredAssignments.map((assignment) => (
                <div key={assignment.id} className="card border mb-3">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-8">
                        <h6 className="card-title fw-semibold">
                          {assignment.title}
                        </h6>
                        <p className="text-muted small mb-2">
                          {assignment.course}
                        </p>
                        <p className="card-text">{assignment.description}</p>

                        <div className="d-flex flex-wrap gap-3 mb-3">
                          <div className="d-flex align-items-center">
                            <Calendar size={16} className="text-muted me-1" />
                            <small className="text-muted">
                              Due:{" "}
                              {new Date(
                                assignment.dueDate
                              ).toLocaleDateString()}
                            </small>
                          </div>
                          <div>
                            <small className="text-muted">
                              Marks: {assignment.totalMarks}
                            </small>
                          </div>
                          {assignment.submittedMarks && (
                            <div>
                              <small className="text-success fw-semibold">
                                Obtained: {assignment.submittedMarks}/
                                {assignment.totalMarks}
                              </small>
                            </div>
                          )}
                        </div>

                        {assignment.status === "pending" && (
                          <div className="alert alert-warning py-2">
                            <small>
                              <Clock size={14} className="me-1" />
                              {getDaysRemaining(assignment.dueDate) > 0
                                ? `${getDaysRemaining(
                                    assignment.dueDate
                                  )} days remaining`
                                : "Due date passed"}
                            </small>
                          </div>
                        )}
                      </div>

                      <div className="col-md-4">
                        <div className="d-flex flex-column h-100">
                          <div className="mb-3">
                            {getStatusBadge(assignment.status)}
                          </div>

                          {assignment.status === "pending" && (
                            <div>
                              <input
                                type="file"
                                className="form-control form-control-sm mb-2"
                                onChange={(e) =>
                                  setSelectedFile(e.target.files[0])
                                }
                              />
                              <button
                                className="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center"
                                onClick={() => handleFileUpload(assignment.id)}
                              >
                                <Upload size={14} className="me-1" />
                                Submit Assignment
                              </button>
                            </div>
                          )}

                          {assignment.status === "submitted" && (
                            <div>
                              <small className="text-muted d-block">
                                Submitted:{" "}
                                {new Date(
                                  assignment.submissionDate
                                ).toLocaleDateString()}
                              </small>
                              <small className="text-muted">
                                File: {assignment.file}
                              </small>
                            </div>
                          )}

                          {assignment.status === "graded" && (
                            <div>
                              <div className="alert alert-success py-2">
                                <small>
                                  <CheckCircle size={14} className="me-1" />
                                  Graded: {assignment.submittedMarks}/
                                  {assignment.totalMarks}
                                </small>
                              </div>
                              <small className="text-muted d-block">
                                Submitted:{" "}
                                {new Date(
                                  assignment.submissionDate
                                ).toLocaleDateString()}
                              </small>
                            </div>
                          )}

                          {assignment.status === "overdue" && (
                            <div className="alert alert-danger py-2">
                              <small>
                                <AlertCircle size={14} className="me-1" />
                                Assignment overdue
                              </small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredAssignments.length === 0 && (
                <div className="text-center py-4">
                  <FileText size={48} className="text-muted mb-2" />
                  <p className="text-muted">No assignments found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAssignments;
