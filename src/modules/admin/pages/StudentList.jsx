import { useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import PageLayout from "../../../components/PageLayout";
import "react-toastify/dist/ReactToastify.css";

const StudentList = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([
    { id: 1, name: "Abhishek Ugale", roll: "101", grade: "X", section: "A" },
    { id: 2, name: "Priya Sharma", roll: "102", grade: "X", section: "B" },
    { id: 3, name: "Rohan Mehta", roll: "103", grade: "XI", section: "A" },
    { id: 4, name: "Sneha Kapoor", roll: "104", grade: "XI", section: "B" },
  ]);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    roll: "",
    grade: "",
    section: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(students);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "StudentList.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Student List", 14, 10);
    doc.autoTable({
      head: [["Roll", "Name", "Grade", "Section"]],
      body: filteredStudents.map((s) => [s.roll, s.name, s.grade, s.section]),
    });
    doc.save("StudentList.pdf");
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roll.includes(searchQuery);
    const matchesGrade = filterGrade ? s.grade === filterGrade : true;
    return matchesSearch && matchesGrade;
  });

  const handleAdd = () => {
    setFormData({ id: null, name: "", roll: "", grade: "", section: "" });
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEdit = (student) => {
    setFormData(student);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (confirmDelete) {
      setStudents(students.filter((s) => s.id !== id));
      toast.success("Student deleted successfully");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      setStudents(students.map((s) => (s.id === formData.id ? formData : s)));
      toast.success("Student updated successfully");
    } else {
      setStudents([...students, { ...formData, id: Date.now() }]);
      toast.success("Student added successfully");
    }
    setShowModal(false);
  };
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const currentData = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div className="container-fluid mt-4">
      <ToastContainer position="top-right" />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Student Management</h4>
        <div>
          <button className="btn btn-primary me-2" onClick={handleAdd}>
            + Add Student
          </button>
          <button
            className="btn btn-outline-success me-2"
            onClick={exportExcel}
          >
            Export to Excel
          </button>
          <button className="btn btn-outline-danger me-2" onClick={exportPDF}>
            Export to PDF
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <input
            type="text"
            placeholder="Search by name or roll no..."
            className="form-control"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
          >
            <option value="">All Grades</option>
            {[...new Set(students.map((s) => s.grade))].map((grade, i) => (
              <option key={i} value={grade}>
                Grade {grade}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped text-center">
          <thead className="table-dark">
            <tr className="">
              <th>Roll No.</th>
              <th>Name</th>
              <th>Grade</th>
              <th>Section</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="">
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.roll}</td>
                <td>{student.name}</td>
                <td>{student.grade}</td>
                <td>{student.section}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm me-2"
                    onClick={() => navigate(`/main/students/${student.id}/details`)}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(student)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => handleDelete(student.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
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
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
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
                  ></button>
                </div>
                <div className="modal-body">
                  {["name", "roll", "grade", "section"].map((field) => (
                    <div className="mb-3" key={field}>
                      <label className="form-label text-capitalize">
                        {field}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name={field}
                        value={formData[field]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [e.target.name]: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">
                    {isEdit ? "Update" : "Add"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
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
