import React, {useState} from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from "styled-components";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";

const Container = styled.div`
`;

function App() {

  const [user, setUser] = useState({'ID_USER':-1, 'FULL_NAME':'','EMAIL':'', 'DPI':'', 'APP_PASSWORD':'', 'PICTURE':''})

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
          <Route path="/Home">
            <Route index element={
              <Home user={user} setUser={setUser} />
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
