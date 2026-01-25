# Mercury - Unified Design Brief API Specification

## 문서 정보
- **작성일**: 2026-01-25
- **작성자**: Backend Architect
- **상태**: [DONE]
- **버전**: 1.0
- **관련 요구사항**: [REQ-007: Unified Design Brief](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/requirements/req-007-design-brief.md)

---

## 1. 개요

Unified Design Brief는 Chat 세션 또는 Canvas 프로젝트와 1:1로 매핑되는 디자인 명세 데이터입니다. 이 API는 Brief의 조회, 생성, 수정 기능을 제공합니다.

### 1.1 Base URL
`/api/v1`

### 1.2 Authentication
모든 엔드포인트는 `Authorization: Bearer {token}` 헤더가 필요합니다.

---

## 2. API Endpoints

### 2.1 Get Design Brief (Chat Session)
특정 채팅 세션에 연결된 Design Brief를 조회합니다. 없으면 404를 반환합니다.

- **URL**: `/chat/sessions/{session_id}/brief`
- **Method**: `GET`
- **Success Response**: `200 OK`
```json
{
  "id": "brief-uuid",
  "chat_session_id": "session-uuid",
  "concept_info": {
    "theme": "Minimalist Runner",
    "target_audience": { "gender": "unisex", "age_group": "20s" },
    "overall_tone": "Clean, Modern"
  },
  "shoe_spec": {
    "category": "Running",
    "upper_material": "Mesh",
    "sole_type": "Chunky",
    "key_colors": ["#000000", "#FFFFFF"]
  },
  "marketing_context": {
    "season": "2024 SS",
    "price_point": "Mid",
    "competitors": ["Nike Pegasus"]
  },
  "updated_at": "2026-01-25T12:00:00Z"
}
```

### 2.2 Upsert Design Brief (Chat Session)
채팅 세션의 Design Brief를 생성하거나 수정합니다. (Upsert)

- **URL**: `/chat/sessions/{session_id}/brief`
- **Method**: `PUT`
- **Request Body**:
```json
{
  "concept_info": { ... },
  "shoe_spec": { ... },
  "marketing_context": { ... }
}
```
- **Success Response**: `200 OK` (Updated Brief object)

### 2.3 Get Design Brief (Canvas Project)
특정 캔버스 프로젝트에 연결된 Design Brief를 조회합니다.

- **URL**: `/canvas/projects/{canvas_id}/brief`
- **Method**: `GET`
- **Success Response**: `200 OK` (Brief object)

### 2.4 Upsert Design Brief (Canvas Project)
캔버스 프로젝트의 Design Brief를 생성하거나 수정합니다.

- **URL**: `/canvas/projects/{canvas_id}/brief`
- **Method**: `PUT`
- **Request Body**:
```json
{
  "concept_info": { ... },
  "shoe_spec": { ... },
  "marketing_context": { ... }
}
```
- **Success Response**: `200 OK` (Updated Brief object)

### 2.5 Sync Brief from Chat to Canvas
Chat 세션의 Brief 데이터를 Canvas 프로젝트로 복사합니다. ("Send to Canvas" 기능 지원)

- **URL**: `/canvas/projects/{canvas_id}/brief/sync`
- **Method**: `POST`
- **Request Body**:
```json
{
  "source_chat_session_id": "session-uuid"
}
```
- **Processing Logic**:
  1. `source_chat_session_id`로 Brief 조회.
  2. 조회된 내용을 `canvas_id`의 Brief로 덮어쓰기 (Upsert).
  3. 성공 시 복사된 Brief 반환.
- **Success Response**: `200 OK` (Copied Brief object)

### 2.6 Get Reference Gallery
사용자에게 영감을 줄 수 있는 추천 신발 이미지(Reference) 목록을 조회합니다. 각 이미지는 미리 정의된 Prompt 속성(Design Brief) 정보를 포함하고 있습니다.

- **URL**: `/gallery/references`
- **Method**: `GET`
- **Success Response**: `200 OK`
```json
{
  "items": [
    {
      "id": "ref-001",
      "image_url": "https://mercury-assets.s3.../ref_001.png",
      "title": "Neon Cyberpunk Runner",
      "brief_data": {
        "concept_info": { "theme": "Cyberpunk" },
        "shoe_spec": { "key_colors": ["#00FF00", "#FF00FF"] }
      }
    }
  ],
  "total": 20
}
```

---

## 3. Data Models

### 3.1 DesignBrief
```typescript
interface DesignBrief {
  id: string;
  chat_session_id?: string;
  canvas_project_id?: string;
  
  // Design Specs
  concept_info: ConceptInfo;
  shoe_spec: ShoeSpec;
  
  // Reference Image
  reference_image_url?: string; // [NEW] Selected reference image

  // Marketing (Optional/Hidden in Design View)
  marketing_context: MarketingContext;
  
  created_at: string;
  updated_at: string;
}

interface ConceptInfo {
  theme?: string;
  target_audience?: {
    gender?: 'men' | 'women' | 'unisex';
    age_group?: '10s' | '20s' | '30s' | '40s' | '50s+';
  };
  overall_tone?: string;
}

interface ShoeSpec {
  category?: string;
  upper_material?: string;
  sole_type?: string;
  key_colors?: string[]; // HEX codes
}

interface MarketingContext {
  season?: string;
  price_point?: string;
  competitors?: string[];
}
```
