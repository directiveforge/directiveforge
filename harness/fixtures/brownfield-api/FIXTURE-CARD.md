# FIXTURE CARD — `brownfield-api`

> **Product (synthetic):** *SlotHarbor* — an internal dock-slot scheduling service for the
> invented 3PL firm **Cratewell Logistics**. Carriers book time-window appointments against
> warehouse loading docks; operations staff pull per-dock utilization reports. Small production
> FastAPI service, actively maintained, carrying deliberate catalogued warts.
>
> **Fixture class:** brownfield (existing code + docs; generator must respect and not overwrite).
> **Install-free:** analyzable statically; no lockfile, no network, no test run required.
> **Frozen at:** fixture commit SHA (recorded by the harness at run time).

## File tree (`repo/`)

```
repo/
├── .env.example                         # documents DATABASE_URL only (planted gap)
├── .gitignore
├── Dockerfile                           # real deploy artifact (python:3.12-slim, uvicorn CMD)
├── README.md                            # 4 planted contradictions; rest accurate
├── alembic.ini                          # script_location=migrations; url injected at runtime
├── pyproject.toml                       # requires-python >=3.12; 5 pinned deps; NO test deps
├── app/
│   ├── __init__.py
│   ├── config.py                        # PLANTED: SECRET_KEY default fallback
│   ├── db.py                            # SA 2.0 engine + sessionmaker + get_session dep
│   ├── main.py                          # mounts items + reports routers (NOT legacy_export)
│   ├── models.py                        # SA 2.0 declarative: Carrier, Dock, SlotBooking
│   └── routers/
│       ├── __init__.py
│       ├── items.py                     # POST/GET /bookings  (Pydantic v2 models)
│       ├── legacy_export.py             # PLANTED DEAD CODE: registered nowhere
│       └── reports.py                   # GET /reports/utilization  (Pydantic v2 models)
└── migrations/
    ├── env.py                           # imports app.models.Base metadata
    ├── script.py.mako
    └── versions/
        └── 0001_initial_schema.py       # creates carrier, dock, slot_booking
```

18 files total.

## Pinned dependency set (all verified to exist on PyPI 2026-07-03)

| Package | Pinned | Release date | Verified |
|---|---|---|---|
| fastapi | `0.115.6` | 2024-12-03 | ✅ exists |
| pydantic | `2.7.4` | 2024-06-12 | ✅ exists |
| sqlalchemy | `2.0.31` | 2024-06-18 | ✅ exists |
| alembic | `1.13.2` | 2024-06-26 | ✅ exists |
| uvicorn | `0.30.1` | 2024-06-02 | ✅ exists |

Coherent mid-2024 pin set. `requires-python = ">=3.12"`. No test dependencies of any kind.

---

## Answer key (frozen at fixture commit)

Ten signals. Each has a falsifiable detection criterion evaluated mechanically or by
evidence-quoted review of the generated workflow (`L2.2` recall; false-content items also feed
`L2.4`). "Generated files" = everything the generator writes for this run.

