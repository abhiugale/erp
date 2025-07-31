// FacultyDetails.jsx
import { useParams } from "react-router-dom";
import PageLayout from "../../../components/PageLayout";
import { useNavigate } from "react-router-dom";
const faculties = [
  {
    id: 1,
    name: "Dr. Ramesh Iyer",
    department: "Physics",
    email: "ramesh@example.com",
    phone: "9876543210",
    subjects: ["Mechanics", "Optics"],
    qualifications: "Ph.D. in Physics",
    joiningDate: "2012-06-01",
  },
  {
    id: 2,
    name: "Ms. Shalini Rao",
    department: "Mathematics",
    email: "shalini@example.com",
    phone: "9123456780",
    subjects: ["Algebra", "Calculus"],
    qualifications: "M.Sc. in Mathematics",
    joiningDate: "2018-09-15",
  },
];

const FacultyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const faculty = faculties.find((f) => f.id === parseInt(id));

  if (!faculty) {
    return (
      <PageLayout title="Faculty Details">
        <p>Faculty not found.</p>
      </PageLayout>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>
      <div className="card p-4 shadow-sm">
        <h5>
          <span className="fw-bold">Name:</span> {faculty.name}
        </h5>
        <h5>
          <span className="fw-bold">Department:</span> {faculty.department}
        </h5>
        <p>
          <span className="fw-bold">Email:</span> {faculty.email}
        </p>
        <p>
          <span className="fw-bold">Phone:</span> {faculty.phone}
        </p>
        <p>
          <span className="fw-bold">Qualifications:</span>{" "}
          {faculty.qualifications}
        </p>
        <p>
          <span className="fw-bold">Joining Date:</span> {faculty.joiningDate}
        </p>
        <h6>
          <span className="fw-bold">Subjects:</span>
        </h6>
        <ul>
          {faculty.subjects.map((subject, index) => (
            <li key={index}>{subject}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FacultyDetails;
