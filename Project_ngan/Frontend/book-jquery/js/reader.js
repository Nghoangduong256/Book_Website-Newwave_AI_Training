"use strict";

import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import pdfWorkerUrl from
    "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

$(function () {
    let pdfDocument = null;
    let currentPage = 1;
    let scale = 1.1;
    let isRendering = false;
    let downloadObjectUrl = null;

    const $loading = $("#readerLoading");
    const $error = $("#readerError");
    const $layout = $("#readerLayout");

    initialize();

    function initialize() {
        bindEvents();
        loadReader();
    }

    function bindEvents() {
        $("#previousPageButton").on("click", function () {
            if (currentPage > 1) {
                currentPage--;
                renderCurrentPage();
            }
        });

        $("#nextPageButton").on("click", function () {
            if (
                pdfDocument
                && currentPage < pdfDocument.numPages
            ) {
                currentPage++;
                renderCurrentPage();
            }
        });

        $("#zoomOutButton").on("click", function () {
            scale = Math.max(
                0.6,
                Number((scale - 0.1).toFixed(1))
            );

            renderCurrentPage();
        });

        $("#zoomInButton").on("click", function () {
            scale = Math.min(
                2.2,
                Number((scale + 0.1).toFixed(1))
            );

            renderCurrentPage();
        });

        $(window).on("beforeunload", function () {
            if (downloadObjectUrl) {
                URL.revokeObjectURL(downloadObjectUrl);
            }
        });
    }

    function getBookId() {
        const parameters = new URLSearchParams(
            window.location.search
        );

        const bookId = Number(parameters.get("id"));

        return Number.isInteger(bookId) && bookId > 0
            ? bookId
            : null;
    }

    async function loadReader() {
        const bookId = getBookId();

        if (bookId === null) {
            showError("ID sách không hợp lệ.");
            return;
        }

        try {
            const book = await BookApi.getById(bookId);
            const localPdf = await PdfStore.get(bookId);

            renderBookInformation(book);

            if (localPdf?.blob) {
                await loadLocalPdf(localPdf);
                configureLocalDownload(localPdf);
                showSource("Offline", "offline");
            } else if (book.pdfUrl) {
                await loadRemotePdf(book.pdfUrl);
                configureRemoteDownload(book.pdfUrl);
                showSource("URL", "url");
            } else {
                throw new Error(
                    "Sách này chưa có PDF offline hoặc URL PDF."
                );
            }

            $loading.addClass("is-hidden");
            $error.addClass("is-hidden");
            $layout.removeClass("is-hidden");
        } catch (error) {
            console.error("Load reader failed:", error);

            if (error?.status === 404) {
                showError("Không tìm thấy sách.");
                return;
            }

            showError(
                error?.message
                || "Không thể tải PDF."
            );
        }
    }

    async function loadLocalPdf(localPdf) {
        const buffer = await localPdf.blob.arrayBuffer();

        const loadingTask = pdfjsLib.getDocument({
            data: new Uint8Array(buffer)
        });

        pdfDocument = await loadingTask.promise;
        currentPage = 1;

        await renderCurrentPage();
    }

    async function loadRemotePdf(pdfUrl) {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);

        pdfDocument = await loadingTask.promise;
        currentPage = 1;

        await renderCurrentPage();
    }

    async function renderCurrentPage() {
        if (!pdfDocument || isRendering) {
            return;
        }

        isRendering = true;
        updateControls();

        try {
            const page = await pdfDocument.getPage(currentPage);
            const viewport = page.getViewport({ scale });
            const canvas = $("#pdfCanvas")[0];
            const context = canvas.getContext("2d");

            const pixelRatio = window.devicePixelRatio || 1;

            canvas.width = Math.floor(
                viewport.width * pixelRatio
            );

            canvas.height = Math.floor(
                viewport.height * pixelRatio
            );

            canvas.style.width = `${Math.floor(viewport.width)}px`;
            canvas.style.height = `${Math.floor(viewport.height)}px`;

            await page.render({
                canvasContext: context,
                viewport,
                transform: pixelRatio === 1
                    ? null
                    : [
                        pixelRatio,
                        0,
                        0,
                        pixelRatio,
                        0,
                        0
                    ]
            }).promise;
        } catch (error) {
            console.error("Render PDF page failed:", error);
            showError("Không thể hiển thị trang PDF.");
        } finally {
            isRendering = false;
            updateControls();
        }
    }

    function updateControls() {
        const totalPages = pdfDocument?.numPages ?? 0;

        $("#pageIndicator").text(
            `Trang ${currentPage} / ${totalPages || "—"}`
        );

        $("#zoomIndicator").text(
            `${Math.round(scale * 100)}%`
        );

        $("#previousPageButton").prop(
            "disabled",
            isRendering || currentPage <= 1
        );

        $("#nextPageButton").prop(
            "disabled",
            isRendering
            || !totalPages
            || currentPage >= totalPages
        );

        $("#zoomOutButton").prop(
            "disabled",
            isRendering || scale <= 0.6
        );

        $("#zoomInButton").prop(
            "disabled",
            isRendering || scale >= 2.2
        );
    }

    function renderBookInformation(book) {
        $("#readerPageTitle").text(book.title);
        $("#readerPageDescription").text(
            `${book.author} · ${book.publishYear ?? "Không rõ năm"}`
        );

        $("#readerBookTitle").text(book.title);
        $("#readerBookMeta").text(
            `${book.author} · ${book.publishYear ?? "—"}`
        );

        $("#readerBookInitials").text(
            createInitials(book.title)
        );

        const tags = String(book.tags ?? "")
            .split(",")
            .map(function (tag) {
                return tag.trim();
            })
            .filter(Boolean);

        const $tagContainer = $("#readerBookTags").empty();

        tags.forEach(function (tag) {
            $("<span>")
                .addClass("tag")
                .text(tag)
                .appendTo($tagContainer);
        });

        document.title = `${book.title} | My Library`;
    }

    function createInitials(title) {
        const words = String(title ?? "")
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        return words.length
            ? words
                .slice(0, 2)
                .map(function (word) {
                    return word.charAt(0).toUpperCase();
                })
                .join("")
            : "BK";
    }

    function showSource(label, type) {
        $("#readerSourceBadge")
            .text(label)
            .removeClass(
                "status-badge--offline status-badge--url"
            )
            .addClass(
                type === "offline"
                    ? "status-badge--offline"
                    : "status-badge--url"
            );
    }

    function configureLocalDownload(localPdf) {
        downloadObjectUrl = URL.createObjectURL(localPdf.blob);

        $("#downloadPdfButton")
            .attr("href", downloadObjectUrl)
            .attr("download", localPdf.fileName || "book.pdf")
            .removeAttr("target");
    }

    function configureRemoteDownload(pdfUrl) {
        $("#downloadPdfButton")
            .attr("href", pdfUrl)
            .attr("target", "_blank")
            .attr("rel", "noopener noreferrer")
            .removeAttr("download");
    }

    function showError(message) {
        $loading.addClass("is-hidden");
        $layout.addClass("is-hidden");

        $("#readerErrorMessage").text(message);
        $error.removeClass("is-hidden");
    }
});