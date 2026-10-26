# Component reference

One file per component page of the EGG UI master library, generated on 2026-10-26.
Each component lists its variants, properties with defaults, slots, the components and icons
it is built from, the tokens and styles it uses, its usage guides and its code mapping. Main
components also list when to use them, anatomy, rules and accessibility from
`skills/tidy-component/docs.json`, the same content as the Docs frame on the Figma page.

## Regenerate

1. Run `scripts/component-docs.js` with `use_figma` on the master library, a few pages per call
   (set `PAGES`), and save each returned JSON to a file.
2. Run `python3 plugins/eggux/scripts/component-docs.py <json files>`.
3. Review the diff; commit with the release.

## Pages

| Page | Components |
|---|---|
| [Accordion](accordion.md) | Accordion, Accordion Item, Show More |
| [Admin](admin.md) | Integration Card, Permission Row, API Key Row, Session Row, Org Chart Node |
| [AI Chat](ai-chat.md) | Prompt Input, Attachment, User Message, Assistant Message, Reasoning, Tool Call, Sources, Source Item, Citation, Prompt Suggestion, Model Picker, Model Option, Chat History Item, Context Chip, Response Feedback, Voice Recorder, Agent Plan, Plan Step, Artifact Card, AI Summary, AI Notice, AI Suggestion, AI Loading, Confidence Indicator, AI Review Bar |
| [Alert](alert.md) | Alert, Service Status Row, Uptime Bars, Uptime Day |
| [Approvals](approvals.md) | Approval Step |
| [Audit](audit.md) | Change Item, Version Item, Release Note Item, Release Note Line |
| [Automation](automation.md) | Automation Rule, Workflow Node, Mapping Row |
| [Avatar](avatar.md) | Avatar, Avatar Group, Byline, Presence Bar |
| [Badge](badge.md) | Badge, Badge Count, Status Dot, Badge List, Announcement Pill, Trust Badge |
| [Brand](brand.md) | Logo Mark, Logo, Logo Tile, Logo / Northwind, Logo / Lumora, Logo / Orbitly, Logo / Fieldstone, Logo / Kestrel, Logo / Quintra, Logo / Halcyon, Logo / Brightpath, Logo / Corvid, Logo / Meridian, Logo / Tidewater, Logo / Vireo |
| [Button](button.md) | Button, Button Icon, Button Group, Button Group Item, Split Button, Action Bar, Social Share |
| [Calendar](calendar.md) | Calendar, Calendar Day, Date Picker, Time Picker, Date Range Picker |
| [Card](card.md) | Card, Card Header, Card Footer, Stat Card, Option Card, Post Card, Entity Card, Progress Card, Person Card, Event Card, Date Tile, Link Preview, Location Card |
| [Carousel](carousel.md) | Carousel, Carousel Arrow, Carousel Indicator, Carousel Slide, Carousel Gallery, Carousel Thumbnail, Carousel Hero, Lightbox |
| [Chart](chart.md) | Bar Chart, Bar Chart Horizontal, Line Chart, Sparkline, Donut Chart, Heatmap, Gauge, Treemap, Funnel Chart, Scatter Chart, Chart Legend, Chart Legend Item, Chart Tooltip, Chart Tooltip Row, Chart Card, Waterfall Chart, Combo Chart, Dashboard Widget, Distribution Bar, Bullet Chart, Radar Chart, Sankey Chart, Choropleth Map |
| [Chat](chat.md) | Chat Message, Typing Indicator, Chat Composer, Mention Chip, Reaction Bar, Reaction, Thread Summary |
| [Chip](chip.md) | Chip |
| [Code Block](code-block.md) | Code Block, Command Snippet, Endpoint Row, Log Row, Diff Viewer, Diff Line, JSON Viewer |
| [Color Picker](color-picker.md) | Color Picker, Swatch Picker, Swatch |
| [Commerce](commerce.md) | Product Card, Line Item, Mini Cart, Order Row, Shipment Tracker, Address Card, Payment Method Card |
| [Cookie Consent](cookie-consent.md) | Cookie Consent |
| [Description List](description-list.md) | Description List Item, Meta Item, Figure, Summary Row |
| [Dialog](dialog.md) | Dialog, Dialog Header, Dialog Footer, Alert Dialog |
| [Drawer](drawer.md) | Sheet, Drawer, Side Panel, Resizable Panels |
| [Editor](editor.md) | Rich Text Editor, Comment, Comment Composer |
| [Empty State](empty-state.md) | Empty State |
| [Feature Item](feature-item.md) | Feature Item |
| [File Upload](file-upload.md) | File Dropzone, File Item, File Preview, Resource Item, File Field |
| [Filters](filters.md) | Filter Bar, Filter Chip, Faceted Filter, Facet Option, Filter Section, Filter Group, Filter Condition, Saved View Item |
| [Form Layout](form-layout.md) | Form Section, Fieldset, Error Summary, Requirement List, Check Item |
| [Form Presets](form-presets.md) | Field Preset |
| [Image](image.md) | Image Placeholder, Map, Image Cropper, Avatar Upload, Image Compare Slider, Device Frame, Image Figure |
| [Input](input.md) | Input, Field, Password Strength, Textarea, Input Group, Input Addon, Number Input, Inline Edit, Signature Pad, Copy Field, Search Field, Inline Form, Currency Input, Phone Input, Date Input, Duration Input, Range Input |
| [Input OTP](input-otp.md) | Input OTP, OTP Slot |
| [Kanban](kanban.md) | Kanban Card, Kanban Column |
| [Kbd](kbd.md) | Kbd, Kbd Group, Shortcut Row |
| [List](list.md) | List Item, Sortable List Item, Task Item, Job Listing |
| [Menu](menu.md) | Menu, Menu Item, Menu Label, Menubar, Menubar Trigger, Account Menu |
| [Metrics](metrics.md) | Trend Indicator, Metric Strip, Metric Strip Item, Usage Meter, Countdown, Leaderboard Row |
| [Mobile](mobile.md) | Mobile Header, Bottom Nav, Bottom Nav Item, FAB, Action Sheet |
| [Navigation](navigation.md) | Breadcrumb, Breadcrumb Item, Top Bar, Page Header, Nav Link, Navigation Menu Panel, Navigation Menu Link, Table of Contents, Table of Contents Item, Back Link, Skip Link, Page Toolbar |
| [Notifications](notifications.md) | Notification Item, Notification Center |
| [Pagination](pagination.md) | Pagination, Pagination Item, Pagination Compact, Load More, Pager Link |
| [Popover](popover.md) | Popover, Command, Command Input, Command Dialog, Hover Card, Emoji Picker, App Launcher, Confirm Popover |
| [Pricing](pricing.md) | Price, Plan Card |
| [Progress](progress.md) | Progress, Progress Ring, Background Job |
| [Quote](quote.md) | Quote, Testimonial Card, Footnote |
| [Rating](rating.md) | Rating, Review Item, Rating Summary |
| [Save Bar](save-bar.md) | Save Bar |
| [Scheduler](scheduler.md) | Calendar Event, Gantt Bar, Gantt Milestone, Agenda Item, Meeting Card, Availability Row, Time Slot |
| [Scroll Area](scroll-area.md) | Scroll Area |
| [Search](search.md) | Search Result Item |
| [Section Heading](section-heading.md) | Section Heading |
| [Select](select.md) | Select, Combobox, Tag Input, Tag, People Picker, Person Option, Transfer List, Address Autocomplete, Select Option, Recurrence Picker |
| [Selection controls](selection-controls.md) | Checkbox, Radio, Switch, Setting Row |
| [Separator](separator.md) | Separator |
| [Sharing](sharing.md) | Access Row, Invite Row, Share Link Row |
| [Sidebar](sidebar.md) | Sidebar, Sidebar Item, Sidebar Group Label, Sidebar Group, Sidebar Workspace, Sidebar User, Org Switcher, Sidebar Double |
| [Skeleton](skeleton.md) | Skeleton |
| [Slider](slider.md) | Slider |
| [Spinner](spinner.md) | Spinner, Loading Overlay |
| [Stepper](stepper.md) | Stepper, Step |
| [Surveys](surveys.md) | Feedback Widget, NPS Survey, CSAT Rating |
| [Table](table.md) | Table Cell, Table Header Label, Table Cell Text, Table Cell Stack, Table Cell User, Table Cell Amount, Table Cell Status, Table Cell Progress, Table Cell Actions, Table Cell Link, Table Cell Date, Table Cell File, Table Cell Badges, Table Cell Avatars, Table Cell Check, Table Toolbar, Data Grid Toolbar, Table Group Row, Table Pagination |
| [Tabs](tabs.md) | Tab, Tabs |
| [Timeline](timeline.md) | Timeline Item |
| [Toast](toast.md) | Toast |
| [Toggle Group](toggle-group.md) | Toggle Group, Toggle Group Item |
| [Tooltip](tooltip.md) | Tooltip |
| [Tour](tour.md) | Coachmark, Hotspot, Annotation Pin |
| [Tree](tree.md) | Tree Item |
| [Video](video.md) | Video Player, Video Thumbnail, Audio Player |

357 components on 72 pages.
