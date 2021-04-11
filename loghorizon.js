import lhItemSheet from "./module/sheets/lhItemSheet.js";

Hooks.once("init", function () {
    console.log("loghorizon | Initializing Log Horizon TRPG system");

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("loghorizon", lhItemSheet, { makeDefault: true });
});
