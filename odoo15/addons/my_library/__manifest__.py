# -*- coding: utf-8 -*-
{
    'name': 'My Library',
    'version': '15.0.1.0.0',
    'category': 'Tutorials',
    'summary': 'Навчальний модуль для вивчення Odoo',
    'author': 'Your Name',
    'license': 'LGPL-3',

    # Залежності - base є в кожному Odoo
    'depends': ['base'],

    # Файли даних (views, security, etc.)
    'data': [
        'security/ir.model.access.csv',
        'views/book_views.xml',
    ],

    'installable': True,
    'application': True,
}
