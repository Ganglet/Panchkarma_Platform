# 📧📱 Notification System Setup Guide

This guide will help you set up email and SMS notifications for appointment confirmations using SendGrid and Twilio.

## 🚀 Quick Start

### 1. SendGrid Setup (Email Notifications)

1. **Create SendGrid Account**
   - Go to [SendGrid.com](https://sendgrid.com)
   - Sign up for a free account (100 emails/day free tier)

2. **Get API Key**
   - Navigate to Settings → API Keys
   - Click "Create API Key"
   - Choose "Restricted Access" and give it "Mail Send" permissions
   - Copy the API key

3. **Verify Sender Identity**
   - Go to Settings → Sender Authentication
   - Choose "Single Sender Verification" for testing
   - Add your email address and verify it

4. **Configure Environment Variables**
   ```bash
   SENDGRID_API_KEY=your_sendgrid_api_key_here
   SENDGRID_FROM_EMAIL=your_verified_email@domain.com
   ```

### 2. Twilio Setup (SMS Notifications)

1. **Create Twilio Account**
   - Go to [Twilio.com](https://www.twilio.com)
   - Sign up for a free account ($15 credit included)

2. **Get Account Credentials**
   - Go to Console Dashboard
   - Copy your Account SID and Auth Token

3. **Get Phone Number**
   - Go to Phone Numbers → Manage → Buy a number
   - Choose a phone number (free with trial account)
   - Copy the phone number

4. **Configure Environment Variables**
   ```bash
   TWILIO_ACCOUNT_SID=your_account_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```

## 🔧 Environment Configuration

### Frontend (.env.local)
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# SendGrid Configuration (for email notifications)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Twilio Configuration (for SMS notifications)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### Backend (.env)
```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## 🧪 Testing the Setup

### 1. Use the Test Component
- Navigate to the notification test component in your app
- Fill in test data (patient name, email, phone, etc.)
- Click "Test Email Only", "Test SMS Only", or "Test Both"
- Check the results and configuration status

### 2. Test Appointment Confirmation
- Go to practitioner dashboard
- Find a scheduled appointment
- Click "Confirm" to trigger the notification system
- Check if patient receives email and SMS

## 📋 Features

### Email Notifications
- ✅ Beautiful HTML email templates
- ✅ Appointment confirmation emails
- ✅ Appointment reminder emails
- ✅ Pre-procedure instructions
- ✅ Post-procedure care instructions
- ✅ Responsive design for mobile devices

### SMS Notifications
- ✅ Appointment confirmation SMS
- ✅ Appointment reminder SMS
- ✅ Appointment cancellation SMS
- ✅ Post-procedure care SMS
- ✅ Emoji support for better readability
- ✅ Concise, mobile-friendly messages

### Integration Features
- ✅ Automatic notifications when practitioner confirms appointment
- ✅ Fallback to in-app notifications if email/SMS fails
- ✅ Delivery status tracking
- ✅ Error handling and logging
- ✅ Configurable notification preferences

## 🎨 Email Templates

The system includes professionally designed email templates with:
- Panchakarma branding and colors
- Appointment details in a clear format
- Pre-appointment guidelines
- Responsive design
- Professional styling

## 📱 SMS Templates

SMS messages are designed to be:
- Concise and informative
- Mobile-friendly
- Include emojis for better engagement
- Contain all essential appointment information

## 🔒 Security & Privacy

- API keys are stored securely in environment variables
- No sensitive data is logged
- Email addresses and phone numbers are only used for notifications
- All communications are encrypted

## 🚨 Troubleshooting

### Common Issues

1. **Email not sending**
   - Check SendGrid API key is correct
   - Verify sender email is authenticated
   - Check SendGrid account status and limits

2. **SMS not sending**
   - Verify Twilio credentials
   - Check phone number format (include country code)
   - Ensure Twilio account has sufficient balance

3. **Environment variables not loading**
   - Restart your development server
   - Check .env file is in the correct location
   - Verify variable names match exactly

### Debug Mode
Enable debug logging by setting:
```bash
NODE_ENV=development
```

## 📊 Monitoring

### SendGrid
- Monitor email delivery in SendGrid dashboard
- Check bounce and spam reports
- Track open and click rates

### Twilio
- Monitor SMS delivery in Twilio console
- Check message logs and delivery status
- Monitor account usage and costs

## 💰 Cost Considerations

### SendGrid
- Free tier: 100 emails/day
- Paid plans start at $14.95/month for 40,000 emails

### Twilio
- SMS costs vary by country (~$0.0075 per SMS in US)
- Free trial includes $15 credit
- Monitor usage to avoid unexpected charges

## 🔄 Production Deployment

### Environment Variables
Ensure all environment variables are set in your production environment:
- Vercel: Use Environment Variables in project settings
- Netlify: Use Site settings → Environment variables
- Docker: Use docker-compose.yml or .env files

### Domain Authentication
For production, set up domain authentication in SendGrid:
1. Go to Settings → Sender Authentication
2. Choose "Domain Authentication"
3. Add your domain and verify DNS records

## 📞 Support

- SendGrid Support: [SendGrid Help Center](https://support.sendgrid.com)
- Twilio Support: [Twilio Support](https://support.twilio.com)
- Project Issues: Create an issue in the project repository

---

**Note**: This notification system is designed to enhance patient experience by providing timely, professional communications about their Panchakarma appointments. Always test thoroughly before deploying to production.
