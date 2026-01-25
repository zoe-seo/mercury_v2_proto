# API Specification

## 1. 개요

Mercury V2 백엔드 API 명세서입니다. RESTful API 원칙을 따르며, 실시간 스트리밍 기능은 Server-Sent Events (SSE)를 사용합니다.

**Base URL**: `/api/v1`  
**인증 방식**: JWT Bearer Token  
**응답 형식**: JSON

### 인프라 요구사항

> [!IMPORTANT]
> SSE를 효율적으로 사용하기 위해 **HTTP/2**를 인프라 레벨에서 지원해야 합니다.
> - 프론트엔드는 자동으로 HTTP/2를 사용 (브라우저 지원)
> - 비동기 작업 상태는 **Polling** 방식을 사용합니다.

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


## 7. 디자인 패키지 (Design Packages)

### 7.1 디자인 패키지 목록 조회 (갤러리)

**GET** `/design-packages`

**Headers**: `Authorization: Bearer {token}`

**Query Parameters**:
- `project_id`: 프로젝트 ID로 필터링 (Optional)
- `sort`: 정렬 기준 (`created_at`, `updated_at`) (기본값: `created_at`)
- `order`: 정렬 순서 (`asc`, `desc`) (기본값: `desc`)
- `page`, `page_size`: 페이지네이션

**Response** (200):
```json
{
  "data": {
    "items": [
      {
        "id": "pkg-uuid-1",
        "title": "Urban Runner Black & White",
        "description": "미니멀한 도시형 러닝화",
        "project_id": "proj-uuid-1",
        "thumbnail_url": "https://storage.example.com/thumbnails/pkg-1.jpg",
        "color_palette": ["#1a1a1a", "#ffffff"],
        "created_at": "2026-01-20T15:00:00Z",
        "source_type": "chat"  // chat | canvas
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

---

### 7.2 디자인 패키지 상세 조회

**GET** `/design-packages/{package_id}`

**Headers**: `Authorization: Bearer {token}`

**Response** (200):
```json
{
  "data": {
    "id": "pkg-uuid-1",
    "title": "Urban Runner Black & White",
    "description": "미니멀한 도시형 러닝화",
    "project_id": "proj-uuid-1",
    "metadata": {
      "prompt": "미니멀한 러닝화, 검은색과 흰색 조합",
      "keywords": ["urban", "minimal", "running"],
      "brand_info": {
        "brand_name": "UrbanFit",
        "philosophy": "Comfort meets style"
      }
    },
    "color_palette": ["#1a1a1a", "#ffffff", "#f5f5f5"],
    "images": [
      {
        "id": "img-uuid-20",
        "image_type": "main",
        "image_url": "https://storage.example.com/designs/main-1.png",
        "thumbnail_url": "https://storage.example.com/thumbnails/main-1.jpg",
        "display_order": 1
      },
      {
        "id": "img-uuid-21",
        "image_type": "model_shot",
        "image_url": "https://storage.example.com/designs/model-1.png",
        "thumbnail_url": "https://storage.example.com/thumbnails/model-1.jpg",
        "display_order": 2
      }
    ],
    "market_report": {
      "id": "report-uuid-1",
      "market_analysis": "도시형 러닝화 시장은 2026년 현재 연평균 8% 성장 중...",
      "cost_analysis": "예상 제조 원가: 50,000원, 권장 소비자가: 180,000원...",
      "trend_data": {
        "keywords": ["minimalism", "urban", "sustainability"],
        "popularity_score": 85
      },
      "competitor_data": [
        {
          "brand": "Nike",
          "model": "Air Max 270",
          "price": 189000,
          "similarity_score": 0.72
        }
      ],
      "chart_data": {
        "price_distribution": [
          {"range": "100k-150k", "percentage": 25},
          {"range": "150k-200k", "percentage": 45},
          {"range": "200k-250k", "percentage": 30}
        ],
        "trend_timeline": [
          {"month": "2025-10", "interest": 65},
          {"month": "2025-11", "interest": 72},
          {"month": "2025-12", "interest": 80},
          {"month": "2026-01", "interest": 85}
        ]
      }
    },
    "created_at": "2026-01-20T15:00:00Z",
    "updated_at": "2026-01-20T15:00:00Z"
  }
}
```

---

### 7.3 디자인 패키지 수정

**PUT** `/design-packages/{package_id}`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**Response** (200):
```json
{
  "data": {
    "id": "pkg-uuid-1",
    "title": "Updated Title",
    "description": "Updated description",
    "updated_at": "2026-01-21T11:00:00Z"
  }
}
```

---

### 7.4 디자인 패키지 삭제

**DELETE** `/design-packages/{package_id}`

**Headers**: `Authorization: Bearer {token}`

**Response** (204): No Content

---

### 7.5 디자인 패키지 내보내기 (PDF)

**POST** `/design-packages/{package_id}/export/pdf`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "include_report": true,
  "include_charts": true
}
```

