# Mercury - Canvas Interface UI Specification

[기존 내용은 그대로 유지...]

---

## 7. 새로운 컴포넌트 (New Components)

### 7.1 CreateCanvasModal (캔버스 생성 모달)

**트리거**: Home 페이지에서 "Sketch to Design" 버튼 클릭

**위치**: 화면 중앙 모달 (Overlay)

**크기**: 500px (width) × Auto (height)

**구성**:

#### Tab 1: New Canvas (기본 활성)
- **Canvas Name Input**:
  - Placeholder: "Untitled Canvas"
  - Auto-focus on modal open
  - Max length: 100자
  
- **Project Select** (Optional):
  - Dropdown 형태
  - 옵션:
    - "None (Standalone)" (기본값)
    - 사용자의 프로젝트 목록 (API에서 로드)
  - 프로젝트 없을 경우 "No projects yet" 표시

- **Create & Start Button**:
  - Primary 버튼
  - 클릭 시:
    1. API 호출: `POST /canvas/projects`
    2. 응답 받은 `canvas_id`로 `/canvas/{canvas_id}` 리다이렉트
  - Loading state: "Creating..." + Spinner

#### Tab 2: Recent Canvases
- **Recent Canvas List**:
  - 최근 5개 캔버스 표시
  - 각 항목:
    - 캔버스 이름
    - 마지막 수정 시간 (relative time: "2 hours ago")
    - 썸네일 (있는 경우, 40×40px)
  - 클릭 시 해당 캔버스로 이동

- **View All Canvases Link**:
  - `/canvas` 페이지로 이동
  - 텍스트: "View all canvases →"

**스타일**:
- Background: White
- Border Radius: 16px
- Shadow: `shadow-2xl`
- Backdrop: `bg-black/50` (blur)

**애니메이션**:
- Enter: Fade in + Scale up (0.95 → 1.0)
- Exit: Fade out + Scale down

---

### 7.2 CanvasListPage (캔버스 목록 페이지)

**URL**: `/canvas`

**레이아웃**: Standard Layout (Header + Main Content)

**구성**:

#### Page Header
- **Title**: "My Canvases" (H1)
- **Create Button**:
  - Primary 버튼
  - 텍스트: "+ New Canvas"
  - 클릭 시 CreateCanvasModal 열기

#### Filter Bar
- **Search Input**:
  - Placeholder: "Search canvases..."
  - Icon: Search (Lucide)
  - Debounce: 300ms

- **Project Filter**:
  - Dropdown
  - 옵션:
    - "All Projects"
    - 사용자의 프로젝트 목록
    - "Standalone Canvases"

#### Canvas Grid
- **레이아웃**: Grid (3 columns on desktop, 2 on tablet, 1 on mobile)
- **Gap**: 24px

**Canvas Card**:
- **Thumbnail**:
  - Aspect ratio: 16:9
  - Background: Gray-100
  - 썸네일 없을 경우: Placeholder icon (Canvas icon)
  
- **Info Section**:
  - **Canvas Name**: 
    - Font: 16px, Semi-bold
    - Truncate: 1 line
  - **Last Modified**:
    - Font: 12px, Gray-500
    - Format: "Updated 2 hours ago"
  - **Project Badge** (있는 경우):
    - Small badge
    - Background: Primary-50
    - Text: Primary-700

- **Actions** (Hover 시 표시):
  - **Open Button**: 기본 클릭 액션
  - **Delete Button**:
    - Icon: Trash
    - 클릭 시 확인 모달 표시
    - 모달 내용: "Are you sure you want to delete '{canvas_name}'?"
  - **Duplicate Button** (Optional):
    - Icon: Copy
    - 클릭 시 복제 후 새 캔버스로 이동

**Empty State**:
- Icon: Canvas (large, Gray-300)
- Text: "No canvases yet"
- Subtext: "Create your first canvas to get started"
- CTA Button: "Create Canvas"

---

### 7.3 Canvas Name Editor (TopToolbar 내)

**위치**: TopToolbar 좌측 (도구 그룹 앞)

**기본 상태**:
- 캔버스 이름 표시
- Font: 14px, Medium
- Color: Gray-700
- Max width: 200px
- Truncate: 1 line with ellipsis

**편집 모드**:
- **트리거**: 이름 클릭
- **UI 변화**:
  - Input field로 전환
  - Border: Primary-500
  - Auto-select all text
  - Auto-focus

- **저장**:
  - Enter 키 또는 Blur 시 자동 저장
  - API 호출: `PUT /canvas/projects/{canvas_id}`
  - Loading state: 없음 (Optimistic update)

- **취소**:
  - ESC 키로 취소
  - 원래 이름으로 복원

**Validation**:
- 빈 이름 불가 (최소 1자)
- 최대 100자
- 에러 시 Input border를 Red로 변경

---

## 8. 업데이트된 흐름 (Updated Flows)

### 8.1 새 캔버스 생성 흐름

```
1. Home 페이지
   ↓
2. "Sketch to Design" 버튼 클릭
   ↓
3. CreateCanvasModal 열림
   ↓
4a. [New Canvas Tab]
    - 이름 입력
    - 프로젝트 선택 (Optional)
    - "Create & Start" 클릭
    ↓
    API: POST /canvas/projects
    ↓
    /canvas/{canvas_id}로 리다이렉트
    
4b. [Recent Canvases Tab]
    - 최근 캔버스 선택
    ↓
    /canvas/{canvas_id}로 리다이렉트
```

### 8.2 캔버스 목록 조회 흐름

```
1. Header의 "Sketch to Design" 탭 클릭
   또는 직접 /canvas 접속
   ↓
2. CanvasListPage 표시
   ↓
3a. 캔버스 카드 클릭 → /canvas/{canvas_id}
3b. "+ New Canvas" 클릭 → CreateCanvasModal
3c. Search/Filter 사용 → 목록 필터링
```

### 8.3 자동 저장 흐름

```
1. 캔버스 편집 (드로잉, 객체 추가 등)
   ↓
2. 2초 Debounce 타이머 시작
   ↓
3. 타이머 완료 시:
   - UI: "Saving..." 표시
   - API: PUT /canvas/projects/{canvas_id}
   ↓
4. 성공 시:
   - UI: "Saved" 표시 (체크 아이콘)
   - 히스토리에 상태 저장
   ↓
5. 실패 시:
   - UI: "Error" 표시 (경고 아이콘)
   - 재시도 버튼 표시
```

---

본 UI 스펙은 **Fabric.js** 라이브러리의 표준 기능을 기준으로 작성되었습니다.
