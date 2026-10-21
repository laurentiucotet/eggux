# What to use for what

Find the row for the screen, open the shell, then the blocks, then read the patterns and
component guides it names. Names are Figma components; inventory in
`${CLAUDE_PLUGIN_ROOT}/references/figma-library.md`.

## By screen

| Screen | Shell | Blocks | Patterns | Component guides |
|---|---|---|---|---|
| List / table of objects | App | Filtered List, Empty Page (example "invoices with filters") | search-and-filter, empty-state, loading-states | table, pagination, badge, list-and-tree, card (Entity Card for grids) |
| Large list people work in (invoices, orders, tickets) | App, Corporate + Compact | Template / data grid (enterprise), Filter Builder (example "enterprise invoices") | enterprise-apps, search-and-filter | table |
| Request that needs sign-off | App | Approval Request | approvals, enterprise-apps | description-list, file-upload |
| Who changed what | App (admin) | Audit Log | audit-log | table |
| Roles and access | App (admin) | Roles & Permissions | settings-and-admin, unsaved-changes | table, select |
| Periodic numbers for decisions | App | Report | reports | charts, card, table |
| Edit a long record | App | Record Form | record-page, unsaved-changes, form-validation | input, select |
| Import data (CSV, XLSX) | Wizard or App | Import Mapping | enterprise-apps (§ Import), multi-step-form | file-upload, stepper, table |
| One object (detail) | App | Record Header, Record Detail | record-page | description-list, tabs, navigation |
| Dashboard | App | Analytics | loading-states, empty-state | charts, card, indicators |
| Back office, CMS (lists and editors of content) | App (grid: Sidebar Double for many sections, Side Panel beside editors, actions bar fixed at the bottom) | Data table, Forms blocks | enterprise-apps, unsaved-changes | sidebar, drawer (Side Panel), table, card (Entity Card actions), list-and-tree (Sortable List Item) |
| Settings, admin | App | Profile, Team Members, Billing, Notification Preferences, API Keys, Integrations, Settings Section | settings-and-admin, unsaved-changes, delete-confirmation | input, select, card |
| Inbox, chat, tickets, files | Split View | Conversation (example "inbox") | search-and-filter, empty-state | navigation (split view), list-and-tree, comments-and-chat |
| Discussion on an object (task, document, invoice) | App (record page) | Comments | record-page | comments-and-chat, rich-text-editor |
| Create / edit form | App, or Sheet / Dialog over a list | Forms blocks, Field Presets | form-validation, form-presets, unsaved-changes | input, select, date-picker, file-upload, dialog, drawer |
| Long or blocking flow (onboarding, setup, import) | Wizard | Multi-step Form, Onboarding Checklist | multi-step-form | stepper, progress-and-slider |
| Sign in, sign up, reset, 2FA, invite | Auth | Sign In, Sign Up, Forgot Password, Check Email, Reset Password, Two-Factor, Accept Invite | auth, form-presets | input (OTP) |
| Marketing page | Marketing | Announcement Banner, Navbar, Navbar Mobile, Hero (Centered, Split, with Screenshot), Logo Cloud, Features (grid, Split, Bento), Stats, Testimonials (Single, Grid, Split, Carousel), Pricing, Comparison Table, FAQ, CTA (band, Split, Card), Newsletter, Team, Contact (Cards, with Map, Offices, Map Section), Navbar (Centered, Search, Mega Menu), Footer (Simple, Newsletter, Corporate, Centered) | marketing-pages, mobile | navigation (mega menu), card, accordion, carousel |
| Blog, article, newsroom | Marketing | Blog Grid, Blog Featured, Blog List, Blog Post Header, Article, News List | content-and-docs | content (Post Card, Code Block, Table of Contents) |
| Inner page of a content or product site (detail, hub, search results, person, event, topic, report, legal) | Marketing | Header Detail, Header Listing, Header Search Results, Header Profile, Header Event, Header Topic, Header Report, Header Simple (Page Headers page), then Article, Blog List or sections | marketing-pages (§ Page headers), content-and-docs | content (Post Card compact for related links, Table of Contents), chip, badge |
| Careers, jobs | Marketing | Careers List, Careers Benefits, Job Header, Article | marketing-pages | badge, chip |
| Project plan with dates and dependencies | App | Gantt | (none) | boards-and-calendars |
| Contact, locations | Marketing | Contact Cards, Contact with Map, Offices, Map Section | marketing-pages | input, image (Map) |
| Documentation, help center | Docs, Marketing | Navbar Search, Help Hero, Help Categories, Help Popular Articles, Help Article List, Support Options, Docs Page Footer (examples "docs page", "Help center") | content-and-docs | content, navigation |
| Changelog, status page | Marketing | Changelog, Status Page | content-and-docs | badge, alert |
| Board (stages) | App | Kanban Board | search-and-filter | boards-and-calendars |
| Calendar, schedule | App | Scheduler Week, Scheduler Month, Booking | booking | boards-and-calendars, date-picker |
| Shop: product, cart, checkout | Marketing | Product Card, Product Detail, Order Summary, Address, Payment | commerce, form-presets | select (multi), input (number, group), drawer, carousel, rating |
| Pick a date and time | App or Marketing | Booking | booking | date-picker |
| Error, empty, success page | the current shell | Result | result-pages, empty-state | |
| Mobile screen | Mobile | Navbar Mobile | mobile | drawer, navigation |
| AI assistant (chat page) | App (history in Sidebar) | AI Chat Empty, AI Conversation (example "AI chat app") | ai-chat, empty-state | ai-chat, comments-and-chat |
| AI on a screen (copilot panel, inline edit) | current shell | AI Assistant Panel, Inline AI | ai-chat | ai-chat, popover |
| AI summary or suggested values on a record or form | current shell | example "AI on a record page" (AI Summary, AI Suggestion, AI Notice) | ai-chat, forms | ai-chat, card |
| Agent doing a multi-step task | App or panel | example "agent at work" (Agent Plan, Artifact Card, Tool Call approval) | ai-chat, notifications | ai-chat |

