import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import { connectDB } from "../../lib/mongodb";
import User from "../../models/User";
import AdminShell from "./AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");
  let valid = false;
  try {
    await connectDB();
    const user: any = await User.findById(session.sub)
      .select("role isActive sessionVersion")
      .lean();
    valid = Boolean(
      user &&
      user.role === "ADMIN" &&
      user.isActive !== false &&
      Number(user.sessionVersion || 0) === session.sessionVersion,
    );
  } catch {
    valid = false;
  }
  if (!valid) redirect("/");
  return <AdminShell>{children}</AdminShell>;
}
