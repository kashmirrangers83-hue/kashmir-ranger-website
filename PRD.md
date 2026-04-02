# Kashmir Rangers Cricket Club Website

A professional cricket club website showcasing the "Ranger Standard" philosophy - achieving success as a team, club, and player; creating a winning culture and legacy; and showcasing high standards on and off the field.

**Experience Qualities**:
1. **Prestigious** - Convey the elite status and professional standards of the club through refined design and attention to detail
2. **Athletic** - Energetic layouts with dynamic motion that reflect the competitive spirit of cricket
3. **Trustworthy** - Clear information architecture and reliable functionality that builds confidence in the club's professionalism

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
The application requires Firebase integration, authentication, dynamic CMS capabilities, multiple views with routing, image upload functionality, and comprehensive admin panel - making this a sophisticated full-featured web application.

## Essential Features

### Public Website Features

**Home Page**
- Functionality: Landing page with hero section, club overview, and latest updates from Play-Cricket
- Purpose: First impression that captures the club's prestige and keeps visitors informed
- Trigger: Default route (/)
- Progression: Page load → Hero animation → About snippet display → Play-Cricket widget render → Footer
- Success criteria: Loads under 2s, displays dynamic content from Firestore, shows Play-Cricket integration

**About Page**
- Functionality: Detailed narrative about club culture, training philosophy, and the "Ranger Standard"
- Purpose: Communicate the club's values and year-round commitment to excellence
- Trigger: Navigation click to /about
- Progression: Navigation → Route transition → Content load from Firestore → Render formatted text
- Success criteria: Dynamic content updates from admin panel, responsive layout, engaging typography

**Scores & Tables Page**
- Functionality: Tabbed interface displaying Play-Cricket widgets for fixtures, results, and league tables
- Purpose: Provide real-time access to official statistics and match data in an organized, easy-to-navigate format
- Trigger: Navigation click to /scores
- Progression: Navigation → Load widget codes from KV store → Render tabbed interface → Display active widgets → Enable tab switching
- Success criteria: Widgets load correctly, tabs only show for configured widgets, graceful empty state if no widgets configured, responsive iframe rendering

**Officials Page**
- Functionality: Card-based display of committee members with photos, names, and roles
- Purpose: Show club leadership and organizational structure
- Trigger: Navigation click to /officials
- Progression: Navigation → Fetch officials from Firestore → Display in grid layout → Show images from Firebase Storage
- Success criteria: Cards display properly, images load, empty state if no officials added

**Sponsors Page**
- Functionality: Grid of sponsor logos with external links
- Purpose: Acknowledge supporters and provide visibility for sponsors
- Trigger: Navigation click to /sponsors
- Progression: Navigation → Load sponsors from Firestore → Render logo grid → Enable click-through
- Success criteria: Logos display, links work, responsive grid, empty state handling

**Contact Page**
- Functionality: Contact form and display of club location/social media
- Purpose: Enable communication and show how to connect with the club
- Trigger: Navigation click to /contact
- Progression: User fills form → Validation → Display success message → Show social links from Firestore
- Success criteria: Form validation works, social links are dynamic, professional layout

**Gallery Page**
- Functionality: Grid display of club photos from matches, training sessions, and events
- Purpose: Visual showcase of club activities and team spirit to engage visitors and build community
- Trigger: Navigation click to /gallery
- Progression: Navigation → Load photos from KV store → Display responsive grid → Show captions
- Success criteria: Photos load efficiently with lazy loading, responsive grid layout, empty state with engaging message, captions display properly

### Admin Panel Features ("Independence")

**Admin Authentication**
- Functionality: Secure login system using Firebase Authentication
- Purpose: Protect admin functionality from unauthorized access
- Trigger: Navigate to /admin
- Progression: Navigate to admin → Show login form → Enter credentials → Firebase auth → Redirect to dashboard
- Success criteria: Only authenticated users access admin, session persists, logout works

**Site Settings Manager**
- Functionality: Edit club name, social media links, Play-Cricket site ID, and widget embed codes with inline help and status indicators
- Purpose: Central control of global site configuration with user-friendly guidance for non-technical admins
- Trigger: Click "Site Settings" in admin panel
- Progression: Load current settings → Display form with contextual help → Edit fields → View real-time status indicators → Save to KV store → Success notification
- Success criteria: Changes reflect immediately on public site, clear instructions for obtaining widget codes, visual confirmation when codes are detected, monospaced font for code fields

