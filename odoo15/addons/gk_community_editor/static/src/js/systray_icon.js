/** @odoo-module **/
// =============================================================================
// systray_icon.js — Кнопка GK Editor в systray
// =============================================================================
//
// ЩО ЦЕ:
//   JavaScript віджет який додає іконку в systray (верхній правий кут).
//   При натисканні показує/приховує панель Editor.
//
// КЛЮЧОВІ КОНЦЕПЦІЇ ODOO JS:
//
//   1. odoo.define() / require()  — система модулів Odoo 15
//      Кожен JS файл оголошує модуль через odoo.define('ім'я', function(require){})
//      Інші файли можуть імпортувати: const mod = require('ім'я');
//
//   2. Widget — базовий клас для UI компонентів (Odoo Legacy)
//      Widget має lifecycle: init → willStart → start → destroy
//      $el — jQuery елемент віджета
//
//   3. SystrayMenu — системний масив іконок в navbar
//      SystrayMenu.Items.push(MyWidget) — додає іконку
//
//   4. session — дані сесії з сервера (те що повертає session_info())
//      session['showCommunityEditor'] — наш прапорець з ir_http.py
//
// ПОРІВНЯЙ З dynamic_odoo:
//   dynamic_odoo/static/src/js/studio/menus/systray_menu_studio.js:
//   - Використовує base.WidgetBase.extend (свій базовий клас)
//   - При кліку монтує OWL компонент (mount(start, ...))
//   Ми поки простіше — показуємо інфо-панель
//

var Widget = require('web.Widget');
var SystrayMenu = require('web.SystrayMenu');
var session = require('web.session');
var core = require('web.core');
var QWeb = core.qweb;
var rpc = require('web.rpc');

var GkEditorSystray = Widget.extend({
    // QWeb шаблон для рендерингу (з systray_icon.xml)
    template: 'GkEditor.SystrayIcon',

    // -------------------------------------------------------------------------
    // events — декларативний маппінг подій
    // -------------------------------------------------------------------------
    // 'click .selector': 'methodName' — при кліку на елемент виклич метод
    // Odoo автоматично прив'язує events після рендерингу
    //
    events: {
        'click .gk-editor-systray': '_onClickEditor',
    },

    // -------------------------------------------------------------------------
    // init — конструктор віджета
    // -------------------------------------------------------------------------
    // Викликається першим. НЕ чіпати DOM тут!
    // parent — батьківський віджет (SystrayMenu)
    //
    init: function (parent) {
        this._super.apply(this, arguments);
        this._isEditorOpen = false;
        this._panel = null;
    },

    // -------------------------------------------------------------------------
    // _onClickEditor — обробник кліку на іконку
    // -------------------------------------------------------------------------
    // Показує/приховує панель Editor.
    // Використовує RPC для отримання інформації про поточну модель.
    //
    _onClickEditor: function (ev) {
        ev.preventDefault();
        ev.stopPropagation();

        if (this._isEditorOpen) {
            this._closePanel();
        } else {
            this._openPanel();
        }
    },

    // -------------------------------------------------------------------------
    // _openPanel — відкрити панель Editor
    // -------------------------------------------------------------------------
    _openPanel: function () {
        var self = this;

        // Отримуємо поточний action (яка модель відкрита)
        var actionManager = this.getParent();
        var currentAction = null;
        var modelName = '—';

        // Шукаємо action_manager в батьківських віджетах
        var parent = this.getParent();
        while (parent) {
            if (parent.getCurrentAction) {
                currentAction = parent.getCurrentAction();
                break;
            }
            parent = parent.getParent ? parent.getParent() : null;
        }

        if (currentAction && currentAction.res_model) {
            modelName = currentAction.res_model;
        }

        // Рендеримо панель з QWeb шаблону
        var $panel = $(QWeb.render('GkEditor.Panel'));
        $panel.find('.gk-editor-model-name').text(modelName);
        $panel.find('.gk-editor-close').on('click', function () {
            self._closePanel();
        });

        // Якщо є модель — завантажуємо інформацію про поля
        if (modelName !== '—') {
            this._loadModelInfo(modelName, $panel);
        }

        // Додаємо панель до сторінки
        $('body').append($panel);
        this._panel = $panel;
        this._isEditorOpen = true;
        this.$el.find('.fa').addClass('text-primary');
    },

    // -------------------------------------------------------------------------
    // _loadModelInfo — RPC запит для отримання полів моделі
    // -------------------------------------------------------------------------
    // rpc.query() — спосіб викликати Python методи з JavaScript
    // model: 'ir.model' — викликаємо метод моделі ir.model
    // method: 'search_read' — стандартний ORM метод
    //
    _loadModelInfo: function (modelName, $panel) {
        rpc.query({
            model: 'ir.model.fields',
            method: 'search_read',
            args: [[['model', '=', modelName]]],
            kwargs: {
                fields: ['name', 'field_description', 'ttype'],
                limit: 20,
            },
        }).then(function (fields) {
            var $info = $panel.find('.gk-editor-info');
            $info.empty();

            if (fields.length) {
                var $table = $('<table class="table table-sm table-striped">' +
                    '<thead><tr>' +
                    '<th>Field</th><th>Label</th><th>Type</th>' +
                    '</tr></thead><tbody></tbody></table>');

                fields.forEach(function (field) {
                    $table.find('tbody').append(
                        '<tr>' +
                        '<td><code>' + _.escape(field.name) + '</code></td>' +
                        '<td>' + _.escape(field.field_description) + '</td>' +
                        '<td><span class="badge bg-info">' + _.escape(field.ttype) + '</span></td>' +
                        '</tr>'
                    );
                });
                $info.append($table);
            }
        });
    },

    // -------------------------------------------------------------------------
    // _closePanel — закрити панель Editor
    // -------------------------------------------------------------------------
    _closePanel: function () {
        if (this._panel) {
            this._panel.remove();
            this._panel = null;
        }
        this._isEditorOpen = false;
        this.$el.find('.fa').removeClass('text-primary');
    },
});

// =============================================================================
// Реєстрація в SystrayMenu
// =============================================================================
// Перевіряємо session['showCommunityEditor'] — чи є доступ у користувача
// sequence — визначає порядок іконки (менше = лівіше)
//
// ПОРІВНЯЙ З dynamic_odoo:
//   if (session['showStudio']) {
//       StudioMode.prototype.sequence = 1;
//       SystrayMenu.Items.push(StudioMode);
//   }
//
if (session['showCommunityEditor']) {
    GkEditorSystray.prototype.sequence = 1;
    SystrayMenu.Items.push(GkEditorSystray);
}