**Response** (200):
```json
{
  "data": {
    "download_url": "https://storage.example.com/exports/pkg-1-export.pdf",
    "expires_at": "2026-01-22T11:00:00Z"
  }
}
```

---

### 7.6 디자인 패키지 공유 링크 생성

**POST** `/design-packages/{package_id}/share`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "expires_in_days": 7  // Optional, 기본값: 30일
}
```

**Response** (201):
```json
{
  "data": {
    "share_url": "https://mercury.example.com/share/abc123xyz",
    "share_token": "abc123xyz",
    "expires_at": "2026-01-28T11:00:00Z"
  }
}
```

---

### 7.7 공유 링크로 디자인 패키지 조회 (인증 불필요)

**GET** `/public/design-packages/{share_token}`

**Response** (200):
```json
{
  "data": {
    "title": "Urban Runner Black & White",
    "description": "미니멀한 도시형 러닝화",
    "images": [ /* ... */ ],
    "market_report": { /* ... */ },
    "created_at": "2026-01-20T15:00:00Z"
  }
}
```

---

### 7.9 Production 2D 에셋 생성 시작 `[READY]`

**POST** `/design-packages/{package_id}/production/2d`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "generation_params": {
    "model": "imagen-3.0",
    "quality": "high"
  }
}
```

**Response** (202):
```json
{
  "data": {
    "task_id": "task-uuid-prod-1",
    "status": "processing",
    "assets": [
      {"type": "6view_front", "status": "pending"},
      {"type": "6view_back", "status": "pending"},
      {"type": "6view_left", "status": "pending"},
      {"type": "6view_right", "status": "pending"},
      {"type": "6view_top", "status": "pending"},
      {"type": "6view_bottom", "status": "pending"},
      {"type": "model_shot", "status": "pending"}
    ]
  }
}
```

#### Processing Logic
1.  **Validation**: 패키지가 `draft` 또는 `partial` 상태인지 확인
2.  **Asset Initialization**: `production_assets` 테이블에 7개 레코드 생성 (status: "pending")
3.  **Async Tasks**: 각 뷰에 대해 개별 Celery Task 생성
4.  **Progress Tracking**: Polling을 통해 각 에셋 상태 확인
5.  **Completion**: 모든 2D 에셋 완료 시 패키지 상태를 `2d_completed`로 업데이트

> [!NOTE]
> 2D 에셋 생성은 병렬로 처리되며, 각 에셋은 독립적으로 완료됩니다. 실시간 진행 상태는 SSE 대신 Polling (`7.12`)을 사용합니다.

---

### 7.10 Production 2D 에셋 재생성 `[READY]`

**POST** `/design-packages/{package_id}/production/2d/retry`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "asset_type": "6view_front"
}
```

**Response** (202):
```json
{
  "data": {
    "asset_id": "asset-uuid-1",
    "status": "processing",
    "retry_count": 1
  }
}
```

#### Processing Logic
1.  **Validation**: 해당 `asset_type`이 존재하는지 확인
2.  **Retry Limit**: `retry_count < 3` 확인 (최대 3회)
3.  **Status Update**: status를 "processing"으로 변경, `retry_count` 증가
4.  **Regeneration**: 동일한 `generation_params`로 재생성 Task 시작

---

### 7.11 Production 3D 에셋 생성 시작 `[READY]`

**POST** `/design-packages/{package_id}/production/3d`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "generation_params": {
    "format": "glb",
    "quality": "medium"
  }
}
```

**Response** (202):
```json
{
  "data": {
    "task_id": "task-uuid-3d-1",
    "status": "processing",
    "estimated_time": "5-10 minutes"
  }
}
```

#### Processing Logic
1.  **Validation**: 모든 6-view 에셋이 `completed` 상태인지 확인
2.  **Asset Initialization**: `production_assets`에 `3d_model` 레코드 생성
3.  **Input Preparation**: 6개 뷰 이미지 URL을 3D 생성 모델에 전달
4.  **Async Task**: 3D 재구성 Celery Task 시작 (고부하 작업)
5.  **Completion**: 완료 시 패키지 상태를 `3d_completed`로 업데이트

> [!IMPORTANT]
> 3D 생성은 모든 6-view 에셋이 완료된 후에만 시작할 수 있습니다. `model_shot`은 선택 사항입니다.

---

### 7.12 Production 상태 조회 `[READY]`

**GET** `/design-packages/{package_id}/production/status`

**Headers**: `Authorization: Bearer {token}`

**Response** (200):
```json
{
  "data": {
    "package_status": "2d_completed",
    "assets": [
      {
        "type": "6view_front",
        "status": "completed",
        "asset_url": "https://storage.../front.png",
        "retry_count": 0
      },
      {
        "type": "6view_back",
        "status": "completed",
        "asset_url": "https://storage.../back.png",
        "retry_count": 1
      },
      {
        "type": "model_shot",
        "status": "processing",
        "progress": 75
      },
      {
        "type": "3d_model",
        "status": "pending"
      }
    ]
  }
}
```

---

### 7.13 Production 완료 및 패키지 확정 `[READY]`

