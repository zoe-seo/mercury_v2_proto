# Mercury V2 - Service Summary

## 1. 서비스 개요 (Service Overview)

**Mercury**는 신발 디자이너를 위한 **AI 기반 디자인 생성 및 관리 플랫폼**입니다. 디자이너가 텍스트 대화나 스케치를 통해 아이디어를 구체화하고, AI가 고품질 신발 디자인 이미지를 생성하며, 마케팅 리포트까지 포함된 완성된 디자인 패키지를 제공합니다.

### 핵심 가치 제안 (Value Proposition)
- **아이디어 → 디자인 자동화**: 막연한 아이디어를 AI와의 대화를 통해 구체적인 디자인으로 변환
- **전문 도구 제공**: Figma 스타일의 캔버스 에디터로 정교한 디테일 작업 지원
- **비즈니스 인사이트**: 디자인과 함께 시장 분석, 비용 추산, 트렌드 분석 제공
- **효율적인 관리**: 모든 디자인을 갤러리에서 관리하고 다양한 형식으로 내보내기

### 타겟 사용자 (Target Users)
- **Primary**: 신발 디자이너 (프리랜서, 스타트업, 중소 브랜드)
- **Secondary**: 패션 학생, 브랜드 기획자
- **MVP 범위**: 단일 사용자 (Single User) 환경 (팀 협업 기능은 추후 확장)

---

## 2. 핵심 기능 (Core Features)

### 2.1 인증 및 사용자 관리 (Authentication)
- **기능**: 이메일/비밀번호 기반 회원가입 및 로그인
- **범위**: 단일 사용자 환경 (MVP)
- **보안**: JWT Access Token (24시간 만료)
- **상세**: [req-001-auth.md](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/requirements/req-001-auth.md)

### 2.5 User Profile (사용자 프로필)
- **기능**: 사용자 정보 및 환경 설정 관리
- **범위**: 
  - 기본 정보 (이름, 바이오, 직책)
  - 프로필 이미지 (Avatar)
  - 환경 설정 (선호 신발 사이즈 단위 등)
