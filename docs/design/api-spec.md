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

## 3. 인증 (Authentication)

### 3.1 회원가입

**POST** `/auth/signup`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123!",
  "name": "홍길동"
}
```

**Response** (201):
```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "홍길동",
      "created_at": "2026-01-21T10:00:00Z"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer"
  }
}
```

---

### 3.2 로그인

**POST** `/auth/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123!"
}
```

**Response** (200):
```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "홍길동"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer"
  }
}
```

---

### 3.3 로그아웃

**POST** `/auth/logout`

**Headers**: `Authorization: Bearer {token}`

**Response** (204): No Content

---

### 3.4 사용자 프로필 조회

**GET** `/auth/me`

**Headers**: `Authorization: Bearer {token}`

**Response** (200):
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "홍길동",
    "created_at": "2026-01-21T10:00:00Z"
  }
}
```

---

### 3.5 비밀번호 변경

**PUT** `/auth/password`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "current_password": "oldPassword123!",
  "new_password": "newPassword456!"
}
```

**Response** (200):
```json
{
  "data": {
    "message": "Password updated successfully"
  }
}
```

---

## 4. 프로젝트 (Projects)

### 4.1 프로젝트 목록 조회

**GET** `/projects`

**Headers**: `Authorization: Bearer {token}`

**Query Parameters**:
- `page`: 페이지 번호
- `page_size`: 페이지당 항목 수

**Response** (200):
```json
{
  "data": {
    "items": [
      {
        "id": "proj-uuid-1",
        "name": "2026 Spring Collection",
        "description": "봄 시즌 신발 컬렉션",
        "created_at": "2026-01-15T10:00:00Z",
        "updated_at": "2026-01-20T15:30:00Z",
        "design_count": 12
      }
    ],
    "pagination": {
      "page": 1,
      "page_size": 20,
      "total_items": 5,
      "total_pages": 1
    }
  }
}
```

---

### 4.2 프로젝트 생성

**POST** `/projects`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "name": "Summer Collection",
  "description": "여름 시즌 신발 디자인"
}
```

**Response** (201):
```json
{
  "data": {
    "id": "proj-uuid-2",
    "name": "Summer Collection",
    "description": "여름 시즌 신발 디자인",
    "created_at": "2026-01-21T10:00:00Z",
    "updated_at": "2026-01-21T10:00:00Z"
  }
}
```

---

### 4.3 프로젝트 상세 조회

**GET** `/projects/{project_id}`

**Headers**: `Authorization: Bearer {token}`

**Response** (200):
```json
{
  "data": {
    "id": "proj-uuid-1",
    "name": "2026 Spring Collection",
    "description": "봄 시즌 신발 컬렉션",
    "created_at": "2026-01-15T10:00:00Z",
    "updated_at": "2026-01-20T15:30:00Z",
    "design_packages": [
      {
        "id": "pkg-uuid-1",
        "title": "Urban Runner",
        "thumbnail_url": "https://storage.example.com/thumbnails/pkg-1.jpg",
        "created_at": "2026-01-16T10:00:00Z"
      }
    ]
  }
}
```

---

### 4.4 프로젝트 수정

**PUT** `/projects/{project_id}`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "name": "Updated Project Name",
  "description": "Updated description"
}
```

**Response** (200):
```json
{
  "data": {
    "id": "proj-uuid-1",
    "name": "Updated Project Name",
    "description": "Updated description",
    "updated_at": "2026-01-21T11:00:00Z"
  }
}
```

---

### 4.5 프로젝트 삭제

**DELETE** `/projects/{project_id}`

**Headers**: `Authorization: Bearer {token}`

**Response** (204): No Content

---

## 5. 채팅 세션 (Chat Sessions)

### 5.1 채팅 세션 목록 조회

**GET** `/chat/sessions`

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
        "id": "session-uuid-1",
        "title": "Urban Sneaker Design",
        "project_id": "proj-uuid-1",
        "session_state": "finalized",
        "created_at": "2026-01-20T10:00:00Z",
        "updated_at": "2026-01-20T15:00:00Z",
        "message_count": 24,
        "image_count": 8
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

---

### 5.2 채팅 세션 생성

**POST** `/chat/sessions`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "title": "New Design Session",
  "project_id": "proj-uuid-1"  // Optional
}
```

