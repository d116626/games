from pathlib import Path

from utils.common.paths import process_dir, public_dir
from utils.common.schemas import CamelModel

# Sites estáticos no GitHub Pages: manter JSONs finais pequenos.
MAX_PUBLIC_JSON_BYTES = 1_000_000


def export_dataset(game: str, name: str, dataset: CamelModel) -> Path:
    """Valida (via pydantic) e grava `name` em data/process/<jogo> e frontend/public/data/<jogo>."""
    payload = dataset.model_dump_json(by_alias=True, indent=2)
    for directory in (process_dir(game), public_dir(game)):
        directory.mkdir(parents=True, exist_ok=True)
    (process_dir(game) / name).write_text(payload, encoding="utf-8")
    out = public_dir(game) / name
    out.write_text(payload, encoding="utf-8")
    if out.stat().st_size > MAX_PUBLIC_JSON_BYTES:
        raise ValueError(f"{out} excede {MAX_PUBLIC_JSON_BYTES} bytes")
    return out
