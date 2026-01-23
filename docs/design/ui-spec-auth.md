# Mercury - Authentication UI Specification

## 문서 정보
- **작성일**: 2026-01-23
- **작성자**: UI/UX Designer
- **상태**: ⏳ Draft
- **버전**: 1.0
- **관련 문서**: 
  - [REQ-001: Authentication](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/requirements/req-001-auth.md)
  - [Design System](file:///c:/Users/tjwn1/Desktop/mercury_v2_proto/docs/design/design-system.md)

---

## 0. Visual Reference
![Authentication Visual Prototype](C:/Users/tjwn1/.gemini/antigravity/brain/9c49e5eb-7f9e-4610-9263-9b26050e52ce/auth_page_design_1769097033406.png)

---

## 1. 페이지 개요

### 1.1 목적
- 서비스 접근 권한 확인 (로그인)
- 신규 사용자 등록 (회원가입)

### 1.2 URL
- `/login`
- `/signup`

### 1.3 레이아웃 참조
- **Layout**: Centered Card Layout (Full Screen)
- **Background**: Soft clean background (Gray-50 or subtle pattern)

---

## 2. 컴포넌트 트리

```
AuthPage (Login/Signup)
├── BackgroundContainer
│   ├── Logo (Top Center)
│   └── AuthCard (Centered)
│       ├── ValidatedForm
│       │   ├── EmailInput
│       │   ├── PasswordInput
│       │   ├── ConfirmPasswordInput (Signup Only)
│       │   └── NameInput (Signup Only)
│       ├── ActionButton (Login/Signup)
│       └── LinkGroup
│           ├── ForgotPasswordLink
│           └── AlternateAuthLink (Go to Signup/Login)
└── Footer (Optional, Copyright)
```

---

## 3. 섹션별 상세 설계

### 3.1 Login Page

#### Layout
- **Container**: Flexbox, Center/Center, min-h-screen, bg-gray-50
- **Card**:
  - Width: max-w-md (448px)
  - Bg: White
  - Shadow: shadow-xl
  - Radius: rounded-2xl
  - Padding: 48px

#### Content
- **Header**:
  - Logo: Mercury Logo + Name (Height 40px)
  - Title: "Welcome back" (text-2xl, font-bold, text-gray-900)
  - Subtitle: "Enter your details to access your workspace." (text-sm, text-gray-600)
- **Form**:
  - **Email**: Label "Email", Input (type="email", placeholder="Enter your email")
  - **Password**: Label "Password", Input (type="password", placeholder="••••••••")
  - **Forgot Password**: Link (text-sm, text-primary-600, right aligned)
- **Actions**:
  - **Sign In Button**: Primary Button (Full width), "Sign in"
- **Footer**:
  - Text: "Don't have an account?"
  - Link: "Sign up" (text-primary-600, font-medium)

### 3.2 Signup Page

#### Layout
- Same as Login Page

#### Content
- **Header**:
  - Logo
  - Title: "Create an account"
  - Subtitle: "Start designing with AI today."
- **Form**:
  - **Name**: Label "Full Name", Input (placeholder="John Doe")
  - **Email**: Label "Email", Input (type="email")
  - **Password**: Label "Password", Input (type="password")
  - **Confirm Password**: Label "Confirm Password", Input (type="password")
- **Actions**:
  - **Sign Up Button**: Primary Button (Full width), "Create account"
- **Footer**:
  - Text: "Already have an account?"
  - Link: "Sign in"

---

## 4. 상태 & 인터랙션

### 4.1 Validation
- **Email**: 유효한 이메일 형식 체크
- **Password**: 최소 8자 이상
- **Match**: 비밀번호 확인 일치 여부 (Signup)
- **Error State**: Input border Red-500, Error message (text-xs, Red-500) below input

### 4.2 Loading
- 버튼 텍스트가 스피너로 변경
- 버튼 비활성화 (opacity-70)

---

## 5. 디자인 스타일

- **Primary Color**: #14AE5C (Mercury Green)
- **Input Style**:
  - Height: 48px
  - Border: 1px solid Gray-300
  - Radius: rounded-lg
  - Focus: Ring-2 Ring-Primary-100 Border-Primary-500
- **Typhography**: Inter (Body), Outfit (Headings)

---

## 6. 구현 예시

```jsx
<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-md">
    <img className="mx-auto h-12 w-auto" src="/logo.svg" alt="Mercury" />
    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
      Sign in to your account
    </h2>
  </div>

  <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <form className="space-y-6" action="#" method="POST">
        <Input label="Email address" type="email" />
        <Input label="Password" type="password" />

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <Button type="submit" className="w-full flex justify-center">
            Sign in
          </Button>
        </div>
      </form>
    </div>
  </div>
</div>
```
