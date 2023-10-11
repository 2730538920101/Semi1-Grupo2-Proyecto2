import React, {useState} from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from "styled-components";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

const Container = styled.div`
`;

function App() {

  const [user, setUser] = useState({'user':'', 'password':''})

  return (
    <Container>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={
              <Login user={user} setUser={setUser} />
            } />
          </Route>
          <Route path="/register">
            <Route index element={
              <Register user={user} setUser={setUser} />
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
