import nodemailer from 'nodemailer';

// Email configuration
console.log('Email service environment variables:', {
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD ? '***SET***' : 'NOT SET',
  NODE_ENV: process.env.NODE_ENV
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER ,
    pass: process.env.GMAIL_APP_PASSWORD , // Use App Password, not regular password
  },
});

// Email template
const createEmailTemplate = (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
        New Contact Form Submission
      </h2>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #007bff; margin-top: 0;">Contact Details</h3>
        
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        
        <h4 style="color: #333; margin-top: 20px;">Message:</h4>
        <div style="background-color: white; padding: 15px; border-left: 4px solid #007bff; margin-top: 10px;">
          ${data.message.replace(/\n/g, '<br>')}
        </div>
      </div>
      
      <div style="background-color: #e9ecef; padding: 15px; border-radius: 8px; margin-top: 20px;">
        <p style="margin: 0; color: #6c757d; font-size: 14px;">
          This message was sent from your portfolio contact form at ${new Date().toLocaleString()}
        </p>
      </div>
    </div>
  `;
};

export const sendContactEmail = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  try {

    const mailOptions = {
      from: process.env.GMAIL_USER || 'ayman.benchamkha@gmail.com',
      to: 'ayman.benchamkha@gmail.com',
      subject: `Portfolio Contact: ${data.subject}`,
      html: createEmailTemplate(data),
      replyTo: data.email, // Set reply-to to the sender's email
    };



    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      command: (error as any)?.command
    });
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export default transporter;
