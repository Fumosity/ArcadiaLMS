import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import WrngDeleteCollege from "../../z_modals/warning-modals/WrngDeleteCollege"
import { supabase } from "../../supabaseClient"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"

const CollegeView = ({ college, onCollegeDeleted, onModifyCollege }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [departments, setDepartments] = useState([])
  const [deptLoading, setDeptLoading] = useState(true)
  const [deptError, setDeptError] = useState(null)

  useEffect(() => {
    if (college) {
      const timer = setTimeout(() => setLoading(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [college])

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!college) return;
      setDeptLoading(true);
      try {
        const { data: deptData, error: deptError } = await supabase
          .from("department_list")
          .select("*")
          .eq("collegeID", college.collegeID);

        if (deptError) throw deptError;

        // Check if there are no departments and set a message if empty
        if (deptData.length === 0) {
          setDepartments([{ departmentName: "No departments available", departmentAbbrev: "-" }]);
        } else {
          setDepartments(deptData);
        }
      } catch (error) {
        setDeptError("An error occurred while loading departments.");
      } finally {
        setDeptLoading(false);
      }
    };
    fetchDepartments();
  }, [college]);


  if (!college) {
    return (
      <div className="bg-white p-4 rounded-lg border-grey border text-center mt-12">
        Select a college to view its details.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg border-grey border mt-12">
        <h3 className="text-xl font-semibold mb-3">
          <Skeleton width={150} />
        </h3>
        <table className="min-w-full border-collapse">
          <tbody>
            {[...Array(6)].map((_, index) => (
              <tr key={index} className="border-b border-grey">
                <td className="px-1 py-1 font-semibold capitalize" style={{ width: "40%" }}>
                  <Skeleton width={80} />
                </td>
                <td className="px-1 py-1 text-sm">
                  <Skeleton width={150} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const collegeDetails = {
    name: college.collegeName,
    abbreviation: college.collegeAbbrev,
  }

  const handleModifyCollege = () => {
    if (college) {
      onModifyCollege(college); // Pass the selected college data to the parent
    }
  };

  const handleDeleteCollege = () => {
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteCollege = async () => {
    try {
      // Delete departments first
      let { error: deptError } = await supabase
        .from("department_list")
        .delete()
        .eq("collegeID", college.collegeID);

      if (deptError) throw deptError;

      // Then delete college
      const { error } = await supabase
        .from("college_list")
        .delete()
        .eq("collegeID", college.collegeID);

      if (error) throw error;

      setIsDeleteModalOpen(false);
      toast.success("College and its departments successfully deleted.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "colored",
      });

      // Notify parent that college was deleted (clear selection and refresh)
      onCollegeDeleted(null);

    } catch (error) {
      alert("An unexpected error occurred while deleting the college.");
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="">
      <div className="flex justify-center gap-2">
        <button
          className="add-book w-full mb-2 px-2 py-2 rounded-lg border-grey hover:bg-arcadia-red hover:text-white"
          onClick={handleModifyCollege}
        >
          Modify Selected College
        </button>
        <button
          className="add-book w-full mb-2 px-2 py-2 rounded-lg border-grey hover:bg-arcadia-red hover:text-white"
          onClick={handleDeleteCollege}
        >
          Delete Selected College
        </button>
      </div>


      <div className="bg-white p-4 rounded-lg border-grey border w-full min-w-min">
        <h3 className="text-2xl font-semibold mb-4">College Information</h3>

        <div className="mb-2 w-full">
          <h4 className="text-xl font-semibold mb-4">Overview</h4>
          <div className="flex flex-col gap-2">
            {Object.entries(collegeDetails).map(([key, value]) => (
              <div className="flex w-full gap-4">
                <label className="w-1/4 px-1 py-1 capitalize">{key}:</label>
                <div className="w-3/4 px-3 py-1 rounded-full border border-grey">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-4">Departments</h4>
          {deptLoading ? <p>Loading departments...</p> : deptError ? <p>{deptError}</p> : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white sticky top-0 z-10">
                <tr>
                  <th className="w-1/3 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department Abbreviation
                  </th>
                  <th className="w-2/3 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department Name
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departments.map((dept) => (
                  <tr
                    className="hover:bg-light-gray cursor-pointer border-b border-grey"
                    key={dept.departmentAbbrev}
                  >
                    <td className="w-1/3 px-4 py-2 text-center text-sm">
                      {dept.departmentAbbrev}
                    </td>
                    <td className="w-2/3 px-4 py-2 text-sm">
                      {dept.departmentName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <WrngDeleteCollege isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDeleteCollege} itemName={college.collegeAbbrev} />
    </div>
  )
}

export default CollegeView
