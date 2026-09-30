import os
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import (
    LoginRequest,
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)
from security import (
    jwt_token_yaratish,
    parol_hashlash,
    parol_tekshirish,
)
from rate_limit import (
    loginni_tekshirish,
    login_xatosini_qayd_etish,
    login_muvaffaqiyatli,
)
from security_logger import security_log_yozish
from dependencies import get_current_user
from email_service import reset_email_yuborish


router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


# =========================================================
# CLIENT IP
# =========================================================

def client_ip_olish(request: Request) -> str:
    if request.client:
        return request.client.host

    return "unknown"


# =========================================================
# REGISTER
# =========================================================

@router.post("/register")
def register(
    request: Request,
    data: RegisterRequest,
    db: Session = Depends(get_db),
):
    client_ip = client_ip_olish(request)

    mavjud_username = (
        db.query(User)
        .filter(User.username == data.username)
        .first()
    )

    if mavjud_username:
        security_log_yozish(
            db=db,
            event="register_failed",
            username=data.username,
            ip_address=client_ip,
            details="Username allaqachon mavjud",
        )

        raise HTTPException(
            status_code=400,
            detail="Bu username allaqachon mavjud",
        )

    mavjud_email = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if mavjud_email:
        security_log_yozish(
            db=db,
            event="register_failed",
            username=data.username,
            ip_address=client_ip,
            details="Email allaqachon mavjud",
        )

        raise HTTPException(
            status_code=400,
            detail="Bu email allaqachon mavjud",
        )

    yangi_user = User(
        username=data.username,
        email=data.email,
        password_hash=parol_hashlash(data.password),
    )

    db.add(yangi_user)
    db.commit()
    db.refresh(yangi_user)

    security_log_yozish(
        db=db,
        event="register_success",
        user_id=yangi_user.id,
        username=yangi_user.username,
        ip_address=client_ip,
        details="Yangi foydalanuvchi ro'yxatdan o'tdi",
    )

    return {
        "status": "success",
        "message": "Ro'yxatdan o'tish muvaffaqiyatli",
        "user_id": yangi_user.id,
        "username": yangi_user.username,
    }


# =========================================================
# LOGIN
# =========================================================

@router.post("/login")
def login(
    request: Request,
    data: LoginRequest,
    db: Session = Depends(get_db),
):
    client_ip = client_ip_olish(request)

    username_identifier = f"username:{data.username}"
    ip_identifier = f"ip:{client_ip}"

    username_ruxsat, username_xabar = loginni_tekshirish(
        username_identifier
    )

    if not username_ruxsat:
        security_log_yozish(
            db=db,
            event="login_rate_limited",
            username=data.username,
            ip_address=client_ip,
            details=f"Username limit: {username_xabar}",
        )

        raise HTTPException(
            status_code=429,
            detail=username_xabar,
        )

    ip_ruxsat, ip_xabar = loginni_tekshirish(
        ip_identifier
    )

    if not ip_ruxsat:
        security_log_yozish(
            db=db,
            event="login_rate_limited",
            username=data.username,
            ip_address=client_ip,
            details=f"IP limit: {ip_xabar}",
        )

        raise HTTPException(
            status_code=429,
            detail="Juda ko'p login urinishlari. Keyinroq qayta urinib ko'ring",
        )

    user = (
        db.query(User)
        .filter(User.username == data.username)
        .first()
    )

    if not user:
        login_xatosini_qayd_etish(username_identifier)
        login_xatosini_qayd_etish(ip_identifier)

        security_log_yozish(
            db=db,
            event="login_failed",
            username=data.username,
            ip_address=client_ip,
            details="Username topilmadi",
        )

        raise HTTPException(
            status_code=401,
            detail="Username yoki parol noto'g'ri",
        )

    parol_togri = parol_tekshirish(
        data.password,
        user.password_hash,
    )

    if not parol_togri:
        login_xatosini_qayd_etish(username_identifier)
        login_xatosini_qayd_etish(ip_identifier)

        security_log_yozish(
            db=db,
            event="login_failed",
            user_id=user.id,
            username=user.username,
            ip_address=client_ip,
            details="Noto'g'ri parol",
        )

        raise HTTPException(
            status_code=401,
            detail="Username yoki parol noto'g'ri",
        )

    token = jwt_token_yaratish(
        user_id=user.id,
        username=user.username,
    )

    login_muvaffaqiyatli(username_identifier)
    login_muvaffaqiyatli(ip_identifier)

    security_log_yozish(
        db=db,
        event="login_success",
        user_id=user.id,
        username=user.username,
        ip_address=client_ip,
        details="Muvaffaqiyatli login",
    )

    return {
        "status": "success",
        "message": "Login muvaffaqiyatli",
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username,
    }