**Response** (201):
```json
{
  "data": {
    "id": "session-uuid-2",
    "title": "New Design Session",
    "project_id": "proj-uuid-1",
    "session_state": "interview",
    "created_at": "2026-01-21T10:00:00Z",
    "updated_at": "2026-01-21T10:00:00Z"
  }
}
```

---

### 5.3 채팅 세션 상세 조회

**GET** `/chat/sessions/{session_id}`

**Headers**: `Authorization: Bearer {token}`

**Response** (200):
```json
{
  "data": {
    "id": "session-uuid-1",
    "title": "Urban Sneaker Design",
    "project_id": "proj-uuid-1",
    "session_state": "finalized",
    "brand_identity": {
      "brand_name": "UrbanFit",
      "philosophy": "Comfort meets style"
    },
    "preferences": {
      "target_audience": "20-30대 도시 직장인",
      "materials": ["mesh", "leather"],
      "colors": ["#1a1a1a", "#ffffff", "#ff6b6b"],
      "price_range": "150000-200000"
    },
    "created_at": "2026-01-20T10:00:00Z",
    "updated_at": "2026-01-20T15:00:00Z"
  }
}
```

---

### 5.4 채팅 메시지 목록 조회

**GET** `/chat/sessions/{session_id}/messages`

**Headers**: `Authorization: Bearer {token}`

**Query Parameters**:
- `limit`: 최근 N개 메시지 (기본값: 50)

**Response** (200):
```json
{
  "data": {
    "messages": [
      {
        "id": "msg-uuid-1",
        "role": "assistant",
        "content": "안녕하세요! 신발 디자인을 도와드리겠습니다. 어떤 스타일의 신발을 만들고 싶으신가요?",
        "metadata": null,
        "created_at": "2026-01-20T10:00:00Z",
        "sequence_number": 1
      },
      {
        "id": "msg-uuid-2",
        "role": "user",
        "content": "도시적이고 모던한 러닝화를 만들고 싶어요.",
        "metadata": null,
        "created_at": "2026-01-20T10:01:00Z",
        "sequence_number": 2
      }
    ]
  }
}
```

---

### 5.5 채팅 메시지 전송 (Stream)

**POST** `/chat/sessions/{session_id}/messages/stream`

**Headers**: 
- `Authorization: Bearer {token}`
- `Accept: text/event-stream`

**Request Body**:
```json
{
  "content": "검은색과 흰색을 조합한 미니멀한 디자인을 원해요.",
  "metadata": {
    "reference_images": ["img-uuid-1"]  // Optional
  }
}
```

**Response** (SSE Stream):
```
event: message_start
data: {"message_id": "msg-uuid-3", "sequence_number": 5}

event: content_delta
data: {"delta": "좋은"}

event: content_delta
data: {"delta": " 선택"}

event: content_delta
data: {"delta": "입니다!"}

event: message_complete
data: {"message_id": "msg-uuid-3", "content": "좋은 선택입니다! 미니멀한 디자인으로 진행하겠습니다."}

event: done
data: {}
```

---

### 5.6 Outline 이미지 생성 요청

**POST** `/chat/sessions/{session_id}/generate-outlines`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "prompt": "미니멀한 러닝화, 검은색과 흰색 조합",
  "count": 4  // 생성할 outline 개수
}
```

**Response** (201):
```json
{
  "data": {
    "task_id": "task-uuid-1",
    "status": "processing"
  }
}
```

> **Note**: 실제 이미지 생성은 비동기로 처리되며, 결과는 WebSocket 또는 Polling으로 확인합니다.

---

### 5.7 최종 디자인 생성 요청

**POST** `/chat/sessions/{session_id}/generate-design`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "selected_outline_id": "img-uuid-5",
  "prompt": "검은색 메쉬 소재, 흰색 밑창, 미니멀한 로고",
  "generation_params": {
    "model": "stable-diffusion-xl",
    "steps": 50,
    "guidance_scale": 7.5
  }
}
```

**Response** (201):
```json
{
  "data": {
    "task_id": "task-uuid-2",
    "status": "processing"
  }
}
```

---

### 5.8 디자인 패키지 생성

