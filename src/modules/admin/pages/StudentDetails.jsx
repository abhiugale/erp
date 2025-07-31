// StudentDetails.jsx (unchanged from before)
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "../../../components/PageLayout";

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data
  const student = {
    id,
    name: "Abhishek Ugale",
    roll: "101",
    attendance: "93%",
    subjects: ["Math", "Science", "English"],
    marks: { Math: 88, Science: 91, English: 85 },
  };

  return (
    <div className="container-fluid mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5>Name: {student.name}</h5>
          <p>Roll No: {student.roll}</p>
          <p>Attendance: {student.attendance}</p>

          <h6>Subjects & Marks</h6>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Subject</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              {student.subjects.map((subj, idx) => (
                <tr key={idx}>
                  <td>{subj}</td>
                  <td>{student.marks[subj]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
