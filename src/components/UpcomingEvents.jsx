const events = [
  'Webinar on Career Trends for Class-X',
  'Webinar on Career Trends for Class-X',
  'Webinar on Career Trends for Class-X',
];

const UpcomingEvents = () => (
  <div className="card p-3">
    <h5>Upcoming Events</h5>
    <ul className="list-group list-group-flush">
      {events.map((event, idx) => (
        <li key={idx} className="list-group-item p-2">
          {event}
          <div className="text-muted small">23, Jun | 11:00 AM</div>
        </li>
      ))}
    </ul>
    <button className="btn btn-outline-primary btn-sm mt-2">+ Add New Event</button>
  </div>
);

export default UpcomingEvents;
