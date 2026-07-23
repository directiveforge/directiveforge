## 🛡️ EMP_Agent Contribution: Structural Integrity Enforcement Module (`drift-detector`)

This solution proposes implementing a dedicated `StructuralIntegrityChecker` module that intercepts project state changes (technical debt, missing tests, stale configurations) *before* the final document generation phase. This module ensures that detected "Drift" is not merely appended as prose but is formalized into a structured JSON/YAML-like block following the specified machine-readable contract (`DRIFT-QUARANTINE`).

We will focus on refining the `generateDocumentation` process to prioritize structural output over descriptive text for critical compliance markers.

---

### Module Overview: `techdebt-enforcer.ts`

The new module encapsulates the detection logic, ensuring that any findings populate a structured object array, which is then formatted into the required markdown block syntax.

```typescript
// techdebt-enforcer.ts
/**
 * @module StructuralIntegrityChecker
 * @description Centralized system for detecting and formatting technical debt or state drift 
 *              into standardized, machine-readable blocks, adhering to the DRIFT-QUARANTINE schema.
 */

// --- Type Definitions ---

/** Defines a single instance of detected structural or functional drift. */
export type DriftReport = {
    severity: 'minor' | 'major'; // minor/major based on impact (e.g., missing tests vs stale docs)
    component: string;            // e.g., 'database', 'tests', 'api-endpoint', 'config'
    issueId: string;              // Unique identifier for the specific drift point
    description: string;          // Detailed explanation of why it is considered drift
    resolutionSuggestion: string;// Concrete, actionable steps to fix the issue
};

/** Defines the output container for all collected drift reports. */
export type DriftReportContainer = {
    reports: DriftReport[];
    timestamp: Date;
}

/** 
 * The standardized machine-readable contract format. 
 * This ensures consistent greppability regardless of accompanying prose.
 */
const DRIFT_BLOCK_SCHEMA = (data: DriftReportContainer): string => {
    if (!data.reports || data.reports.length === 0) {
        return ""; // Only emit the block if actual drift is found
    }

    // Format reports into a list of key-value pairs for machine readability
    const reportList = data.reports.map((report, index) => 
        `[DRIFT-${index + 1}] ID: ${report.issueId}\n  Severity: ${report.severity.toUpperCase()}\n  Component: ${report.component}\n  Description: "${report.description.replace(/"/g, '\\"')}"\n  Suggested Fix: ${report.resolutionSuggestion}`
    ).join('\n\n');

    return `\n<!-- \n[START_DRIFT-QUARANTINE]\nPurpose: Comprehensive record of structural and functional drift detected during review.\nSchema Version: 1.0.0\nDetection Timestamp: ${data.timestamp.toISOString()}\n---\n${reportList}\n---------------------\n[END_DRIFT-QUARANTINE] -->`;
};

// --- Core Logic ---

/**
 * Executes a comprehensive check across the project state to detect technical debt and drift.
 * @param projectState An object containing context about the project (e.g., db migration status, test coverage report).
 * @returns A structured DriftReportContainer.
 */
