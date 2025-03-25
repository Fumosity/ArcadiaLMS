import { useLocation } from "react-router-dom"
import UserInformationModal from "../../z_modals/UserInformationModal"
import DeleteUserAcc from "../../z_modals/attention-modals/DeleteUserAcc"
import DeleteSupadminAcc from "../../z_modals/attention-modals/DeleteSupadminAcc"
import DeleteAdminAcc from "../../z_modals/attention-modals/DeleteAdminAcc"
import { useUserInformations } from "../../backend/UInfoBackend"
import { useUser } from "../../backend/UserContext"

const UserInformations = ({ user: propUser, source }) => {
  const location = useLocation()
  const { userId } = location.state || {}
  const {
    user,
    loading,
    isModalOpen,
    setIsModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isSuperadminModalOpen,
    setIsSuperadminModalOpen,
    handleModify,
    handleDelete,
    handleUserUpdate,
    formatSchoolNo,
    canDeleteAccount,
  } = useUserInformations(propUser, userId, source)

  const { user: currentUser } = useUser() // Get current logged in user

  if (loading) return <p>Loading user data...</p>
  if (!user) return <p>No user data available</p>

  const accountTitle =
    user.userAccountType === "Student" ||
    user.userAccountType === "Faculty" ||
    user.userAccountType === "Intern" ||
    user.userAccountType === "User"
      ? "User Account Information"
      : user.userAccountType === "Admin" || user.userAccountType === "Superadmin"
        ? "Admin Account Information"
        : "Account Information"

  // Determine if delete button should be disabled
  const isDeleteDisabled = !canDeleteAccount()

  // Get tooltip message for delete button
  const getDeleteTooltip = () => {
    if (user.userAccountType === "Superadmin") {
      return "Superadmin accounts cannot be deleted"
    } else if (user.userAccountType === "Admin" && currentUser?.userAccountType !== "Superadmin") {
      return "Only Superadmin users can delete Admin accounts"
    }
    return ""
  }

  return (
    <div className="bg-white p-4 rounded-lg border-grey border">
      <h3 className="text-2xl font-semibold mb-4">{accountTitle}</h3>
      <div className="flex flex-col items-center mb-4">
        <div className="w-24 h-24 border border-grey rounded-full overflow-hidden mb-4">
          <img
            src={user.userPicture || "/image/arcadia_gray.png"}
            alt={`${user.userFName}'s profile photo`}
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-xl font-medium text-arcadia-black">
          {user.userFName || ""} {user.userLName || ""}
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-4">
          <div className="flex items-center">
            <label className="w-1/3 text-md ">Name:</label>
            <input
              className="px-3 py-1 rounded-full border border-grey w-2/3"
              value={`${user.userFName || ""} ${user.userLName || ""}`}
              readOnly
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-md ">Type:</label>
            <input
              className="px-3 py-1 rounded-full border border-grey w-2/3"
              value={user.userAccountType || ""}
              readOnly
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-md ">School ID No.:</label>
            <input className="px-3 py-1 rounded-full border border-grey w-2/3" value={user.userLPUID || ""} readOnly />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-md ">Is Verified:</label>
            <input
              className="px-3 py-1 rounded-full border border-grey w-2/3 capitalize"
              value={user.userVerifyStatus || "False"}
              readOnly
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <label className="w-1/3 text-md ">College:</label>
            <input
              className="px-3 py-1 rounded-full border border-grey w-2/3"
              value={user.userCollege || ""}
              readOnly
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-md ">Department:</label>
            <input
              className="px-3 py-1 rounded-full border border-grey w-2/3"
              value={user.userDepartment || ""}
              readOnly
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-md ">Email:</label>
            <input className="px-3 py-1 rounded-full border border-grey w-2/3" value={user.userEmail || ""} readOnly />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-md ">Password:</label>
            <input
              type="password"
              className="px-3 py-1 rounded-full border border-grey w-2/3"
              value="********"
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mt-6">
        <button
          className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
          onClick={handleModify}
        >
          Modify
        </button>
        <button
          className={`add-book w-1/4 mb-2 px-4 py-2 rounded-lg border-grey ${
            isDeleteDisabled
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "hover:bg-arcadia-red hover:text-white transition"
          }`}
          onClick={() => (isDeleteDisabled ? null : setIsDeleteModalOpen(true))}
          // disabled={isDeleteDisabled}
          //onClick={() => setIsSuperadminModalOpen(true)}
          title={getDeleteTooltip()}
        >
          Delete
        </button>
      </div>

      {user.userAccountType === "Admin" || user.userAccountType === "Superadmin" ? (
        <>
          <UserInformationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            user={user}
            onUpdate={handleUserUpdate}
          />
          <DeleteAdminAcc
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onDelete={handleDelete}
          />
          <DeleteSupadminAcc isOpen={isSuperadminModalOpen} onClose={() => setIsSuperadminModalOpen(false)} />
        </>
      ) : (
        <>
          <UserInformationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            user={user}
            onUpdate={handleUserUpdate}
          />
          <DeleteUserAcc
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  )
}

export default UserInformations

