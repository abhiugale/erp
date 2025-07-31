import InfoCards from "../../../components/InfoCards";
import NoticeBoard from "../../../components/NoticeBoard";
import UpcomingEvents from "../../../components/UpcomingEvents";
import PageLayout from "../../../components/PageLayout";
import "./../../../css/dashboard.css";
const Dashboard = () => {
  return (
    <PageLayout title="Dashboard">
      <div className="d-flex">
        <div className="container-fluid mt-3">
          <div className="row">
            <div className="col-lg-9">
              <InfoCards />
            </div>
            <div className="col-lg-3">
              <NoticeBoard />
              <UpcomingEvents />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
