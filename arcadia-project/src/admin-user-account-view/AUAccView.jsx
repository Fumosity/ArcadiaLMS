import { useLocation, useNavigate } from "react-router-dom"
import Title from "../components/main-comp/Title"
import AUserCirc from "../components/admin-user-account-view-comp/AUserCirc"
import RecentReports from "../components/admin-user-support-report-view-comp/RecentReports"
import RecentSupport from "../components/admin-user-support-report-view-comp/RecentSupport"
import UserInformations from "../components/admin-user-account-view-comp/UserInformations"

const AUAccView = () => {
  const location = useLocation()
  const user = location.state?.user || {}
  const navigate = useNavigate()
  const source = location.state?.source || "useraccounts" // Default source is useraccounts

  // Determine the return path based on the source
  const getReturnPath = () => {
    if (source === "settings") {
      return "/admin/accountview"
    }
    return "/admin/useraccounts"
  }

  // Determine the title based on user type
  const getTitle = () => {
    const userType = user.type || user.userAccountType

    if (["Student", "Teacher", "Intern", "User"].includes(userType)) {
      return "User Account Viewer"
    } else if (["Admin", "Superadmin"].includes(userType)) {
      return "Admin Account Viewer"
    }
    return "Account Viewer"
  }

  return (
    <div className="min-h-screen bg-white">
      <Title>{getTitle()}</Title>

      <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
        <div className="flex-shrink-0 w-3/4">
          <div className="flex justify-between w-full gap-2">
            <button
              className="add-book w-1/2 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={() => navigate(getReturnPath())}
            >
              {source === "settings" ? "Return to Settings" : "Return to User Accounts"}
            </button>
          </div>
          <div className="space-y-2">
            <UserInformations user={user} source={source} />
            <AUserCirc user={user} source={source} />
          </div>
        </div>

        <div className="flex flex-col items-start flex-shrink-0 w-1/4 mt-12">
          <div className="w-full space-y-2">
            <RecentReports user={user} />
            <RecentSupport user={user} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AUAccView