**POST** `/design-packages/{package_id}/finalize`

**Headers**: `Authorization: Bearer {token}`

**Response** (200):
```json
{
  "data": {
    "package_id": "pkg-uuid-1",
    "status": "completed",
    "message": "패키지가 갤러리로 전송되었습니다."
  }
}
```

#### Processing Logic
1.  **Validation**: 최소 요구사항 충족 확인 (모든 6-view + model_shot 완료)
2.  **Marketing Report**: 기존 LangGraph 리포트 생성 트리거 (비동기, 미완료 시)
3.  **Status Update**: 패키지 status를 `completed`로 변경
4.  **Notification**: 사용자에게 완료 알림 전송

> [!CAUTION]
> `finalize` 호출 후에는 패키지를 수정할 수 없습니다. 3D 에셋이 아직 처리 중이더라도 확정이 가능하며, 백그라운드에서 계속 진행됩니다.

---

## 8. 이미지 관리

### 8.1 이미지 업로드

**POST** `/images/upload`

**Headers**: 
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Request Body** (Form Data):
- `file`: 이미지 파일 (PNG, JPG, WEBP)
- `purpose`: 업로드 목적 (`reference`, `sketch`, `profile`)

**Response** (201):
```json
{
  "data": {
    "image_id": "img-uuid-30",
    "image_url": "https://storage.example.com/uploads/img-30.png",
    "thumbnail_url": "https://storage.example.com/thumbnails/img-30.jpg",
    "size": 2048576,
    "dimensions": {
      "width": 1024,
      "height": 1024
    }
  }
}
```

---

### 8.2 생성된 이미지 조회

**GET** `/images/generated`

**Headers**: `Authorization: Bearer {token}`

**Query Parameters**:
- `session_id`: 채팅 세션 ID로 필터링 (Optional)
- `canvas_project_id`: 캔버스 프로젝트 ID로 필터링 (Optional)
- `image_type`: 이미지 타입으로 필터링 (Optional)
- `page`, `page_size`: 페이지네이션

**Response** (200):
```json
{
  "data": {
    "items": [
      {
        "id": "img-uuid-10",
        "image_url": "https://storage.example.com/generated/img-10.png",
        "thumbnail_url": "https://storage.example.com/thumbnails/img-10.jpg",
        "prompt": "미니멀한 러닝화",
        "image_type": "rendered",
        "created_at": "2026-01-20T14:00:00Z",
        "is_selected": true
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

---

## 9. 비동기 작업 상태 조회

AI 이미지 생성 등 비동기 작업의 상태를 조회합니다.

**GET** `/tasks/{task_id}` `[DONE]`

**Headers**: `Authorization: Bearer {token}`

**Response** (200):

#### 처리 중
```json
{
  "data": {
    "task_id": "task-uuid-1",
    "status": "processing",
    "progress": 45,
    "created_at": "2026-01-21T10:00:00Z"
  }
}
```

#### 완료
```json
{
  "data": {
    "task_id": "task-uuid-1",
    "status": "completed",
    "progress": 100,
    "result": {
      "images": [
        {
          "id": "img-uuid-15",
          "image_url": "https://storage.example.com/generated/img-15.png",
          "thumbnail_url": "https://storage.example.com/thumbnails/img-15.jpg"
        }
      ]
    },
    "created_at": "2026-01-21T10:00:00Z",
    "completed_at": "2026-01-21T10:02:30Z"
  }
}
```

#### 실패
```json
{
  "data": {
    "task_id": "task-uuid-1",
    "status": "failed",
    "error": {
      "code": "GENERATION_ERROR",
      "message": "Image generation failed due to invalid prompt"
    },
    "created_at": "2026-01-21T10:00:00Z",
    "failed_at": "2026-01-21T10:01:00Z"
  }
}
```

---


## 10. 비동기 작업 상태 (Polling)

비동기 작업의 상태 확인을 위한 Polling 엔드포인트입니다.

### 10.1 작업 상태 조회 `[DONE]`

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

---

## 11. 에러 코드 정의

| 코드 | HTTP 상태 | 설명 |
|------|-----------|------|
| `VALIDATION_ERROR` | 422 | 입력 데이터 유효성 검증 실패 |
| `AUTHENTICATION_FAILED` | 401 | 인증 실패 (잘못된 이메일/비밀번호) |
| `TOKEN_EXPIRED` | 401 | JWT 토큰 만료 |
| `TOKEN_INVALID` | 401 | 유효하지 않은 JWT 토큰 |
| `FORBIDDEN` | 403 | 권한 없음 |
| `RESOURCE_NOT_FOUND` | 404 | 리소스를 찾을 수 없음 |
| `DUPLICATE_EMAIL` | 422 | 이미 존재하는 이메일 |
| `GENERATION_ERROR` | 500 | AI 이미지 생성 실패 |
| `STORAGE_ERROR` | 500 | 파일 저장 실패 |
| `INTERNAL_ERROR` | 500 | 서버 내부 오류 |

---