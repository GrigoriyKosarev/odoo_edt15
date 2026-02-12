# -*- coding: utf-8 -*-
from odoo import fields, models, api


class Book(models.Model):
    """
    Модель книги в бібліотеці.

    Це найпростіша модель Odoo з базовими типами полів.
    """
    _name = 'library.book'
    _description = 'Library Book'

    # ===== БАЗОВІ ПОЛЯ =====
    # Char - текстове поле
    name = fields.Char(
        string='Назва',
        required=True,
        help='Назва книги'
    )

    # Text - багаторядковий текст
    description = fields.Text(string='Опис')

    # Integer - ціле число
    pages = fields.Integer(string='Кількість сторінок')

    # Float - дробове число
    price = fields.Float(string='Ціна', digits=(10, 2))

    # Boolean - так/ні
    available = fields.Boolean(string='Доступна', default=True)

    # Date - дата
    publish_date = fields.Date(string='Дата публікації')

    # Selection - вибір із списку
    state = fields.Selection([
        ('draft', 'Чернетка'),
        ('available', 'Доступна'),
        ('borrowed', 'Видана'),
    ], string='Статус', default='draft')

    # ===== ОБЧИСЛЮВАНІ ПОЛЯ =====
    # Поле яке автоматично розраховується
    is_old = fields.Boolean(
        string='Стара книга',
        compute='_compute_is_old',
        store=True,  # зберігати в БД
    )

    @api.depends('publish_date')
    def _compute_is_old(self):
        """Книга вважається старою якщо видана більше 10 років тому"""
        for record in self:
            if record.publish_date:
                from datetime import date
                years = (date.today() - record.publish_date).days // 365
                record.is_old = years > 10
            else:
                record.is_old = False

    # ===== МЕТОДИ =====
    def action_borrow(self):
        """Видати книгу"""
        for record in self:
            record.state = 'borrowed'
            record.available = False

    def action_return(self):
        """Повернути книгу"""
        for record in self:
            record.state = 'available'
            record.available = True
