(() => {

    console.log("========================================");
    console.log("Production Workspace JS Loaded");
    console.log("========================================");


    // =========================================================
    // WORKSPACE NAME
    // =========================================================

    const PRODUCTION_WORKSPACE = "Production";


    // =========================================================
    // PRODUCTION WORKSPACE CONFIGURATION
    // =========================================================

    const SECTIONS = [

        // =====================================================
        // PRODUCTION MASTERS (Keep Counts)
        // =====================================================

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


        // =====================================================
        // PRODUCTION ENTRIES (No Counts)
        // =====================================================

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


        // =====================================================
        // RESERVOIR LOGS (No Counts)
        // =====================================================

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


        // =====================================================
        // FEED (No Counts)
        // =====================================================

        {
            title: "Feed",
            subtitle: "Scheduling & execution",
            icon: "◉",
            color: "#d97706",

            items: [

                // ---------------------------------------------
                // REAL DOCTYPE
                // ---------------------------------------------

                {
                    label: "Feed Schedule",
                    doctype: "Feed Schedule",
                    no_count: true
                },


                // ---------------------------------------------
                // FEED EXECUTION BOARD
                // ---------------------------------------------

                {
                    label: "Feed Execution Board",
                    route: "Form/Feed Execution Board",
                    no_count: true,
                    board: true
                }

            ]
        },


        // =====================================================
        // HEALTH LOGS (No Counts)
        // =====================================================

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


        // =====================================================
        // ALGAE LOGS (No Counts)
        // =====================================================

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

    function is_production_workspace() {

        const route = frappe.get_route();

        console.log(
            "Current route:",
            route
        );


        if (!route) {
            return false;
        }


        return (
            route[0] === "Workspaces" &&
            route[1] === PRODUCTION_WORKSPACE
        );

    }


    // =========================================================
    // GET DOCTYPE COUNT
    // =========================================================

    function get_count(doctype, filters, callback) {
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
            callback: function(r) {
                callback(
                    r && r.message !== undefined
                        ? r.message
                        : 0
                );
            },
            error: function(error) {
                console.error(
                    "Count error for:",
                    doctype,
                    error
                );
                callback(0);
            }
        });
    }


    // =========================================================
    // OPEN DOCTYPE LIST
    // =========================================================

    function open_list(
        doctype
    ) {

        if (!doctype) {
            return;
        }


        frappe.set_route(
            "List",
            doctype
        );

    }


    // =========================================================
    // CREATE NEW DOCUMENT
    // =========================================================

    function create_new(
        doctype
    ) {

        if (!doctype) {
            return;
        }


        frappe.new_doc(
            doctype
        );

    }


    // =========================================================
    // OPEN CUSTOM ROUTE
    // =========================================================

    function open_route(
        route
    ) {

        if (!route) {
            return;
        }


        // If route is supplied as array
        if (Array.isArray(route)) {

            frappe.set_route(
                ...route
            );

            return;

        }


        // Normal string route
        frappe.set_route(
            route
        );

    }


    // =========================================================
    // CREATE ITEM ROW
    // =========================================================

    function create_item(
        item
    ) {

        // -----------------------------------------------------
        // ROW
        // -----------------------------------------------------

        const row =
            document.createElement(
                "div"
            );


        row.className =
            "production-custom-row";


        // -----------------------------------------------------
        // ITEM NAME
        // -----------------------------------------------------

        const name =
            document.createElement(
                "div"
            );


        name.className =
            "production-custom-name";


        name.innerText =
            item.label;


        // -----------------------------------------------------
        // NAME CLICK
        // -----------------------------------------------------

        name.addEventListener(
            "click",
            function () {

                // ---------------------------------------------
                // NORMAL DOCTYPE
                // ---------------------------------------------

                if (item.doctype) {
                    if (item.filters) {
                        frappe.route_options = item.filters;
                    }

                    frappe.set_route("List", item.doctype);
                    return;
                }


                // ---------------------------------------------
                // CUSTOM ROUTE
                // ---------------------------------------------

                if (
                    item.route
                ) {

                    open_route(
                        item.route
                    );

                    return;

                }

            }
        );


        // -----------------------------------------------------
        // RIGHT SIDE
        // -----------------------------------------------------

        const right =
            document.createElement(
                "div"
            );


        right.className =
            "production-custom-right";


        // =====================================================
        // BOARD ITEM
        // =====================================================

        if (
            item.board
        ) {

            // The board badge creation is commented out to hide the theme
            /*
            const board =
                document.createElement(
                    "span"
                );

            board.className =
                "production-custom-board";

            board.innerText =
                "Board";

            right.appendChild(
                board
            );
            */


            // -----------------------------------------------
            // ARROW BUTTON
            // -----------------------------------------------

            const arrow =
                document.createElement(
                    "button"
                );


            arrow.className =
                "production-custom-board-arrow";


            arrow.innerHTML =
                "→";


            arrow.title =
                "Open " +
                item.label;


            arrow.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();


                    open_route(
                        item.route
                    );

                }
            );


            right.appendChild(
                arrow
            );

        }


        // =====================================================
        // NORMAL DOCTYPE
        // =====================================================

        else if (
            item.doctype
        ) {

            // -------------------------------------------------
            // COUNT
            // -------------------------------------------------

            if (
                !item.no_count
            ) {

                const count =
                    document.createElement(
                        "span"
                    );


                count.className =
                    "production-custom-count";


                count.innerText =
                    "...";

                get_count(
                    item.doctype,
                    item.filters || {},
                    function(value) {
                        count.innerText = value;
                    }
                );


                right.appendChild(
                    count
                );

            }


            // -------------------------------------------------
            // PLUS BUTTON
            // -------------------------------------------------

            const plus =
                document.createElement(
                    "button"
                );


            plus.className =
                "production-custom-add";


            plus.innerHTML =
                "+";


            plus.title =
                "Create " +
                item.label;


            plus.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    // Pre-fill fields for the new doc if filters are defined in the config
                    if (item.filters) {
                        frappe.route_options = item.filters;
                    }

                    create_new(
                        item.doctype
                    );

                }
            );


            right.appendChild(
                plus
            );

        }


        // -----------------------------------------------------
        // ADD TO ROW
        // -----------------------------------------------------

        row.appendChild(
            name
        );


        row.appendChild(
            right
        );


        return row;

    }


    // =========================================================
    // CREATE SECTION CARD
    // =========================================================

    function create_card(
        section
    ) {

        // -----------------------------------------------------
        // CARD
        // -----------------------------------------------------

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "production-custom-card";


        card.style.setProperty(
            "--production-color",
            section.color
        );


        // -----------------------------------------------------
        // HEADER
        // -----------------------------------------------------

        const header =
            document.createElement(
                "div"
            );


        header.className =
            "production-custom-header";


        // -----------------------------------------------------
        // ICON
        // -----------------------------------------------------

        const icon =
            document.createElement(
                "div"
            );


        icon.className =
            "production-custom-icon";


        icon.innerText =
            section.icon;


        // -----------------------------------------------------
        // HEADER TEXT
        // -----------------------------------------------------

        const header_text =
            document.createElement(
                "div"
            );


        header_text.className =
            "production-custom-header-text";


        // -----------------------------------------------------
        // TITLE
        // -----------------------------------------------------

        const title =
            document.createElement(
                "div"
            );


        title.className =
            "production-custom-title";


        title.innerText =
            section.title;


        // -----------------------------------------------------
        // SUBTITLE
        // -----------------------------------------------------

        const subtitle =
            document.createElement(
                "div"
            );


        subtitle.className =
            "production-custom-subtitle";


        subtitle.innerText =
            section.subtitle;


        // -----------------------------------------------------
        // HEADER ASSEMBLY
        // -----------------------------------------------------

        header_text.appendChild(
            title
        );


        header_text.appendChild(
            subtitle
        );


        header.appendChild(
            icon
        );


        header.appendChild(
            header_text
        );


        card.appendChild(
            header
        );


        // =====================================================
        // ITEMS
        // =====================================================

        const items =
            document.createElement(
                "div"
            );


        items.className =
            "production-custom-items";


        section.items.forEach(
            function (item) {

                items.appendChild(
                    create_item(
                        item
                    )
                );

            }
        );


        card.appendChild(
            items
        );


        return card;

    }


    // =========================================================
    // RENDER PRODUCTION WORKSPACE
    // =========================================================

    function render_production_workspace() {

        console.log(
            "Trying to render Production Workspace..."
        );


        // -----------------------------------------------------
        // CHECK ROUTE
        // -----------------------------------------------------

        if (
            !is_production_workspace()
        ) {

            return;

        }


        // -----------------------------------------------------
        // PREVENT DUPLICATE
        // -----------------------------------------------------

        if (
            document.querySelector(
                ".production-custom-container"
            )
        ) {

            return;

        }


        // -----------------------------------------------------
        // FIND WORKSPACE
        // -----------------------------------------------------

        const workspace =
            document.querySelector(
                ".layout-main-section"
            );


        if (!workspace) {

            console.log(
                "Workspace container not found."
            );


            return;

        }


        // -----------------------------------------------------
        // MAIN CONTAINER
        // -----------------------------------------------------

        const container =
            document.createElement(
                "div"
            );


        container.className =
            "production-custom-container";


        // -----------------------------------------------------
        // GRID
        // -----------------------------------------------------

        const grid =
            document.createElement(
                "div"
            );


        grid.className =
            "production-custom-grid";


        // -----------------------------------------------------
        // CREATE SECTIONS
        // -----------------------------------------------------

        SECTIONS.forEach(
            function (section) {

                grid.appendChild(
                    create_card(
                        section
                    )
                );

            }
        );


        // -----------------------------------------------------
        // ADD GRID
        // -----------------------------------------------------

        container.appendChild(
            grid
        );


        // -----------------------------------------------------
        // ADD TO WORKSPACE
        // -----------------------------------------------------

        workspace.appendChild(
            container
        );


        console.log(
            "Production Workspace rendered successfully!"
        );

    }


    // =========================================================
    // REMOVE CUSTOM WORKSPACE
    // =========================================================

    function remove_production_workspace() {

        const container =
            document.querySelector(
                ".production-custom-container"
            );


        if (
            container
        ) {

            container.remove();

        }

    }


    // =========================================================
    // PAGE CHANGE
    // =========================================================

    $(document).on(
        "page-change",
        function () {

            console.log(
                "Frappe page-change detected"
            );


            setTimeout(
                function () {

                    if (
                        is_production_workspace()
                    ) {

                        render_production_workspace();

                    }
                    else {

                        remove_production_workspace();

                    }

                },
                500
            );

        }
    );


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    $(document).ready(
        function () {

            setTimeout(
                function () {

                    render_production_workspace();

                },
                1000
            );

        }
    );


    // =========================================================
    // ROUTER CHANGE
    // =========================================================

    if (
        frappe.router
    ) {

        frappe.router.on(
            "change",
            function () {

                setTimeout(
                    function () {

                        if (
                            is_production_workspace()
                        ) {

                            render_production_workspace();

                        }
                        else {

                            remove_production_workspace();

                        }

                    },
                    500
                );

            }
        );

    }

})();