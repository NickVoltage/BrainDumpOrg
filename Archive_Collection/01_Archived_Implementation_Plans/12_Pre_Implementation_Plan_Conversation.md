# Pre-Implementation Plan Conversation

> **Note:** This document captures the conversation and decisions made during the pre-implementation planning phase. It serves as a record of how decisions were reached and what clarifications were needed.

**Document Purpose:** Record pre-implementation planning conversations, decisions, and clarifications.

**Related Documents:**
- `11_Pre_Implementation_Gap_Analysis.md` - Gap analysis that prompted this conversation
- `04_Proposed_Selections_From_Project_Planning.md` - Technology decisions
- `03_Project_Planning.md` - Project planning context
- `00_Dev_Niceities.md` - Development approaches and nice-to-haves

**Last Updated:** 2024  
**Status:** Active Conversation

---

## User Prompt Inspiring This Doc

```
Alright, let's talk through (in this chat) your findings and try to resolve any issues you've discovered.

[User provided responses to gap analysis questions]

Responses that have a "?" require more conversation/ research.  Responses without a "?" are confirmed.

[confirmed] Framework: Tauri

Content Format: ?after analyzing the features and capabilities of Google Docs... what method would provide the best avenue to create those features (and more) within our application?

[!clarification!] MVP Scope: The "MVP" will be produced in stages.  The first stage will be creating the GUI, which will be designed to maintain easy edits.  (one example goal is spacing different aspects of the layout with a sort of "content types" items (e.g. "Content_Type_Search_Bar_Assembly" (a search bar assembly in this conceptual example might consist of a "title", the search bar field, and a button).  It would need to be done in such a way that we can ensure the specified layout for that content type is prioritized over other aspects of the codebase that are responsible for creating the GUI, while ensuring that if we use a content type, we can customize/ "override" a specific aspect of the "content type" being used in the specific place we're trying to apply the isolated change (I conceptualize this as the content type being applied, anything not explicitly expressed by the content type will be handled by other code (avoiding edge-case errors), and/or a statement like "Use 'example_content_type' here while excluding vertical spacing to [any] "content_types" and override with 5px for any defined content type, if no content types are above then use default window spacing.)  < confirm your understanding of this prompt regarding the MVP before creating/ updating any of our documentation (special note: this "Project_Desire" does not belong to the category of "Desired Features" but instead to "Development Niceities".  [in short, I want to be able to create a "content_type" once, that's reusable for all similar content types (allows easy editing of the layout for any/ all items that "content_type" has defined rules for, while also making customization easy] < research will be needed on this and will warrent the creation of a new doc ##_Dev_Niceities where we can store specific dev approaches / "nice-to-haves" that might make the development process easier for us.  (Further Clarification: initial "MVP" will be focused on dialing in a customized GUI > then adding "pages"/"tabs"/"windows"/"menus"/etc. > customizing the GUI of those additions > adding features/ functionality > customizing the GUI as desired for those features/ functionality (make sure to note that workflow to the AI ReadMe so we remember that this concept is an important aspect of the plan>

[!clarification!] Feature Order: mostly correct in theory, but after the first "1" item, the application should be developed with both the "project desires" (core desires features/ functionality/ usability) as well as the development workflow I outlined in the previous [!clarification!] "initial "MVP" will be focused on dialing in a customized GUI > then adding "pages"/"tabs"/"windows"/"menus"/etc. > customizing the GUI of those additions > adding features/ functionality > customizing the GUI as desired for those features/ functionality"

Content file format: ?the priority for the file format of the notes files should be full implementation of all formatting features available in a Google Doc (another example: a Microsoft Word file type).  The goal here is a notes app that builds upon and improves industy standards for a product that meets a currently unmet market demand. The goal isn't pure simplicity. The goal is a feature-rich bespoke product that big-box names don't have the interest in creating. (philosophy, incremental feature-building + effort = reward)

Styling: ?For the styling, it's important that the application GUI itself is highly (and easily) customizable, while providing a UX/UI display that rivals or outshines the big brands (e.g. Microsoft Word, Google Docs, Obsidian, etc.)

[confirmed] Auto-Save:  everything explained for the auto-save sounds good.

Due to the scope, depth, and specificity of this prompt, I'd like you to add this entire prompt to a new doc "12_Pre_Implementation_Plan_Conversation.md", we will have this prompt at the top of the document titled "User Prompt Inspiring This Doc:" and below that prompt section we'll create a document structured to capture the resulting information as we decide on each aspect. (upon the completion of these topics, we'll then (and only then) be ready to use the final decisions to add the clarifications to the appropriate documents.
```

