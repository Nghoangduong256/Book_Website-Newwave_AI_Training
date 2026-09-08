"use strict";

$(function () {
    // State và biến cache DOM
    let allBooks = [];
    let searchTimer = null;

    const $bookGrid = $("#bookGrid");
    const $libraryState = $("#libraryState");
    const $loadingState = $("#loadingState");
    const $errorState = $("#errorState");
    const $emptyState = $("#emptyState");

    const coverColors = [
        "blue",
        "orange",
        "green",
        "purple",
        "navy",
        "red"
    ];

    initialize();

    function initialize() {
        bindEvents();
        loadBooks();
    }

    function bindEvents() {
        $('#bookSearch').on("input", function () {
            clearTimeout(searchTimer);

            searchTimer = setTimeout(function () {
                applyFilters();
            }, 250);
        });

        $("#bookSort").on("change", function () {
            applyFilters();
        })

        $("#retryLoadButton").on("click", function () {
            loadBooks();
        })
    }

    function loadBooks() {
        showLoadingState();

        BookApi.getAll()
            .done(function (data) {
                // allBooks = [];
                allBooks = Array.isArray(data) ? data : [];

                $("#sidebarBookCount").text(allBooks.length);

                applyFilters();
            })
            .fail(function (xhr) {
                console.error("Load books failed: ", xhr);

                const message = xhr.status === 0
                    ? "Không thể kết nối tới backend."
                    : `Không thể tải danh sách sách. HTTP ${xhr.status}.`;

                showErrorState(message);
            })
    }

    // State UI
    function hideAllStates() {
        $loadingState.addClass("is-hidden");
        $errorState.addClass("is-hidden");
        $emptyState.addClass("is-hidden");
    }

    function showLoadingState() {
        $bookGrid.empty();
        $libraryState.removeClass("is-hidden");

        hideAllStates();
        $loadingState.removeClass("is-hidden");
    }

    function showErrorState(message) {
        $bookGrid.empty();
        $libraryState.removeClass("is-hidden");

        hideAllStates();

        $("#errorMessage").text(message);
        $errorState.removeClass("is-hidden");
    }

    function showEmptyState(title, message) {
        $bookGrid.empty();
        $libraryState.removeClass("is-hidden");

        hideAllStates();

        $("#emptyStateTitle").text(title);
        $("#emptyStateMessage").text(message);
        $emptyState.removeClass("is-hidden");
    }

    function showBookGrid() {
        hideAllStates();
        $libraryState.addClass("is-hidden");
    }

    // Search và sort
    function normalizeText(value) {
        return String(value ?? "") // Nếu value là null hoặc undefined, sử dụng chuỗi rỗng.
            .trim()
            .toLocaleLowerCase("vi-VN");
    }

    function applyFilters() {
        const keyword = normalizeText($("#bookSearch").val());
        const sortType = $("#bookSort").val();

        const filteredBooks = allBooks.filter(function (book) {
            if (!keyword) {
                return true;
            }

            const searchableText = normalizeText([
                book.title,
                book.author,
                book.tags
            ].join(" "));

            return searchableText.includes(keyword);
        });

        sortBooks(filteredBooks, sortType);
        renderBooks(filteredBooks, keyword);
    }

    function sortBooks(books, sortType) {
        books.sort(function (firstBook, secondBook) {
            switch (sortType) {
                case "TITLE_DESC":
                    return secondBook.title.localeCompare(
                        firstBook.title,
                        "vi"
                    );

                case "YEAR_ASC":
                    return (
                        (firstBook.publishYear ?? Number.MAX_SAFE_INTEGER)
                        - (secondBook.publishYear ?? Number.MAX_SAFE_INTEGER)
                    );

                case "YEAR_DESC":
                    return (
                        (secondBook.publishYear ?? Number.MIN_SAFE_INTEGER)
                        - (firstBook.publishYear ?? Number.MIN_SAFE_INTEGER)
                    );

                case "CREATED_DESC":
                    return String(secondBook.createdAt ?? "")
                        .localeCompare(String(firstBook.createdAt ?? ""));

                case "TITLE_ASC":
                default:
                    return firstBook.title.localeCompare(
                        secondBook.title,
                        "vi"
                    );
            }
        });
    };

    // Render helpers
    function escapeHtml(value) {
        return $("<div>")
            .text(String(value ?? ""))
            .html();
    }

    function parseTags(tags) {
        if (!tags) {
            return [];
        }

        return String(tags)
            .split(",")
            .map(function (tag) {
                return tag.trim();
            })
            .filter(Boolean)
            .slice(0, 4);
    }

    function createTagsHtml(tags) {
        return parseTags(tags)
            .map(function (tag) {
                return `<span class="tag">${escapeHtml(tag)}</span>`;
            })
            .join("");
    }

    function createBookInitials(title) {
        const words = String(title ?? "")
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (words.length === 0) {
            return "BK";
        }

        return words
            .slice(0, 2)
            .map(function (word) {
                return word.charAt(0).toUpperCase();
            })
            .join("");
    }

    function getCoverColor(book, index) {
        const numericId = Number(book.id);
        const colorIndex = Number.isFinite(numericId)
            ? numericId % coverColors.length
            : index % coverColors.length;

        return coverColors[colorIndex];
    }

    function getPdfStatus(book) {
        if (book.hasLocalFile) {
            return "Offline";
        }

        if (book.pdfUrl) {
            return "URL";
        }

        return "Chưa có PDF";
    }

    function createBookCard(book, index) {
        const title = escapeHtml(book.title || "Chưa có tiêu đề");
        const author = escapeHtml(book.author || "Chưa rõ tác giả");
        const year = book.publishYear ?? "—";

        const initials = escapeHtml(createBookInitials(book.title));
        const coverColor = getCoverColor(book, index);
        const pdfStatus = getPdfStatus(book);
        const tagsHtml = createTagsHtml(book.tags);

        return `
        <article class="book-card" data-book-id="${book.id}">
            <div class="book-cover book-cover--${coverColor}">
                <span class="book-cover__letters">${initials}</span>

                <span class="book-cover__status">
                    ${pdfStatus}
                </span>
            </div>

            <div class="book-card__body">
                <div class="book-card__heading">
                    <div>
                        <h2
                            class="book-card__title"
                            title="${title}"
                        >
                            ${title}
                        </h2>

                        <p class="book-card__author">
                            ${author}
                        </p>
                    </div>

                    <span class="book-card__year">
                        ${year}
                    </span>
                </div>

                <div class="tag-list" aria-label="Thể loại sách">
                    ${tagsHtml}
                </div>

                <a
                    class="button button--primary button--full"
                    href="./reader.html?id=${encodeURIComponent(book.id)}"
                >
                    <span aria-hidden="true">▤</span>
                    Đọc sách
                </a>
            </div>
        </article>
    `;
    }

    function renderBooks(books, keyword) {
        if (allBooks.length === 0) {
            showEmptyState(
                "Thư viện chưa có sách",
                "Hãy thêm cuốn sách đầu tiên vào thư viện."
            );
            return;
        }

        if (books.length === 0) {
            showEmptyState(
                "Không tìm thấy sách",
                `Không có kết quả phù hợp với “${keyword}”.`
            );
            return;
        }

        const cardsHtml = books
            .map(function (book, index) {
                return createBookCard(book, index);
            })
            .join("");

        $bookGrid.html(cardsHtml);
        showBookGrid();
    }
});