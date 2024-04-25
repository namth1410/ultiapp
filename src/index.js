import { store } from "appdata/store";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ThemeProvider } from "contexts/theme_context/ThemeContext";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setupAxios } from "ultis/api";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
setupAxios();
root.render(
  <BrowserRouter>
    <ThemeProvider>
      <Provider store={store}>
        <App />
        <ToastContainer />
      </Provider>
    </ThemeProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
