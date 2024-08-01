FROM python:3.10.10

RUN pip install Flask flask_cors scipy gunicorn

COPY src/ app/
WORKDIR /app

RUN pip install -r requirements.txt

ENV PORT 8080

CMD exec gunicorn --bind :$PORT --workers 3 --threads 8 --timeout 3600 app:app