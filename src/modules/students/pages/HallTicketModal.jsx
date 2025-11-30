// HallTicketModal.jsx
import { useState, useEffect } from "react";
import { X, Download, Printer, QrCode, User, Calendar, MapPin, BookOpen } from "lucide-react";

const HallTicketModal = ({ exam, show, onClose }) => {
  const [hallTicket, setHallTicket] = useState(null);

  useEffect(() => {
    if (exam && show) {
      // Mock hall ticket data - replace with API call
      setHallTicket({
        id: `HT${exam.id.toString().padStart(4, '0')}`,
        studentName: "Aditya Pawase",
        studentId: "PRN123",
        photo: "/api/placeholder/150/200", // Replace with actual photo URL
        course: exam.course,
        semester: "3rd",
        examTitle: exam.title,
        examDate: exam.date,
        reportingTime: "08:30 AM", // 30 minutes before exam
        examDuration: exam.duration,
        venue: exam.venue,
        instructions: [
          "Carry this hall ticket and college ID card",
          "Report 30 minutes before exam time",
          "No electronic devices allowed",
          "Scientific calculator permitted",
          "Follow COVID-19 safety protocols"
        ],
        qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=STU2024001",
        issuedDate: new Date().toISOString(),
        authorizedBy: "Exam Controller"
      });
    }
  }, [exam, show]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Mock download functionality
    toast.success("Hall ticket downloaded successfully!");
  };

  if (!show || !hallTicket) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">Hall Ticket</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* Hall Ticket Design */}
            <div className="card border-2 border-primary">
              <div className="card-header bg-primary text-white text-center">
                <h4 className="mb-1 fw-bold">EXAMINATION HALL TICKET</h4>
                <small>University of Technology - Academic Year 2024-25</small>
              </div>
              <div className="card-body">
                <div className="row">
                  {/* Student Photo and Basic Info */}
                  <div className="col-md-8">
                    <div className="row mb-3">
                      <div className="col-3">
                        <div className="border rounded p-1 text-center">
                          <User size={80} className="text-muted" />
                          <small className="text-muted d-block">Student Photo</small>
                        </div>
                      </div>
                      <div className="col-9">
                        <div className="row">
                          <div className="col-6">
                            <strong>Hall Ticket No:</strong>
                            <div className="fw-bold text-primary">{hallTicket.id}</div>
                          </div>
                          <div className="col-6">
                            <strong>Student ID:</strong>
                            <div className="fw-bold">{hallTicket.studentId}</div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <strong>Student Name:</strong>
                          <div className="fw-bold fs-5">{hallTicket.studentName}</div>
                        </div>
                      </div>
                    </div>

                    {/* Exam Details */}
                    <div className="row mb-3">
                      <div className="col-6">
                        <div className="d-flex align-items-center mb-2">
                          <BookOpen size={16} className="text-muted me-2" />
                          <div>
                            <small className="text-muted d-block">Course</small>
                            <strong>{hallTicket.course}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center mb-2">
                          <Calendar size={16} className="text-muted me-2" />
                          <div>
                            <small className="text-muted d-block">Semester</small>
                            <strong>{hallTicket.semester}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Exam Schedule */}
                    <div className="card border-1">
                      <div className="card-body">
                        <h6 className="fw-semibold mb-3">Exam Schedule</h6>
                        <div className="row">
                          <div className="col-md-6">
                            <small className="text-muted d-block">Exam Title</small>
                            <strong>{hallTicket.examTitle}</strong>
                          </div>
                          <div className="col-md-3">
                            <small className="text-muted d-block">Date</small>
                            <strong>{new Date(hallTicket.examDate).toLocaleDateString()}</strong>
                          </div>
                          <div className="col-md-3">
                            <small className="text-muted d-block">Time</small>
                            <strong>{new Date(hallTicket.examDate).toLocaleTimeString()}</strong>
                          </div>
                        </div>
                        <div className="row mt-2">
                          <div className="col-md-6">
                            <small className="text-muted d-block">Reporting Time</small>
                            <strong>{hallTicket.reportingTime}</strong>
                          </div>
                          <div className="col-md-6">
                            <small className="text-muted d-block">Duration</small>
                            <strong>{hallTicket.examDuration} minutes</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* QR Code and Venue */}
                  <div className="col-md-4 border-start">
                    <div className="text-center mb-3">
                      <QrCode size={100} className="text-muted mb-2" />
                      <small className="text-muted d-block">Scan for verification</small>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <MapPin size={16} className="text-muted me-2" />
                      <div>
                        <small className="text-muted d-block">Venue</small>
                        <strong>{hallTicket.venue}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="mt-4">
                  <h6 className="fw-semibold mb-2">Important Instructions:</h6>
                  <div className="alert alert-warning">
                    <ul className="mb-0 small">
                      {hallTicket.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Authorization */}
                <div className="row mt-4">
                  <div className="col-md-6">
                    <small className="text-muted">Issued Date: {new Date(hallTicket.issuedDate).toLocaleDateString()}</small>
                  </div>
                  <div className="col-md-6 text-end">
                    <div className="border-top pt-2">
                      <small className="text-muted d-block">Authorized By</small>
                      <strong>{hallTicket.authorizedBy}</strong>
                    </div>
                  </div>
                </div>
              </div>
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

export default HallTicketModal;