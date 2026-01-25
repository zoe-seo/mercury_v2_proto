# REQ-006: Projects Management (프로젝트 관리)

## 1. User Story

- **디자이너**로서,
- **Projects 페이지**에서 내가 작업 중인 모든 **Canvas**와 **Chat**을 한눈에 보고,
- 선택적으로 **Project**(컬렉션)로 그룹화하여 체계적으로 관리하고 싶다.

---

## 2. 핵심 개념 정의

### 2.1 Canvas (캔버스)
- **정의**: Sketch-to-Design 작업 공간
- **엔드포인트**: `/canvas/instances/{canvas_id}`
- **특징**:
  - 무한 캔버스에서 드로잉, 이미지 업로드, AI 생성
  - 레이어 기반 편집
  - 자동 저장
- **독립 존재 가능**: ✅ Yes (Standalone Canvas)

### 2.2 Chat (채팅 세션)
- **정의**: Text-to-Design 대화형 작업 공간
- **엔드포인트**: `/chat/sessions/{session_id}`
- **특징**:
  - 텍스트 프롬프트로 디자인 생성
  - 대화 히스토리 관리
  - 아웃라인 생성, 디자인 패키지 생성
- **독립 존재 가능**: ✅ Yes (Standalone Chat)

### 2.3 Project (프로젝트)
- **정의**: Canvas와 Chat을 묶는 **컬렉션/폴더**
- **엔드포인트**: `/projects/{project_id}`
- **특징**:
  - 여러 Canvas와 Chat을 그룹화
  - 예시: "2026 Spring Collection", "Summer Sneakers"
  - 메타데이터: 이름, 설명, 생성일
- **필수 여부**: ❌ Optional (Canvas/Chat은 Project 없이도 존재 가능)

---

## 3. 관계도

```
┌─────────────────────────────────────────────────────────┐
│                        User                              │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Project    │    │   Canvas     │    │    Chat      │
│ (Optional)   │    │ (Standalone) │    │ (Standalone) │
└──────────────┘    └──────────────┘    └──────────────┘
        │
        ├─── Canvas 1 (project_id: "proj-1")
        ├─── Canvas 2 (project_id: "proj-1")
        ├─── Chat 1 (project_id: "proj-1")
        └─── Chat 2 (project_id: "proj-1")
```

### 데이터 구조 예시:

```json
// Canvas (Standalone)
{
  "id": "canvas-abc-123",
  "name": "My Sneaker Design",
  "project_id": null,  // ← Project에 속하지 않음
  "canvas_state": { ... }
}

// Canvas (Project에 속함)
{
  "id": "canvas-def-456",
  "name": "Spring Runner",
  "project_id": "proj-uuid-1",  // ← "2026 Spring Collection"에 속함
  "canvas_state": { ... }
}

// Project
{
  "id": "proj-uuid-1",
  "name": "2026 Spring Collection",
  "description": "봄 시즌 신발 컬렉션",
  "design_count": 5  // Canvas + Chat 개수
}
```

---

## 4. Projects 페이지 UI 구상

### 4.1 레이아웃 구조

```
┌─────────────────────────────────────────────────────────┐
│  Header (Top Nav: Project 활성화)                       │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│  Side    │  Main Content Area                           │
│  Nav     │  (선택된 메뉴에 따라 변경)                     │
│          │                                              │
│  Recent  │  ┌────────────────────────────────────────┐ │
│  Designs │  │                                        │ │
│          │  │  Content based on selected menu        │ │
│  My      │  │                                        │ │
│  Canvases│  │                                        │ │
│          │  │                                        │ │
│  My      │  └────────────────────────────────────────┘ │
│  Chats   │                                              │
│          │                                              │
│  My      │                                              │
│  Projects│                                              │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

**참고**: [layout-template.md](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/design/layout-template.md) 섹션 3.3에 정의된 Side Navigation 구조를 따릅니다.

---

### 4.2 Side Navigation 메뉴

```
📁 Project
  ⭐ Recent Designs
  🎨 My Canvases
  💬 My Chats
  📂 My Projects
