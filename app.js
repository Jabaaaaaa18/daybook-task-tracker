(() => {
  const STORAGE_KEY = "daybook.tasks.v1";
  const USERS_KEY = "daybook.demo-users.v1";
  const STATUSES = ["New", "In Progress", "Waiting", "Resolved", "Closed"];
  const ROLES = ["Employee", "Supervisor", "HR", "Admin"];
  const DEFAULT_USERS = [
    { id: "john-aldrin", name: "John Aldrin", email: "john@example.test", role: "Employee", team: "Finance", reportsTo: "morgan-lee" },
    { id: "avery-patel", name: "Avery Patel", email: "avery@example.test", role: "Employee", team: "Operations", reportsTo: "morgan-lee" },
    { id: "sam-rivera", name: "Sam Rivera", email: "sam@example.test", role: "Employee", team: "Operations", reportsTo: "morgan-lee" },
    { id: "morgan-lee", name: "Morgan Lee", email: "morgan@example.test", role: "Supervisor", team: "Operations", reportsTo: "" },
    { id: "taylor-kim", name: "Taylor Kim", email: "taylor@example.test", role: "HR", team: "People", reportsTo: "" },
    { id: "casey-chen", name: "Casey Chen", email: "casey@example.test", role: "Admin", team: "Administration", reportsTo: "" }
  ];
  const ROLE_DESCRIPTIONS = {
    Employee: "Your assigned requests and personal follow-ups.",
    Supervisor: "Your team's workload, ownership, and deadlines.",
    HR: "HR-related requests across the organization.",
    Admin: "All requests and local demo account roles."
  };
  const URGENCY_ORDER = { Urgent: 0, High: 1, Normal: 2, Low: 3, "": 4 };
  const CATEGORY_ICONS = {
    Question: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M9.8 9a2.3 2.3 0 1 1 3.8 1.7c-1 .9-1.6 1.1-1.6 2.5M12 17h.01"/></svg>',
    Incident: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 21 20H3l9-16.5Z"/><path d="M12 9v4.5M12 17h.01"/></svg>',
    Request: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.5h12v15H6zM9 8h6M9 12h6M9 16h3"/></svg>',
    Other: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/></svg>',
    Default: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5h8l3 3v12H7z"/><path d="M15 4.5v4h4M10 12h5M10 15.5h5"/></svg>'
  };
  const elements = {
    loginScreen: document.querySelector("#login-screen"),
    roleOptions: document.querySelector("#role-options"),
    appShell: document.querySelector("#app-shell"),
    switchAccount: document.querySelector("#switch-account"),
    profileName: document.querySelector("#profile-name"),
    profileRole: document.querySelector("#profile-role"),
    sidebarLabel: document.querySelector("#sidebar-label"),
    navAllLabel: document.querySelector("#nav-all-label"),
    navOpenLabel: document.querySelector("#nav-open-label"),
    navOverdueLabel: document.querySelector("#nav-overdue-label"),
    navResolvedLabel: document.querySelector("#nav-resolved-label"),
    statsGrid: document.querySelector("#stats-grid"),
    taskSection: document.querySelector(".tasks-section"),
    userManagementSection: document.querySelector("#user-management-section"),
    userList: document.querySelector("#user-list"),
    usersCount: document.querySelector("#users-count"),
    usersNav: document.querySelector("[data-view='users']"),
    welcomeEyebrow: document.querySelector("#welcome-eyebrow"),
    newTaskButton: document.querySelector("#new-task-button"),
    taskWorkArea: document.querySelector("#task-work-area"),
    taskAssignee: document.querySelector("#task-assignee"),
    assigneeField: document.querySelector("#assignee-field"),
    allCount: document.querySelector("#all-count"),
    openCount: document.querySelector("#open-count"),
    overdueCount: document.querySelector("#overdue-count"),
    resolvedCount: document.querySelector("#resolved-count"),
    totalStat: document.querySelector("#total-stat"),
    openStat: document.querySelector("#open-stat"),
    dueSoonStat: document.querySelector("#due-soon-stat"),
    overdueStat: document.querySelector("#overdue-stat"),
    listCount: document.querySelector("#list-count"),
    listDescription: document.querySelector("#list-description"),
    listHeading: document.querySelector("#list-heading"),
    listFooter: document.querySelector("#list-footer"),
    footerCount: document.querySelector("#footer-count"),
    taskList: document.querySelector("#task-list"),
    emptyState: document.querySelector("#empty-state"),
    emptyTitle: document.querySelector("#empty-title"),
    emptyCopy: document.querySelector("#empty-copy"),
    clearFilters: document.querySelector("#clear-filters"),
    search: document.querySelector("#search-input"),
    statusFilter: document.querySelector("#status-filter"),
    categoryFilter: document.querySelector("#category-filter"),
    urgencyFilter: document.querySelector("#urgency-filter"),
    sort: document.querySelector("#sort-select"),
    dialog: document.querySelector("#task-dialog"),
    form: document.querySelector("#task-form"),
    dialogTitle: document.querySelector("#dialog-title"),
    description: document.querySelector("#task-description"),
    descriptionError: document.querySelector("#description-error"),
    id: document.querySelector("#task-id"),
    category: document.querySelector("#task-category"),
    urgency: document.querySelector("#task-urgency"),
    deadline: document.querySelector("#task-deadline"),
    status: document.querySelector("#task-status"),
    requester: document.querySelector("#task-requester"),
    workArea: document.querySelector("#task-work-area"),
    assignee: document.querySelector("#task-assignee"),
    notes: document.querySelector("#task-notes"),
    deleteButton: document.querySelector("#delete-task-button"),
    saveButton: document.querySelector("#save-task-button"),
    toast: document.querySelector("#toast"),
    storageWarning: document.querySelector("#storage-warning"),
    breadcrumb: document.querySelector("#view-breadcrumb"),
    pageTitle: document.querySelector("#page-title"),
    pageSubtitle: document.querySelector("#page-subtitle"),
    listDescriptionDefault: document.querySelector("#list-description").textContent,
    todayLabel: document.querySelector("#today-label")
  };
  let storageProblem = "";
  let toastTimer;
  let currentView = "all";
  let users = loadUsers();
  let activeUser = null;
  let tasks = loadTasks();

  function localDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function parseDate(dateString) {
    if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return null;
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
    return date;
  }

  function formatDate(dateString, options = { month: "short", day: "numeric" }) {
    const date = parseDate(dateString);
    return date ? new Intl.DateTimeFormat(undefined, options).format(date) : "No deadline";
  }

  function isComplete(task) {
    return task.status === "Resolved" || task.status === "Closed";
  }

  function isOverdue(task) {
    return Boolean(task.deadline && task.deadline < localDateString() && !isComplete(task));
  }

  function isDueSoon(task) {
    if (!task.deadline || isComplete(task)) return false;
    const today = parseDate(localDateString());
    const deadline = parseDate(task.deadline);
    if (!today || !deadline) return false;
    const daysUntil = Math.round((deadline - today) / 86400000);
    return daysUntil >= 0 && daysUntil <= 2;
  }

  function isValidTask(task) {
    return task && typeof task.id === "string" && typeof task.reference === "string" &&
      typeof task.description === "string" && typeof task.status === "string" &&
      STATUSES.includes(task.status) && typeof task.createdAt === "string" &&
      (task.deadline === "" || (typeof task.deadline === "string" && parseDate(task.deadline)));
  }

  function isValidUser(user) {
    return user && typeof user.id === "string" && typeof user.name === "string" &&
      typeof user.email === "string" && ROLES.includes(user.role) &&
      typeof user.team === "string" && typeof user.reportsTo === "string";
  }

  function loadUsers() {
    try {
      const saved = localStorage.getItem(USERS_KEY);
      if (saved === null) return DEFAULT_USERS.map(user => ({ ...user }));
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || !parsed.every(isValidUser)) {
        throw new Error("The demo account data is not in the expected format.");
      }
      return parsed;
    } catch (error) {
      const detail = error instanceof Error ? error.message : "The browser could not read demo accounts.";
      showStorageProblem(`Demo accounts could not be loaded. ${detail}`);
      return DEFAULT_USERS.map(user => ({ ...user }));
    }
  }

  function saveUsers(nextUsers) {
    if (storageProblem) return false;
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
      users = nextUsers;
      return true;
    } catch (error) {
      const detail = error instanceof Error ? error.message : "The browser could not save demo accounts.";
      showStorageProblem(`Your account change was not saved. ${detail}`);
      return false;
    }
  }

  function getUser(id) {
    return users.find(user => user.id === id);
  }

  function getRoleUsers(role) {
    return users.filter(user => user.role === role);
  }

  function isVisibleToActiveUser(task) {
    if (!activeUser) return false;
    if (activeUser.role === "Admin") return true;
    if (activeUser.role === "HR") return task.workArea === "HR";
    if (activeUser.role === "Supervisor") {
      const teamIds = new Set(users.filter(user => user.reportsTo === activeUser.id).map(user => user.id));
      return teamIds.has(task.assignedTo) || task.assignedTo === activeUser.id;
    }
    return task.assignedTo === activeUser.id;
  }

  function canEditTask(task) {
    if (!activeUser) return false;
    if (activeUser.role === "Admin") return true;
    if (activeUser.role === "HR") return task.workArea === "HR";
    if (activeUser.role === "Supervisor") {
      const assignee = getUser(task.assignedTo);
      return task.assignedTo === activeUser.id || Boolean(assignee && assignee.reportsTo === activeUser.id);
    }
    return task.assignedTo === activeUser.id;
  }

  function showStorageProblem(message) {
    storageProblem = message;
    elements.storageWarning.textContent = message;
    elements.storageWarning.hidden = false;
    document.querySelector("#new-task-button").disabled = true;
    document.querySelector("#empty-create-button").disabled = true;
    elements.saveButton.disabled = true;
    elements.deleteButton.disabled = true;
  }

  function loadTasks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === null) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || !parsed.every(isValidTask)) {
        throw new Error("The saved request data is not in the expected format.");
      }
      return parsed.map(task => ({
        ...task,
        assignedTo: typeof task.assignedTo === "string" && task.assignedTo ? task.assignedTo : "john-aldrin",
        workArea: typeof task.workArea === "string" ? task.workArea : ""
      }));
    } catch (error) {
      const detail = error instanceof Error ? error.message : "The browser could not read saved requests.";
      showStorageProblem(`Your saved requests could not be loaded. They have not been changed. ${detail}`);
      return [];
    }
  }

  function commitTasks(nextTasks, successMessage) {
    if (storageProblem) return false;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks));
      tasks = nextTasks;
      render();
      if (successMessage) showToast(successMessage);
      return true;
    } catch (error) {
      const detail = error instanceof Error ? error.message : "The browser could not save your requests.";
      showStorageProblem(`Your change was not saved. Check this browser's storage settings and try again. ${detail}`);
      return false;
    }
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function statusClass(status) {
    return `status-${status.toLowerCase().replace(/\s+/g, "-")}`;
  }

  function deadlineMarkup(task) {
    if (!task.deadline) {
      return '<div class="deadline-cell"><span class="deadline-main">No deadline</span><span class="deadline-hint">Not set</span></div>';
    }
    const overdue = isOverdue(task);
    const dueToday = task.deadline === localDateString() && !isComplete(task);
    let hint = "";
    if (overdue) hint = "Overdue";
    else if (dueToday) hint = "Due today";
    else if (task.deadline > localDateString() && !isComplete(task)) {
      const today = parseDate(localDateString());
      const deadline = parseDate(task.deadline);
      const daysUntil = Math.round((deadline - today) / 86400000);
      hint = daysUntil === 1 ? "Tomorrow" : daysUntil < 7 ? `In ${daysUntil} days` : "";
    } else if (isComplete(task)) hint = "Completed";
    const classes = ["deadline-cell", overdue ? "is-overdue" : "", dueToday ? "is-today" : ""].filter(Boolean).join(" ");
    return `<div class="${classes}"><span class="deadline-main">${escapeHtml(formatDate(task.deadline))}</span><span class="deadline-hint">${escapeHtml(hint)}</span></div>`;
  }

  function taskMarkup(task) {
    const category = task.category || "";
    const icon = CATEGORY_ICONS[category] || CATEGORY_ICONS.Default;
    const urgency = task.urgency || "Not set";
    const statusText = isOverdue(task) ? "Overdue" : task.status;
    const statusStyle = isOverdue(task) ? "status-overdue" : statusClass(task.status);
    const assignee = getUser(task.assignedTo);
    const details = [
      task.requester ? `from ${escapeHtml(task.requester)}` : "",
      assignee ? `assigned to ${escapeHtml(assignee.name)}` : "",
      task.workArea ? `<span class="task-work-area" data-work-area="${escapeHtml(task.workArea)}">${escapeHtml(task.workArea)}</span>` : ""
    ].filter(Boolean).join(" · ");
    return `
      <article class="task-card" data-task-id="${escapeHtml(task.id)}">
        <div class="task-main">
          <span class="task-type-icon" data-category="${escapeHtml(category)}">${icon}</span>
          <div class="task-title-wrap">
            <button class="task-title" type="button" data-action="edit" data-id="${escapeHtml(task.id)}" title="Open request">${escapeHtml(task.description)}</button>
            <span class="task-reference">${escapeHtml(task.reference)}${details ? ` · ${details}` : ""}</span>
          </div>
        </div>
        <span class="task-category">${escapeHtml(category || "Uncategorized")}</span>
        <span class="urgency-cell"><i class="urgency-dot" data-urgency="${escapeHtml(task.urgency || "")}"></i>${escapeHtml(urgency)}</span>
        ${deadlineMarkup(task)}
        <div class="task-status-cell">
          <span class="status-pill ${statusStyle}">${escapeHtml(statusText)}</span>
          <button class="task-edit-button" type="button" data-action="edit" data-id="${escapeHtml(task.id)}" aria-label="Edit ${escapeHtml(task.reference)}" ${canEditTask(task) ? "" : "hidden"}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6 4 4M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16l-1 4Z"/></svg>
          </button>
        </div>
      </article>`;
  }

  function getVisibleTasks() {
    const query = elements.search.value.trim().toLowerCase();
    const status = elements.statusFilter.value;
    const category = elements.categoryFilter.value;
    const urgency = elements.urgencyFilter.value;
    const filtered = tasks.filter(task => isVisibleToActiveUser(task)).filter(task => {
      if (currentView === "open" && isComplete(task)) return false;
      if (currentView === "overdue" && !isOverdue(task)) return false;
      if (currentView === "resolved" && !isComplete(task)) return false;
      if (currentView === "due-soon" && !isDueSoon(task)) return false;
      if (status && task.status !== status) return false;
      if (category && task.category !== category) return false;
      if (urgency && task.urgency !== urgency) return false;
      if (query && ![task.description, task.reference, task.requester, task.category, task.urgency, task.status, task.notes]
        .some(value => String(value || "").toLowerCase().includes(query))) return false;
      return true;
    });
    const sort = elements.sort.value;
    return filtered.sort((a, b) => {
      if (sort === "urgency") return (URGENCY_ORDER[a.urgency || ""] - URGENCY_ORDER[b.urgency || ""]) || compareDeadline(a, b);
      if (sort === "newest") return b.createdAt.localeCompare(a.createdAt);
      return compareDeadline(a, b) || (URGENCY_ORDER[a.urgency || ""] - URGENCY_ORDER[b.urgency || ""]);
    });
  }

  function compareDeadline(a, b) {
    if (!a.deadline && !b.deadline) return b.createdAt.localeCompare(a.createdAt);
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return a.deadline.localeCompare(b.deadline);
  }

  function updateViewHeading() {
    if (!activeUser) return;
    const roleCopy = {
      Employee: { all: ["My requests", "Let's make room to focus", `A clear view of what's on your plate, ${activeUser.name.split(" ")[0]}.`, "Requests assigned to you."], open: ["My open requests", "Keep your focus", "Here are your requests that still need attention.", "Your requests that are not resolved or closed."], sidebar: "YOUR WORK", eyebrow: "YOUR PERSONAL INBOX" },
      Supervisor: { all: ["Team requests", "A clear view of your team", "See ownership, urgency, and deadlines across your team.", "Requests assigned to you and your direct reports."], open: ["Open team requests", "Keep the team moving", "Requests that still need attention across your team.", "Open requests assigned to your team."], sidebar: "TEAM WORK", eyebrow: "SUPERVISOR WORKSPACE" },
      HR: { all: ["HR requests", "People come first", "A focused view of HR-related requests across employees.", "Requests marked for the HR work area."], open: ["Open HR requests", "Keep people moving", "HR-related requests that still need attention.", "Open requests marked for HR."], sidebar: "HR WORK", eyebrow: "HR WORKSPACE" },
      Admin: { all: ["All requests", "The whole picture", "Manage all requests and local demo account roles.", "Every request in this browser's demo workspace."], open: ["Open requests", "Keep work moving", "Open requests across the demo workspace.", "All requests that are not resolved or closed."], sidebar: "ADMIN", eyebrow: "ADMIN WORKSPACE" }
    }[activeUser.role];
    const defaultHeadings = {
      overdue: ["Overdue", "Let's catch up", "These requests have passed their response date.", "Requests with a past deadline that still need attention."],
      resolved: ["Resolved", "Look how far you've come", "A record of the requests you've taken care of.", "Completed requests and their solution notes."],
      "due-soon": ["Due soon", "A heads-up, not a fire drill", "These requests are coming up in the next two days.", "Requests due today or within the next two days."]
    };
    const headings = currentView === "users"
      ? ["Manage users", "Manage demo roles", "Change the role linked to a local demo account.", "Local demo account roles."]
      : currentView === "all" ? roleCopy.all
        : currentView === "open" ? roleCopy.open
          : defaultHeadings[currentView] || roleCopy.all;
    elements.breadcrumb.textContent = headings[0];
    elements.pageTitle.innerHTML = `${escapeHtml(headings[1])}<span class="title-period">.</span>`;
    elements.pageSubtitle.textContent = headings[2];
    elements.listDescription.textContent = headings[3];
    elements.listHeading.firstChild.textContent = `${headings[0]} `;
    elements.sidebarLabel.textContent = roleCopy.sidebar;
    elements.welcomeEyebrow.textContent = roleCopy.eyebrow;
    elements.profileName.textContent = activeUser.name;
    elements.profileRole.textContent = activeUser.role;
    document.querySelector(".profile .avatar").textContent = activeUser.name.split(/\s+/).map(part => part[0]).slice(0, 2).join("").toUpperCase();
    elements.navAllLabel.textContent = roleCopy.all[0];
    elements.navOpenLabel.textContent = roleCopy.open[0];
    elements.navOverdueLabel.textContent = activeUser.role === "HR" ? "Overdue HR" : activeUser.role === "Supervisor" ? "Overdue team" : "Overdue";
    elements.navResolvedLabel.textContent = activeUser.role === "Employee" ? "My resolved" : "Resolved";
    elements.usersNav.hidden = activeUser.role !== "Admin";
    elements.newTaskButton.hidden = currentView === "users";
    elements.statsGrid.hidden = currentView === "users";
    elements.userManagementSection.hidden = currentView !== "users";
    elements.taskSection.hidden = currentView === "users";
    document.querySelector("#empty-create-button").textContent = activeUser.role === "HR" ? "Add an HR request →" : "Add a request →";
    document.querySelectorAll(".nav-item").forEach(button => {
      button.classList.toggle("is-active", button.dataset.view === currentView || (currentView === "due-soon" && button.dataset.view === "all"));
    });
    elements.clearFilters.hidden = currentView === "all" && !elements.search.value && !elements.statusFilter.value && !elements.categoryFilter.value && !elements.urgencyFilter.value;
  }

  function render() {
    if (!activeUser) return;
    if (currentView === "users" && activeUser.role !== "Admin") currentView = "all";
    const scopedTasks = tasks.filter(isVisibleToActiveUser);
    const openTasks = scopedTasks.filter(task => !isComplete(task));
    const overdueTasks = openTasks.filter(isOverdue);
    const resolvedTasks = scopedTasks.filter(isComplete);
    elements.allCount.textContent = scopedTasks.length;
    elements.openCount.textContent = openTasks.length;
    elements.overdueCount.textContent = overdueTasks.length;
    elements.resolvedCount.textContent = resolvedTasks.length;
    elements.totalStat.textContent = scopedTasks.length;
    elements.openStat.textContent = openTasks.length;
    elements.dueSoonStat.textContent = openTasks.filter(isDueSoon).length;
    elements.overdueStat.textContent = overdueTasks.length;

    updateViewHeading();
    if (activeUser.role === "Admin") renderUsers();
    const visibleTasks = getVisibleTasks();
    elements.listCount.textContent = visibleTasks.length;
    elements.taskList.innerHTML = visibleTasks.map(taskMarkup).join("");
    elements.taskList.hidden = visibleTasks.length === 0;
    elements.emptyState.hidden = visibleTasks.length > 0;
    elements.listFooter.hidden = scopedTasks.length === 0;
    elements.footerCount.textContent = `Showing ${visibleTasks.length} ${visibleTasks.length === 1 ? "request" : "requests"}`;
    document.querySelector("#footer-message").innerHTML = activeUser.role === "Admin"
      ? "Admin view <span class=\"footer-heart\">·</span> local demo only"
      : activeUser.role === "HR" ? "HR work area only <span class=\"footer-heart\">·</span> local demo"
        : activeUser.role === "Supervisor" ? "Your direct reports <span class=\"footer-heart\">·</span> local demo"
          : "Your assigned requests <span class=\"footer-heart\">·</span> local demo";

    if (scopedTasks.length === 0 && currentView === "all" && !elements.search.value && !elements.statusFilter.value && !elements.categoryFilter.value && !elements.urgencyFilter.value) {
      elements.emptyTitle.textContent = activeUser.role === "HR" ? "No HR requests yet." : activeUser.role === "Supervisor" ? "No team requests yet." : activeUser.role === "Admin" ? "No requests in this demo yet." : "A little breathing room.";
      elements.emptyCopy.textContent = activeUser.role === "HR" ? "Create an HR request or switch to another demo account." : activeUser.role === "Supervisor" ? "Requests assigned to you and your direct reports will appear here." : activeUser.role === "Admin" ? "Create a request or switch to another demo account to explore role views." : "No requests yet. When something lands on your plate, capture it here and let your mind move on.";
      document.querySelector("#empty-create-button").hidden = false;
    } else {
      elements.emptyTitle.textContent = currentView === "overdue" ? "Nothing overdue. Nice work." : "No requests found.";
      elements.emptyCopy.textContent = currentView === "overdue" ? "You're up to date. Take a breath and keep going at your own pace." : "Try changing your filters, or capture a new request to keep everything in one place.";
      document.querySelector("#empty-create-button").hidden = currentView === "overdue";
    }
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => elements.toast.classList.remove("is-visible"), 2600);
  }

  function newTaskId() {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") return globalThis.crypto.randomUUID();
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }

  function createReference() {
    const year = new Date().getFullYear();
    const used = new Set(tasks.map(task => task.reference));
    let number = 1;
    let reference = `REQ-${year}-${String(number).padStart(4, "0")}`;
    while (used.has(reference)) {
      number += 1;
      reference = `REQ-${year}-${String(number).padStart(4, "0")}`;
    }
    return reference;
  }

  function openNewTask() {
    if (storageProblem || !activeUser) return;
    elements.form.reset();
    elements.id.value = "";
    elements.status.value = "New";
    populateAssignees();
    elements.assignee.value = activeUser.id;
    elements.assigneeField.hidden = activeUser.role === "Employee";
    elements.workArea.value = activeUser.role === "HR" ? "HR" : "";
    elements.workArea.disabled = activeUser.role === "HR";
    elements.taskWorkArea.closest(".field-group").hidden = false;
    elements.dialogTitle.textContent = "Capture a request";
    elements.saveButton.textContent = "Save request";
    elements.deleteButton.hidden = true;
    elements.descriptionError.hidden = true;
    elements.dialog.showModal();
    requestAnimationFrame(() => elements.description.focus());
  }

  function openEditTask(id) {
    const task = tasks.find(item => item.id === id);
    if (!task || !canEditTask(task)) return;
    elements.form.reset();
    elements.id.value = task.id;
    elements.description.value = task.description;
    elements.category.value = task.category || "";
    elements.urgency.value = task.urgency || "";
    elements.deadline.value = task.deadline || "";
    elements.status.value = task.status;
    elements.requester.value = task.requester || "";
    elements.notes.value = task.notes || "";
    populateAssignees(task.assignedTo);
    elements.assignee.value = task.assignedTo || activeUser.id;
    elements.assigneeField.hidden = activeUser.role === "Employee";
    elements.workArea.value = task.workArea || "";
    elements.workArea.disabled = activeUser.role === "HR";
    elements.taskWorkArea.closest(".field-group").hidden = false;
    elements.dialogTitle.textContent = "Request details";
    elements.saveButton.textContent = "Save changes";
    elements.deleteButton.hidden = false;
    elements.descriptionError.hidden = true;
    elements.dialog.showModal();
  }

  function closeDialog() {
    elements.dialog.close();
  }

  function populateAssignees(selectedId = activeUser?.id) {
    let options = users;
    if (activeUser.role === "Employee") options = [activeUser];
    if (activeUser.role === "Supervisor") {
      options = users.filter(user => user.id === activeUser.id || user.reportsTo === activeUser.id);
    }
    elements.assignee.innerHTML = options.map(user =>
      `<option value="${escapeHtml(user.id)}">${escapeHtml(user.name)} · ${escapeHtml(user.role)}</option>`
    ).join("");
    if (options.some(user => user.id === selectedId)) elements.assignee.value = selectedId;
  }

  function renderLoginOptions() {
    elements.roleOptions.innerHTML = users.map(user => {
      const role = user.role;
      const initials = user.name.split(/\s+/).map(part => part[0]).slice(0, 2).join("").toUpperCase();
      return `<button class="role-option" type="button" data-demo-user="${escapeHtml(user.id)}" data-role="${escapeHtml(role)}">
        <span class="role-avatar" aria-hidden="true">${escapeHtml(initials)}</span>
        <span class="role-option-copy"><strong>Continue as ${escapeHtml(user.name)}</strong><span>${escapeHtml(role)} · ${escapeHtml(ROLE_DESCRIPTIONS[role])}</span></span>
        <span class="role-option-arrow" aria-hidden="true">→</span>
      </button>`;
    }).join("");
  }

  function renderUsers() {
    elements.usersCount.textContent = users.length;
    elements.userList.innerHTML = users.map(user => {
      const initials = user.name.split(/\s+/).map(part => part[0]).slice(0, 2).join("").toUpperCase();
      return `<div class="user-row">
        <div class="user-row-identity"><span class="avatar" aria-hidden="true">${escapeHtml(initials)}</span><div><strong>${escapeHtml(user.name)}</strong><span>${escapeHtml(user.email)}</span></div></div>
        <span class="user-row-team">${escapeHtml(user.team)}</span>
        <label><span class="visually-hidden">Role for ${escapeHtml(user.name)}</span><select class="user-role-select" data-user-role="${escapeHtml(user.id)}">${ROLES.map(role => `<option${role === user.role ? " selected" : ""}>${escapeHtml(role)}</option>`).join("")}</select></label>
      </div>`;
    }).join("");
  }

  function enterDemoAccount(userId) {
    const user = getUser(userId);
    if (!user) return;
    activeUser = user;
    currentView = "all";
    elements.search.value = "";
    elements.statusFilter.value = "";
    elements.categoryFilter.value = "";
    elements.urgencyFilter.value = "";
    elements.sort.value = "deadline";
    elements.loginScreen.hidden = true;
    elements.appShell.hidden = false;
    render();
  }

  function switchAccount() {
    activeUser = null;
    currentView = "all";
    elements.appShell.hidden = true;
    elements.loginScreen.hidden = false;
    renderLoginOptions();
  }

  elements.roleOptions.addEventListener("click", event => {
    const button = event.target.closest("[data-demo-user]");
    if (button) enterDemoAccount(button.dataset.demoUser);
  });
  elements.switchAccount.addEventListener("click", switchAccount);

  document.querySelector("#new-task-button").addEventListener("click", openNewTask);
  document.querySelector("#empty-create-button").addEventListener("click", openNewTask);
  document.querySelectorAll("[data-close-dialog]").forEach(button => button.addEventListener("click", closeDialog));

  elements.dialog.addEventListener("click", event => {
    if (event.target === elements.dialog) closeDialog();
  });

  document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => {
      if (button.dataset.view === "users" && (!activeUser || activeUser.role !== "Admin")) return;
      currentView = button.dataset.view;
      render();
    });
  });

  document.querySelectorAll("[data-stat-view]").forEach(button => {
    button.addEventListener("click", () => {
      currentView = button.dataset.statView;
      render();
      document.querySelector(".tasks-section").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  elements.taskList.addEventListener("click", event => {
    const button = event.target.closest("[data-action='edit']");
    if (button) openEditTask(button.dataset.id);
  });

  elements.userList.addEventListener("change", event => {
    const select = event.target.closest("[data-user-role]");
    if (!select || !activeUser || activeUser.role !== "Admin") return;
    const user = getUser(select.dataset.userRole);
    if (!user || !ROLES.includes(select.value)) return;
    if (user.role === "Admin" && select.value !== "Admin" && getRoleUsers("Admin").length === 1) {
      showToast("Keep at least one Admin demo account.");
      renderUsers();
      return;
    }
    const nextUsers = users.map(item => item.id === user.id ? { ...item, role: select.value } : item);
    if (saveUsers(nextUsers)) {
      activeUser = getUser(activeUser.id);
      renderLoginOptions();
      render();
      showToast(`${user.name}'s demo role is now ${select.value}.`);
    }
  });

  elements.search.addEventListener("input", render);
  elements.statusFilter.addEventListener("change", render);
  elements.categoryFilter.addEventListener("change", render);
  elements.urgencyFilter.addEventListener("change", render);
  elements.sort.addEventListener("change", render);

  elements.clearFilters.addEventListener("click", () => {
    currentView = "all";
    elements.search.value = "";
    elements.statusFilter.value = "";
    elements.categoryFilter.value = "";
    elements.urgencyFilter.value = "";
    elements.sort.value = "deadline";
    render();
  });

  elements.form.addEventListener("submit", event => {
    event.preventDefault();
    const description = elements.description.value.trim();
    if (!description) {
      elements.descriptionError.hidden = false;
      elements.description.focus();
      return;
    }
    elements.descriptionError.hidden = true;
    const existing = tasks.find(task => task.id === elements.id.value);
    if (existing && !canEditTask(existing)) {
      showToast("You can't edit this request in the selected demo role.");
      return;
    }
    const task = {
      id: existing ? existing.id : newTaskId(),
      reference: existing ? existing.reference : createReference(),
      description,
      requester: elements.requester.value.trim(),
      category: elements.category.value,
      urgency: elements.urgency.value,
      deadline: elements.deadline.value,
      status: elements.status.value,
      notes: elements.notes.value.trim(),
      workArea: activeUser.role === "HR" ? "HR" : elements.workArea.value,
      assignedTo: activeUser.role === "Employee" ? activeUser.id : elements.assignee.value,
      createdAt: existing ? existing.createdAt : new Date().toISOString()
    };
    const nextTasks = existing
      ? tasks.map(item => item.id === existing.id ? task : item)
      : [task, ...tasks];
    if (commitTasks(nextTasks, existing ? "Your changes are saved." : "Request captured. You can let it go for now.")) {
      closeDialog();
      currentView = "all";
      render();
    }
  });

  elements.deleteButton.addEventListener("click", () => {
    const task = tasks.find(item => item.id === elements.id.value);
    if (!task || !canEditTask(task)) return;
    if (!window.confirm(`Delete ${task.reference}? This can't be undone.`)) return;
    if (commitTasks(tasks.filter(item => item.id !== task.id), "Request deleted.")) closeDialog();
  });

  document.addEventListener("keydown", event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      elements.search.focus();
    }
  });

  function updateDateLabel() {
    elements.todayLabel.textContent = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(new Date());
    render();
  }

  elements.todayLabel.textContent = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(new Date());
  renderLoginOptions();
  setInterval(updateDateLabel, 60000);
})();