**POST** `/chat/sessions/{session_id}/finalize`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "selected_image_ids": ["img-uuid-10", "img-uuid-11"],
  "title": "Urban Runner Black & White",
  "description": "미니멀한 도시형 러닝화"
}
```

**Response** (201):
```json
{
  "data": {
    "design_package_id": "pkg-uuid-1",
    "status": "generating_report"
  }
}
```

---

## 6. 캔버스 프로젝트 (Canvas Projects)

### 6.1 캔버스 프로젝트 목록 조회

**GET** `/canvas/projects`

**Headers**: `Authorization: Bearer {token}`

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

### 6.2 캔버스 프로젝트 생성

**POST** `/canvas/projects`

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

### 6.3 캔버스 프로젝트 상세 조회

**GET** `/canvas/projects/{canvas_id}`

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

### 6.4 캔버스 상태 업데이트

**PUT** `/canvas/projects/{canvas_id}`

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

### 6.5 레이어 추가

**POST** `/canvas/projects/{canvas_id}/layers`

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

### 6.6 레이어 수정

**PUT** `/canvas/projects/{canvas_id}/layers/{layer_id}`

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

### 6.7 레이어 삭제

**DELETE** `/canvas/projects/{canvas_id}/layers/{layer_id}`

**Headers**: `Authorization: Bearer {token}`

**Response** (204): No Content

---

### 6.8 Sketch-to-Image 생성

**POST** `/canvas/projects/{canvas_id}/generate`

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

---

### 6.9 Inpainting (부분 수정)

**POST** `/canvas/projects/{canvas_id}/inpaint`

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

---

### 6.10 Undo/Redo

> [!NOTE]
> **Undo/Redo는 프론트엔드에서만 관리합니다.**
> - 캔버스 히스토리는 프론트엔드 메모리에 저장
> - 새로고침 시 히스토리 손실 (구현 단순성 우선)
> - 서버는 최종 캔버스 상태(`canvas_state`, `layers`)만 저장
> - 추후 협업 기능 추가 시 서버 기반 히스토리 저장 재검토
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

**GET** `/tasks/{task_id}`

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

## 10. SSE (실시간 업데이트)

비동기 작업의 실시간 상태 업데이트를 위한 Server-Sent Events 엔드포인트입니다.

### 10.1 비동기 작업 상태 스트림

**GET** `/tasks/{task_id}/stream`

**Headers**: 
- `Authorization: Bearer {token}`
- `Accept: text/event-stream`

**Response** (SSE Stream):

#### 진행 상황 업데이트
```
event: progress
data: {"task_id": "task-uuid-1", "progress": 45, "message": "Generating image..."}

event: progress
data: {"task_id": "task-uuid-1", "progress": 75, "message": "Processing..."}
```

#### 작업 완료
```
event: completed
data: {"task_id": "task-uuid-1", "result": {"images": [{"id": "img-uuid-15", "image_url": "https://..."}]}}

event: done
data: {}
```

#### 작업 실패
```
event: error
data: {"task_id": "task-uuid-1", "error": {"code": "GENERATION_ERROR", "message": "Failed to generate image"}}

event: done
data: {}
```

> [!TIP]
> **SSE 사용 권장사항**
> - 클라이언트는 EventSource API 사용
> - 자동 재연결 지원 (3초 재시도)
> - HTTP/2 환경에서 최적 성능

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

## 12. 인증 및 권한

### JWT 토큰 구조

**Header**:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload**:
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",  // user_id
  "email": "user@example.com",
  "exp": 1737532800,  // 만료 시간 (Unix timestamp)
  "iat": 1737446400   // 발급 시간
}
```

### 토큰 갱신 전략

MVP 단계에서는 단순 구현:
- **Access Token 만료 시간**: 24시간
- 만료 시 재로그인 필요
- **추후 계획**: Refresh Token 도입 예정 (보안 강화)

---

## 13. Rate Limiting

API 남용 방지를 위한 Rate Limiting 정책:

| 엔드포인트 카테고리 | 제한 |
|---------------------|------|
| 인증 API (`/auth/*`) | 10 requests / 분 |
| 이미지 생성 API | 5 requests / 분 |
| 일반 CRUD API | 100 requests / 분 |
| 이미지 업로드 | 20 requests / 시간 |

