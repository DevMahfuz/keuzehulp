import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom"; // Assuming you're using React Router

const Breadcrumb = () => {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    const pathnames = location.pathname.split("/").filter((x) => x);

    const breadcrumbs = pathnames.map((_, index) => {
      const url = `/${pathnames.slice(0, index + 1).join("/")}`;
      return {
        path: url,
        name: pathnames[index],
      };
    });

    setBreadcrumbs(breadcrumbs);
  }, [location]);

  return (
    <div className="breadcrumb">
      Begin:
      {breadcrumbs.map((breadcrumb, index) => (
        <span key={breadcrumb.path}>
          <Link to={breadcrumb.path}>{breadcrumb.name}</Link>
          {index < breadcrumbs.length - 1 && " >>"}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;
