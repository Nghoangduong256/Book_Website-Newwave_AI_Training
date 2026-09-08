"use strict";

const BookApi = {
    getAll() {
        return $.ajax({
            url: `${APP_CONFIG.API_BASE_URL}/books`,
            method: "GET",
            dataType: "json",
            timeout: 15000
        })
    },

    getById(id) {
        return $.ajax({
            url: `${APP_CONFIG.API_BASE_URL}/books/${encodeURIComponent(id)}`,
            method: "GET",
            dataType: "json",
            timeout: 15000
        })
    },

    create(payload) {
        return $.ajax({
            url: `${APP_CONFIG.API_BASE_URL}/books`,
            method: "POST",
            contentType: "application/json; charset=UTF-8",
            dataType: "json",
            data: JSON.stringify(payload),
            timeout: 15000
        })
    },

    update(id, payload) {
        return $.ajax({
            url: `${APP_CONFIG.API_BASE_URL}/books/${encodeURIComponent(id)}`,
            method: "PUT",
            contentType: "application/json; charset=UTF-8",
            dataType: "json",
            data: JSON.stringify(payload),
            timeout: 15000
        })
    },

    remove(id) {
        return $.ajax({
            url: `${APP_CONFIG.API_BASE_URL}/books/${encodeURIComponent(id)}`,
            method: "DELETE",
            timeout: 15000
        })
    }

    // contentType → Định dạng dữ liệu mình gửi lên server.
    // dataType    → Định dạng dữ liệu mình mong nhận về.

};

