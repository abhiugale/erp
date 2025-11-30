// Finance.jsx - Updated with Same UI as ExamList
import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Download, IndianRupee, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "react-toastify/dist/ReactToastify.css";
import "jspdf-autotable";

const API_BASE = "http://localhost:5000/api/finance";

const Finance = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    transactionType: "FEE",
    description: "",
    amount: "",
    transactionDate: new Date().toISOString().split('T')[0]
  });
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [financialSummary, setFinancialSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0
  });
  const itemsPerPage = 5;

  // Transaction types
  const transactionTypes = [
    "FEE",
    "EXPENSE", 
    "SALARY",
    "GRANT",
    "DONATION",
    "OTHER"
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

  // Fetch transactions from API
  const fetchTransactions = async () => {
    if (!checkAuthentication()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/transactions`, {
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
        throw new Error(`Failed to fetch transactions: ${response.status}`);
      }

      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error(error.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  // Fetch financial summary
  const fetchFinancialSummary = async () => {
    if (!checkAuthentication()) return;

    try {
      const response = await fetch(`${API_BASE}/summary`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFinancialSummary(data);
      }
    } catch (error) {
      console.error("Error fetching financial summary:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchFinancialSummary();
  }, []);

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = 
      transaction.description?.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = filterType ? 
      transaction.transactionType === filterType : true;
    
    return matchesSearch && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const currentData = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // CRUD Operations
  const handleAdd = () => {
    if (!checkAuthentication()) return;

    setFormData({
      transactionType: "FEE",
      description: "",
      amount: "",
      transactionDate: new Date().toISOString().split('T')[0]
    });
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEdit = (transaction) => {
    if (!checkAuthentication()) return;

    setFormData({
      transactionType: transaction.transactionType,
      description: transaction.description,
      amount: transaction.amount.toString(),
      transactionDate: transaction.transactionDate
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    if (!checkAuthentication()) return;

    try {
      const response = await fetch(`${API_BASE}/transactions/${id}`, {
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

      toast.success("Transaction deleted successfully");
      fetchTransactions();
      fetchFinancialSummary();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error(error.message || "Failed to delete transaction");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkAuthentication()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `${API_BASE}/transactions/${formData.transactionId}` : `${API_BASE}/transactions`;

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
        throw new Error(responseData.error || `Failed to ${isEdit ? 'update' : 'create'} transaction`);
      }

      toast.success(isEdit ? "Transaction updated successfully" : "Transaction added successfully");
      setShowModal(false);
      fetchTransactions();
      fetchFinancialSummary();
    } catch (error) {
      console.error("Error saving transaction:", error);
      toast.error(error.message || "Failed to save transaction. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  // Export Functions
  const exportExcel = () => {
    if (filteredTransactions.length === 0) {
      toast.warning('No transactions data to export');
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(
        filteredTransactions.map(transaction => ({
          "Type": transaction.transactionType,
          "Description": transaction.description,
          "Amount": transaction.amount,
          "Date": transaction.transactionDate
        }))
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Finance Transactions");
      XLSX.writeFile(wb, "FinanceTransactions.xlsx");
      toast.success('Exported to Excel successfully');
    } catch (error) {
      toast.error('Error exporting to Excel');
    }
  };

  const exportPDF = () => {
    if (filteredTransactions.length === 0) {
      toast.warning('No transactions data to export');
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text("Finance Transactions Report", 14, 10);
      doc.autoTable({
        head: [["Type", "Description", "Amount", "Date"]],
        body: filteredTransactions.map(transaction => [
          transaction.transactionType,
          transaction.description,
          `₹${transaction.amount}`,
          transaction.transactionDate
        ]),
      });
      doc.save("FinanceTransactions.pdf");
      toast.success('Exported to PDF successfully');
    } catch (error) {
      toast.error('Error exporting to PDF');
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="container-fluid mt-4">
      <ToastContainer position="top-right" />

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>
          <IndianRupee size={24} className="me-2" />
          Finance Management
        </h4>
        <div>
          <button 
            className="btn btn-primary me-2" 
            onClick={handleAdd}
            disabled={loading}
          >
            <Plus size={16} className="me-1" />
            Add Transaction
          </button>
          <button
            className="btn btn-success me-2"
            onClick={exportExcel}
            disabled={loading || filteredTransactions.length === 0}
          >
            <Download size={16} className="me-1" />
            Export Excel
          </button>
          <button 
            className="btn btn-danger" 
            onClick={exportPDF}
            disabled={loading || filteredTransactions.length === 0}
          >
            <Download size={16} className="me-1" />
            Export PDF
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
                  <h6>Total Income</h6>
                  <h3>{formatCurrency(financialSummary.totalIncome)}</h3>
                </div>
                <TrendingUp size={24} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6>Total Expenses</h6>
                  <h3>{formatCurrency(financialSummary.totalExpenses)}</h3>
                </div>
                <TrendingDown size={24} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6>Net Balance</h6>
                  <h3>{formatCurrency(financialSummary.netBalance)}</h3>
                </div>
                <Wallet size={24} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6>Total Transactions</h6>
                  <h3>{transactions.length}</h3>
                </div>
                <IndianRupee size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            disabled={loading}
          >
            <option value="">All Types</option>
            {transactionTypes.map((type, index) => (
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
          <span className="ms-2">Loading transactions...</span>
        </div>
      )}

      {/* Transactions Count */}
      <div className="mb-3">
        <span className="badge bg-info">
          Total Transactions: {transactions.length} | Showing: {filteredTransactions.length}
        </span>
      </div>

      {/* Transactions Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((transaction) => (
                <tr key={transaction.transactionId}>
                  <td>
                    <span className={`badge ${
                      transaction.transactionType === 'FEE' ? 'bg-success' :
                      transaction.transactionType === 'GRANT' ? 'bg-info' :
                      transaction.transactionType === 'DONATION' ? 'bg-primary' :
                      'bg-danger'
                    }`}>
                      {transaction.transactionType}
                    </span>
                  </td>
                  <td>{transaction.description}</td>
                  <td>
                    <span className={
                      transaction.transactionType === 'FEE' || 
                      transaction.transactionType === 'GRANT' || 
                      transaction.transactionType === 'DONATION' ? 
                      'text-success fw-bold' : 'text-danger fw-bold'
                    }>
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td>{transaction.transactionDate}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-warning btn-sm me-1"
                        onClick={() => handleEdit(transaction)}
                        title="Edit Transaction"
                        disabled={loading}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(transaction.transactionId)}
                        title="Delete Transaction"
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
                <td colSpan="5" className="text-muted py-4 text-center">
                  {loading ? 'Loading transactions...' : 'No transactions found'}
                  {search || filterType ? ' matching your filters' : ''}
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
                  {isEdit ? "Edit Transaction" : "Add New Transaction"}
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
                    <label className="form-label">Transaction Type *</label>
                    <select
                      className="form-select"
                      value={formData.transactionType}
                      onChange={(e) => setFormData({...formData, transactionType: e.target.value})}
                      required
                      disabled={loading}
                    >
                      {transactionTypes.map((type, index) => (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                      disabled={loading}
                      placeholder="Enter transaction description"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Amount *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      required
                      disabled={loading}
                      placeholder="Enter amount"
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.transactionDate}
                      onChange={(e) => setFormData({...formData, transactionDate: e.target.value})}
                      required
                      disabled={loading}
                      max={new Date().toISOString().split('T')[0]}
                    />
                    <div className="form-text">Date cannot be in the future</div>
                  </div>
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
                      isEdit ? "Update Transaction" : "Add Transaction"
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

export default Finance;