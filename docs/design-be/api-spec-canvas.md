# API Specification

## 1. 개요

Mercury V2 백엔드 API 명세서입니다. RESTful API 원칙을 따르며, 실시간 스트리밍 기능은 Server-Sent Events (SSE)를 사용합니다.

**Base URL**: `/api/v1`  
**인증 방식**: JWT Bearer Token  
**응답 형식**: JSON

### 인프라 요구사항

> [!IMPORTANT]
> SSE를 효율적으로 사용하기 위해 **HTTP/2**를 인프라 레벨에서 지원해야 합니다.
> - HTTP/2의 멀티플렉싱으로 여러 SSE 연결을 단일 TCP 연결에서 처리 가능
> - Nginx, Caddy 등 리버스 프록시에서 HTTP/2 활성화 필요
> - 프론트엔드는 자동으로 HTTP/2를 사용 (브라우저 지원)

---

## 2. 공통 규칙

### 2.1 HTTP 상태 코드

| 코드 | 의미 | 사용 예시 |
|------|------|-----------|
| 200 | OK | 성공적인 GET, PUT, PATCH 요청 |
| 201 | Created | 성공적인 POST 요청 (리소스 생성) |
| 204 | No Content | 성공적인 DELETE 요청 |
| 400 | Bad Request | 잘못된 요청 파라미터 |
| 401 | Unauthorized | 인증 실패 또는 토큰 없음 |
| 403 | Forbidden | 권한 없음 |
| 404 | Not Found | 리소스를 찾을 수 없음 |
| 422 | Unprocessable Entity | 유효성 검증 실패 |
| 500 | Internal Server Error | 서버 오류 |

### 2.2 공통 응답 형식

#### 성공 응답
```json
{
  "data": { /* 실제 데이터 */ },
  "message": "Success"
}
```

#### 에러 응답
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### 2.3 페이지네이션

리스트 조회 API는 다음 쿼리 파라미터를 지원합니다:

- `page`: 페이지 번호 (기본값: 1)
- `page_size`: 페이지당 항목 수 (기본값: 20, 최대: 100)

페이지네이션 응답 형식:
```json
{
  "data": {
    "items": [ /* 항목 배열 */ ],
    "pagination": {
      "page": 1,
      "page_size": 20,
      "total_items": 150,
      "total_pages": 8
    }
  }
}
```

---

## 6. 캔버스 프로젝트 (Canvas Projects)

### 6.1 캔버스 프로젝트 목록 조회 `[DONE]`

**GET** `/canvas/instances`

**Headers**: `Authorization: Bearer {token}`

**Query Parameters**:
- `project_id`: 프로젝트 ID로 필터링 (Optional)
- `page`, `page_size`: 페이지네이션

**Response** (200):
```json
{
  "data": {
    "items": [
      {
        "id": "canvas-uuid-1",
        "name": "Sketch Design 1",
        "project_id": "proj-uuid-1",
        "created_at": "2026-01-20T10:00:00Z",
        "updated_at": "2026-01-20T15:00:00Z",
        "thumbnail_url": "https://storage.example.com/canvas-thumbnails/canvas-1.jpg"
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

---

### 6.2 캔버스 프로젝트 생성 `[DONE]`

**POST** `/canvas/instances`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "name": "New Canvas Design",
  "project_id": "proj-uuid-1"  // Optional
}
```

**Response** (201):
```json
{
  "data": {
    "id": "canvas-uuid-2",
    "name": "New Canvas Design",
    "project_id": "proj-uuid-1",
    "canvas_state": {
      "viewport": {"x": 0, "y": 0, "zoom": 1.0}
    },
    "created_at": "2026-01-21T10:00:00Z"
  }
}
```

---

### 6.3 캔버스 프로젝트 상세 조회 `[DONE]`

**GET** `/canvas/instances/{canvas_id}`

**Headers**: `Authorization: Bearer {token}`

