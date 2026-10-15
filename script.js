/* =========================================================
   NOTENEST
   Notes Application
   Pure JavaScript
========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const NOTES_KEY = "notenest_notes_v1";
const THEME_KEY = "notenest_theme_v1";
const AUTOSAVE_KEY = "notenest_autosave_v1";


/* =========================================================
   APP STATE
========================================================= */

let notes = loadNotes();

let currentView = "notes";

let currentNoteId = null;

let currentCategory = "All";

let sortMode = "newest";

let pendingConfirmAction = null;


/* =========================================================
   DOM
========================================================= */

const notesArea = document.getElementById("notesArea");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");

const pageTitle = document.getElementById("pageTitle");
const pageDescription = document.getElementById("pageDescription");

const categoryFilter =
    document.getElementById("categoryFilter");

const notesCount =
    document.getElementById("notesCount");

const trashCount =
    document.getElementById("trashCount");

const editorModal =
    document.getElementById("editorModal");

const settingsModal =
    document.getElementById("settingsModal");

const confirmModal =
    document.getElementById("confirmModal");

const noteTitle =
    document.getElementById("noteTitle");

const noteContent =
    document.getElementById("noteContent");

const noteCategory =
    document.getElementById("noteCategory");

const noteDate =
    document.getElementById("noteDate");

const editorStatus =
    document.getElementById("editorStatus");

const wordCount =
    document.getElementById("wordCount");

const characterCount =
    document.getElementById("characterCount");

const editorPinBtn =
    document.getElementById("editorPinBtn");

const editorFavoriteBtn =
    document.getElementById("editorFavoriteBtn");

const editorDeleteBtn =
    document.getElementById("editorDeleteBtn");

const darkModeSwitch =
    document.getElementById("darkModeSwitch");

const autoSaveSwitch =
    document.getElementById("autoSaveSwitch");


/* =========================================================
   START
========================================================= */

document.addEventListener("DOMContentLoaded", initialize);


function initialize() {

    loadTheme();

    setupEvents();

    renderCategories();

    updateCounts();

    renderNotes();

}


/* =========================================================
   LOAD NOTES
========================================================= */

function loadNotes() {

    try {

        const saved =
            localStorage.getItem(NOTES_KEY);

        if (!saved) {

            return [

                {
                    id: createId(),

                    title:
                        "Welcome to NoteNest",

                    content:
                        "Your personal space for ideas, study notes, projects and everything worth remembering.\n\nStart by creating your first note. You can pin important notes, favorite useful information and organize everything into categories.",

                    category:
                        "General",

                    pinned:
                        true,

                    favorite:
                        true,

                    archived:
                        false,

                    deleted:
                        false,

                    createdAt:
                        new Date().toISOString(),

                    updatedAt:
                        new Date().toISOString()
                },

                {
                    id: createId(),

                    title:
                        "DSA Revision",

                    content:
                        "Important coding patterns:\n\n1. Sliding Window\n2. Two Pointers\n3. Fast & Slow Pointers\n4. Binary Search\n5. Merge Intervals\n6. BFS\n7. DFS\n8. Backtracking",

                    category:
                        "Study",

                    pinned:
                        false,

                    favorite:
                        false,

                    archived:
                        false,

                    deleted:
                        false,

                    createdAt:
                        new Date().toISOString(),

                    updatedAt:
                        new Date().toISOString()
                },

                {
                    id: createId(),

                    title:
                        "Project Ideas",

                    content:
                        "Build useful projects that solve real problems.\n\n• Notes application\n• Student productivity dashboard\n• Local service finder\n• Food donation platform\n• Smart study planner",

                    category:
                        "Projects",

                    pinned:
                        false,

                    favorite:
                        false,

                    archived:
                        false,

                    deleted:
                        false,

                    createdAt:
                        new Date().toISOString(),

                    updatedAt:
                        new Date().toISOString()
                }

            ];

        }

        return JSON.parse(saved);

    } catch (error) {

        console.error(
            "Could not load notes:",
            error
        );

        return [];

    }

}


/* =========================================================
   SAVE STORAGE
========================================================= */

