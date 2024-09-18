import { Link } from "react-router-dom";
import Login from "@components/login/Login.jsx";
import OIDCProvider from "../components/login/OIDCProvider";
const LoginPage = () => {
  return (
    <section class="bg-gray-50 h-full dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            class="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          NextFileManager
        </a>
        <Login />
      </div>
    </section>
  );
};

export default LoginPage;
