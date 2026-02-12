# ============================================
# Dockerfile для Odoo 15
# ============================================
# Збірка:  docker compose build
# Запуск:  docker compose up -d

FROM odoo:15

LABEL maintainer="GrigoriyKosarev"
LABEL version="15.0"
LABEL description="Odoo 15 development environment"

USER root

# Додаткові системні пакети
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    nano \
    && rm -rf /var/lib/apt/lists/*

# Додаткові Python пакети
RUN pip3 install --no-cache-dir \
    debugpy \
    ipython

# Копіюємо конфігурацію
COPY ./odoo.conf /etc/odoo/odoo.conf

USER odoo

EXPOSE 8069 8072

CMD ["odoo", "-c", "/etc/odoo/odoo.conf"]
