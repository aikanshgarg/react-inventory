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
          <p>
            Assignment submission of{" "}
            <a
              href="https://docs.google.com/document/d/19AUvxUtQ2mPuqFrM7GP9VeivFyobqzYDUOSeFFAWokI/edit"
              target="_blank"
              rel="noreferrer"
            >
              Andisor's frontend task
            </a>{" "}
            by{" "}
            <a
              href="https://aikanshgarg.github.io"
              target="_blank"
              rel="noreferrer"
            >
              Aikansh Garg.
            </a>
          </p>
          <p>
            Readme and the code can be accessed at my{" "}
            <a
              href="https://github.com/aikanshgarg/react-inventory"
              target="_blank"
              rel="noreferrer"
            >
              GitHub repo
            </a>
            .
          </p>
        </div>

        <ProductList />
      </div>
    )
  );
}

export default App;
