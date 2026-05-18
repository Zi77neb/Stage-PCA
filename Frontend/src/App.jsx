import { useContext, useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import API from "./services/api";
import { AuthContext } from "./context/AuthContext";

function App() {

  const { setUser } = useContext(AuthContext);

  useEffect(() => {

    API.get("/auth/me")

      .then(res => {

        localStorage.setItem(
          "user",
          JSON.stringify(res.data)
        );

        setUser(res.data);
      })

      .catch(() => {

        localStorage.removeItem("user");

        setUser(null);
      });

  }, []);

  return <AppRoutes />;
}

export default App;