**Officials Manager**
- Functionality: CRUD operations for committee members with photo uploads
- Purpose: Maintain current leadership information without code changes
- Trigger: Click "Officials" in admin panel
- Progression: View list → Click add/edit → Fill form → Upload photo to Firebase Storage → Save to Firestore → Update list
- Success criteria: Photos upload successfully, can edit/delete officials, image URLs persist correctly

**Sponsors Manager**
- Functionality: Upload sponsor logos and set destination URLs
- Purpose: Easy sponsor management without developer intervention
- Trigger: Click "Sponsors" in admin panel
- Progression: View grid → Add sponsor → Upload logo → Set URL → Save to Firestore → Display on public site
- Success criteria: Logo uploads work, links open in new tabs, can remove sponsors

**Content Editor**
- Functionality: Rich text area to update About page and Home announcements
- Purpose: Enable admin to update key messaging independently
- Trigger: Click "Content" in admin panel
- Progression: Load current content → Edit in textarea → Preview (optional) → Save → Update Firestore
- Success criteria: Formatting preserved, line breaks work, updates appear immediately

**Gallery Manager**
- Functionality: Upload photos to gallery via file upload or image URL with optional captions, view all gallery photos in a draggable grid, reorder photos via drag-and-drop, and remove photos
- Purpose: Complete control over gallery content with flexible upload options and intuitive organization
- Trigger: Click "Gallery" tab in admin panel
- Progression: View gallery grid → Click "Add Photo" → Choose upload method (file/URL) → Select/enter image → Add optional caption → Save to KV store → Photo appears in public gallery → Drag photos to reorder → Admin can remove photos individually
- Success criteria: File uploads convert to data URLs and save correctly, URL-based uploads work, drag-and-drop reordering is smooth with visual feedback, photos display in custom order on public gallery, removal works immediately, preview shows before adding, file size validation (5MB max), empty state guides admin to add first photo

## Edge Case Handling

- **Missing Firestore Data**: If any content field is empty, hide that section entirely to prevent broken layouts
- **Failed Image Loads**: Display placeholder or initials for official photos that fail to load
- **Invalid Play-Cricket IDs**: Show helpful message if widgets don't load instead of blank space
- **Network Errors**: Toast notifications for save failures with retry options
- **Expired Auth Sessions**: Redirect to login with message explaining session timeout
- **Mobile Widget Rendering**: Ensure Play-Cricket iframes scale properly on small screens
- **Empty Collections**: Show engaging empty states with CTAs for admins to add content

## Design Direction

The design should evoke elite athleticism, professional sporting excellence, and institutional prestige. Think of Wimbledon's refined traditionalism meets modern sports broadcasting - clean, confident, and championship-caliber. Navy blue grounds the design in authority and tradition, while silver accents add a contemporary edge that suggests innovation and excellence.

## Color Selection

A palette inspired by cricket whites, championship trophies, and evening stadium lights - professional yet spirited.

- **Primary Color**: Navy Blue (oklch(0.28 0.08 250)) - Authority, tradition, and the club's core identity. Used for headers, primary buttons, and key brand moments.
- **Secondary Color**: Crisp White (oklch(0.99 0 0)) - Clean, professional, cricket tradition. Primary backgrounds and contrast.
- **Accent Color**: Championship Silver (oklch(0.75 0.02 240)) - Prestige, achievement, trophy elegance. For highlights, hover states, and premium touches.
- **Supporting Navy**: Deep Navy (oklch(0.20 0.08 250)) - Footer, secondary backgrounds, depth.
- **Success Green**: Cricket Green (oklch(0.65 0.15 145)) - Match wins, success states, positive actions.

**Foreground/Background Pairings**:
- Primary Navy (oklch(0.28 0.08 250)): White text (oklch(0.99 0 0)) - Ratio 8.2:1 ✓
- Championship Silver (oklch(0.75 0.02 240)): Navy text (oklch(0.28 0.08 250)) - Ratio 4.9:1 ✓
- White Background (oklch(0.99 0 0)): Navy text (oklch(0.28 0.08 250)) - Ratio 8.2:1 ✓
- Deep Navy (oklch(0.20 0.08 250)): White text (oklch(0.99 0 0)) - Ratio 11.5:1 ✓

