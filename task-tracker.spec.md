# Feature Specification: Personal Request and Task Tracker

**Feature Branch**: `[001-personal-task-tracker]`

**Created**: 2026-11-03

**Status**: Draft

**Input**: User description: "I get overwhelmed with tasks and want to structure my todos. I want to track tasks that have been given to me, capture the request, categorize the issue type, assign urgency, track status and response deadline, show overdue tickets, and record solution notes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Capture a request (Priority: P1)

As a person who receives tasks, I want to quickly record what was requested and when I need to respond, so I can get it out of my head and reliably follow up.

**Why this priority**: Capturing incoming work is the foundation of the tracker and immediately helps reduce the risk of forgetting requests.

**Independent Test**: Create a request with its description and response deadline, then find it in the task list with the saved details.

**Acceptance Scenarios**:

1. **Given** I am viewing my task list, **When** I enter a request description and save it, **Then** a task is created with a unique reference and a default status of `New`.
2. **Given** I am entering a request, **When** I provide its category, urgency, or response deadline, **Then** those values are saved with the request.
3. **Given** I do not yet know the category, urgency, or response deadline, **When** I save the request, **Then** I can leave those fields unset and identify the task as needing details.
4. **Given** a task has been saved, **When** I reopen it, **Then** I can read the original request and its recorded details.

---

### User Story 2 - Organize and prioritize work (Priority: P1)

As a person managing several requests, I want to categorize them and set urgency, so I can decide what to work on next without having to reread every request.

**Why this priority**: Categories and urgency make a growing task list easier to understand and act on.

**Independent Test**: Assign a category and urgency to several tasks, then filter or sort the list to locate the relevant work.

**Acceptance Scenarios**:

1. **Given** a task exists, **When** I assign an issue type, **Then** the selected type is visible in its details and the task list.
2. **Given** a task exists, **When** I set urgency to `Low`, `Normal`, `High`, or `Urgent`, **Then** the selected urgency is visible and can be used to prioritize the list.
3. **Given** tasks have different categories or urgency levels, **When** I filter or sort the task list, **Then** I can narrow the list by category and identify higher-urgency work.
4. **Given** I need to update the classification, **When** I edit a task's category or urgency, **Then** the updated value replaces the previous value.

---

### User Story 3 - Track progress and response deadlines (Priority: P1)

As a person responsible for responding to requests, I want to update task status and see which response deadlines have passed, so I can follow up before work is forgotten.

**Why this priority**: Progress and deadline visibility help ensure requests receive a timely response.

**Independent Test**: Change a task's status and deadline, then verify the task appears in the appropriate status view and is marked overdue when applicable.

**Acceptance Scenarios**:

1. **Given** a task is `New`, **When** I begin working on it, **Then** I can change its status to `In Progress`.
2. **Given** I cannot proceed until someone responds or provides information, **When** I update the task, **Then** I can set its status to `Waiting`.
3. **Given** a task has a response deadline before the current date and is not `Resolved` or `Closed`, **When** I view the task list, **Then** it is clearly marked overdue.
4. **Given** a task's response deadline is today, **When** I view the task list, **Then** it is identified as due today and is not marked overdue before the end of that day.
5. **Given** I complete the requested work, **When** I mark the task `Resolved` or `Closed`, **Then** it is no longer counted or displayed as overdue.
6. **Given** the response deadline changes, **When** I edit and save it, **Then** overdue status is recalculated from the updated deadline and current task status.

---

### User Story 4 - Record the outcome (Priority: P2)

As a person closing out a request, I want to record what I did to resolve it, so I can remember or communicate the solution later.

**Why this priority**: Solution notes preserve useful context, while the core value of capturing and tracking tasks can be delivered first.

**Independent Test**: Add solution notes to a resolved task, save, and reopen it to confirm the notes remain available.

**Acceptance Scenarios**:

1. **Given** a task has been addressed, **When** I enter solution notes and save them, **Then** the notes are retained with that task.
2. **Given** a task has solution notes, **When** I reopen its details, **Then** I can read and edit the notes.
3. **Given** a task is unresolved, **When** I have not yet written solution notes, **Then** I can still save and update the task.

---

### User Story 5 - Use a role-specific workspace (Priority: P1)

As an employee, supervisor, HR staff member, or administrator, I want to enter the workspace associated with my demo account, so I can focus on the requests and tools relevant to my role.

**Why this priority**: Role-specific workspaces make the tracker usable for a team while keeping each view relevant to its responsibilities.

**Independent Test**: Enter the app as each demo account and verify that the role-specific request list and available actions match the account's role.

**Acceptance Scenarios**:

1. **Given** I open the prototype, **When** I choose a demo account, **Then** the app opens that account's role-specific workspace.
2. **Given** I am an employee, **When** I open my requests, **Then** I see and manage only requests assigned to me.
3. **Given** I am a supervisor, **When** I open team requests, **Then** I see requests assigned to me and my direct reports and can assign requests to those team members.
4. **Given** I am HR, **When** I open HR requests, **Then** I see requests marked for the HR work area across employees.
5. **Given** I am an administrator, **When** I open the admin workspace, **Then** I can see all requests and change the role attached to local demo accounts.
6. **Given** I change a demo account's role as an administrator, **When** I return to account selection, **Then** that account opens the workspace for its updated role.

---

### Edge Cases

