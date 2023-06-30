import React from "react";
import logo from "./logo.svg";
import "./App.css";
import styled from "styled-components";

const Row = styled.div`
  display: flex;
  justify-content: center;
  grid-gap: 1em;
  margin: 0 auto;
  max-width: 750px;
`;

function App() {
  const columns = [0, 0, 0, 0, 0, 0, 0];
  const handleClick = (direction: string) => {
    console.log(direction);
  };

  return (
    <div className="App">
      <div>
        <h1>Side Stacker</h1>

        <Row>
          <button onClick={() => handleClick("L")}>+</button>
          {columns.map((column, index) => (
            <div className="column" key={index}>
              {column}
            </div>
          ))}
          <button onClick={() => handleClick("R")}>+</button>
        </Row>
      </div>
    </div>
  );
}

export default App;
