import React from "react";

const HomeButton = () => {
  //return <div></div>
  return (
    <div
      style={{
        height: "40px",
        borderBottom: "solid",
        borderWidth: "1px",
        paddingLeft: "50px",
        marginBottom: "15px"
      }}
    >
      <span style={{ fontWeight: "bold", fontSize: "20px" }}>Home</span>
    </div>
  );
};
export default HomeButton;
