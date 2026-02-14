# -*- coding: utf-8 -*-
# =============================================================================
# __manifest__.py — Головний файл модуля Odoo
# =============================================================================
#
# Це "паспорт" модуля. Odoo читає цей файл щоб зрозуміти:
# - Що це за модуль (name, summary, description)
# - Від яких модулів залежить (depends)
# - Які файли завантажувати (data, assets)
# - Чи можна встановити (installable)
#
# Порівняй з dynamic_odoo:
#   dynamic_odoo залежить від 'base_automation' (для серверних дій)
#   Ми поки залежимо тільки від 'base' — мінімум для старту
#
{
    'name': 'Community Editor for Odoo',
    'summary': 'Visual editor for Odoo views and models (Community Edition)',
    'version': '15.0.1.0.0',
    'category': 'Tools',
    'description': """
        Community Editor for Odoo — візуальний редактор views та моделей.
        Натхненний Odoo Studio / dynamic_odoo.
    """,
    'author': 'Grigoriy Kosarev',
    'license': 'LGPL-3',

    # -------------------------------------------------------------------------
    # depends — від яких модулів залежить наш модуль
    # -------------------------------------------------------------------------
    # 'base' — ядро Odoo (ir.model, ir.ui.view, res.groups і т.д.)
    # Odoo автоматично встановить залежності перед нашим модулем
    #
    'depends': ['base'],

    # -------------------------------------------------------------------------
    # data — файли які Odoo завантажить при встановленні модуля
    # -------------------------------------------------------------------------
    # Порядок ВАЖЛИВИЙ! Наприклад:
    #   security XML (groups) повинен бути ДО ir.model.access.csv
    #   бо CSV посилається на групу яка повинна вже існувати
    #
    'data': [
        'security/security.xml',
        'security/ir.model.access.csv',
    ],

    # -------------------------------------------------------------------------
    # assets — JavaScript, CSS, XML шаблони для фронтенду
    # -------------------------------------------------------------------------
    # В Odoo 15 використовується нова система assets (замість старого xml include)
    #
    # 'web.assets_backend' — ресурси для бекенду (адмін-панель)
    # 'web.assets_qweb'    — QWeb шаблони для JavaScript віджетів
    #
    'assets': {
        'web.assets_backend': [
            'gk_community_editor/static/src/scss/editor.scss',
            'gk_community_editor/static/src/js/systray_icon.js',
        ],
        'web.assets_qweb': [
            'gk_community_editor/static/src/xml/systray_icon.xml',
        ],
    },

    'installable': True,
    'auto_install': False,
    'application': False,
}
