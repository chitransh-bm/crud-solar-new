import { trpc } from "@/app/_trpc/client";
import { useState } from "react";

const UserFetcher = () => {
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [email, setEmail] = useState("");

  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = trpc.getUser.useQuery(
    { userId, email },
    { enabled: false } // Disable automatic query execution
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refetch(); // Manually trigger the query
  };

  return (
    <div>
      <h1>Fetch User by ID or Email</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>User ID (optional)</label>
          <input
            type="number"
            value={userId === undefined ? "" : userId} // Convert number to string for input
            onChange={(e) => {
              const value = e.target.value;
              setUserId(value ? Number(value) : undefined); // Convert to number or set to undefined
            }}
          />
        </div>
        <div>
          <label>Email (optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">Fetch User</button>
      </form>

      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {user && <div>User: {JSON.stringify(user)}</div>}
    </div>
  );
};

export default UserFetcher;