```

**특징**:
- 현재 선택된 메뉴: 배경색 + 왼쪽 보더 하이라이트
- 아이콘 + 텍스트 조합
- 호버 시 배경색 변경

---

### 4.3 메뉴별 상세 UI

#### 4.3.1 Recent Designs (기본 선택)

**목적**: 최근 작업한 Canvas와 Chat을 시간순으로 표시

**레이아웃**:
```
┌────────────────────────────────────────────────────────┐
│  Recent Designs                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │  [Filter: All | Canvas | Chat]                   │ │
│  │  [Sort: Recent | Name | Created]                 │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│  │Canvas│ │ Chat │ │Canvas│ │ Chat │  ...           │
│  │  #1  │ │  #1  │ │  #2  │ │  #2  │                │
│  │ 2h   │ │ 5h   │ │ 1d   │ │ 2d   │                │
│  └──────┘ └──────┘ └──────┘ └──────┘                │
│                                                        │
│  [Load More...]                                        │
└────────────────────────────────────────────────────────┘
```

**카드 구성**:
- **썸네일**: Canvas는 캔버스 스냅샷, Chat은 대표 이미지
- **타입 배지**: "Canvas" 또는 "Chat" (색상 구분)
- **이름**: 1줄, 말줄임
- **시간**: 상대 시간 (예: "2 hours ago")
- **Project 태그**: 속한 Project가 있으면 표시 (예: "📁 Spring Collection")

**기능**:
- **필터링**: All / Canvas Only / Chat Only
- **정렬**: Recent / Name / Created Date
- **클릭**: 해당 Canvas/Chat으로 이동
- **호버**: 삭제, 이름 변경, Project 추가/제거 버튼 표시

---

#### 4.3.2 My Canvases

**목적**: 모든 Canvas 인스턴스를 그리드로 표시

**레이아웃**:
```
┌────────────────────────────────────────────────────────┐
│  My Canvases                                           │
│  ┌──────────────────────────────────────────────────┐ │
│  │  🔍 Search canvases...                           │ │
│  │  [Sort: Recent | Name | Project]                 │ │
│  │  [+ New Canvas]                                  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│  │Canvas│ │Canvas│ │Canvas│ │Canvas│  ...           │
│  │  #1  │ │  #2  │ │  #3  │ │  #4  │                │
│  │📁 P1 │ │ None │ │📁 P2 │ │ None │                │
│  └──────┘ └──────┘ └──────┘ └──────┘                │
│                                                        │
│  [Load More...]                                        │
└────────────────────────────────────────────────────────┘
```

**카드 구성**:
- **썸네일**: 캔버스 스냅샷 (16:9 비율)
- **이름**: Canvas 이름
- **Project 태그**: 속한 Project 표시 또는 "Standalone"
- **마지막 수정 시간**

**기능**:
- **검색**: Canvas 이름으로 검색
- **정렬**: Recent / Name / Project
- **New Canvas 버튼**: CreateCanvasModal 열기
- **카드 액션**: 
  - 클릭 → Canvas 열기
  - 우클릭 메뉴: 이름 변경, 삭제, Project 추가/제거, 복제

---

#### 4.3.3 My Chats

**목적**: 모든 Chat 세션을 리스트로 표시

**레이아웃**:
```
┌────────────────────────────────────────────────────────┐
│  My Chats                                              │
│  ┌──────────────────────────────────────────────────┐ │
│  │  🔍 Search chats...                              │ │
│  │  [Sort: Recent | Name | Project]                 │ │
│  │  [+ New Chat]                                    │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌────────────────────────────────────────────────┐  │
│  │ 💬 Minimalist Sneaker Design                   │  │
│  │    "Create a minimalist white sneaker..."      │  │
│  │    📁 Spring Collection | 2 hours ago          │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │ 💬 Urban Runner                                │  │
│  │    "Design an urban running shoe with..."      │  │
│  │    Standalone | 1 day ago                      │  │
│  └────────────────────────────────────────────────┘  │
│                                                        │
│  [Load More...]                                        │
└────────────────────────────────────────────────────────┘
```

**리스트 아이템 구성**:
- **제목**: Chat 세션 제목
- **미리보기**: 첫 메시지 또는 마지막 메시지 (1줄, 말줄임)
- **Project 태그**: 속한 Project 표시 또는 "Standalone"
- **시간**: 상대 시간

**기능**:
- **검색**: Chat 제목/내용으로 검색
- **정렬**: Recent / Name / Project
- **New Chat 버튼**: `/chat/new`로 이동
- **리스트 액션**:
  - 클릭 → Chat 열기
  - 우클릭 메뉴: 이름 변경, 삭제, Project 추가/제거, 아카이브

---

#### 4.3.4 My Projects

**목적**: Project 컬렉션을 관리하고 포함된 Canvas/Chat 확인

**레이아웃**:
```
┌────────────────────────────────────────────────────────┐
│  My Projects                                           │
│  ┌──────────────────────────────────────────────────┐ │
│  │  🔍 Search projects...                           │ │
│  │  [+ New Project]                                 │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌─────────────────────────────────────────────────┐ │
│  │ 📁 2026 Spring Collection (5 designs) ▼         │ │
│  │    ┌──────┐ ┌──────┐ ┌──────┐                  │ │
│  │    │Canvas│ │Canvas│ │ Chat │                  │ │
│  │    │  #1  │ │  #2  │ │  #1  │                  │ │
│  │    └──────┘ └──────┘ └──────┘                  │ │
│  │    [+ Add Design]                               │ │
│  └─────────────────────────────────────────────────┘ │
│                                                        │
│  ┌─────────────────────────────────────────────────┐ │
│  │ 📁 Summer Collection (3 designs) ▶              │ │
│  └─────────────────────────────────────────────────┘ │
│                                                        │
│  ┌─────────────────────────────────────────────────┐ │
│  │ 📁 Experimental Designs (2 designs) ▶           │ │
│  └─────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

