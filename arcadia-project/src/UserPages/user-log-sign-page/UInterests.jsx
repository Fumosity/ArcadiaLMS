import LoginForm from "../../components/UserComponents/user-login-sign-up-comp/LoginForm"
import UserInterests from "../../components/UserComponents/user-login-sign-up-comp/UserInterests"
import UCopyright from "../../components/UserComponents/user-main-comp/UCopyright"

const UInterests = () => {
  return (
    <div className="min-h-screen bg-red flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Content Container */}
        <div className="userContent-container flex flex-col lg:flex-row gap-8 justify-center items-start">
          {/* Sidebar */}
          <UserInterests />
        </div>
      </main>
      <UCopyright />
    </div>
  )
}

export default UInterests

