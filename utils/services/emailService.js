// Required packages
const express = require('express');
const nodemailer = require('nodemailer');


class EmailService {
    constructor() {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASSWORD  // Use App Password for Gmail
        },
        // Enable additional debug logging
        debug: true,
        logger: true
      });
    }
  
    // Test email configuration
    async verifyConnection() {
      try {
        await this.transporter.verify();
        console.log('Email service is ready');
        return true;
      } catch (error) {
        console.error('Email verification failed:', {
          message: error.message,
          code: error.code,
          command: error.command
        });
        return false;
      }
    }
  
    async sendResetEmail(email, resetLink) {
      const mailOptions = {
        from: {
          name: 'Your App Name',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Password Reset Request',
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>You requested to reset your password. Click the button below to reset it:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background-color: #4CAF50; 
                        color: white; 
                        padding: 12px 24px; 
                        text-decoration: none; 
                        border-radius: 4px; 
                        display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this reset, please ignore this email.</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              ${resetLink}
            </p>
          </div>
        `
      };
  
      try {
        const info = await this.transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
      } catch (error) {
        console.error('Email send failed:', {
          message: error.message,
          code: error.code,
          command: error.command,
          recipient: email
        });
        throw new Error(`Email send failed: ${error.message}`);
      }
    }
  }
  
const emailService = new EmailService();
module.exports = {emailService};