- **상세**: [req-005-user-profile.md](file:///c:/Users/bytesize/Desktop/mercury_v2/docs/requirements/req-005-user-profile.md)

### 2.2 Text to Design (채팅 기반 디자인 생성)
- **기능**: AI 챗봇과의 대화를 통한 디자인 생성
- **워크플로우**:
  1. **Requirement Gathering**: AI가 브랜드 아이덴티티, 타겟 오디언스, 스타일 등을 질문하며 수집
  2. **Outline Selection**: AI가 여러 신발 이미지(아웃라인용)을 제안하고 사용자가 선택
  3. **Image Generation**: 선택된 아웃라인과 프롬프트로 고품질 렌더링 생성
  4. **Design Package**: 기본 정보 + 최종 디자인 + 마케팅 리포트 생성
- **특징**:
  - 스트리밍 응답 (SSE)
  - 세션 자동 저장 및 재개
  - 레퍼런스 이미지 업로드 지원
  - 생성 히스토리 관리
- **상세**: [req-002-text-to-design.md](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/requirements/req-002-text-to-design.md)

### 2.3 Sketch to Design (캔버스 기반 디자인 생성)
- **기능**: Figma 스타일의 무한 캔버스에서 스케치 및 이미지 편집
- **핵심 도구**:
  - **Canvas Editor**: 무한 캔버스, Zoom, Pan, 객체 조작
  - **Drawing Tools**: 브러시, 도형, 색상 피커
  - **AI Integration**: 스케치 → 렌더링 변환 (Sketch-to-Image)
  - **Inpainting**: 특정 영역만 마스킹하여 부분 수정
  - **Text Prompting**: 생성된 이미지에 프롬프팅하여 2차, 3차 이미지 생성
  - **Layering**: 레이어 관리 (원본 스케치 / 생성 이미지 분리)
- **특징**:
  - Undo/Redo (프론트엔드 메모리 관리)
  - 키보드 단축키 지원
  - 내보내기 지원 (이미지 포함된 디자인 패키지)
  - Floating AI Panel (선택 객체에 대한 텍스트 프롬프트)
- **상세**: [req-003-sketch-to-design.md](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/requirements/req-003-sketch-to-design.md)

### 2.4 Gallery & Export (갤러리 및 내보내기)
- **기능**: 생성된 모든 디자인을 관리하고 공유
- **Gallery View**:
  - 프로젝트 단위 그룹화
  - 썸네일 그리드 뷰
  - 최신순 / 프로젝트별 필터
  - 디자인 패키지 상세 정보 표시
- **Export Options**:
  - **이미지**: PNG, JPG (고해상도)
  - **Full Package**: PDF (마케팅 리포트 + 차트 포함)
  - **Web Share Link**: 읽기 전용 공유 링크 생성 (유효 기간 설정 가능)
- **상세**: [req-004-gallery-export.md](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/requirements/req-004-gallery-export.md)

---

## 3. 디자인 패키지 구조 (Design Package)

모든 디자인 생성 워크플로우의 최종 산출물은 **Design Package**입니다.

### 구성 요소
- **Meta Information**:
  - 생성 일시, 프롬프트, 키워드
  - 브랜드 정보 (브랜드명, 아이덴티티)
  - 색상 팔레트 (HEX 코드)
- **Images**:
  - Main Image (고해상도 메인 뷰)
  - Model Shot (착용 샷 또는 연출 샷)
  - Variations (생성된 다양한 버전)
- **Marketing Report** (LLM 기반 생성):
  - **시장 분석**: 타겟 시장, 경쟁사 분석
  - **비용 추산**: 예상 제작 비용, 가격 전략
  - **트렌드 분석**: 현재 트렌드와의 연관성
  - **Similar Products**: 유사 레퍼런스 제품
  - **시각화**: 차트 및 그래프로 데이터 표현

### 데이터 정확도
- MVP 단계에서는 **LLM의 지식 베이스 및 추론 능력**을 활용하여 리포트 생성
- 외부 실시간 데이터 연동은 추후 고도화 단계에서 고려

---

## 4. 사이트 맵 (Site Map)

```
Mercury V2
│
├── 🔐 Authentication
│   ├── /login
│   ├── /signup
│   └── /profile
│
├── 💬 Text to Design (Chat Interface)
│   ├── /chat/new
│   ├── /chat/:sessionId
│   └── /chat/:sessionId/package
│
├── 🎨 Sketch to Design (Canvas Interface)
│   ├── /canvas/new
│   ├── /canvas/:projectId
│   └── /canvas/:projectId/package
│
├── 🖼️ Gallery & Export
│   ├── /gallery (전체 디자인 목록)
│   ├── /gallery/projects (프로젝트별 뷰)
│   ├── /gallery/:designId (디자인 상세)
│   └── /share/:shareToken (공유 링크)
│
└── ⚙️ Settings
    └── /settings (사용자 설정, 비밀번호 변경)
```

---

## 5. 핵심 비즈니스 로직 요약

### 5.1 AI 이미지 생성 플로우
```
사용자 요청 (텍스트/스케치)
  ↓
FastAPI 엔드포인트
  ↓
Celery Task (비동기 작업)
  ↓
외부 AI API 호출 (Imagen, Stability AI 등)
  ↓
S3 업로드 (Pre-signed URL)
  ↓
DB 저장 (메타데이터 + S3 경로)
  ↓
SSE 알림 (클라이언트에게 완료 통지)
```

### 5.2 마케팅 리포트 생성 플로우 (LangGraph)
```
collect_requirements (디자인 메타데이터 수집)
  ↓
analyze_market (LLM으로 시장 분석)
  ↓
estimate_cost (LLM으로 비용 추산)
  ↓
generate_chart_data (시각화용 데이터 생성)
  ↓
finalize_report (최종 리포트 조합)
```

### 5.3 실시간 통신 (SSE)
- **채팅 스트리밍**: LLM 응답을 실시간으로 스트리밍
- **이미지 생성 상태**: 생성 진행률 업데이트 (queued → processing → completed)
- **에러 알림**: 생성 실패 시 즉시 알림

### 5.4 세션 관리
- **채팅 세션**: 자동 저장, 재개 가능, 사용자가 삭제하지 않는 한 영구 보존
- **캔버스 프로젝트**: 자동 저장, Undo/Redo는 프론트엔드 메모리에서만 관리 (새로고침 시 히스토리 손실)

---

## 6. 기술 스택 (Tech Stack)

### Backend
- **Framework**: Python 3.12, FastAPI
- **ORM**: SQLAlchemy
- **Database**: PostgreSQL
- **Task Queue**: Celery + Redis
- **File Storage**: AWS S3 (Pre-signed URL)
- **LLM Integration**: LiteLLM (다중 제공자 지원)
- **Workflow**: LangGraph (마케팅 리포트 생성)

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: TailwindCSS v4
- **Canvas Library**: Fabric.js / Konva.js (검토 중)
- **Real-time**: EventSource (SSE)

### Infrastructure
- **Web Server**: Nginx / Caddy (HTTP/2 활성화)
- **Authentication**: JWT (Access Token, 24시간 만료)
- **AI APIs**: Google Imagen, Stability AI, DALL-E 3 (동적 선택)

---

## 7. 아키텍처 원칙 (Architecture Principles)

### 7.1 비동기 우선 (Async First)
- 모든 시간 소요 작업(이미지 생성, 리포트 생성)은 Celery로 비동기 처리
- SSE를 통한 실시간 상태 업데이트

### 7.2 확장 가능한 설계 (Scalable Design)
- 외부 AI API 사용으로 GPU 인프라 부담 제거
- Worker 수평 확장 가능 (Celery)
- S3 무제한 스토리지

### 7.3 MVP 우선, 점진적 개선 (MVP First, Iterate)
- 초기 단계: 기능 동작 우선 (보안, 성능 최적화는 추후)
- 단일 사용자 환경 (팀 협업은 추후 확장)
- Access Token만 사용 (Refresh Token은 추후 도입)

### 7.4 유연한 모델 선택 (Flexible Model Selection)
- LiteLLM으로 다양한 LLM 제공자 지원
- 이미지 생성 모델 동적 선택 (요청 시 `model` 파라미터 지정)

---

## 8. 비기능 요구사항 (Non-Functional Requirements)

### 8.1 성능 (Performance)
- **이미지 생성**: 외부 API 응답 시간 의존 (일반적으로 10-60초)
- **채팅 응답**: 스트리밍으로 첫 토큰 1초 이내 응답
- **갤러리 로딩**: 썸네일 페이지네이션 (50개씩)

### 8.2 보안 (Security)
- **MVP**: 기본적인 JWT 인증, 비밀번호 해싱 (bcrypt)
- **추후**: Refresh Token, RBAC, 2FA

### 8.3 확장성 (Scalability)
- **수평 확장**: Celery Worker 추가로 처리량 증가
- **스토리지**: S3 무제한 확장
- **데이터베이스**: PostgreSQL 읽기 복제본 추가 가능

### 8.4 사용성 (Usability)
- **반응형 디자인**: 데스크톱 우선 (캔버스 작업 특성상)
- **키보드 단축키**: 캔버스 에디터에서 전문 사용자 지원
- **자동 저장**: 세션 및 프로젝트 자동 저장

---

## 9. 프로젝트 단계별 로드맵 (Roadmap)

### Phase 1: MVP (현재)
- [x] 인증 시스템 (REQ-001)
- [ ] Text to Design (REQ-002)
- [ ] Sketch to Design (REQ-003)
- [ ] Gallery & Export (REQ-004)

### Phase 2: 고도화
- [ ] Refresh Token 도입
- [ ] 이미지 생성 모델 추가 (더 많은 제공자)
- [ ] 외부 데이터 연동 (실시간 시장 데이터)
- [ ] Segmentation 모델 통합 (자동 마스킹)

### Phase 3: 협업 기능
- [ ] 다중 사용자 지원
- [ ] 팀 프로젝트 공유
- [ ] 댓글 및 피드백 시스템
- [ ] WebSocket 기반 실시간 협업

---

## 10. 문서 관리 규칙 (Documentation Rules)

### Single Source of Truth
- **기획 사항**: `docs/requirements/` (이 문서 포함)
- **API 명세**: `docs/design-be/`
- **UI/UX 디자인**: `docs/design-fe/`
- **전역 설계 및 디자인 시스템**: `docs/design/`
- **DB 스키마**: `docs/design-be/schema.md`
- **아키텍처 결정**: `docs/design/architecture-decisions.md`

### 문서 업데이트 정책
- 새로운 기능 추가 시 `docs/requirements/req-XXX-[feature-name].md` 생성
- 기존 기능 변경 시 해당 문서 업데이트 및 버전 기록
- 모든 문서는 Markdown 포맷 사용

### 승인 프로세스
- 요구사항 문서 작성 후 사용자 승인 필요
- 승인 시 문서 상단에 `status: approved` 명시
- 승인된 문서를 기반으로 Architect가 설계 시작

---

## 11. 참고 문서 (References)

- [REQ-001: Authentication](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/requirements/req-001-auth.md)
- [REQ-002: Text to Design](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/requirements/req-002-text-to-design.md)
- [REQ-003: Sketch to Design](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/requirements/req-003-sketch-to-design.md)
- [REQ-004: Gallery & Export](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/requirements/req-004-gallery-export.md)
- [REQ-005: User Profile](file:///c:/Users/bytesize/Desktop/mercury_v2/docs/requirements/req-005-user-profile.md)
- [Architecture Decisions](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/design/architecture-decisions.md)
- [Project Rules](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/PROJECT_RULES.md)

---

**문서 버전**: 1.0  
**최종 수정일**: 2026-01-22  
**작성자**: Product Owner  
**상태**: ✅ Approved
