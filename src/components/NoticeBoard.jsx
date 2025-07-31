const notices = [
  'Result for Class IX is out Now!!!',
  'Result for Class VIII is out Now!!!',
  'Result for Class VII is out Now!!!',
  'Result for Class VI is out Now!!!',
];

const NoticeBoard = () => (
  <div className="card p-3 mb-3">
    <h5>Notice Board</h5>
    <ul className="list-group list-group-flush">
      {notices.map((notice, idx) => (
        <li key={idx} className="list-group-item text-danger p-1">
          {notice}
          <div className="text-muted small">Today, 11:00 am</div>
        </li>
      ))}
    </ul>
    <button className="btn btn-outline-primary btn-sm mt-2">+ Add New Notice</button>
  </div>
);

export default NoticeBoard;
