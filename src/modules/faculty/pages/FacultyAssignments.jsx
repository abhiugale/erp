// FacultyAssignments.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, Plus, Search, Filter, Edit, Trash2, 
  Calendar, Download, Upload, Users, CheckCircle, Eye, ArrowLeft 
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const FacultyAssignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    dueDate: "",
    totalMarks: "",
    description: "",
    instructions: ""
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      // Mock data - replace with API call
      const mockAssignments = [
        {
          id: 1,
          title: "Programming Assignment 1",
          course: "CS101 - Programming Fundamentals",
          dueDate: "2024-02-12",
          totalMarks: 100,
          submissions: 42,
          graded: 35,
          status: "Active"
        },
        {
          id: 2,
          title: "Calculus Problem Set",
          course: "MA202 - Calculus II",
          dueDate: "2024-02-18",
          totalMarks: 50,
          submissions: 38,
          graded: 12,
          status: "Active"
        },
        {
          id: 3,
          title: "Physics Lab Report",
          course: "PH101 - Physics I",
          dueDate: "2024-01-30",
          totalMarks: 30,
          submissions: 45,
          graded: 45,
          status: "Completed"
        }
      ];
      setAssignments(mockAssignments);
    } catch (error) {
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingAssignment) {
        // Update existing assignment
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAssignments(assignments.map(assignment => 
          assignment.id === editingAssignment.id 
            ? { ...assignment, ...formData }
            : assignment
        ));
        toast.success("Assignment updated successfully!");
      } else {
        // Create new assignment
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newAssignment = {
          id: Date.now(),
          ...formData,
          submissions: 0,
          graded: 0,
          status: "Active"
        };
        setAssignments([...assignments, newAssignment]);
        toast.success("Assignment created successfully!");
      }
      setShowModal(false);
      setFormData({
        title: "", course: "", dueDate: "", totalMarks: "",
        description: "", instructions: ""
      });
      setEditingAssignment(null);
    } catch (error) {
      toast.error(`Failed to ${editingAssignment ? 'update' : 'create'} assignment`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      course: assignment.course,
      dueDate: assignment.dueDate,
      totalMarks: assignment.totalMarks,
      description: assignment.description || "",
      instructions: assignment.instructions || ""
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setAssignments(assignments.filter(assignment => assignment.id !== id));
      toast.success("Assignment deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete assignment");
    }
  };

  const handleView = (assignment) => {
    toast.info(`Viewing details for: ${assignment.title}`);
    // Navigate to detailed view or show modal
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Assignments Report", 14, 10);
    
    doc.autoTable({
      head: [['Title', 'Course', 'Due Date', 'Total Marks', 'Submissions', 'Graded', 'Status']],
      body: assignments.map(assignment => [
        assignment.title,
        assignment.course,
        assignment.dueDate,
        assignment.totalMarks,
        assignment.submissions,
        assignment.graded,
        assignment.status
      ]),
    });

    doc.save("AssignmentsReport.pdf");
    toast.success("Assignments exported to PDF successfully");
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
      assignments.map(assignment => ({
        'Title': assignment.title,
        'Course': assignment.course,
        'Due Date': assignment.dueDate,
        'Total Marks': assignment.totalMarks,
        'Submissions': assignment.submissions,
        'Graded': assignment.graded,
        'Status': assignment.status
      }))
    );
    XLSX.utils.book_append_sheet(wb, ws, "Assignments");
    XLSX.writeFile(wb, "AssignmentsReport.xlsx");
    toast.success("Assignments exported to Excel successfully");
  };

  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.course.toLowerCase().includes(searchTerm.toLowerCase())
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
              <FileText size={24} className="me-2" />
              Assignment Management
            </h3>
            <p className="text-muted">Create and manage student assignments</p>
          </div>
        </div>
        <div>
          <button 
            className="btn btn-primary me-2"
            onClick={() => {
              setEditingAssignment(null);
              setShowModal(true);
            }}
          >
            <Plus size={16} className="me-1" />
            Create Assignment
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
              placeholder="Search assignments..."
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

      {/* Assignments Table */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Assignments</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Course</th>
                  <th>Due Date</th>
                  <th>Total Marks</th>
                  <th>Submissions</th>
                  <th>Graded</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map(assignment => (
                  <tr key={assignment.id}>
                    <td>
                      <strong>{assignment.title}</strong>
                    </td>
                    <td>{assignment.course}</td>
                    <td>
                      <Calendar size={14} className="me-1 text-muted" />
                      {assignment.dueDate}
                    </td>
                    <td>
                      <span className="badge bg-info">{assignment.totalMarks}</span>
                    </td>
                    <td>
                      <Users size={14} className="me-1 text-muted" />
                      {assignment.submissions}
                    </td>
                    <td>
                      <CheckCircle size={14} className="me-1 text-muted" />
                      {assignment.graded}
                    </td>
                    <td>
                      <span className={`badge ${
                        assignment.status === 'Active' ? 'bg-success' :
                        assignment.status === 'Upcoming' ? 'bg-warning' : 'bg-secondary'
                      }`}>
                        {assignment.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button 
                          className="btn btn-sm btn-outline-info"
                          onClick={() => handleView(assignment)}
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => handleEdit(assignment)}
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(assignment.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                        <button className="btn btn-sm btn-outline-success">
                          <Upload size={14} />
                        </button>
                        <button className="btn btn-sm btn-outline-primary">
                          Grade
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Assignment Modal */}
      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAssignment(null);
                    setFormData({
                      title: "", course: "", dueDate: "", totalMarks: "",
                      description: "", instructions: ""
                    });
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Assignment Title *</label>
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
                      <label className="form-label">Due Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
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
                        rows="2"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Brief description of the assignment..."
                      ></textarea>
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Instructions *</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        value={formData.instructions}
                        onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                        placeholder="Detailed instructions for students..."
                        required
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <div className="mb-3">
                        <label className="form-label">Attachment (Optional)</label>
                        <input type="file" className="form-control" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setEditingAssignment(null);
                      setFormData({
                        title: "", course: "", dueDate: "", totalMarks: "",
                        description: "", instructions: ""
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
                    {loading ? 'Saving...' : editingAssignment ? 'Update Assignment' : 'Create Assignment'}
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

export default FacultyAssignments;