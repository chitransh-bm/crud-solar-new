// components/Navbar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname(); // Get current pathname to highlight active link

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-lg">Spartan solar</div>
        <div className="flex space-x-4">
          <Link
            href="/dashboard"
            className={`${
              pathname === "/" ? "text-yellow-500" : "text-white"
            } hover:text-yellow-500`}
          >
            Dashboard
          </Link>
          <Link
            href="/create-user"
            className={`${
              pathname === "/create-user" ? "text-yellow-500" : "text-white"
            } hover:text-yellow-500`}
          >
            Create User
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
