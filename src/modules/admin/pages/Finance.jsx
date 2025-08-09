// Finance.jsx
import { useState } from "react";
import PageLayout from "../../../components/PageLayout";
import { Download, Plus, Search } from "lucide-react";
import { ToastContainer } from "react-toastify";
import { Button, Modal, Table, Form } from "react-bootstrap";
import { utils, writeFile } from "xlsx";

const Finance = () => {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [financeRecords, setFinanceRecords] = useState([
    {
      id: 1,
      type: "Fee",
      description: "Tuition Fee - Semester 1",
      amount: 30000,
      date: "2025-07-01",
    },
    {
      id: 2,
      type: "Expense",
      description: "Library Books",
      amount: 12000,
      date: "2025-07-10",
    },
  ]);

  const [newRecord, setNewRecord] = useState({
    type: "Fee",
    description: "",
    amount: "",
    date: "",
  });

  const filteredRecords = financeRecords.filter((record) =>
    record.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddRecord = () => {
    const updated = [
      ...financeRecords,
      { id: Date.now(), ...newRecord, amount: parseFloat(newRecord.amount) },
    ];
    setFinanceRecords(updated);
    setShowModal(false);
    setNewRecord({ type: "Fee", description: "", amount: "", date: "" });
  };

  const handleExport = (type) => {
    const ws = utils.json_to_sheet(financeRecords);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Finance");
    writeFile(wb, `FinanceRecords.${type}`);
  };

  return (
    <div className="container-fluid mt-4">
      <ToastContainer position="top-right" />
      <h4>Finance Management</h4>
      <div className="d-flex justify-content-between align-items-center mb-3 mt-4 ">
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search by title or author"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        <div>
          <Button
            variant="success"
            className="me-2"
            onClick={() => handleExport("xlsx")}
          >
            <Download size={16} className="me-1" /> Export Excel
          </Button>
          <Button
            variant="danger"
            className="me-2"
            onClick={() => handleExport("pdf")}
          >
            <Download size={16} className="me-1" /> Export PDF
          </Button>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus size={16} className="me-1" /> Add Record
          </Button>
        </div>
      </div>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record, index) => (
            <tr key={record.id}>
              <td>{index + 1}</td>
              <td>{record.type}</td>
              <td>{record.description}</td>
              <td>{record.amount}</td>
              <td>{record.date}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Finance Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={newRecord.type}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, type: e.target.value })
                }
              >
                <option value="Fee">Fee</option>
                <option value="Expense">Expense</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={newRecord.description}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, description: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                value={newRecord.amount}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, amount: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={newRecord.date}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, date: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddRecord}>
            Add Record
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Finance;
