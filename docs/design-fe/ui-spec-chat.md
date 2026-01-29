# Mercury - Chat Interface UI Specification (Rich Chat Mode)

## 문서 정보
- **작성일**: 2026-01-26
- **작성자**: UI/UX Designer
- **상태**: ✅ Approved
- **버전**: 3.0 (Rich Chat Update)
- **관련 문서**: 
  - [REQ-002: Text to Design](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/requirements/req-002-text-to-design.md)
  - [Design System](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/design/design-system.md)

---

## 1. 페이지 개요

### 1.1 목적
- **단계별 가이드(Guided Workflow)** 로직을 **자연스러운 대화(Chat)** 경험으로 녹여냄
- AI가 제안(Propose)하고, 사용자가 선택(Select)하는 턴제 방식
- "대화형 위젯(Interactive Widgets)"을 통해 텍스트 입력을 최소화

### 1.2 UX 컨셉: "Rich Chat Stream"
- **Unified Stream**: 가이드, 선택지, 결과물이 모두 하나의 타임라인에 흐름
- **Interactive Bubbles**: 단순 텍스트가 아닌, 기능이 포함된 리치 버블(Rich Bubble)
- **AI-Led**: AI가 설명과 함께 선택지를 제시(Offer)하는 구조

---

## 2. 레이아웃 구조

### 2.1 2-Column Standard Layout
- 일반적인 메신저 UI 구조 채택
- **Left Panel (300px, Collapsible)**: Session List (History)
- **Main Area (Flex Fill)**: Chat Conversation Stream

### 2.2 Global Elements
- **Header**: Session Title, [New Chat] 버튼
- **Floating Status**: 상단에 작게 현재 단계 표시 (예: "Step 2/5: Outline")

---

## 3. 컴포넌트 상세: Chat Stream

### 3.1 AI Rich Message (핵심)
AI 메시지는 **[텍스트 설명] + [인터랙티브 위젯]** 의 구조를 가집니다.

#### A. Text Part (텍스트 설명)
- AI 아바타와 함께 말풍선에 표시
- 예: "러닝화 카테고리를 선택하셨군요. 어떤 실루엣을 기본으로 시작할까요?"

#### B. Selection Widget (선택지)
- AI 말풍선 **바로 아래**에 부착된(Attached) 형태로 렌더링
- **Grid Card Widget**: (Outline, Sole 선택용)
    - 이미지 카드 그리드 (2-3열)
    - 각 카드는 [이미지] + [라벨]로 구성
    - 클릭 시 즉시 선택
- **Chip Group Widget**: (Target, Category, Material 선택용)
    - 둥근 칩 형태의 버튼 나열
    - 단일 선택(Radio) 또는 다중 선택(Checkbox)
- **Color Picker Widget**:
    - 컬러 팔레트 원형 버튼

### 3.2 User Message
- 사용자가 위젯에서 선택을 마치면, **선택한 내용이 사용자의 말풍선으로 변환**되어 스트림에 추가됩니다.
- 예: (사용자가 'Running' 카드 클릭) -> 사용자 말풍선: "Running" 또는 "러닝화 스타일로 할래" 생성
- **효과**: 대화가 끊기지 않고 자연스럽게 이어지는 느낌 제공

### 3.3 Input Area
- **Step 0 (진입)**: 활성화. "어떤 신발을 만들고 싶으신가요?" (자유 입력)
- **Selection Steps**: 
    - 기본적으로 **비활성화(Disabled)** 또는 **숨김**.
    - 혹은 "직접 입력하기" 모드로 전환 시, AI가 자유 텍스트를 분석해 선택지로 매핑(구현 난이도 높음, MVP 제외 권장).

---

## 4. 단계별 인터랙션 시나리오

### 4.1 Step 0: Initial Intent
- **AI**: "안녕하세요! 오늘은 어떤 디자인을 해볼까요?" (추천 프롬프트 칩 포함)
- **User**: "빨간색 가벼운 러닝화 만들어줘" (텍스트 입력)
- **System**: 텍스트 분석 후 Step 1 건너뛰고 Step 2로 갈 수도 있음 (Smart Jump)

### 4.2 Step 2: Outline Selection
- **AI**: 
    - 텍스트: "빨간색 러닝화 좋네요. 기본이 될 아웃라인을 골라주세요."
    - **Widget**: [Outline A 이미지] [Outline B 이미지] [Outline C 이미지]
- **User**: [Outline A] 클릭
- **System**:
    - 위젯 상태: [Outline A]가 Highlight 되고 나머지는 Dimmed 처리 (Read-only 모드로 변경)
    - **New Message**: 사용자 쪽에 "아웃라인 A로 할게" 말풍선 추가
    - **New AI Message**: "좋습니다. 이제 바닥창(Sole)을 골라볼까요?" + Sole 선택 위젯 표시

### 4.3 Step 5: Generation Result
- **AI**:
    - 텍스트: "모든 선택이 완료되었습니다. 디자인을 생성합니다..."
    - **Widget**: [Generating Loader...] -> [Completed Image]
- **Interaction**:
    - 이미지 클릭 시 Lightbox 확대
    - 하단에 [Regenerate] [Finalize] 버튼 위젯 표시

---

## 5. 예외 상황 처리

### 5.1 수정 (Edit/Undo)
- 사용자가 과거 AI 메시지의 위젯(예: 아웃라인 선택)을 다시 클릭하여 변경하면?
- **정책**: 
    1. 현재 진행 중인 대화 아래에 "System Info: 사용자가 아웃라인을 변경했습니다." 표시
    2. 변경된 아웃라인을 기준으로 이후 단계(Sole, Color 등)는 **무효화(Reset)**됨을 알림
    3. 대화 흐름이 해당 지점부터 다시 시작되거나, 빠르게 재설정하는 위젯이 하단에 새로 생김

### 5.2 세션 복원
- 기존 세션에 들어오면 마지막 대화 상태 그대로 로드
- 마지막 단계의 위젯이 활성화 상태로 표시됨

---

## 0. Visual Reference
![Chat Interface v3 Prototype](C:/Users/tjwn1/.gemini/antigravity/brain/d2ba919c-7352-4e78-a18b-8c022c2138db/chat_interface_v3_rich_chat_1769428778812.png)
## 6. Visual Style Guide

### 6.1 Colors
- **AI Bubble**: Gray-100 (text-gray-900)
- **User Bubble**: Primary-600 (text-white)
- **Active Widget Item**: Ring-2 Ring-Primary-500 Bg-Primary-50
- **Disabled/Past Widget**: Opacity-60 Grayscale (선택된 항목만 진하게)

### 6.2 Animation
- **Message In**: Slide Up + Fade In (Tension: 200, Friction: 20)
- **Widget Expand**: AI 텍스트가 먼저 나오고 0.3초 뒤 위젯이 부드럽게 펼쳐짐

---