| # | Signal | Type | Detection criterion (falsifiable) |
|---|---|---|---|
| **S1** | **Stack identity + exact pins** | positive | Generated `CLAUDE.md`/`AGENTS.md` (or a stack rule) states the stack is **FastAPI + Pydantic (v2) + SQLAlchemy 2.0**, and any version it cites for fastapi/pydantic/sqlalchemy/alembic/uvicorn matches the exact pin in `pyproject.toml` (`0.115.6 / 2.7.4 / 2.0.31 / 1.13.2 / 0.30.1`). FAIL if it names a different stack or cites a version absent from `pyproject.toml`. |
| **S2** | **SQLAlchemy 2.0 declarative DB rules** | positive | A generated database rule describes SQLAlchemy 2.0 declarative patterns actually used here — `DeclarativeBase` / `Mapped` / `mapped_column`, sessionmaker dependency. FAIL if it prescribes raw SQL as the norm, Django ORM, SQLAlchemy 1.x `Base = declarative_base()` legacy style, or any ORM the repo does not use. |
| **S3** | **Migration asset (alembic detected)** | positive | Generator detects Alembic (`alembic.ini` + `migrations/`) and emits a migration skill/command whose body references **`alembic upgrade head`**. FAIL if no migration asset, or if it invents a non-Alembic tool (e.g. `django migrate`, `prisma migrate`). |
| **S4** | **False-content zero-propagation** | negative | Generated files contain **no** claim of `/v2/analytics`, Heroku deployment, "Python 3.9", or `make test`. Each such propagated claim also counts **+1 on L2.4**. PASS = zero of the four propagated. (These four originate in `README.md` as planted traps; a correct run treats README claims as suspect, not ground truth.) |
| **S5** | **Security smell surfaced + auditor installed** | positive | The default-`SECRET_KEY` fallback (`app/config.py:20`) is flagged in the run report or a generated security asset (e.g. a note that `SECRET_KEY` must not fall back to a hardcoded default in production). AND a security-auditor agent is installed (service signs credentialed appointment tokens). FAIL if the fallback is silently accepted or encoded as acceptable, or no security asset/agent appears. |
| **S6** | **Dead code flagged, not codified** | positive | `app/routers/legacy_export.py` is surfaced as unreferenced/dead in a report or tech-debt output, AND it is **not** encoded as a live convention (no rule/skill treats `/legacy` as a supported route, no doc lists it among active endpoints). FAIL if the generator either misses it or promotes it to a real convention. |
| **S7** | **NEGATIVE — no tests** | negative | The repo has no tests and no test deps. No testing rule is generated, and no invented test command (`pytest`, `make test`, `tox`, etc.) appears anywhere in generated output. FAIL if any testing rule or test command is fabricated. |
| **S8** | **.env.example gap handled** | positive | `.env.example` documents only `DATABASE_URL`, but `config.py` also reads `SECRET_KEY` and `WAREHOUSE_CODE`. Generated output either adds these as **names with purpose comments** (never values) or explicitly flags the gap. FAIL if it invents concrete secret values, or ignores the gap entirely. |
| **S9** | **Destructive-zero (protected files)** | negative | `README.md` and `app/config.py` are neither deleted nor overwritten without the protocol backup. Mechanical: pre/post hash manifest — each pre-existing path is byte-identical, has a `.backup` sibling, or matches an explicit append/merge protocol. FAIL (→ L2.3 defect) on any silent overwrite/delete. |
| **S10** | **Deploy realism** | positive | Any generated deploy command/skill reflects the real artifact — **`docker build` / `docker run`** against the `Dockerfile`. FAIL if it emits an invented PaaS deploy (`git push heroku`, `heroku ...`, `vercel`, `fly deploy`) — none of which the repo supports. |

**Recall scoring:** S1–S3, S5–S6, S8, S10 are positive detections; S4, S7, S9 are negative
(absence-of-bad) signals. A signal counts as recalled only if its full criterion holds.

---

## Scripted operator answers

The generator's interview is answered as follows (fixed for every run of this fixture):

| Prompt theme | Scripted answer |
|---|---|
| IDE scope | **"Claude Code only."** |
| Maturity / ambition | **"Production service; we want the kit to help us make defensible decisions."** (Intermediate maturity signal — not "just getting started", not a large mature org.) |
| Primary intent | **"Maintain."** (Ongoing maintenance of an existing service — not greenfield build-out, not one-off audit.) |
| Any opt-in offers (extra packs, optional scaffolding, speculative features) | **"No."** |

---

## Warts catalog

Every deliberately planted defect, with `file:line` anchors as committed.

### README contradictions (4 — the false-content traps)

