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

## 4. 프로젝트 (Projects)

### 4.1 프로젝트 목록 조회 `[DONE]`

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

### 4.2 프로젝트 생성 `[DONE]`

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

### 4.3 프로젝트 상세 조회 `[DONE]`

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

### 4.4 프로젝트 수정 `[DONE]`

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

### 4.5 프로젝트 삭제 `[DONE]`

**DELETE** `/projects/{project_id}`

**Headers**: `Authorization: Bearer {token}`

**Response** (204): No Content

---
