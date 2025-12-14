import AdminLog from "../models/adminLog"

// Log admin actions for auditing (to the database)
export const logAdminAction = async ({
  adminId,
  action,
  targetUserId,
  details,
}: {
  adminId: string
  action: string
  targetUserId?: string
  details?: string
}) => {
  try {
    await AdminLog.create({
      adminId,
      action,
      targetUserId,
      details,
    })
  } catch (err) {
    console.error("Admin log failed:", err)
  }
}
