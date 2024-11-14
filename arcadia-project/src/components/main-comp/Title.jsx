import React from "react";

const Title = ({ children }) => (
  <div className="title">
    <div className="title-logo">
      <img src="/image/arcadia.png" alt="Book icon" className="h-15 w-15 mr-2" />
      <h2 className="text-2xl font-semibold">{children}</h2>
    </div>
  </div>
);

export default Title;