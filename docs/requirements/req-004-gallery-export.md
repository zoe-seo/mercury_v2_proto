# REQ-004: Gallery & Export

## 1. User Story
- **사용자**로서,
- **내가 만든 모든 프로젝트와 디자인**을 한 눈에 모아보고(Gallery),
- 필요한 **디자인 패키지**를 외부로 공유하거나 저장하기 위해 **내보내기(Export)** 하고 싶다.

## 2. Detailed Features

### 2.1 Project & Gallery View
- **Organization**:
    - **Projects**: 관련된 디자인 작업들의 묶음 폴더 개념.
    - **All Designs**: 생성된 모든 디자인 리스트 (최신순, 프로젝트별 필터).
- **Thumbnail Grid**: 생성된 이미지들의 썸네일 뷰.
- **Detail View**: 클릭 시 상세 정보창 (Design Package 정보 포함).

### 2.2 Design Package Structure (Data Model)
REQ-002, 003에서 생성된 최종 결과물 객체.
- **Components**:
    - `Design Info` (Metadata, Prompt, Color Hex codes)
    - `Images` (Main, Model Shot, Variations)
    - `Report` (Market Analysis text, Competitor list, etc.)
    - **Visualization**: 마케팅 리포트 데이터(비용, 트렌드 등)는 **그래프 및 차트**로 시각화되어 제공되어야 함.

### 2.3 Export & Share
- **Format Extension**:
    - **Image Only**: PNG, JPG (High Res).
    - **Full Package**: PDF (Report 그래프 포함).
- **Web Share Link**:
    - 외부 사용자에게 공유할 수 있는 **읽기 전용 웹 뷰어 링크** 생성 기능.
    - 링크 유효 기간 설정 (Optional).

## 3. Acceptance Criteria
- [ ] 사용자는 자신의 작업물을 갤러리 형태로 볼 수 있어야 한다.
- [ ] 디자인 패키지 내의 마케팅/비용 데이터가 그래프/차트로 시각화되어야 한다.
- [ ] 외부 공유를 위한 웹 링크를 생성할 수 있다.
- [ ] PDF 내보내기 시 시각화된 차트도 포함되어야 한다.

## 4. Open Questions
- (None)