function saveNotes() {

    localStorage.setItem(
        NOTES_KEY,
        JSON.stringify(notes)
    );

    updateCounts();

}


/* =========================================================
   ID
========================================================= */

function createId() {

    return Date.now().toString() +
        Math.random()
            .toString(36)
            .substring(2, 8);

}


/* =========================================================
   EVENTS
========================================================= */

function setupEvents() {


    /* NEW NOTE */

    document
        .getElementById("newNoteBtn")
        .addEventListener(
            "click",
            createNewNote
        );


    document
        .getElementById("headerNewBtn")
        .addEventListener(
            "click",
            createNewNote
        );


    document
        .getElementById("emptyButton")
        .addEventListener(
            "click",
            createNewNote
        );


    /* SEARCH */

    searchInput.addEventListener(
        "input",
        function () {

            renderNotes();

        }
    );


    /* NAVIGATION */

    document
        .querySelectorAll(".nav-item")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    currentView =
                        button.dataset.view;

                    currentCategory =
                        "All";

                    updateNavigation();

                    updatePageInfo();

                    renderCategories();

                    renderNotes();

                }
            );

        });


    /* THEME */

    document
        .getElementById("themeBtn")
        .addEventListener(
            "click",
            toggleTheme
        );


    document
        .getElementById("topThemeBtn")
        .addEventListener(
            "click",
            toggleTheme
        );


    darkModeSwitch.addEventListener(
        "change",
        function () {

            if (this.checked) {

                enableDarkMode();

            } else {

                enableLightMode();

            }

        }
    );


    /* SETTINGS */

    document
        .getElementById("settingsBtn")
        .addEventListener(
            "click",
            openSettings
        );


    document
        .getElementById("topSettingsBtn")
        .addEventListener(
            "click",
            openSettings
        );


    document
        .getElementById("closeSettings")
        .addEventListener(
            "click",
            closeSettings
        );


    /* EDITOR */

    document
        .getElementById("closeEditor")
        .addEventListener(
            "click",
            closeEditor
        );


    document
        .getElementById("cancelEditor")
        .addEventListener(
            "click",
            closeEditor
        );


    document
        .getElementById("saveNoteBtn")
        .addEventListener(
            "click",
            saveCurrentNote
        );


    editorDeleteBtn.addEventListener(
        "click",
        deleteCurrentNote
    );


    editorPinBtn.addEventListener(
        "click",
        toggleCurrentPin
    );


    editorFavoriteBtn.addEventListener(
        "click",
        toggleCurrentFavorite
    );


    /* EDITOR INPUT */

    noteTitle.addEventListener(
        "input",
        handleEditorInput
    );


    noteContent.addEventListener(
        "input",
        handleEditorInput
    );


    noteCategory.addEventListener(
        "change",
        handleEditorInput
    );


    /* TOOLBAR */

    document
        .querySelectorAll(
            ".editor-toolbar button"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    insertToolbarText(
                        button.dataset.insert
                    );

                }
            );

        });


    /* SORT */

    document
        .getElementById("sortBtn")
        .addEventListener(
            "click",
            changeSort
        );


    /* EXPORT */

    document
        .getElementById("exportBtn")
        .addEventListener(
            "click",
            exportNotes
        );


    /* IMPORT */

    document
        .getElementById("importBtn")
        .addEventListener(
            "click",
            function () {

                document
                    .getElementById("importFile")
                    .click();

            }
        );


    document
        .getElementById("importFile")
        .addEventListener(
            "change",
            importNotes
        );


    /* EMPTY TRASH */

    document
        .getElementById("clearTrashBtn")
        .addEventListener(
            "click",
            emptyTrash
        );


    /* MOBILE */

    document
        .getElementById("mobileMenu")
        .addEventListener(
            "click",
            function () {

                document
                    .getElementById("sidebar")
                    .classList.toggle(
                        "mobile-open"
                    );

            }
        );


    /* CONFIRM */

    document
        .getElementById("confirmCancel")
        .addEventListener(
            "click",
            closeConfirm
        );


    document
        .getElementById("confirmAction")
        .addEventListener(
            "click",
            function () {

                if (
                    typeof pendingConfirmAction ===
                    "function"
                ) {

                    pendingConfirmAction();

                }

                closeConfirm();

            }
        );


    /* KEYBOARD */

    document.addEventListener(
        "keydown",
        handleKeyboard
    );

}


