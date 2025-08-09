import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
const faculty = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    department: "Computer Science",
    email: "priya.sharma@example.com",
    phone: "9876543210",
    designation: "Associate Professor",
  },
  {
    id: 2,
    name: "Prof. Rajat Mehra",
    department: "Mathematics",
    email: "rajat.mehra@example.com",
    phone: "9876501234",
    designation: "Assistant Professor",
  },
  {
    id: 3,
    name: "Dr. Neha Reddy",
    department: "Physics",
    email: "neha.reddy@example.com",
    phone: "9823123456",
    designation: "Professor",
  },
  {
    id: 4,
    name: "Dr. Ajay Patil",
    department: "Computer Science",
    email: "ajay.patil@example.com",
    phone: "9999999999",
    designation: "Lecturer",
  },
];

const defaultForm = {
  id: null,
  name: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
};

const FacultyList = () => {
  const [facultyData, setFacultyData] = useState(faculty);
  const [formData, setFormData] = useState(defaultForm);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const openAddModal = () => {
    setFormData(defaultForm);
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (faculty) => {
    setFormData(faculty);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this faculty?")) {
      setFacultyData(facultyData.filter((f) => f.id !== id));
      toast.success("Faculty deleted.");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.department) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (isEditing) {
      setFacultyData((prev) =>
        prev.map((fac) => (fac.id === formData.id ? formData : fac))
      );
      toast.success("Faculty updated successfully.");
    } else {
      const newFaculty = { ...formData, id: Date.now() };
      setFacultyData((prev) => [...prev, newFaculty]);
      toast.success("Faculty added successfully.");
    }

    setShowModal(false);
    setFormData(defaultForm);
  };

  const filteredFaculty = facultyData.filter((fac) => {
    const matchesSearch =
      fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = filterDept ? fac.department === filterDept : true;

    return matchesSearch && matchesDept;
  });
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(faculty);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Faculties");
    XLSX.writeFile(wb, "FacultyList.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Faculty List", 14, 10);
    doc.autoTable({
      head: [["Id", "Name", "Department", "Email", "Phone", "Designation"]],
      body: filteredFaculty.map((f) => [f.id, f.name, f.department, f.email, f.phone, f.designation]),
    });
    doc.save("FacultyList.pdf");
  };
  const totalPages = Math.ceil(filteredFaculty.length / itemsPerPage);
  const currentData = filteredFaculty.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container-fluid mt-4">
      <ToastContainer position="top-right" />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Faculty Management</h4>
        <div>
          <button className="btn btn-primary me-2" onClick={openAddModal}>
            + Add Faculty
          </button>
          <button
            className="btn btn-success me-2"
            onClick={exportExcel}
          >
            Export to Excel
          </button>
          <button className="btn btn-danger" onClick={exportPDF}>
            Export to PDF
          </button>
        </div>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="form-control"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {[...new Set(facultyData.map((f) => f.department))].map(
              (dept, i) => (
                <option key={i} value={dept}>
                  {dept}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Department</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Designation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((fac, index) => (
                <tr key={fac.id}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td>{fac.name}</td>
                  <td>{fac.department}</td>
                  <td>{fac.email}</td>
                  <td>{fac.phone}</td>
                  <td>{fac.designation}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => navigate(`/main/faculty/${fac.id}/details`)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => openEditModal(fac)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-danger me-2"
                      onClick={() => handleDelete(fac.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No matching faculty found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

      {/* Modal */}
      {showModal && (
        <div
          className="modal d-block fade show"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleFormSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {isEditing ? "Edit Faculty" : "Add Faculty"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Department *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="department"
                      value={formData.department}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Designation</label>
                    <input
                      type="text"
                      className="form-control"
                      name="designation"
                      value={formData.designation}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
                <div className="modal-footer mt-3">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {isEditing ? "Update" : "Add"}
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
