import React from "react";
import { Link } from "react-router-dom";

const FooterNavItems = ({ items }) => {
  return (
    <ul className="list-unstyled">
      {items.map((item, i) => (
        <li key={i} className="mb-2">
          <Link to={item.url || "#"} className="text-white text-decoration-none">
            {item.nombre}
          </Link>
          {item.urls && (
            <ul className="list-unstyled ms-3">
              {item.urls.map((subItem, j) => (
                <li key={j}>
                  <Link to={subItem.url} className="text-white text-decoration-none">
                    {subItem.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default FooterNavItems;
