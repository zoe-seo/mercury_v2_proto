# API Specification

## 1. 개요

Mercury V2 백엔드 API 명세서입니다. RESTful API 원칙을 따르며, 기능에 따라 **SSE (Server-Sent Events)**와 **Polling**을 혼용합니다.
- **채팅 메시지**: SSE 스트리밍
- **비동기 작업 상태**: Polling

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

## 5. 채팅 세션 (Chat Sessions)

### 5.1 채팅 세션 목록 조회 `[DONE]`

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

### 5.2 채팅 세션 생성 `[DONE]`

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

### 5.3 채팅 세션 상세 조회 `[DONE]`

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

### 5.4 채팅 메시지 목록 조회 `[DONE]`

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

### 5.5 채팅 메시지 전송 (Stream) `[DONE]`

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

### 5.6 Outline 이미지 생성 요청 `[DONE]`

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

> **Note**: 이미지 생성은 비동기로 처리되며, 결과는 Polling (`/tasks/{id}/status`)으로 확인합니다.

#### Processing Logic
1.  **Validation**: 세션 소유권을 확인합니다.
2.  **Async Task**: `generate_outline_images` Celery 작업을 큐에 등록합니다.
3.  **Generation (Mock)**: `image_gen` 유틸리티를 사용하여 단색 배경의 Mock 이미지를 생성합니다 (현재 MVP 단계).
4.  **Upload**: 생성된 이미지를 S3(MinIO)에 업로드하고 URL을 획득합니다.
5.  **Persistence**: `generated_images` 테이블에 메타데이터(프롬프트, 타입=outline)와 URL을 저장합니다.

---

### 5.7 최종 디자인 생성 요청 `[DONE]`

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

#### Processing Logic
1.  **Validation**: 세션 소유권을 확인합니다.
2.  **Async Task**: `generate_design_image` Celery 작업을 큐에 등록합니다.
3.  **Context**: `selected_outline_id`가 있는 경우 해당 아웃라인 정보를 조회합니다.
4.  **Generation (Mock)**: 프롬프트(와 아웃라인)를 기반으로 Mock 렌더링 이미지를 생성합니다 (현재 MVP 단계).
5.  **Upload**: 생성된 이미지를 S3(MinIO)에 업로드합니다.
6.  **Persistence**: `generated_images` 테이블에 메타데이터(프롬프트, 타입=rendered)와 URL을 저장합니다.

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


## 10. 비동기 작업 상태 (Polling)

비동기 작업(이미지 생성 등)의 상태 확인을 위한 Polling 엔드포인트입니다.

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
