# REQ-003: Sketch to Design (Canvas Interface)

**Status**: 🔄 In Review  
**Last Updated**: 2026-01-25  
**Version**: 2.0

---

## 1. User Story

**전문 디자이너**로서,
- **AI 기반 캔버스**에서 스케치와 이미지를 자유롭게 조합하여 신발 디자인을 생성하고,
- **스마트 세그멘테이션**을 통해 특정 파트만 선택적으로 수정하며,
- **Inpainting**으로 디테일을 정교하게 다듬고,
- 생성된 이미지의 **계보(Lineage)**를 시각적으로 추적하여,
- 최종적으로 **Design Package**를 생성하고 싶다.

---

## 2. 핵심 개념

### 2.1 서비스 특성
Mercury의 Sketch to Design은 **AI 이미지 생성에 특화된 캔버스**입니다. Figma와 같은 범용 디자인 툴이 아니라, 신발 디자인 생성 워크플로우를 위한 전문 도구입니다.

### 2.2 캔버스 구조
- **무한 캔버스**: 사용자가 자유롭게 노드를 배치
- **노드 기반**: 모든 작업은 노드(Layer) 단위로 관리
- **하나의 캔버스 = 하나의 디자인 작업**
- **최대 20개 노드 제한** (성능 및 UX 고려)

### 2.3 노드 타입 (3가지)

| 노드 타입 | 설명 | 크기 | AI Prompt 가능 |
|-----------|------|------|----------------|
| `sketch` | 사용자가 브러시로 그린 스케치 | 768x768px 고정 | ✅ |
| `image` | 업로드/AI 생성/Chat 가져오기 이미지 | 768x768px 고정 | ✅ |
| `text` | 캔버스 메모 | 가변 | ❌ (참조만 가능) |

**중요**: `generated` 타입은 별도로 두지 않음. 모든 이미지는 `image` 타입이며, `layer_data.source`로 구분:
- `upload`: 사용자 업로드
- `ai_generated`: AI 생성
- `chat_import`: Chat 세션에서 가져온 이미지

---

## 3. 상세 워크플로우

### 3.1 캔버스 생성 및 관리

#### 3.1.1 새 캔버스 생성
1. Home 페이지 → "Sketch to Design" 버튼 클릭
2. 캔버스 생성 모달 표시:
   - **New Canvas 탭**:
     - Canvas Name 입력 (기본값: "Untitled Canvas")
     - Project 선택 (Optional): "None (Standalone)" 또는 기존 프로젝트
     - "Create & Start" 버튼
   - **Recent Canvases 탭**:
     - 최근 작업한 캔버스 5개 표시
     - "View All Canvases" 링크
3. API 호출: `POST /canvas/instances`
4. 리다이렉트: `/canvas/{canvas_id}`

#### 3.1.2 캔버스 목록 페이지 (`/canvas`)
- 그리드 형태 카드 표시
- 카드 정보: 썸네일, 이름, 수정 시간, 프로젝트명
- 액션: 열기, 삭제, 복제
- 필터링/검색 기능

#### 3.1.3 자동 저장
- 편집 후 **2초 Debounce**로 자동 저장
- 저장 상태: "Saving..." → "✓ Saved"
- 저장 범위: `canvas_state` (뷰포트 정보)

---

### 3.2 노드 생성 및 조작

#### 3.2.1 Sketch 노드 생성
```
사용자: Toolbar에서 "Add Sketch Node" 버튼 클릭
  ↓
Frontend: 768x768px 빈 스케치 프레임 생성 (캔버스 중앙)
  ↓
사용자: Brush 도구로 스케치 그리기
  ↓
Backend: layer_type: "sketch", layer_data: { paths: [...] }
```

#### 3.2.2 Image 노드 생성 (업로드)
```
사용자: "Upload Image" 버튼 클릭 → 파일 선택
  ↓
Frontend: 
  - 파일 검증 (최대 10MB, 2048px)
  - 필요 시 클라이언트 리사이징
  ↓
Backend: 
  - POST /upload/image
  - S3 업로드 → URL 반환
  ↓
Frontend: 
  - 768x768px 이미지 노드 생성
  - layer_data: { image_url, source: "upload" }
```