/* =========================================================
   CREATE NOTE
========================================================= */

function createNewNote() {

    const now =
        new Date().toISOString();

    const newNote = {

        id: createId(),

        title: "",

        content: "",

        category: "General",

        pinned: false,

        favorite: false,

        archived: false,

        deleted: false,

        createdAt: now,

        updatedAt: now

    };


    notes.unshift(newNote);

    saveNotes();

    openEditor(newNote.id);

}


/* =========================================================
   OPEN EDITOR
========================================================= */

function openEditor(id) {

    const note =
        notes.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!note) return;


    currentNoteId = id;


    noteTitle.value =
        note.title;

    noteContent.value =
        note.content;

    noteCategory.value =
        note.category || "General";


    noteDate.textContent =
        "Updated " +
        formatDate(note.updatedAt);


    editorStatus.textContent =
        note.title ||
        "Untitled note";


    updateEditorStats();

    updateEditorButtons();


    editorModal.classList.add("show");


    setTimeout(
        function () {

            noteTitle.focus();

        },
        100
    );

}


/* =========================================================
   CLOSE EDITOR
========================================================= */

function closeEditor() {

    editorModal.classList.remove(
        "show"
    );

    currentNoteId = null;

    renderNotes();

}


/* =========================================================
   HANDLE EDITOR
========================================================= */

function handleEditorInput() {

    if (!currentNoteId) return;


    const note =
        notes.find(
            function (item) {

                return item.id ===
                    currentNoteId;

            }
        );


    if (!note) return;


    note.title =
        noteTitle.value;

    note.content =
        noteContent.value;

    note.category =
        noteCategory.value;

    note.updatedAt =
        new Date().toISOString();


    editorStatus.textContent =
        note.title ||
        "Untitled note";


    noteDate.textContent =
        "Updated " +
        formatDate(note.updatedAt);


    updateEditorStats();


    if (
        autoSaveSwitch.checked
    ) {

        saveNotes();

    }

}


/* =========================================================
   SAVE CURRENT NOTE
========================================================= */

function saveCurrentNote() {

    if (!currentNoteId) return;


    const note =
        notes.find(
            function (item) {

                return item.id ===
                    currentNoteId;

            }
        );


    if (!note) return;


    note.title =
        noteTitle.value.trim();


    note.content =
        noteContent.value;


    note.category =
        noteCategory.value;


    note.updatedAt =
        new Date().toISOString();


    saveNotes();

    closeEditor();

}


/* =========================================================
   DELETE CURRENT
========================================================= */

function deleteCurrentNote() {

    if (!currentNoteId) return;


    const id =
        currentNoteId;


    showConfirm(
        "Move to Trash?",
        "This note will be moved to Trash. You can restore it later.",
        function () {

            moveToTrash(id);

            closeEditor();

        }
    );

}


/* =========================================================
   MOVE TO TRASH
========================================================= */

function moveToTrash(id) {

    const note =
        notes.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!note) return;


    note.deleted = true;

    note.archived = false;

    note.updatedAt =
        new Date().toISOString();


    saveNotes();

    renderNotes();

}


/* =========================================================
   RESTORE
========================================================= */

function restoreNote(id) {

    const note =
        notes.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!note) return;


    note.deleted = false;

    note.updatedAt =
        new Date().toISOString();


    saveNotes();

    renderNotes();

}


/* =========================================================
   PERMANENT DELETE
========================================================= */

function permanentDelete(id) {

    showConfirm(
        "Delete permanently?",
        "This note will be permanently deleted and cannot be restored.",
        function () {

            notes =
                notes.filter(
                    function (note) {

                        return note.id !== id;

                    }
                );

            saveNotes();

            renderNotes();

        }
    );

}


/* =========================================================
   PIN
========================================================= */

function togglePin(id) {

    const note =
        findNote(id);

    if (!note) return;


    note.pinned =
        !note.pinned;


    note.updatedAt =
        new Date().toISOString();


    saveNotes();

    renderNotes();

    updateEditorButtons();

}