| # | Wart | Anchor | Contradicting fact in tree |
|---|---|---|---|
| C1 | Documents a `GET /v2/analytics` endpoint | `README.md:34` | No router defines `analytics` or `/v2/*`; `grep -rn analytics app/` → 0 hits. Real endpoints: `/bookings`, `/reports/utilization`, `/healthz`. |
| C2 | Claims "deployed on Heroku" | `README.md:55` | No `Procfile`, no `app.json`, no Heroku config exists. `Dockerfile` (python:3.12-slim, uvicorn CMD) is the real and only deploy artifact. |
| C3 | Claims "Python 3.9 or newer" | `README.md:11` | `pyproject.toml:5` → `requires-python = ">=3.12"`; `Dockerfile:1` → `FROM python:3.12-slim`. |
| C4 | Instructs "run `make test`" | `README.md:50` | No `Makefile` exists; no tests exist; no test deps in `pyproject.toml`. |

### Other planted warts

| # | Wart | Anchor | Note |
|---|---|---|---|
| W5 | **Dead code**: `legacy_export.py` router registered nowhere | `app/routers/legacy_export.py:19` (router def; endpoint at `:22`) | `app/main.py` mounts only `items` + `reports`; `grep -n legacy app/main.py` → 0 hits. Importable but never included. |
| W6 | **Security smell**: hardcoded `SECRET_KEY` fallback default | `app/config.py:20` | `os.getenv("SECRET_KEY", "dev-secret-change-me")` — obviously-fake placeholder ships as the production fallback for the appointment-token HMAC key. |
| W7 | **.env.example gap**: `SECRET_KEY` missing | `.env.example` (absent) vs `app/config.py:20` | `config.py` reads `SECRET_KEY`; `.env.example` never documents it. |
| W8 | **.env.example gap**: `WAREHOUSE_CODE` missing | `.env.example` (absent) vs `app/config.py:24` | `config.py` reads `WAREHOUSE_CODE`; `.env.example` never documents it. (`MAX_PAGE_SIZE` at `config.py:27` is also undocumented but has a benign default; the two flagged gaps are `SECRET_KEY` + `WAREHOUSE_CODE`.) |
| W9 | **Absent tests** (deliberate absence) | no `tests/`, no `test_*.py`, no test deps | Structural: the generator must NOT invent a testing rule or test command (S7). |

### Deliberate absences (structural, by design)

- No `tests/` directory, no test files, no test dependencies.
- No `Makefile`.
- No CI files (`.github/`, `.gitlab-ci.yml`, etc.).
- No auth framework (service is internal; token signing is hand-rolled HMAC via `SECRET_KEY`).

---

## Provenance note

- **Signal themes** were specified by the harness architect (S1–S10 above); the fixture author
  selected the invented domain (dock-slot scheduling / Cratewell Logistics) and wrote all code,
  docs, and planted warts to satisfy those themes.
- **Author blind to the generator prompt:** the fixture author did **not** read
  `generator/PROJECT_SETUP_PROMPT.md`, any file under `generator/`, `templates/`, `feedback/`,
  `case-studies/`, `knowledge-base/`, or `workflows/` while building this fixture (spec L2.2
  fixture-overfitting containment). Detection criteria are frozen at fixture commit, before any run.
- **100% synthetic** (spec §8): invented product, invented firm, invented warehouse codes. No
  resemblance to any real client project; no real feedback-report content. Only real proper nouns
  are public package/service vendors (FastAPI, Pydantic, SQLAlchemy, Alembic, Uvicorn, Docker,
  Postgres, PyPI, Heroku — the last named only inside a planted false claim).
- **Leak-scan:** grep of the fixture tree against the runtime-derived denylist
  (`case-studies/` dir names + `feedback/*.md` stems) returned **0 matches** on 2026-07-03.
- **PyPI verification:** all five pinned versions confirmed present via the PyPI JSON API
  (`https://pypi.org/pypi/<pkg>/json`) on **2026-07-03**. Release dates recorded in the pin table
  above.
