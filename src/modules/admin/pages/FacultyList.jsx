// FacultyList.jsx - Same functionality as StudentList
import { useState, useEffect } from "react";
import { Pencil, Trash2, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "http://localhost:5000/api/faculties"; // Spring Boot API URL

const FacultyList = () => {
  const navigate = useNavigate();

  const [faculties, setFaculties] = useState([]);
  const [formData, setFormData] = useState({
    facultyId: null,
    fullName: "",
    email: "",
    phone: "",
    empNumber: "",
    department: "",
    qualification: "",
    joinDate: "",
    password: ""
  });
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;

  // ✅ Fetch all faculties from API
  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch faculties");
      const data = await response.json();
      setFaculties(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  // ✅ Export Functions
  const exportExcel = () => {
    if (faculties.length === 0) {
      toast.warning('No faculties data to export');
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(faculties.map(f => ({
        'Employee Number': f.empNumber,
        'Full Name': f.fullName,
        'Email': f.email,
        'Phone': f.phone,
        'Department': f.department,
        'Qualification': f.qualification,
        'Join Date': f.joinDate
      })));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Faculties");
      XLSX.writeFile(wb, "FacultyList.xlsx");
      toast.success('Exported to Excel successfully');
    } catch (error) {
      toast.error('Error exporting to Excel');
    }
  };

  const exportPDF = () => {
    if (faculties.length === 0) {
      toast.warning('No faculties data to export');
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text("Faculty List", 14, 10);
      doc.autoTable({
        head: [["Emp No", "Name", "Email", "Phone", "Department", "Qualification", "Join Date"]],
        body: faculties.map((f) => [
          f.empNumber, 
          f.fullName, 
          f.email, 
          f.phone, 
          f.department, 
          f.qualification, 
          f.joinDate ? new Date(f.joinDate).toLocaleDateString() : 'N/A'
        ]),
      });
      doc.save("FacultyList.pdf");
      toast.success('Exported to PDF successfully');
    } catch (error) {
      toast.error('Error exporting to PDF');
    }
  };

  // ✅ CRUD HANDLERS
  const handleAdd = () => {
    setFormData({
      facultyId: null,
      fullName: "",
      email: "",
      phone: "",
      empNumber: "",
      department: "",
      qualification: "",
      joinDate: new Date().toISOString().split('T')[0],
      password: ""
    });
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEdit = (faculty) => {
    setFormData({
      ...faculty,
      password: "" // Don't show password in edit form
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this faculty member?")) return;
    
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
      
      toast.success("Faculty deleted successfully");
      fetchFaculties();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `${API_BASE}/${formData.facultyId}` : API_BASE;

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
        throw new Error(responseData.message || "Failed to save faculty");
      }

      toast.success(isEdit ? "Faculty updated successfully" : "Faculty added successfully");
      setShowModal(false);
      fetchFaculties();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filtering + Pagination
  const filteredFaculties = faculties.filter((f) => {
    const matchesSearch =
      f.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.empNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment ? f.department === filterDepartment : true;
    return matchesSearch && matchesDepartment;
  });

  const totalPages = Math.ceil(filteredFaculties.length / itemsPerPage);
  const currentData = filteredFaculties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique values for filters
  const uniqueDepartments = [...new Set(faculties.map(f => f.department).filter(Boolean))];

  return (
    <div className="container-fluid mt-4">
      <ToastContainer position="top-right" />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Faculty Management</h4>
        <div>
          <button className="btn btn-primary me-2" onClick={handleAdd} disabled={loading}>
            <Plus size={16} className="me-1" />
            Add Faculty
          </button>
          <button className="btn btn-success me-2" onClick={exportExcel} disabled={loading || faculties.length === 0}>
            Export to Excel
          </button>
          <button className="btn btn-danger me-2" onClick={exportPDF} disabled={loading || faculties.length === 0}>
            Export to PDF
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <input
            type="text"
            placeholder="Search by name, employee number, or email..."
            className="form-control"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            disabled={loading}
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
          <span className="ms-2">Loading faculties...</span>
        </div>
      )}

      {/* Faculties Count */}
      <div className="mb-3">
        <span className="badge bg-info">
          Total Faculties: {faculties.length} | Showing: {filteredFaculties.length}
        </span>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Emp No</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Qualification</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((faculty) => (
                <tr key={faculty.facultyId}>
                  <td>
                    <strong>{faculty.empNumber}</strong>
                  </td>
                  <td>{faculty.fullName}</td>
                  <td>
                    <a href={`mailto:${faculty.email}`} className="text-decoration-none">
                      {faculty.email}
                    </a>
                  </td>
                  <td>
                    {faculty.phone ? (
                      <a href={`tel:${faculty.phone}`} className="text-decoration-none">
                        {faculty.phone}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{faculty.department}</td>
                  <td>{faculty.qualification}</td>
                  <td>
                    {faculty.joinDate ? new Date(faculty.joinDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => navigate(`/admin/main/faculties/${faculty.facultyId}/details`)}
                        title="View Details"
                        disabled={loading}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(faculty)}
                        title="Edit Faculty"
                        disabled={loading}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(faculty.facultyId)}
                        title="Delete Faculty"
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
                <td colSpan="8" className="text-muted py-4 text-center">
                  {loading ? 'Loading faculties...' : 'No faculties found'}
                  {searchQuery || filterDepartment ? ' matching your filters' : ''}
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

      {/* Modal */}
      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" style={{backdropFilter: 'blur(2px)'}}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEdit ? "Edit Faculty" : "Add New Faculty"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    {/* Required Fields */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Employee Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.empNumber || ''}
                        onChange={(e) => setFormData({...formData, empNumber: e.target.value})}
                        required
                        disabled={loading}
                        placeholder="Enter employee number"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Full Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.fullName || ''}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        required
                        disabled={loading}
                        placeholder="Enter full name"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        disabled={loading}
                        placeholder="Enter email address"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Phone <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                        disabled={loading}
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Department <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.department || ''}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        required
                        disabled={loading}
                        placeholder="Enter department"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Qualification <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.qualification || ''}
                        onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                        required
                        disabled={loading}
                        placeholder="Enter qualification"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Join Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.joinDate || ''}
                        onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                        required
                        disabled={loading}
                      />
                    </div>

                    {/* Password Field - Only for new faculties */}
                    {!isEdit && (
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Password <span className="text-danger">*</span>
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          value={formData.password || ''}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          required
                          disabled={loading}
                          placeholder="Enter password (min 6 characters)"
                          minLength="6"
                        />
                        <div className="form-text">Minimum 6 characters required</div>
                      </div>
                    )}
                  </div>

                  {/* Password update for existing faculties */}
                  {isEdit && (
                    <div className="row">
                      <div className="col-12 mb-3">
                        <label className="form-label">New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={formData.password || ''}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          disabled={loading}
                          placeholder="Enter new password to change (leave blank to keep current)"
                          minLength="6"
                        />
                        <div className="form-text">Leave blank to keep current password. Minimum 6 characters if changing.</div>
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
                      isEdit ? "Update Faculty" : "Add Faculty"
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

export default FacultyList;