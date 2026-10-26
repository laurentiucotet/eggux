# What to use for what

Find the row for the screen, open the shell, then the blocks, then read the patterns and
component guides it names. Names are Figma components; inventory in
`${CLAUDE_PLUGIN_ROOT}/references/figma-library.md`.

## By screen

| Screen | Shell | Blocks | Patterns | Component guides |
|---|---|---|---|---|
| List / table of objects | App | Data Table (toolbar, selection, pagination), Stacked List, Grid List, Filtered List, Empty Page (example "invoices with filters") | search-and-filter, empty-state, loading-states | table, pagination, badge, list-and-tree, card (Entity Card for grids) |
| Large list people work in (invoices, orders, tickets) | App, Corporate + Compact | Template / data grid (enterprise), Filter Builder (example "enterprise invoices") | enterprise-apps, search-and-filter | table |
| Request that needs sign-off | App | Approval Request | approvals, enterprise-apps | description-list, file-upload |
| Who changed what | App (admin) | Audit Log | audit-log | table |
| Roles and access | App (admin) | Roles & Permissions | settings-and-admin, unsaved-changes | table, select |
| Periodic numbers for decisions | App | Report | reports | charts, card, table |
| Edit a long record | App | Record Form | record-page, unsaved-changes, form-validation | input, select |
| Import data (CSV, XLSX) | Wizard or App | Import Mapping | enterprise-apps (§ Import), multi-step-form | file-upload, stepper, table |
| One object (detail) | App | Record Header, Record Detail | record-page | description-list, tabs, navigation |
| Dashboard | App | Analytics, SaaS Metrics Dashboard, Commerce Admin, Sales Pipeline, Project Overview, Home Today, Executive Dashboard (examples "SaaS metrics dashboard", "Commerce admin") | reports, loading-states, empty-state | charts, card, indicators |
| Personal home after sign-in | App (no Page Header) | Home Today | notifications, ai-chat | boards-and-calendars (Agenda Item), list-and-tree (Task Item), ai-chat (AI Summary), card |
| Project home | App | Project Overview, Gantt for the full plan | record-page | boards-and-calendars, card (Progress Card), avatar, progress-and-slider |
| Admin panel, CMS (lists and editors of content) | Admin Panel (grid: Sidebar or Sidebar Double, Aside=on with a Side Panel beside editors, Aside=off for lists, actions bar fixed at the bottom) | Data table, Forms blocks | enterprise-apps, unsaved-changes | sidebar, drawer (Side Panel), table, card (Entity Card actions), list-and-tree (Sortable List Item) |
| Settings, admin, account (profile, notifications inbox, activity, sessions, delete account) | App | Settings Page with Tabs, Danger Zone, Profile, Team Members, Billing, Notification Preferences, API Keys, Integrations, Settings Section; starting screens on SCREENS / Settings and SCREENS / Account | settings-and-admin, unsaved-changes, delete-confirmation | input, select, card |
| Inbox, chat, tickets, files | Split View | Conversation (example "inbox") | search-and-filter, empty-state | navigation (split view), list-and-tree, comments-and-chat |
| Discussion on an object (task, document, invoice) | App (record page) | Comments | record-page | comments-and-chat, rich-text-editor |
| Create / edit form | App, or Sheet / Dialog over a list | Forms blocks, Field Presets | form-validation, form-presets, unsaved-changes | input, select, date-picker, file-upload, dialog, drawer |
| Dialog, sheet or palette over a list (create, delete, preview, ⌘K, upgrade) | App | Create Record Dialog, Delete Confirmation, Record Preview Sheet, Command Palette, Upgrade Dialog | common-flows, delete-confirmation, record-page, permissions-and-access, enterprise-apps | dialog, drawer, popover (Command Dialog), card (Plan Card) |
| Long or blocking flow (onboarding, setup, import) | Wizard | Multi-step Form, Onboarding Checklist, Welcome Role Select (starting screens: SCREENS / Auth, Onboarding) | multi-step-form | stepper, progress-and-slider |
| Sign in, sign up, reset, 2FA, invite, onboarding | Auth | Sign In Split, Sign Up Split, Sign In, Sign Up, Forgot Password, Check Email, Reset Password, Two-Factor, Accept Invite, Welcome Role Select; starting screens on SCREENS / Auth | auth, form-presets, multi-step-form | input (OTP) |
| Marketing page | Marketing | Banners (Announcement, with Action, Countdown, Floating), Navbar, Navbar Mobile, Hero (Centered, Split, with Screenshot, Prompt, with Logo Cloud, with Form, with Phone, Full-bleed Image, with Video, with Stats, Image Collage; all in example "Hero showcase"), Logo Cloud (Grid, Split, Marquee), Features (grid, Split, Bento, Bento Grid 2, with Screenshot, Tabs, How It Works, Checklist, Integrations Grid), Trust (Security and Compliance, Trust Strip), Stats (Cards, Split, Brand Band), Testimonials (Single, Grid, Split, Carousel), Pricing, Comparison Table, FAQ, CTA (band, Split, Card, with Screenshot), Newsletter (Split, Card), Team, Contact (Cards, with Map, Offices, Map Section), Navbar (Centered, Search, Mega Menu), Footer (Simple, Newsletter, Corporate, Centered) | marketing-pages, mobile | navigation (mega menu), card, accordion, carousel |
| Mobile app landing page | Marketing | Navbar, Hero with Phone, Features, Testimonials, CTA, Footer | marketing-pages, mobile | (Store Badge) |
| Pricing page | Marketing | Pricing with Comparison, Logo Marquee, Testimonial Grid, FAQ, CTA with Screenshot (example "Pricing page") | marketing-pages | card (Plan Card), tabs (Toggle Group), accordion |
| About page | Marketing | About Hero, Mission with Figures, Our Story, Values, Team Grid, Testimonial Single, Logos Split, CTA Card (example "About page") | marketing-pages | description-list (Figure, Timeline Item), content (Feature Item), avatar |
| Security or trust page | Marketing | Hero Centered, Security and Compliance, Trust Strip, FAQ, CTA Card | marketing-pages | badge (Trust Badge) |
| Blog, article, newsroom | Marketing | Blog Grid, Blog Featured, Blog List, Blog Post Header, Article, News List | content-and-docs | content (Post Card, Code Block, Table of Contents) |
| Inner page of a content or product site (detail, hub, search results, person, event, topic, report, legal) | Marketing | Header Detail, Header Listing, Header Search Results, Header Profile, Header Event, Header Topic, Header Report, Header Simple (Page Headers page), then Article, Blog List or sections | marketing-pages (§ Page headers), content-and-docs | content (Post Card compact for related links, Table of Contents), chip, badge |
| Careers, jobs | Marketing | Careers List, Careers Benefits, Job Header, Article | marketing-pages | badge, chip |
| Project plan with dates and dependencies | App | Gantt | (none) | boards-and-calendars |
| Contact page, locations | Marketing | Contact Cards, Contact with Map, Offices, Map Section, FAQ Grid (example "Contact page") | marketing-pages | input, image (Map) |
| Documentation, help center | Docs, Marketing | Navbar Search, Help Hero, Help Categories, Help Popular Articles, Help Article List, Support Options, Docs Page Footer (examples "docs page", "Help center") | content-and-docs | content, navigation |
| Changelog, status page | Marketing | Changelog, Status Page | content-and-docs | badge, alert |
| Board (stages) | App | Kanban Board | search-and-filter | boards-and-calendars |
| Calendar, schedule | App | Scheduler Week, Scheduler Month, Booking | booking | boards-and-calendars, date-picker |
| Store home | Marketing | Store Navbar, Storefront Hero, Incentives, Product Carousel, Category Tiles, Promo Section, Testimonial Grid (store reviews), Store Footer (example "Storefront home") | commerce, marketing-pages | card (Product Card), carousel, badge (Trust Badge) |
| Shop: category, product, cart, checkout | Marketing | Store Navbar, Category Filters, Product Grid, Product Detail, Product Quick View, Shopping Cart Page, Checkout Single Page, Order Confirmation, Order Summary, Address, Payment, Store Footer (examples "Category page", "Product page", "Cart page") | commerce, search-and-filter, form-presets | select (multi), input (number, group), drawer, carousel, rating, card (Product Card) |
| Pick a date and time | App or Marketing | Booking | booking | date-picker |
| Error, empty, success page | the current shell | Result | result-pages, empty-state | |
| Mobile screen | Mobile | Navbar Mobile | mobile | drawer, navigation |
| AI search results page | App | AI Search Answer, Load More (example "AI search page") | search-and-filter, ai-chat | ai-chat (AI Summary, Citation, Sources), pagination |
| AI assistant (chat page) | App (history in Sidebar) | AI Chat Empty, AI Conversation (example "AI chat app") | ai-chat, empty-state | ai-chat, comments-and-chat |
| AI on a screen (copilot panel, inline edit) | current shell | AI Assistant Panel, Inline AI | ai-chat | ai-chat, popover |
| AI summary or suggested values on a record or form | current shell | example "AI on a record page" (AI Summary, AI Suggestion, AI Notice) | ai-chat, forms | ai-chat, card |
| Agent doing a multi-step task, agent run page | App or panel | Agent Task Run (run page); example "agent at work" (Agent Plan, Artifact Card, Tool Call approval) | ai-chat, approvals, notifications | ai-chat |
| Transactional email (welcome, verify, sign-in link, reset, security notice, invite, invoice, receipt, payment failed, trial ending, digest, order confirmation) | Email template (600 column on a muted canvas; copy a `Screen / Email / *` from the Emails page) | Email / Header, Hero, Content, Button, Code, Details, Line Items, Callout, Stats, Article, Divider, Footer | email, auth, notifications, writing | (Email page) |

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
| accordion | Accordion, filter groups, Show More |
| ai-chat | Prompt Input, Attachment, User / Assistant Message, Reasoning, Tool Call, Sources, Citation, Prompt Suggestion, AI Suggestion, AI Summary, Agent Plan, Artifact Card, Chat History Item, Context Chip, Response Feedback, User Message, Voice Recorder, AI Loading, Confidence Indicator, AI Review Bar, Model Picker |
| alert | Alert inline and banner |
| avatar | Avatar, Avatar Group, Byline, Presence Bar |
| badge | Badge, Badge Count, Chip, Status Dot (see indicators), Badge List, Endpoint Row, Release Note Item, Announcement Pill, Trust Badge, Order Row |
| button | Button, Button Icon, Button Group, Split Button, Action Bar, FAB, Social Share |
| boards-and-calendars | Kanban Card, Kanban Column, Calendar Event, week and month view, Gantt Bar, Workflow Node, Agenda Item, Meeting Card |
| card | Card, Stat Card, Option Card, Post Card, Entity Card, Person Card, Event Card, Progress Card, Separator, Plan Card, Product Card, Address Card, Link Preview, Location Card, Integration Card |
| carousel | Carousel, Carousel Gallery, Carousel Hero, Image Placeholder, Lightbox |
| charts | Bar Chart, Bar Chart Horizontal, Line Chart, Donut Chart (donut, pie), Heatmap, Gauge, Treemap, Funnel Chart, Scatter Chart, Waterfall Chart, Combo Chart, Sparkline, Chart Card, Chart Legend, Chart Tooltip, Trend Indicator, Metric Strip, Dashboard Widget, Distribution Bar, Bullet Chart, Radar Chart, Sankey Chart, Choropleth Map |
| color-picker | Color Picker, Swatch, Swatch Picker, color field |
| comments-and-chat | Comment, Comment Composer, Chat Message, Typing Indicator, Chat Composer, Annotation Pin, Mention Chip, Reaction, Reaction Bar, Thread Summary |
| content | Section Heading, Feature Item, Post Card, Quote, Code Block, Table of Contents Item, Table of Contents, Command Snippet, Diff Line, Diff Viewer, JSON Viewer, Testimonial Card, Footnote, Image Compare Slider |
| date-picker | Calendar, Date Picker, Time Picker, Date Range Picker, Date Input |
| description-list | Description List, Meta Item, Figure, Summary Row, Timeline, Description List Item, Timeline Item |
| dialog | Dialog, Alert Dialog |
| drawer | Sheet, Drawer, Side Panel, Resizable Panels, Action Sheet |
| dropdown-menu | Menu, Menu Item, Menubar, Account Menu |
| file-upload | File Dropzone, File Item, File Preview, Resource Item, Avatar Upload, Image Cropper, File Field |
| indicators | Spinner, Status Dot, Kbd, Kbd Group, Shortcut Row, Loading Overlay, Service Status Row |
| input | Input, Field, Textarea, Input Group, Number Input, Input OTP, Inline Edit, Signature Pad, Copy Field, Search Field, Inline Form, Currency Input, Phone Input, Duration Input, Check Item, Range Input |
| list-and-tree | List Item, Tree Item, Sortable List Item, Scroll Area, Leaderboard Row, Log Row, Job Listing, Org Chart Node, Task Item |
| navigation | Breadcrumb, Top Bar, Page Header, Nav Link, Navigation Menu, Split View, Navigation Menu Panel, Back Link, Skip Link |
| pagination | Pagination, Pagination Compact, Load More |
| popover | Popover, Command, Combobox panel, Command Dialog, Hover Card, search suggestions, Emoji Picker, App Launcher, Confirm Popover, Notification Center, Mini Cart |
| progress-and-slider | Progress, Progress Ring, Slider, Usage Meter, Background Job |
| rating | Rating, Review Item, Rating Summary, Feedback Widget, NPS Survey, CSAT Rating |
| rich-text-editor | Rich Text Editor |
| select | Select, Combobox, Checkbox, Radio, Switch, Setting Row, Tag Input, People Picker, Transfer List, Faceted Filter, Address Autocomplete, Select Option, Recurrence Picker, Fieldset |
| sidebar | Sidebar and its parts, Sidebar Double, Org Switcher |
| skeleton | Skeleton |
| stepper | Step, Stepper, Shipment Tracker |
| table | Table cells, toolbar, inline edit, column resize, Data Grid Toolbar, Empty State, Filter Bar, Table Cell, Table Group Row, Table Pagination, Table Toolbar, Page Toolbar, Saved View Item |
| tabs | Tabs (default, line, vertical), Tab, Toggle Group |
| toast | Toast |
| tooltip | Tooltip |
| tour | Coachmark, Hotspot, spotlight |
| video-player | Video Player, Video Thumbnail, Audio Player |
