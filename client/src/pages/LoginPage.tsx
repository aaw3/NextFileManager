import { Link } from "react-router-dom";
import Login from "../components/login/Login";
import OIDCProvider from "../components/login/OIDCProvider";
const LoginPage = () => {
  return (
    <section className="bg-gray-50 h-full dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Login />
      </div>
    </section>
  );
};

export default LoginPage;
