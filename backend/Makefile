.PHONY: install dev test lint format clean reset-db help

# Default target
help:
	@echo "AI Tutor Backend - Development Commands"
	@echo ""
	@echo "Setup:"
	@echo "  make install     Install dependencies with uv"
	@echo "  make install-pip Install dependencies with pip (fallback)"
	@echo ""
	@echo "Development:"
	@echo "  make dev         Start development server with auto-reload"
	@echo "  make dev-gradio  Start Gradio interface"
	@echo ""
	@echo "Database:"
	@echo "  make reset-db    Reset and seed database"
	@echo "  make migrate     Run database migrations"
	@echo ""
	@echo "Quality:"
	@echo "  make lint        Run ruff linter"
	@echo "  make format      Format code with ruff"
	@echo "  make test        Run pytest"
	@echo "  make typecheck   Run mypy type checker"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean       Remove cache files"

# Installation
install:
	uv sync

install-pip:
	pip install -r requirements.txt

install-dev:
	uv sync --all-extras

# Development server
dev:
	uvicorn api:app --reload --host 127.0.0.1 --port 8000

dev-gradio:
	python -m src.tutor.interface

# Database operations
reset-db:
	python scripts/reset_seed_db.py

migrate:
	@echo "Running migrations..."
	python -c "from api import run_migrations; run_migrations()"

# Quality checks
lint:
	ruff check .

format:
	ruff format .
	ruff check --fix .

test:
	pytest -v

test-cov:
	pytest -v --cov=. --cov-report=html

typecheck:
	mypy . --ignore-missing-imports

# Cleanup
clean:
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	rm -rf .pytest_cache .ruff_cache .mypy_cache htmlcov .coverage 2>/dev/null || true

# Docker (if needed)
docker-build:
	docker build -t ai-tutor-backend .

docker-run:
	docker run -p 8000:8000 --env-file .env ai-tutor-backend
