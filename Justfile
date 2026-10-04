# Games Guide command runner

default:
    @just --list

# Cria a estrutura de um jogo novo (pastas, rota, pacote Python, doc); ex.: `just new-game hollow-knight "Hollow Knight"`
new-game id nome:
    python3 -m utils.new_game {{id}} "{{nome}}"

# Executa o servidor local de desenvolvimento do Next.js
run-frontend:
    cd frontend && npm run dev

# Executa o servidor local de desenvolvimento do Next.js
install:
    cd frontend && npm install

# Executa o pipeline de dados Python. Sem argumento roda todos os jogos; ex.: `just pipeline hollow-knight`
pipeline *alvos:
    uv run python -m utils.pipeline {{alvos}}

# Sincroniza dependências do Python via uv
py-sync:
    uv sync

# Verifica tipos TypeScript no frontend
typecheck:
    cd frontend && npm run typecheck

# Executa linter no frontend
lint:
    cd frontend && npm run lint
