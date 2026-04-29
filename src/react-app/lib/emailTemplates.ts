export const EMAIL_TEMPLATES = {
  welcome: (name: string): string => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; background: #0A0A0A; color: #E0D4FF; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #141218; border-radius: 16px; overflow: hidden; }
    .header { background: #1E1B24; padding: 30px 40px; text-align: center; }
    .logo { font-size: 28px; font-weight: 700; color: #624CAB; }
    .content { padding: 40px; line-height: 1.6; }
    .button { 
      background: #624CAB; 
      color: white; 
      padding: 16px 40px; 
      border-radius: 8px; 
      text-decoration: none; 
      display: inline-block; 
      margin: 20px 0;
      font-weight: 600;
    }
    .footer { padding: 30px; text-align: center; font-size: 14px; color: #8A7EB0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NexteraAI Security</div>
    </div>
    <div class="content">
      <h2 style="color:#E0D4FF;">Welcome to NexteraAI Security, ${name}!</h2>
      <p>Your business is now protected with enterprise-grade cybersecurity and POPIA compliance tools.</p>
      <p>Next steps:</p>
      <ul style="color:#C4B8E0;">
        <li>Complete your business profile</li>
        <li>Connect your devices using the Desktop Agent</li>
        <li>Set up your first backup in Data Vault</li>
      </ul>
      <a href="https://www.nexteraai.co.za/dashboard" class="button">Go to Dashboard</a>
      <p style="color:#8A7EB0; font-size:14px;">Need help? Reply to this email or contact support@nexteraai.co.za</p>
    </div>
    <div class="footer">
      © NexteraAI Security • Secure • South Africa
    </div>
  </div>
</body>
</html>`,

  passwordReset: (resetLink: string): string => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; background: #0A0A0A; color: #E0D4FF; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #141218; border-radius: 16px; overflow: hidden; }
    .header { background: #1E1B24; padding: 30px 40px; text-align: center; }
    .logo { font-size: 28px; font-weight: 700; color: #624CAB; }
    .content { padding: 40px; text-align: center; }
    .button { 
      background: #624CAB; 
      color: white; 
      padding: 16px 40px; 
      border-radius: 8px; 
      text-decoration: none; 
      display: inline-block; 
      margin: 20px 0;
      font-weight: 600;
    }
    .footer { padding: 30px; text-align: center; font-size: 14px; color: #8A7EB0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NexteraAI Security</div>
    </div>
    <div class="content">
      <h2 style="color:#E0D4FF;">Reset your password</h2>
      <p style="color:#C4B8E0;">You requested to reset your NexteraAI password.</p>
      <a href="${resetLink}" class="button">Reset Password</a>
      <p style="color:#8A7EB0; font-size:14px;">This link expires in 15 minutes.</p>
      <p style="color:#8A7EB0; font-size:14px;">If you didn't request this, please ignore this email.</p>
    </div>
    <div class="footer">
      © NexteraAI Security • Secure • South Africa
    </div>
  </div>
</body>
</html>`,

  otpCode: (code: string): string => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; background: #0A0A0A; color: #E0D4FF; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #141218; border-radius: 16px; overflow: hidden; }
    .header { background: #1E1B24; padding: 30px 40px; text-align: center; }
    .logo { font-size: 28px; font-weight: 700; color: #624CAB; }
    .content { padding: 40px; text-align: center; }
    .code { 
      font-size: 42px; 
      font-weight: 700; 
      letter-spacing: 12px; 
      background: #1E1B24; 
      padding: 20px 40px; 
      border-radius: 12px; 
      display: inline-block; 
      margin: 20px 0; 
      color: #624CAB;
    }
    .button { 
      background: #624CAB; 
      color: white; 
      padding: 14px 32px; 
      border-radius: 8px; 
      text-decoration: none; 
      display: inline-block; 
      margin-top: 20px;
    }
    .footer { padding: 30px; text-align: center; font-size: 14px; color: #8A7EB0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NexteraAI Security</div>
    </div>
    <div class="content">
      <h2 style="color:#E0D4FF;">Your verification code</h2>
      <p style="color:#C4B8E0;">Enter this code to complete your NexteraAI signup:</p>
      <div class="code">${code}</div>
      <p style="color:#8A7EB0;">This code expires in 10 minutes.</p>
      <p style="color:#8A7EB0; font-size:14px;">If you didn't request this code, please ignore this email.</p>
    </div>
    <div class="footer">
      © NexteraAI Security • Secure • South Africa
    </div>
  </div>
</body>
</html>`,
};
