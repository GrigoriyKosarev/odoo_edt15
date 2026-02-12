# ============================================
# Dockerfile для Odoo 16
# ============================================
#
# Відмінності від Odoo 15:
# ------------------------
# - Базовий образ odoo:16 замість odoo:15
# - Python 3.10 замість Python 3.8/3.9
# - OWL 2.0 (покращений фреймворк для JS)
# - Нова система assets
#

FROM odoo:16

LABEL maintainer="your-email@example.com"
LABEL version="1.0"
LABEL description="Odoo 16 for development"

USER root

# Ті ж самі пакети що й для Odoo 15
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    nano \
    iputils-ping \
    && rm -rf /var/lib/apt/lists/*

# Python пакети
# Примітка: в Odoo 16 деякі пакети вже включені
RUN pip3 install --no-cache-dir \
    debugpy \
    ipython \
    xlrd \
    xlwt \
    openpyxl

# Копіюємо конфігурацію
COPY ./odoo.conf /etc/odoo/odoo.conf

USER odoo

EXPOSE 8069
EXPOSE 8072

CMD ["odoo", "-c", "/etc/odoo/odoo.conf"]
