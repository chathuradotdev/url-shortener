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
  const appUrl = 'https://linkjet.co';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to LinkJet</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
      line-height: 1.6;
      color: #333333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      overflow: hidden;
    }
    .logo-bar {
      padding: 30px 0 20px;
      text-align: center;
      background-color: #ffffff;
    }
    .hero-section {
      padding: 0 30px 10px;
      text-align: center;
    }
    .hero-h1 {
      margin: 0 0 10px;
      font-size: 26px;
      font-weight: 800;
      color: #111827;
      letter-spacing: -0.5px;
    }
    .intro-text {
      font-size: 16px;
      margin: 0 0 30px;
      color: #6b7280;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .content {
      padding: 10px 30px 40px;
    }
    
    .steps-container {
      margin-bottom: 40px;
    }
    .step-card {
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
      display: flex;
      align-items: flex-start;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    .step-icon {
      background-color: #eff6ff;
      color: #2563eb;
      border-radius: 10px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      margin-right: 16px;
      flex-shrink: 0;
    }
    .step-content h3 {
      margin: 0 0 2px;
      font-size: 15px;
      font-weight: 700;
      color: #111827;
    }
    .step-content p {
      margin: 0;
      font-size: 13px;
      color: #6b7280;
      line-height: 1.4;
    }
    .cta-button {
      display: block;
      width: 100%;
      background: linear-gradient(to right, #2563eb, #4f46e5);
      color: #ffffff !important;
      text-align: center;
      padding: 16px 0;
      border-radius: 50px;
      font-weight: 700;
      font-size: 16px;
      text-decoration: none;
      box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      border-top: 1px solid #e5e7eb;
    }
    .footer a {
      color: #6b7280;
      text-decoration: underline;
    }
    
    @media only screen and (max-width: 600px) {
      .logo-bar { padding: 25px 0 15px; }
      .hero-section { padding: 0 20px 20px; }
      .hero-h1 { font-size: 24px; }
      .content { padding: 0 20px 30px; }
    }
  </style>
</head>
<body>
  <div class="container">
    
    <!-- Clean Logo Bar -->
    <div class="logo-bar">
        <table align="center" border="0" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding-right: 8px;">
                    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzI1NjNlYiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIj48cGF0aCBkPSJNMiAxMmwyMC05LTkgMjAtMi05LTktMnoiLz48L3N2Zz4=" width="24" height="24" alt="Logo" style="display: block;">
                </td>
                <td style="font-family: 'Segoe UI', sans-serif; font-size: 22px; font-weight: 800; color: #111827; letter-spacing: -0.5px;">
                    LinkJet<span style="color: #2563eb;">.co</span>
                </td>
            </tr>
        </table>
    </div>

    <!-- Hero Section with Greeting -->
    <div class="hero-section">
      <h1 class="hero-h1">Hello ${name}!</h1>
      <p class="intro-text">
        We're thrilled to have you on board. LinkJet gives you the superpowers to organize your digital presence.
      </p>
    </div>

    <!-- Main Content -->
    <div class="content">
      <div style="text-align: left; margin-bottom: 20px; font-weight: 700; color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
        Get started in 3 steps:
      </div>

      <!-- Checklist Section -->
      <div class="steps-container">
        <!-- Step 1 -->
        <div class="step-card">
          <div class="step-icon">🔗</div>
          <div class="step-content">
            <h3>Create Short Links</h3>
            <p>Branded, trackable links in seconds.</p>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="step-card">
          <div class="step-icon">✨</div>
          <div class="step-content">
            <h3>Build Bio Pages</h3>
            <p>One page for all your important links.</p>
          </div>
        </div>
        
        <!-- Step 3 -->
        <div class="step-card">
          <div class="step-icon">📈</div>
          <div class="step-content">
            <h3>Track Analytics</h3>
            <p>Real-time insights on your audience.</p>
          </div>
        </div>
      </div>

      <!-- Primary CTA -->
      <a href="${appUrl}/dashboard" class="cta-button">
        Go to Dashboard
      </a>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>
        © ${new Date().getFullYear()} LinkJet.co | An Internet Company
      </p>
      <div style="margin-top: 10px;">
        <a href="${appUrl}/privacy">Privacy Policy</a> • 
        <a href="${appUrl}/terms">Terms of Service</a> • 
        <a href="${appUrl}/unsubscribe">Unsubscribe</a>
      </div>
      <div style="margin-top: 20px;">
         <a href="https://twitter.com/linkjet" style="margin: 0 5px; text-decoration: none; font-size: 16px;">🐦</a>
         <a href="https://instagram.com/linkjet" style="margin: 0 5px; text-decoration: none; font-size: 16px;">📸</a>
         <a href="https://linkedin.com/company/linkjet" style="margin: 0 5px; text-decoration: none; font-size: 16px;">💼</a>
      </div>
    </div>

  </div>
</body>
</html>
  `;
}
