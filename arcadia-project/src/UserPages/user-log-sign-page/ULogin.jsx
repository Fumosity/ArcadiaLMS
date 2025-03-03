import LoginForm from "../../components/UserComponents/user-login-sign-up-comp/LoginForm";
import UCopyright from "../../components/UserComponents/user-main-comp/UCopyright";

const ULogin = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="absolute inset-0">
        <img
          src="/image/login-bg.jpeg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-arcadia-red opacity-95" />
      </div>

      {/* Main Content */}
      <main className="relative flex-1 flex justify-center items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="userContent-container flex justify-center items-center">
          <LoginForm />
        </div>
      </main>

      <div className="relative z-10">
        <UCopyright />
      </div>
    </div>
  );
};

export default ULogin;
