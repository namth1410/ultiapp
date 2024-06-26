import { store } from "appdata/store";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ThemeProvider } from "contexts/theme_context/ThemeContext";
import ReactDOM from "react-dom/client";
import "react-medium-image-zoom/dist/styles.css";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setupAxios } from "ultis/api";
import App from "./App";
import "./index.css";

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