#### 3.2.3 Text 노드 생성 (메모)
```
사용자: "Add Text" 버튼 클릭
  ↓
Frontend: 텍스트 입력 가능한 노드 생성
  ↓
용도: 캔버스에 메모, 디자인 의도 기록
```

---

### 3.3 AI 이미지 생성 워크플로우

#### 3.3.1 Sketch → Image 생성
```
사용자:
  1. Sketch 노드 선택
  2. AI Prompt Panel 자동 활성화
  3. (선택사항) "Add Reference" 버튼 클릭 → 다른 노드 선택
  4. 프롬프트 입력: "고급스러운 가죽 소재, 브라운 컬러"
  5. "Generate" 버튼 클릭
  ↓
Frontend:
  - POST /canvas/instances/{canvas_id}/generate
  - Request: { layer_ids: [sketch_id, ref_id], prompt, params }
  ↓
Backend (Celery):
  - 선택된 레이어들을 병합
  - AI API 호출 (Sketch-to-Image)
  - 결과 이미지 S3 업로드
  - 새 image 노드 생성:
    layer_data: {
      image_url,
      source: "ai_generated",
      parent_layer_id: sketch_id,
      prompt,
      generation_params
    }
  ↓
Frontend:
  - Polling (3초 간격)
  - 완료 시 스케치 노드 **오른쪽 50px 간격**에 새 이미지 배치
  - 연결선 표시 (sketch → image)
```

#### 3.3.2 Image Segmentation → Part-specific Prompting
```
사용자:
  1. Image 노드 선택
  2. AI Prompt Panel에서 "Segment Parts" 버튼 클릭
  ↓
Backend (Mock):
  - POST /canvas/instances/{canvas_id}/segment
  - SAM 모델 호출 (현재 Mock 데이터 반환)
  ↓
Frontend:
  - 세그멘테이션 결과를 **메모리에만 캐싱** (DB 저장 안 함)
  - Segments Panel에 파트 리스트 표시
  - 캔버스에 오버레이로 파트 경계 표시 (호버 시)
  ↓
사용자:
  1. Segments Panel에서 "Outsole" 클릭
  2. AI Prompt Panel에 "Selected: Outsole" 표시
  3. 프롬프트 입력: "Rugged trekking style"
  4. "Generate" 클릭
  ↓
Backend:
  - 원본 이미지 + 선택된 파트 마스크 → Inpainting API
  - 새 image 노드 생성 (parent_layer_id = 원본 이미지)
  ↓
Frontend:
  - 원본 이미지 **오른쪽 50px 간격**에 새 이미지 배치
  - 연결선 표시
```

**중요**: Segmentation으로 선택한 파트는 브러시로 추가 수정 불가 (단순화)

#### 3.3.3 Manual Inpainting (브러시 마스킹)
```
사용자:
  1. Image 노드 선택
  2. AI Prompt Panel에서 "Inpaint" 버튼 클릭
  ↓
Frontend:
  - Inpaint 모드 활성화
  - 커서를 Mask Brush로 변경
  - 임시 mask 레이어 생성 (반투명 빨간색)
  ↓
사용자:
  1. 수정할 영역을 브러시로 칠함
  2. Eraser로 마스크 다듬기
  3. 프롬프트 입력
  4. "Generate Fill" 클릭
  ↓
Backend:
  - 마스크 영역 → 래스터 이미지 변환
  - Inpainting API 호출
  - 새 image 노드 생성
  ↓
Frontend:
  - 원본 이미지 오른쪽에 배치
  - 임시 mask 레이어 삭제
```

#### 3.3.4 Chat에서 이미지 가져오기
```
사용자: Chat 페이지에서 이미지 우클릭 → "Add to Canvas"
  ↓
Frontend:
  - 캔버스 선택 모달 표시
  - 선택 후 이미지 URL + 메타데이터 전송
  ↓
Backend:
  - 새 image 노드 생성
  - layer_data: { source: "chat_import", chat_message_id }
  ↓
Frontend:
  - 캔버스 중앙에 이미지 노드 추가
```

