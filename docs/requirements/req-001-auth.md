# REQ-001: Authentication (MVP)

## 1. User Story
- **사용자**로서,
- **서비스에 로그인**하여,
- **나만의 작업 공간(프로젝트, 갤러리)**에 접근하고 보호받기를 원한다.

## 2. Background & Goals
- 현재 단계는 MVP(Minimum Viable Product)로, **단일 사용자(Single User)** 환경을 가정한다.
- 팀 협업 기능이나 복잡한 권한 관리(RBAC)는 포함하지 않는다.
- 추후 다중 사용자 확장 가능성을 열어두되, 현재는 1인 사용성에 집중한다.

## 3. Requirements (Functional)

### 3.1 Sign Up / Login
- 이메일/비밀번호 기반의 간단한 회원가입 및 로그인.
- (Optional) 소셜 로그인 (Google 등) - *MVP 단계에서 필수 여부 결정 필요*.

### 3.2 User Profile
- 사용자 기본 정보 관리 (이름, 이메일).
- 비밀번호 변경 기능.

## 4. Acceptance Criteria
- [ ] 정해진 계정으로 로그인이 성공해야 한다.
- [ ] 로그아웃 시 세션이 종료되어야 한다.
- [ ] 로그인하지 않은 사용자는 메인 기능(디자인 생성 등)에 접근할 수 없어야 한다.

## 5. Constraints / Non-Functional
- **Simplified MVP**: 초기 단계에서는 보안성보다 **기능 동작** 여부가 우선순위.
- 암호화(Hashing) 등의 보안 적용은 추후 고도화 단계에서 고려 (현재는 Plain text 허용 또는 최소한의 조치만 적용).
- 추후 1인 이상 확장 시 인증 체계 전면 개편 가능성 열어둠.
