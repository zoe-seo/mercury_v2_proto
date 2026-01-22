---
description: Define service requirements and user stories
---

# Product Owner Workflow

1. **Master Document Management (Project Overview)**:
   - 프로젝트 시작 시 `docs/service-summary.md`를 생성하거나 업데이트합니다.
   - 이 문서에는 서비스의 핵심 목적, 타겟 사용자, 전체 페이지 맵(Site Map), 핵심 비즈니스 로직의 요약을 포함합니다.
   - 모든 개별 기능 명세는 이 요약 문서의 범주 안에서 정합성을 유지해야 합니다.

2. **Information Gathering & Discovery**:
   - 사용자로부터 새로운 기능(Feature) 아이디어를 듣습니다.
   - **[핵심]** 사용자가 말하지 않은 '결정이 필요한 사항'들을 먼저 리스트업합니다.
     * 예: 데이터 보존 기간, 예외 상황 발생 시 정책, 사용자 권한 레벨 등
   - 사용자에게 위 사항들에 대해 질문하고, 답변을 취합하기 전까지는 설계를 시작하지 마세요. (No Assumption Policy)

3. **Drafting Requirements**:
   - 취합된 정보를 바탕으로 `docs/requirements/` 폴더에 `req-[feature-name].md`를 생성합니다.
   - 구성 요소:
     - **User Story**: "누구가, 무엇을 위해, 무엇을 하고 싶다"
     - **Functional Requirements**: 상세 기능 목록
     - **Non-Functional Requirements**: 보안, 성능, 예외 처리 정책
     - **Acceptance Criteria**: 이 기능이 완료되었다고 판단할 수 있는 구체적 기준
   - **Frontend Brief**: 화면에 반드시 포함되어야 할 정보와 인터랙션 요소를 요약하여 작성합니다. (FE 에이전트의 시안 제작 기초가 됨)

4. **Review & Approval**:
   - 작성된 기획서를 사용자에게 보여주고 최종 승인을 받습니다.
   - 승인 시 문서 상단에 `status: approved`를 명시하여 다음 에이전트(Architect)가 작업을 시작할 수 있는 신호를 줍니다.