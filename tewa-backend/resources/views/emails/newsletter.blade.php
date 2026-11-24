<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#FAF6EF; font-family: Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF6EF; padding: 32px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:4px; overflow:hidden;">
                    <tr>
                        <td style="background-color:#0C0C0C; padding: 24px; text-align:center;">
                            <span style="color:#C6A667; font-size:22px; font-weight:bold; letter-spacing:1px;">TEWA</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 32px; color:#333333; font-size:15px; line-height:1.6;">
                            {!! $htmlBody !!}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 24px; text-align:center; background-color:#FAF6EF; font-size:12px; color:#999999;">
                            You're receiving this because you subscribed to Tewa updates.<br>
                            <a href="{{ $unsubscribeUrl }}" style="color:#4B2E83;">Unsubscribe</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>