from datetime import datetime, timedelta
from pydantic import BaseModel
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from auth import router as auth_router
from database import get_db
from dependencies import get_current_admin, get_current_user

from models import (
    Course,
    Lesson,
    LessonProgress,
    QuizQuestion,
    SecurityLog,
    Subscription,
    User,
)

from schemas import (
    CourseCreateRequest,
    LessonCreate,
    LessonUpdate,
    QuizQuestionCreateRequest,
    QuizQuestionsBulkCreateRequest,
    QuizSubmitRequest,
)


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="CyberForge API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


# =========================================================
# MIDDLEWARES
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=False,
    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
    ],
    allow_headers=[
        "Authorization",
        "Content-Type",
    ],
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=False,
    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
    ],
    allow_headers=[
        "Authorization",
        "Content-Type",
    ],
)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"

        response.headers[
            "Referrer-Policy"
        ] = "strict-origin-when-cross-origin"

        response.headers[
            "Permissions-Policy"
        ] = "camera=(), microphone=(), geolocation=()"

        response.headers[
            "Content-Security-Policy"
        ] = (
            "default-src 'self'; "
            "script-src 'self'; "
            "style-src 'self'; "
            "img-src 'self' data:; "
            "font-src 'self'; "
            "connect-src 'self'; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self'"
        )

        return response


app.add_middleware(SecurityHeadersMiddleware)
# =========================================================
# HELPER FUNCTIONS
# =========================================================

