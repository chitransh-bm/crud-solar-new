"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { trpc } from "@/app/_trpc/client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const UserForm = () => {
  const searchParams = useSearchParams();

  // Access the userId query parameter
  const userId = Number(searchParams.get("userId"));
  console.log(userId ? userId : "No userId found");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    // fullName: "",
    email: "",
    phoneNumber: "",
    jobTitle: "",
    department: "",
    company: "",
    role: "",
    timeZone: "",
    languagePref: "",
    deviceInfo: "",
  });

  // Initialize the mutations
  const createUserMutation = trpc.createUser.useMutation({
    onSuccess: (data) => {
      alert("User created successfully!");
      console.log("New user with credentials added:", data);
    },
    onError: (error) => {
      alert(`Error creating user: ${error.message}`);
    },
  });

  const updateUserMutation = trpc.updateUser.useMutation({
    onSuccess: (data) => {
      alert("User updated successfully!");
      console.log("User updated:", data);
    },
    onError: (error) => {
      alert(`Error updating user: ${error.message}`);
    },
  });

  // Fetch user data when userId is available
  const {
    data: userData,
    error,
    isLoading,
  } = trpc.getUserById.useQuery(
    { userId },
    {
      enabled: !!userId, // Only run if userId is defined
    }
  );

  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        // fullName: userData.fullName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        jobTitle: userData.jobTitle || "",
        department: userData.department || "",
        company: userData.company || "",
        role: userData.role,
        timeZone: userData.timeZone,
        languagePref: userData.languagePref || "",
        deviceInfo: userData.deviceInfo || "",
      });
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (userId) {
        updateUserMutation.mutate({ userId, ...formData });
      } else {
        createUserMutation.mutate(formData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="m-10 flex justify-center items-center flex-col gap-3">
      <h1 className="text-center text-5xl mb-5">
        {userId ? "Update here" : "Add new user here"}
      </h1>
      {isLoading && <p>Loading user data...</p>}
      {error && <p>Error loading user data: {error.message}</p>}
      {!isLoading && !error && (
        <form
          onSubmit={handleSubmit}
          className="flex justify-around items-start flex-col gap-3"
        >
          <div>
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Time Zone</label>
            <input
              type="text"
              name="timeZone"
              value={formData.timeZone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Language Preference</label>
            <input
              type="text"
              name="languagePref"
              value={formData.languagePref}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Device Info</label>
            <input
              type="text"
              name="deviceInfo"
              value={formData.deviceInfo}
              onChange={handleChange}
            />
          </div>
          <button type="submit">{userId ? "Update" : "Submit"}</button>
        </form>
      )}
    </div>
  );
};

export default UserForm;
