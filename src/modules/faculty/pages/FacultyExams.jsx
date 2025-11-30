// FacultyExams.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, Plus, Search, Filter, Edit, Trash2, 
  Calendar, Clock, Users, Download, Eye, ArrowLeft 
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const FacultyExams = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingExam, setEditingExam] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    date: "",
    time: "",
    duration: "",
    totalMarks: "",
    description: ""
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      // Mock data - replace with API call
      const mockExams = [
        {
          id: 1,
          title: "Midterm Examination",
          course: "CS101 - Programming Fundamentals",
          date: "2024-02-15",
          time: "10:00 AM",
          duration: "3 hours",
          totalMarks: 100,
          studentsEnrolled: 45,
          status: "Upcoming"
        },
        {
          id: 2,
          title: "Final Exam",
          course: "MA202 - Calculus II",
          date: "2024-03-20",
          time: "02:00 PM",
          duration: "2 hours",
          totalMarks: 80,
          studentsEnrolled: 42,
          status: "Upcoming"
        }
      ];
      setExams(mockExams);
    } catch (error) {
      toast.error("Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingExam) {
        // Update existing exam
        await new Promise(resolve => setTimeout(resolve, 1000));
        setExams(exams.map(exam => 
          exam.id === editingExam.id 
            ? { ...exam, ...formData }
            : exam
        ));
        toast.success("Exam updated successfully!");
      } else {
        // Create new exam
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newExam = {
          id: Date.now(),
          ...formData,
          studentsEnrolled: 0,
          status: "Upcoming"
        };
        setExams([...exams, newExam]);
        toast.success("Exam created successfully!");
      }
      setShowModal(false);
      setFormData({
        title: "", course: "", date: "", time: "", 
        duration: "", totalMarks: "", description: ""
      });
      setEditingExam(null);
    } catch (error) {
      toast.error(`Failed to ${editingExam ? 'update' : 'create'} exam`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      course: exam.course,
      date: exam.date,
      time: exam.time,
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      description: exam.description || ""
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setExams(exams.filter(exam => exam.id !== id));
      toast.success("Exam deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete exam");
    }
  };

  const handleView = (exam) => {
    toast.info(`Viewing details for: ${exam.title}`);
    // Navigate to detailed view or show modal
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Exams Report", 14, 10);
    
    doc.autoTable({
      head: [['Title', 'Course', 'Date', 'Time', 'Duration', 'Marks', 'Status']],
      body: exams.map(exam => [
        exam.title,
        exam.course,
        exam.date,
        exam.time,
        exam.duration,
        exam.totalMarks,
        exam.status
      ]),
    });

    doc.save("ExamsReport.pdf");
    toast.success("Exams exported to PDF successfully");
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
      exams.map(exam => ({
        'Title': exam.title,
        'Course': exam.course,
        'Date': exam.date,
        'Time': exam.time,
        'Duration': exam.duration,
        'Total Marks': exam.totalMarks,
        'Students Enrolled': exam.studentsEnrolled,
        'Status': exam.status
      }))
    );
    XLSX.utils.book_append_sheet(wb, ws, "Exams");
    XLSX.writeFile(wb, "ExamsReport.xlsx");
    toast.success("Exams exported to Excel successfully");
  };

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid mt-4">
      <ToastContainer position="top-right" />

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <button 
            className="btn btn-outline-secondary me-3"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h3>
              <BookOpen size={24} className="me-2" />
              Exam Management
            </h3>
            <p className="text-muted">Create and manage examinations</p>
          </div>
        </div>
        <div>
          <button 
            className="btn btn-primary me-2"
            onClick={() => {
              setEditingExam(null);
              setShowModal(true);
            }}
          >
            <Plus size={16} className="me-1" />
            Create Exam
          </button>
          <button className="btn btn-success me-2" onClick={exportExcel}>
            <Download size={16} className="me-1" />
            Excel
          </button>
          <button className="btn btn-danger" onClick={exportPDF}>
            <Download size={16} className="me-1" />
            PDF
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select className="form-select">
            <option>All Status</option>
            <option>Upcoming</option>
            <option>Ongoing</option>
            <option>Completed</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select">
            <option>All Courses</option>
            <option>CS101 - Programming</option>
            <option>MA202 - Calculus</option>
            <option>PH101 - Physics</option>
          </select>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="row">
        {filteredExams.map(exam => (
          <div key={exam.id} className="col-lg-6 mb-3">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{exam.title}</h5>
                <span className={`badge ${
                  exam.status === 'Upcoming' ? 'bg-warning' :
                  exam.status === 'Ongoing' ? 'bg-success' : 'bg-secondary'
                }`}>
                  {exam.status}
                </span>
              </div>
              <div className="card-body">
                <div className="mb-2">
                  <strong>Course:</strong> {exam.course}
                </div>
                <div className="row mb-2">
                  <div className="col-6">
                    <small className="text-muted">
                      <Calendar size={14} className="me-1" />
                      {exam.date}
                    </small>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">
                      <Clock size={14} className="me-1" />
                      {exam.time}
                    </small>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-6">
                    <small className="text-muted">
                      Duration: {exam.duration}
                    </small>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">
                      Marks: {exam.totalMarks}
                    </small>
                  </div>
                </div>
                <div className="mb-3">
                  <small className="text-muted">
                    <Users size={14} className="me-1" />
                    {exam.studentsEnrolled} students enrolled
                  </small>
                </div>
              </div>
              <div className="card-footer">
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-sm btn-outline-info"
                    onClick={() => handleView(exam)}
                  >
                    <Eye size={14} />
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => handleEdit(exam)}
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(exam.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                  <button className="btn btn-sm btn-outline-success">
                    View Results
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Exam Modal */}
      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingExam ? 'Edit Exam' : 'Create New Exam'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setEditingExam(null);
                    setFormData({
                      title: "", course: "", date: "", time: "", 
                      duration: "", totalMarks: "", description: ""
                    });
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Exam Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Course *</label>
                      <select
                        className="form-select"
                        value={formData.course}
                        onChange={(e) => setFormData({...formData, course: e.target.value})}
                        required
                      >
                        <option value="">Select Course</option>
                        <option value="CS101 - Programming Fundamentals">CS101 - Programming Fundamentals</option>
                        <option value="MA202 - Calculus II">MA202 - Calculus II</option>
                        <option value="PH101 - Physics I">PH101 - Physics I</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Time *</label>
                      <input
                        type="time"
                        className="form-control"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Duration *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        placeholder="e.g., 2 hours"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Total Marks *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.totalMarks}
                        onChange={(e) => setFormData({...formData, totalMarks: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Exam instructions and details..."
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setEditingExam(null);
                      setFormData({
                        title: "", course: "", date: "", time: "", 
                        duration: "", totalMarks: "", description: ""
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : editingExam ? 'Update Exam' : 'Create Exam'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyExams;