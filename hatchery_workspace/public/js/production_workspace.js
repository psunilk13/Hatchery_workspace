(() => {
    "use strict";

    console.log("Production Workspace JS Loaded");

    // =========================================================
    // CONFIGURATION
    // =========================================================

    const PRODUCTION_WORKSPACE = "Production";
    const CONTAINER_CLASS = "production-custom-container";

    // =========================================================
    // PRODUCTION SECTIONS
    // =========================================================

    const SECTIONS = [
        {
            title: "Production Masters",
            subtitle: "Facilities & infrastructure",
            icon: "⌂",
            color: "#2563eb",
            items: [
                {
                    label: "Shed",
                    doctype: "Shed"
                },
                {
                    label: "Hatchery Tank",
                    doctype: "Hatchery Tank"
                },
                {
                    label: "Reservoir",
                    doctype: "Reservoir"
                }
            ]
        },
        {
            title: "Production Entries",
            subtitle: "Cycles & stocking",
            icon: "⟳",
            color: "#7c3aed",
            items: [
                {
                    label: "Shrimp Batch",
                    doctype: "Shrimp Batch",
                    no_count: true
                },
                {
                    label: "Tank Stocking",
                    doctype: "Tank Stocking",
                    no_count: true
                }
            ]
        },
        {
            title: "Reservoir Logs",
            subtitle: "Water requests & quality",
            icon: "💧",
            color: "#0891b2",
            items: [
                {
                    label: "Water Request",
                    doctype: "Water Request",
                    no_count: true
                },
                {
                    label: "Reservoir Daily Log",
                    doctype: "Reservoir Daily Log",
                    no_count: true
                }
            ]
        },
        {
            title: "Feed",
            subtitle: "Scheduling & execution",
            icon: "◉",
            color: "#d97706",
            items: [
                {
                    label: "Feed Schedule",
                    doctype: "Feed Schedule",
                    no_count: true
                },
                {
                    label: "Feed Execution Board",
                    route: "Form/Feed Execution Board",
                    no_count: true,
                    board: true
                }
            ]
        },
        {
            title: "Health Logs",
            subtitle: "Checks & microbiology",
            icon: "⌁",
            color: "#dc2626",
            items: [
                {
                    label: "Walk Through",
                    doctype: "Walk Through",
                    no_count: true
                },
                {
                    label: "Daily Micro Checks",
                    doctype: "Daily Micro Checks",
                    no_count: true
                }
            ]
        },
        {
            title: "Algae Logs",
            subtitle: "Inoculation → growth → harvest",
            icon: "🌿",
            color: "#16a34a",
            items: [
                {
                    label: "Inoculation",
                    doctype: "Algae Production Batch",
                    filters: {
                        algae_batch: "Inoculation"
                    },
                    no_count: true
                },
                {
                    label: "Growing",
                    doctype: "Algae Production Batch",
                    filters: {
                        algae_batch: "Growing"
                    },
                    no_count: true
                },
                {
                    label: "Harvest",
                    doctype: "Algae Production Batch",
                    filters: {
                        algae_batch: "Harvest"
                    },
                    no_count: true
                }
            ]
        }
    ];

    // =========================================================
    // CHECK CURRENT WORKSPACE
    // =========================================================

    function isProductionWorkspace() {
        if (!window.frappe || !frappe.get_route) {
            return false;
        }

        const route = frappe.get_route();

        return Boolean(
            route &&
            route[0] === "Workspaces" &&
            route[1] === PRODUCTION_WORKSPACE
        );
    }

    // =========================================================
    // GET DOCTYPE COUNT
    // =========================================================

    function getCount(doctype, filters, callback) {
        if (!doctype) {
            callback(0);
            return;
        }

        frappe.call({
            method: "frappe.client.get_count",
            args: {
                doctype: doctype,
                filters: filters || {}
            },
            callback: function (response) {
                const count =
                    response &&
                    response.message !== undefined
                        ? response.message
                        : 0;

                callback(count);
            },
            error: function (error) {
                console.error(
                    "Production count error:",
                    doctype,
                    error
                );

                callback("—");
            }
        });
    }

    // =========================================================
    // OPEN LIST
    // =========================================================

    function openList(doctype, filters) {
        if (!doctype) return;

        if (filters) {
            frappe.route_options = { ...filters };
        } else {
            frappe.route_options = {};
        }

        frappe.set_route("List", doctype);
    }

    // =========================================================
    // CREATE NEW DOCUMENT
    // =========================================================

    function createNew(doctype, filters) {
        if (!doctype) return;

        if (filters) {
            frappe.route_options = { ...filters };
        } else {
            frappe.route_options = {};
        }

        frappe.new_doc(doctype);
    }

    // =========================================================
    // OPEN CUSTOM ROUTE
    // =========================================================

    function openRoute(route) {
        if (!route) return;

        if (Array.isArray(route)) {
            frappe.set_route(...route);
        } else {
            frappe.set_route(route);
        }
    }

    // =========================================================
    // CREATE ITEM ROW
    // =========================================================

    function createItem(item) {
        const row = document.createElement("div");
        row.className = "production-custom-row";

        // Item name
        const name = document.createElement("div");
        name.className = "production-custom-name";
        name.textContent = item.label;
        name.title = "Open " + item.label;
        name.setAttribute("role", "button");
        name.setAttribute("tabindex", "0");

        function openItem() {
            if (item.doctype) {
                openList(item.doctype, item.filters);
            } else if (item.route) {
                openRoute(item.route);
            }
        }

        name.addEventListener("click", openItem);

        name.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openItem();
            }
        });

        // Right-side controls
        const right = document.createElement("div");
        right.className = "production-custom-right";

        // Feed execution board
        if (item.board) {
            const arrow = document.createElement("button");

            arrow.type = "button";
            arrow.className = "production-custom-board-arrow";
            arrow.textContent = "→";
            arrow.title = "Open " + item.label;
            arrow.setAttribute("aria-label", "Open " + item.label);

            arrow.addEventListener("click", function (event) {
                event.stopPropagation();
                openRoute(item.route);
            });

            right.appendChild(arrow);
        }

        // Normal DocType item
        else if (item.doctype) {
            // Count badge
            if (!item.no_count) {
                const count = document.createElement("span");

                count.className = "production-custom-count";
                count.textContent = "...";

                right.appendChild(count);

                getCount(
                    item.doctype,
                    item.filters || {},
                    function (value) {
                        if (count.isConnected) {
                            count.textContent = value;
                        }
                    }
                );
            }

            // Create button
            const plus = document.createElement("button");

            plus.type = "button";
            plus.className = "production-custom-add";
            plus.textContent = "+";
            plus.title = "Create " + item.label;
            plus.setAttribute("aria-label", "Create " + item.label);

            plus.addEventListener("click", function (event) {
                event.stopPropagation();
                createNew(item.doctype, item.filters);
            });

            right.appendChild(plus);
        }

        row.appendChild(name);
        row.appendChild(right);

        return row;
    }

    // =========================================================
    // CREATE SECTION CARD
    // =========================================================

    function createCard(section) {
        const card = document.createElement("div");
        card.className = "production-custom-card";

        card.style.setProperty(
            "--production-color",
            section.color
        );

        // Header
        const header = document.createElement("div");
        header.className = "production-custom-header";

        // Icon
        const icon = document.createElement("div");
        icon.className = "production-custom-icon";
        icon.textContent = section.icon;
        icon.setAttribute("aria-hidden", "true");

        // Header text
        const headerText = document.createElement("div");
        headerText.className = "production-custom-header-text";

        const title = document.createElement("div");
        title.className = "production-custom-title";
        title.textContent = section.title;

        const subtitle = document.createElement("div");
        subtitle.className = "production-custom-subtitle";
        subtitle.textContent = section.subtitle;

        headerText.appendChild(title);
        headerText.appendChild(subtitle);

        header.appendChild(icon);
        header.appendChild(headerText);

        card.appendChild(header);

        // Items
        const items = document.createElement("div");
        items.className = "production-custom-items";

        section.items.forEach(function (item) {
            items.appendChild(createItem(item));
        });

        card.appendChild(items);

        return card;
    }

    // =========================================================
    // FIND WORKSPACE CONTENT AREA
    // =========================================================

    function findWorkspaceContainer() {
        // Prefer the main content area used by Frappe.
        return (
            document.querySelector(
                ".layout-main-section-wrapper .layout-main-section"
            ) ||
            document.querySelector(".layout-main-section")
        );
    }

    // =========================================================
    // RENDER PRODUCTION WORKSPACE
    // =========================================================

    function renderProductionWorkspace() {
        if (!isProductionWorkspace()) {
            removeProductionWorkspace();
            return;
        }

        const workspace = findWorkspaceContainer();

        if (!workspace) {
            console.warn(
                "Production workspace content area not found."
            );
            return;
        }

        // Reuse existing container if it is already in the
        // correct location.
        let container = workspace.querySelector(
            ":scope > ." + CONTAINER_CLASS
        );

        if (!container) {
            // Remove a previous copy if it was inserted
            // into another container.
            removeProductionWorkspace();

            container = document.createElement("div");
            container.className = CONTAINER_CLASS;

            const grid = document.createElement("div");
            grid.className = "production-custom-grid";

            SECTIONS.forEach(function (section) {
                grid.appendChild(createCard(section));
            });

            container.appendChild(grid);
        }

        // KEY FIX:
        // Insert cards at the beginning of the workspace,
        // not after existing workspace content.
        if (workspace.firstElementChild !== container) {
            workspace.insertBefore(
                container,
                workspace.firstChild
            );
        }

        console.log(
            "Production Workspace rendered at the top."
        );
    }

    // =========================================================
    // REMOVE CUSTOM WORKSPACE
    // =========================================================

    function removeProductionWorkspace() {
        document
            .querySelectorAll("." + CONTAINER_CLASS)
            .forEach(function (container) {
                container.remove();
            });
    }

    // =========================================================
    // SCHEDULE RENDER
    // =========================================================

    let renderPending = false;

    function scheduleRender() {
        if (renderPending) return;

        renderPending = true;

        window.setTimeout(function () {
            renderPending = false;

            if (isProductionWorkspace()) {
                renderProductionWorkspace();
            } else {
                removeProductionWorkspace();
            }
        }, 300);
    }

    // =========================================================
    // FRAPPE ROUTE EVENTS
    // =========================================================

    if (window.frappe && frappe.router) {
        frappe.router.on("change", scheduleRender);
    }

    if (window.jQuery) {
        jQuery(document).on(
            "page-change.production-workspace",
            scheduleRender
        );
    }

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            scheduleRender,
            { once: true }
        );
    } else {
        scheduleRender();
    }

})();