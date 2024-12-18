import { transporter } from "../config/nodemailer";

interface EmailInterface {
    email: string;
    name: string;
    token: string; // Token de 6 dígitos
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: EmailInterface) => {
        await transporter.sendMail({
            from: "UpTask <admin@uptask.com>",
            to: user.email,
            subject: "Confirm Your Account - UpTask",
            text: `Hello ${user.name}, visit the following link to confirm your account: http://localhost:5173/auth/confirm-account, and then enter this 6-digit code: ${user.token}.`,
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Confirm Your Account</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" bgcolor="#f4f4f4">
                        <tr>
                            <td align="center" style="padding: 20px 10px;">
                                <!-- Main Content -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
                                    <!-- Header -->
                                    <tr>
                                        <td align="center" bgcolor="#007bff" style="padding: 20px;">
                                            <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Welcome to UpTask</h1>
                                        </td>
                                    </tr>
                                    <!-- Body -->
                                    <tr>
                                        <td style="padding: 30px 20px; text-align: center;">
                                            <p style="font-size: 16px; color: #333333; margin: 0;">
                                                Hello <strong>${user.name}</strong>,<br><br>
                                                Visit the link below and enter the <strong>6-digit code</strong> to confirm your account:
                                            </p>
                                            <!-- Token Code -->
                                            <p style="margin: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 3px; color: #007bff;">
                                                ${user.token}
                                            </p>
                                            <!-- Button -->
                                            <p style="margin: 30px 0;">
                                                <a href="${process.env.FRONTEND_URL}/auth/confirm-account" 
                                                style="display: inline-block; background-color: #28a745; color: #ffffff; text-decoration: none; font-size: 16px; padding: 12px 24px; border-radius: 5px; font-weight: bold;">
                                                Confirm Account
                                                </a>
                                            </p>
                                            <p style="font-size: 16px; color: #333333;">
                                                After clicking the button, enter the above code on the confirmation page to activate your account.
                                            </p>
                                            <p style="font-size: 14px; color: #555555;">
                                                If you did not create an account, please ignore this email.
                                            </p>
                                        </td>
                                    </tr>
                                    <!-- Footer -->
                                    <tr>
                                        <td align="center" bgcolor="#f4f4f4" style="padding: 20px; font-size: 12px; color: #777777;">
                                            <p style="margin: 0;">&copy; ${new Date().getFullYear()} UpTask. All rights reserved.</p>
                                            <p style="margin: 5px 0;">
                                                Need help? <a href="mailto:support@uptask.com" style="color: #007bff; text-decoration: none;">Contact Support</a>
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `,
        });
    };

    static sendResetPasswordEmail = async (user: EmailInterface) => {
        await transporter.sendMail({
            from: "UpTask <admin@uptask.com>",
            to: user.email,
            subject: "Reset Your Password - UpTask",
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Reset Your Password</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            color: #333;
                        }
                        .container {
                            width: 600px;
                            margin: 0 auto;
                            background-color: #fff;
                            border-radius: 8px;
                            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                            overflow: hidden;
                        }
                        .header {
                            background-color: #333;
                            padding: 20px;
                            text-align: center;
                            color: #fff;
                            border-bottom: 2px solid #444;
                        }
                        .content {
                            padding: 30px 20px;
                            text-align: center;
                        }
                        .button {
                            display: inline-block;
                            background-color: #6c5ce7; /* Purple color */
                            color: #fff;
                            text-decoration: none;
                            font-size: 16px;
                            padding: 12px 24px;
                            border-radius: 5px;
                            font-weight: bold;
                            margin-top: 10px;
                            margin-bottom: 30px;
                            transition: background-color 0.3s ease-in-out;
                        }
                        .button:hover {
                            background-color: #301934; /* Darker shade of purple on hover */
                        }
                        .footer {
                            background-color: #f4f4f4;
                            margin-top: 20px;
                            padding: 20px;
                            font-size: 12px;
                            text-align: center;
                            color: #777;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Reset Your Password</h1>
                        </div>
                        <div class="content">
                            <p style="font-size: 16px; color: #333333; margin: 0;">
                                Hello <strong>${user.name}</strong>,<br><br>
                                Click the button below and enter the <strong>6-digit code</strong> to confirm your account:
                            </p>
                            <!-- Token Code -->
                            <p style="margin: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 3px; color: #007bff;">
                                ${user.token}
                            </p>
                            <a href="${process.env.FRONTEND_URL}/auth/reset-password" class="button">
                                Reset Password
                            </a>
                            <p style="font-size: 16px; color: #333333;">
                                After clicking the button, enter the above code on the confirmation page to activate your account.
                            </p>
                            <p>
                                This token expires in 10 minutes
                            </p>
                            <p>If you did not request a password reset, please ignore this email.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} UpTask. All rights reserved.</p>
                            <p>Need help? <a href="mailto:support@uptask.com" style="color: #007bff; text-decoration: none;">Contact Support</a></p>
                        </div>
                    </div>
                </body>
                </html>
            `
        });
    }    
}
