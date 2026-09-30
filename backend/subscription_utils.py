from datetime import datetime
from sqlalchemy.orm import Session

from models import Subscription


def aktiv_subscriptionni_olish(
    db: Session,
    user_id: int,
):
    subscription = (
        db.query(Subscription)
        .filter(
            Subscription.user_id == user_id,
            Subscription.status == "active",
        )
        .order_by(Subscription.expires_at.desc())
        .first()
    )

    if not subscription:
        return None

    hozir = datetime.utcnow()

    if subscription.expires_at <= hozir:
        subscription.status = "expired"
        db.commit()
        db.refresh(subscription)
        return None

    return subscription