---

### 3.4 이미지 계보(Lineage) 시각화

#### 3.4.1 연결선 표시
- **기본값**: 항상 표시
- **토글**: Toolbar에서 "Show Connections" 체크박스
- **시각화**: Parent 노드 → Child 노드 화살표 연결선
- **색상**: 연결선은 회색 점선, 선택 시 Primary 색상

#### 3.4.2 Layer Panel에서 트리 구조
```
📄 Sketch 1
  └─ 🖼️ Generated Image 1
      └─ 🖼️ Inpainted Image 1
📄 Sketch 2
  └─ 🖼️ Generated Image 2
```

---

### 3.5 Design Package Workshop

#### 3.5.1 진입
```
사용자: 이미지 노드 선택 → AI Prompt Panel에서 "✨ Create Package" 버튼
  ↓
Frontend: 중앙 모달 표시 (3-Step Wizard)
```

#### 3.5.2 워크샵 단계
1. **Step 1: 메타데이터 입력**
   - 디자인 제목, 설명, 브랜드 정보, 소재
   
2. **Step 2: 비동기 리소스 생성 (Mock)**
   - 6-view Shots (전/후/좌/우/상/하) - Progressive UI
   - Model Shot (착용 컷) - Shimmer 로딩
   - 3D Asset - Progress Bar
   - 각 리소스별 "Retry" 버튼 제공
   
3. **Step 3: 최종 확정**
   - "Confirm Package" 버튼 → Gallery로 전송
   - 완료 팝업: "Continue Editing" or "Go to Gallery"

**UX**: "백그라운드 생성" 옵션으로 모달 닫고 작업 계속 가능

---

## 4. 노드 데이터 구조

### 4.1 Sketch 노드
```json
{
  "layer_type": "sketch",
  "layer_data": {
    "paths": [
      { "d": "M 10 10 L 100 100", "stroke": "#000", "stroke-width": 2 }
    ],
    "fabric_json": { /* Fabric.js 직렬화 데이터 */ }
  },
  "z_index": 1,
  "is_visible": true,
  "opacity": 1.0
}
```

### 4.2 Image 노드
```json
{
  "layer_type": "image",
  "layer_data": {
    "image_url": "https://s3.../image.png",
    "source": "upload" | "ai_generated" | "chat_import",
    "x": 100,
    "y": 100,
    "width": 768,
    "height": 768,
    
    // AI 생성인 경우 추가 필드
    "parent_layer_id": "layer-uuid-1",
    "prompt": "고급스러운 가죽 소재",
    "generation_params": { "strength": 0.7, "steps": 50 },
    
    // Chat 가져오기인 경우
    "chat_message_id": "msg-uuid",
    
    "fabric_json": { /* Fabric.js Image Object */ }
  },
  "z_index": 2
}
```

### 4.3 Text 노드
```json
{
  "layer_type": "text",
  "layer_data": {
    "text": "디자인 메모",
    "x": 100,
    "y": 100,
    "font_size": 16,
    "fill": "#000000",
    "fabric_json": { /* Fabric.js IText Object */ }
  },
  "z_index": 3
}
```

---

## 5. 제약사항 및 정책

### 5.1 노드 제한
- **최대 노드 수**: 20개
- **제한 도달 시**: 경고 메시지 표시, 추가 생성 차단
- **경고 메시지**: "캔버스당 최대 20개 노드까지 생성할 수 있습니다. 기존 노드를 삭제 후 다시 시도해주세요."

### 5.2 이미지 제약
- **노드 크기**: 768x768px 고정
- **업로드 제한**: 최대 10MB, 2048px
- **생성 제한**: 한 번에 1개 이미지만 생성 가능

### 5.3 세그멘테이션
- **저장 방식**: DB에 저장하지 않음, 세션 메모리 캐싱
- **재실행**: 이미지 수정 시 자동으로 캐시 무효화
- **파트 선택**: 브러시 수정 불가 (단순화)

