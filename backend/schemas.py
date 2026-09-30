from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, field_validator


class RegisterRequest(BaseModel):
    username: str = Field(
        min_length=3,
        max_length=50
    )

    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128
    )


class LoginRequest(BaseModel):
    username: str
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(
        min_length=20,
        max_length=255
    )

    new_password: str = Field(
        min_length=8,
        max_length=128
    )


class CourseCreateRequest(BaseModel):
    title: str = Field(
        min_length=3,
        max_length=200
    )

    slug: str = Field(
        min_length=3,
        max_length=200
    )

    description: str | None = Field(
        default=None,
        max_length=1000
    )

    level: str = Field(
        default="beginner",
        max_length=30
    )

    is_published: bool = False
    is_pro: bool = False


class LessonBase(BaseModel):
    course_id: int
    title: str
    slug: str
    content: str | None = None
    order: int = 1
    is_published: bool = False


class LessonCreate(LessonBase):
    pass


class LessonUpdate(BaseModel):
    course_id: int | None = None
    title: str | None = None
    slug: str | None = None
    content: str | None = None
    order: int | None = None
    is_published: bool | None = None


class LessonResponse(LessonBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class QuizQuestionCreateRequest(BaseModel):
    lesson_id: int = Field(
        gt=0
    )

    question: str = Field(
        min_length=3,
        max_length=1000
    )

    option_a: str = Field(
        min_length=1,
        max_length=500
    )

    option_b: str = Field(
        min_length=1,
        max_length=500
    )

    option_c: str = Field(
        min_length=1,
        max_length=500
    )

    option_d: str = Field(
        min_length=1,
        max_length=500
    )

    correct_answer: str = Field(
        min_length=1,
        max_length=1
    )

    explanation: str = Field(
        min_length=3,
        max_length=2000
    )

    order: int = Field(
        default=1,
        gt=0
    )

    @field_validator("correct_answer")
    @classmethod
    def togri_javob_tekshirish(cls, value: str):
        value = value.upper()

        if value not in ["A", "B", "C", "D"]:
            raise ValueError(
                "correct_answer faqat A, B, C yoki D bo‘lishi mumkin"
            )

        return value
class QuizAnswerItem(BaseModel):
    question_id: int = Field(
        gt=0
    )

    answer: str = Field(
        min_length=1,
        max_length=1
    )

    @field_validator("answer")
    @classmethod
    def javobni_tekshirish(cls, value: str):
        value = value.upper()

        if value not in ["A", "B", "C", "D"]:
            raise ValueError(
                "Javob A, B, C yoki D bo‘lishi kerak"
            )

        return value


class QuizSubmitRequest(BaseModel):
    answers: list[QuizAnswerItem] = Field(
        min_length=10,
        max_length=10
    )
class QuizQuestionsBulkCreateRequest(BaseModel):
    questions: list[QuizQuestionCreateRequest] = Field(
        min_length=1,
        max_length=50
    )