def xp_qoshish(
    user: User,
    miqdor: int,
    db,
):

    user.xp += miqdor

    # Har 500 XP = 1 level
    user.level = (user.xp // 500) + 1

    db.commit()
    db.refresh(user)

    return user


# =========================================================
# SUBSCRIPTION CHECK
# =========================================================

def obunani_tekshirish(
    user: User,
    db,
):

    obuna = (
        db.query(Subscription)
        .filter(
            Subscription.user_id == user.id,
            Subscription.status == "active",
        )
        .order_by(
            Subscription.expires_at.desc()
        )
        .first()
    )

    # Obuna yo'q
    if not obuna:

        return {
            "active": False,
            "status": "free",
            "plan": "free",
            "price": 0,
            "started_at": None,
            "expires_at": None,
            "remaining_days": 0,
            "message": "Faol PRO obuna mavjud emas.",
        }

    hozir = datetime.utcnow()

    # Obuna tugagan
    if obuna.expires_at <= hozir:

        obuna.status = "expired"

        db.commit()

        return {
            "active": False,
            "status": "expired",
            "plan": obuna.plan,
            "price": obuna.price,
            "started_at": obuna.started_at,
            "expires_at": obuna.expires_at,
            "remaining_days": 0,
            "message": (
                "PRO obunangiz tugagan. "
                "Yangi obuna ulang."
            ),
        }

    # Qolgan vaqt
    qolgan_vaqt = obuna.expires_at - hozir

    qolgan_kun = qolgan_vaqt.days

    if qolgan_kun <= 1:

        xabar = (
            "PRO obunangiz tugamoqda. "
            "Yangisiga ulang."
        )

    elif qolgan_kun <= 2:

        xabar = (
            "PRO obunangiz tugashiga "
            "2 kun qoldi. Yangilang."
        )

    else:

        xabar = "PRO obunangiz faol."

    return {
        "active": True,
        "status": "active",
        "plan": obuna.plan,
        "price": obuna.price,
        "started_at": obuna.started_at,
        "expires_at": obuna.expires_at,
        "remaining_days": qolgan_kun,
        "message": xabar,
    }
# =========================================================
# ADMIN PRO SUBSCRIPTION
# =========================================================

class AdminSubscriptionRequest(BaseModel):
    username: str
    plan: str


@app.post("/admin/subscriptions/grant")
def admin_pro_obuna_faollashtirish(
    data: AdminSubscriptionRequest,
    current_admin: User = Depends(get_current_admin),
    db=Depends(get_db),
):
    # Faqat ruxsat berilgan PRO rejalar
    rejalar = {
        "1_month": {
            "days": 30,
            "price": 79000,
        },
        "3_month": {
            "days": 90,
            "price": 169000,
        },
        "1_year": {
            "days": 365,
            "price": 599000,
        },
    }

    # Plan tekshirish
    if data.plan not in rejalar:
        raise HTTPException(
            status_code=400,
            detail="Noto'g'ri obuna rejasi.",
        )

    # Username ni tozalash
    username = data.username.strip()

    if not username:
        raise HTTPException(
            status_code=400,
            detail="Username kiritilmagan.",
        )

    # Foydalanuvchini username orqali topish
    user = (
        db.query(User)
        .filter(User.username == username)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Bunday username topilmadi.",
        )

    # Admin o'ziga PRO bermoqchi bo'lsa ham ishlaydi,
    # chunki endpoint allaqachon admin tomonidan himoyalangan.

    plan_info = rejalar[data.plan]

    started_at = datetime.utcnow()

    expires_at = started_at + timedelta(
        days=plan_info["days"]
    )

    # Foydalanuvchining eski active PRO obunalarini yopish
    eski_obunalar = (
        db.query(Subscription)
        .filter(
            Subscription.user_id == user.id,
            Subscription.status == "active",
        )
        .all()
    )

    for eski_obuna in eski_obunalar:
        eski_obuna.status = "expired"

    # Yangi PRO obuna
    yangi_obuna = Subscription(
        user_id=user.id,
        plan=data.plan,
        status="active",
        started_at=started_at,
        expires_at=expires_at,
        price=plan_info["price"],
    )

    db.add(yangi_obuna)

    db.commit()
    db.refresh(yangi_obuna)

    return {
        "status": "success",
        "message": (
            f"{user.username} uchun PRO obuna "
            f"muvaffaqiyatli faollashtirildi."
        ),
        "subscription": {
            "id": yangi_obuna.id,
            "user_id": user.id,
            "username": user.username,
            "plan": yangi_obuna.plan,
            "status": yangi_obuna.status,
            "price": yangi_obuna.price,
            "started_at": yangi_obuna.started_at,
            "expires_at": yangi_obuna.expires_at,
        },
    }

# =========================================================
# ROUTERS
# =========================================================

app.include_router(auth_router)


# =========================================================
# BASIC
# =========================================================

@app.get("/")
def bosh_sahifa():

    return {
        "status": "ok",
        "message": "CyberForge API ishlayapti",
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


# =========================================================
# USERS & ADMIN
# =========================================================

@app.get("/admin/test")
def admin_test(
    current_admin=Depends(get_current_admin),
):

    return {
        "status": "success",
        "message": "Admin endpoint ishlayapti",
        "admin": current_admin.username,
    }


@app.get("/users/{user_id}")
def get_user(
    user_id: int,
    current_user=Depends(get_current_user),
):

    if user_id != current_user.id:

        raise HTTPException(
            status_code=403,
            detail=(
                "Bu foydalanuvchi "
                "ma'lumotlariga ruxsat yo'q"
            ),
        )

    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
    }


@app.get("/admin/users")
def admin_users(
    current_admin=Depends(get_current_admin),
    db=Depends(get_db),
):

    users = (
        db.query(User)
        .order_by(User.id.asc())
        .all()
    )

    return {
        "status": "success",
        "users": [

            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "xp": user.xp,
                "level": user.level,
                "created_at": user.created_at,
            }

            for user in users
        ],
    }


# =========================================================
# COURSES
# =========================================================

@app.post("/admin/courses")
def create_course(
    course_data: CourseCreateRequest,
    current_admin=Depends(get_current_admin),
    db=Depends(get_db),
):

    existing_course = (
        db.query(Course)
        .filter(
            Course.slug == course_data.slug
        )
        .first()
    )

    if existing_course:

        raise HTTPException(
            status_code=400,
            detail=(
                "Bu slug bilan kurs "
                "allaqachon mavjud"
            ),
        )

    course = Course(
        title=course_data.title,
        slug=course_data.slug,
        description=course_data.description,
        level=course_data.level,
        is_published=course_data.is_published,
        is_pro=course_data.is_pro,
    )

    db.add(course)

    db.commit()

    db.refresh(course)

    return {
        "status": "success",
        "message": "Kurs muvaffaqiyatli yaratildi",
        "course": course,
    }


