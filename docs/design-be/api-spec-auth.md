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

### 3.1 회원가입 `[DONE]`

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

### 3.2 로그인 `[DONE]`

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

### 3.3 로그아웃 `[DONE]`

**POST** `/auth/logout`

**Headers**: `Authorization: Bearer {token}`

**Response** (204): No Content

---

### 3.4 사용자 프로필 조회 `[DONE]`

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

### 3.5 비밀번호 변경 `[DONE]`

**PUT** `/auth/password`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "current_password": "oldPassword123!",
  "new_password": "newPassword456!",
  "confirm_password": "newPassword456!"
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

## 7. 사용자 (Users)

### 7.1 현재 사용자 프로필 조회 `[DONE]`

**GET** `/users/me`

Retrieves the profile information of the currently authenticated user.

**Headers**: `Authorization: Bearer {token}`

**Response** (200):
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Hong Gil Dong", 
    "nickname": "GilDong123",
    "job_title": "Product Designer",
    "bio": "Designing experiences that matter.",
    "avatar_url": "https://example.com/avatars/user1.jpg",
    "stats": {
      "projects_count": 12
    },
    "preferences": {
        "shoe_size_system": "US", // "US", "UK", "EU", "MM"
        "gender_category": "mens", // "mens", "womens", "unisex", "kids"
        "style_tags": ["minimalist", "futuristic"]
    },
    "notification_settings": {
        "email_creation_finished": true,
        "email_weekly_report": false,
        "app_browser_notification": true
    }
  }
}
```

### 7.2 사용자 프로필 수정 (기본 정보) `[DONE]`

**PUT** `/users/me`

Updates general profile info.

**Headers**: `Authorization: Bearer {token}`

**Request Body**
```json
{
  "nickname": "NewNickname",
  "job_title": "Senior Product Designer",
  "bio": "Updated bio..."
}
```

**Response** (200):
```json
{
  "data": {
    "message": "Profile updated successfully"
  }
}
```

### 7.3 사용자 설정 수정 (Preferences) `[DONE]`

**PUT** `/users/me/preferences`

Updates designer preferences.

**Headers**: `Authorization: Bearer {token}`

**Request Body**
```json
{
  "shoe_size_system": "EU",
  "gender_category": "unisex",
  "style_tags": ["retro", "streetwear"]
}
```

**Response** (200):
```json
{
  "data": {
    "message": "Preferences updated successfully"
  }
}
```

### 7.4 알림 설정 수정 `[DONE]`

**PUT** `/users/me/notifications`

Updates notification settings.

**Headers**: `Authorization: Bearer {token}`

**Request Body**
```json
{
  "email_creation_finished": false,
  "email_weekly_report": true,
  "app_browser_notification": false
}
```

**Response** (200):
```json
{
  "data": {
    "message": "Notification settings updated successfully"
  }
}
```

### 7.5 아바타 업로드 `[DONE]`

**POST** `/users/me/avatar`

Uploads a new avatar image.

**Headers**: `Authorization: Bearer {token}`

**Request (Multipart/form-data)**
- `file`: Binary image data

**Response** (200):
```json
{
  "data": {
    "avatar_url": "https://example.com/avatars/new-avatar.jpg"
  }
}
```

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

