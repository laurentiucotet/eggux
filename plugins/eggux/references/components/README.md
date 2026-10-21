# Component reference

One file per component page of the EGG UI master library, generated on 2026-10-21.
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
| [Accordion](accordion.md) | Accordion, Accordion Item |
| [AI Chat](ai-chat.md) | Attachment, Prompt Input, User Message, Assistant Message, Reasoning, Tool Call, Source Item, Sources, Citation, Suggestion, Model Option, Model Selector, Chat History Item, Context Chip, Response Feedback, Voice Recorder, AI Notice, Plan Step, Agent Plan, Artifact Card, AI Summary, AI Suggestion |
| [Alert](alert.md) | Alert |
| [Approvals](approvals.md) | Approval Step |
| [Audit](audit.md) | Change Item |
| [Avatar](avatar.md) | Avatar, Avatar Group |
| [Badge](badge.md) | Badge, Badge Count, Status Dot |
| [Brand](brand.md) | Logo Mark, Logo |
| [Button](button.md) | Button, Button Icon, Button Group Item, Button Group, Split Button |
| [Calendar](calendar.md) | Calendar Day, Calendar, Date Picker, Time Picker, Date Range Picker |
| [Card](card.md) | Card, Card Header, Card Footer, Stat Card, Option Card, Post Card, Entity Card, Person Card, Event Card, Date Tile, Progress Card |
| [Carousel](carousel.md) | Carousel, Carousel Arrow, Carousel Indicator, Carousel Thumbnail, Carousel Slide, Carousel Gallery, Carousel Hero, Lightbox |
| [Chart](chart.md) | Chart Legend Item, Chart Legend, Chart Tooltip Row, Chart Tooltip, Bar Chart, Line Chart, Sparkline, Chart Card, Donut Chart, Bar Chart Horizontal, Heatmap, Gauge, Treemap, Funnel Chart, Scatter Chart |
| [Chat](chat.md) | Chat Message, Typing Indicator, Chat Composer |
| [Chip](chip.md) | Chip |
| [Code Block](code-block.md) | Code Block |
| [Color Picker](color-picker.md) | Color Picker |
| [Cookie Consent](cookie-consent.md) | Cookie Consent |
| [Description List](description-list.md) | Description List Item, Meta Item, Figure |
| [Dialog](dialog.md) | Dialog Header, Dialog Footer, Dialog, Alert Dialog |
| [Drawer](drawer.md) | Sheet, Drawer, Side Panel |
| [Editor](editor.md) | Rich Text Editor, Comment, Comment Composer |
| [Empty State](empty-state.md) | Empty State |
| [File Upload](file-upload.md) | File Dropzone, File Item, File Preview, Resource Item |
| [Filters](filters.md) | Filter Condition, Filter Group, Filter Chip, Facet Option, Faceted Filter, Filter Section, Filter Bar |
| [Form Presets](form-presets.md) | Field Preset |
| [Image](image.md) | Image Placeholder, Map, Image Cropper, Avatar Upload |
| [Input](input.md) | Input, Field, Password Strength, Textarea, Input Addon, Input Group, Number Input, Inline Edit, Signature Pad |
| [Input OTP](input-otp.md) | OTP Slot, Input OTP |
| [Kanban](kanban.md) | Kanban Card, Kanban Column |
| [Kbd](kbd.md) | Kbd, Kbd Group |
| [List & Tree](list-and-tree.md) | List Item, Tree Item, Sortable List Item |
| [Menu](menu.md) | Menu Item, Menu Label, Menu, Menubar Trigger, Menubar |
| [Mobile](mobile.md) | Mobile Header, Bottom Nav Item, Bottom Nav |
| [Navigation](navigation.md) | Breadcrumb Item, Breadcrumb, Top Bar, Page Header, Nav Link, Navigation Menu Link, Navigation Menu Panel, TOC Item, Table of Contents |
| [Pagination](pagination.md) | Pagination Item, Pagination |
| [Popover](popover.md) | Popover, Command Input, Command, Hover Card, Command Dialog |
| [Progress](progress.md) | Progress, Progress Ring |
| [Quote](quote.md) | Quote |
| [Rating](rating.md) | Rating |
| [Save Bar](save-bar.md) | Save Bar |
| [Scheduler](scheduler.md) | Calendar Event, Gantt Bar, Gantt Milestone |
| [Scroll Area](scroll-area.md) | Scroll Area |
| [Select](select.md) | Select, Combobox, Tag, Tag Input, Person Option, People Picker, Transfer List |
| [Selection controls](selection-controls.md) | Checkbox, Radio, Switch, Setting Row |
| [Separator](separator.md) | Separator |
| [Sidebar](sidebar.md) | Sidebar, Sidebar Item, Sidebar Group Label, Sidebar Group, Sidebar Workspace, Sidebar User, Org Switcher, Sidebar Double |
| [Skeleton](skeleton.md) | Skeleton |
| [Slider](slider.md) | Slider |
| [Spinner](spinner.md) | Spinner |
| [Stepper](stepper.md) | Step, Stepper |
| [Table](table.md) | Table Header Label, Table Cell Text, Table Cell Stack, Table Cell User, Table Cell, Table Toolbar, Data Grid Toolbar, Table Group Row, Table Cell Amount, Table Cell Status, Table Cell Progress, Table Cell Actions, Table Pagination |
| [Tabs](tabs.md) | Tabs, Tab, Tabs Line |
| [Timeline](timeline.md) | Timeline Item |
| [Toast](toast.md) | Toast |
| [Toggle Group](toggle-group.md) | Toggle Group Item, Toggle Group |
| [Tooltip](tooltip.md) | Tooltip |
| [Tour](tour.md) | Coachmark, Hotspot |
| [Video](video.md) | Video Player |

215 components on 59 pages.
