import { cookies } from "next/headers";

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();

  const session =
    cookieStore.get("admin_session")?.value;

  const expectedSession =
    process.env.ADMIN_SESSION_TOKEN;

  return (
    Boolean(session) &&
    Boolean(expectedSession) &&
    session === expectedSession
  );
}