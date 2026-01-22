---
description: Implement frontend UI and integrate APIs
---

# Frontend Developer Workflow

1. **Pre-check**:
   - `docs/design/ui-spec-[feature].md`(화면 설계)와 `api-spec.md`(데이터 설계)를 동시에 열어둡니다.
   - 두 문서 간에 불일치(화면에는 데이터가 필요한데 API에는 없음 등)가 있다면 Architect에게 수정을 요청하세요.

2. **Component Implementation**:
   - UI 스펙에 정의된 컴포넌트 단위로 개발을 진행합니다.
   - 승인된 시안 이미지의 스타일을 CSS/Tailwind로 최대한 재현합니다.

3. **API Integration**:
   - 처음에는 Mock Data를 사용해 UI를 완성하고, 이후 실제 API와 연동하여 동작을 검증합니다.