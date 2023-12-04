import { useState } from "react";
import "./styles/App.css";
import ProductList from "./components/ProductList.js";

function App() {
  const [loading, setLoading] = useState(true);
  const spinner = document.getElementById("spinner");
  if (spinner) {
    setTimeout(() => {
      spinner.style.display = "none";
      setLoading(false);
    }, 2000);
  }

  return (
    !loading && (
      <div className="App">
        <div className="info-text">
          Assignment submission of{" "}
          <a
            href="https://docs.google.com/document/d/19AUvxUtQ2mPuqFrM7GP9VeivFyobqzYDUOSeFFAWokI/edit"
            target="_blank"
          >
            Andisor's frontend task
          </a>{" "}
          by{" "}
          <a href="https://www.linkedin.com/in/aikansh-garg/" target="_blank">
            Aikansh Garg.
          </a>
        </div>

        <ProductList />
      </div>
    )
  );
}

export default App;