Rate Limit 초과 시 **429 Too Many Requests** 응답:
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retry_after": 60  // 초 단위
  }
}
```

---

## 14. 버전 관리

- 현재 버전: `v1`
- Base URL: `/api/v1`
- 주요 변경 시 `/api/v2` 등으로 버전 업
- 하위 호환성 유지 원칙

---

## 15. 개발 우선순위

### Phase 1 (MVP Core)
1. 인증 API (회원가입, 로그인, 프로필)
2. 프로젝트 CRUD
3. 채팅 세션 기본 기능 (메시지 전송/조회)
4. 이미지 업로드
5. 디자인 패키지 조회 (갤러리)

### Phase 2 (AI Integration)
1. 채팅 메시지 Stream (SSE)
2. Outline 생성 API
3. 최종 디자인 생성 API
4. 비동기 작업 상태 조회
5. WebSocket 실시간 업데이트

### Phase 3 (Canvas)
1. 캔버스 프로젝트 CRUD
2. 레이어 관리 API
3. Sketch-to-Image 생성
4. Inpainting API
5. Undo/Redo

### Phase 4 (Advanced Features)
1. 디자인 패키지 생성 (마케팅 리포트 포함)
2. PDF 내보내기
3. 공유 링크 생성
4. 차트 데이터 시각화

---

## 16. 기술 스택 및 아키텍처

### 16.1 핵심 기술 스택
- **백엔드**: FastAPI (Python 3.12), SQLAlchemy Async
- **데이터베이스**: PostgreSQL
- **파일 저장소**: AWS S3 (Pre-signed URL 사용)
- **캐싱**: Redis (세션, 작업 상태 캐싱)
- **메시지 큐**: Celery + Redis (비동기 이미지 생성 작업)
- **인프라**: HTTP/2 지원 (Nginx/Caddy)

### 16.2 AI 모델 아키텍처

#### 이미지 생성 모델
- **외부 API 사용**: Google Imagen, Stability AI 등
- **동적 모델 선택**: 요청 시 `model` 파라미터로 모델 지정 가능
- **예시 모델**:
  - `imagen-3.0-generate-001` (Google)
  - `stable-diffusion-xl-1024-v1-0` (Stability AI)
  - `dall-e-3` (OpenAI)

**API 호출 흐름**:
```
클라이언트 → FastAPI 백엔드 → Celery Task → 외부 AI API → S3 업로드 → DB 저장
```

#### Segmentation 모델 (추후 개발)
- **외부 API 사용**: 별도 AI 모델 서버 (SAM, Segment Anything 등)
- **기능**: 캔버스 내 이미지 객체 선택 시 자동 세그멘테이션
- **호출 방식**: FastAPI → 외부 Segmentation API → 결과 반환

#### LLM (채팅 및 마케팅 리포트)
- **채팅**: OpenAI GPT-4, Claude 등 (스트리밍 응답)
- **마케팅 리포트**: **LangGraph** 사용
  - 각 단계를 노드로 관리 (시장 분석, 비용 분석, 트렌드 분석 등)
  - 구조화된 워크플로우로 복잡한 리포트 생성
  - 예시 노드: `collect_requirements` → `analyze_market` → `estimate_cost` → `generate_chart_data` → `finalize_report`

### 16.3 비동기 작업 처리

**Celery Task 예시**:
```python
@celery_app.task
def generate_image_task(prompt: str, model: str, params: dict):
    # 1. 외부 AI API 호출
    image_data = call_external_ai_api(prompt, model, params)
    
    # 2. S3 업로드
    s3_url = upload_to_s3(image_data)
    
    # 3. DB 저장
    save_generated_image(s3_url, prompt, params)
    
    # 4. SSE로 클라이언트에 완료 알림
    notify_client_via_sse(task_id, result)
```

### 16.4 실시간 통신 전략

- **SSE (Server-Sent Events)**: 모든 실시간 업데이트에 사용
  - 채팅 메시지 스트리밍
  - 이미지 생성 진행 상황
  - 디자인 패키지 생성 상태
- **HTTP/2 필수**: SSE 성능 최적화를 위해 인프라 레벨에서 HTTP/2 활성화
- **WebSocket 미사용**: MVP에서는 양방향 통신 불필요 (추후 실시간 협업 시 재검토)
