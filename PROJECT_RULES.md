# Project Rules & Guidelines

## 1. Collaboration Protocol (협업 규칙)
- **Role-Based Execution**: 본인의 역할(Role)에 맞는 작업만 수행하세요. 다른 에이전트의 산출물이 필요하면 읽기만 하고 수정하지 마세요.
- **Single Source of Truth**: 
    - 기획 사항은 `docs/requirements/`를 따릅니다.
    - API 명세는 `docs/design-be/`를 따릅니다.
    - UI/UX 디자인은 `docs/design-fe/`를 따릅니다.
    - 전역 설계 및 디자인 시스템은 `docs/design/`를 따릅니다.
    - DB 스키마는 `docs/design-be/schema.md`를 따릅니다.
- **Artifact First**: 코드를 짜기 전에 반드시 설계/기획 문서를 먼저 확인하거나 작성하세요.

## 2. Documentation Rules (문서 규칙)
- 모든 문서는 Markdown 포맷을 사용합니다.
- 변경 사항 발생 시 `99-documentation.md` 워크플로우를 사용하는 에이전트를 통해 직접 Docs를 업데이트해야 합니다.

## 3. Tech Stack (기술 스택)
- BE: Python 3.12, FastAPI, SQLAlchemy
- FE: React 19, Vite, TailwindCSS v4
- DB: PostgreSQL