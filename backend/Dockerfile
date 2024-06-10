FROM nvidia/cuda:12.4.1-devel-ubuntu22.04

# Установка переменных окружения
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1
ENV CMAKE_ARGS="-DLLAMA_CUBLAS=ON"
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONPATH="$PYTHONPATH:/code/api"

# Установка Python 3.11
RUN apt-get update && \
    apt-get install python3.11 python3.11-venv git --no-install-recommends -y

# Создание виртуального окружения для проекта
RUN python3.11 -m venv /opt/venv

WORKDIR /code

RUN python -m pip install -U pip && \
    python -m pip install -U setuptools && \
    python -m pip install -U wheel
# Установка LlamaCpp
RUN pip install llama-cpp-python
RUN pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
RUN pip install git+https://github.com/huggingface/diffusers.git
RUN pip install accelerate transformers peft pillow

# Перенос файла зависимостей
COPY requirements.txt requirements.txt
# Установка Python зависимостей
RUN python -m pip install -r requirements.txt && rm -f requirements.txt

# Перенос кода
COPY api/ api

# Открыть порт Flask приложения
EXPOSE 5000

# Страт Flask приложения
CMD ["python", "api/main.py"]