@app.get("/courses")
def get_courses(
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    obuna = obunani_tekshirish(current_user, db)

    courses = (
        db.query(Course)
        .filter(
            Course.is_published == True
        )
        .order_by(
            Course.id.asc()
        )
        .all()
    )

    ochiq_kurslar = []

    for course in courses:
        if course.is_pro and not obuna["active"]:
            continue

        ochiq_kurslar.append(course)

    return {
        "status": "success",
        "subscription": obuna,
        "courses": ochiq_kurslar,
    }

@app.put("/admin/courses/{course_id}")
def update_course(
    course_id: int,
    course_data: CourseCreateRequest,
    current_admin=Depends(get_current_admin),
    db=Depends(get_db),
):

    course = (
        db.query(Course)
        .filter(
            Course.id == course_id
        )
        .first()
    )

    if not course:

        raise HTTPException(
            status_code=404,
            detail="Kurs topilmadi",
        )

    existing_course = (
        db.query(Course)
        .filter(
            Course.slug == course_data.slug,
            Course.id != course_id,
        )
        .first()
    )

    if existing_course:

        raise HTTPException(
            status_code=400,
            detail=(
                "Bu slug bilan boshqa "
                "kurs allaqachon mavjud"
            ),
        )

    course.title = course_data.title
    course.slug = course_data.slug
    course.description = course_data.description
    course.level = course_data.level
    course.is_published = course_data.is_published
    course.is_pro = course_data.is_pro

    db.commit()

    db.refresh(course)

    return {
        "status": "success",
        "message": (
            "Kurs muvaffaqiyatli yangilandi"
        ),
        "course": course,
    }


@app.delete("/admin/courses/{course_id}")
def delete_course(
    course_id: int,
    current_admin=Depends(get_current_admin),
    db=Depends(get_db),
):

    course = (
        db.query(Course)
        .filter(
            Course.id == course_id
        )
        .first()
    )

    if not course:

        raise HTTPException(
            status_code=404,
            detail="Kurs topilmadi",
        )

    db.delete(course)

    db.commit()

    return {
        "status": "success",
        "message": (
            "Kurs muvaffaqiyatli o'chirildi"
        ),
    }


# =========================================================
# LESSONS
# =========================================================

@app.post("/admin/lessons")
def lesson_yaratish(
    lesson: LessonCreate,
    db=Depends(get_db),
    current_admin: User = Depends(
        get_current_admin
    ),
):

    course = (
        db.query(Course)
        .filter(
            Course.id == lesson.course_id
        )
        .first()
    )

    if not course:

        raise HTTPException(
            status_code=404,
            detail="Kurs topilmadi",
        )

    mavjud_lesson = (
        db.query(Lesson)
        .filter(
            Lesson.slug == lesson.slug
        )
        .first()
    )

    if mavjud_lesson:

        raise HTTPException(
            status_code=400,
            detail=(
                "Bu slug bilan lesson "
                "allaqachon mavjud"
            ),
        )

    yangi_lesson = Lesson(
        course_id=lesson.course_id,
        title=lesson.title,
        slug=lesson.slug,
        content=lesson.content,
        order=lesson.order,
        is_published=lesson.is_published,
    )

    db.add(yangi_lesson)

    db.commit()

    db.refresh(yangi_lesson)

    return {
        "status": "success",
        "message": (
            "Lesson muvaffaqiyatli yaratildi"
        ),
        "lesson": yangi_lesson,
    }


@app.get("/admin/lessons")
def lessonlarni_olish(
    db=Depends(get_db),
    current_admin: User = Depends(
        get_current_admin
    ),
):

    lessons = (
        db.query(Lesson)
        .order_by(
            Lesson.course_id,
            Lesson.order
        )
        .all()
    )

    return {
        "status": "success",
        "lessons": lessons,
    }


@app.put("/admin/lessons/{lesson_id}")
def lessonni_tahrirlash(
    lesson_id: int,
    lesson: LessonUpdate,
    db=Depends(get_db),
    current_admin: User = Depends(
        get_current_admin
    ),
):

    mavjud_lesson = (
        db.query(Lesson)
        .filter(
            Lesson.id == lesson_id
        )
        .first()
    )

    if not mavjud_lesson:

        raise HTTPException(
            status_code=404,
            detail="Lesson topilmadi",
        )

    yangilanishlar = lesson.model_dump(
        exclude_unset=True
    )

    for maydon, qiymat in yangilanishlar.items():

        setattr(
            mavjud_lesson,
            maydon,
            qiymat
        )

    db.commit()

    db.refresh(mavjud_lesson)

    return {
        "status": "success",
        "message": (
            "Lesson muvaffaqiyatli yangilandi"
        ),
        "lesson": mavjud_lesson,
    }


@app.delete("/admin/lessons/{lesson_id}")
def lessonni_ochirish(
    lesson_id: int,
    db=Depends(get_db),
    current_admin: User = Depends(
        get_current_admin
    ),
):

    mavjud_lesson = (
        db.query(Lesson)
        .filter(
            Lesson.id == lesson_id
        )
        .first()
    )

    if not mavjud_lesson:

        raise HTTPException(
            status_code=404,
            detail="Lesson topilmadi",
        )

    db.delete(mavjud_lesson)

    db.commit()

    return {
        "status": "success",
        "message": (
            "Lesson muvaffaqiyatli o'chirildi"
        ),
    }


@app.get("/courses/{course_id}/lessons")
def kurs_lessonslarini_olish(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    course = (
        db.query(Course)
        .filter(
            Course.id == course_id,
            Course.is_published == True,
        )
        .first()
    )

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Kurs topilmadi",
        )

    # PRO obunani tekshirish
    obuna = obunani_tekshirish(current_user, db)

    # PRO kurs bo'lsa, PRO obuna talab qilinadi
    if course.is_pro and not obuna["active"]:
        raise HTTPException(
            status_code=403,
            detail="Bu kurs faqat PRO foydalanuvchilar uchun.",
        )

    lessons = (
        db.query(Lesson)
        .filter(
            Lesson.course_id == course_id,
            Lesson.is_published == True,
        )
        .order_by(
            Lesson.order.asc()
        )
        .all()
    )

    return {
        "status": "success",
        "course": course,
        "lessons": lessons,
    }

# =========================================================
# DASHBOARD
# =========================================================

@app.get("/dashboard")
def dashboardni_olish(
    current_user: User = Depends(
        get_current_user
    ),
    db=Depends(get_db),
):

    courses = (
        db.query(Course)
        .filter(
            Course.is_published == True
        )
        .order_by(
            Course.id.asc()
        )
        .all()
    )

    kurslar = []

    for course in courses:

        lessons = (
            db.query(Lesson)
            .filter(
                Lesson.course_id == course.id,
                Lesson.is_published == True,
            )
            .order_by(
                Lesson.order.asc()
            )
            .all()
        )

        total_lessons = len(lessons)

        lesson_ids = [
            lesson.id
            for lesson in lessons
        ]

        completed_lessons = 0

        if lesson_ids:

            completed_lessons = (
                db.query(LessonProgress)
                .filter(
                    LessonProgress.user_id
                    == current_user.id,

                    LessonProgress.lesson_id.in_(
                        lesson_ids
                    ),

                    LessonProgress.completed
                    == True,
                )
                .count()
            )

        progress = (
            round(
                (
                    completed_lessons
                    / total_lessons
                )
                * 100
            )
            if total_lessons > 0
            else 0
        )

        kurslar.append(
            {
                "id": course.id,
                "title": course.title,
                "slug": course.slug,
                "description": course.description,
                "level": course.level,
                "is_pro": course.is_pro,
                "total_lessons": total_lessons,
                "completed_lessons": completed_lessons,
                "progress": progress,
            }
        )

    return {
        "status": "success",

        "user": {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "role": current_user.role,
            "xp": current_user.xp,
            "level": current_user.level,
        },

        "subscription": obunani_tekshirish(
            current_user,
            db
        ),

        "courses": kurslar,
    }


# =========================================================
# LESSON COMPLETE
# =========================================================
@app.post("/lessons/{lesson_id}/complete")
def lessonni_tugatish(
    lesson_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db=Depends(get_db),
):
    # 1. Lessonni topish
    lesson = (
        db.query(Lesson)
        .filter(
            Lesson.id == lesson_id,
            Lesson.is_published == True,
        )
        .first()
    )

    if not lesson:
        raise HTTPException(
            status_code=404,
            detail="Lesson topilmadi",
        )

    # 2. Lesson tegishli kursni tekshirish
    course = (
        db.query(Course)
        .filter(
            Course.id == lesson.course_id,
            Course.is_published == True,
        )
        .first()
    )

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Kurs topilmadi",
        )

    # 3. PRO kurs bo'lsa, obunani tekshirish
    obuna = obunani_tekshirish(
        current_user,
        db,
    )

    if course.is_pro and not obuna["active"]:
        raise HTTPException(
            status_code=403,
            detail=(
                "Bu lesson faqat PRO "
                "foydalanuvchilar uchun."
            ),
        )

    # 4. Userning progressini topish
    progress = (
        db.query(LessonProgress)
        .filter(
            LessonProgress.user_id
            == current_user.id,
            LessonProgress.lesson_id
            == lesson_id,
        )
        .first()
    )

    # 5. Birinchi marta tugatayotgan bo'lsa
    if not progress:

        progress = LessonProgress(
            user_id=current_user.id,
            lesson_id=lesson_id,
            completed=True,
            completed_at=datetime.utcnow(),
        )

        db.add(progress)

        # XP faqat birinchi marta beriladi
        xp_qoshish(
            current_user,
            20,
            db,
        )

        xabar = (
            "Lesson tugatildi. "
            "+20 XP berildi."
        )

    # 6. Oldin progress mavjud bo'lsa
    else:

        # Faqat hali tugatilmagan bo'lsa XP beriladi
        if not progress.completed:

            progress.completed = True
            progress.completed_at = (
                datetime.utcnow()
            )

            xp_qoshish(
                current_user,
                20,
                db,
            )

            xabar = (
                "Lesson tugatildi. "
                "+20 XP berildi."
            )

        else:

            # Oldin tugatilgan lesson uchun
            # qayta XP berilmaydi
            xabar = (
                "Bu lesson avval tugatilgan. "
                "XP qayta berilmaydi."
            )

    db.commit()
    db.refresh(progress)

    return {
        "status": "success",
        "message": xabar,
        "lesson_id": lesson_id,
        "completed": progress.completed,
        "completed_at": progress.completed_at,
        "xp": current_user.xp,
        "level": current_user.level,
    }

