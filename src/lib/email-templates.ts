export function getPasswordResetEmailHtml(resetLink: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(to right, #3b82f6, #8b5cf6); padding: 30px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">URL Shortener</h1>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #1f2937; margin-top: 0; font-size: 20px;">Password Reset Request</h2>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
        Hello,
      </p>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
        We received a request to reset your password. If you didn't make this request, you can safely ignore this email.
      </p>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetLink}" style="background: linear-gradient(to right, #3b82f6, #8b5cf6); color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-weight: bold; display: inline-block;">
          Reset Password
        </a>
      </div>

      <p style="color: #4b5563; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
        Or copy and paste this link into your browser:
        <br>
        <a href="${resetLink}" style="color: #3b82f6; word-break: break-all;">${resetLink}</a>
      </p>
      
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 0;">
        This link will expire in 1 hour.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} URL Shortener. All rights reserved.
      </p>
    </div>
    
  </div>
</body>
</html>
    `;
}

export function getContactFormEmailHtml(name: string, email: string, message: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Contact Form Submission</title>
</head>
<body style="font-family: sans-serif; padding: 20px;">
  <h2>New Contact Message</h2>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Message:</strong></p>
  <div style="background-color: #f4f4f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</div>
</body>
</html>
    `;
}

export function getBulkUploadSuccessEmailHtml(userName: string, totalUrls: number, successCount: number, failedCount: number) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bulk Upload Complete</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(to right, #10b981, #3b82f6); padding: 30px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Upload Successful</h1>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #1f2937; margin-top: 0; font-size: 20px;">Bulk URL Creation Complete</h2>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
        Hello ${userName},
      </p>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
        Your bulk upload has been processed successfully. Here is the summary of the operation:
      </p>
      
      <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #4b5563;">Total URLs Found:</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #1f2937;">${totalUrls}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4b5563;">Successfully Created:</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #10b981;">${successCount}</td>
          </tr>
             ${failedCount > 0 ? `
          <tr>
            <td style="padding: 8px 0; color: #4b5563;">Failed:</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #ef4444;">${failedCount}</td>
          </tr>
          ` : ''}
        </table>
      </div>

      <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
        You can verify your new links in your dashboard.
      </p>

      <div style="text-align: center; margin-top: 32px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" style="background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
          Go to Dashboard
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} URL Shortener. All rights reserved.
      </p>
    </div>
    
  </div>
</body>
</html>
  `;
}

export function getErrorNotificationEmailHtml(errorContext: string, errorMessage: string, stackTrace?: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>System Error Alert</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(to right, #ef4444, #b91c1c); padding: 30px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">System Error Alert</h1>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #1f2937; margin-top: 0; font-size: 20px;">Context: ${errorContext}</h2>
      
      <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h3 style="color: #991b1b; margin-top: 0; font-size: 16px;">Error Message</h3>
        <p style="color: #b91c1c; font-family: monospace; font-size: 14px; margin: 0;">
          ${errorMessage}
        </p>
      </div>

      ${stackTrace ? `
      <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h3 style="color: #4b5563; margin-top: 0; font-size: 16px;">Stack Trace</h3>
        <pre style="color: #1f2937; font-family: monospace; font-size: 12px; white-space: pre-wrap; word-break: break-all; margin: 0; overflow-x: auto;">
${stackTrace}
        </pre>
      </div>
      ` : ''}

      <p style="color: #4b5563; font-size: 14px; line-height: 1.5; margin-bottom: 0;">
        Timestamp: ${new Date().toISOString()}
      </p>
    </div>
    
  </div>
</body>
</html>
  `;
}