/* =========================================================
   CURRENT PIN
========================================================= */

function toggleCurrentPin() {

    if (!currentNoteId) return;

    togglePin(currentNoteId);

}


/* =========================================================
   FAVORITE
========================================================= */

function toggleFavorite(id) {

    const note =
        findNote(id);

    if (!note) return;


    note.favorite =
        !note.favorite;


    note.updatedAt =
        new Date().toISOString();


    saveNotes();

    renderNotes();

    updateEditorButtons();

}


/* =========================================================
   CURRENT FAVORITE
========================================================= */

function toggleCurrentFavorite() {

    if (!currentNoteId) return;

    toggleFavorite(currentNoteId);

}


/* =========================================================
   ARCHIVE
========================================================= */

function toggleArchive(id) {

    const note =
        findNote(id);

    if (!note) return;


    note.archived =
        !note.archived;


    note.updatedAt =
        new Date().toISOString();


    saveNotes();

    renderNotes();

}


/* =========================================================
   FIND NOTE
========================================================= */

function findNote(id) {

    return notes.find(
        function (note) {

            return note.id === id;

        }
    );

}


/* =========================================================
   RENDER NOTES
========================================================= */

function renderNotes() {

    let visibleNotes =
        getVisibleNotes();


    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    /* SEARCH */

    if (search) {

        visibleNotes =
            visibleNotes.filter(
                function (note) {

                    return (

                        note.title
                            .toLowerCase()
                            .includes(search)

                        ||

                        note.content
                            .toLowerCase()
                            .includes(search)

                        ||

                        note.category
                            .toLowerCase()
                            .includes(search)

                    );

                }
            );

    }


    /* CATEGORY */

    if (
        currentCategory !== "All"
    ) {

        visibleNotes =
            visibleNotes.filter(
                function (note) {

                    return (
                        note.category ===
                        currentCategory
                    );

                }
            );

    }


    /* SORT */

    visibleNotes.sort(
        sortNotes
    );


    notesArea.innerHTML = "";


    if (
        visibleNotes.length === 0
    ) {

        notesArea.style.display =
            "none";

        emptyState.style.display =
            "block";

        updateEmptyState();

        return;

    }


    notesArea.style.display =
        "grid";

    emptyState.style.display =
        "none";


    visibleNotes.forEach(
        function (note) {

            notesArea.appendChild(
                createNoteCard(note)
            );

        }
    );

}


/* =========================================================
   GET VISIBLE NOTES
========================================================= */

function getVisibleNotes() {

    switch (currentView) {

        case "favorites":

            return notes.filter(
                function (note) {

                    return (
                        note.favorite &&
                        !note.deleted &&
                        !note.archived
                    );

                }
            );


        case "pinned":

            return notes.filter(
                function (note) {

                    return (
                        note.pinned &&
                        !note.deleted &&
                        !note.archived
                    );

                }
            );


        case "archive":

            return notes.filter(
                function (note) {

                    return (
                        note.archived &&
                        !note.deleted
                    );

                }
            );


        case "trash":

            return notes.filter(
                function (note) {

                    return note.deleted;

                }
            );


        default:

            return notes.filter(
                function (note) {

                    return (
                        !note.deleted &&
                        !note.archived
                    );

                }
            );

    }

}


/* =========================================================
   CREATE NOTE CARD
========================================================= */

