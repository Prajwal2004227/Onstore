"use server";

import { cookies } from "next/headers";

export default async function retrieveRefreshToken() {
  return cookies().get("refresh_token")?.value;
}
