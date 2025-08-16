# Gmail Email Setup Guide

## Step 1: Enable 2-Factor Authentication on Gmail

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to "Security"
3. Enable "2-Step Verification" if not already enabled

## Step 2: Generate an App Password

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to "Security"
3. Under "2-Step Verification", click on "App passwords"
4. Select "Mail" as the app and "Other" as the device
5. Click "Generate"
6. Copy the 16-character password (it will look like: xxxx xxxx xxxx xxxx)

## Step 3: Create Environment File

1. Create a `.env` file in the root directory of your project
2. Add the following content:

```env
GMAIL_USER=ayman.benchamkha@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password_here
NODE_ENV=development
```

## Step 4: Test the Email Functionality

1. Restart your development server
2. Go to your portfolio contact form
3. Fill out and submit the form
4. Check your Gmail inbox for the test message

## Important Notes

- **Never use your regular Gmail password** - always use an App Password
- **Keep your App Password secure** - don't commit it to version control
- **The .env file should be in .gitignore** - never share your credentials
- **App Passwords are 16 characters** - remove spaces when copying

## Troubleshooting

### "Invalid login" error
- Make sure 2-Factor Authentication is enabled
- Verify you're using the App Password, not your regular password
- Check that the email address is correct

### "Less secure app access" error
- This is expected - you should use App Passwords instead
- Make sure you've generated an App Password correctly

### Email not sending
- Check the server console for error messages
- Verify your .env file is in the correct location
- Ensure the server has been restarted after adding environment variables

## Security Best Practices

1. **Use App Passwords**: Never use your main Gmail password
2. **Environment Variables**: Store credentials in .env files, not in code
3. **Gitignore**: Make sure .env is in your .gitignore file
4. **Regular Updates**: Keep your App Passwords updated
5. **Monitor Usage**: Check your Gmail for unusual activity

## Email Template Features

The contact form will send emails with:
- Professional HTML formatting
- Sender's contact information
- Reply-to set to sender's email
- Timestamp and source information
- Responsive design for mobile viewing

