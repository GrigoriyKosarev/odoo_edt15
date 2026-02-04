#!/bin/bash
#
# Скрипт для керування Odoo контейнерами
#
# Використання:
#   ./odoo.sh start 15       - Запустити Odoo 15
#   ./odoo.sh start 16       - Запустити Odoo 16
#   ./odoo.sh start all      - Запустити всі версії
#   ./odoo.sh stop           - Зупинити всі контейнери
#   ./odoo.sh restart 15     - Перезапустити Odoo 15
#   ./odoo.sh logs 15        - Логи Odoo 15
#   ./odoo.sh shell 15       - Shell в контейнері Odoo 15
#   ./odoo.sh status         - Статус контейнерів

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_DIR="$(dirname "$SCRIPT_DIR")"

cd "$DOCKER_DIR"

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

show_help() {
    echo ""
    echo "Odoo Docker Manager"
    echo "==================="
    echo ""
    echo "Використання: ./odoo.sh <команда> [версія]"
    echo ""
    echo "Команди:"
    echo "  start <15|16|all>    Запустити Odoo"
    echo "  stop                 Зупинити всі контейнери"
    echo "  restart <15|16>      Перезапустити версію"
    echo "  logs <15|16>         Показати логи"
    echo "  shell <15|16>        Відкрити shell в контейнері"
    echo "  status               Показати статус контейнерів"
    echo "  update-module <15|16> <module>  Оновити модуль"
    echo ""
    echo "Приклади:"
    echo "  ./odoo.sh start 15"
    echo "  ./odoo.sh logs 16"
    echo "  ./odoo.sh update-module 15 my_library"
    echo ""
    echo "URL-адреси:"
    echo "  Odoo 15: http://localhost:8069"
    echo "  Odoo 16: http://localhost:8070"
    echo ""
}

start_odoo() {
    local version=$1

    case $version in
        15)
            print_info "Запускаю Odoo 15..."
            docker compose --profile odoo15 up -d
            print_success "Odoo 15 доступний за адресою: http://localhost:8069"
            ;;
        16)
            print_info "Запускаю Odoo 16..."
            docker compose --profile odoo16 up -d
            print_success "Odoo 16 доступний за адресою: http://localhost:8070"
            ;;
        all)
            print_info "Запускаю всі версії Odoo..."
            docker compose --profile all up -d
            print_success "Odoo 15: http://localhost:8069"
            print_success "Odoo 16: http://localhost:8070"
            ;;
        *)
            print_error "Невідома версія: $version"
            echo "Доступні версії: 15, 16, all"
            exit 1
            ;;
    esac
}

stop_odoo() {
    print_info "Зупиняю всі контейнери..."
    docker compose --profile all down
    print_success "Всі контейнери зупинено"
}

restart_odoo() {
    local version=$1
    print_info "Перезапускаю Odoo $version..."
    docker compose restart "odoo$version"
    print_success "Odoo $version перезапущено"
}

show_logs() {
    local version=$1
    print_info "Логи Odoo $version (Ctrl+C для виходу):"
    docker compose logs -f "odoo$version"
}

open_shell() {
    local version=$1
    print_info "Відкриваю shell в Odoo $version..."
    docker compose exec "odoo$version" bash
}

show_status() {
    echo ""
    echo "Статус контейнерів:"
    echo "==================="
    docker compose ps -a
    echo ""
}

update_module() {
    local version=$1
    local module=$2

    if [ -z "$module" ]; then
        print_error "Вкажіть назву модуля"
        echo "Приклад: ./odoo.sh update-module 15 my_library"
        exit 1
    fi

    print_info "Оновлюю модуль '$module' в Odoo $version..."
    docker compose exec "odoo$version" odoo -c /etc/odoo/odoo.conf -u "$module" --stop-after-init
    print_success "Модуль '$module' оновлено"
    print_info "Перезапускаю Odoo $version..."
    docker compose restart "odoo$version"
}

# Головна логіка
case ${1:-help} in
    start)
        start_odoo "${2:-15}"
        ;;
    stop)
        stop_odoo
        ;;
    restart)
        restart_odoo "${2:-15}"
        ;;
    logs)
        show_logs "${2:-15}"
        ;;
    shell)
        open_shell "${2:-15}"
        ;;
    status)
        show_status
        ;;
    update-module)
        update_module "$2" "$3"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Невідома команда: $1"
        show_help
        exit 1
        ;;
esac
