"use strict";

const PdfStore = (function () {
    const DATABASE_NAME = "book-library-database";
    const DATABASE_VERSION = 1;
    const STORE_NAME = "pdf-files";

    function openDatabase() {
        return new Promise(function (resolve, reject) {
            const request = indexedDB.open(
                DATABASE_NAME,
                DATABASE_VERSION
            );

            request.onupgradeneeded = function () {
                const database = request.result;

                if (!database.objectStoreNames.contains(STORE_NAME)) {
                    database.createObjectStore(STORE_NAME, {
                        keyPath: "bookId"
                    });
                }
            };

            request.onsuccess = function () {
                resolve(request.result);
            };

            request.onerror = function () {
                reject(request.error);
            };

            request.onblocked = function () {
                reject(
                    new Error(
                        "IndexedDB đang bị khóa bởi một tab khác."
                    )
                );
            };
        });
    }

    async function save(bookId, file) {
        const database = await openDatabase();

        return new Promise(function (resolve, reject) {
            const transaction = database.transaction(
                STORE_NAME,
                "readwrite"
            );

            const store = transaction.objectStore(STORE_NAME);

            store.put({
                bookId: Number(bookId),
                blob: file,
                fileName: file.name,
                mimeType: file.type || "application/pdf",
                savedAt: new Date().toISOString()
            });

            transaction.oncomplete = function () {
                database.close();
                resolve();
            };

            transaction.onerror = function () {
                const error = transaction.error;
                database.close();
                reject(error);
            };

            transaction.onabort = function () {
                const error = transaction.error;
                database.close();
                reject(error);
            };
        });
    }

    async function get(bookId) {
        const database = await openDatabase();

        return new Promise(function (resolve, reject) {
            const transaction = database.transaction(
                STORE_NAME,
                "readonly"
            );

            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(Number(bookId));

            request.onsuccess = function () {
                resolve(request.result ?? null);
            };

            request.onerror = function () {
                reject(request.error);
            };

            transaction.oncomplete = function () {
                database.close();
            };
        });
    }

    async function remove(bookId) {
        const database = await openDatabase();

        return new Promise(function (resolve, reject) {
            const transaction = database.transaction(
                STORE_NAME,
                "readwrite"
            );

            transaction
                .objectStore(STORE_NAME)
                .delete(Number(bookId));

            transaction.oncomplete = function () {
                database.close();
                resolve();
            };

            transaction.onerror = function () {
                const error = transaction.error;
                database.close();
                reject(error);
            };

            transaction.onabort = function () {
                const error = transaction.error;
                database.close();
                reject(error);
            };
        });
    }

    return {
        save,
        get,
        remove
    };
})();