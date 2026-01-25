# UI/UX Specification: User Profile

## 1. 개요 (Overview)
- **Feature**: User Profile & Settings
- **Ref**: `docs/requirements/req-005-user-profile.md`
- **Status**: ✅ Updated (v1.1)
- **Design Concept**: Fresh & Clean, Professional

## 2. Layout Structure
- **Global Layout**: `Header` + `Main Content` (Centered)
- **Container**: `max-width: 1200px`, `padding: 2rem`
- **Grid System**: 2-Column Grid (Desktop)
    - **Left Column (Aside)**: 300px Fixed width
    - **Right Column (Main)**: Flexible width (1fr)
    - *Mobile Breakpoint (< 768px)*: Stacked layout (1 Column)

## 3. Visual Reference
![User Profile Mockup](file:///C:/Users/bytesize/.gemini/antigravity/brain/e6d7e7d7-0cf9-485d-af08-f33bee0a9d68/user_profile_mockup_1769142440070.png)
*(Note: Mockup shows basic layout; Tabs and specific fields below supersede the mockup details)*

## 4. Component Details

### 4.1 Profile Summary Card (Left Column)
- **Type**: `Card` Component
- **Elements**:
    - **Avatar**: 
        - Size: 120px x 120px (Desktop), 80px (Mobile)
        - Shape: Circle (`rounded-full`)
        - Shadow: `shadow-md`
    - **Name**: `text-xl`, `font-bold` (Outfit), Centered
    - **Job Title**: `text-sm`, `text-gray-500`, Centered
    - **Edit Avatar**: Button/Icon overlay on Avatar hover
    - **Stats Row**:
        - Projects count
        - Style: `text-center`, `text-xs` text

### 4.2 Settings Panel (Right Column)
- **Type**: `Card` Component (Large container)
- **Navigation**: **Top Tab Bar** (Bordered bottom)
    - Items: `Profile`, `Preferences`, `Security`, `Notifications`
    - Interaction: Click to switch content area overlay
    
    #### Tab 1: Profile (General)
    - **Components**:
        - **Nickname Input**: Label "Nickname", Placeholder "Enter nickname"
        - **Job Title Input**: Label "Job Title"
        - **Bio Textarea**: Label "Bio", Max 200 chars, Helper text shows char count.
        - **Email**: Read-only field (Grayed out)
    - **Actions**: `Save Changes` (Primary Button)

    #### Tab 2: Designer Preferences
    - **Components**:
        - **Shoe Size System**:
            - Label: "Default Unit"
            - Component: `Select Dropdown`
            - Options: **US** (Default), UK, EU, MM
        - **Gender Category**:
            - Label: "Default Gender"
            - Component: `Select Dropdown`
            - Options: **Mens**, Womens, Unisex, Kids
        - **Preferred Style Context**:
            - Label: "Style Tags"
            - Component: `Tag/Chip Selector` (Multi-select)
            - Options: Minimalist, Futuristic, Retro, Streetwear, Luxury, Performance (Pre-defined)
            - Interaction: Click tag to toggle active state (Primary color outline/fill)
    - **Actions**: `Save Preferences` (Primary Button)

    #### Tab 3: Security
    - **Password Change**:
        - Current Password / New Password / Confirm Password inputs
        - Button: `Update Password` (Secondary or Outline)
    - **Login Activity**:
        - List Item: Device Icon + Device Name + Location + "Last active" time
        - Action: `Logout` button per item (optional for MVP, simplified list OK)
    
    #### Tab 4: Notifications
    - **Email Notifications**:
        - **Creation Finished**: Switch Toggle (On/Off)
        - **Weekly Report**: Switch Toggle (On/Off)
    - **App Push**:
        - **Browser Notification**: Switch Toggle (On/Off)
    - Interaction: Toggles save immediately (API call on change)

## 5. Interaction & States
- **Loading State**:
    - Card contents replaced with `Skeleton` loaders.
- **Error State**:
    - Validation errors appear below input fields in Red (`text-red-500`).
    - Toast message for API failures.
- **Form Interaction**:
    - "Save" button disabled if loading.
    - Input fields highlight green border on valid, red on invalid.
    - **Tab Switching**: Smooth transition (Fade in/out)

## 6. Color Palette (Applied)
- **Primary**: Mercury Green `#14AE5C` (Buttons, Active Elements, Active Tabs)
- **Background**: Gray-50 `#FAFAFA` (Page Background)
- **Card**: White `#FFFFFF`
- **Text**: Gray-900 (Headings), Gray-600 (Body)