**Response** (200):
```json
{
  "data": {
    "id": "canvas-uuid-1",
    "name": "Sketch Design 1",
    "project_id": "proj-uuid-1",
    "canvas_state": {
      "viewport": {"x": 100, "y": 50, "zoom": 1.5}
    },
    "layers": [
      {
        "id": "layer-uuid-1",
        "layer_type": "sketch",
        "layer_data": {
          "paths": [ /* SVG path data */ ]
        },
        "z_index": 1,
        "is_visible": true
      },
      {
        "id": "layer-uuid-2",
        "layer_type": "generated",
        "layer_data": {
          "image_url": "https://storage.example.com/generated/img-1.png",
          "position": {"x": 0, "y": 0},
          "size": {"width": 512, "height": 512}
        },
        "z_index": 2,
        "is_visible": true
      }
    ],
    "created_at": "2026-01-20T10:00:00Z",
    "updated_at": "2026-01-20T15:00:00Z"
  }
}
```

---

### 6.4 캔버스 상태 업데이트 `[DONE]`

**PUT** `/canvas/instances/{canvas_id}`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "canvas_state": {
    "viewport": {"x": 150, "y": 100, "zoom": 2.0}
  }
}
```

**Response** (200):
```json
{
  "data": {
    "id": "canvas-uuid-1",
    "canvas_state": {
      "viewport": {"x": 150, "y": 100, "zoom": 2.0}
    },
    "updated_at": "2026-01-21T11:00:00Z"
  }
}
```

---

### 6.5 레이어 추가 `[DONE]`

**POST** `/canvas/instances/{canvas_id}/layers`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "layer_type": "sketch",
  "layer_data": {
    "paths": [
      {"d": "M 10 10 L 100 100", "stroke": "#000000", "stroke-width": 2}
    ]
  },
  "z_index": 3
}
```

**Response** (201):
```json
{
  "data": {
    "id": "layer-uuid-3",
    "layer_type": "sketch",
    "layer_data": { /* ... */ },
    "z_index": 3,
    "is_visible": true,
    "created_at": "2026-01-21T10:00:00Z"
  }
}
```

---

### 6.6 레이어 수정 `[DONE]`

**PUT** `/canvas/instances/{canvas_id}/layers/{layer_id}`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "layer_data": {
    "paths": [ /* updated paths */ ]
  },
  "is_visible": false
}
```

**Response** (200):
```json
{
  "data": {
    "id": "layer-uuid-3",
    "layer_data": { /* ... */ },
    "is_visible": false,
    "updated_at": "2026-01-21T11:00:00Z"
  }
}
```

---

### 6.7 레이어 삭제 `[DONE]`

**DELETE** `/canvas/instances/{canvas_id}/layers/{layer_id}`

**Headers**: `Authorization: Bearer {token}`

**Response** (204): No Content

---

### 6.8 Smart Segmentation 요청 `[READY]`

**POST** `/canvas/instances/{canvas_id}/segment`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "layer_id": "layer-uuid-2",
  "click_point": {"x": 250, "y": 300}
}
```

**Response** (200):
```json
{
  "data": {
    "segments": [
      {
        "id": "seg-1",
        "label": "Outsole",
        "mask_data": {"paths": []},
        "color": "#FF0000"
      },
      {
        "id": "seg-2",
        "label": "Shoelace",
        "mask_data": {"paths": []},
        "color": "#00FF00"
      }
    ]
  }
}
```

#### Processing Logic
1.  **Validation**: `layer_id`가 현재 캔버스에 존재하고, 이미지 타입인지 확인
2.  **Fetch**: S3에서 원본 이미지 다운로드
3.  **External Call**: 외부 모델 서버에 이미지와 클릭 포인트 전송 (SAM 등)
4.  **Cache (Mock)**: 현재는 Mock 데이터 반환
5.  **Response (Mock)**: 미리 정의된 세그먼트 데이터 반환

> [!NOTE]
> 현재는 Mock 구현입니다. 실제 SAM (Segment Anything Model) 연동은 추후 구현 예정입니다.

---

### 6.9 Sketch-to-Image 생성 `[DONE]`

