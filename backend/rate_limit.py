import time
from collections import defaultdict


MAX_FAILED_ATTEMPTS = 5
BLOCK_TIME = 60
ATTEMPT_WINDOW = 60


failed_attempts = defaultdict(list)
blocked_users = {}


def _tozalash(identifier: str, now: float):
    """
    Eski urinishlarni o'chiradi.
    """

    eski_urinishlar = failed_attempts[identifier]

    failed_attempts[identifier] = [
        attempt_time
        for attempt_time in eski_urinishlar
        if now - attempt_time < ATTEMPT_WINDOW
    ]


def loginni_tekshirish(identifier: str):
    """
    Username yoki username+IP uchun
    login qilishdan oldin limitni tekshiradi.
    """

    now = time.time()

    if identifier in blocked_users:
        block_until = blocked_users[identifier]

        if now < block_until:
            remaining = max(1, int(block_until - now))

            return False, (
                f"Juda ko'p noto'g'ri urinish. "
                f"{remaining} soniyadan keyin qayta urinib ko'ring"
            )

        del blocked_users[identifier]

    _tozalash(identifier, now)

    if len(failed_attempts[identifier]) >= MAX_FAILED_ATTEMPTS:
        blocked_users[identifier] = now + BLOCK_TIME

        return False, (
            "Juda ko'p noto'g'ri login urinishlari. "
            "60 soniyaga bloklandingiz"
        )

    return True, None


def login_xatosini_qayd_etish(identifier: str):
    """
    Noto'g'ri login urinishini qayd qiladi.
    """

    now = time.time()

    _tozalash(identifier, now)

    failed_attempts[identifier].append(now)

    if len(failed_attempts[identifier]) >= MAX_FAILED_ATTEMPTS:
        blocked_users[identifier] = now + BLOCK_TIME


def login_muvaffaqiyatli(identifier: str):
    """
    Muvaffaqiyatli login bo'lsa,
    failed urinishlarni tozalaydi.
    """

    failed_attempts.pop(identifier, None)
    blocked_users.pop(identifier, None)