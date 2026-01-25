# REQ-007: Unified Design Brief (Common Input Form)

## 1. User Story

- **디자이너**로서,
- **Chat**이나 **Canvas** 어디에서든 **최소한의 필수 입력**만으로 시작하되,
- AI가 **자동으로 채워준(Pre-filled)** 상세 스펙을 확인 및 수정하여,
- **Chat**에서는 대화 초기에 빠르게 디자인 방향을 잡고,
- **Canvas**에서는 **Spec Node**를 통해 시각적으로 스펙을 관리하며,
- 최종적으로 **고품질 디자인**과 **마케팅 리포트**를 한번에 얻고 싶다.

---

## 2. Design Brief 데이터 구조 (Specs)

### 2.1 Essential Generation Spec (필수 입력 & 생성용)
*이미지 생성 퀄리티에 직접적인 영향을 미치는 핵심 속성. 사용자가 명확히 지정해야 함.*

| Category | Field | Description | User Input Required? |
|----------|-------|-------------|----------------------|
| **Concept** | `Theme` | 디자인의 핵심 테마 (예: 범용성을 타겟하는 스탠다드 쿠션감의 러닝화) | ✅ Yes |
| | `Brand` | 타겟 브랜드 (예: HDEX) | ✅ Yes |
| **Color** | `Overall Tone` | 전체적인 톤앤매너 (예: Matte Black) | ✅ Yes |
| **Sole** | `Midsole Material` | 미드솔 소재 (예: 고탄성 경량 합성 폼) | 🔺 Recommended |
| | `Outsole Shape` | 아웃솔 형태 (예: 청키 플랫폼) | 🔺 Recommended |
| **Upper** | `Material` | 갑피 주 소재 (예: 엔지니어드 메쉬) | 🔺 Recommended |
| **Detail** | `Logo Position` | 로고 배치 위치 (예: Heel tab, Side panel) | 🔺 Recommended |

### 2.2 Marketing Context Spec (리포트용)
*마케팅 리포트 생성 및 비즈니스 분석을 위한 메타데이터.*

| Field | Options / Examples | User Input Required? |
|-------|--------------------|----------------------|
| **Target Audience** | Gender (Men/Women/Unisex), Age (10s~50s) | ✅ Yes |
| **Market Season** | 2024 SS, 2024 FW... | ✅ Yes |
| **Reference Brands** | Nike, New Balance... (경쟁사 분석용) | 🔺 Auto-fill 가능 |
| **Key Colors** | Main / Point / Sub Color (Hex Code) | 🔺 Auto-fill 가능 |

### 2.3 Auto-filled Details (AI 자동 완성)
*사용자가 입력하지 않으면 AI가 `Concept`과 `Brand`를 기반으로 자동 생성하는 디테일.*
- **Camera/Lighting**: 85mm 렌즈, 스튜디오 조명 등 (최적값 자동 설정)
- **Composition**: 측면 뷰, 3:4 비율 등 (표준값)
- **Background**: 미니멀 그레이, 스튜디오 배경
- **Detailed Textures**: 미드솔의 미세 질감, 어퍼의 직조 밀도 등

---

## 3. Workflow Integration

### 3.1 Chat Interface: "Initial Briefing Bubble"

1.  **Start**: 사용자가 첫 메시지 입력 (예: "가벼운 러닝화 디자인해줘").
2.  **AI Analysis & Reply**:
    - AI가 사용자 입력을 분석해 `Design Brief`의 내용을 추론.
    - 텍스트 응답과 함께 **"Design Brief Form"**이 포함된 특수 버블을 출력.
    - **Form State**:
        - `Theme`, `Target Audience` 등 추론 가능한 내용은 **Pre-filled**.
        - 불확실하거나 비어있는 필수 항목은 하이라이트.
3.  **Interaction**:
    - 사용자는 폼에서 빈칸만 채우거나 수정 확인.
    - "Confirm" 버튼 클릭 시 본격적인 이미지 생성 시작.

### 3.2 Canvas Interface: "Spec Side Panel"

1.  **Layout**: **왼쪽 사이드 패널(Left Panel)**에 `Design Brief` 폼을 상시 배치.
    - 기존 툴바나 레이어 패널과 분리되어, 디자인 작업 중 언제든 스펙을 확인하고 수정할 수 있는 공간.
    - 접었다 폈다(Collapsible) 할 수 있어 캔버스 공간 확보 가능.
2.  **Global Context**:
    - 이 패널의 내용은 **캔버스 전체의 전역 설정(Global Context)**으로 동작.
    - 캔버스 내의 모든 생성 작업(Sketch to Image, Inpainting 등) 시 이 스펙 정보가 프롬프트에 자동으로 반영됨.
3.  **Chat Integration**:
    - Chat에서 "Send to Canvas" 실행 시, Chat 세션의 Brief 데이터가 이 사이드 패널로 자동 복사됨.
4.  **Edit & Update**:
    - 사용자가 패널 내용을 수정하면, 이후 생성되는 모든 이미지에 즉시 반영.

---

## 4. UI/UX 요구사항

### 4.1 Form Design
- **Compact View**: 핵심 정보만 보이는 요약 뷰 (Chat 버블용).
- **Full Edit View**: 모든 필드를 수정할 수 있는 상세 뷰 (Modal 또는 Canvas Node 확장 시).
- **Smart Fill**: "Auto-fill missing fields" 버튼 제공 (AI가 나머지 빈칸 채움).

### 4.2 Spec Side Panel (Canvas)
- **Design**: 왼쪽 사이드바 (Width: 300px~320px), Collapsible.
- **Persistence**: 캔버스의 Meta Data로 저장되어 새로고침 시에도 유지.
- **Synchronization**: Panel 수정 시 즉시 Auto-save 동작.

---

## 5. Acceptance Criteria
- [ ] **Data Model**: 위 정의된 Essential / Marketing / Auto-filled 필드를 포함하는 스키마 설계.
- [ ] **Chat**: 첫 대화 후 Design Brief 폼이 버블 형태로 렌더링되어야 함. 내용은 AI 추론값으로 채워져 있어야 함.
- [ ] **Canvas**: `Spec Side Panel`이 왼쪽에 배치되고 접었다 폈다 할 수 있어야 함.
- [ ] **Generation**: Brief의 내용이 프롬프트로 변환되어 이미지 생성 API에 전달되어야 함.
- [ ] **Report**: Brief의 Marketing Context가 Design Package 리포트 생성에 사용되어야 함.
