// ==UserScript==
// @name         Hackatime Analyzer Helper
// @namespace    http://tampermonkey.net/
// @version      2025-06-20
// @description  Easily open Hackatime Analyzer with data from leaderboard users
// @author       ShyMike
// @match        https://hackatime.hackclub.com/*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    const periodMap = {
        "daily": "today",
        "last_7_days": "last_7_days",
    };
    let selectedPeriod = "today";

    function addAnalyzeButtons() {
        const rows = document.querySelectorAll(".leaderboard-entry");

        const urlParams = new URLSearchParams(window.location.search);
        const periodType = urlParams.get('period_type');

        if (periodType === "weekly") {
            return;
        }

        if (periodType && periodMap[periodType]) {
            selectedPeriod = periodMap[periodType];
        } else {
            selectedPeriod = "today";
        }

        rows.forEach((row) => {
            if (row.querySelector(".check-btn")) return;

            const link = row.querySelector("a");
            if (!link) return;

            const userId = link.href.split("=").pop();
            if (!userId) return;

            const checkBtn = document.createElement("button");
            checkBtn.textContent = "Check";
            checkBtn.className = "check-btn";
            checkBtn.style.marginLeft = "0.5em";
            checkBtn.style.padding = "0.2rem";
            checkBtn.style.fontSize = "0.7rem";
            checkBtn.addEventListener("click", () => {
                window.open(
                    `https://hackatime-analyzer.pages.dev/?id=${userId}&period=${selectedPeriod}`,
                    "_blank"
                );
            });

            row.appendChild(checkBtn);
        });
    }

    function checkAndAddButtons() {
        if (location.pathname.includes("/leaderboards")) {
            addAnalyzeButtons();
        }
    }

    document.addEventListener("turbo:load", function () {
        checkAndAddButtons();
    });

    document.addEventListener("DOMContentLoaded", function () {
        checkAndAddButtons();
    });

    checkAndAddButtons();
})();
