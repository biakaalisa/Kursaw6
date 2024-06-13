# базовый образ питона
FROM python:3.11-alpine3.19 

# создание папки код
WORKDIR /code

# копируем туда (в код) файл с зависимостями
COPY ./requirements.txt /code/requirements.txt

# 
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# копируем весь код приложения
COPY . /code 

# запуск сервака (инструкция по запуску)
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]