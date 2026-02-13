# -*- coding: utf-8 -*-
# =============================================================================
# ir_http.py — Додавання інформації до сесії користувача
# =============================================================================
#
# ЩО ЦЕ:
#   ir.http — системна модель Odoo яка обробляє HTTP запити.
#   Метод session_info() повертає дані при кожному завантаженні сторінки.
#   Ці дані доступні в JavaScript через: const session = require('web.session');
#
# ЩО МИ РОБИМО:
#   Додаємо 'showGkEditor': True до session_info якщо користувач
#   належить до групи 'gk_odoo_editor.group_gk_editor'.
#   В JavaScript перевіряємо session['showGkEditor'] щоб показати кнопку.
#
# ЯК ЦЕ ПРАЦЮЄ В dynamic_odoo:
#   dynamic_odoo/models/ir_http.py робить те саме:
#   result['showStudio'] = True  — якщо є група 'dynamic_odoo.group_dynamic'
#
# КЛЮЧОВЕ ПОНЯТТЯ — _inherit:
#   _inherit = 'ir.http' означає що ми РОЗШИРЮЄМО існуючу модель,
#   а не створюємо нову. super() викликає оригінальний метод.
#

from odoo import models


class Http(models.AbstractModel):
    _inherit = 'ir.http'

    def session_info(self):
        """Додаємо showGkEditor до даних сесії."""
        result = super().session_info()
        # Перевіряємо чи користувач має право на GK Editor
        if self.env.user.has_group('gk_odoo_editor.group_gk_editor'):
            result['showGkEditor'] = True
        return result
