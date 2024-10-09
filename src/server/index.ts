import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import { users } from "./drizzle/schema";
import { db } from "./drizzle/drizzle";
import { eq, sql } from "drizzle-orm";

const createUserSchema = z.object({
  userId: z.number().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  fullName: z.string().min(1, "Last name is required").optional(),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  company: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  status: z.string().default("active"),
  timeZone: z.string().min(1, "Time zone is required"),
  languagePref: z.string().default("en"),
  lastPasswordChange: z.date().optional(),
  deviceInfo: z.string().optional(),
});
const getUserSchema = z
  .object({
    userId: z.number().optional(),
    email: z.string().email("Invalid email format").optional(),
  })
  .refine((data) => data.userId !== undefined || data.email !== undefined, {
    message: "Either userId or email must be provided",
  });
export const appRouter = router({
  getHello: publicProcedure.meta({
    openapi: {
      method: "GET",
      path: "/say-hello",
      summary: "Get hello message",
      tags: ["hello"],
    },
  }).query(() => {
    return {
      greeting: `Hello from trpc!`,
    };
  }),
  createUser: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input }) => {
      try {
        const newUser = await db.insert(users).values({
          firstName: input.firstName,
          lastName: input.lastName,
          fullName: input.firstName + " " + input.lastName,
          email: input.email,
          phoneNumber: input.phoneNumber,
          jobTitle: input.jobTitle,
          department: input.department,
          company: input.company,
          role: input.role,
          status: input.status,
          createdAt: new Date(),
          deletedAt: null,
          lastLogin: null,
          timeZone: input.timeZone,
          languagePref: input.languagePref,
          lastPasswordChange: input.lastPasswordChange || null,
          deviceInfo: input.deviceInfo || null,
        });

        return newUser;
      } catch (error) {
        const errorMessage =
          (error as Error).message || "An unknown error occurred";

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error creating user: ${errorMessage}`,
        });
      }
    }),
  getUser: publicProcedure.input(getUserSchema).query(async ({ input }) => {
    const { userId, email } = input;

    const conditions = [];

    if (userId !== undefined) {
      conditions.push(sql`${users.userId} = ${userId}`);
    }

    if (email) {
      conditions.push(sql`${users.email} = ${email}`);
    }

    if (conditions.length === 0) {
      throw new Error("At least one of userId or email must be provided");
    }

    const queryCondition =
      conditions.length > 1 ? sql.join(conditions, " AND ") : conditions[0];

    const user = await db.select().from(users).where(queryCondition).execute();

    if (!user || user.length === 0) {
      throw new Error("User not found");
    }

    return user[0];
  }),
  getAllUsers: publicProcedure.query(async () => {
    const allUsers = await db
      .select()
      .from(users)
      .where(eq(users.status, "active"))
      .execute();
    return allUsers;
  }),
  deleteUser: publicProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      const { userId } = input;
      try {
        const deletedUser = await db
          .update(users) // Reference the users table directly
          .set({
            status: "inactive", // Set the status to 'inactive'
            deletedAt: new Date(), // Set the 'deleted_at' field to the current date and time
          })
          .where(eq(users.userId, userId)) // Ensure the userId matches
          .execute();

        return deletedUser;
      } catch (error) {
        const errorMessage =
          (error as Error).message || "An unknown error occurred";
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error deleting user: ${errorMessage}`,
        });
      }
    }),
  updateUser: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input }) => {
      const { userId, lastPasswordChange, ...updateFields } = input;

      // Ensure userId is defined
      if (userId === undefined) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User ID must be provided.",
        });
      }

      // Initialize the fields that will be sent for the update
      const fieldsToUpdate: Record<string, unknown> = { ...updateFields };

      // Convert lastPasswordChange from string to Date if provided
      if (lastPasswordChange) {
        fieldsToUpdate.lastPasswordChange = new Date(lastPasswordChange);
      }

      // Construct fullName only if both firstName and lastName are provided
      if (input.firstName && input.lastName) {
        fieldsToUpdate.fullName = `${input.firstName} ${input.lastName}`;
      }

      try {
        const updatedUser = await db
          .update(users)
          .set(fieldsToUpdate) // Use the fieldsToUpdate object
          .where(eq(users.userId, userId))
          .execute();

        // You can handle the response as needed, check if any rows were updated
        if (!updatedUser) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `User with ID ${userId} not found`,
          });
        }

        return updatedUser;
      } catch (error) {
        const errorMessage =
          (error as Error).message || "An unknown error occurred";

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error updating user: ${errorMessage}`,
        });
      }
    }),
  getUserById: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const { userId } = input;
      try {
        const user = await db
          .select()
          .from(users)
          .where(eq(users.userId, userId)) // Fetch the user by ID
          .execute();

        // Assuming `execute` returns an array, get the first item
        if (!user || user.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `User with ID ${userId} not found`,
          });
        }

        return user[0]; // Return the single user object
      } catch (error) {
        const errorMessage =
          (error as Error).message || "An unknown error occurred";
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error fetching user: ${errorMessage}`,
        });
      }
    }),
});
export type AppRouter = typeof appRouter;
