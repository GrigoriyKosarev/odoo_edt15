# ============================================
# Dockerfile для Odoo 16
# ============================================

FROM odoo:16

LABEL maintainer="GrigoriyKosarev"
LABEL version="16.0"
LABEL description="Odoo 16 development environment"

USER root

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    nano \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --no-cache-dir \
    debugpy \
    ipython

COPY ./odoo.conf /etc/odoo/odoo.conf

USER odoo

EXPOSE 8069 8072

CMD ["odoo", "-c", "/etc/odoo/odoo.conf"]
