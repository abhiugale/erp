// FacultyQuizzes.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Award, Plus, Search, Filter, Edit, Trash2, 
  Clock, Users, Download, BarChart3, Eye, ArrowLeft 
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const FacultyQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    questions: 10,
    timeLimit: 30,
    totalMarks: 100,
    dueDate: "",
    description: ""
  });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      // Mock data - replace with API call
      const mockQuizzes = [
        {
          id: 1,
          title: "Programming Basics Quiz",
          course: "CS101 - Programming Fundamentals",
          questions: 15,
          timeLimit: 45,
          totalMarks: 100,
          dueDate: "2024-02-10",
          studentsAttempted: 42,
          averageScore: 78,
          status: "Active"
        },
        {
          id: 2,
          title: "Calculus Derivatives Quiz",
          course: "MA202 - Calculus II",
          questions: 20,
          timeLimit: 60,
          totalMarks: 100,
          dueDate: "2024-02-15",
          studentsAttempted: 38,
          averageScore: 65,
          status: "Upcoming"
        }
      ];
      setQuizzes(mockQuizzes);
    } catch (error) {
      toast.error("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingQuiz) {
        // Update existing quiz
        await new Promise(resolve => setTimeout(resolve, 1000));
        setQuizzes(quizzes.map(quiz => 
          quiz.id === editingQuiz.id 
            ? { ...quiz, ...formData }
            : quiz
        ));
        toast.success("Quiz updated successfully!");
      } else {
        // Create new quiz
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newQuiz = {
          id: Date.now(),
          ...formData,
          studentsAttempted: 0,
          averageScore: 0,
          status: "Active"
        };
        setQuizzes([...quizzes, newQuiz]);
        toast.success("Quiz created successfully!");
      }
      setShowModal(false);
      setFormData({
        title: "", course: "", questions: 10, timeLimit: 30,
        totalMarks: 100, dueDate: "", description: ""
      });
      setEditingQuiz(null);
    } catch (error) {
      toast.error(`Failed to ${editingQuiz ? 'update' : 'create'} quiz`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      course: quiz.course,
      questions: quiz.questions,
      timeLimit: quiz.timeLimit,
      totalMarks: quiz.totalMarks,
      dueDate: quiz.dueDate,
      description: quiz.description || ""
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setQuizzes(quizzes.filter(quiz => quiz.id !== id));
      toast.success("Quiz deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete quiz");
    }
  };

  const handleView = (quiz) => {
    toast.info(`Viewing details for: ${quiz.title}`);
    // Navigate to detailed view or show modal
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Quizzes Report", 14, 10);
    
    doc.autoTable({
      head: [['Title', 'Course', 'Questions', 'Time Limit', 'Due Date', 'Status']],
      body: quizzes.map(quiz => [
        quiz.title,
        quiz.course,
        quiz.questions,
        `${quiz.timeLimit} mins`,
        quiz.dueDate,
        quiz.status
      ]),
    });

    doc.save("QuizzesReport.pdf");
    toast.success("Quizzes exported to PDF successfully");
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
      quizzes.map(quiz => ({
        'Title': quiz.title,
        'Course': quiz.course,
        'Questions': quiz.questions,
        'Time Limit': `${quiz.timeLimit} mins`,
        'Total Marks': quiz.totalMarks,
        'Due Date': quiz.dueDate,
        'Students Attempted': quiz.studentsAttempted,
        'Average Score': `${quiz.averageScore}%`,
        'Status': quiz.status
      }))
    );
    XLSX.utils.book_append_sheet(wb, ws, "Quizzes");
    XLSX.writeFile(wb, "QuizzesReport.xlsx");
    toast.success("Quizzes exported to Excel successfully");
  };

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.course.toLowerCase().includes(searchTerm.toLowerCase())
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
              <Award size={24} className="me-2" />
              Quiz Management
            </h3>
            <p className="text-muted">Create and manage quizzes</p>
          </div>
        </div>
        <div>
          <button 
            className="btn btn-primary me-2"
            onClick={() => {
              setEditingQuiz(null);
              setShowModal(true);
            }}
          >
            <Plus size={16} className="me-1" />
            Create Quiz
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
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select className="form-select">
            <option>All Status</option>
            <option>Active</option>
            <option>Upcoming</option>
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

      {/* Quizzes Grid */}
      <div className="row">
        {filteredQuizzes.map(quiz => (
          <div key={quiz.id} className="col-lg-6 mb-3">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{quiz.title}</h5>
                <span className={`badge ${
                  quiz.status === 'Active' ? 'bg-success' :
                  quiz.status === 'Upcoming' ? 'bg-warning' : 'bg-secondary'
                }`}>
                  {quiz.status}
                </span>
              </div>
              <div className="card-body">
                <div className="mb-2">
                  <strong>Course:</strong> {quiz.course}
                </div>
                <div className="row mb-2">
                  <div className="col-6">
                    <small className="text-muted">
                      Questions: {quiz.questions}
                    </small>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">
                      <Clock size={14} className="me-1" />
                      {quiz.timeLimit} mins
                    </small>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-6">
                    <small className="text-muted">
                      Marks: {quiz.totalMarks}
                    </small>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">
                      Due: {quiz.dueDate}
                    </small>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-6">
                    <small className="text-muted">
                      <Users size={14} className="me-1" />
                      {quiz.studentsAttempted} attempted
                    </small>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">
                      <BarChart3 size={14} className="me-1" />
                      Avg: {quiz.averageScore}%
                    </small>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-sm btn-outline-info"
                    onClick={() => handleView(quiz)}
                  >
                    <Eye size={14} />
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => handleEdit(quiz)}
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(quiz.id)}
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

      {/* Create/Edit Quiz Modal */}
      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setEditingQuiz(null);
                    setFormData({
                      title: "", course: "", questions: 10, timeLimit: 30,
                      totalMarks: 100, dueDate: "", description: ""
                    });
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Quiz Title *</label>
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
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Number of Questions *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.questions}
                        onChange={(e) => setFormData({...formData, questions: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Time Limit (minutes) *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.timeLimit}
                        onChange={(e) => setFormData({...formData, timeLimit: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Total Marks *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.totalMarks}
                        onChange={(e) => setFormData({...formData, totalMarks: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Due Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
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
                        placeholder="Quiz instructions and topics covered..."
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
                      setEditingQuiz(null);
                      setFormData({
                        title: "", course: "", questions: 10, timeLimit: 30,
                        totalMarks: 100, dueDate: "", description: ""
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
                    {loading ? 'Saving...' : editingQuiz ? 'Update Quiz' : 'Create Quiz'}
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

export default FacultyQuizzes;