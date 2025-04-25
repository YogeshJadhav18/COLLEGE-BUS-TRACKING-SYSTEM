import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { signOut } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { FaUsers, FaUserTie, FaTrash, FaSignOutAlt } from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = await getDocs(collection(db, "users"));
        const usersData = usersCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(usersData);
        
        // Count user types
        setStudentCount(
          usersData.filter((user) => user.userType === "student").length
        );
        setDriverCount(
          usersData.filter((user) => user.userType === "driver").length
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteDoc(doc(db, "users", id));
        setUsers(users.filter((user) => user.id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      {/* Header */}
      <div className="flex justify-between w-full max-w-6xl mb-6">
        <h1 className="text-3xl font-bold text-yellow-400">Admin Dashboard</h1>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-6xl">
        <div className="bg-blue-600 p-6 rounded-lg flex items-center gap-4 shadow-lg hover:scale-105 transition duration-300">
          <FaUsers className="text-4xl" />
          <div>
            <h2 className="text-xl font-bold">Students</h2>
            <p className="text-3xl">{studentCount}</p>
          </div>
        </div>
        <div className="bg-green-600 p-6 rounded-lg flex items-center gap-4 shadow-lg hover:scale-105 transition duration-300">
          <FaUserTie className="text-4xl" />
          <div>
            <h2 className="text-xl font-bold">Drivers</h2>
            <p className="text-3xl">{driverCount}</p>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="w-full max-w-6xl bg-gray-800 p-6 rounded-lg shadow-lg mt-6 overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">User List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-700 text-yellow-300">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (

                <tr
                  key={user.id}
                  className="border-b border-gray-700 hover:bg-gray-600 transition duration-200"
                >
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.userType}</td>
                   
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-red-600 px-3 py-2 rounded hover:bg-red-700 flex items-center gap-2"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
