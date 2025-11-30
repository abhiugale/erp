// FacultyAttendance.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, Users, CheckCircle, XCircle, Search, 
  Download, Filter, Plus, Edit, Trash2, Eye, ArrowLeft 
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const FacultyAttendance = () => {
  const navigate = useNavigate();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    fetchAttendanceData();
    fetchStudents();
  }, [selectedDate]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with API call
      const mockData = [
        { id: 1, date: '2024-01-15', present: 42, absent: 3, total: 45, class: 'CS101' },
        { id: 2, date: '2024-01-14', present: 40, absent: 5, total: 45, class: 'CS101' },
        { id: 3, date: '2024-01-13', present: 43, absent: 2, total: 45, class: 'MA202' },
        { id: 4, date: '2024-01-12', present: 41, absent: 4, total: 45, class: 'PH101' },
      ];
      setAttendanceRecords(mockData);
    } catch (error) {
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      // Mock students data
      const mockStudents = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        name: `Student ${i + 1}`,
        rollNo: `ROLL${String(i + 1).padStart(3, '0')}`,
        present: Math.random() > 0.3
      }));
      setStudents(mockStudents);
    } catch (error) {
      toast.error("Failed to load students");
    }
  };

  const handleAttendanceToggle = (studentId) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, present: !student.present }
        : student
    ));
  };

  const submitAttendance = async () => {
    setLoading(true);
    try {
      // API call to save attendance
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Attendance marked successfully!");
      setShowMarkAttendance(false);
      fetchAttendanceData();
    } catch (error) {
      toast.error("Failed to save attendance");
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Attendance Report", 14, 10);
    
    doc.autoTable({
      head: [['Date', 'Class', 'Present', 'Absent', 'Total', 'Percentage']],
      body: attendanceRecords.map(record => [
        record.date,
        record.class,
        record.present,
        record.absent,
        record.total,
        `${((record.present / record.total) * 100).toFixed(1)}%`
      ]),
    });

    doc.save("AttendanceReport.pdf");
    toast.success("Attendance exported to PDF successfully");
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
      attendanceRecords.map(record => ({
        'Date': record.date,
        'Class': record.class,
        'Present': record.present,
        'Absent': record.absent,
        'Total': record.total,
        'Percentage': `${((record.present / record.total) * 100).toFixed(1)}%`
      }))
    );
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, "AttendanceReport.xlsx");
    toast.success("Attendance exported to Excel successfully");
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setShowMarkAttendance(true);
    toast.info(`Editing attendance for ${record.date}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this attendance record?")) return;
    
    try {
      // API call to delete attendance record
      await new Promise(resolve => setTimeout(resolve, 500));
      setAttendanceRecords(attendanceRecords.filter(record => record.id !== id));
      toast.success("Attendance record deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete attendance record");
    }
  };

  const handleView = (record) => {
    toast.info(`Viewing attendance details for ${record.date}`);
    // You can navigate to a detailed view page or show a modal with details
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
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
              <Calendar size={24} className="me-2" />
              Attendance Management
            </h3>
            <p className="text-muted">Manage and track student attendance</p>
          </div>
        </div>
        <div>
          <button 
            className="btn btn-primary me-2"
            onClick={() => {
              setEditingRecord(null);
              setShowMarkAttendance(true);
            }}
          >
            <Plus size={16} className="me-1" />
            Mark Attendance
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

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select className="form-select">
            <option>All Classes</option>
            <option>CS101 - Programming</option>
            <option>MA202 - Calculus</option>
            <option>PH101 - Physics</option>
          </select>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <Users size={24} />
              <h4>{students.length}</h4>
              <small>Total Students</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <CheckCircle size={24} />
              <h4>{students.filter(s => s.present).length}</h4>
              <small>Present Today</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body text-center">
              <XCircle size={24} />
              <h4>{students.filter(s => !s.present).length}</h4>
              <small>Absent Today</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <Filter size={24} />
              <h4>{((students.filter(s => s.present).length / students.length) * 100).toFixed(1)}%</h4>
              <small>Attendance Rate</small>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Attendance History</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Class</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Total</th>
                  <th>Percentage</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map(record => (
                  <tr key={record.id}>
                    <td>{record.date}</td>
                    <td>{record.class}</td>
                    <td>
                      <span className="badge bg-success">{record.present}</span>
                    </td>
                    <td>
                      <span className="badge bg-danger">{record.absent}</span>
                    </td>
                    <td>{record.total}</td>
                    <td>
                      <span className="badge bg-info">
                        {((record.present / record.total) * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button 
                          className="btn btn-sm btn-outline-info"
                          onClick={() => handleView(record)}
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => handleEdit(record)}
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(record.id)}
                        >
                          <Trash2 size={14} />
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

      {/* Mark Attendance Modal */}
      {showMarkAttendance && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingRecord ? `Edit Attendance - ${editingRecord.date}` : `Mark Attendance - ${selectedDate}`}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowMarkAttendance(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Student Name</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map(student => (
                        <tr key={student.id}>
                          <td>{student.rollNo}</td>
                          <td>{student.name}</td>
                          <td>
                            <span className={`badge ${student.present ? 'bg-success' : 'bg-danger'}`}>
                              {student.present ? 'Present' : 'Absent'}
                            </span>
                          </td>
                          <td>
                            <button
                              className={`btn btn-sm ${student.present ? 'btn-outline-danger' : 'btn-outline-success'}`}
                              onClick={() => handleAttendanceToggle(student.id)}
                            >
                              {student.present ? 'Mark Absent' : 'Mark Present'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowMarkAttendance(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={submitAttendance}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : editingRecord ? 'Update Attendance' : 'Save Attendance'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyAttendance;