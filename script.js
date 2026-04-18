// Tracker de Diseño Editorial (versión mobile-first)
(() => {
  const STORAGE_KEY = "tesis_editorial_tracker_v2";

  const chapters = [
    ["02", "Introducción", "📘"],
    ["03", "Elección y delimitación del tema", "🎯"],
    ["04", "Planteamiento del problema", "❓"],
    ["05", "Justificación", "⚖️"],
    ["06", "Objetivos", "🚩"],
    ["07", "Hipótesis", "💡"],
    ["08", "Metodología de investigación y diseño", "🧪"],
    ["09", "Marco de referencia", "🧠"],
    ["10", "Normatividad", "📜"],
    ["11", "Principios UX/UI y claridad espacial", "📱"],
    ["12", "Estudio de casos análogos", "🏛️"],
    ["13", "Conclusiones de la Sección I: Investigación", "🧭"],
    ["14", "Introducción al proyecto", "📐"],
    ["15", "Características generales del predio", "🗺️"],
    ["16", "Criterios de diseño arquitectónico", "🧩"],
    ["17", "Justificación espacial y sensorial del programa arquitectónico", "🌿"],
    ["18", "Desarrollo conceptual", "✨"],
    ["19", "Descripción arquitectónica por zonas", "🏠"],
    ["20", "Conclusiones sección II: Proyecto arquitectónico", "✅"]
  ].map(([id, name, icon]) => ({ id: `c${id}`, title: `${id}. ${name}`, icon }));

  const phases = [
    { label: "Fase 1" },
    { label: "Fase 2", info: "Notebook LM" },
    { label: "Fase 3", info: "GPT" },
    { label: "Fase 4", info: "GPT" },
    { label: "Fase 5" },
    { label: "Fase 6", info: "GPT" },
    { label: "Fase 7" }
  ];

  const appState = {
    completedTasks: {},
    notes: {},
    expanded: {},
    progressPercent: 0
  };

  const ui = {
    container: document.getElementById("chapters-container"),
    template: document.getElementById("chapter-template"),
    progressBar: document.getElementById("main-progress"),
    progressPercent: document.getElementById("progress-percent"),
    completedCount: document.getElementById("completed-count"),
    totalCount: document.getElementById("total-count"),
    resetBtn: document.getElementById("reset-btn")
  };

  function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      appState.completedTasks = parsed.completedTasks || {};
      appState.notes = parsed.notes || {};
      appState.expanded = parsed.expanded || {};
      appState.progressPercent = parsed.progressPercent || 0;
    } catch {
      // Si hay datos corruptos, se usa estado base.
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }

  function chapterDoneCount(chapterId) {
    return (appState.completedTasks[chapterId] || []).length;
  }

  function isChapterCompleted(chapterId) {
    return chapterDoneCount(chapterId) === phases.length;
  }

  function updateProgress() {
    const totalTasks = chapters.length * phases.length;
    let completedTasks = 0;
    let completedBlocks = 0;

    chapters.forEach((chapter) => {
      const done = chapterDoneCount(chapter.id);
      completedTasks += done;
      if (done === phases.length) completedBlocks += 1;
    });

    const percent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
    appState.progressPercent = percent;

    ui.progressBar.style.width = `${percent}%`;
    ui.progressPercent.textContent = `${percent}%`;
    ui.completedCount.textContent = String(completedBlocks);
    ui.totalCount.textContent = String(chapters.length);
    ui.progressBar.parentElement.setAttribute("aria-valuenow", String(percent));

    saveState();
  }

  function toggleChapter(chapterId, card, header, content) {
    const next = !appState.expanded[chapterId];
    appState.expanded[chapterId] = next;

    card.classList.toggle("is-open", next);
    header.setAttribute("aria-expanded", String(next));
    content.hidden = !next;
    saveState();
  }

  function toggleTask(chapterId, taskIndex, card, counter, stateLabel) {
    const list = appState.completedTasks[chapterId] || [];
    const hasTask = list.includes(taskIndex);

    appState.completedTasks[chapterId] = hasTask
      ? list.filter((idx) => idx !== taskIndex)
      : [...list, taskIndex].sort((a, b) => a - b);

    const done = chapterDoneCount(chapterId);
    counter.textContent = `${done}/${phases.length}`;

    const doneState = done === phases.length;
    card.classList.toggle("is-completed", doneState);
    stateLabel.textContent = doneState ? "Completado" : "Pendiente";

    updateProgress();
  }

  function onInfoClick(label, aiName) {
    alert(`${label}: IA utilizada → ${aiName}`);
  }

  function createTaskItem(chapter, phase, taskIndex, card, counter, stateLabel) {
    const li = document.createElement("li");
    li.className = "task-item";

    const line = document.createElement("div");
    line.className = "task-line";

    const main = document.createElement("div");
    main.className = "task-main";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.id = `${chapter.id}-task-${taskIndex}`;
    checkbox.checked = (appState.completedTasks[chapter.id] || []).includes(taskIndex);
    checkbox.addEventListener("change", () => toggleTask(chapter.id, taskIndex, card, counter, stateLabel));

    const label = document.createElement("label");
    label.className = "task-label";
    label.htmlFor = checkbox.id;
    label.textContent = phase.label;

    main.append(checkbox, label);
    line.appendChild(main);

    if (phase.info) {
      const infoBtn = document.createElement("button");
      infoBtn.type = "button";
      infoBtn.className = "info-btn";
      infoBtn.textContent = "Info IA";
      infoBtn.setAttribute("aria-label", `Info de IA para ${phase.label}`);
      infoBtn.addEventListener("click", () => onInfoClick(phase.label, phase.info));
      line.appendChild(infoBtn);
    }

    li.appendChild(line);
    return li;
  }

  function renderChapter(chapter) {
    const fragment = ui.template.content.cloneNode(true);
    const card = fragment.querySelector(".chapter-card");
    const header = fragment.querySelector(".chapter-header");
    const icon = fragment.querySelector(".chapter-icon");
    const title = fragment.querySelector(".chapter-title");
    const stateLabel = fragment.querySelector(".chapter-state");
    const counter = fragment.querySelector(".chapter-counter");
    const content = fragment.querySelector(".chapter-content");
    const taskList = fragment.querySelector(".task-list");
    const notesLabel = fragment.querySelector(".notes-label");
    const notesInput = fragment.querySelector(".notes-input");

    card.dataset.chapterId = chapter.id;
    icon.textContent = chapter.icon;
    title.textContent = chapter.title;

    const done = chapterDoneCount(chapter.id);
    const completed = done === phases.length;
    counter.textContent = `${done}/${phases.length}`;
    stateLabel.textContent = completed ? "Completado" : "Pendiente";
    card.classList.toggle("is-completed", completed);

    const isOpen = !!appState.expanded[chapter.id];
    card.classList.toggle("is-open", isOpen);
    header.setAttribute("aria-expanded", String(isOpen));
    content.hidden = !isOpen;

    phases.forEach((phase, idx) => {
      taskList.appendChild(createTaskItem(chapter, phase, idx, card, counter, stateLabel));
    });

    const notesId = `notes-${chapter.id}`;
    notesLabel.setAttribute("for", notesId);
    notesInput.id = notesId;
    notesInput.value = appState.notes[chapter.id] || "";
    notesInput.addEventListener("input", (event) => {
      appState.notes[chapter.id] = event.target.value;
      saveState();
    });

    header.addEventListener("click", () => toggleChapter(chapter.id, card, header, content));
    ui.container.appendChild(fragment);
  }

  function render() {
    ui.container.innerHTML = "";
    chapters.forEach(renderChapter);
    updateProgress();
  }

  function resetProgress() {
    const ok = window.confirm("¿Borrar todo el progreso y notas? Esta acción no se puede deshacer.");
    if (!ok) return;

    appState.completedTasks = {};
    appState.notes = {};
    appState.expanded = {};
    appState.progressPercent = 0;
    saveState();
    render();
  }

  function init() {
    loadState();
    ui.resetBtn.addEventListener("click", resetProgress);
    render();
  }

  init();
})();
