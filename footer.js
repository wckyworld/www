(function () {
    "use strict";

    var TIME_ZONE = "Europe/London";
    var TIME_LABEL = "TIME IN UNITED KINGDOM";
    var CONTACT = "george[at]wcky[dot]fyi";

    var formatter = new Intl.DateTimeFormat([], {
        timeZone: TIME_ZONE,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short"
    });

    var yearFormatter = new Intl.DateTimeFormat([], {
        timeZone: TIME_ZONE,
        year: "numeric"
    });

    function isHomePage() {
        var last = location.pathname.split("/").pop().toLowerCase();
        return last === "" || last === "index.html";
    }

    function homeUrl() {
        var scripts = document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; i++) {
            if (/footer\.js(?:[?#].*)?$/.test(scripts[i].src)) {
                return scripts[i].src.replace(/footer\.js(?:[?#].*)?$/, "") + "index.html";
            }
        }
        return "index.html";
    }

    function renderFooter() {
        var year = yearFormatter.format(new Date());

        var yearCell = isHomePage()
            ? '<div class="footer-year">' + year + '</div>'
            : '<div class="footer-year"><a class="footer-home" href="' + homeUrl() + '">RETURN HOME</a></div>';

        var footer = document.createElement("footer");
        footer.id = "site-footer";
        footer.innerHTML =
            yearCell +
            '<div class="footer-timezone">' +
                TIME_LABEL + ' - ' +
                '<span id="footer-time">0:00 PM</span> ' +
                '<span id="footer-tz">BST</span>' +
            '</div>' +
            '<div class="footer-contact">' + CONTACT + '</div>';

        document.body.appendChild(footer);
    }

    function updateTime() {
        var parts = formatter.formatToParts(new Date());

        var time = parts
            .filter(function (part) { return part.type !== "timeZoneName"; })
            .map(function (part) { return part.value; })
            .join("");

        var tz = parts.find(function (part) { return part.type === "timeZoneName"; });

        var timeEl = document.getElementById("footer-time");
        var tzEl = document.getElementById("footer-tz");

        if (timeEl) {
            timeEl.textContent = time;
        }

        if (tzEl && tz) {
            tzEl.textContent = tz.value;
        }
    }

    function init() {
        renderFooter();
        updateTime();
        setInterval(updateTime, 1000);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
