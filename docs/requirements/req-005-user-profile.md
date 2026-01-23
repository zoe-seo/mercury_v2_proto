# REQ-005: User Profile

## 1. User Story
- **사용자**로서,
- **내 프로필 정보를 관리**하여,
- **나의 브랜드 정체성을 유지**하고 **개인화된 서비스 경험**을 얻기를 원한다.

## 2. Background & Goals
- 로그인 후 사용자 정보를 확인하고 수정할 수 있는 공간이 필요함.
- 신발 디자이너라는 페르소나에 맞춰, 단순 개인정보 외에 직무 관련 기본 설정(예: 선호 사이즈 단위)을 포함한다.
- 추후 커뮤니티/공유 기능 확장 시 다른 사용자에게 보여질 명함 역할을 수행한다.

## 3. Requirements (Functional)

### 3.1 View Profile
- **사용자 정보 표시**:
    - 프로필 이미지 (Avatar)
    - 디스플레이 이름 (Nickname)
    - 이메일 주소 (Read-only)
    - 직책/역할 (예: Footwear Designer, Student, etc.)
    - 자기소개 (Bio) - 최대 200자
- **디자인 통계 (추후 확장 가능)**:
    - 생성한 디자인 수, 저장된 프로젝트 수 등 (MVP에서는 숨김 또는 간단한 카운트만)

### 3.2 Edit Profile
- **프로필 이미지 수정**:
    - 이미지 업로드 (JPG, PNG, WEBP)
    - 최대 용량 제한 (5MB)
    - 원형 크롭 UI (권장) 또는 중앙 정렬
- **텍스트 정보 수정**:
    - 이름, 직책, 자기소개 수정 가능
    - 이메일은 수정 불가 (별도 인증 프로세스 필요하므로 MVP 제외)
- **비밀번호 변경**:
    - 현재 비밀번호 확인 후 새 비밀번호 설정

### 3.3 Designer Preferences (디자이너 설정)
- **신발 사이즈 단위 (Measurement System)**:
    - US / UK / EU / MM (Jpn) 중 기본값 선택
    - 디자인 스펙 생성 시 이 단위가 기본으로 적용됨
- **기본 타겟 성별 (Default Gender Category)**:
    - Mens / Womens / Unisex / Kids
- **선호 디자인 스타일 (Preferred Style Context)**:
    - AI 이미지 생성 시 'Base Context'로 사용될 스타일 키워드 설정
    - 예: Minimalist, Futuristic, Heritage, Streetwear 등 (직접 입력 또는 태그 선택)

### 3.4 Security Settings (보안 설정)
- **비밀번호 변경**:
    - 현재 비밀번호 확인 후 새 비밀번호 설정
- **로그인 활동 (Login Activity - MVP Optional)**:
    - 최근 로그인 한 기기/위치 목록 표시 및 '로그아웃' 기능
- **2단계 인증 (2FA - Future)**:
    - OTP 또는 SMS 인증 설정 (현재는 비활성화된 UI로 표시하거나 Hide)
- **데이터 프라이버시 (Data Privacy)**:
    - 마케팅 정보 수신 동의 여부
    - 데이터 보존 기간 설정 (기본: 영구 보존)

### 3.5 Use Notifications (알림 설정)
- **Email Notifications**:
    - [x] 이미지 생성 완료 시 알림
    - [x] 마케팅 리포트 생성 완료 시 알림
    - [ ] 뉴스레터 및 프로모션 (기본: Off)
- **App Push / Toast**:
    - [x] 작업 완료 시 브라우저 알림 (Permission 필요)

## 4. Frontend Brief
- **Layout**:
    - **Tab Navigation**: [Profile] | [Preferences] | [Security] | [Notifications]
    - 모바일에서는 수직 리스트(Stack) 형태로 변환
- **Preferences UI**:
    - Dropdown 또는 Segment Control 위주로 빠르고 직관적인 선택 유도
- **Interaction**:
    - **Auto-save or Explicit Save**: '설정' 탭은 변경 즉시 저장보다는 'Save Changes' 버튼을 통한 명시적 저장을 권장 (실수 방지)
    - **Immediate Feedback**: 토글 스위치(알림 등)는 즉시 반영 및 피드백

## 5. Constraints / Non-Functional
- **Avatar Storage**:
    - 사용자 업로드 이미지는 S3 (또는 호환 스토리지) `avatars/` 경로에 저장
    - CDN 캐싱 적용 고려 (파일명 해싱 또는 버전 관리)
- **Validation**:
    - 닉네임: 2~20자, 특수문자 제한
    - 바이오: XSS 방지 처리 (Plain text only)
- **Scalability**:
    - 설정 항목은 JSON 컬럼(PostgreSQL `JSONB`)에 저장하여 스키마 변경 없이 확장 가능하도록 설계 권장

## 6. Acceptance Criteria
- [ ] 프로필 페이지 진입 시 내 정보가 정확히 표시되어야 한다.
- [ ] 프로필 이미지를 변경하고 저장하면, 헤더 등 다른 영역의 썸네일도 갱신되어야 한다.
- [ ] 선호 사이즈 단위 및 타겟 성별을 변경하면 저장되고, 재진입 시 유지되어야 한다.
- [ ] 비밀번호 변경 시 기존 비밀번호가 틀리면 거부되어야 한다.
- [ ] 알림 설정을 변경하고 저장하면 DB에 반영되어야 한다.
