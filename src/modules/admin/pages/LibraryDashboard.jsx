// LibraryDashboard.jsx - Updated for Backend Integration
import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, FileDown, Book, User, Tag, Barcode, MapPin, CheckCircle, XCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "react-toastify/dist/ReactToastify.css";
import "jspdf-autotable";

const API_BASE = "http://localhost:5000/api/library";

const LibraryDashboard = () => {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    rackLocation: "",
    available: true
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("");

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

  // Fetch books from API
  const fetchBooks = async () => {
    if (!checkAuthentication()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/books`, {
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
        throw new Error(`Failed to fetch books: ${response.status}`);
      }

      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error(error.message || "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Filter books
  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.title?.toLowerCase().includes(search.toLowerCase()) ||
      book.author?.toLowerCase().includes(search.toLowerCase()) ||
      book.isbn?.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = filterCategory ? 
      book.category === filterCategory : true;
    
    const matchesAvailability = filterAvailability ? 
      (filterAvailability === 'available' ? book.available : !book.available) : true;
    
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  // Get unique categories for filter
  const uniqueCategories = [...new Set(books.map(book => book.category).filter(Boolean))];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleAddOrEdit = async () => {
    if (!checkAuthentication()) return;

    setLoading(true);
    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API_BASE}/books/${editId}` : `${API_BASE}/books`;

      const response = await fetch(url, {
        method: method,
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || `Failed to ${editId ? 'update' : 'create'} book`);
      }

      toast.success(editId ? "Book updated successfully" : "Book added successfully");
      resetForm();
      fetchBooks();
    } catch (error) {
      console.error("Error saving book:", error);
      toast.error(error.message || "Failed to save book. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (book) => {
    setFormData({
      title: book.title || "",
      author: book.author || "",
      isbn: book.isbn || "",
      category: book.category || "",
      rackLocation: book.rackLocation || "",
      available: book.available || true
    });
    setEditId(book.bookId);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    if (!checkAuthentication()) return;

    try {
      const response = await fetch(`${API_BASE}/books/${id}`, {
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

      toast.success("Book deleted successfully");
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error(error.message || "Failed to delete book");
    }
  };

  const handleIssueReturn = async (id, action) => {
    if (!checkAuthentication()) return;

    try {
      const response = await fetch(`${API_BASE}/books/${id}/${action}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `${action} failed`);
      }

      toast.success(`Book ${action === 'issue' ? 'issued' : 'returned'} successfully`);
      fetchBooks();
    } catch (error) {
      console.error(`Error ${action} book:`, error);
      toast.error(error.message || `Failed to ${action} book`);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      isbn: "",
      category: "",
      rackLocation: "",
      available: true
    });
    setEditId(null);
  };

  const exportToExcel = () => {
    if (books.length === 0) {
      toast.warning('No books data to export');
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(books.map(book => ({
        'Title': book.title,
        'Author': book.author,
        'ISBN': book.isbn,
        'Category': book.category,
        'Rack Location': book.rackLocation,
        'Status': book.available ? 'Available' : 'Issued'
      })));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Library Books");
      XLSX.writeFile(wb, "LibraryBooks.xlsx");
      toast.success('Exported to Excel successfully');
    } catch (error) {
      toast.error('Error exporting to Excel');
    }
  };

  const exportToPDF = () => {
    if (books.length === 0) {
      toast.warning('No books data to export');
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text("Library Books Inventory", 14, 10);
      doc.autoTable({
        head: [["Title", "Author", "ISBN", "Category", "Rack", "Status"]],
        body: books.map(book => [
          book.title,
          book.author,
          book.isbn,
          book.category,
          book.rackLocation,
          book.available ? 'Available' : 'Issued'
        ]),
      });
      doc.save("LibraryBooks.pdf");
      toast.success('Exported to PDF successfully');
    } catch (error) {
      toast.error('Error exporting to PDF');
    }
  };

  return (
    <div className="container-fluid mt-4">
      <ToastContainer position="top-right" />
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>
          <Book size={24} className="me-2" />
          Library Management
        </h4>
        <div>
          <button 
            className="btn btn-success me-2" 
            onClick={exportToExcel}
            disabled={loading || books.length === 0}
          >
            <FileDown size={16} className="me-1" />
            Export to Excel
          </button>
          <button 
            className="btn btn-danger" 
            onClick={exportToPDF}
            disabled={loading || books.length === 0}
          >
            <FileDown size={16} className="me-1" />
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
                  <h6>Total Books</h6>
                  <h3>{books.length}</h3>
                </div>
                <Book size={24} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6>Available</h6>
                  <h3>{books.filter(b => b.available).length}</h3>
                </div>
                <CheckCircle size={24} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6>Issued</h6>
                  <h3>{books.filter(b => !b.available).length}</h3>
                </div>
                <XCircle size={24} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6>Categories</h6>
                  <h3>{uniqueCategories.length}</h3>
                </div>
                <Tag size={24} />
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
            placeholder="Search by title, author, or ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            disabled={loading}
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterAvailability}
            onChange={(e) => setFilterAvailability(e.target.value)}
            disabled={loading}
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="issued">Issued</option>
          </select>
        </div>
        <div className="col-md-2">
          <span className="badge bg-info">
            Showing: {filteredBooks.length} of {books.length}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center mb-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-2">Loading books...</span>
        </div>
      )}

      {/* Books Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Category</th>
              <th>Rack</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <tr key={book.bookId}>
                  <td>
                    <Book size={16} className="me-1 text-primary" />
                    {book.title}
                  </td>
                  <td>
                    <User size={16} className="me-1 text-success" />
                    {book.author}
                  </td>
                  <td>
                    <Barcode size={16} className="me-1 text-info" />
                    {book.isbn}
                  </td>
                  <td>
                    <Tag size={16} className="me-1 text-warning" />
                    {book.category}
                  </td>
                  <td>
                    <MapPin size={16} className="me-1 text-secondary" />
                    {book.rackLocation || 'N/A'}
                  </td>
                  <td>
                    <span className={`badge ${book.available ? 'bg-success' : 'bg-warning'}`}>
                      {book.available ? 'Available' : 'Issued'}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      {book.available ? (
                        <button
                          className="btn btn-info btn-sm me-1"
                          onClick={() => handleIssueReturn(book.bookId, 'issue')}
                          title="Issue Book"
                          disabled={loading}
                        >
                          Issue
                        </button>
                      ) : (
                        <button
                          className="btn btn-success btn-sm me-1"
                          onClick={() => handleIssueReturn(book.bookId, 'return')}
                          title="Return Book"
                          disabled={loading}
                        >
                          Return
                        </button>
                      )}
                      <button
                        className="btn btn-warning btn-sm me-1"
                        onClick={() => handleEditClick(book)}
                        title="Edit Book"
                        disabled={loading}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(book.bookId)}
                        title="Delete Book"
                        disabled={loading}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-muted py-4 text-center">
                  {loading ? 'Loading books...' : 'No books found'}
                  {search || filterCategory || filterAvailability ? ' matching your filters' : ''}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Book Form */}
      <div className="card p-4 mt-4 shadow-sm">
        <h5 className="card-title">
          {editId ? "Edit Book" : "Add New Book"}
        </h5>
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter book title"
              required
              disabled={loading}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Author *</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter author"
              required
              disabled={loading}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">ISBN *</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter ISBN"
              required
              disabled={loading}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Category *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter category"
              required
              disabled={loading}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Rack Location</label>
            <input
              type="text"
              name="rackLocation"
              value={formData.rackLocation}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., A1, B2"
              disabled={loading}
            />
          </div>
          <div className="col-md-1">
            <label className="form-label">Available</label>
            <div className="form-check form-switch mt-2">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className="form-check-input"
                disabled={loading}
              />
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12">
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary"
                onClick={handleAddOrEdit}
                disabled={loading || !formData.title || !formData.author || !formData.isbn || !formData.category}
              >
                <Plus size={16} className="me-1" />
                {loading ? (
                  editId ? "Updating..." : "Adding..."
                ) : (
                  editId ? "Update Book" : "Add Book"
                )}
              </button>
              {editId && (
                <button
                  className="btn btn-secondary"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryDashboard;