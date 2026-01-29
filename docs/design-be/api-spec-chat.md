# API Specification - Chat Interface

## 1. 개요
Text-to-Design(Guided Chat) 기능을 위한 RESTful API 명세입니다.
실시간성을 위해 **Server-Sent Events (SSE)**를 사용합니다.

**Base URL**: `/api/v1/chats`

---

## 2. Session Management

### 2.1 Create Session (Start Chat) `[READY]`
새로운 디자인 세션을 시작합니다.

**POST** `/`

**Request Body**:
```json
{
  "initial_message": "빨간색 러닝화 만들어줘" // Optional. Step 0 입력값
}
```

**Response** (201):
```json
{
  "data": {
    "session_id": "sess_001",
    "title": "Red Running Shoes",
    "created_at": "2026-01-26T10:00:00Z"
  }
}
```

### 2.2 List Sessions `[READY]`
과거 디자인 세션 목록을 조회합니다.

**GET** `/`

**Query Parameters**:
- `page`: 1
- `page_size`: 20

**Response** (200):
```json
{
  "data": {
    "items": [
      {
        "id": "sess_001",
        "title": "Red Running Shoes",
        "last_message": "아웃라인 선택 완료",
        "updated_at": "2026-01-26T10:05:00Z",
        "thumbnail_url": "https://..." // 최종 생성 이미지 혹은 대표 이미지
      }
    ],
    "pagination": { "total": 1, "page": 1, "page_size": 20 }
  }
}
```

### 2.3 Get Session History `[READY]`
특정 세션의 대화 내용을 불러옵니다. 마지막 상태의 위젯 데이터도 포함됩니다.

**GET** `/{session_id}`

**Response** (200):
```json
{
  "data": {
    "session_id": "sess_001",
    "messages": [
      {
        "id": "msg_001",
        "role": "assistant",
        "content": "어떤 신발을 만들고 싶으신가요?",
        "widget": null
      },
      {
        "id": "msg_002",
        "role": "user",
        "content": "빨간색 러닝화"
      },
      {
        "id": "msg_003",
        "role": "assistant",
        "content": "러닝화를 선택하셨군요. 아웃라인을 골라주세요.",
        "widget": {
          "type": "selection_card",
          "data": {
             "options": [ ... ]
          }
        }
      }
    ],
    "current_step": "outline"
  }
}
```

---

## 3. Message Stream (Interaction)

### 3.1 Send Message & Stream Response (SSE) `[READY]`
사용자의 입력을 전송하고, AI의 응답을 스트리밍으로 수신합니다.

**POST** `/{session_id}/message`

**Headers**:
- `Accept: text/event-stream`

**Request Body**:
```json
{
  "type": "selection", // text | selection
  "content": {
    "field": "outline_id",
    "value": "out_001"
  }
}
```

**SSE Events**:

#### 1. `event: user_message`
서버가 접수한 사용자의 메시지 (Echo). UI에 즉시 표시.
```json
{
  "id": "msg_004",
  "role": "user",
  "content": "Sleek Runner 선택"
}
```

#### 2. `event: text_delta`
AI 응답 텍스트 스트리밍 (반복 전송).
```json
{
  "delta": "좋습니다."
}
```
```json
{
  "delta": " 이제"
}
```

#### 3. `event: widget`
AI 응답에 포함된 위젯 데이터 (보통 텍스트 완료 후 전송).
```json
{
  "widget": {
    "type": "selection_card",
    "data": {
      "options": [
        {"id": "sole_01", "label": "Chunky", "image_url": "..."}
      ]
    }
  }
}
```

#### 4. `event: design_state`
백엔드 상태 업데이트 (Sync).
```json
{
  "state": {
    "outline_id": "out_001",
    "sole_id": null
  }
}
```

#### 5. `event: done`
스트리밍 완료 신호.
```json
{
  "message_id": "msg_005"
}
```

### 3.2 Widget Types Definition
(Existing definitions remain same)
#### A. `selection_card`
#### B. `chip_group`
#### C. `color_picker`
#### D. `generation_result`
