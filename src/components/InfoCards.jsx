import {
  Wallet,
  CreditCard,
  TrendingDown,
  TrendingUp,
  Users,
  UserCheck,
  UserPlus,
  ClipboardCheck,
} from "lucide-react";

const cards = [
  {
    title: "Fee Awaiting Payment",
    value: "2450/5000",
    icon: <Wallet className="me-2 text-primary" />,
  },
  {
    title: "Monthly Fee Collection",
    value: "₹9,00,000",
    icon: <CreditCard className="me-2 text-success" />,
  },
  {
    title: "Expenses of this Month",
    value: "₹5,72,136",
    icon: <TrendingDown className="me-2 text-danger" />,
  },
  {
    title: "Profits of this Month",
    value: "₹3,27,864",
    icon: <TrendingUp className="me-2 text-warning" />,
  },
  {
    title: "Teachers Present Today",
    value: "72/80",
    icon: <Users className="me-2 text-info" />,
  },
  {
    title: "Students Present Today",
    value: "4396/5000",
    icon: <UserCheck className="me-2 text-success" />,
  },
  {
    title: "Staffs Present Today",
    value: "40/40",
    icon: <UserPlus className="me-2 text-primary" />,
  },
  // {
  //   title: "Converted Leads this Month",
  //   value: "2/10",
  //   icon: <ClipboardCheck className="me-2 text-muted" />,
  // },
];

const InfoCards = () => {
  return (
    <div className="row mt-3">
      {cards.map((card, idx) => (
        <div key={idx} className="col-md-3 mb-3">
          <div className="card shadow-sm p-3 h-100">
            <div className="d-flex mb-2">
              <h6 className="mb-0">{card.title}</h6>
              <h7 className="mt-0">{card.icon}</h7>
            </div>
            <h4 className="fw-bold">{card.value}</h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InfoCards;
