import React from "react";

const Title = ({ children }) => (
  <div className="title">
    <div className="title-logo">
      <img src="/image/arcadia_gray.png" alt="Book icon" className="h-15 w-15 mr-2" style={{width: '52px', height: '52px'}} />
      <h2 className="text-2xl font-semibold">{children}</h2>
    </div>
  </div>
);

export default Title;