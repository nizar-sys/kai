// Otomatis centang checkbox dengan ID #setuju dan trigger event change
function autoCheckCheckbox() {
    $("#setuju").prop("checked", true).trigger("change");
}
autoCheckCheckbox();

// Fungsi untuk mengganti semua tag <a> dengan class "habis"
function replaceLinks() {
    $("a.habis").each(function () {
        var formParent = $(this).closest("form");
        if (formParent.length) {
            var formId = formParent.attr("id");
            $(this).attr({
                "class": "card-schedule",
                "onclick": `document.getElementById('${formId}').submit();return false;`
            });
        }
    });
}
replaceLinks();