# =========================================================
# QUIZ
# =========================================================

@app.post("/admin/quiz/questions")
def quiz_savolini_yaratish(
    data: QuizQuestionCreateRequest,
    current_admin: User = Depends(
        get_current_admin
    ),
    db=Depends(get_db),
):

    lesson = (
        db.query(Lesson)
        .filter(
            Lesson.id == data.lesson_id
        )
        .first()
    )

    if not lesson:

        raise HTTPException(
            status_code=404,
            detail="Lesson topilmadi",
        )

    mavjud_savol = (
        db.query(QuizQuestion)
        .filter(
            QuizQuestion.lesson_id
            == data.lesson_id,

            QuizQuestion.order
            == data.order,
        )
        .first()
    )

    if mavjud_savol:

        raise HTTPException(
            status_code=409,
            detail=(
                "Bu tartib raqamida savol "
                "allaqachon mavjud"
            ),
        )

    yangi_savol = QuizQuestion(
        lesson_id=data.lesson_id,
        question=data.question,
        option_a=data.option_a,
        option_b=data.option_b,
        option_c=data.option_c,
        option_d=data.option_d,
        correct_answer=data.correct_answer,
        explanation=data.explanation,
        order=data.order,
    )

    db.add(yangi_savol)

    db.commit()

    db.refresh(yangi_savol)

    return {
        "status": "success",
        "message": "Quiz savoli yaratildi",

        "question": {
            "id": yangi_savol.id,
            "lesson_id": yangi_savol.lesson_id,
            "question": yangi_savol.question,
            "option_a": yangi_savol.option_a,
            "option_b": yangi_savol.option_b,
            "option_c": yangi_savol.option_c,
            "option_d": yangi_savol.option_d,
            "explanation": yangi_savol.explanation,
            "order": yangi_savol.order,
        },
    }


