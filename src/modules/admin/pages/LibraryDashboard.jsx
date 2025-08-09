import { useState } from "react";
import PageLayout from "../../../components/PageLayout";
import { Pencil, Trash2, Plus, FileDown } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

const initialBooks = [
  {
    id: 1,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    category: "Computer Science",
    isbn: "9780262033848",
    rack: "A1",
    availability: "Available",
  },
  {
    id: 2,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    isbn: "9780743273565",
    rack: "B2",
    availability: "Issued",
  },
];

const LibraryDashboard = () => {
  const [books, setBooks] = useState(initialBooks);
  const [search, setSearch] = useState("");
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    rack: "",
    availability: "Available",
  });
  const [editId, setEditId] = useState(null);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const handleAddOrEdit = () => {
    if (editId) {
      setBooks(
        books.map((book) =>
          book.id === editId ? { ...newBook, id: editId } : book
        )
      );
      toast.success("Book updated successfully");
    } else {
      const newEntry = {
        ...newBook,
        id: books.length ? books[books.length - 1].id + 1 : 1,
      };
      setBooks([...books, newEntry]);
      toast.success("Book added successfully");
    }
    setNewBook({
      title: "",
      author: "",
      category: "",
      isbn: "",
      rack: "",
      availability: "Available",
    });
    setEditId(null);
  };

  const handleEditClick = (book) => {
    setNewBook(book);
    setEditId(book.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      setBooks(books.filter((book) => book.id !== id));
      toast.success("Book deleted successfully");
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(books);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Library");
    XLSX.writeFile(wb, "Library.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Title",
      "Author",
      "Category",
      "ISBN",
      "Rack",
      "Status",
    ];
    const tableRows = books.map(
      ({ title, author, category, isbn, rack, availability }) => [
        title,
        author,
        category,
        isbn,
        rack,
        availability,
      ]
    );
    doc.autoTable({ head: [tableColumn], body: tableRows });
    doc.save("Library.pdf");
  };

  return (
    <div className="container-fluid mt-4">
      <ToastContainer position="top-right" />
      <div className="mb-3">
        <h4>Library Management</h4>
        <div className="mb-3 mt-4 d-flex justify-content-between">
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search by title or author"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div>
            <button className="btn btn-success me-2" onClick={exportToExcel}>
              Export to Excel
            </button>
            <button className="btn btn-danger me-2" onClick={exportToPDF}>
              Export to Pdf
            </button>
          </div>
        </div>

        <table className="table table-bordered">
          <thead className="">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>ISBN</th>
              <th>Rack</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>{book.isbn}</td>
                <td>{book.rack}</td>
                <td>{book.availability}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEditClick(book)}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(book.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="card p-3 mt-4">
          <h5>{editId ? "Edit Book" : "Add New Book"}</h5>
          <div className="row g-2">
            {Object.entries(newBook).map(([key, value]) =>
              key !== "availability" ? (
                <div className="col-md-4" key={key}>
                  <input
                    name={key}
                    value={value}
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              ) : null
            )}
            <div className="col-md-4">
              <select
                name="availability"
                value={newBook.availability}
                onChange={handleChange}
                className="form-control"
              >
                <option value="Available">Available</option>
                <option value="Issued">Issued</option>
              </select>
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-primary w-100"
                onClick={handleAddOrEdit}
              >
                <Plus size={16} className="me-1" />{" "}
                {editId ? "Update Book" : "Add Book"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryDashboard;
