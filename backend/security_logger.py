from sqlalchemy.orm import Session

from models import SecurityLog


def security_log_yozish(
    db: Session,
    event: str,
    user_id: int | None = None,
    username: str | None = None,
    ip_address: str | None = None,
    details: str | None = None,
):
    log = SecurityLog(
        user_id=user_id,
        username=username,
        event=event,
        ip_address=ip_address,
        details=details,
    )

    db.add(log)
    db.commit()