export function getVerificationEmailHtml(code: string, heroImageSrc?: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const heroImage = heroImageSrc || `${appUrl}/email/verify-hero.png`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Account</title>
  <style>
    @media only screen and (max-width: 600px) {
      .content {
        padding: 20px !important;
      }
      .header {
        padding: 20px !important;
      }
    }
  </style>
</head>
<body style="font-family: 'Google Sans', Roboto, sans-serif, Arial; background-color: #e6e9ed; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
  <div style="width: 100%; background-color: #e6e9ed; padding: 20px 0;">
    <div style="max-width: 660px; margin: 0 auto;">
      
      <!-- Top Link -->
      <div style="text-align: center; padding-bottom: 20px;">
        <p style="font-size: 12px; color: #5f6368; margin: 0;">
          Email not displaying correctly? <a href="#" style="color: #444746; text-decoration: underline;">View it online</a>
        </p>
      </div>

      <!-- Main Card -->
      <div style="background-color: #ffffff; padding: 48px; box-shadow: 0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);">
        
        <!-- Header Text -->
        <h1 style="color: #3c4043; font-size: 24px; font-weight: 400; margin: 0 0 32px 0;">Verify your Account</h1>
        
        <!-- Hero Image -->
        <div style="margin-bottom: 32px;">
           <img src="${heroImage}" alt="Verify Account" style="width: 100%; height: auto; border: 1px solid #e8eaed; display: block;" />
        </div>

        <!-- Body Content -->
        <p style="color: #3c4043; font-size: 16px; line-height: 24px; margin: 0 0 24px 0;">
          Hi there! We received a request to create a new LinkJet account. To ensure your account is secure, we need to verify your email address.
        </p>

        <p style="color: #3c4043; font-size: 16px; line-height: 24px; margin: 0 0 24px 0;">
          Please use the following verification code to complete your registration:
        </p>

        <!-- Code Box -->
        <div style="background-color: #f1f3f4; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 32px;">
            <span style="font-family: 'Google Sans Mono', monospace; font-size: 32px; font-weight: 700; letter-spacing: 4px; color: #1a73e8;">${code}</span>
        </div>

        <p style="color: #5f6368; font-size: 14px; line-height: 20px; margin: 0;">
          If you didn't request this code, you can safely ignore this email. Someone might have typed your email address by mistake.
        </p>

      </div>

      <!-- Footer -->
      <div style="padding: 24px 0; text-align: center;">
        <p style="color: #5f6368; font-size: 12px; line-height: 16px; margin: 0;">
          © ${new Date().getFullYear()} LinkJet LLC<br>
          1600 Amphitheatre Parkway, Mountain View, CA 94043, USA
        </p>
      </div>

    </div>
  </div>
</body>
</html>
  `;
}

export function getWelcomeEmailHtml(name: string, profileUrl: string, heroImageSrc?: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to LinkJet</title>
  <style>
    @media only screen and (max-width: 600px) {
      .content-cell {
        display: block !important;
        width: 100% !important;
        padding-bottom: 20px !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      .container {
        width: 100% !important;
        padding: 10px !important;
      }
    }
  </style>
</head>
<body style="font-family: 'Google Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f0f2f5; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
  <div style="width: 100%; background-color: #f0f2f5; padding: 40px 0;">
    <div class="container" style="width: 90%; max-width: 1200px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
      
      <!-- Header / Logo -->
      <div style="text-align: center; padding: 32px 0 24px;">
        <h2 style="font-size: 26px; font-weight: 800; color: #1e293b; margin: 0; background: linear-gradient(to right, #2563eb, #db2777); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">LinkJet</h2>
      </div>

      <!-- Colorful Bio Page Mockup Section -->
      <div style="background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); padding: 60px 0; text-align: center; margin-bottom: 32px;">
        <h1 style="color: #ffffff; font-size: 32px; font-weight: 800; margin: 0 0 12px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Showcase Who You Are</h1>
        <p style="color: rgba(255,255,255,0.95); font-size: 18px; margin: 0 0 40px 0;">Build your stunning Bio Page in minutes.</p>
        
        <!-- Phone Frame (Refined) -->
        <div style="display: inline-block; position: relative; width: 260px; background: #1e293b; border-radius: 40px; padding: 12px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.4); border: 4px solid #334155;">
            
            <!-- Side Buttons -->
            <div style="position: absolute; right: -6px; top: 80px; height: 40px; width: 6px; background: #475569; border-top-right-radius: 4px; border-bottom-right-radius: 4px;"></div>
            <div style="position: absolute; left: -6px; top: 70px; height: 25px; width: 6px; background: #475569; border-top-left-radius: 4px; border-bottom-left-radius: 4px;"></div>
            <div style="position: absolute; left: -6px; top: 110px; height: 40px; width: 6px; background: #475569; border-top-left-radius: 4px; border-bottom-left-radius: 4px;"></div>

            <!-- Phone Screen -->
            <div style="background: #ffffff; border-radius: 30px; overflow: hidden; height: 450px; position: relative; text-align: center; box-shadow: inset 0 0 0 2px rgba(0,0,0,0.1);">
                
                <!-- Status Bar (Simple Dot) -->
                <div style="height: 20px; width: 100%; display: flex; justify-content: center; align-items: center; padding-top: 8px;">
                     <div style="width: 60px; height: 16px; background: #f1f5f9; border-radius: 10px;"></div>
                </div>

                <!-- Cover Image -->
                <div style="height: 120px; background: linear-gradient(to right, #8B5CF6, #EC4899); margin-top: 10px;"></div>
                
                <!-- Profile Pic -->
                <div style="margin-top: -50px; margin-bottom: 12px; display: flex; justify-content: center; position: relative;">
                    <div style="width: 90px; height: 90px; background: #fff; border-radius: 50%; padding: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <div style="width: 100%; height: 100%; background: linear-gradient(45deg, #3B82F6 0%, #2DD4BF 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 28px;">
                            🚀
                        </div>
                    </div>
                </div>
                
                <!-- Name -->
                <div style="font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 4px;">Alex Creator</div>
                <div style="font-size: 13px; color: #64748b; margin-bottom: 24px;">@alexcreator</div>
                
                <!-- Links -->
                <div style="padding: 0 24px;">
                    <div style="background: white; border: 2px solid #e2e8f0; padding: 12px 0; border-radius: 50px; margin-bottom: 12px; font-size: 13px; font-weight: 700; color: #1e293b; box-shadow: 0 2px 5px rgba(0,0,0,0.05); text-align: center;">
                        🎵 New Release
                    </div>
                    <div style="background: linear-gradient(90deg, #F59E0B 0%, #EA580C 100%); padding: 14px 0; border-radius: 50px; margin-bottom: 12px; font-size: 13px; font-weight: 700; color: white; box-shadow: 0 4px 10px rgba(234, 88, 12, 0.3); text-align: center;">
                        🔥 Exclusive Merch
                    </div>
                    <div style="background: white; border: 2px solid #e2e8f0; padding: 12px 0; border-radius: 50px; margin-bottom: 12px; font-size: 13px; font-weight: 700; color: #1e293b; box-shadow: 0 2px 5px rgba(0,0,0,0.05); text-align: center;">
                        📸 Photography
                    </div>
                </div>
                
            </div>
        </div>
      </div>

      <!-- Main Content -->
      <div style="padding: 0 40px 40px;">
        <p style="color: #334155; font-size: 17px; line-height: 28px; margin: 0 0 24px 0; text-align: center;">
          Hi <strong>${name}</strong>,<br>
          Your audience is waiting. Create your first page today!
        </p>

        <!-- CTA Button -->
        <div style="text-align: center; margin-bottom: 48px;">
          <a href="${profileUrl}" style="background: linear-gradient(to right, #2563eb, #4f46e5); color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 50px; font-size: 16px; font-weight: 700; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); letter-spacing: 0.5px;">
            Get Started Now
          </a>
        </div>

        <!-- Features Grid -->
        <div style="border-top: 1px dashed #e2e8f0; padding-top: 32px;">
          <h3 style="color: #0f172a; font-size: 20px; font-weight: 700; margin: 0 0 32px 0; text-align: center;">Power up your workflow</h3>
          
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <!-- Feature 1 -->
              <td class="content-cell" width="33%" valign="top" style="padding-right: 8px;">
                <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 20px; height: 100%; box-sizing: border-box; text-align: center;">
                  <div style="font-size: 28px; margin-bottom: 12px; background-color: #ffffff; width: 48px; height: 48px; line-height: 48px; border-radius: 50%; margin-left: auto; margin-right: auto; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">🔗</div>
                  <h4 style="color: #1e3a8a; font-size: 15px; font-weight: 700; margin: 0 0 8px 0;">Short Links</h4>
                  <p style="color: #3b82f6; font-size: 13px; line-height: 20px; margin: 0;">
                    Create branded, trackable short URLs.
                  </p>
                </div>
              </td>
              <!-- Feature 2 -->
              <td class="content-cell" width="33%" valign="top" style="padding-left: 8px; padding-right: 8px;">
                <div style="background-color: #faf5ff; border: 1px solid #e9d5ff; border-radius: 12px; padding: 20px; height: 100%; box-sizing: border-box; text-align: center;">
                  <div style="font-size: 28px; margin-bottom: 12px; background-color: #ffffff; width: 48px; height: 48px; line-height: 48px; border-radius: 50%; margin-left: auto; margin-right: auto; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">✨</div>
                  <h4 style="color: #581c87; font-size: 15px; font-weight: 700; margin: 0 0 8px 0;">Bio Pages</h4>
                  <p style="color: #9333ea; font-size: 13px; line-height: 20px; margin: 0;">
                    Stunning Link-in-Bio pages in minutes.
                  </p>
                </div>
              </td>
              <!-- Feature 3 -->
              <td class="content-cell" width="33%" valign="top" style="padding-left: 8px;">
                <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 20px; height: 100%; box-sizing: border-box; text-align: center;">
                  <div style="font-size: 28px; margin-bottom: 12px; background-color: #ffffff; width: 48px; height: 48px; line-height: 48px; border-radius: 50%; margin-left: auto; margin-right: auto; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">🌐</div>
                  <h4 style="color: #881337; font-size: 15px; font-weight: 700; margin: 0 0 8px 0;">Domains</h4>
                  <p style="color: #e11d48; font-size: 13px; line-height: 20px; margin: 0;">
                    Connect your own custom domains.
                  </p>
                </div>
              </td>
            </tr>
          </table>
        </div>

      </div>

      <!-- Footer -->
      <div style="background-color: #f8fafc; padding: 32px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
        <div style="margin-bottom: 16px;">
          <a href="#" style="display: inline-block; margin: 0 8px; text-decoration: none;">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" width="24" height="24" alt="Twitter" style="opacity: 0.6;">
          </a>
          <a href="#" style="display: inline-block; margin: 0 8px; text-decoration: none;">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" width="24" height="24" alt="Instagram" style="opacity: 0.6;">
          </a>
          <a href="#" style="display: inline-block; margin: 0 8px; text-decoration: none;">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733609.png" width="24" height="24" alt="GitHub" style="opacity: 0.6;">
          </a>
        </div>
        <p style="color: #94a3b8; font-size: 12px; margin: 0 0 12px 0;">
          © ${new Date().getFullYear()} LinkJet. All rights reserved.
        </p>
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          <a href="#" style="color: #94a3b8; text-decoration: none;">Unsubscribe</a> • <a href="#" style="color: #94a3b8; text-decoration: none;">Privacy Policy</a>
        </p>
      </div>

    </div>
  </div>
</body>
</html>
  `;
}
