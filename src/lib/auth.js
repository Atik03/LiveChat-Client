import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

import { generateUniqueUsername } from "./username";

const client = new MongoClient(process.env.MONGODB_URI);

const db = client.db(process.env.MONGODB_DB_NAME);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      username: {
        type: "string",
        required: false,
        input: false,
        returned: true,
      },
      isOnline: {
        type: "boolean",
        required: false,
        input: false,
        returned: true,
      },

      lastSeen: {
        type: "date",
        required: false,
        input: false,
        returned: true,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const username = await generateUniqueUsername(user.name, db);

          return {
            data: {
              ...user,
              username,
              isOnline: true,
              lastSeen: null,
            },
          };
        },
      },
    },
  },
});
