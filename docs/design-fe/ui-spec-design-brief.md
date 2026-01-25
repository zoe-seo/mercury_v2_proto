# Mercury - Unified Design Brief UI Specification

## 문서 정보
- **작성일**: 2026-01-25
- **작성자**: UI/UX Designer
- **상태**: ✅ Approved
- **버전**: 1.0
- **관련 요구사항**: [REQ-007: Unified Design Brief](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/requirements/req-007-design-brief.md)

---

## 1. 컴포넌트 개요

`DesignBriefForm`은 Chat과 Canvas에서 공통으로 사용되는 입력 폼 컴포넌트입니다.

### 1.1 주요 특징
- **Progressive Disclosure**: 3단 아코디언 구조로 복잡도 관리
- **Smart Validation**: 필수 필드 하이라이팅
- **Responsive**: 사이드바(320px)와 채팅 버블(max-width) 모두 대응

---

## 2. 상세 UI 설계

### 2.1 "Clean & Modern" Single View Layout
더 이상 아코디언을 사용하지 않으며, 한 눈에 들어오는 직관적인 폼 레이아웃을 사용합니다. 불필요한 마케팅 정보는 디자인 단계에서 숨기거나 최소화합니다.

#### Header Area
- **Theme Input** (Large, Bold): 디자인의 핵심 주제
- **Reference Image Selection**: 썸네일 표시 및 변경 버튼

#### Specs Grid (2 Columns)
- **Column 1 (Identity)**: Target Audience, Tone
- **Column 2 (Physical)**: Category, Material, Sole

#### Colors & Styles
- **Key Colors**: Color Swatches (Circular)
- **Style Keywords**: Tag clouds

*(Marketing Section은 별도 'Advanced' 토글로 숨김 처리)*

### 2.2 Shared Styling (Tailwind)

```jsx
// Main Container
<div className="flex flex-col gap-6 p-6 bg-white/95 backdrop-blur rounded-xl border border-gray-100 shadow-sm">
  
  // Theme Hero Input
  <div>
    <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1 block">Design Theme</label>
    <input className="w-full text-lg font-bold text-gray-800 bg-transparent border-b border-gray-200 focus:border-primary-500 focus:outline-none pb-2 placeholder-gray-300" placeholder="Ultra Modern Runner..." />
  </div>

  // Specs Grid
  <div className="grid grid-cols-2 gap-4">
     // ... distinct spec inputs
  </div>

  // Visual Reference
  <div className="aspect-video bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200 hover:border-primary-200 cursor-pointer transition-colors">
     <span className="text-sm text-gray-400">Select Reference</span>
  </div>

</div>
```

---

## 3. Usage Contexts

### 3.1 Chat Interface (Session Menu)
- **Entrance**: Chat 세션 목록의 `More(...)` 메뉴 -> `Brief Settings` 클릭.
- **Interaction**: 모달(Dialog) 형태로 `DesignBriefForm` 표시.
- **Auto-Trigger**: AI가 채팅 중 유의미한 정보를 감지하면 `[Design Brief Proposed]` 버블을 띄움 (기존 로직 유지). 단, 버블 내 'Review' 클릭 시 모달이 뜸.

### 3.2 Canvas Interface (Sidebar)
- **Entrance**: Canvas 페이지 진입 시 좌측 사이드바.
- **Persistence**: Auto-save.
- **Reference Gallery Integration**: 사이드바 내 'Reference Gallery' 탭에서 이미지를 클릭하면, 해당 이미지의 스타일 프롬프트가 Design Brief의 현재 필드들을 덮어씀 (Clone).

---

## 4. Visual Assets
*Step 4에서 생성된 프로토타입 참조*
![Prototype](C:/Users/tjwn1/.gemini/antigravity/brain/a284f670-c7b5-439b-8558-9c112181f36d/canvas_with_sidebar_1769346372371.png)
