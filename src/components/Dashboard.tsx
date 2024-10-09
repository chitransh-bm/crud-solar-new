import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
interface User {
  userId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string | null;
  department: string | null;
  company: string | null;
  role: string;
  status: string | null;
  createdAt: string;
  deletedAt: string | null;
  lastLogin: string | null;
  timeZone: string;
  languagePref: string | null;
  lastPasswordChange: string | null;
  deviceInfo: string | null;
}

const Dashboard = () => {
  const router = useRouter();
  const {
    data: allUsers,
    error,
    isLoading,
    refetch,
  } = trpc.getAllUsers.useQuery();
  console.log(allUsers, "here");
  const [users, setUsers] = useState<User[] | undefined>(undefined);
  const mutation = trpc.deleteUser.useMutation({
    onSuccess: () => {
      console.log("User deleted successfully");
      refetch(); // Refetch the users after deletion
    },
    onError: (error) => {
      console.error("Error deleting user:", error.message);
    },
  });
  async function trpcCalls() {
    const res = await fetch("http://localhost:3000/api/say-hello", {
      method: "GET",
    });
    const body = await res.json();
    console.log(body, "dekh");
  }
  useEffect(() => {
    refetch();
    trpcCalls();
    setUsers(allUsers);
  }, [allUsers, refetch]);
  //   console.log(parsedUser, "here");
  const handleNavigationWithQuery = (userId: number) => {
    // Using the URL object format
    router.push(`/create-user?userId=${userId}`);
  };

  return (
    <div>
      <h1 className="text-5xl mb-6">All User Table</h1>

      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      <div className="container mx-auto p-4">
        {users !== undefined && users?.length > 0 ? (
          users?.map((user) => (
            <div
              key={user.userId}
              className="p-4 mb-6 border rounded-lg shadow-md bg-white"
            >
              <h1 className="text-lg font-semibold">User ID: {user.userId}</h1>
              <h1 className="text-sm text-gray-600">Email: {user.email}</h1>
              <h1 className="text-sm text-gray-600">
                First Name: {user.firstName}
              </h1>
              <h1 className="text-sm text-gray-600">
                Last Name: {user.lastName}
              </h1>
              <h1 className="text-sm text-gray-600">
                Full Name: {user.fullName}
              </h1>
              <h1 className="text-sm text-gray-600">
                Phone Number: {user.phoneNumber}
              </h1>
              <h1 className="text-sm text-gray-600">
                Job Title: {user.jobTitle || "N/A"}
              </h1>
              <h1 className="text-sm text-gray-600">
                Department: {user.department || "N/A"}
              </h1>
              <h1 className="text-sm text-gray-600">
                Company: {user.company || "N/A"}
              </h1>
              <h1 className="text-sm text-gray-600">Role: {user.role}</h1>
              <h1 className="text-sm text-gray-600">
                Time Zone: {user.timeZone}
              </h1>
              <h1 className="text-sm text-gray-600">
                Language Pref: {user.languagePref || "N/A"}
              </h1>
              <h1 className="text-sm text-gray-600">
                Device Info: {user.deviceInfo || "N/A"}
              </h1>
              <h1 className="text-sm text-gray-600">
                Created At: {new Date(user.createdAt).toLocaleDateString()}
              </h1>
              <h1 className="text-sm text-gray-600">
                Deleted At:
                {user.deletedAt
                  ? new Date(user.deletedAt).toLocaleDateString()
                  : "N/A"}
              </h1>
              <h1 className="text-sm text-gray-600">
                Last Login:{" "}
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleDateString()
                  : "N/A"}
              </h1>
              <h1 className="text-sm text-gray-600">Status: {user.status}</h1>
              <h1 className="text-sm text-gray-600">
                Last Password Change:{" "}
                {user.lastPasswordChange
                  ? new Date(user.lastPasswordChange).toLocaleDateString()
                  : "N/A"}
              </h1>

              <div className="mt-4 flex space-x-4">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => mutation.mutate({ userId: user.userId })}
                >
                  Delete User
                </button>

                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => handleNavigationWithQuery(user.userId)}
                >
                  Update User
                </button>
              </div>
            </div>
          ))
        ) : (
          <h1 className="text-center text-lg font-semibold">No users found</h1>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
