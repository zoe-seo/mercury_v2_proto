# Chat-to-Design Backend Architecture & Flow

## 1. 핵심 설계 원칙

### 1.1 역할 분리 원칙

| 영역 | 역할 | 책임 범위 |
|---|---|---|
| **FE** | UI 렌더링 | 서버가 내려준 `ui` 데이터 렌더링, 사용자 `action` 전송 |
| **BE** | 상태 제어 (Brain) | 디자인 상태(`shoe_spec`) 관리, 다음 단계(`step`) 결정, 유효성 검증 |
| **LLM** | 언어 처리 (Tool) | 사용자 초기 의도 추출, 상황에 맞는 가이드 멘트 생성 |
| **DB** | 저장소 | 모든 상태의 Single Source of Truth |

### 1.2 LLM 사용 원칙

- **Decoupled**: LLM은 비즈니스 로직(상태 전이, 유효성 검사)을 수행하지 않음.
- **Stateless**: LLM은 이전 대화 맥락을 기억하는 방식(Chat History)에 의존하지 않고, 현재 `shoe_spec` 상태를 입력받아 설명을 생성함.
- **Extractor**: LLM은 자유 텍스트에서 구조화된 데이터를 '추출'하는 용도로만 사용됨 (초기 1턴).

---

## 2. 디자인 상태 모델 (State Model)

### 2.1 Shoe Spec Structure
User가 선택한 모든 디자인 의사결정의 집합.

```json
{
  "target_user": "female | male | unisex",
  "use_case": "running | casual | walking | ...",
  "outline_id": "out_001",
  "sole_id": "sole_023",
  "colors": ["#1A1A1A", "#FF0000"],
  "materials": ["mesh", "synthetic_leather"],
  "style_keywords": ["modern", "sleek"],
  "generated_image_url": "https://..."
}
```

### 2.2 Step Logic (State Machine)
서버는 `shoe_spec`의 데이터 유무에 따라 현재 단계를 결정합니다.

1. `profile`: 타겟/용도 미설정 시
2. `outline`: 아웃라인 미선택 시
3. `sole`: 솔 미선택 시
4. `colors_materials`: 컬러/소재 미선택 시
5. `result`: 모든 필수 값 존재 시

### 2.3 Invalidation Rules (되돌리기 정책)
상위 단계의 값이 변경되면 하위 단계의 값은 **자동 초기화(Nullify)**됩니다.

- `target_user` or `use_case` 변경 → `outline_id`, `sole_id`, `...` = `null`
- `outline_id` 변경 → `sole_id`, `...` = `null`

---

## 3. Communication Protocol (FE ↔ BE)

### 3.1 Request: User Action
사용자의 모든 인터랙션은 단일 엔드포인트(또는 소켓 이벤트)로 전송됩니다.

```json
POST /api/v1/chat/sessions/{session_id}/message
{
  "type": "selection",  // text | selection
  "content": {
    "field": "outline_id",
    "value": "out_001"
  }
}
```

### 3.2 Response: Next State
서버는 항상 다음 4가지 정보를 패키징하여 응답합니다.

```json
{
  "current_step": "sole",
  
  // 1. Assistant Message (For displaying to user)
  "assistant_message": "선택하신 '슬릭 러너' 아웃라인에 어울리는 바닥창(Sole)을 골라주세요.",
  
  // 2. Interactive Widget (Rich Bubble)
  "widget": {
    "type": "selection_card",
    "data": {
      "options": [
        {"id": "sole_023", "image_url": "...", "label": "Chunky Foam"},
        {"id": "sole_024", "image_url": "...", "label": "Flat Rubber"}
      ]
    }
  },
  
  // 3. Current Design State (For syncing state)
  "shoe_spec": {
    "outline_id": "out_001",
    "sole_id": null,
    "...": "..."
  }
}
```

---

## 4. Workflows

### 4.1 Initial Turn (Text Input)
1. **User**: "빨간색 나이키 스타일 러닝화 만들어줘" (Text)
2. **BE**: LLM 호출 (Intent Extraction)
   - Prompt: "Extract target, category, color from user input..."
   - Result: `{"category": "running", "colors": ["red"]}`
3. **BE**: `shoe_spec` 업데이트
4. **BE**: 다음 필수 단계(`profile` or `outline`) 계산하여 응답

### 4.2 Selection Steps (Guided)
1. **User**: 아웃라인 카드 클릭 (Selection)
2. **BE**: `shoe_spec.outline_id` 업데이트
3. **BE**: Invalidation Rule 적용 (하위 데이터 초기화)
4. **BE**: DB 저장
5. **BE**: 다음 단계(`sole`)를 위한 데이터(Sole 리스트) 조회 및 응답 생성

### 4.3 Image Generation
1. **User**: 마지막 단계 완료
2. **BE**: `shoe_spec` 기반으로 **Image Generation Prompt** 조합 (Template-based)
   - 예: "A pair of {use_case} shoes, {target_user}, {outline_desc}, {sole_desc}, main color {colors[0]}..."
3. **BE**: Gemini API (Imagen) 호출
4. **BE**: 결과 URL 저장 및 `result` 단계 응답

---

## 5. Data Persistence

### 5.1 Tables
- **ChatSession**: 세션 정보, 현재 단계, 생성일
- **DesignBrief**: 해당 세션의 현재 `shoe_spec` 데이터 (1:1)
- **ChatMessage**: 대화 이력 (User Action + Assistant Message)

### 5.2 Auto-Save
- 모든 `POST` 요청은 Transaction 내에서 처리되며 DB에 즉시 커밋됩니다.
- 따라서 언제든 재접속해도 마지막 상태가 유지됩니다.
