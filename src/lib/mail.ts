import nodemailer from "nodemailer"

const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })
}

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000"

// Compact Premium 'Image UI' Header
const EMAIL_HEADER = `
  <div style="background: #0f172a; padding: 30px 20px; text-align: center; border-radius: 20px 20px 0 0; position: relative; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.1);">
    <!-- Sharp Spectral Glows -->
    <div style="position: absolute; top: -40px; left: -40px; width: 180px; height: 180px; background: radial-gradient(circle, rgba(37, 99, 235, 0.3) 0%, transparent 70%); border-radius: 50%;"></div>
    <div style="position: absolute; bottom: -40px; right: -40px; width: 150px; height: 150px; background: radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%); border-radius: 50%;"></div>
    
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="position: relative; z-index: 10;">
      <tr>
        <td align="center">
          <div style="background: rgba(255,255,255,0.03); padding: 16px 24px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); display: inline-block; backdrop-filter: blur(8px);">
            <div style="width: 48px; height: 48px; background: #ffffff; border-radius: 12px; display: inline-block; vertical-align: middle; margin-right: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.4);">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" height="100%">
                <tr>
                  <td align="center" style="font-size: 24px; font-weight: 900; color: #1e40af; vertical-align: middle;">C</td>
                </tr>
              </table>
            </div>
            <div style="display: inline-block; vertical-align: middle; text-align: left;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: -1px; font-style: italic; line-height: 1;">CMS <span style="color: #3b82f6;">GLOBAL</span></h1>
              <p style="margin: 2px 0 0 0; font-size: 8px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 3px; opacity: 0.8;">Registry System</p>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
`

// Common Email Wrapper
const EMAIL_WRAPPER_START = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', system-ui, sans-serif; background-color: #0f172a;">
  <div style="max-width: 580px; margin: 0 auto; padding: 20px;">
    <div style="background: #ffffff; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
      ${EMAIL_HEADER}