## By interaction

| Need | Pattern | Component guides |
|---|---|---|
| Feedback after any action (create, save, delete, send, copy, export) | action-feedback | toast, button |
| Act on many items | bulk-actions | table |
| Someone cannot do or see something | permissions-and-access | tooltip, badge |
| Session expired, offline, conflicting edit, undo, trash | errors-and-recovery | alert, dialog, toast |
| Tell people about events | notifications | badge, toast |
| Invite people, share an object | sharing-and-invites | dialog, avatar |
| Write labels, messages, dates, numbers | writing | |
| Map a client workflow quickly | common-flows | |
| Confirm a destructive action | delete-confirmation | dialog |
| Tell the user something happened | feedback-messages | toast, alert, indicators |
| Wait for data or an operation | loading-states | skeleton, indicators, progress-and-slider |
| Pick one or many options | (none) | select (Select, Combobox, Tag Input, People Picker, Transfer List), toggle in tabs |
| Show more without leaving | (none) | popover (Popover, Hover Card), dialog, drawer, accordion |
| Find anything fast | search-and-filter | popover (Command Dialog, search suggestions) |
| Write formatted text | unsaved-changes | rich-text-editor |
| Rate or review | (none) | rating |
| Pick a color | (none) | color-picker |
| Keep or discard edits on a long page | unsaved-changes | (Save Bar) |
| Switch organization or tenant | settings-and-admin | sidebar |
| Browse images or related items | (none) | carousel |
| Ask AI, let AI act | ai-chat | ai-chat |
| Introduce a feature or a workflow | (none) | tour, popover |
| Show a video (tutorial, demo) | (none) | video-player |
| Edit one value in place | (none) | input (Inline Edit) |
| Reorder items | (none) | list-and-tree (Sortable List Item) |
| Preview a document or crop an image | (none) | file-upload (File Preview, Image Cropper, Avatar Upload) |
| Sign a document | approvals | input (Signature Pad) |
| Ask for cookie consent | marketing-pages | (Cookie Consent) |

## Component guides and what they cover

| File | Covers |
|---|---|
| accordion | Accordion, filter groups |
| ai-chat | Prompt Input, Attachment, User / Assistant Message, Reasoning, Tool Call, Sources, Citation, Suggestion |
| alert | Alert inline and banner |
| avatar | Avatar, Avatar Group, Byline |
| badge | Badge, Badge Count, Chip, Status Dot (see indicators), Tag List |
| button | Button, Button Icon, Button Group, Split Button, Action Bar |
| boards-and-calendars | Kanban Card, Kanban Column, Calendar Event, week and month view |
| card | Card, Stat Card, Option Card, Post Card, Entity Card, Person Card, Event Card, Progress Card |
| carousel | Carousel |
| charts | Bar, Bar Horizontal, Line, Donut / Pie, Heatmap, Gauge, Treemap, Funnel, Scatter, Waterfall, Combo, Sparkline, Chart Card, legend, tooltip |
| color-picker | Color Picker, swatches, color field |
| comments-and-chat | Comment, Comment Composer, Chat Message, Typing Indicator, Chat Composer |
| content | Section Heading, Feature Item, Post Card, Quote, Code Block, TOC Item, Table of Contents |
| date-picker | Calendar, Date Picker, Time Picker, Date Range Picker |
| description-list | Description List, Meta Item, Figure, Summary Row, Timeline |
| dialog | Dialog, Alert Dialog |
| drawer | Sheet, Drawer, Side Panel |
| dropdown-menu | Menu, Menu Item, Menubar |
| file-upload | File Dropzone, File Item, File Preview, Resource Item, Avatar Upload, Image Cropper |
| indicators | Spinner, Status Dot, Kbd |
| input | Input, Field, Textarea, Input Group, Number Input, Input OTP, Inline Edit, Signature Pad |
| list-and-tree | List Item, Tree Item, Sortable List Item, Scroll Area |
| navigation | Breadcrumb, Top Bar, Page Header, Nav Link, Navigation Menu, Split View |
| pagination | Pagination, Pagination Compact |
| popover | Popover, Command, Combobox panel, Command Dialog, Hover Card, search suggestions |
| progress-and-slider | Progress, Progress Ring, Slider |
| rating | Rating |
| rich-text-editor | Rich Text Editor |
| select | Select, Combobox, Checkbox, Radio, Switch, Setting Row, Tag Input, People Picker, Transfer List |
| sidebar | Sidebar and its parts, Sidebar Double |
| skeleton | Skeleton |
| stepper | Step, Stepper |
| table | Table cells, toolbar, inline edit, column resize |
| tabs | Tabs, Tabs Line, Tabs Vertical, Toggle Group |
| toast | Toast |
| tooltip | Tooltip |
| tour | Coachmark, Hotspot, spotlight |
| video-player | Video Player |
