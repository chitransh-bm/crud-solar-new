import http from "http";
import { createOpenApiHttpHandler } from "trpc-openapi";
import { appRouter } from "@/server";

const server = http.createServer(
  createOpenApiHttpHandler({
    router: appRouter,
    createContext: () => {},
    responseMeta: undefined,
    onError: undefined,
    maxBodySize: undefined,
  })
); /* 👈 */

server.listen(3000);
