import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import AdminMenu from "./AdminMenu";

const UserList = () => {
  // State to manage editable user details
  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUsername, setEditableUsername] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  // Fetching user data using RTK Query
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  // Mutation hooks for deleting and updating user
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  // Effect to refetch user data on mount and after updates
  useEffect(() => {
    refetch();
  }, [refetch]);

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUsername,
        email: editableUserEmail,
      });
      // Resetting the editable state and triggering a refetch
      setEditableUserId(null);
      refetch();
    } catch (error) {
      toast.error(error.data.message || error.error);
    }
  };

  // Function to toggle the edit mode
  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUsername(username);
    setEditableUserEmail(email);
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure to delete this user?")) {
      try {
        await deleteUser(id);
      } catch (error) {
        toast.error(error.data.message || error.error);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-center">Users</h1>
      {/* show Loader / Error else Edit user table */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <div className="flex flex-col md:flex-row">
          <AdminMenu />
          {/* User List Table */}
          <table className="w-full md:w-4/5 mx-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">NAME</th>
                <th className="px-4 py-2 text-left">EMAIL</th>
                <th className="px-4 py-2 text-left">ADMIN</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-2">{user._id}</td>
                  <td className="px-4 py-2">
                    {editableUserId === user._id ? (
                      // Edit mode for username
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={editableUsername}
                          onChange={(e) => setEditableUsername(e.target.value)}
                          className="w-full p-2 border rounded-lg"
                        />
                        <button
                          onClick={() => updateHandler(user._id)}
                          className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      // Display mode for username
                      <div className="flex items-center">
                        {user.username} {""}
                        <button
                          onClick={() =>
                            toggleEdit(user._id, user.username, user.email)
                          }
                        >
                          <FaEdit className="ml-[1rem]" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editableUserId === user._id ? (
                      // Display mode for user email
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={editableUserEmail}
                          onChange={(e) => setEditableUserEmail(e.target.value)}
                          className="w-full p-2 border rounded-lg"
                        />
                        <button
                          onChange={() => updateHandler(user._id)}
                          className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      // Display mode for user email
                      <div className="flex items-center">
                        <p>{user.email}</p>
                        <button
                          onClick={() =>
                            toggleEdit(user._id, user.username, user.email)
                          }
                        >
                          <FaEdit className="ml-[1rem]" />
                        </button>
                      </div>
                    )}
                  </td>
                  {/* Displaying admin status */}
                  <td className="px-4 py-2">
                    {user.isAdmin ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  {/* Action - Delete Can't delete admin user */}
                  <td className="px-4 py-2">
                    {!user.isAdmin && (
                      <div className="flex">
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
