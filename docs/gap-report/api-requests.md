# API Gap Report

## 1. Design Packages
### [MISSING] Create Design Package
- **Endpoint**: `POST /api/v1/design-packages`
- **Description**: Canvas의 "Design Package Workshop"에서 최종 확정 시, 새로운 디자인 패키지를 생성하는 API가 `api-spec-packages.md`에 누락되어 있습니다.
- **Requirements**:
  - Input: Title, Description, Brand Info, Keywords, Color Palette, and list of Asset IDs (generated images).
  - Output: Created Package ID.

## 2. Canvas
### [CLARIFICATION] Smart Segmentation
- **Endpoint**: `POST /canvas/instances/{canvas_id}/segment`
- **Issue**: UI Spec(`ui-spec-canvas.md` 3.4) 및 Requirements(`req-003` 3.3.2)에서는 "Auto-Detect" 또는 "Segment Parts" 버튼 클릭 시 이미지의 *모든* 파트를 분석하여 리스트로 보여주는 것으로 기술되어 있습니다. 그러나 API Spec(`api-spec-canvas.md` 6.8)의 Request Body 예시에는 `click_point`가 포함되어 있어, 포인트 기반 세그멘테이션인지 전체 자동 분석인지 모호합니다.
- **Request**:
  - `click_point` 없이 요청 시 이미지 내 모든 식별 가능한 파트를 반환하도록 스펙 명확화 필요.
  - 또는 "Auto-Detect" 모드와 "Click-to-Segment" 모드를 구분하는 파라미터 필요.