`

const EMAIL_WRAPPER_END = `
      <!-- Footer -->
      <div style="padding: 32px; background: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
        <p style="margin: 0 0 8px 0; font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
          Secure Automated Notification
        </p>
        <p style="margin: 0; font-size: 11px; color: #cbd5e1;">
          Issued by CMS Global Node. This is a system-generated message.
        </p>
        <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #f1f5f9;">
          <p style="margin: 0; font-size: 10px; color: #e2e8f0; font-weight: 600;">
            &copy; 2026 CMS INFRASTRUCTURE &bull; GLOBAL OPERATIONS
          </p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`

async function sendEmail(to: string, subject: string, html: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"CMS Global Registry" <noreply@example.com>',
    to,
    subject,
    html
  }

  try {
    if (!process.env.EMAIL_SERVER_PASSWORD || process.env.EMAIL_SERVER_PASSWORD.includes("YOUR_GMAIL")) {
      console.log("------------------------------------------")
      console.log(`📩 [SIMULATED] EMAIL TO ${to}`)
      console.log(`Subject: ${subject}`)
      console.log("------------------------------------------")
      return { success: true, simulated: true }
    }

    const transporter = getTransporter()
    const info = await transporter.sendMail(mailOptions)
    console.log(`[MAIL] Email sent to ${to}: ${info.messageId}`)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error(`[MAIL] Error sending email to ${to}:`, error)
    return { success: false, error }
  }
}

// ============================================
// 1. VERIFICATION EMAIL
// ============================================
export async function sendVerificationEmail(email: string, otp: string) {
  const html = `
    ${EMAIL_WRAPPER_START}
    <div style="padding: 30px 24px;">
      <div style="text-align: center;">
        <h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 900; color: #0f172a; font-style: italic;">Identity Verification</h1>
        <p style="margin: 0 0 24px 0; color: #64748b; font-size: 14px; font-weight: 600;">Secure code for your CMS Global Profile.</p>
      </div>
      
      <div style="background: #f8fafc; border-radius: 16px; padding: 24px; margin: 0 0 24px 0; text-align: center; border: 2px dashed #e2e8f0;">
        <div style="font-family: 'Courier New', monospace; font-size: 42px; font-weight: 900; letter-spacing: 12px; color: #1e40af; font-style: italic;">
          ${otp}
        </div>
      </div>
      
      <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 0 12px 12px 0;">
        <p style="margin: 0; font-size: 13px; color: #92400e; font-weight: 600; line-height: 1.4;">
          <strong>⏱ Expires in 10 minutes.</strong> Never share this code.
        </p>
      </div>
    </div>
    ${EMAIL_WRAPPER_END}
  `
  return sendEmail(email, "🔒 Your CMS Verification Code", html)
}

// ============================================
// 2. ACCOUNT CREATED EMAIL (NEW)
// ============================================
export async function sendAccountCreatedEmail(data: {
  email: string,
  name: string,
  username: string
}) {
  const html = `
    ${EMAIL_WRAPPER_START}
    <div style="padding: 30px 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="margin: 0 0 4px 0; font-size: 24px; font-weight: 900; color: #0f172a; font-style: italic;">We're So Grateful! 💝</h1>
        <p style="margin: 0; color: #64748b; font-size: 14px; font-weight: 600;">Welcome to CMS Global community.</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%); border-radius: 16px; padding: 20px; margin: 0 0 20px 0; border: 1px solid #c8e6c9;">
        <p style="margin: 0; font-size: 14px; color: #2e7d32; line-height: 1.6; font-weight: 500;">
          Welcome home, <strong>${data.name}</strong>! We are truly honored to have you with us. Your account is now fully active.
        </p>
      </div>
      
      <div style="background: #ffffff; border-radius: 16px; padding: 16px; margin: 0 0 24px 0; border: 1px solid #f1f5f9; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-size: 13px; color: #64748b;">Username</td>
            <td style="padding: 8px 0; font-size: 13px; color: #1e40af; font-weight: 800; text-align: right; font-style: italic;">@${data.username}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 13px; color: #64748b;">Email</td>
            <td style="padding: 8px 0; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right;">${data.email}</td>
          </tr>
        </table>
      </div>
      
      <div style="text-align: center; margin: 0 0 20px 0;">
        <a href="${BASE_URL}/login" style="display: inline-block; background: #0f172a; color: white; padding: 14px 30px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 14px; font-style: italic; letter-spacing: -0.5px;">
          Explore Your Dashboard →
        </a>
      </div>
    </div>
    ${EMAIL_WRAPPER_END}
  `

  return sendEmail(data.email, "💝 Welcome to CMS Global - We're Glad You're Here!", html)
}

// ============================================
// 3. ADMIN ASSIGNMENT EMAIL
// ============================================
export async function sendAdminAssignmentEmail(data: {
  adminName: string,
  adminEmail: string,
  orgName: string,
  superAdminName: string,
  date: string
}) {
  const html = `
    ${EMAIL_WRAPPER_START}
    <div style="padding: 30px 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="margin: 0 0 4px 0; font-size: 24px; font-weight: 900; color: #0f172a; font-style: italic;">Admin Assigned 👑</h1>
        <p style="margin: 0; color: #64748b; font-size: 14px; font-weight: 600;">Organization Privileges Granted.</p>
      </div>
      
      <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 16px; padding: 18px; margin: 0 0 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #7c3aed; line-height: 1.6; font-weight: 500;">
          Dear <strong>${data.adminName}</strong>, you are now an administrator for <strong>${data.orgName}</strong>.
        </p>
      </div>
      
      <div style="background: #ffffff; border-radius: 16px; padding: 16px; margin: 0 0 20px 0; border: 1px solid #f1f5f9;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Assigned By</td>
            <td style="padding: 6px 0; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right;">${data.superAdminName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Date</td>
            <td style="padding: 6px 0; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right;">${data.date}</td>
          </tr>
        </table>
      </div>
      
      <div style="text-align: center;">
        <a href="${BASE_URL}/dashboard/admin" style="display: inline-block; background: #7c3aed; color: white; padding: 14px 30px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 14px; font-style: italic;">
          Access Dashboard →
        </a>
      </div>
    </div>
    ${EMAIL_WRAPPER_END}
  `
  return sendEmail(data.adminEmail, "👑 You Have Been Assigned as an Admin", html)
}

// ============================================
// 4. NEW COMPLAINT - ADMIN NOTIFICATION
// ============================================
export async function sendNewComplaintAdminEmail(data: {
  adminEmail: string,
  adminName?: string,
  complaintId: string,
  title: string,
  userName: string,
  userEmail: string,
  orgName: string,
  date: string
}) {
  const html = `
    ${EMAIL_WRAPPER_START}
    <div style="padding: 30px 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="margin: 0 0 4px 0; font-size: 24px; font-weight: 900; color: #0f172a; font-style: italic;">Action Required 🚨</h1>
        <p style="margin: 0; color: #64748b; font-size: 14px; font-weight: 600;">A new complaint is pending review.</p>
      </div>
      
      <div style="background: #ffffff; border-radius: 16px; padding: 20px; margin: 0 0 24px 0; border: 1px solid #f1f5f9; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border-left: 6px solid #ef4444;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-size: 13px; color: #64748b;">Title</td>
            <td style="padding: 8px 0; font-size: 13px; color: #0f172a; font-weight: 800; text-align: right; font-style: italic;">${data.title}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 13px; color: #64748b;">User</td>
            <td style="padding: 8px 0; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right;">${data.userName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 13px; color: #64748b;">Case ID</td>
            <td style="padding: 8px 0; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right; font-family: monospace;">#${data.complaintId.slice(0, 8).toUpperCase()}</td>
          </tr>
        </table>
      </div>
      
      <div style="text-align: center;">
        <a href="${BASE_URL}/dashboard/admin/complaints" style="display: inline-block; background: #dc2626; color: white; padding: 14px 36px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 14px; font-style: italic;">
          Process Now →
        </a>
      </div>
    </div>
    ${EMAIL_WRAPPER_END}
  `
  return sendEmail(data.adminEmail, `🚨 ACTION REQUIRED: New Complaint [#${data.complaintId.slice(0, 8).toUpperCase()}]`, html)
}

// ============================================
// 5. STATUS UPDATE - USER NOTIFICATION
// ============================================
export async function sendComplaintStatusUpdateEmail(data: {
  userEmail: string,
  userName: string,
  complaintId: string,
  title: string,
  newStatus: string,
  adminMessage?: string,
  date: string
}) {
  const statusConfig: any = {
    "IN_PROGRESS": { color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe", icon: "🔄", label: "In Progress" },
    "RESOLVED": { color: "#065f46", bg: "#ecfdf5", border: "#a7f3d0", icon: "✅", label: "Resolved" },
    "REJECTED": { color: "#991b1b", bg: "#fef2f2", border: "#fecaca", icon: "❌", label: "Rejected" },
    "PENDING": { color: "#92400e", bg: "#fffbeb", border: "#fde68a", icon: "⏳", label: "Pending" }
  }
  const config = statusConfig[data.newStatus.toUpperCase()] || statusConfig["PENDING"]

  const html = `
    ${EMAIL_WRAPPER_START}
    <div style="padding: 30px 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="margin: 0 0 4px 0; font-size: 24px; font-weight: 900; color: #0f172a; font-style: italic;">Status Updated ${config.icon}</h1>
        <p style="margin: 0; color: #64748b; font-size: 14px; font-weight: 600;">Your complaint has been processed.</p>
      </div>
      
      <div style="background: ${config.bg}; border: 1px solid ${config.border}; border-radius: 16px; padding: 18px; margin: 0 0 20px 0;">
        <p style="margin: 0; font-size: 14px; color: ${config.color}; line-height: 1.6; font-weight: 700;">
          The status of your complaint <strong>#${data.complaintId.slice(0, 8).toUpperCase()}</strong> is now <strong style="text-decoration: underline;">${config.label}</strong>.
        </p>
      </div>
      
      ${data.adminMessage ? `
      <div style="background: #fdf2f8; border-left: 4px solid #db2777; padding: 16px; border-radius: 0 16px 16px 0; margin: 0 0 24px 0;">
        <p style="margin: 0; font-size: 14px; color: #831843; line-height: 1.6; font-weight: 500; font-style: italic;">"${data.adminMessage}"</p>
      </div>
      ` : ''}
      
      <div style="text-align: center;">
        <a href="${BASE_URL}/dashboard/complaints" style="display: inline-block; background: #0f172a; color: white; padding: 14px 30px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 14px; font-style: italic;">
          Full Timeline →
        </a>
      </div>
    </div>
    ${EMAIL_WRAPPER_END}
  `
  return sendEmail(data.userEmail, `${config.icon} Important Update: Your Complaint is now ${config.label}`, html)
}

// ============================================
// 6. SUPER ADMIN UPDATE EMAIL
// ============================================
export async function sendSuperAdminUpdateEmail(data: {
  superAdminEmail: string,
  complaintId: string,
  title: string,
  adminName: string,
  orgName: string,
  status: string,
  date: string,
  summary?: string
}) {
  const html = `
    ${EMAIL_WRAPPER_START}
    <div style="padding: 30px 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="margin: 0 0 4px 0; font-size: 24px; font-weight: 900; color: #0f172a; font-style: italic;">Complaint Update 📊</h1>
        <p style="margin: 0; color: #64748b; font-size: 14px; font-weight: 600;">Monitor activity on #${data.complaintId.slice(0, 8).toUpperCase()}.</p>
      </div>
      
      <div style="background: #f8fafc; border-radius: 16px; padding: 16px; margin: 0 0 20px 0; border: 1px solid #e2e8f0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Admin</td>
            <td style="padding: 6px 0; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right;">${data.adminName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: #64748b;">New Status</td>
            <td style="padding: 6px 0; font-size: 13px; color: #0f172a; font-weight: 800; text-align: right; text-transform: uppercase;">${data.status}</td>
          </tr>
        </table>
      </div>
      
      <div style="text-align: center;">
        <a href="${BASE_URL}/dashboard/super" style="display: inline-block; background: #0f172a; color: white; padding: 14px 30px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 14px; font-style: italic;">
          Super Admin Panel →
        </a>
      </div>
    </div>
    ${EMAIL_WRAPPER_END}
  `
  return sendEmail(data.superAdminEmail, "📊 Complaint Status Update - Admin Action", html)
}

// ============================================
// 7. AUDIT LOG NOTIFICATION (NEW)
// ============================================
export async function sendAuditLogNotification(data: {
  superAdminEmail: string,
  action: string,
  performedBy: string,
  target: string,
  targetType: string,
  organization?: string,
  date: string,
  details?: string
}) {
  const actionIcons: any = {
    "Complaint Submitted": "📝",
    "Status changed": "🔄",
    "Admin Assigned": "👤",
    "Organization Created": "🏢",
    "User Created": "👥",
    "Department Created": "📁"
  }
  const icon = actionIcons[data.action] || Object.entries(actionIcons).find(([key]) => data.action.includes(key))?.[1] || "📋"

  const html = `
    ${EMAIL_WRAPPER_START}
    <div style="padding: 30px 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="margin: 0 0 4px 0; font-size: 24px; font-weight: 900; color: #0f172a; font-style: italic;">Audit Log ${icon}</h1>
        <p style="margin: 0; color: #64748b; font-size: 14px; font-weight: 600;">System activity recorded.</p>
      </div>
      
      <div style="background: #f8fafc; border-radius: 16px; padding: 16px; margin: 0 0 20px 0; border: 1px solid #e2e8f0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Action</td>
            <td style="padding: 6px 0; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right;">${data.action}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Actor</td>
            <td style="padding: 6px 0; font-size: 13px; color: #0f172a; font-weight: 800; text-align: right;">${data.performedBy}</td>
          </tr>
        </table>
      </div>
      
      <div style="text-align: center; background: #0f172a; padding: 8px; border-radius: 10px;">
        <p style="margin: 0; font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 2px;">🔒 Surveillance Active</p>
      </div>
    </div>
    ${EMAIL_WRAPPER_END}
  `
  return sendEmail(data.superAdminEmail, `🔔 System Audit Log: ${data.action}`, html)
}
// ============================================
// 8. PASSWORD RESET EMAIL (NEW)
// ============================================
export async function sendPasswordResetEmail(email: string, otp: string) {
  const html = `
    ${EMAIL_WRAPPER_START}
    <div style="padding: 30px 24px;">
      <div style="text-align: center;">
        <h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 900; color: #0f172a; font-style: italic;">Credential Recovery</h1>
        <p style="margin: 0 0 24px 0; color: #64748b; font-size: 14px; font-weight: 600;">Authorized Reset Sequence for your CMS Node.</p>
      </div>
      
      <div style="background: #f8fafc; border-radius: 16px; padding: 24px; margin: 0 0 24px 0; text-align: center; border: 2px dashed #e2e8f0;">
        <div style="font-family: 'Courier New', monospace; font-size: 42px; font-weight: 900; letter-spacing: 12px; color: #1e40af; font-style: italic;">
          ${otp}
        </div>
      </div>
      
      <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 0 12px 12px 0;">
        <p style="margin: 0; font-size: 13px; color: #991b1b; font-weight: 600; line-height: 1.4;">
          <strong>⚠️ Security Override.</strong> This code will expire soon. If you didn't request this, secure your account immediately.
        </p>
      </div>
    </div>
    ${EMAIL_WRAPPER_END}
  `
  return sendEmail(email, "🔑 CMS Global: Password Reset Sequence", html)
}
