import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css";
import routers from "./router";
import Default from "./components/Default";
import { useDispatch } from "react-redux";
import { getUser } from "./redux/action/userAction";
import { getAllProductRd } from "./redux/action/productAction";
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUser());
    dispatch(getAllProductRd());
  }, []);
  return (
    <div className="App">
      <Router>
        <Routes>
          {routers.map((route) => {
            const Page = route.page;
            const isShowHeader = route.isShowHeader;
            const Layout = isShowHeader ? Default : Fragment;
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;
