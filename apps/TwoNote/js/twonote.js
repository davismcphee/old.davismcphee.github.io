$(function() {

    //strings
    var RESPONSE_TYPE = "token";
    var CLIENT_ID = "c4463bda-e58c-4de5-9c80-532c36b3f591";
    var REDIRECT_URI = "https://davismcphee.com/apps/TwoNote/index.html";
    var SCOPE = "office.onenote_update";
    var APPLICATION_ID = "WLID-000000004C1C6B30";
    var hidden = "hidden";
    var disabled = "disabled";
    var vCenter = "v-center";
    var noteArea = ".note-area";
    var active = "active";
    var navMore = ".nav-more";
    var accessToken = "";
    var activeNoteName = "";
    var activeNoteContent = "";
    var activeNoteId = "";
    var noteContentId = "";
    var defaultHtmlContent = "<p>&nbsp;</p>";
    //jQuery objects
    var navMain = $(".nav-main");
    var logoMain = $("header h2");
    var loginButton = $(".login-button");
    var logoutButton = $(".logout-button");
    var application = $(".application");
    var noteList = $(".note-list");
    var apiRootUrl = "https://www.onenote.com/api/v1.0/me/notes";
    var loading = $(".loading");
    var noteListItem = $(".note-list .item");
    var aboutButton = $(".about-button");
    var aboutDialog = $("#about-dialog");
    var saveDialog = $("#save-dialog");
    var noteNameDialog = $("#note-name-dialog");
    var noteName = $("#note-name");
    var htmlPage = $("html");
    var menuButton = $(".menu-button");
    var body = $("body");
    var activeNoteTitle = $(".current-note span");
    var search = $("#search");
    var addButton = $(".add-button");
    var saveButton = $(".save-button");
    var editButton = $(".edit-button");
    var deleteButton = $(".delete-button");
    var deleteDialog = $("#delete-dialog");
    var activeItem;
    //flags
    var comingFromAdd = false;
    var comingFromItemClick = false;
    var newNote = false;
    var makingNote = false;
    //tinymce controls
    var tinymceInstance;
    var tinymceActive = false;

    function tinymceInit() {
        tinymce.init({ 
            selector: noteArea,
            inline: true,
            br_in_pre: false,
            setup: function (ed) {
                ed.on('init', function() {
                    tinymceInstance = this;
                    this.setMode("readonly");
                    $(noteArea).html(defaultHtmlContent);
                    activeNoteContent = $(noteArea).html();
                });
            }
        });

    }

    function tinymceEnabled(flag) {
        if (flag) {
            if(tinymceInstance == null || tinymceInstance.editorManager.editors.length == 0)
                tinymceInit();
        } else {
            if(tinymceInstance != null)
                tinymceInstance.editorManager.editors = [];
        }
    }

    function tinymceEditable(flag) {
        if (flag) {
            tinymceActive = true;
            tinymceInstance.setMode("designer");
        } else {
            tinymceActive = false;
            tinymceInstance.setMode("readonly");
        }
    }

    tinymceInit();
    saveButton.addClass(disabled);
    editButton.addClass(disabled);
    deleteButton.addClass(disabled);

    var populateNoteList = function(listData) {
        $(noteList.children("div")).remove();
        for (var i = 0; i < listData.value.length; i++) {
            var currentItem = listData.value[i];
            if (currentItem.createdByAppId == APPLICATION_ID) {
                var itemDiv = $(`<div class="item" data-id="${currentItem.id}"></div>`);
                var itemSpan = $(`<span class="${vCenter}">${currentItem.title}</span>`);
                itemDiv.append(itemSpan);
                noteList.append(itemDiv);
            }
        }
        if (activeNoteId != null)
            activeItem = $(`[data-id="${activeNoteId}"]`)
            $(activeItem).addClass(active);
    }

    function createUpdatedNote() {
        var updatedNote = {
            'target' : noteContentId,
            'action' : 'replace',
            'content' : $(noteArea).html()
        }
        return JSON.stringify([updatedNote]);
    }

    function requestContent(attempts) {
        $.ajax({
            url: `${apiRootUrl}/pages/${activeNoteId}/content?preAuthenticated=true&includeIDs=true`,
            type: "GET",
            beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);},
            success: function(data) { 
                var parser = new DOMParser();
                activeNoteName = $(data).filter("title").text();
                var activeNote = parser.parseFromString(data, "text/html").querySelector('[data-id="_default"]');
                if (activeNote != null)
                    activeNoteContent = activeNote.innerHTML;
                noteContentId = activeNote.querySelector('[data-id="note-content"]').id;
                activeNoteTitle.text(activeNoteName);
                $(noteArea).html(activeNoteContent);
                editButton.removeClass(disabled);
                deleteButton.removeClass(disabled); 
                if (!makingNote)
                    loading.addClass(hidden);
            },
            error: function() {
                if (attempts != null && attempts < 10)
                    requestContent(attempts + 1);
            }
        }); 
    }

    function getItemContent(item) {
        noteListItem.removeClass(active);
        $(item).addClass(active);
        saveButton.addClass(disabled);
        tinymceEnabled(false);
        loading.removeClass(hidden);
        activeNoteId = $(item).data("id");
        requestContent(0);
    }

    function refreshItemEventListeners() {
        noteListItem = $(".note-list .item");
        noteListItem.off();
        noteListItem.on("click", function() {
            tinymceEditable(false);
            activeItem = this;
            if (activeNoteContent != $(noteArea).html()) {
                comingFromItemClick = true;
                saveDialog.dialog("open");
            } else {
                newNote = false;
                getItemContent(this);
            }                        
        });
    }

    function refreshItemList(callback) {
        $.ajax({
            url: `${apiRootUrl}/pages`,
            type: "GET",
            beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);},
            success: function(data) { 
                populateNoteList(data);
                refreshItemEventListeners();
                loading.addClass(hidden);
                if (callback != null)
                    callback();
            }
        });
    }

    var toggleView = function() {
        navMain.toggleClass(hidden);
        loginButton.toggleClass(hidden);
        application.toggleClass(hidden);
        logoMain.toggleClass(vCenter);
        loading.toggleClass(hidden);
        refreshItemList();
    };

    function createNote(noteTitle, htmlContent) {
        if (htmlContent == "")
            htmlContent = defaultHtmlContent;
        return [`<!DOCTYPE html>`,
                `<html>`,
                `   <head>`,
                `       <title>${noteTitle}</title>`,
                `       <meta name="created" content="${new Date().toISOString()}"/>`,
                `   </head>`,
                `   <body>`,
                `       <div id="note-content">`,
                `           ${htmlContent}`,
                `       </div>`,
                `   </body>`,
                `</html>`].join("\n");
    }

    function getQueryVariable(variable) {
        var query = window.location.hash;
        var vars = query.split(/#|&/);
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }

    function resetActiveValues() {
        saveButton.addClass(disabled);
        editButton.addClass(disabled);
        deleteButton.addClass(disabled);
        tinymceEnabled(false);
        $(noteArea).html(defaultHtmlContent);
        activeNoteContent = $(noteArea).html();
        activeNoteTitle.text("");
        noteListItem.removeClass(active);
    }

    if (accessToken = getQueryVariable("access_token"))
        toggleView();

    loginButton.click(function() {
        window.location.href = `https://login.live.com/oauth20_authorize.srf` +
            `?response_type=${RESPONSE_TYPE}` +
            `&client_id=${CLIENT_ID}` +
            `&redirect_uri=${REDIRECT_URI}` +
            `&scope=${SCOPE}`;
    });

    logoutButton.click(function() {
        window.location.href = `https://login.live.com/oauth20_logout.srf?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
    });

    aboutDialog.dialog();
    aboutDialog.dialog("close");

    aboutButton.click(function() {
        aboutDialog.dialog("open");
    });

    saveDialog.dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Save": function() {
                tinymceEditable(false);
                loading.removeClass("hidden");
                if (newNote) {
                    var createdNote = createNote($(activeNoteTitle).text(), $(noteArea).html());
                    makingNote = true;
                    $.ajax({
                        url: `${apiRootUrl}/pages`,
                        type: "POST",
                        data: createdNote,
                        contentType: "application/xhtml+xml",
                        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);},
                        success: function(data) { 
                            newNote = false;
                            setTimeout(function() {
                                refreshItemList(function() {
                                    if (!comingFromItemClick)
                                        getItemContent(noteListItem.first());
                                    makingNote = false;
                                    comingFromItemClick = false;
                                });
                            }, 1500);
                        }
                    }); 
                }
                else {
                    $.ajax({
                        url: `${apiRootUrl}/pages/${activeNoteId}/content`,
                        type: "PATCH",
                        data: createUpdatedNote(),
                        contentType: "application/json",
                        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);},
                        success: function() { 
                            loading.addClass("hidden");
                        }
                    }); 
                }
                if (comingFromAdd)
                    noteNameDialog.dialog("open");
                //if (comingFromItemClick)
                activeNoteContent = $(noteArea).html();
                $(this).dialog("close");
            },
            "Don't Save": function() {
                if (comingFromAdd)
                    noteNameDialog.dialog("open");
                $(this).dialog("close");
            }
        },
        close: function() {
            comingFromAdd = false;
//            if (activeItem != null)
//                getItemContent(activeItem);
        }
    });

    saveDialog.dialog("close");

    addButton.click(function() {
        tinymceEditable(false);
        if (activeNoteContent != $(noteArea).html()) {
            comingFromAdd = true;
            saveDialog.dialog("open");
        } else {
            noteNameDialog.dialog("open");
        }
    });

    function isUniqueName(name) {
        for (var i = 0; i < noteListItem.length; i++) {
            if ($(noteListItem[i]).find("span").text() == noteName.val())
                return false;
        }
        return true;
    }

    noteNameDialog.dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Create Note": function() {
                if (noteName.val().length > 0 && isUniqueName(noteName.val())) {
                    activeNoteName = noteName.val();
                    activeNoteTitle.text(activeNoteName);
                    tinymceEnabled(true);
                    tinymceEditable(true);
                    saveButton.removeClass(disabled);
                    editButton.removeClass(disabled);
                    newNote = true;
                    $(this).dialog("close");
                }
            },
            Cancel: function() {
                $(this).dialog("close");
            }
        },
        close: function(event, ui) {
            noteName.val("");
        }
    });

    noteNameDialog.on("dialogopen", function() {
        resetActiveValues();
    });

    noteNameDialog.dialog("close");

    htmlPage.click(function() {
         menuButton.children(navMore).addClass(hidden);
    });

    menuButton.click(function(e) {
        e.stopPropagation();
        $(this).children(navMore).toggleClass(hidden);
    });

    search.keyup(function() {
        var currentSearchEntry = $(this).val();
        noteListItem.each(function() {
            if ($(this).text().search(new RegExp(currentSearchEntry, "i")) < 0)
                $(this).addClass(hidden);
            else
                $(this).removeClass(hidden);
        });
    });

    editButton.click(function() {
        if (!tinymceActive) {
            tinymceEditable(true);
            saveButton.removeClass(disabled);
        } else {
            tinymceEditable(false);
        } 
    });

    saveButton.click(function() {
        saveDialog.dialog("open");
    });

    deleteDialog.dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Delete Note": function() {
                var currentActiveNoteId = activeNoteId;
                var currentActiveNote = noteList.find(`.${active}`);
                resetActiveValues();
                loading.removeClass("hidden");
                $.ajax({
                    url: `${apiRootUrl}/pages/${currentActiveNoteId}`,
                    type: "DELETE",
                    contentType: "application/json",
                    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);},
                    success: function() { 
                        currentActiveNote.remove();
                        loading.addClass("hidden");
                    }
                }); 
                $(this).dialog("close");
            },
            Cancel: function() {
                $(this).dialog("close");
            }
        }
    });

    deleteDialog.dialog("close");

    deleteButton.click(function() {
        deleteDialog.dialog("open");
    });

});