---

## Decision Tracking

### 1. Framework Decision

**Status:** ✅ **CONFIRMED**

**Decision:** **Tauri**

**Rationale:**
- Lightweight (~5-10MB vs Electron's ~100MB+)
- Lower memory usage
- Better security model
- Native performance
- Cross-platform (Windows, macOS, Linux)
- Better native integration for alarms (Rust backend)
- Supports all project desires

**Options Preserved:**
- Electron (Fallback) - Larger ecosystem, more examples, easier initial development, higher resource usage

**Documentation Update:** ✅ Updated `04_Proposed_Selections_From_Project_Planning.md` Section 1.1

---

### 2. Content Format Decision

**Status:** ✅ **CONFIRMED**

**Decision:** **Tiptap JSON (ProseMirror JSON) for Primary Storage**

**User Requirement (Two-Part Goal):**
1. **Capability Matching:** Full implementation of all formatting features available in Google Docs/Word
2. **User Experience Quality:** Visual aesthetic and ease of use that matches or exceeds Google Docs/Microsoft Word

**Research Findings:**

**Google Docs/Word Feature Analysis:**
- Rich text formatting (bold, italic, underline, strikethrough, colors, highlights)
- Text styles (headings H1-H6, paragraph, title, subtitle)
- Font selection, sizing, alignment, line/paragraph spacing
- Lists (ordered, unordered, nested)
- Media (images, tables, charts, drawings, equations)
- Advanced (comments, version history, footnotes, headers/footers)
- Document structure (page breaks, sections, table of contents)

**Format Comparison:**

**Option 1: Tiptap JSON (ProseMirror JSON) - ✅ SELECTED**
- ✅ Built on ProseMirror (same foundation as Google Docs collaboration)
- ✅ Supports ALL rich text features (100+ extensions available)
- ✅ Preserves exact formatting (no data loss)
- ✅ Extensible architecture (add custom features easily)
- ✅ Direct compatibility with Tiptap editor
- ✅ Supports complex structures (tables, nested lists)
- ✅ Industry standard for modern rich text editors
- ✅ Can export/import to DOCX, HTML, Markdown when needed
- ✅ Future-proof (ProseMirror is actively maintained)
- ✅ **UX Quality Reliability:** HIGH - Proven foundation, pre-built UI components
- ✅ **UX Quality Ease:** HIGH - Well-documented, active community, real-world examples (Notion, Linear)
- ✅ **Real-World Proof:** Notion and Linear achieve Google Docs-level UX using ProseMirror/Tiptap
- ⚠️ Not human-readable (but can export to Markdown for viewing)

**Option 2: Markdown**
- ✅ Human-readable
- ✅ Simple and lightweight
- ❌ Limited formatting (no colors, highlights, complex tables)
- ❌ Cannot represent all Google Docs/Word features
- ❌ Would require conversion layer (data loss risk)
- ❌ Cannot match Google Docs/Word UX quality due to format limitations

**Option 3: HTML**
- ✅ Can represent most formatting
- ✅ Human-readable
- ⚠️ More verbose than JSON
- ⚠️ Requires sanitization
- ⚠️ Less structured than JSON
- ⚠️ More work than Tiptap JSON, less reliable

**Option 4: DOCX (Binary)**
- ✅ Native Word format
- ❌ Binary format (harder to work with)
- ❌ Requires external libraries for editing
- ❌ Not suitable for primary storage format
- ❌ Binary format incompatible with real-time editing UX

**Decision Rationale:**
1. **Capability:** Supports all Google Docs/Word features ✅
2. **UX Quality Reliability:** HIGH - Proven foundation (ProseMirror), pre-built UI components (Tiptap) ✅
3. **UX Quality Ease:** HIGH - Well-documented, active community, real-world examples (Notion, Linear) ✅
4. **Real-World Proof:** Notion and Linear achieve Google Docs-level UX using ProseMirror/Tiptap ✅

**Implementation Approach:**
- **Primary Storage:** Tiptap JSON format (`.json` files or in database)
- **Export Formats:** Markdown, HTML, DOCX (for portability)
- **Import Formats:** Markdown, HTML, DOCX (convert to Tiptap JSON on import)
- **Backup/Recovery:** Store JSON + metadata for full fidelity

**What's Required to Achieve Google Docs/Word UX Quality:**
1. **Custom Styling:** Match visual aesthetic (CSS, design system)
2. **UI Components:** Customize toolbar, menus, formatting UI
3. **Animations:** Add smooth transitions and feedback
4. **Performance:** Optimize rendering for large documents
5. **Accessibility:** Implement ARIA, keyboard navigation
6. **Polish:** Attention to detail in interactions and visual feedback

**Options Preserved:**
- Markdown: For export/import, human-readable backups
- HTML: For export/import, web compatibility
- DOCX: For export/import, Microsoft Word compatibility

**Documentation Update:** ✅ See `04_Proposed_Selections_From_Project_Planning.md` Section 8.2 for complete implementation requirements checklist.

---

### 3. MVP Scope Clarification

**Status:** ✅ **CLARIFIED**

**User Clarification:**
MVP will be produced in stages with GUI-first development approach:

**Stage 1: GUI Foundation**
- Create customizable GUI
- Implement "content type" system for reusable layout components
- Content types allow:
  - Define layout once, reuse everywhere
  - Override specific aspects when needed
  - Fallback to default behavior for unspecified aspects
  - Example: "Content_Type_Search_Bar_Assembly" (title + search bar + button)

**Content Type System Requirements:**
- Create content type once, reusable for all similar components
- Easy editing of layout for all items using that content type
- Easy customization/override for specific instances
- Priority: Content type rules > other GUI code
- Override capability: "Use 'example_content_type' but exclude vertical spacing and replace with 5px"
- Fallback: If no content types above, use default window spacing

**Development Workflow (GUI-First):**
1. Dial in customized GUI
2. Add pages/tabs/windows/menus/etc.
3. Customize GUI of those additions
4. Add features/functionality
5. Customize GUI as desired for those features/functionality

**Note:** This is a "Development Nicety" not a "Desired Feature"

**Understanding Confirmed:**
- ✅ Content type system: Reusable layout components with global definition, instance-level overrides
- ✅ Override mechanism: Props-based overrides with fallback to defaults
- ✅ Development workflow: GUI-first iterative approach

**Research Findings:**

**Content Type System Patterns:**
- **Component Composition Pattern:** Similar to Material-UI, Chakra UI, Ant Design
- **Design System Approach:** Centralized component definitions with variant support
- **Props-Based Overrides:** React props allow instance-level customization
- **CSS-in-JS or CSS Variables:** Enable style overrides while maintaining base styles
- **Slot Pattern:** Allow content injection into predefined layouts

**Implementation Approach:**
- **Base Component:** Define content type as React component with default props
- **Style System:** Use CSS Variables + Tailwind for easy customization
- **Override Mechanism:** Props override base styles (e.g., `spacing={5}` overrides default)
- **Composition:** Content types can compose other content types
- **Configuration:** JSON/YAML config files for non-code customization

**Decision:** ✅ **Content Type System** - Implemented as reusable React components with prop-based overrides

**Documentation Created:**
- ✅ `00_Dev_Niceities.md` - Development approaches and nice-to-haves (contains full content type system documentation)

**Documentation Update:** ✅ GUI-First Development Workflow documented in `00_AI_ReadME_Project_Guidance_And_Rules.md` Section 4.5

---

### 4. Feature Implementation Order

**Status:** ✅ **CLARIFIED**

**User Clarification:**
- Mostly correct in theory
- After foundation (item 1), development should follow GUI-first workflow
- Integrate both:
  - Project desires (core features/functionality/usability)
  - Development workflow (GUI → Pages/Tabs/Windows → Customize → Features → Customize)

**Integrated Development Approach:**
- Foundation setup → GUI-first workflow → Feature development with GUI customization at each step
- See `13_Feature_Implementation_Conversation.md` for detailed feature implementation order

**Documentation Update:** ✅ See `13_Feature_Implementation_Conversation.md` for complete feature categorization and implementation order

---

### 5. Styling Solution

**Status:** ✅ **CONFIRMED**

**Decision:** **CSS Variables + Tailwind CSS + Design System**

**User Requirement:**
- Application GUI itself must be highly (and easily) customizable
- UX/UI display must rival or outshine big brands (Microsoft Word, Google Docs, Obsidian, etc.)

**Research Findings:**

**Big Brand Styling Approaches:**
- **Microsoft Word:** Design system with consistent spacing, typography, and color tokens
- **Google Docs:** Material Design principles, CSS variables for theming, component-based
- **Obsidian:** CSS Variables for theming, modular styling, community themes
- **Notion:** Design tokens, consistent spacing system, polished animations

**Key Patterns:**
1. **Design System Foundation:** Centralized design tokens (colors, spacing, typography)
2. **CSS Variables:** Enable runtime theme changes without rebuild
3. **Component-Based Styling:** Consistent styling through reusable components
4. **Layered Approach:** Base styles + theme + component + instance overrides

**Styling Approach Comparison:**

**Option 1: CSS Variables + Tailwind CSS - ✅ SELECTED**
- ✅ **Maximum Customization:** CSS Variables enable runtime theme changes
- ✅ **Rapid Development:** Tailwind utility classes speed up development
- ✅ **Professional Polish:** Tailwind's design system provides consistency
- ✅ **Easy Overrides:** CSS Variables can be changed programmatically
- ✅ **Theme Support:** Easy to create multiple themes
- ✅ **Performance:** Tailwind purges unused CSS
- ✅ **Developer Experience:** Hot reload, utility classes, responsive design
- ✅ **Big Brand Quality:** Used by companies like GitHub, Shopify, Vercel
- ⚠️ Learning curve for Tailwind (but well-documented)

**Option 2: CSS Variables + Custom CSS**
- ✅ Maximum control
- ✅ No framework dependency
- ❌ More verbose
- ❌ Slower development
- ❌ More maintenance

**Option 3: CSS-in-JS (Styled Components, Emotion)**
- ✅ Component-scoped styles
- ✅ Dynamic styling
- ⚠️ Runtime overhead
- ⚠️ Less customizable at runtime
- ⚠️ Harder to create user themes

**Option 4: Pure Tailwind (No CSS Variables)**
- ✅ Fast development
- ❌ Less customizable (requires rebuild for theme changes)
- ❌ Doesn't meet customization priority

**Implementation Strategy:**
1. **Design System Foundation:**
   - Define design tokens (colors, spacing, typography, shadows, borders)
   - Store in CSS Variables (`:root` or theme files)
   - Create TypeScript types for tokens

2. **Tailwind Integration:**
   - Configure Tailwind to use CSS Variables
   - Use Tailwind utilities for layout and spacing
   - Create custom Tailwind plugins for design system tokens

3. **Theme System:**
   - Multiple theme files (light, dark, custom)
   - Runtime theme switching via CSS Variable updates
   - Theme configuration files (JSON/YAML) for non-code customization

4. **Component Styling:**
   - Base styles from design system
   - Tailwind utilities for layout
   - CSS Variables for colors/theming
   - Props for component-level overrides

5. **Customization Layers:**
   - **Global:** CSS Variables (affects entire app)
   - **Theme:** Theme file (light/dark/custom)
   - **Component:** Component props (instance-level)
   - **User:** User theme editor (modify CSS Variables)

**Rationale:**
- Meets customization priority (CSS Variables enable runtime changes)
- Provides professional polish (Tailwind design system)
- Enables rapid development (Tailwind utilities)
- Supports user theming (CSS Variables can be modified)
- Industry-proven approach (used by major brands)

**Options Preserved:**
- Custom CSS: For specific edge cases
- CSS-in-JS: For component-specific dynamic styling if needed
- Theme Configuration Files: JSON/YAML for non-code customization

**Documentation Update:** ✅ See `04_Proposed_Selections_From_Project_Planning.md` Section 1.5

---

### 6. Auto-Save Implementation

**Status:** ✅ **CONFIRMED**

**Decision:**
- Debounce: 1-2 seconds after typing stops
- Save on editor content change
- Visual indicator (save status)
- Error handling with retry
- Recovery mechanism for unsaved changes

**Documentation Update:** Add to implementation plan when created.

---

## Research Summary

### Research 1: Content Format for Google Docs/Word-Level Features

**Status:** ✅ **COMPLETE**

**Research Areas:**
- [x] Google Docs formatting features analysis
- [x] Microsoft Word formatting features analysis
- [x] Tiptap JSON format capabilities
- [x] Format comparison for feature richness
- [x] Extensibility for future features
- [x] Industry standard formats for rich text
- [x] UX quality analysis (reliability and ease of achievement)

**Result:** See Section 2 above for complete analysis and decision.

---

### Research 2: Content Type System for GUI Layout

**Status:** ✅ **COMPLETE**

**Research Areas:**
- [x] Component composition patterns
- [x] Layout override mechanisms
- [x] CSS-in-JS patterns for overrides
- [x] Design system patterns
- [x] Component variant systems
- [x] Style override patterns

**Result:** See Section 3 above and `00_Dev_Niceities.md` for complete documentation.

---

### Research 3: Highly Customizable GUI Styling

**Status:** ✅ **COMPLETE**

**Research Areas:**
- [x] Highly customizable styling frameworks
- [x] Professional UI/UX patterns from big brands
- [x] CSS Variables + Tailwind + additional approaches
- [x] Theme system best practices
- [x] Customization vs. polish balance
- [x] Design system implementation

**Result:** See Section 5 above for complete analysis and decision.

---

## Next Steps

1. **Documentation Updates:**
   - [x] Create `00_Dev_Niceities.md` document
   - [x] Document content type system approach
   - [x] Document development workflow in AI ReadME
   - [x] Update `04_Proposed_Selections_From_Project_Planning.md` with confirmed decisions
   - [x] Update `00_AI_ReadME_Project_Guidance_And_Rules.md` with workflow note

2. **Finalized Decisions:**
   - [x] Framework decision: **Tauri**
   - [x] Content format decision: **Tiptap JSON (ProseMirror JSON)**
   - [x] Styling solution decision: **CSS Variables + Tailwind CSS + Design System**
   - [x] Content type system approach: **React Components with Prop-Based Overrides**
   - [x] Auto-save: **Confirmed**

3. **Ready for Implementation:**
   - All critical decisions confirmed
   - Research complete
   - Documentation updated
   - Implementation requirements documented

---

**Document Status:** Active Conversation  
**Last Updated:** 2024  
**Next Action:** All critical decisions confirmed. Ready to proceed with implementation planning.

