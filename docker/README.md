# Odoo Multi-Version Docker Environment

Середовище для розробки модулів Odoo на версіях 15 та 16.

## Структура

```
docker/
├── odoo15/                    # Odoo 15
│   ├── Dockerfile             # Рецепт збірки образу
│   ├── docker-compose.yml     # Конфігурація сервісів
│   ├── odoo.conf              # Налаштування Odoo
│   └── data/                  # Дані (автостворюється)
│       ├── postgres/          # База даних
│       └── odoo/              # Filestore
│
├── odoo16/                    # Odoo 16 (аналогічно)
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── odoo.conf
│   └── data/
│
└── README.md
```

## URL-адреси

| Версія | Web | Порт БД |
|--------|-----|---------|
| Odoo 15 | http://localhost:8069 | 5433 |
| Odoo 16 | http://localhost:8070 | 5434 |

---

## Швидкий старт

### Запуск Odoo 15

```bash
# 1. Перейти в папку odoo15
cd docker/odoo15

# 2. Зібрати образ та запустити
docker compose up -d

# 3. Відкрити браузер
# http://localhost:8069
```

### Запуск Odoo 16

```bash
# 1. Перейти в папку odoo16
cd docker/odoo16

# 2. Зібрати образ та запустити
docker compose up -d

# 3. Відкрити браузер
# http://localhost:8070
```

---

## Команди Docker Compose (детально)

### Запуск

```bash
# Запустити у фоновому режимі (-d = detached)
docker compose up -d

# Запустити та показувати логи (без -d)
docker compose up

# Перезібрати образ якщо змінився Dockerfile
docker compose up -d --build
```

### Зупинка

```bash
# Зупинити контейнери (дані зберігаються)
docker compose stop

# Зупинити та видалити контейнери
docker compose down

# Видалити контейнери + volumes (ВИДАЛИТЬ ДАНІ!)
docker compose down -v
```

### Моніторинг

```bash
# Статус контейнерів
docker compose ps

# Логи всіх сервісів
docker compose logs

# Логи конкретного сервісу
docker compose logs odoo15
docker compose logs db15

# Логи в реальному часі (-f = follow)
docker compose logs -f odoo15

# Останні 100 рядків логів
docker compose logs --tail 100 odoo15
```

### Робота з контейнерами

```bash
# Зайти в контейнер Odoo
docker compose exec odoo15 bash

# Зайти в контейнер PostgreSQL
docker compose exec db15 bash

# Виконати команду в контейнері
docker compose exec odoo15 odoo --version

# Перезапустити сервіс
docker compose restart odoo15
```

---

## Оновлення модуля

Після зміни коду Python потрібно оновити модуль:

```bash
# Спосіб 1: Через odoo команду
docker compose exec odoo15 odoo -c /etc/odoo/odoo.conf -u my_library --stop-after-init
docker compose restart odoo15

# Спосіб 2: Через інтерфейс
# Apps → my_library → Upgrade
```

Зміни в XML/JS/CSS застосовуються після оновлення сторінки (Ctrl+Shift+R).

---

## Перше налаштування Odoo

1. Відкрийте http://localhost:8069
2. Створіть базу даних:
   - **Master Password:** `admin`
   - **Database Name:** `odoo15_dev`
   - **Email:** `admin@example.com`
   - **Password:** ваш пароль
3. Активуйте режим розробника:
   - URL: `http://localhost:8069/web?debug=1`
   - Або: Settings → Activate Developer Mode
4. Оновіть список модулів:
   - Apps → меню ☰ → Update Apps List
5. Встановіть модуль:
   - Видаліть фільтр "Apps"
   - Знайдіть `my_library`
   - Натисніть Install

---

## Робота з образами

```bash
# Подивитися локальні образи
docker images

# Завантажити образ з Docker Hub (без запуску)
docker pull odoo:15
docker pull postgres:14

# Видалити образ
docker rmi my-odoo:15

# Перезібрати образ
docker compose build

# Перезібрати без кешу (якщо щось зламалось)
docker compose build --no-cache
```

---

## Підключення до БД

```bash
# Через psql в контейнері
docker compose exec db15 psql -U odoo -d odoo15_dev

# Через зовнішній клієнт (DBeaver, pgAdmin)
# Host: localhost
# Port: 5433 (для Odoo 15) або 5434 (для Odoo 16)
# User: odoo
# Password: odoo
```

---

## Можливі проблеми

### Порт зайнятий

```
Error: Bind for 0.0.0.0:8069 failed: port is already allocated
```

Рішення: Змініть порт в docker-compose.yml або зупиніть інший сервіс.

### Не вистачає місця

```bash
# Очистити невикористані дані Docker
docker system prune -a
```

### Модуль не видно

1. Перевірте що Developer Mode активний
2. Apps → Update Apps List
3. Видаліть фільтр "Apps" в пошуку

### Зміни не застосовуються

```bash
# Перезібрати образ
docker compose up -d --build

# Або повністю перестворити
docker compose down
docker compose up -d --build
```
