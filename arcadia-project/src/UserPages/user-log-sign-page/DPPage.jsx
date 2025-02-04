import DataPrivacy from "../../components/UserComponents/user-login-sign-up-comp/DataPrivacy"
import UCopyright from "../../components/UserComponents/user-main-comp/UCopyright"

const DPPage = () => {
  return (
    <div className="min-h-screen bg-red flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Content Container */}
        <div className="userContent-container flex flex-col lg:flex-row gap-8 justify-center items-start">
          {/* Sidebar */}
          <DataPrivacy />
        </div>
      </main>
      <UCopyright />
    </div>
  )
}

export default DPPage