# =========================================================
# GET QUIZ QUESTIONS
# =========================================================

@app.get("/lessons/{lesson_id}/quiz")
def quiz_savollarini_olish(
    lesson_id: int,
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
):
    lesson = (
        db.query(Lesson)
        .filter(
            Lesson.id == lesson_id,
            Lesson.is_published == True,
        )
        .first()
    )

    if not lesson:
        raise HTTPException(
            status_code=404,
            detail="Lesson topilmadi",
        )

    # Lesson tegishli bo'lgan kursni topamiz
    course = (
        db.query(Course)
        .filter(
            Course.id == lesson.course_id,
            Course.is_published == True,
        )
        .first()
    )

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Kurs topilmadi",
        )

    # PRO obunani tekshiramiz
    obuna = obunani_tekshirish(current_user, db)

    # Agar kurs PRO bo'lsa, PRO obuna kerak
    if course.is_pro and not obuna["active"]:
        raise HTTPException(
            status_code=403,
            detail="Bu quiz faqat PRO foydalanuvchilar uchun.",
        )

    savollar = (
        db.query(QuizQuestion)
        .filter(
            QuizQuestion.lesson_id == lesson_id
        )
        .order_by(
            QuizQuestion.order.asc()
        )
        .all()
    )

    if len(savollar) != 10:
        raise HTTPException(
            status_code=400,
            detail=(
                "Bu lesson uchun 10 ta "
                "quiz savoli tayyor emas."
            ),
        )

    return {
        "status": "success",
        "total": len(savollar),
        "questions": [
            {
                "id": savol.id,
                "question": savol.question,
                "option_a": savol.option_a,
                "option_b": savol.option_b,
                "option_c": savol.option_c,
                "option_d": savol.option_d,
                "order": savol.order,
            }
            for savol in savollar
        ],
    }