### 5.4 자동 저장
- **Debounce**: 2초
- **저장 범위**: `canvas_state` (뷰포트 정보만)
- **레이어 저장**: 개별 API 호출 (`PUT /layers/{layer_id}`)

---

## 6. UI 컴포넌트

### 6.1 Toolbar
- **Add Sketch Node**: 새 스케치 프레임 생성
- **Upload Image**: 이미지 파일 업로드
- **Add Text**: 메모 노드 생성
- **Select (V)**: 노드 선택/이동
- **Hand (H)**: 캔버스 패닝
- **Brush (B)**: 스케치 그리기 (Inpaint 모드에서 마스킹)
- **Eraser (E)**: 스케치/마스크 지우기
- **Undo/Redo**: 히스토리 관리
- **Show Connections**: 연결선 토글 (기본: ON)

### 6.2 AI Prompt Panel (Floating)
- **위치**: 선택된 노드 하단 중앙
- **표시 조건**: `sketch` 또는 `image` 노드 선택 시
- **기능**:
  - Prompt 입력
  - "Add Reference" 버튼 → 다른 노드 선택
  - "Generate" 버튼
  - "Segment Parts" 버튼 (image 노드만)
  - "Inpaint" 버튼
  - "✨ Create Package" 버튼

### 6.3 Segments Panel (Right Side)
- **표시 조건**: Segmentation 실행 후
- **기능**:
  - 파트 리스트 (Pill 형태)
  - 클릭 시 캔버스에 하이라이트
  - 선택 시 AI Prompt Panel 활성화

### 6.4 Layer Panel (Right Side)
- **기능**:
  - 레이어 목록 (트리 구조)
  - Visibility 토글
  - Lock 토글
  - Opacity 슬라이더
  - Drag & Drop으로 Z-index 변경

---

## 7. Acceptance Criteria

- [ ] 캔버스 생성 모달에서 이름과 프로젝트를 설정하여 새 캔버스 생성
- [ ] 무한 캔버스에서 노드를 자유롭게 배치 및 이동
- [ ] Sketch 노드 생성 및 브러시로 그리기 (768x768px)
- [ ] Image 노드 업로드 (최대 10MB, 자동 리사이징)
- [ ] Sketch + 프롬프트로 이미지 생성 (오른쪽 50px 간격 배치)
- [ ] 레퍼런스 노드 추가 기능 ("Add Reference")
- [ ] Image 노드에서 Segmentation 실행 (메모리 캐싱)
- [ ] Segmentation 파트 선택 → Inpainting
- [ ] Manual Brush Inpainting (마스크 레이어 생성)
- [ ] Chat에서 이미지 가져오기 ("Add to Canvas")
- [ ] 노드 간 연결선 시각화 (토글 가능)
- [ ] Layer Panel에서 트리 구조로 계보 표시
- [ ] 최대 20개 노드 제한 및 경고 메시지
- [ ] 한 번에 1개 이미지만 생성 가능
- [ ] Design Package Workshop 진입 및 Mock 흐름 구성
- [ ] 자동 저장 (2초 Debounce)

---

## 8. Open Questions / Risks

### 8.1 해결된 질문
- ✅ 노드 크기: 768x768px 고정
- ✅ 노드 타입: 3가지 (sketch, image, text)
- ✅ Segmentation 저장: 저장하지 않음 (메모리 캐싱)
- ✅ 노드 제한: 20개
- ✅ 동시 생성: 1개씩만

### 8.2 남은 위험 요소
- **성능**: 20개 노드 + 연결선 렌더링 성능
- **SAM 모델 연동**: Mock → 실제 구현 시 응답 시간
- **대용량 이미지**: 클라이언트 리사이징 품질 vs 속도
- **Undo/Redo**: 프론트엔드 메모리 관리 (새로고침 시 손실)

---

## 9. 다음 단계

1. **API 스펙 업데이트**: `api-spec-canvas.md`에 노드 데이터 구조 반영
2. **DB 스키마 검토**: `layer_data` JSONB 구조 확정
3. **Frontend Brief 작성**: UI 컴포넌트별 상세 인터랙션 명세
4. **사용자 승인**: 이 요구사항 문서 검토 및 승인