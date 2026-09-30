
import os
import smtplib
from email.message import EmailMessage

from dotenv import load_dotenv

load_dotenv()


SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_FROM = os.getenv("SMTP_FROM")


def reset_email_yuborish(
    email: str,
    username: str,
    reset_link: str,
):
    print("=== EMAIL TEST ===")
    print("SMTP_HOST:", SMTP_HOST)
    print("SMTP_PORT:", SMTP_PORT)
    print("SMTP_USERNAME:", SMTP_USERNAME)
    print("SMTP_PASSWORD:", "BOR" if SMTP_PASSWORD else "YOQ")
    print("SMTP_FROM:", SMTP_FROM)
    print("TO:", email)

    if not SMTP_HOST:
        raise RuntimeError("SMTP_HOST .env faylida topilmadi")

    if not SMTP_USERNAME:
        raise RuntimeError("SMTP_USERNAME .env faylida topilmadi")

    if not SMTP_PASSWORD:
        raise RuntimeError("SMTP_PASSWORD .env faylida topilmadi")

    if not SMTP_FROM:
        raise RuntimeError("SMTP_FROM .env faylida topilmadi")

    message = EmailMessage()

    message["Subject"] = "CyberForge — Parolni tiklash"
    message["From"] = SMTP_FROM
    message["To"] = email

    message.set_content(
        f"""Salom, {username}!

CyberForge akkauntingiz uchun parolni tiklash so'rovi yuborildi.

Parolni tiklash uchun quyidagi havolani oching:

{reset_link}

Ushbu havola 30 daqiqa davomida amal qiladi.

Agar bu so'rovni siz yubormagan bo'lsangiz, ushbu emailni e'tiborsiz qoldiring.

CyberForge Security Team
"""
    )

    message.add_alternative(
        f"""
        <html>
            <body>
                <h2>CyberForge — Parolni tiklash</h2>

                <p>Salom, <strong>{username}</strong>!</p>

                <p>
                    CyberForge akkauntingiz uchun parolni tiklash
                    so'rovi yuborildi.
                </p>

                <p>
                    Parolni tiklash uchun quyidagi tugmani bosing:
                </p>

                <p>
                    <a href="{reset_link}">
                        Parolni tiklash
                    </a>
                </p>

                <p>
                    Ushbu havola <strong>30 daqiqa</strong> davomida amal qiladi.
                </p>

                <p>
                    Agar bu so'rovni siz yubormagan bo'lsangiz,
                    ushbu emailni e'tiborsiz qoldiring.
                </p>

                <hr>

                <p>CyberForge Security Team</p>
            </body>
        </html>
        """,
        subtype="html",
    )

    print("SMTP serverga ulanmoqda...")

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as server:
        print("SMTP serverga ulanish OK")

        server.starttls()
        print("STARTTLS OK")

        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        print("Gmail login OK")

        server.send_message(message)
        print("EMAIL YUBORILDI:", email)

    print("=== EMAIL TEST TUGADI ===")
