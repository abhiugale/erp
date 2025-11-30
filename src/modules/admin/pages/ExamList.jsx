// ExamList.jsx - Using Direct Fetch API
import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Book, Calendar, Clock, Award, Users } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const API_BASE = "http://localhost:5000/api";

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    examId: null,
    examType: "",
    examDate: "",
    course: { courseId: "" }
  });
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterExamType, setFilterExamType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [courseLoading, setCourseLoading] = useState(false);
  const itemsPerPage = 5;

  // Exam types based on your enum
  const examTypes = [
    "MIDTERM",
    "FINAL",
    "QUIZ",
    "ASSIGNMENT",
    "PRACTICAL",
    "PROJECT"
  ];

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Check authentication
  const checkAuthentication = () => {
    const token = getAuthToken();
    if (!token) {
      toast.error('Please login first');
      return false;
    }
    return true;
  };

  // Fetch exams from API
  const fetchExams = async () => {
    if (!checkAuthentication()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/exams`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please login again.');
          localStorage.removeItem('token');
          return;
        }
        throw new Error(`Failed to fetch exams: ${response.status}`);
      }

      const data = await response.json();
      console.log("Exams data:", data);
      setExams(data);
    } catch (error) {
      console.error("Error fetching exams:", error);
      toast.error(error.message || "Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses for dropdown
  const fetchCourses = async () => {
    if (!checkAuthentication()) return;

    setCourseLoading(true);
    try {
      const response = await fetch(`${API_BASE}/courses`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.status}`);
      }

      const data = await response.json();
      console.log("Courses data:", data);
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error(error.message || "Failed to load courses");
    } finally {
      setCourseLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
    fetchCourses();
  }, []);

  // Filter exams
  const filteredExams = exams.filter((exam) => {
    const matchesSearch = 
      exam.examType?.toLowerCase().includes(search.toLowerCase()) ||
      exam.course?.courseName?.toLowerCase().includes(search.toLowerCase());
    
    const matchesCourse = filterCourse ? 
      exam.course?.courseId === parseInt(filterCourse) : true;
    
    const matchesExamType = filterExamType ? 
      exam.examType === filterExamType : true;
    
    return matchesSearch && matchesCourse && matchesExamType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const currentData = filteredExams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // CRUD Operations
  const handleAdd = () => {
    if (!checkAuthentication()) return;

    setFormData({
      examId: null,
      examType: "",
      examDate: new Date().toISOString().split('T')[0],
      course: { courseId: "" }
    });
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEdit = (exam) => {
    if (!checkAuthentication()) return;

    setFormData({
      examId: exam.examId,
      examType: exam.examType,
      examDate: exam.examDate,
      course: { courseId: exam.course?.courseId || "" }
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    if (!checkAuthentication()) return;

    try {
      const response = await fetch(`${API_BASE}/exams/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Delete failed");
      }

      toast.success("Exam deleted successfully");
      fetchExams();
    } catch (error) {
      console.error("Error deleting exam:", error);
      toast.error(error.message || "Failed to delete exam");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkAuthentication()) return;

    setLoading(true);

    try {
      // Prepare the payload according to your backend structure
      const payload = {
        examType: formData.examType,
        examDate: formData.examDate,
        course: { 
          courseId: parseInt(formData.course.courseId)
        }
      };

      console.log("Submitting payload:", payload);

      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `${API_BASE}/exams/${formData.examId}` : `${API_BASE}/exams`;

      const response = await fetch(url, {
        method: method,
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || `Failed to ${isEdit ? 'update' : 'create'} exam`);
      }

      toast.success(isEdit ? "Exam updated successfully" : "Exam added successfully");
      setShowModal(false);
      fetchExams(); // Refresh the list
    } catch (error) {
      console.error("Error saving exam:", error);
      toast.error(error.message || "Failed to save exam. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  // Export Functions
  const exportPDF = () => {
    if (filteredExams.length === 0) {
      toast.warning("No exams data to export");
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text("Exam Schedule", 14, 10);
      doc.autoTable({
        head: [["Exam Type", "Date", "Course", "Department", "Semester"]],
        body: filteredExams.map((exam) => [
          exam.examType,
          new Date(exam.examDate).toLocaleDateString(),
          exam.course?.courseName || "N/A",
          exam.course?.department || "N/A",
          exam.course?.semester || "N/A"
        ]),
      });
      doc.save("ExamSchedule.pdf");
      toast.success("Exported to PDF successfully");
    } catch (error) {
      toast.error('Error exporting to PDF');
    }
  };

  const exportExcel = () => {
    if (filteredExams.length === 0) {
      toast.warning("No exams data to export");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(
        filteredExams.map(exam => ({
          "Exam Type": exam.examType,
          "Date": new Date(exam.examDate).toLocaleDateString(),
          "Course": exam.course?.courseName,
          "Department": exam.course?.department,
          "Semester": exam.course?.semester
        }))
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Exams");
      XLSX.writeFile(wb, "ExamSchedule.xlsx");
      toast.success("Exported to Excel successfully");
    } catch (error) {
      toast.error('Error exporting to Excel');
    }
  };

  return (
    <div className="container-fluid mt-4">
      <ToastContainer position="top-right" />

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>
          <Award size={24} className="me-2" />
          Exam Management
        </h4>
        <div>
          <button 
            className="btn btn-primary me-2" 
            onClick={handleAdd}
            disabled={loading}
          >
            <Plus size={16} className="me-1" />
            Add Exam
          </button>
          <button
            className="btn btn-success me-2"
            onClick={exportExcel}
            disabled={loading || filteredExams.length === 0}
          >
            Export to Excel
          </button>
          <button 
            className="btn btn-danger" 
            onClick={exportPDF}
            disabled={loading || filteredExams.length === 0}
          >
            Export to PDF
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6>Total Exams</h6>
                  <h3>{exams.length}</h3>
                </div>
                <Award size={24} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6>Upcoming</h6>
                  <h3>
                    {exams.filter(e => new Date(e.examDate) > new Date()).length}
                  </h3>
                </div>
                <Calendar size={24} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6>Available Courses</h6>
                  <h3>{courses.length}</h3>
                </div>
                <Book size={24} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6>Showing</h6>
                  <h3>{filteredExams.length}</h3>
                </div>
                <Users size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by exam type or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            disabled={loading || courseLoading}
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseName} - Sem {course.semester}
              </option>
            ))}
          </select>
          {courseLoading && (
            <div className="form-text">Loading courses...</div>
          )}
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterExamType}
            onChange={(e) => setFilterExamType(e.target.value)}
            disabled={loading}
          >
            <option value="">All Exam Types</option>
            {examTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center mb-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-2">Loading exams...</span>
        </div>
      )}

      {/* Exams Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Exam Type</th>
              <th>Date</th>
              <th>Course</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((exam) => (
                <tr key={exam.examId}>
                  <td>
                    <span className={`badge ${
                      exam.examType === 'FINAL' ? 'bg-danger' :
                      exam.examType === 'MIDTERM' ? 'bg-warning' :
                      exam.examType === 'QUIZ' ? 'bg-info' :
                      'bg-secondary'
                    }`}>
                      {exam.examType}
                    </span>
                  </td>
                  <td>
                    <Calendar size={16} className="me-1 text-primary" />
                    {new Date(exam.examDate).toLocaleDateString()}
                  </td>
                  <td>
                    <Book size={16} className="me-1 text-success" />
                    {exam.course?.courseName || "N/A"}
                  </td>
                  <td>{exam.course?.department || "N/A"}</td>
                  <td>
                    <span className="badge bg-primary">
                      Sem {exam.course?.semester || "N/A"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      new Date(exam.examDate) > new Date() ? 
                      'bg-success' : 'bg-secondary'
                    }`}>
                      {new Date(exam.examDate) > new Date() ? 
                       'Upcoming' : 'Completed'}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(exam)}
                        title="Edit Exam"
                        disabled={loading}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(exam.examId)}
                        title="Delete Exam"
                        disabled={loading}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-muted py-4 text-center">
                  {loading ? 'Loading exams...' : 'No exams found'}
                  {search || filterCourse || filterExamType ? ' matching your filters' : ''}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </button>
            </li>
            
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button 
                  className="page-link" 
                  onClick={() => setCurrentPage(i + 1)}
                  disabled={loading}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || loading}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" style={{backdropFilter: 'blur(2px)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEdit ? "Edit Exam" : "Add New Exam"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Exam Type *</label>
                    <select
                      className="form-select"
                      value={formData.examType}
                      onChange={(e) => setFormData({...formData, examType: e.target.value})}
                      required
                      disabled={loading}
                    >
                      <option value="">Select Exam Type</option>
                      {examTypes.map((type, index) => (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Exam Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.examDate}
                      onChange={(e) => setFormData({...formData, examDate: e.target.value})}
                      required
                      disabled={loading}
                      min={new Date().toISOString().split('T')[0]} // Prevent past dates
                    />
                    <div className="form-text">Exam date cannot be in the past</div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Course *</label>
                    {courseLoading ? (
                      <div className="alert alert-info">
                        <div className="spinner-border spinner-border-sm me-2"></div>
                        Loading courses...
                      </div>
                    ) : (
                      <select
                        className="form-select"
                        value={formData.course.courseId}
                        onChange={(e) => setFormData({
                          ...formData, 
                          course: { courseId: e.target.value }
                        })}
                        required
                        disabled={loading}
                      >
                        <option value="">Select Course</option>
                        {courses.map((course) => (
                          <option key={course.courseId} value={course.courseId}>
                            {course.courseName} - {course.department} (Sem {course.semester})
                          </option>
                        ))}
                      </select>
                    )}
                    {courses.length === 0 && !courseLoading && (
                      <div className="form-text text-warning">
                        No courses available. Please add courses first.
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="submit" 
                    className="btn btn-success"
                    disabled={loading || courses.length === 0}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        {isEdit ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      isEdit ? "Update Exam" : "Add Exam"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                    disabled={loading}
                  >
                    Cancel
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

export default ExamList;