function createNoteCard(note) {

    const card =
        document.createElement("article");


    card.className =
        "note-card";


    const top =
        document.createElement("div");

    top.className =
        "note-card-top";


    const title =
        document.createElement("h3");


    title.textContent =
        note.title ||
        "Untitled Note";


    const star =
        document.createElement("span");

    star.className =
        "card-star";

    star.textContent =
        note.favorite
            ? "⭐"
            : "";


    top.appendChild(title);

    top.appendChild(star);


    const preview =
        document.createElement("p");

    preview.className =
        "card-preview";

    preview.textContent =
        note.content ||
        "No content yet. Open this note to start writing.";


    const footer =
        document.createElement("div");

    footer.className =
        "card-footer";


    const category =
        document.createElement("span");

    category.className =
        "note-category";

    category.textContent =
        note.category ||
        "General";


    const date =
        document.createElement("span");

    date.className =
        "note-date";

    date.textContent =
        formatDate(note.updatedAt);


    footer.appendChild(category);

    footer.appendChild(date);


    const actions =
        document.createElement("div");

    actions.className =
        "card-actions";


    if (note.deleted) {

        const restore =
            createActionButton(
                "♻️",
                "Restore",
                function () {

                    restoreNote(note.id);

                }
            );


        const permanent =
            createActionButton(
                "❌",
                "Delete permanently",
                function () {

                    permanentDelete(
                        note.id
                    );

                }
            );


        actions.appendChild(
            restore
        );

        actions.appendChild(
            permanent
        );

    } else {

        const edit =
            createActionButton(
                "✏️",
                "Edit",
                function () {

                    openEditor(note.id);

                }
            );


        const pin =
            createActionButton(
                note.pinned
                    ? "📌"
                    : "📍",
                "Pin",
                function () {

                    togglePin(note.id);

                }
            );


        const favorite =
            createActionButton(
                note.favorite
                    ? "⭐"
                    : "☆",
                "Favorite",
                function () {

                    toggleFavorite(
                        note.id
                    );

                }
            );


        const archive =
            createActionButton(
                note.archived
                    ? "📤"
                    : "📦",
                note.archived
                    ? "Restore from archive"
                    : "Archive",
                function () {

                    toggleArchive(
                        note.id
                    );

                }
            );


        const deleteButton =
            createActionButton(
                "🗑️",
                "Move to trash",
                function () {

                    moveToTrash(
                        note.id
                    );

                }
            );

        deleteButton.classList.add(
            "delete"
        );


        actions.appendChild(edit);

        actions.appendChild(pin);

        actions.appendChild(favorite);

        actions.appendChild(archive);

        actions.appendChild(deleteButton);

    }


    card.appendChild(top);

    card.appendChild(preview);

    card.appendChild(footer);

    card.appendChild(actions);


    /* OPEN ON DOUBLE CLICK */

    card.addEventListener(
        "dblclick",
        function () {

            if (!note.deleted) {

                openEditor(note.id);

            }

        }
    );


    return card;

}


/* =========================================================
   ACTION BUTTON
========================================================= */

function createActionButton(
    icon,
    title,
    action
) {

    const button =
        document.createElement("button");


    button.className =
        "card-action";


    button.textContent =
        icon;


    button.title =
        title;


    button.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            action();

        }
    );


    return button;

}


/* =========================================================
   UPDATE NAVIGATION
========================================================= */

function updateNavigation() {

    document
        .querySelectorAll(".nav-item")
        .forEach(
            function (item) {

                item.classList.toggle(
                    "active",
                    item.dataset.view ===
                    currentView
                );

            }
        );

}


/* =========================================================
   PAGE INFORMATION
========================================================= */

function updatePageInfo() {

    const information = {

        notes: [
            "All Notes",
            "Everything you've written, in one peaceful place."
        ],

        favorites: [
            "Favorites",
            "Your most important notes, always close by."
        ],

        pinned: [
            "Pinned Notes",
            "Keep your most important information at the top."
        ],

        archive: [
            "Archive",
            "Notes you've finished with but want to keep."
        ],

        categories: [
            "Categories",
            "Organize your knowledge your way."
        ],

        trash: [
            "Trash",
            "Deleted notes stay here until you remove them forever."
        ]

    };


    const data =
        information[currentView] ||
        information.notes;


    pageTitle.textContent =
        data[0];

    pageDescription.textContent =
        data[1];

}


/* =========================================================
   CATEGORIES
========================================================= */

