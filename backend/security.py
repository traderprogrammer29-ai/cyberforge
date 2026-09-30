import os
from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv
from pwdlib import PasswordHash

load_dotenv()

password_hash = PasswordHash.recommended()

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

if not JWT_SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY .env faylida topilmadi")

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


def parol_hashlash(parol: str) -> str:
    return password_hash.hash(parol)


def parol_tekshirish(parol: str, parol_hash: str) -> bool:
    return password_hash.verify(parol, parol_hash)


def jwt_token_yaratish(user_id: int, username: str) -> str:
    hozir = datetime.now(timezone.utc)

    payload = {
        "sub": str(user_id),
        "username": username,
        "iat": hozir,
        "exp": hozir + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        ),
    }

    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )


def jwt_token_tekshirish(token: str) -> dict:
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM],
        )

        return payload

    except jwt.ExpiredSignatureError:
        raise ValueError("Token muddati tugagan")

    except jwt.InvalidTokenError:
        raise ValueError("Token noto'g'ri")