# =========================================================
# SUBMIT QUIZ
# =========================================================

@app.post("/lessons/{lesson_id}/quiz")
def quizni_tekshirish(
    lesson_id: int,
    data: QuizSubmitRequest,
    current_user: User = Depends(
        get_current_user
    ),
    db=Depends(get_db),
):

    lesson = (
        db.query(Lesson)
        .filter(
            Lesson.id == lesson_id,
            Lesson.is_published == True,
        )
        .first()
    )

    if not lesson:

        raise HTTPException(
            status_code=404,
            detail="Lesson topilmadi",
        )

    savollar = (
        db.query(QuizQuestion)
        .filter(
            QuizQuestion.lesson_id
            == lesson_id
        )
        .order_by(
            QuizQuestion.order.asc()
        )
        .all()
    )

    if len(savollar) != 10:

        raise HTTPException(
            status_code=400,
            detail=(
                "Bu lesson uchun quiz hali "
                "tayyor emas. 10 ta savol "
                "bo'lishi kerak."
            ),
        )

    user_answers = {
        item.question_id:
        item.answer.strip().upper()

        for item in data.answers
    }

    togri_javoblar_soni = 0

    natijalar = []

    for savol in savollar:

        user_ans = user_answers.get(
            savol.id
        )

        is_correct = (
            user_ans is not None
            and
            user_ans
            == savol.correct_answer.strip().upper()
        )

        if is_correct:

            togri_javoblar_soni += 1

        natijalar.append(
            {
                "question_id": savol.id,
                "user_answer": user_ans,
                "correct_answer": (
                    savol.correct_answer
                ),
                "is_correct": is_correct,
                "explanation": (
                    savol.explanation
                ),
            }
        )

    foiz = (
        togri_javoblar_soni
        / len(savollar)
    ) * 100

    passed = foiz >= 70.0

    xp_gained = 0

    if passed:

        xp_gained = (
            togri_javoblar_soni * 5
        )

        xp_qoshish(
            current_user,
            xp_gained,
            db
        )

    return {
        "status": "success",
        "passed": passed,
        "score_percentage": foiz,
        "correct_answers": (
            togri_javoblar_soni
        ),
        "total_questions": len(savollar),
        "xp_gained": xp_gained,
        "results": natijalar,
    }


