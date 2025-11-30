import { useState, useEffect } from "react";
import { Pencil, Trash2, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "http://localhost:5000/api/students"; // Spring Boot API URL

const StudentList = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: null,
    name: "",
    email: "",
    phone: "",
    studentPrn: "",
    grade: "",
    semester: "",
    section: "",
    department: "",
    admissionDate: "",
    password: ""
  });
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;

  // ✅ Fetch all students from API
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch students");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ Export Functions
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(students.map(s => ({
      PRN: s.studentPrn,
      Name: s.name,
      Email: s.email,
      Phone: s.phone,
      Grade: s.grade,
      Semester: s.semester,
      Section: s.section,
      Department: s.department,
      'Admission Date': s.admissionDate
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "StudentList.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Student List", 14, 10);
    doc.autoTable({
      head: [["PRN", "Name", "Email", "Phone", "Grade", "Semester", "Department", "Section"]],
      body: students.map((s) => [
        s.studentPrn, 
        s.name, 
        s.email, 
        s.phone, 
        s.grade, 
        s.semester, 
        s.department, 
        s.section
      ]),
    });
    doc.save("StudentList.pdf");
  };

  // ✅ CRUD HANDLERS
  const handleAdd = () => {
    setFormData({
      studentId: null,
      studentPrn: "",
      name: "",
      email: "",
      phone: "",
      grade: "",
      semester: "",
      section: "",
      department: "",
      admissionDate: new Date().toISOString().split('T')[0],
      password: ""
    });
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEdit = (student) => {
    setFormData({
      ...student,
      password: "" // Don't show password in edit form
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Delete failed");
      }
      
      toast.success("Student deleted successfully");
      fetchStudents();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `${API_BASE}/${formData.studentId}` : API_BASE;

      const payload = { ...formData };
      // Don't send password if it's empty in edit mode
      if (isEdit && !payload.password) {
        delete payload.password;
      }

      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to save student");
      }

      toast.success(isEdit ? "Student updated successfully" : "Student added successfully");
      setShowModal(false);
      fetchStudents();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filtering + Pagination
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentPrn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = filterGrade ? s.grade === filterGrade : true;
    const matchesDepartment = filterDepartment ? s.department === filterDepartment : true;
    return matchesSearch && matchesGrade && matchesDepartment;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const currentData = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique values for filters
  const uniqueGrades = [...new Set(students.map(s => s.grade).filter(Boolean))];
  const uniqueDepartments = [...new Set(students.map(s => s.department).filter(Boolean))];

  return (
    <div className="container-fluid mt-4">
      <ToastContainer position="top-right" />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Student Management</h4>
        <div>
          <button className="btn btn-primary me-2" onClick={handleAdd} disabled={loading}>
            <Plus size={16} className="me-1" />
            Add Student
          </button>
          <button className="btn btn-success me-2" onClick={exportExcel} disabled={loading}>
            Export to Excel
          </button>
          <button className="btn btn-danger me-2" onClick={exportPDF} disabled={loading}>
            Export to PDF
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="Search by name or PRN..."
            className="form-control"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
          >
            <option value="">All Grades</option>
            {uniqueGrades.map((grade, i) => (
              <option key={i} value={grade}>
                Grade {grade}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {uniqueDepartments.map((dept, i) => (
              <option key={i} value={dept}>
                {dept}
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
        </div>
      )}

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped text-center">
          <thead className="table-dark">
            <tr>
              <th>PRN</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Grade</th>
              <th>Semester</th>
              <th>Section</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((student) => (
                <tr key={student.studentId}>
                  <td>{student.studentPrn}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>
                    <span className={`badge ${student.grade ? 'bg-success' : 'bg-secondary'}`}>
                      {student.grade || 'N/A'}
                    </span>
                  </td>
                  <td>{student.semester}</td>
                  <td>{student.section}</td>
                  <td>{student.department}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => navigate(`/admin/main/students/${student.studentId}/details`)}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(student)}
                      title="Edit Student"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(student.studentId)}
                      title="Delete Student"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-muted py-4">
                  {loading ? 'Loading students...' : 'No students found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-end">
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                <button className="page-link">{i + 1}</button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <form onSubmit={handleSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {isEdit ? "Edit Student" : "Add Student"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                    disabled={loading}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    {[
                      { field: "studentPrn", label: "PRN Number", type: "text", required: true },
                      { field: "name", label: "Full Name", type: "text", required: true },
                      { field: "email", label: "Email", type: "email", required: true },
                      { field: "phone", label: "Phone", type: "text", required: true },
                      { field: "department", label: "Department", type: "text", required: true },
                      { field: "semester", label: "Semester", type: "number", required: true },
                      { field: "section", label: "Section", type: "text", required: true },
                      { field: "grade", label: "Grade", type: "text", required: false },
                      { field: "admissionDate", label: "Admission Date", type: "date", required: true },
                      ...(isEdit ? [] : [{ field: "password", label: "Password", type: "password", required: true }])
                    ].map(({ field, label, type, required }) => (
                      <div className="col-md-6 mb-3" key={field}>
                        <label className="form-label">
                          {label} {required && <span className="text-danger">*</span>}
                        </label>
                        <input
                          type={type}
                          className="form-control"
                          name={field}
                          value={formData[field] || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [field]: e.target.value,
                            })
                          }
                          required={required}
                          disabled={loading}
                        />
                      </div>
                    ))}
                  </div>
                  {isEdit && (
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">New Password (leave blank to keep current)</label>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          value={formData.password || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          disabled={loading}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    type="submit" 
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        {isEdit ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      isEdit ? "Update Student" : "Add Student"
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
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;