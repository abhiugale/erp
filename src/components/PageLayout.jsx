const PageLayout = ({ title, children }) => {
  return (
    <div className="p-2">
      <h4 className="mb-2">{title}</h4>
      <div>{children}</div>
    </div>
  );
};

export default PageLayout;