# =========================================================
# SUBSCRIPTIONS
# =========================================================
class AdminSubscriptionRequest(BaseModel):
    username: str
    plan: str


@app.post("/admin/subscriptions/grant")
def admin_obuna_berish(
    data: AdminSubscriptionRequest,
    current_user: User = Depends(get_current_admin),
    db=Depends(get_db),
):
    rejalar = {
        "1_month": {
            "days": 30,
            "price": 79000,
        },
        "3_month": {
            "days": 90,
            "price": 169000,
        },
        "1_year": {
            "days": 365,
            "price": 599000,
        },
    }

    username = data.username.strip()

    if not username:
        raise HTTPException(
            status_code=400,
            detail="Username kiritilishi kerak.",
        )

    if data.plan not in rejalar:
        raise HTTPException(
            status_code=400,
            detail="Noto'g'ri obuna rejasi.",
        )

    user = (
        db.query(User)
        .filter(User.username == username)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Foydalanuvchi topilmadi.",
        )

    # Eski faol obunani topamiz
    eski_obuna = (
        db.query(Subscription)
        .filter(
            Subscription.user_id == user.id,
            Subscription.status == "active",
        )
        .order_by(
            Subscription.expires_at.desc()
        )
        .first()
    )

    hozir = datetime.utcnow()

    # Agar eski PRO hali tugamagan bo'lsa,
    # yangi obuna eski obuna tugaganidan keyin boshlanadi.
    if (
        eski_obuna
        and eski_obuna.expires_at > hozir
    ):
        boshlanish = eski_obuna.expires_at
    else:
        boshlanish = hozir

    kunlar = rejalar[data.plan]["days"]

    tugash = (
        boshlanish
        + timedelta(days=kunlar)
    )

    # Eski active obunalarni expired qilamiz
    faol_obunalar = (
        db.query(Subscription)
        .filter(
            Subscription.user_id == user.id,
            Subscription.status == "active",
        )
        .all()
    )

    for obuna in faol_obunalar:
        obuna.status = "expired"

    # Yangi PRO obuna
    yangi_obuna = Subscription(
        user_id=user.id,
        plan=data.plan,
        status="active",
        started_at=boshlanish,
        expires_at=tugash,
        price=rejalar[data.plan]["price"],
    )

    db.add(yangi_obuna)
    db.commit()
    db.refresh(yangi_obuna)

    return {
        "status": "success",
        "message": "PRO obuna admin tomonidan ulandi.",
        "user": {
            "id": user.id,
            "username": user.username,
        },
        "subscription": {
            "id": yangi_obuna.id,
            "plan": yangi_obuna.plan,
            "status": yangi_obuna.status,
            "price": yangi_obuna.price,
            "started_at": yangi_obuna.started_at,
            "expires_at": yangi_obuna.expires_at,
        },
    }