# =========================================================
# FORGOT PASSWORD
# =========================================================

@router.post("/forgot-password")
def forgot_password(
    request: Request,
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    client_ip = client_ip_olish(request)

    user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if not user:
        security_log_yozish(
            db=db,
            event="password_reset_requested",
            ip_address=client_ip,
            details="Password reset so'rovi",
        )

        return {
            "status": "success",
            "message": (
                "Agar bu email mavjud bo'lsa, "
                "parolni tiklash havolasi yuboriladi"
            ),
        }

    # Kuchli random token
    reset_token = secrets.token_urlsafe(32)

    # 30 daqiqalik expiry
    # PostgreSQL dagi timezone'siz DateTime bilan
    # bir xil formatda ishlash uchun UTC-naive vaqt ishlatiladi.
    reset_expires = (
        datetime.utcnow()
        + timedelta(minutes=30)
    )

    user.password_reset_token = reset_token
    user.password_reset_expires = reset_expires

    db.commit()

    frontend_url = os.getenv(
        "FRONTEND_URL",
        "http://localhost:3000",
    )

    reset_link = (
        f"{frontend_url}/reset-password"
        f"?token={reset_token}"
    )

    try:
        reset_email_yuborish(
            email=user.email,
            username=user.username,
            reset_link=reset_link,
        )

    except Exception as xato:
        # Email yuborilmasa tokenni bekor qilamiz
        user.password_reset_token = None
        user.password_reset_expires = None
        db.commit()

        print(
            "EMAIL YUBORISH XATOSI:",
            repr(xato),
        )

        security_log_yozish(
            db=db,
            event="password_reset_email_failed",
            user_id=user.id,
            username=user.username,
            ip_address=client_ip,
            details="Reset email yuborishda xatolik",
        )

    else:
        security_log_yozish(
            db=db,
            event="password_reset_requested",
            user_id=user.id,
            username=user.username,
            ip_address=client_ip,
            details="Password reset email yuborildi",
        )

    return {
        "status": "success",
        "message": (
            "Agar bu email mavjud bo'lsa, "
            "parolni tiklash havolasi yuboriladi"
        ),
    }


# =========================================================
# RESET PASSWORD
# =========================================================

@router.post("/reset-password")
def reset_password(
    request: Request,
    data: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    client_ip = client_ip_olish(request)

    # Token orqali userni topamiz
    user = (
        db.query(User)
        .filter(User.password_reset_token == data.token)
        .first()
    )

    if not user:
        security_log_yozish(
            db=db,
            event="password_reset_failed",
            ip_address=client_ip,
            details="Noto'g'ri yoki yaroqsiz reset token",
        )

        raise HTTPException(
            status_code=400,
            detail="Reset token noto'g'ri yoki yaroqsiz",
        )

    # Expiry mavjudligini tekshirish
    if user.password_reset_expires is None:
        security_log_yozish(
            db=db,
            event="password_reset_failed",
            user_id=user.id,
            username=user.username,
            ip_address=client_ip,
            details="Reset token expiry mavjud emas",
        )

        raise HTTPException(
            status_code=400,
            detail="Reset token yaroqsiz",
        )

    # Hozirgi UTC vaqt
    # Database ham UTC-naive formatda saqlayapti.
    hozir = datetime.utcnow()

    # Database'dan kelgan expiry
    expires = user.password_reset_expires

    # Debug
    print("=" * 50)
    print("PASSWORD RESET DEBUG")
    print("HOZIR:", hozir)
    print("TOKEN EXPIRES:", expires)
    print("FARQ:", expires - hozir)
    print("=" * 50)

    # Token muddati tugagan
    if hozir >= expires:
        user.password_reset_token = None
        user.password_reset_expires = None

        db.commit()

        security_log_yozish(
            db=db,
            event="password_reset_expired",
            user_id=user.id,
            username=user.username,
            ip_address=client_ip,
            details="Reset token muddati tugagan",
        )

        raise HTTPException(
            status_code=400,
            detail="Reset token muddati tugagan",
        )

    # Yangi parolni hash qilamiz
    user.password_hash = parol_hashlash(
        data.new_password
    )

    # Tokenni bir martalik qilamiz
    user.password_reset_token = None
    user.password_reset_expires = None

    db.commit()

    # Security log
    security_log_yozish(
        db=db,
        event="password_reset_success",
        user_id=user.id,
        username=user.username,
        ip_address=client_ip,
        details="Foydalanuvchi parolini reset orqali yangiladi",
    )

    return {
        "status": "success",
        "message": "Parol muvaffaqiyatli yangilandi",
    }


# =========================================================
# CURRENT USER
# =========================================================

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user),
):
    return {
        "status": "success",
        "user_id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "xp": current_user.xp,
        "level": current_user.level,
    }
