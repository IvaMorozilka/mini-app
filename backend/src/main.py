from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise

# Создаем экземпляр FastAPI
app = FastAPI(title="Mini App Backend")

# URL для подключения к SQLite.
# "db.sqlite3" - это имя файла, который будет создан в той же папке,
# где вы запускаете приложение (в корне папки backend).
DB_URL = "sqlite://db.sqlite3"

@app.get("/api/hello")
async def hello_world():
    return {"message": "Hello from FastAPI backend!"}


# Инициализация Tortoise ORM
register_tortoise(
    app,
    db_url=DB_URL,
    # Список модулей, где находятся ваши модели Tortoise ORM.
    # Предполагается, что вы создадите файл models.py
    modules={"models": ["models"]},
    # Автоматически создавать таблицы при старте (хорошо для разработки).
    # В продакшене лучше управлять схемой через миграции (Aerich).
    generate_schemas=True,
    add_exception_handlers=True,
)