**POST** `/canvas/instances/{canvas_id}/generate`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "layer_ids": ["layer-uuid-1", "layer-uuid-2"],  // 입력으로 사용할 레이어들
  "prompt": "고급스러운 가죽 소재, 브라운 컬러",
  "generation_params": {
    "strength": 0.7,  // Denoising strength
    "steps": 50,
    "guidance_scale": 7.5
  }
}
```

**Response** (201):
```json
{
  "data": {
    "task_id": "task-uuid-3",
    "status": "processing"
  }
}
```

#### Processing Logic
1.  **Validation**: `layer_ids`가 유효하고 현재 캔버스에 속하는지 확인
2.  **Composition**: 선택된 레이어들을 Z-index 순서대로 병합하여 Base Image 생성
3.  **Async Task**: `generate_sketch_to_image_task` Celery 작업 큐에 등록
4.  **Integration**: 외부 이미지 생성 API (Stable Diffusion XL 등) 호출
5.  **Completion**: 생성된 이미지를 S3에 업로드하고 `generated` 타입의 새 레이어로 추가 후 작업 상태 업데이트

---

### 6.10 Inpainting (부분 수정) `[DONE]`

**POST** `/canvas/instances/{canvas_id}/inpaint`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "layer_id": "layer-uuid-2",
  "mask_data": {
    "paths": [ /* SVG path defining mask area */ ]
  },
  "prompt": "아웃솔을 더 두껍게 변경",
  "generation_params": {
    "strength": 0.8
  }
}
```

**Response** (201):
```json
{
  "data": {
    "task_id": "task-uuid-4",
    "status": "processing"
  }
}
```

#### Processing Logic
1.  **Validation**: `layer_id` 검증 및 `mask_data` 포맷 확인
2.  **Mask Rendering**: 벡터 마스크 데이터를 래스터 마스크 이미지로 변환
3.  **Async Task**: `inpainting_task` Celery 작업 큐에 등록
4.  **Integration**: 원본 이미지, 마스크, 프롬프트를 외부 Inpainting API에 전달
5.  **Result**: 결과 이미지를 S3에 저장하고, 원본 레이어 위에 덮어씌우거나 새 레이어로 생성 (설정에 따름)

---

### 6.11 Undo/Redo

> [!NOTE]
> **Undo/Redo는 프론트엔드에서만 관리합니다.**
> - 캔버스 히스토리는 프론트엔드 메모리에 저장
> - 새로고침 시 히스토리 손실 (구현 단순성 우선)
> - 서버는 최종 캔버스 상태(`canvas_state`, `layers`)만 저장
> - 추후 협업 기능 추가 시 서버 기반 히스토리 저장 재검토

---

## 7. 비동기 작업 상태 (Polling)

비동기 작업의 상태 확인을 위한 Polling 엔드포인트입니다.

### 7.1 작업 상태 조회 `[DONE]`

**GET** `/tasks/{task_id}/status`

**Headers**: `Authorization: Bearer {token}`

**Response** (200):

#### 처리 중 (Progress)
```json
{
  "task_id": "task-uuid-1",
  "status": "PROGRESS",
  "result": null,
  "progress": {
    "status": "Generating image...",
    "current": 45,
    "total": 100
  },
  "error": null
}
```

#### 완료 (Success)
```json
{
  "task_id": "task-uuid-1",
  "status": "SUCCESS",
  "result": {
    "images": [
      {"id": "img-uuid-15", "image_url": "https://..."}
    ]
  },
  "progress": null,
  "error": null
}
```

#### 실패 (Failure)
```json
{
  "task_id": "task-uuid-1",
  "status": "FAILURE",
  "result": null,
  "progress": null,
  "error": {
    "message": "Failed to generate image",
    "type": "GenerationError"
  }
}
```

> [!TIP]
> **Polling 권장사항**
> - 3초 간격으로 상태를 확인하는 것을 권장합니다.
> - `status`가 `SUCCESS` 또는 `FAILURE`가 될 때까지 반복 호출합니다.