## Font Selection

Typography should communicate sporting professionalism with contemporary edge - strong headlines that command attention like a captain's presence, with readable body text that flows like commentary.

- **Primary Font**: Bebas Neue (Display) - Bold, athletic, commanding presence for headlines and hero text
- **Secondary Font**: Inter (Body) - Clean, professional, highly readable for body content and UI elements

**Typographic Hierarchy**:
- H1 (Hero Title): Bebas Neue Bold/64px/tight tracking, uppercase for maximum impact
- H2 (Section Headers): Bebas Neue Bold/48px/tight tracking, navy blue
- H3 (Card Titles): Inter Bold/24px/normal tracking, precise and clean
- Body Text: Inter Regular/16px/1.6 line height, comfortable reading
- Small Text (Captions): Inter Medium/14px/1.5 line height, muted color
- Button Text: Inter SemiBold/16px/wide tracking, uppercase for impact

## Animations

Animations should feel athletic and purposeful - quick like a fast bowler's delivery, smooth like a cover drive. Use motion to guide attention and celebrate interactions without slowing down the experience.

**Key Animations**:
- Page transitions: Smooth fade + slight upward motion (300ms) suggesting elevation and progress
- Hero entrance: Staggered fade-in of elements (hero image → title → subtitle → CTA) creating dramatic reveal
- Card hovers: Subtle lift with shadow increase suggesting interactivity
- Button interactions: Scale micro-interaction (95% on press) for tactile feedback
- Sponsor logos: Gentle opacity fade on hover (0.7 → 1.0) maintaining elegance
- Admin save actions: Success checkmark animation with bounce for positive reinforcement
- Loading states: Smooth skeleton screens that match final content layout

## Component Selection

**Components**:
- **Navigation**: Custom navbar with shadcn Sheet for mobile menu - sticky header with transparent-to-solid transition on scroll
- **Hero Section**: Custom component with background image, overlay, and Bebas Neue typography
- **Cards**: shadcn Card for officials/sponsors - with hover states and consistent padding
- **Forms**: shadcn Form + Input + Textarea + Button with react-hook-form validation
- **Buttons**: shadcn Button with variants (default for primary navy, outline for secondary actions)
- **Toasts**: Sonner for all notifications - success, error, and info states
- **Tabs**: shadcn Tabs for admin panel sections
- **Dialog**: shadcn Dialog for add/edit modals in admin
- **Badge**: shadcn Badge for roles/positions on officials cards
- **Separator**: shadcn Separator for visual content breaks
- **Scroll Area**: shadcn ScrollArea for admin content lists

**Customizations**:
- Custom hero component with parallax-style background
- Custom Play-Cricket widget wrapper with responsive iframe handling
- Custom image upload component for Firebase Storage integration
- Custom empty state components with illustrations and CTAs
- Custom admin layout with sidebar navigation

**States**:
- Buttons: Navy solid (primary), navy outline (secondary), disabled with opacity
- Inputs: Default border, focus ring in silver, error state in red, success in cricket green
- Cards: Default elevation, hover lift + shadow increase, active press state
- Loading: Skeleton screens matching component shapes, spinner for actions

**Icon Selection**:
- Trophy: Club achievements and prestige
- Users: Committee/officials section
- Star: Sponsors and partnerships
- Mail/Phone: Contact information
- Settings: Admin configuration
- Plus/Edit/Trash: CRUD operations in admin
- ExternalLink: Sponsor links
- Lock: Authentication
- Upload: Image upload actions

**Spacing**:
- Section padding: py-20 (desktop), py-12 (mobile)
- Card padding: p-6 standard, p-8 for hero cards
- Grid gaps: gap-8 for large grids, gap-4 for compact lists
- Component spacing: space-y-4 for form fields, space-y-8 for sections
- Container: max-w-7xl with px-4 for consistent edge spacing

**Mobile**:
- Navigation collapses to hamburger menu with Sheet drawer
- Hero text scales down (64px → 40px for h1)
- Card grids: 3 columns → 2 columns → 1 column responsive
- Horizontal spacing reduces: px-8 → px-4
- Play-Cricket widgets: 16:9 aspect ratio container with responsive iframe
- Admin panel: Stacked layout on mobile, sidebar becomes dropdown
- Touch targets: Minimum 44px height for all interactive elements
