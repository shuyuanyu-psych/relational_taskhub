(function () {
  const STORAGE_KEY = "thinkbot_relational_priming_experiment_v1";
  const TASKS = {
    A: {
      key: "A",
      label: "Picture Mapping",
      shortLabel: "A",
      description: "Picture mapping task",
      path: "Picture Mapping/pic_map_14.html"
    },
    B: {
      key: "B",
      label: "Rock Categorization",
      shortLabel: "B",
      description: "Rock categorization task",
      path: "Rock Categorization/Codes/rock_11.html"
    },
    C: {
      key: "C",
      label: "Match to Sample",
      shortLabel: "C",
      description: "Match-to-sample task",
      path: "MTS Numerical/Codes/match_to_sample_n7.html"
    },
    D: {
      key: "D",
      label: "Space Game",
      shortLabel: "D",
      description: "Space game",
      path: "SFOR/sfor.html"
    }
  };

  const LATIN_SQUARE = {
    1: ["A", "B", "C", "D"],
    2: ["B", "C", "D", "A"],
    3: ["C", "D", "A", "B"],
    4: ["D", "A", "B", "C"]
  };

  const CONFIG = {
    sforUrl: ""
  };

  function safeReadStorage() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function safeWriteStorage(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  function safeRemoveStorage() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      return false;
    }
  }

  function getDefaultState() {
    return {
      participantId: "",
      participantNumber: "",
      demographics: {},
      group: null,
      order: [],
      completedTasks: {},
      createdAt: ""
    };
  }

  function getState() {
    const raw = safeReadStorage();
    if (!raw) return getDefaultState();
    try {
      const parsed = JSON.parse(raw);
      return {
        ...getDefaultState(),
        ...parsed,
        demographics: parsed && parsed.demographics ? parsed.demographics : {},
        completedTasks: parsed && parsed.completedTasks ? parsed.completedTasks : {}
      };
    } catch (error) {
      return getDefaultState();
    }
  }

  function saveState(state) {
    safeWriteStorage(JSON.stringify(state));
    return state;
  }

  function sanitizeText(value) {
    return String(value || "").trim();
  }

  function formatLocalDateTime(date) {
    const d = date || new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  function parseParticipantNumber(value) {
    const parsed = Number.parseInt(String(value || "").trim(), 10);
    if (!Number.isFinite(parsed) || parsed < 1) return null;
    return parsed;
  }

  function getGroupForParticipant(participantNumber) {
    const numericId = parseParticipantNumber(participantNumber);
    if (!numericId) return null;
    return ((numericId - 1) % 4) + 1;
  }

  function getOrderForGroup(group) {
    return LATIN_SQUARE[group] ? [...LATIN_SQUARE[group]] : [];
  }

  function getTask(key) {
    return TASKS[key] || null;
  }

  function getOrderedTasks(order) {
    return (order || []).map((key) => TASKS[key]).filter(Boolean);
  }

  function getTaskLabels(order) {
    return getOrderedTasks(order).map((task) => task.label);
  }

  function startSession(payload) {
    const participantNumber = sanitizeText(payload.participantNumber);
    const group = getGroupForParticipant(participantNumber);
    const order = getOrderForGroup(group);
    const demographics = {
      age: sanitizeText(payload.age),
      gender: sanitizeText(payload.gender),
      yearInSchool: sanitizeText(payload.yearInSchool),
      major: sanitizeText(payload.major),
      nativeLanguage: sanitizeText(payload.nativeLanguage),
      secondLanguage: sanitizeText(payload.secondLanguage),
      ethnicity: sanitizeText(payload.ethnicity)
    };

    const state = {
      participantId: participantNumber,
      participantNumber,
      demographics,
      group,
      order,
      completedTasks: {},
      createdAt: formatLocalDateTime()
    };

    return saveState(state);
  }

  function clearState() {
    safeRemoveStorage();
  }

  function getNextTaskKey(state) {
    const currentState = state || getState();
    return (currentState.order || []).find((taskKey) => !currentState.completedTasks[taskKey]) || null;
  }

  function isTaskUnlocked(taskKey, state) {
    const currentState = state || getState();
    const nextTaskKey = getNextTaskKey(currentState);
    return Boolean(currentState.completedTasks[taskKey]) || taskKey === nextTaskKey;
  }

  function markTaskComplete(taskKey) {
    const state = getState();
    if (!taskKey) return state;
    const nextState = {
      ...state,
      completedTasks: {
        ...state.completedTasks,
        [taskKey]: formatLocalDateTime()
      }
    };
    return saveState(nextState);
  }

  function toCsvValue(value) {
    const normalized = value === null || value === undefined ? "" : String(value);
    if (/[",\n]/.test(normalized)) {
      return `"${normalized.replace(/"/g, '""')}"`;
    }
    return normalized;
  }

  function downloadCsv(filename, rows) {
    if (!rows || !rows.length) return;
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.map(toCsvValue).join(","),
      ...rows.map((row) => headers.map((header) => toCsvValue(row[header])).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function timestampForFilename(date) {
    const d = date || new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
  }

  function downloadIntroData(state) {
    const currentState = state || getState();
    if (!currentState.participantId) return;

    const row = {
      participant_id: currentState.participantId,
      participant_number: currentState.participantNumber,
      subject_group: currentState.group ? `Sub ${currentState.group}` : "",
      first_task: TASKS[currentState.order[0]] ? TASKS[currentState.order[0]].label : "",
      second_task: TASKS[currentState.order[1]] ? TASKS[currentState.order[1]].label : "",
      third_task: TASKS[currentState.order[2]] ? TASKS[currentState.order[2]].label : "",
      fourth_task: TASKS[currentState.order[3]] ? TASKS[currentState.order[3]].label : "",
      age: currentState.demographics.age || "",
      gender: currentState.demographics.gender || "",
      year_in_school: currentState.demographics.yearInSchool || "",
      major: currentState.demographics.major || "",
      native_language: currentState.demographics.nativeLanguage || "",
      second_language: currentState.demographics.secondLanguage || "",
      ethnicity: currentState.demographics.ethnicity || "",
      created_at: currentState.createdAt || ""
    };

    const filename = `S${currentState.participantId}_Intro_${timestampForFilename()}.csv`;
    downloadCsv(filename, [row]);
  }

  function buildTaskUrl(taskKey, baseHref) {
    const task = getTask(taskKey);
    if (!task) return "";

    const target = new URL(task.path, baseHref || window.location.href);
    const state = getState();
    const returnUrl = new URL("task_hub.html", baseHref || window.location.href).href;
    target.searchParams.set("pid", state.participantId || "");
    target.searchParams.set("taskKey", taskKey);
    target.searchParams.set("return", returnUrl);
    return target.href;
  }

  function launchTask(taskKey, baseHref) {
    const targetUrl = buildTaskUrl(taskKey, baseHref || window.location.href);
    if (!targetUrl) return;
    window.location.href = targetUrl;
  }

  function getLaunchContext(locationLike) {
    const href = locationLike && locationLike.href ? locationLike.href : window.location.href;
    const url = new URL(href);
    const state = getState();
    return {
      participantId: sanitizeText(url.searchParams.get("pid")) || state.participantId || "",
      taskKey: sanitizeText(url.searchParams.get("taskKey")),
      returnUrl: sanitizeText(url.searchParams.get("return"))
    };
  }

  function returnToHub(returnUrl) {
    const target = returnUrl || new URL("task_hub.html", window.location.href).href;
    window.location.href = target;
  }

  function completeTaskAndReturn(taskKey, returnUrl, delayMs) {
    if (taskKey) markTaskComplete(taskKey);
    window.setTimeout(() => returnToHub(returnUrl), delayMs || 1200);
  }

  window.ExperimentPackage = {
    CONFIG,
    TASKS,
    LATIN_SQUARE,
    getState,
    saveState,
    clearState,
    startSession,
    getGroupForParticipant,
    getOrderForGroup,
    getTask,
    getOrderedTasks,
    getTaskLabels,
    getNextTaskKey,
    isTaskUnlocked,
    markTaskComplete,
    downloadCsv,
    downloadIntroData,
    buildTaskUrl,
    launchTask,
    getLaunchContext,
    returnToHub,
    completeTaskAndReturn
  };
})();
