// ViewResultModal.jsx
import { useState, useEffect } from "react";
import { X, Download, Printer, CheckCircle, XCircle, Award } from "lucide-react";

const ViewResultModal = ({ exam, show, onClose }) => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (exam && show) {
      // Mock result data - replace with API call
      setResult({
        id: exam.id,
        studentName: "Aditya Pawase",
        studentId: "PRN123",
        examTitle: exam.title,
        course: exam.course,
        examDate: exam.date,
        totalMarks: exam.totalMarks,
        obtainedMarks: exam.obtainedMarks,
        percentage: ((exam.obtainedMarks / exam.totalMarks) * 100).toFixed(1),
        grade: calculateGrade((exam.obtainedMarks / exam.totalMarks) * 100),
        subjectWiseMarks: [
          { subject: "Theory", maxMarks: 70, obtainedMarks: 60 },
          { subject: "Practical", maxMarks: 30, obtainedMarks: 25 }
        ],
        rank: 15,
        totalStudents: 120,
        remarks: "Excellent performance. Keep it up!",
        publishedDate: "2025-12-20"
      });
    }
  }, [exam, show]);

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
    // Mock download functionality
    toast.success("Result downloaded successfully!");
  };

  if (!show || !result) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">Exam Result</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* Result Header */}
            <div className="text-center mb-4">
              <Award size={48} className="text-success mb-2" />
              <h4 className="text-success fw-bold">Congratulations!</h4>
              <p className="text-muted">You have successfully completed the examination</p>
            </div>

            {/* Student Info */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card border-1">
                  <div className="card-body">
                    <h6 className="fw-semibold">Student Information</h6>
                    <div className="small">
                      <div><strong>Name:</strong> {result.studentName}</div>
                      <div><strong>Student ID:</strong> {result.studentId}</div>
                      <div><strong>Course:</strong> {result.course}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card border-1">
                  <div className="card-body">
                    <h6 className="fw-semibold">Exam Information</h6>
                    <div className="small">
                      <div><strong>Exam:</strong> {result.examTitle}</div>
                      <div><strong>Date:</strong> {new Date(result.examDate).toLocaleDateString()}</div>
                      <div><strong>Published:</strong> {new Date(result.publishedDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Marks Summary */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-primary text-white">
                <h6 className="mb-0 fw-semibold">Performance Summary</h6>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-3">
                    <div className="border-end">
                      <h3 className="text-primary fw-bold">{result.obtainedMarks}/{result.totalMarks}</h3>
                      <small className="text-muted">Marks Obtained</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border-end">
                      <h3 className="text-success fw-bold">{result.percentage}%</h3>
                      <small className="text-muted">Percentage</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border-end">
                      <h3 className="text-info fw-bold">{result.grade}</h3>
                      <small className="text-muted">Grade</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div>
                      <h3 className="text-warning fw-bold">{result.rank}/{result.totalStudents}</h3>
                      <small className="text-muted">Rank</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subject-wise Marks */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header">
                <h6 className="mb-0 fw-semibold">Subject-wise Marks</h6>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Subject</th>
                        <th>Max Marks</th>
                        <th>Obtained Marks</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.subjectWiseMarks.map((subject, index) => (
                        <tr key={index}>
                          <td>{subject.subject}</td>
                          <td>{subject.maxMarks}</td>
                          <td>{subject.obtainedMarks}</td>
                          <td>{((subject.obtainedMarks / subject.maxMarks) * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div className="alert alert-success">
              <h6 className="fw-semibold">Remarks:</h6>
              <p className="mb-0">{result.remarks}</p>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary d-flex align-items-center" onClick={handlePrint}>
              <Printer size={16} className="me-2" />
              Print
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

export default ViewResultModal;