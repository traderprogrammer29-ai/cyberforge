from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from database import get_db
from models import User
from security import jwt_token_tekshirish


security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """
    JWT token orqali hozirgi foydalanuvchini aniqlaydi.
    """

    token = credentials.credentials

    # JWT tekshirish
    try:
        payload = jwt_token_tekshirish(token)

    except ValueError as xato:
        raise HTTPException(
            status_code=401,
            detail=str(xato),
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # Token ichidan user ID
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Token ichida user ID topilmadi",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # ID integer ekanini tekshirish
    try:
        user_id = int(user_id)

    except (TypeError, ValueError):
        raise HTTPException(
            status_code=401,
            detail="Token ichidagi user ID noto'g'ri",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # Userni database'dan olish
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Foydalanuvchi topilmadi",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    return user
def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Faqat admin foydalanuvchilar uchun.
    """

    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin huquqi talab qilinadi",
        )

    return current_user
from datetime import datetime

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import User, Subscription
from security import jwt_token_tekshirish


def get_current_pro_user(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:

    subscription = (
        db.query(Subscription)
        .filter(
            Subscription.user_id == current_user.id,
            Subscription.status == "active",
        )
        .order_by(Subscription.expires_at.desc())
        .first()
    )

    if not subscription:
        raise HTTPException(
            status_code=403,
            detail="Bu funksiya faqat CyberForge PRO foydalanuvchilari uchun mavjud.",
        )

    if subscription.expires_at <= datetime.utcnow():
        subscription.status = "expired"
        db.commit()

        raise HTTPException(
            status_code=403,
            detail="PRO obunangiz muddati tugagan.",
        )

    return current_user