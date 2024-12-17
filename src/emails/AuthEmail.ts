import { transporter } from "../config/nodemailer";

interface EmailInterface {
    email: string;
    name: string;
    token: string; // This token will be a 6-digit code
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: EmailInterface) => {
        await transporter.sendMail({
            from: "UpTask <admin@uptask.com>",
            to: user.email,
            subject: "Your Verification Code - UpTask",
            text: `Hello ${user.name}, your verification code is: ${user.token}`,
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verification Code</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" bgcolor="#f4f4f4">
                        <tr>
                            <td align="center" style="padding: 20px 10px;">
                                <!-- Main Content -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
                                    <tr>
                                        <td align="center" bgcolor="#007bff" style="padding: 20px;">
                                            <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Your Verification Code</h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 30px 20px; text-align: center;">
                                            <p style="font-size: 16px; color: #333333; margin: 0;">
                                                Hello <strong>${user.name}</strong>,<br><br>
                                                Use the following verification code to confirm your account:
                                            </p>
                                            <p style="font-size: 28px; color: #28a745; margin: 20px 0; font-weight: bold;">
                                                ${user.token}
                                            </p>
                                            <p style="font-size: 14px; color: #555555; margin-top: 10px;">
                                                If you did not request this, please ignore this email or contact support.
                                            </p>
                                        </td>
                                    </tr>
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
}