**Project 카드 구성**:
- **헤더**:
  - 📁 아이콘 + Project 이름
  - 디자인 개수 (Canvas + Chat)
  - 확장/축소 토글 (▼/▶)
- **확장 시**:
  - 포함된 Canvas/Chat 썸네일 그리드
  - "+ Add Design" 버튼 (드롭다운: 기존 Canvas/Chat 선택 또는 새로 생성)
- **우클릭 메뉴**: 이름 변경, 설명 수정, 삭제

**기능**:
- **검색**: Project 이름으로 검색
- **New Project 버튼**: 모달로 Project 생성 (이름, 설명 입력)
- **확장/축소**: 클릭으로 토글
- **Add Design**: 
  - 기존 Standalone Canvas/Chat을 Project에 추가
  - 또는 새 Canvas/Chat 생성 (자동으로 Project에 포함)
- **Design 제거**: 포함된 Canvas/Chat 우클릭 → "Remove from Project"

---

### 4.4 공통 인터랙션

#### Canvas/Chat을 Project에 추가
```
방법 1: Recent Designs 또는 My Canvases/Chats에서
1. Canvas/Chat 카드 우클릭
2. "Add to Project" 메뉴 선택
3. Project 선택 드롭다운
4. API: PUT /canvas/instances/{canvas_id} { "project_id": "proj-uuid-1" }

방법 2: My Projects에서
1. Project 확장
2. "+ Add Design" 버튼 클릭
3. 기존 Canvas/Chat 선택 또는 새로 생성
```

#### Project에서 Canvas/Chat 제거
```
1. My Projects에서 Project 확장
2. Canvas/Chat 카드 우클릭
3. "Remove from Project" 선택
4. API: PUT /canvas/instances/{canvas_id} { "project_id": null }
```

#### 삭제 확인
- Canvas/Chat/Project 삭제 시 확인 모달 표시
- "Are you sure?" + 이름 표시
- 삭제 불가능한 경우 (예: Project에 디자인 포함) 경고 메시지


---

## 5. API 엔드포인트 정리

### 5.1 Canvas API (네임스페이스 방식)
- **현재**: `/canvas/instances/{canvas_id}` ✅ 명확함
- **설명**: Canvas 인스턴스를 명확히 표현

### 5.2 Chat API (네임스페이스 방식)
- **현재**: `/chat/sessions/{session_id}` ✅ 명확함
- **설명**: Chat 세션을 명확히 표현

### 5.3 Project API (유지)
- **현재**: `/projects/{project_id}` ✅ 명확함

### 5.4 일관성
```
/projects                    → Project 컬렉션
/chat/sessions/{session_id}  → Chat 인스턴스
/canvas/instances/{canvas_id} → Canvas 인스턴스
```

**장점**:
- `/projects`와 명확히 구분됨
- 네임스페이스로 의미 명확화
- DB 테이블명과 유사 (향후 `canvas_instances`로 변경 권장)

### 5.5 통합 조회 API (신규 필요)
```
GET /designs
  → Canvas + Chat 통합 조회
  → Query Params: type=canvas|chat, project_id=xxx
```


---

## 6. Acceptance Criteria

- [ ] Projects 페이지에서 모든 Canvas와 Chat을 통합 조회할 수 있어야 한다
- [ ] Canvas와 Chat을 필터링/정렬할 수 있어야 한다
- [ ] Project 목록을 조회하고 확장/축소할 수 있어야 한다
- [ ] 새 Project를 생성할 수 있어야 한다
- [ ] Canvas/Chat을 Project에 추가/제거할 수 있어야 한다
- [ ] Standalone Canvas/Chat도 정상적으로 표시되어야 한다
- [ ] Canvas 카드 클릭 시 `/canvas/{canvas_id}`로 이동
- [ ] Chat 카드 클릭 시 `/chat/{chat_id}`로 이동

---

## 7. Open Questions

1. **통합 조회 API**: `/designs` 엔드포인트를 새로 만들 것인가, 아니면 프론트엔드에서 Canvas와 Chat을 각각 조회하여 병합할 것인가?
2. **Project 자동 생성**: 첫 Canvas/Chat 생성 시 자동으로 "Untitled Project"를 만들 것인가?
3. **Project 삭제**: Project 삭제 시 포함된 Canvas/Chat은 어떻게 처리할 것인가? (Standalone으로 전환 vs 함께 삭제)

---

## 8. 구현 우선순위

1. **Phase 1**: API 엔드포인트 정리 (네임스페이스 방식 적용 완료)
   - `/canvas/instances/{canvas_id}` ✅
   - `/chat/sessions/{session_id}` ✅
2. **Phase 2**: Projects 페이지 - All Designs 섹션 구현
3. **Phase 3**: Projects 페이지 - My Projects 섹션 구현
4. **Phase 4**: Project 관리 기능 (생성, 수정, 삭제, Canvas/Chat 추가/제거)