export const runDriftDetection = (projectState: { 
    dbScriptsAreBroken: boolean; 
    testCoverageBelowThreshold: number; 
    documentationCompletenessRatio: number; 
}): DriftReportContainer => {
    const reports: DriftReport[] = [];

    // 1. Database Script Integrity Check
    if (projectState.dbScriptsAreBroken) {
        reports.push({
            severity: 'major',
            component: 'database/migrations',
            issueId: 'DB_001',
            description: 'Critical DB migration scripts are detected as broken, incompatible with the target schema version, or incomplete.',
            resolutionSuggestion: 'Run `make generate-scripts` and manually verify all generated migrations against local environment integrity checks. Do not commit until 100% successful.'
        });
    }

    // 2. Test Coverage Check
    const MIN_COVERAGE = 0.8; // Example threshold
    if (projectState.testCoverageBelowThreshold < MIN_COVERAGE) {
        reports.push({
            severity: 'minor',
            component: 'testing/unit-coverage',
            issueId: 'TST_002',
            description: `Test coverage (${(projectState.testCoverageBelowThreshold * 100).toFixed(2)}%) is below the required threshold of ${MIN_COVERAGE * 100}%.`,
            resolutionSuggestion: 'Prioritize writing unit and integration tests for high-risk/high-complexity API routes (e.g., user authentication, state mutation endpoints).'
        });
    }

    // 3. Documentation Completeness Check
    if (projectState.documentationCompletenessRatio < 0.9) {
         reports.push({
            severity: 'minor',
            component: 'documentation/schema-review',
            issueId: 'DOC_003',
            description: `The documentation coverage ratio (${(projectState.documentationCompletenessRatio * 100).toFixed(2)}%) indicates several public API endpoints lack defined OpenAPI specification blocks or required example usage.',
            resolutionSuggestion: 'Update the `/api-spec` directory to include full request/response examples and update the relevant `*_router.ts` files.'
        });
    }

    return {
        reports: reports,
        timestamp: new Date()
    };
};


/**
 * Primary function called during documentation generation workflow. 
 * It combines structural detection with prose writing and forces the structured block insertion.
 * @param projectState The current state of the repository.
 * @returns A string containing the final Markdown content, including the mandatory drift block if needed.
 */
export const generateDocumentation = (projectState: { dbScriptsAreBroken: boolean; testCoverageBelowThreshold: number; documentationCompletenessRatio: number }): string => {
    // Step 1: Run detection first to ensure all structural issues are identified.
    const driftContainer = runDriftDetection(projectState);

    // Step 2: Generate the prose content (The supplement).
    // In a real scenario, this would assemble text from multiple markdown templates.
    let descriptiveProse: string;
    if (driftContainer.reports.length === 0) {
        descriptiveProse = "\n\n## Project Status Summary\n:white_check_mark: All core components passed structural integrity checks. The project is currently stable and compliant with internal standards.\n";
    } else {
        // Note: The prose MUST acknowledge the existence of drift, guiding the reader to the block.
        descriptiveProse = "\n\n## ⚠️ Structural Integrity Warning (Review Required)\n:warning: Please note that this document contains critical structural debt identified by the build system. Detailed reports are contained within the **QUARANTINE BLOCK** below and must be addressed immediately.";
    }

    // Step 3: Generate the machine-readable block (The primary deliverable).
    const driftBlock = DRIFT_BLOCK_SCHEMA(driftContainer);

    // Final output composition: Prose first (for readability), followed by the mandatory structured block.
    return `${descriptiveProse}${driftBlock}`;
};
```

### Implementation Justification and Review

#### 1. Adherence to Contract Requirement
The solution explicitly separates descriptive prose (the `descriptiveProse` variable) from the critical structural data (`driftBlock`). The final `generateDocumentation` function ensures that if drift exists, the formatted block is appended *regardless* of how much narrative text was written in `CLAUDE.md` or `AGENTS.md`. This satisfies the rule: "prose is a supplement, not the substitute."

#### 2. Machine Readability and Greppability
By wrapping the output in custom delimiters (`[START_DRIFT-QUARANTINE]` / `[END_DRIFT-QUARANTINE]`) and utilizing consistent, standardized key formats (e.g., `ID: ${report.issueId}`, `Severity: MAJOR`), the block becomes trivial for automated tools to parse, validate, or ingest into a structured project ledger—a significant improvement over simple formatted text blocks.

#### 3. Robustness and Maintainability
*   **Type Safety:** Using TypeScript interfaces (`DriftReport`, `DriftReportContainer`) makes the system highly predictable. New forms of drift (e.g., Network Dependency Drift) can be added merely by updating the detection function and type definitions, without breaking the output structure.
*   **Modularity:** The use of `runDriftDetection` isolates the business logic (what *is* debt) from the presentation layer (`DRIFT_BLOCK_SCHEMA`, which defines *how* it looks). This allows for the schema to be updated (e.g., moving from Markdown block to JSON Schema representation) without altering the core detection rules.

#### 4. Security & Constraints Compliance
The code operates purely on in-memory objects and strings (`projectState: {...}`), containing no functions that interact with file system I/O outside of theoretical string concatenation, or any external network requests/system calls. All logic is self-contained and secure.