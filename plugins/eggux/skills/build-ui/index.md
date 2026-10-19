# What to use for what

Find the row for the screen, open the shell, then the blocks, then read the patterns and
component guides it names. Names are Figma components; inventory in
`${CLAUDE_PLUGIN_ROOT}/references/figma-library.md`.

## By screen

| Screen | Shell | Blocks | Patterns | Component guides |
|---|---|---|---|---|
| List / table of objects | App | Filtered List, Empty Page | search-and-filter, empty-state, loading-states | table, pagination, badge, list-and-tree |
| One object (detail) | App | Record Header, Record Detail | record-page | description-list, tabs, navigation |
| Dashboard | App | Analytics | loading-states, empty-state | charts, card, indicators |
| Settings, admin | App | Profile, Team Members, Billing, Notification Preferences, API Keys, Integrations, Settings Section | settings-and-admin, unsaved-changes, delete-confirmation | input, select, card |
| Inbox, chat, tickets, files | Split View | Conversation (example "inbox") | search-and-filter, empty-state | navigation (split view), list-and-tree, comments-and-chat |
| Discussion on an object (task, document, invoice) | App (record page) | Comments | record-page | comments-and-chat, rich-text-editor |
| Create / edit form | App, or Sheet / Dialog over a list | Forms blocks, Field Presets | form-validation, form-presets, unsaved-changes | input, select, date-picker, file-upload, dialog, drawer |
| Long or blocking flow (onboarding, setup, import) | Wizard | Multi-step Form, Onboarding Checklist | multi-step-form | stepper, progress-and-slider |
| Sign in, sign up, reset, 2FA, invite | Auth | Sign In, Sign Up, Forgot Password, Check Email, Reset Password, Two-Factor, Accept Invite | auth, form-presets | input (OTP) |
| Marketing page | Marketing | Navbar, Navbar Mobile, Hero, Logo Cloud, Features, Stats, Testimonials, Pricing, Comparison Table, FAQ, CTA, Newsletter, Team, Contact, Footer | marketing-pages, mobile | navigation (mega menu), card, accordion |
| Blog, article | Marketing | Blog List, Article | content-and-docs | content (Post Card, Code Block, Table of Contents) |
| Documentation, help center | Docs | (example "docs page") | content-and-docs | content, navigation |
| Board (stages) | App | Kanban Board | search-and-filter | boards-and-calendars |
| Calendar, schedule | App | Scheduler Week, Scheduler Month, Booking | booking | boards-and-calendars, date-picker |
| Shop: product, cart, checkout | Marketing | Product Card, Product Detail, Order Summary, Address, Payment | commerce, form-presets | select (multi), input (number, group), drawer, carousel, rating |
| Pick a date and time | App or Marketing | Booking | booking | date-picker |
| Error, empty, success page | the current shell | Result | result-pages, empty-state | |
| Mobile screen | Mobile | Navbar Mobile | mobile | drawer, navigation |
| AI assistant (chat page) | App (history in Sidebar) | AI Chat Empty, AI Conversation (example "AI chat app") | ai-chat, empty-state | ai-chat, comments-and-chat |
| AI on a screen (copilot panel, inline edit) | current shell | AI Assistant Panel, Inline AI | ai-chat | ai-chat, popover |

## By interaction

| Need | Pattern | Component guides |
|---|---|---|
| Confirm a destructive action | delete-confirmation | dialog |
| Tell the user something happened | feedback-messages | toast, alert, indicators |
| Wait for data or an operation | loading-states | skeleton, indicators, progress-and-slider |
| Pick one or many options | (none) | select (Select, Combobox, Tag Input), toggle in tabs |
| Show more without leaving | (none) | popover (Popover, Hover Card), dialog, drawer, accordion |
| Find anything fast | search-and-filter | popover (Command Dialog, search suggestions) |
| Write formatted text | unsaved-changes | rich-text-editor |
| Rate or review | (none) | rating |
| Pick a color | (none) | color-picker |
| Browse images or related items | (none) | carousel |
| Ask AI, let AI act | ai-chat | ai-chat |
| Introduce a feature or a workflow | (none) | tour, popover |
| Show a video (tutorial, demo) | (none) | video-player |

## Component guides and what they cover

| File | Covers |
|---|---|
| accordion | Accordion, filter groups |
| ai-chat | Prompt Input, Attachment, User / Assistant Message, Reasoning, Tool Call, Sources, Citation, Suggestion |
| alert | Alert inline and banner |
| avatar | Avatar, Avatar Group |
| badge | Badge, Badge Count, Chip, Status Dot (see indicators) |
| button | Button, Button Icon, Button Group, Split Button |
| boards-and-calendars | Kanban Card, Kanban Column, Calendar Event, week and month view |
| card | Card, Stat Card, Option Card, Post Card |
| carousel | Carousel |
| charts | Bar, Line, Sparkline, Chart Card, legend, tooltip |
| color-picker | Color Picker, swatches, color field |
| comments-and-chat | Comment, Comment Composer, Chat Message, Typing Indicator, Chat Composer |
| content | Post Card, Code Block, TOC Item, Table of Contents |
| date-picker | Calendar, Date Picker, Time Picker, Date Range Picker |
| description-list | Description List, Timeline |
| dialog | Dialog, Alert Dialog |
| drawer | Sheet, Drawer |
| dropdown-menu | Menu, Menu Item |
| file-upload | File Dropzone, File Item |
| indicators | Spinner, Status Dot, Kbd |
| input | Input, Field, Textarea, Input Group, Number Input, Input OTP |
| list-and-tree | List Item, Tree Item |
| navigation | Breadcrumb, Top Bar, Page Header, Nav Link, Navigation Menu, Split View |
| pagination | Pagination |
| popover | Popover, Command, Combobox panel, Command Dialog, Hover Card, search suggestions |
| progress-and-slider | Progress, Slider |
| rating | Rating |
| rich-text-editor | Rich Text Editor |
| select | Select, Combobox, Checkbox, Radio, Switch, Tag Input |
| sidebar | Sidebar and its parts |
| skeleton | Skeleton |
| stepper | Step, Stepper |
| table | Table cells, toolbar, inline edit, column resize |
| tabs | Tabs, Toggle Group |
| toast | Toast |
| tooltip | Tooltip |
| tour | Coachmark, Hotspot, spotlight |
| video-player | Video Player |
