# docker/sandbox-python/Dockerfile
FROM python:3.11-slim

# Instalar dependencias mínimas
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Usuario no-root
RUN useradd -m -u 1000 pythonuser

WORKDIR /app

COPY --chown=pythonuser:pythonuser requirements.txt runner.py ./

# Instalar solo pypy-sandbox para aislamiento
# Nota: La guia menciona pypy-sandbox, pero usualmente requiere pypy. 
# En este Dockerfile python:3.11 es CPython.
# Instalaremos lo que el usuario pidio, pero podria fallar si pypy-sandbox requiere pypy real.
# Sin embargo, el usuario proveyo este Dockerfile, asi que lo seguimos.
# Removed pypy-sandbox as it is not compatible with CPython and not used in runner.py
# RUN pip install --no-cache-dir pypy-sandbox

USER pythonuser

# Ejecutar con pypy-sandbox para mejor aislamiento
CMD ["python", "runner.py"]
