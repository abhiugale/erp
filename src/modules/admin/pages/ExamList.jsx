// ExamList.jsx - Exam Management Module (Phase 1)
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import PageLayout from "../../../components/PageLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const ExamList = () => {
  const [exams, setExams] = useState([
    {
      id: 1,
      name: "Mid-Term Exam",
      date: "2025-08-01",
      time: "10:00 AM",
      grade: "X",
      subject: "Mathematics",
      totalMarks: 100,
      passMarks: 35,
    },
    {
      id: 2,
      name: "Final Exam",
      date: "2025-11-10",
      time: "09:00 AM",
      grade: "XI",
      subject: "Physics",
      totalMarks: 100,
      passMarks: 40,
    },
  ]);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    date: "",
    time: "",
    grade: "",
    subject: "",
    totalMarks: "",
    passMarks: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredExams = exams.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase());
    const matchesGrade = filterGrade ? e.grade === filterGrade : true;
    return matchesSearch && matchesGrade;
  });

  const handleAdd = () => {
    setFormData({
      id: null,
      name: "",
      date: "",
      time: "",
      grade: "",
      subject: "",
      totalMarks: "",
      passMarks: "",
    });
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEdit = (exam) => {
    setFormData(exam);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      setExams(exams.filter((e) => e.id !== id));
      toast.success("Exam deleted successfully");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      setExams(exams.map((e) => (e.id === formData.id ? formData : e)));
      toast.success("Exam updated successfully");
    } else {
      setExams([...exams, { ...formData, id: Date.now() }]);
      toast.success("Exam added successfully");
    }
    setShowModal(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Exam Schedule", 14, 10);
    doc.autoTable({
      head: [["Name", "Date", "Time", "Grade", "Subject", "Total", "Pass"]],
      body: filteredExams.map((e) => [
        e.name,
        e.date,
        e.time,
        e.grade,
        e.subject,
        e.totalMarks,
        e.passMarks,
      ]),
    });
    doc.save("ExamSchedule.pdf");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredExams);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Exams");
    XLSX.writeFile(wb, "ExamSchedule.xlsx");
  };
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const currentData = filteredExams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div className="container-fluid mt-4">
      <ToastContainer />

      <div className="d-flex justify-content-between mb-3">
        <h4>Exam Management</h4>
        <div>
          <button className="btn btn-primary me-2" onClick={handleAdd}>
            + Add Exam
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
            className="form-control"
            placeholder="Search by exam or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
          >
            <option value="">All Grades</option>
            {[...new Set(exams.map((e) => e.grade))].map((grade, i) => (
              <option key={i} value={grade}>
                Grade {grade}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark text-center">
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Grade</th>
              <th>Subject</th>
              <th>Total</th>
              <th>Pass</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredExams.map((exam) => (
              <tr key={exam.id}>
                <td>{exam.name}</td>
                <td>{exam.date}</td>
                <td>{exam.time}</td>
                <td>{exam.grade}</td>
                <td>{exam.subject}</td>
                <td>{exam.totalMarks}</td>
                <td>{exam.passMarks}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(exam)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="btn btn-sm btn-danger me-2"
                    onClick={() => handleDelete(exam.id)}
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
                    {isEdit ? "Edit Exam" : "Add Exam"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {[
                    "name",
                    "date",
                    "time",
                    "grade",
                    "subject",
                    "totalMarks",
                    "passMarks",
                  ].map((field) => (
                    <div className="mb-3" key={field}>
                      <label className="form-label text-capitalize">
                        {field}
                      </label>
                      <input
                        type={field === "date" ? "date" : "text"}
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

export default ExamList;
