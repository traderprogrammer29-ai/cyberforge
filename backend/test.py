from sqlalchemy import text

from database import engine


try:
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    print("DATABASE ULANDI")
except Exception as xato:
    print("DATABASE XATOSI:")
    print(xato)