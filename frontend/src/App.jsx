import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useHistory } from 'react-router'
import styled from "styled-components";
import Login from "./components/Login/Login";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(#234A79, #000000);
`;

function App() {
  return (
    <Container>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