function renderCategories() {

    categoryFilter.innerHTML = "";


    const categories = [
        "All",
        ...new Set(
            notes
                .filter(
                    function (note) {

                        return !note.deleted;

                    }
                )
                .map(
                    function (note) {

                        return note.category;

                    }
                )
        )
    ];


    if (
        currentView === "categories"
    ) {

        categoryFilter.style.display =
            "flex";

    } else {

        categoryFilter.style.display =
            "flex";

    }


    categories.forEach(
        function (category) {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "category-chip";


            if (
                category ===
                currentCategory
            ) {

                button.classList.add(
                    "active"
                );

            }


            button.textContent =
                category;


            button.addEventListener(
                "click",
                function () {

                    currentCategory =
                        category;

                    renderCategories();

                    renderNotes();

                }
            );


            categoryFilter.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   UPDATE COUNTS
========================================================= */

function updateCounts() {

    const activeNotes =
        notes.filter(
            function (note) {

                return (
                    !note.deleted &&
                    !note.archived
                );

            }
        );


    const trash =
        notes.filter(
            function (note) {

                return note.deleted;

            }
        );


    notesCount.textContent =
        activeNotes.length;


    trashCount.textContent =
        trash.length;


    document.getElementById(
        "statTotal"
    ).textContent =
        notes.filter(
            function (note) {

                return !note.deleted;

            }
        ).length;


    document.getElementById(
        "statPinned"
    ).textContent =
        notes.filter(
            function (note) {

                return (
                    note.pinned &&
                    !note.deleted
                );

            }
        ).length;


    document.getElementById(
        "statFavorites"
    ).textContent =
        notes.filter(
            function (note) {

                return (
                    note.favorite &&
                    !note.deleted
                );

            }
        ).length;


    const totalWords =
        notes
            .filter(
                function (note) {

                    return !note.deleted;

                }
            )
            .reduce(
                function (total, note) {

                    return total +
                        countWords(
                            note.content
                        );

                },
                0
            );


    document.getElementById(
        "statWords"
    ).textContent =
        totalWords.toLocaleString();

}


/* =========================================================
   EMPTY STATE
========================================================= */

function updateEmptyState() {

    const emptyTitle =
        document.getElementById(
            "emptyTitle"
        );

    const emptyDescription =
        document.getElementById(
            "emptyDescription"
        );


    if (
        currentView === "trash"
    ) {

        emptyTitle.textContent =
            "Trash is empty";

        emptyDescription.textContent =
            "Deleted notes will appear here.";

        return;

    }


    if (
        currentView === "favorites"
    ) {

        emptyTitle.textContent =
            "No favorite notes";

        emptyDescription.textContent =
            "Star a note to see it here.";

        return;

    }


    if (
        currentView === "pinned"
    ) {

        emptyTitle.textContent =
            "Nothing pinned";

        emptyDescription.textContent =
            "Pin important notes to keep them close.";

        return;

    }


    if (
        currentView === "archive"
    ) {

        emptyTitle.textContent =
            "Archive is empty";

        emptyDescription.textContent =
            "Archived notes will appear here.";

        return;

    }


    if (
        searchInput.value.trim()
    ) {

        emptyTitle.textContent =
            "No matching notes";

        emptyDescription.textContent =
            "Try a different keyword.";

        return;

    }


    emptyTitle.textContent =
        "Your notebook is empty";

    emptyDescription.textContent =
        "Create your first note and start building your knowledge.";

}


/* =========================================================
   EDITOR STATS
========================================================= */

function updateEditorStats() {

    const text =
        noteContent.value;


    wordCount.textContent =
        countWords(text) +
        " words";


    characterCount.textContent =
        text.length +
        " characters";

}


/* =========================================================
   WORD COUNT
========================================================= */

function countWords(text) {

    if (!text.trim()) {

        return 0;

    }

    return text
        .trim()
        .split(/\s+/)
        .length;

}


/* =========================================================
   DATE
========================================================= */

function formatDate(dateString) {

    if (!dateString) {

        return "Just now";

    }


    const date =
        new Date(dateString);


    const now =
        new Date();


    const difference =
        now - date;


    const minutes =
        Math.floor(
            difference / 60000
        );


    if (minutes < 1) {

        return "Just now";

    }


    if (minutes < 60) {

        return (
            minutes +
            "m ago"
        );

    }


    const hours =
        Math.floor(
            minutes / 60
        );


    if (hours < 24) {

        return (
            hours +
            "h ago"
        );

    }


    const days =
        Math.floor(
            hours / 24
        );


    if (days < 7) {

        return (
            days +
            "d ago"
        );

    }


    return date.toLocaleDateString(
        undefined,
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   EDITOR BUTTONS
========================================================= */

function updateEditorButtons() {

    if (!currentNoteId) return;


    const note =
        findNote(currentNoteId);


    if (!note) return;


    editorPinBtn.textContent =
        note.pinned
            ? "📌"
            : "📍";


    editorFavoriteBtn.textContent =
        note.favorite
            ? "⭐"
            : "☆";


    editorDeleteBtn.style.display =
        note.deleted
            ? "none"
            : "block";

}


/* =========================================================
   TOOLBAR
========================================================= */

function insertToolbarText(type) {

    const textarea =
        noteContent;


    const start =
        textarea.selectionStart;


    const end =
        textarea.selectionEnd;


    const selected =
        textarea.value.substring(
            start,
            end
        );


    let insertion = "";


    switch (type) {

        case "bullet":

            insertion =
                "• " +
                selected;

            break;


        case "number":

            insertion =
                "1. " +
                selected;

            break;


        case "check":

            insertion =
                "☐ " +
                selected;

            break;


        case "divider":

            insertion =
                "\n\n──────────────\n\n";

            break;


        case "date":

            insertion =
                new Date()
                    .toLocaleDateString();

            break;

    }


    textarea.value =
        textarea.value.substring(
            0,
            start
        ) +
        insertion +
        textarea.value.substring(
            end
        );


    textarea.focus();


    const cursor =
        start +
        insertion.length;


    textarea.setSelectionRange(
        cursor,
        cursor
    );


    handleEditorInput();

}


/* =========================================================
   SORT
========================================================= */

function changeSort() {

    const modes = [
        "newest",
        "oldest",
        "alphabetical"
    ];


    const current =
        modes.indexOf(sortMode);


    sortMode =
        modes[
            (current + 1) %
            modes.length
        ];


    const button =
        document.getElementById(
            "sortBtn"
        );


    const labels = {

        newest: "↕ Newest",

        oldest: "↕ Oldest",

        alphabetical: "↕ A–Z"

    };


    button.textContent =
        labels[sortMode];


    renderNotes();

}


/* =========================================================
   SORT NOTES
========================================================= */

function sortNotes(a, b) {

    if (
        sortMode ===
        "alphabetical"
    ) {

        return (
            (a.title || "")
                .localeCompare(
                    b.title || ""
                )
        );

    }


    if (
        sortMode ===
        "oldest"
    ) {

        return (
            new Date(a.updatedAt) -
            new Date(b.updatedAt)
        );

    }


    return (
        new Date(b.updatedAt) -
        new Date(a.updatedAt)
    );

}


/* =========================================================
   THEME
========================================================= */

function loadTheme() {

    const saved =
        localStorage.getItem(
            THEME_KEY
        );


    if (
        saved === "dark"
    ) {

        enableDarkMode();

    } else {

        enableLightMode();

    }

}


/* =========================================================
   DARK
========================================================= */

function enableDarkMode() {

    document.body.classList.add(
        "dark"
    );


    localStorage.setItem(
        THEME_KEY,
        "dark"
    );


    darkModeSwitch.checked =
        true;


    document.getElementById(
        "themeIcon"
    ).textContent =
        "☀️";


    document.getElementById(
        "themeText"
    ).textContent =
        "Light Mode";


    document.getElementById(
        "topThemeBtn"
    ).textContent =
        "☀️";

}


/* =========================================================
   LIGHT
========================================================= */

function enableLightMode() {

    document.body.classList.remove(
        "dark"
    );


    localStorage.setItem(
        THEME_KEY,
        "light"
    );


    darkModeSwitch.checked =
        false;


    document.getElementById(
        "themeIcon"
    ).textContent =
        "🌙";


    document.getElementById(
        "themeText"
    ).textContent =
        "Dark Mode";


    document.getElementById(
        "topThemeBtn"
    ).textContent =
        "🌙";

}


/* =========================================================
   TOGGLE THEME
========================================================= */

function toggleTheme() {

    if (
        document.body.classList.contains(
            "dark"
        )
    ) {

        enableLightMode();

    } else {

        enableDarkMode();

    }

}


/* =========================================================
   SETTINGS
========================================================= */

function openSettings() {

    settingsModal.classList.add(
        "show"
    );

}


function closeSettings() {

    settingsModal.classList.remove(
        "show"
    );

}


/* =========================================================
   EXPORT
========================================================= */

function exportNotes() {

    const data =
        JSON.stringify(
            notes,
            null,
            2
        );


    const blob =
        new Blob(
            [data],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "notenest-backup.json";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}


/* =========================================================
   IMPORT
========================================================= */

function importNotes(event) {

    const file =
        event.target.files[0];


    if (!file) return;


    const reader =
        new FileReader();


    reader.onload =
        function (e) {

            try {

                const imported =
                    JSON.parse(
                        e.target.result
                    );


                if (
                    !Array.isArray(
                        imported
                    )
                ) {

                    throw new Error(
                        "Invalid file"
                    );

                }


                imported.forEach(
                    function (note) {

                        if (!note.id) {

                            note.id =
                                createId();

                        }

                    }
                );


                notes =
                    imported;


                saveNotes();

                renderCategories();

                renderNotes();


                alert(
                    "Notes imported successfully!"
                );


            } catch (error) {

                alert(
                    "Could not import this file."
                );

            }

        };


    reader.readAsText(file);


    event.target.value =
        "";

}


/* =========================================================
   EMPTY TRASH
========================================================= */

function emptyTrash() {

    const trashNotes =
        notes.filter(
            function (note) {

                return note.deleted;

            }
        );


    if (
        trashNotes.length === 0
    ) {

        alert(
            "Trash is already empty."
        );

        return;

    }


    showConfirm(
        "Empty Trash?",
        "Every note currently in Trash will be permanently deleted.",
        function () {

            notes =
                notes.filter(
                    function (note) {

                        return !note.deleted;

                    }
                );


            saveNotes();

            renderNotes();

            renderCategories();

        }
    );

}


/* =========================================================
   CONFIRM MODAL
========================================================= */

function showConfirm(
    title,
    message,
    action
) {

    document.getElementById(
        "confirmTitle"
    ).textContent =
        title;


    document.getElementById(
        "confirmMessage"
    ).textContent =
        message;


    pendingConfirmAction =
        action;


    confirmModal.classList.add(
        "show"
    );

}


function closeConfirm() {

    confirmModal.classList.remove(
        "show"
    );

    pendingConfirmAction =
        null;

}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

function handleKeyboard(event) {

    /* Command/Ctrl + K */

    if (
        (event.metaKey ||
            event.ctrlKey) &&
        event.key.toLowerCase() === "k"
    ) {

        event.preventDefault();

        searchInput.focus();

        searchInput.select();

    }


    /* Command/Ctrl + N */

    if (
        (event.metaKey ||
            event.ctrlKey) &&
        event.key.toLowerCase() === "n"
    ) {

        event.preventDefault();

        createNewNote();

    }


    /* Escape */

    if (
        event.key === "Escape"
    ) {

        if (
            editorModal.classList.contains(
                "show"
            )
        ) {

            closeEditor();

        }

        if (
            settingsModal.classList.contains(
                "show"
            )
        ) {

            closeSettings();

        }

        if (
            confirmModal.classList.contains(
                "show"
            )
        ) {

            closeConfirm();

        }

    }

}


/* =========================================================
   CLOSE MODALS WHEN CLICKING BACKDROP
========================================================= */

editorModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            editorModal
        ) {

            closeEditor();

        }

    }
);


settingsModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            settingsModal
        ) {

            closeSettings();

        }

    }
);


confirmModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            confirmModal
        ) {

            closeConfirm();

        }

    }
);


/* =========================================================
   AUTO SAVE SETTING
========================================================= */

const savedAutoSave =
    localStorage.getItem(
        AUTOSAVE_KEY
    );


if (
    savedAutoSave === "false"
) {

    autoSaveSwitch.checked =
        false;

}


autoSaveSwitch.addEventListener(
    "change",
    function () {

        localStorage.setItem(
            AUTOSAVE_KEY,
            this.checked
                ? "true"
                : "false"
        );

    }
);