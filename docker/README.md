# Odoo Multi-Version Docker Environment

Середовище для розробки модулів Odoo на кількох версіях одночасно.

## Швидкий старт

```bash
# Перейти в папку docker
cd docker

# Запустити Odoo 15
./scripts/odoo.sh start 15

# Або напряму через docker compose
docker compose --profile odoo15 up -d
```

## URL-адреси

| Версія | Odoo Web | Порт БД |
|--------|----------|---------|
| Odoo 15 | http://localhost:8069 | 5433 |
| Odoo 16 | http://localhost:8070 | 5434 |

## Команди

### Використання скрипта (рекомендовано)

```bash
./scripts/odoo.sh start 15       # Запустити Odoo 15
./scripts/odoo.sh start 16       # Запустити Odoo 16
./scripts/odoo.sh start all      # Запустити всі версії
./scripts/odoo.sh stop           # Зупинити все
./scripts/odoo.sh restart 15     # Перезапустити Odoo 15
./scripts/odoo.sh logs 15        # Логи Odoo 15
./scripts/odoo.sh shell 15       # Shell в контейнері
./scripts/odoo.sh status         # Статус контейнерів
./scripts/odoo.sh update-module 15 my_library  # Оновити модуль
```

### Прямі команди docker compose

```bash
# Режим B: Одна версія за раз
docker compose --profile odoo15 up -d
docker compose --profile odoo16 up -d

# Режим A: Всі версії одночасно
docker compose --profile all up -d

# Зупинити
docker compose down

# Логи
docker compose logs -f odoo15
```

## Структура

```
docker/
├── docker-compose.yml    # Головний файл конфігурації
├── config/
│   ├── odoo15.conf       # Конфіг Odoo 15
│   └── odoo16.conf       # Конфіг Odoo 16
├── scripts/
│   └── odoo.sh           # Скрипт керування
└── data/                 # Дані (не комітяться)
    ├── odoo15/           # Filestore Odoo 15
    ├── odoo16/           # Filestore Odoo 16
    ├── postgres15/       # БД Odoo 15
    └── postgres16/       # БД Odoo 16
```

## Модулі

Всі модулі з кореневої папки проекту автоматично доступні в Odoo:
- Шлях в контейнері: `/mnt/extra-addons`
- Наприклад: `my_library`, `dynamic_odoo`

## Перше налаштування

1. Запустіть Odoo: `./scripts/odoo.sh start 15`
2. Відкрийте http://localhost:8069
3. Створіть базу даних:
   - Master Password: `admin`
   - Database Name: `odoo15_dev`
   - Email: ваш email
   - Password: ваш пароль
4. Активуйте режим розробника: Settings → Activate Developer Mode
5. Оновіть список модулів: Apps → Update Apps List
6. Знайдіть та встановіть `my_library`

## Оновлення модуля після змін

```bash
# Через скрипт
./scripts/odoo.sh update-module 15 my_library

# Або вручну
docker compose exec odoo15 odoo -c /etc/odoo/odoo.conf -u my_library --stop-after-init
docker compose restart odoo15
```

## Додавання нових версій (17, 18)

Додайте в `docker-compose.yml` аналогічні секції для db17/odoo17 та db18/odoo18.
