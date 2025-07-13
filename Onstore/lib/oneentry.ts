import { defineOneEntry } from "oneentry";
import retrieveRefreshToken from "@/actions/auth/retrieveRefreshToken";
import storeRefreshToken from "@/actions/auth/storeRefreshToken";

// Define the type that includes null initially
export type ApiClientType = ReturnType<typeof defineOneEntry> | null;

let apiClient: ApiClientType = null;

// Initialize the API client with a custom configuration
async function setupApiClient(): Promise<ReturnType<typeof defineOneEntry>> {
  const apiUrl = process.env.ONEENTRY_PROJECT_URL;

  if (!apiUrl) {
    throw new Error("ONEENTRY_PROJECT_URL is missing");
  }

  if (!apiClient) {
    try {
      const refreshToken = await retrieveRefreshToken();

      // Create a new instance of the API client
      apiClient = defineOneEntry(apiUrl, {
        token: process.env.ONENETRY_TOKEN,
        langCode: "en_US",
        auth: {
          refreshToken: refreshToken || undefined,
          customAuth: false,
          saveFunction: async (newToken: string) => {
            await storeRefreshToken(newToken);
          },
        },
      });
    } catch (error) {
      console.error("Error fetching refresh token:", error);
    }
  }

  if (!apiClient) {
    throw new Error("Failed to initialize API client");
  }

  return apiClient;
}

// Retrieve the current API client instance or initialize if it doesn't exist
export async function fetchApiClient(): Promise<
  ReturnType<typeof defineOneEntry>
> {
  if (!apiClient) {
    await setupApiClient();
  }

  // At this point, TypeScript knows that `apiClient` cannot be null
  if (!apiClient) {
    throw new Error("API client is still null after setup");
  }

  return apiClient;
}
