"use strict";

$(function () {
    let allBooks = [];
    let editingBookId = null;
    let searchTimer = null;
    let lastFocusedElement = null;

    const $tableBody = $("#bookTableBody");
    const $tablePanel = $("#bookTablePanel");
    const $manageState = $("#manageState");
    const $loadingState = $("#manageLoadingState");
    const $errorState = $("#manageErrorState");
    const $emptyState = $("#manageEmptyState");
    const $modal = $("#bookModal");
    const $form = $("#bookForm");

    let isSaving = false;
    let isDeleting = false;
    let pendingDeleteId = null;
    let toastTimer = null;

    initialize();

    function initialize() {
        bindEvents();
        loadBooks();
    }

    function bindEvents() {
        $("#openCreateBookButton").on("click", openCreateModal);

        $("[data-close-modal]").on("click", closeModal);

        $modal.on("click", function (event) {
            if ($(event.target).is("#bookModal")) {
                closeModal();
            }
        });

        $(document).on("keydown", function (event) {
            if (event.key === "Escape" && !$modal.hasClass("is-hidden")) {
                closeModal();
            }
        });

        $("#manageBookSearch").on("input", function () {
            clearTimeout(searchTimer);

            searchTimer = setTimeout(applyFilters, 250);
        });

        $("#pdfFilter").on("change", applyFilters);
        $("#manageRetryButton").on("click", loadBooks);

        $tableBody.on("click", ".edit-book-button", function () {
            const bookId = Number(
                $(this).closest("tr").data("book-id")
            );

            openEditModal(bookId);
        })

        $tableBody.on("click", ".delete-book-button", function () {
            const bookId = Number(
                $(this).closest("tr").data("book-id")
            );

            openDeleteDialog(bookId);
        })

        $form.on("submit", handleFormSubmit);

        $("#cancelDeleteButton").on("click", function () {
            if (!isDeleting) {
                $("#deleteDialog")[0].close();
            }
        });

        $("#deleteDialog").on("cancel", function (event) {
            // Sự kiện cancel xảy ra khi nhấn Escape.
            if (isDeleting) {
                event.preventDefault();
            }
        });

        $("#deleteDialog").on("close", function () {
            pendingDeleteId = null;
        });

        $("#confirmDeleteButton").on("click", confirmDelete);
    }

    function loadBooks() {
        showLoading();

        BookApi.getAll()
            .done(function (data) {
                allBooks = Array.isArray(data) ? data : [];

                $("#sidebarBookCount").text(allBooks.length);

                applyFilters();
            })
            .fail(function (xhr) {
                console.error("Load books failed:", xhr);

                const message = xhr.status === 0
                    ? "Không thể kết nối tới backend."
                    : `Không thể tải danh sách. HTTP ${xhr.status}.`;

                showError(message);
            })
    }

    function hideStates() {
        $loadingState.addClass("is-hidden");
        $errorState.addClass("is-hidden");
        $emptyState.addClass("is-hidden");
    }

    function showLoading() {
        $tablePanel.addClass("is-hidden");
        $manageState.removeClass("is-hidden");

        hideStates();
        $loadingState.removeClass("is-hidden");
    }

    function showError(message) {
        $tablePanel.addClass("is-hidden");
        $manageState.removeClass("is-hidden");

        hideStates();
        $("#manageErrorMessage").text(message);
        $errorState.removeClass("is-hidden");
    }

    function showEmpty(title, message) {
        $tablePanel.addClass("is-hidden");
        $manageState.removeClass("is-hidden");

        hideStates();
        $("#manageEmptyTitle").text(title);
        $("#manageEmptyMessage").text(message);
        $emptyState.removeClass("is-hidden");
    }

    function showTable() {
        hideStates();
        $manageState.addClass("is-hidden");
        $tablePanel.removeClass("is-hidden");
    }

    function normalizeText(value) {
        return String(value ?? "")
            .trim()
            .toLocaleLowerCase("vi-VN");
    }

    function getPdfStatus(book) {
        if (book.hasLocalFile) {
            return "OFFLINE";
        }

        if (book.pdfUrl) {
            return "URL";
        }

        return "NONE";
    }

    function applyFilters() {
        const keyword = normalizeText($("#manageBookSearch").val());
        const PdfStatus = $("#pdfFilter").val();

        const filteredBooks = allBooks.filter(function (book) {
            const searchableText = normalizeText([
                book.title,
                book.author,
                book.tags,
                book.publishYear
            ].join(" "));

            const matchesKeyword = !keyword || searchableText.includes(keyword);

            const matchesPdf = PdfStatus === "ALL" || getPdfStatus(book) === PdfStatus;

            return matchesKeyword && matchesPdf;
        })

        renderTable(filteredBooks, keyword);
    }

    function escapeHtml(value) {
        return $("<div>")
            .text(String(value ?? ""))
            .html();
    }

    function createPdfBadge(book) {
        const status = getPdfStatus(book);

        if (status === "OFFLINE") {
            return `
            <span class="status-badge status-badge--offline">
                Offline
            </span>
        `;
        }

        if (status === "URL") {
            return `
            <span class="status-badge status-badge--url">
                URL
            </span>
        `;
        }

        return `
        <span class="status-badge status-badge--none">
            Chưa có
        </span>
    `;
    }

    function createTableRow(book) {
        const title = escapeHtml(book.title || "Chưa có tiêu đề")
        const author = escapeHtml(book.author || "Chưa rõ tác giả")
        const tags = escapeHtml(book.tags || "Không có tag");
        const year = book.publishYear ?? "-";

        return `
        <tr data-book-id="${book.id}">
            <td>
                <div class="table-book-title">${title}</div>
                <div class="table-book-tags">${tags}</div>
            </td>

            <td>${author}</td>
            <td>${year}</td>
            <td>${createPdfBadge(book)}</td>

            <td>
                <div class="table-actions">
                    <button
                        class="button button--small edit-book-button"
                        type="button"
                    >
                        Sửa
                    </button>

                    <button
                        class="button button--small button--danger delete-book-button"
                        type="button"
                    >
                        Xóa
                    </button>
                </div>
            </td>
        </tr>
    `;
    }

    function renderTable(books, keyword) {
        if (allBooks.length === 0) {
            showEmpty(
                "Chưa có sách",
                "Hãy thêm cuốn sách đầu tiên."
            )
            return;
        }

        if (books.length === 0) {
            showEmpty(
                "Không tìm thấy sách",
                `Không có kết quả phù hợp với “${keyword}”.`
            );
            return;
        }

        const rowsHtml = books
            .map(createTableRow)
            .join("");

        $tableBody.html(rowsHtml);
        showTable();
    }

    function openCreateModal() {
        editingBookId = null;
        lastFocusedElement = document.activeElement;

        $form[0].reset();
        clearValidation();

        $("#bookModalTitle").text("Thêm sách");
        $("#saveBookButton").text("Thêm sách");
        $("#formStatus").text("");

        openModal();
    }

    function openEditModal(bookId) {
        const book = allBooks.find(function (item) {
            return Number(item.id) === bookId;
        })

        if (!book) {
            console.error("Book not found:", bookId)
            return;
        }

        editingBookId = bookId;
        lastFocusedElement = document.activeElement

        $form[0].reset();
        clearValidation()

        $("#bookTitle").val(book.title ?? "");
        $("#bookAuthor").val(book.author ?? "");
        $("#bookYear").val(book.publishYear ?? "");
        $("#bookTags").val(book.tags ?? "");
        $("#bookPdfUrl").val(book.pdfUrl ?? "");

        $("#bookModalTitle").text("Sửa sách")
        $("#saveBookButton").text("Lưu thay đổi")
        $("#formStatus").text("");

        openModal()
    }

    function openModal() {
        $modal.removeClass("is-hidden");
        $modal.attr("aria-hidden", "false")

        $("body").addClass("modal-open");

        setTimeout(function () {
            $("#bookTitle").trigger("focus");
        }, 0)
    }

    function closeModal() {
        if (isSaving) {
            return;
        }


        $modal.addClass("is-hidden");
        $modal.attr("aria-hidden", "true")

        $("body").removeClass("modal-open")

        if (lastFocusedElement) {
            $(lastFocusedElement).trigger("focus")
        }
    }

    function clearValidation() {
        $(".form-error")
            .text("")
            .addClass("is-hidden")

        $(".form-control")
            .removeClass("form-control--error")

        $("#formStatus").text("").removeClass("form-status--error")
    }

    function setFieldError(fieldSelector, errorSelector, message) {
        $(fieldSelector).addClass("form-control--error");

        $(errorSelector)
            .text(message)
            .removeClass("is-hidden");
    }

    function isValidHttpUrl(value) {
        try {
            const url = new URL(value);

            return url.protocol === "http:"
                || url.protocol === "https:"
        } catch {
            return false
        }
    }

    function validateForm() {
        clearValidation();

        let isValid = true;

        const title = $("#bookTitle").val().trim();
        const author = $("#bookAuthor").val().trim();
        const yearText = $("#bookYear").val().trim();
        const pdfUrl = $("#bookPdfUrl").val().trim();
        const pdfFile = $("#bookPdfFile")[0].files[0];

        if (!title) {
            setFieldError(
                "#bookTitle",
                "#bookTitleError",
                "Vui lòng nhập tiêu đề."
            );

            isValid = false;
        }

        if (!author) {
            setFieldError(
                "#bookAuthor",
                "#bookAuthorError",
                "Vui lòng nhập tác giả."
            );

            isValid = false;
        }

        if (yearText) {
            const year = Number(yearText);

            if (
                !Number.isInteger(year)
                || year < -2147483648
                || year > 2147483647
            ) {
                setFieldError(
                    "#bookYear",
                    "#bookYearError",
                    "Năm xuất bản phải là số nguyên hợp lệ."
                );

                isValid = false;
            }
        }

        if (pdfUrl && !isValidHttpUrl(pdfUrl)) {
            setFieldError(
                "#bookPdfUrl",
                "#bookPdfUrlError",
                "URL phải bắt đầu bằng http:// hoặc https://."
            );

            isValid = false;
        }

        if (
            pdfFile
            && pdfFile.type !== "application/pdf"
            && !pdfFile.name.toLowerCase().endsWith(".pdf")
        ) {
            setFieldError(
                "#bookPdfFile",
                "#bookPdfFileError",
                "Vui lòng chọn file PDF."
            );

            isValid = false;
        }

        return isValid;
    }

    function createPayload() {
        const yearText = $("#bookYear").val().trim();

        const originalBook = allBooks.find(function (book) {
            return Number(book.id) === editingBookId;
        })

        return {
            title: $("#bookTitle").val().trim(),
            author: $("#bookAuthor").val().trim(),

            publishYear: yearText
                ? Number(yearText)
                : null,

            tags: $("#bookTags").val().trim() || null,
            pdfUrl: $("#bookPdfUrl").val().trim() || null,

            hasLocalFile: originalBook?.hasLocalFile ?? false
        }
    }

    function handleFormSubmit(event) {
        event.preventDefault();

        if (isSaving) {
            return;
        }

        if (!validateForm()) {
            $form.find(".form-control--error")
                .first()
                .trigger("focus");
            return
        }

        const payload = createPayload();
        const isEditing = editingBookId !== null;
        const bookId = editingBookId;

        setSaving(true);

        const request = isEditing
            ? BookApi.update(bookId, payload)
            : BookApi.create(payload);

        request
            .done(function () {
                setSaving(false);
                closeModal();

                showToast(
                    isEditing
                        ? "Đã cập nhật sách."
                        : "Đã thêm sách mới."
                );

                loadBooks();

                $("#openCreateBookButton").trigger("focus");
            })
            .fail(function (xhr, textStatus) {
                setSaving(false);

                console.error("Save book failed:", xhr);

                $("#formStatus")
                    .text(getRequestError(xhr, textStatus))
                    .addClass("form-status--error");
            });
    }

    function showToast(message, type = "success") {
        clearTimeout(toastTimer);

        $("#appToast")
            .text(message)
            .toggleClass("toast--error", type === "error")
            .removeClass("is-hidden");

        toastTimer = setTimeout(function () {
            $("#appToast").addClass("is-hidden");
        }, 4000)
    }

    function setSaving(value) {
        isSaving = value;

        $form.find("input, select, button").prop("disabled", value);

        $form.find("[data-close-modal]").prop("disabled", value);

        $("#bookPdfFile").prop("disabled", value);

        $("#saveBookButton").text(
            value
                ? "Đang lưu..."
                : editingBookId === null
                    ? "Thêm sách"
                    : "Lưu thay đổi"
        )

        $form.attr("aria-busy", String(value))
    }

    function getRequestError(xhr, textStatus) {
        if (textStatus === "timeout") {
            return "Hết thời gian chờ. Hãy kiểm tra lại danh sách trước khi gửi lại.";
        }

        if (xhr.status === 0) {
            return "Mất kết nối tới backend. Hãy kiểm tra kết nối và danh sách trước khi thử lại.";
        }

        if (xhr.status === 400) {
            return "Backend từ chối dữ liệu. Hãy kiểm tra lại các trường đã nhập.";
        }

        if (xhr.status === 404) {
            return "Không tìm thấy sách. Hãy tải lại danh sách.";
        }

        return `Thao tác thất bại. HTTP ${xhr.status}.`;
    }

    function openDeleteDialog(bookId) {
        const book = allBooks.find(function (item) {
            return Number(item.id) === bookId
        })

        if (!book) {
            showToast("Không tìm thấy sách. Hãy tải lại trang.", "error");
            return;
        }

        // Chặn tạm để tránh bỏ lại PDF trong trình duyệt.
        // Ngày 6 sẽ thay guard này bằng bước xóa IndexedDB.
        if (book.hasLocalFile) {
            showToast(
                "Sách này có PDF offline. Ngày 6 sẽ hoàn thiện xóa kèm file.",
                "error"
            );
            return;
        }

        pendingDeleteId = bookId;

        $("#deleteBookName").text(book.title);
        $("#deleteError").text("").addClass("is-hidden")

        $("#deleteDialog")[0].showModal();
        $("#cancelDeleteButton").trigger("focus")
    }

    function setDeleting(value) {
        isDeleting = value

        $("#deleteDialog button").prop("disabled", value)

        $("#confirmDeleteButton").text(
            value ? "Đang xóa ..." : "Xóa sách"
        )

        $("#deleteDialog").attr("aria-busy", String(value))
    }

    function confirmDelete() {
        if (isDeleting || pendingDeleteId === null) {
            return
        }

        const bookId = pendingDeleteId;

        setDeleting(true);

        BookApi.remove(bookId)
            .done(function () {
                setDeleting(false)
                $("#deleteDialog")[0].close()

                showToast("Đã xóa sách.")
                loadBooks();

                $("#openCreateBookButton").trigger("focus")
            })
            .fail(function (xhr, textStatus) {
                setDeleting(false)

                console.error("Delete book failed:", xhr)

                $("#deleteError")
                    .text(getRequestError(xhr, textStatus))
                    .removeClass("is-hidden")
            })
    }

    async function saveBookWithOptionalPdf(
        isEditing,
        bookId,
        payload,
        pdfFile
    ) {
        let savedBook = isEditing
            ? await BookApi.update(bookId, payload)
            : await BookApi.create(payload);

        if (!pdfFile) {
            return savedBook;
        }

        await PdfStore.save(savedBook.id, pdfFile);

        if (!savedBook.hasLocalFile) {
            try {
                savedBook = await BookApi.update(savedBook.id, {
                    ...payload,
                    hasLocalFile: true
                });
            } catch (error) {
                // Không để IndexedDB và backend lệch nhau.
                await PdfStore.remove(savedBook.id);
                throw error;
            }
        }

        return savedBook;
    }
});