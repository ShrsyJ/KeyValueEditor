# KeyValueEditor Constitution
<!--
Sync Impact Report
- Version change: [UNSET] -> 0.1.0
- Modified principles: [PRINCIPLE_1_NAME]..[PRINCIPLE_5_NAME] -> concrete principle names
- Added sections: SECTION_2_NAME -> Technology Constraints, SECTION_3_NAME -> Development Workflow
- Removed sections: none
- Templates requiring updates:
	- .specify/templates/plan-template.md: ⚠ pending (align runtime stack & constitution check)
	- .specify/templates/spec-template.md: ⚠ pending (remove auth assumptions; reflect persona switching design)
	- .specify/templates/tasks-template.md: ⚠ pending (adjust foundational tasks to SQLite + no external auth libs)
- Follow-up TODOs:
	- TODO(RATIFICATION_DATE): original adoption date unknown — please provide ratification date.
-->

## Core Principles

### I. Technology & Architecture (NON-NEGOTIABLE)
Use Python with FastAPI for the backend API, React for the frontend UI, and SQLite for persistent storage.
Implement clean, well-documented code with clear separation of concerns between API, services, and data layers. Choices favor minimal dependencies and portability.

### II. Test-First Quality (NON-NEGOTIABLE)
Tests must be written before implementation for all new features: unit tests, contract tests (API OpenAPI/contract checks), and integration tests where services interact. CI must run tests and block merges on failures.

### III. Authentication & Persona Switching (CONSTRAINT)
Do not introduce external authentication libraries. Persona switching is implemented in-app via a profile icon that switches active persona contexts without passwords (developer/QA personas only). Any authentication semantics must be explicit, audited, and documented; session handling must be secure and protected against common web threats.

### IV. API Stability & Contract-First Design
Public APIs MUST be defined with OpenAPI, versioned semantically, and maintained with backward compatibility guarantees where possible. Breaking changes require a documented migration path and version bump policy.

### V. Observability, Simplicity & Maintainability
Prefer simple, readable solutions over speculative complexity (YAGNI). Use structured logging, error classification, and basic metrics to make debugging and performance analysis straightforward.

## Technology Constraints
The project formally constrains the stack to:
- Backend: Python (FastAPI)
- Frontend: React
- Database: SQLite (embedded)
- No external authentication libraries (e.g., no OAuth/OpenID client packages or third-party auth SDKs). Persona switching via UI is allowed and must not store plaintext secrets.
All third-party dependencies must be reviewed for security and necessity; prefer standard libraries and small, well-maintained packages.

## Development Workflow
- Branching: feature branches per task, PR-based workflow, code review required for merges.
- CI: Linting, formatting, unit tests, contract tests (OpenAPI validation), and basic integration tests run on every PR.
- Formatting/Linting: Backend uses `black` + `ruff` (or similar); frontend uses `prettier` + `eslint`.
- Releases: Semantic versioning for the API and release notes documenting breaking changes and migration steps.
- Documentation: API contracts (OpenAPI), quickstart, and developer guide must be kept in `docs/`.

## Governance
Amendments to this constitution require a written proposal, a review by at least two maintainers, and a migration plan for any breaking changes. Minor wording fixes may be applied with a patch version bump; adding or removing principles requires a minor/major bump depending on scope.

All PRs should reference the relevant constitution principle(s) and show how the change complies. The constitution is the canonical source for mandatory engineering constraints.

**Version**: 0.1.0 | **Ratified**: TODO(RATIFICATION_DATE) | **Last Amended**: 2026-05-25
<!-- Example: Version: 2.1.1 | Ratified: 2025-06-13 | Last Amended: 2025-07-16 -->