- A task without a response deadline is not marked overdue.
- A task due today is not overdue until the local calendar day has ended.
- Resolved and closed tasks are not marked overdue, even if their response deadlines have passed.
- If a task is reopened after resolution, its overdue status is recalculated using its response deadline.
- The task list must distinguish a missing deadline from a deadline that has passed.
- A task description is required; whitespace-only descriptions cannot be saved.
- Editing a task must not erase its existing notes or other fields unless the user changes them.
- An employee cannot see a request assigned to another employee.
- A supervisor cannot see requests assigned outside their direct reports in the prototype.
- HR views include only requests marked for the HR work area.
- The prototype must retain at least one Admin demo account to avoid removing the admin workspace.
- The account selector is a demo convenience, not proof of identity or authorization.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow the user to create, view, edit, and delete a task representing a request assigned to them.
- **FR-002**: The system MUST require a non-empty request description when creating a task.
- **FR-003**: The system MUST assign each task a unique reference and record its creation date.
- **FR-004**: The system MUST allow the user to record who or what the request came from, when known.
- **FR-005**: The system MUST allow a task to be categorized by issue type, including at minimum `Question`, `Incident`, `Request`, and `Other`.
- **FR-006**: The system MUST allow a task's urgency to be set to `Low`, `Normal`, `High`, or `Urgent`.
- **FR-007**: The system MUST allow a response deadline to be recorded, changed, or left unset.
- **FR-008**: The system MUST support the statuses `New`, `In Progress`, `Waiting`, `Resolved`, and `Closed`.
- **FR-009**: The system MUST display each task's request, category, urgency, status, and response deadline in its details.
- **FR-010**: The system MUST allow tasks to be filtered by status, issue type, and urgency, and sorted by response deadline and urgency.
- **FR-011**: The system MUST identify as overdue each task whose response deadline has passed and whose status is not `Resolved` or `Closed`.
- **FR-012**: The system MUST recalculate overdue status when the deadline, status, or current date changes.
- **FR-013**: The system MUST provide a way to view overdue tasks separately from tasks that are not overdue.
- **FR-014**: The system MUST allow the user to add and edit solution notes without requiring a task to be resolved.
- **FR-015**: The system MUST preserve task details and solution notes when a task is edited unless the user explicitly changes or deletes them.
- **FR-016**: The system MUST make tasks with missing response deadlines distinguishable from tasks with scheduled deadlines.
- **FR-017**: The prototype MUST provide separate role-specific workspaces for `Employee`, `Supervisor`, `HR`, and `Admin` demo accounts.
- **FR-018**: The prototype MUST associate each demo account with one role and open that role's workspace when the account is selected.
- **FR-019**: The prototype MUST show employees only requests assigned to their account.
- **FR-020**: The prototype MUST show supervisors requests assigned to themselves or their direct reports and allow assignment to those team members.
- **FR-021**: The prototype MUST show HR accounts requests marked for the `HR` work area, regardless of assignee.
- **FR-022**: The prototype MUST show administrators all requests and a demo account role-management view.
- **FR-023**: The prototype MUST allow an administrator to change demo account roles and MUST retain at least one Admin account.
- **FR-024**: The prototype MUST label demo account selection as non-secure and MUST warn users not to enter confidential information.
- **FR-025**: Role filtering in this browser-only prototype MUST be treated as a UI demonstration, not an authorization boundary.

### Key Entities *(include if feature involves data)*

- **Task**: A request assigned to an employee. It includes a unique reference, request description, requester/source (optional), assignee, work area, issue type, urgency, status, creation date, and optional response deadline.
- **Demo Account**: A local sample user with a name, role, team, and optional supervisor relationship. Demo accounts have no passwords and do not authenticate a real person.
- **Solution Notes**: User-entered notes describing work performed or the outcome. They belong to a task and may be empty until the task is addressed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The user can capture a task with its request description in under one minute.
- **SC-002**: The user can identify all overdue tasks from the task list in no more than two actions.
- **SC-003**: For tasks with a response deadline, overdue indicators correctly match the deadline and status in all tested combinations.
- **SC-004**: The user can find tasks by status, issue type, or urgency without manually scanning unrelated tasks.
- **SC-005**: Saved request details and solution notes remain available after navigating away from and reopening a task.
- **SC-006**: Each of the four demo roles opens the correct workspace and sees only its specified request scope.
- **SC-007**: An administrator can update demo account roles while preserving at least one Admin account.

## Assumptions

- This iteration is a local, single-browser role-based prototype; it does not provide real accounts, shared data, or cross-device synchronization.
- Demo users are sample accounts. The role chooser is not a sign-in or identity-verification mechanism.
- Employees see their assigned requests, supervisors see their direct reports' requests, HR sees HR work-area requests, and administrators see all local demo requests.
- Only an administrator can edit demo account roles through the prototype UI.
- The user can choose issue types from a small default list; custom issue types are not required for the initial version.
- Urgency is a user-assigned priority and is separate from the response deadline.
- Response deadlines are interpreted using the user's local date and time zone; a date-only deadline is due through the end of that local day.
- Tasks are retained until the user deletes them; automatic archival and retention policies are out of scope.
- The interface should favor quick capture and a clear, low-clutter overview to reduce cognitive load.
- The prototype stores demo accounts and requests in browser local storage. A production backend, database, authentication provider, and hosting target remain unspecified.
