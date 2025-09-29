# Gmail SMTP Setup Guide

This guide will help you set up Gmail SMTP for sending appointment confirmation emails from your Panchakarma platform.

## Step 1: Generate Gmail App Password

1. **Go to Google Account Security**: https://myaccount.google.com/security
2. **Make sure 2-Step Verification is ON** (required for App Passwords)
3. **Look for "App passwords"** in the "How you sign in to Google" section
4. **If you don't see "App passwords"**, try this direct link: https://myaccount.google.com/apppasswords
5. **Click "Select app"** → Choose "Mail"
6. **Click "Select device"** → Choose "Other" → Enter "Panchakarma Platform"
7. **Click "Generate"**
8. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

## 📝 Step 2: Update Environment Variables

1. **Copy `.env.local.example` to `.env.local`**:
   ```bash
   cp env.local.example .env.local
   ```

2. **Edit `.env.local`** and add your Gmail credentials:
   ```bash
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your_16_character_app_password_here
   ```

   **Important**: Remove spaces from the App Password when adding it to `.env.local`

## 🚀 Step 3: Test Email Sending

1. **Restart your development server**:
   ```bash
   pnpm dev
   ```

2. **Go to the test page**: http://localhost:3000/test-email

3. **Enter your email address** and click "Send Test Email"

4. **Check your inbox** for the test email

## 🔧 Troubleshooting

### "App passwords" not visible
- Make sure 2-Step Verification is enabled
- Try the direct link: https://myaccount.google.com/apppasswords
- Your account might need to be verified

### "Invalid login" error
- Double-check your Gmail username (full email address)
- Make sure the App Password has no spaces
- Verify 2-Step Verification is enabled

### "Less secure app access" error
- Don't use "Less secure app access" - use App Passwords instead
- App Passwords are more secure and recommended by Google

### Email not received
- Check spam/junk folder
- Verify the recipient email address is correct
- Check the server logs for error messages

## Email Templates

The system includes two email templates:

1. **Appointment Confirmation**: Sent when an appointment is confirmed
2. **Appointment Reminder**: Sent as a reminder (can be scheduled)

Both emails include:
- Professional HTML formatting
- Appointment details
- Pre-appointment guidelines
- Panchakarma branding

## 🔒 Security Notes

- **Never commit `.env.local`** to version control
- **App Passwords are safer** than regular passwords
- **Each App Password is unique** and can be revoked independently
- **Use a dedicated Gmail account** for production if possible

## 📱 Production Deployment

For production deployment:

1. **Set environment variables** in your hosting platform (Vercel, Netlify, etc.)
2. **Use a dedicated Gmail account** for sending emails
3. **Consider using a custom domain** for better deliverability
4. **Monitor email delivery** and set up proper SPF/DKIM records if needed

## Need Help?

If you're still having issues:

1. **Check the server logs** for detailed error messages
2. **Verify your Gmail account** has 2-Step Verification enabled
3. **Try generating a new App Password**
4. **Test with a different Gmail account** to isolate the issue

---

**Note**: This setup uses Gmail's SMTP service, which is free but has daily sending limits (around 500 emails per day for regular accounts).