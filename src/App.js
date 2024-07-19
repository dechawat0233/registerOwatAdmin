import axios from "axios";
import Navbar from "./component/navbar";
import Bar from "./component/bar";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Admin from "./page/admin";
import Detail from "./page/detail";
// import PageOne from './page/pageone';
import PageTwo from "./page/pagetwo";
import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users");
        setAllUsers(response.data);
        // console.log(data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  console.log("allUser", allUsers);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Navbar />
          <Routes>
            <Route path="/" element={<Page />} />
            {/* <Route path='/detail' element={<Detail />} /> */}

            {/* <Route path='/page-one/:id'element={<Detail />} /> */}
            {/* <Route path="/detail" element={<Detail />} /> */}
            {/* <Route
              path="/detail/:userId"
              element={<Detail allUsers={allUsers} setAllUsers={setAllUsers} />}
            /> */}
                    <Route path="/detail/:userId" element={<Detail />} />


            {/* <Route path="/page-two/:id" element={<PageTwo />} /> */}
            
            <Route path="/page-two/:userId" element={<PageTwo />} />

          </Routes>
        </header>
      </div>
    </Router>
  );
}

function Page() {
  return (
    <div style={{ display: "flex" }}>
      <Bar />
      <Admin />
    </div>
  );
}

export default App;
