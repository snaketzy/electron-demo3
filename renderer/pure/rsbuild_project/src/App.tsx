import React from "react";
import './App.css';
// import { Button } from "antd-mobile";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();
  return (
    <div className="content">
      <h1>Rsbuild with React</h1>
      <p>Start building amazing things with Rsbuild.</p>
      {/* <div><Button onClick={ () => {
        navigate("/help")
      } }>下一步</Button></div> */}
    </div>
  );
};

export default App;
