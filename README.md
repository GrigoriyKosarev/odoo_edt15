# Odoo Development Environment

Середовище для розробки модулів Odoo з підтримкою версій 15 та 16.

## Структура проекту

```
odoo_edt/
├── odoo15/                    # Odoo 15
│   ├── Dockerfile             # Рецепт збірки образу
│   ├── docker-compose.yml     # Конфігурація Docker
│   ├── odoo.conf              # Налаштування Odoo
│   ├── addons/                # Кастомні модулі
│   │   ├── my_library/        # Навчальний модуль
│   │   └── dynamic_odoo/      # Odoo Studio модуль
│   └── data/                  # Дані (не в git)
│       ├── postgres/          # База даних
│       └── odoo/              # Filestore
│
├── odoo16/                    # Odoo 16 (аналогічна структура)
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── odoo.conf
│   ├── addons/
│   └── data/
│
├── .gitignore
└── README.md
```

## URL-адреси

| Версія | Web | Порт БД |
|--------|-----|---------|
| Odoo 15 | http://localhost:8069 | 5433 |
| Odoo 16 | http://localhost:8070 | 5434 |

## Швидкий старт

### 1. Встановити Docker

- **Linux:** https://docs.docker.com/engine/install/ubuntu/
- **Windows:** https://www.docker.com/products/docker-desktop/
- **macOS:** https://www.docker.com/products/docker-desktop/

### 2. Клонувати репозиторій

```bash
git clone https://github.com/GrigoriyKosarev/odoo_edt.git
cd odoo_edt
```

### 3. Запустити Odoo 15

```bash
cd odoo15
docker compose up -d
```

Перший запуск займе 5-15 хвилин (завантаження образів).

### 4. Відкрити браузер

http://localhost:8069

### 5. Створити базу даних

- **Master Password:** `admin`
- **Database Name:** `odoo15_dev`
- **Email:** ваш email
- **Password:** ваш пароль

## Команди Docker

```bash
# Перейти в папку версії
cd odoo15  # або cd odoo16

# Запустити
docker compose up -d

# Зупинити
docker compose down

# Логи
docker compose logs -f

# Статус
docker compose ps

# Перезапустити
docker compose restart odoo

# Зайти в контейнер
docker compose exec odoo bash

# Оновити модуль
docker compose exec odoo odoo -u my_library --stop-after-init
docker compose restart odoo
```

## Гілки

| Гілка | Призначення |
|-------|-------------|
| `main` | Основна гілка |
| `15.0` | Розробка для Odoo 15 |
| `16.0` | Розробка для Odoo 16 |

## Розробка

1. Редагуйте модулі в `odoo15/addons/` або `odoo16/addons/`
2. Оновіть модуль: `docker compose exec odoo odoo -u <module_name> --stop-after-init`
3. Перезапустіть: `docker compose restart odoo`

Зміни в XML/JS/CSS — оновіть сторінку (Ctrl+Shift+R).
