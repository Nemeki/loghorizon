// Import Modules
import { LoghorizonActor } from "./actor/actor.js";
import { LoghorizonCharacterSheet } from "./actor/character-sheet.js";
import { LoghorizonEnemySheet } from "./actor/enemy-sheet.js";
import { LoghorizonItem } from "./item/item.js";
import { LoghorizonItemSheet } from "./item/item-sheet.js";
import { loghorizonD } from "./config.js";

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/loghorizon/templates/actor/partials/statuscreen.hbs",
        "systems/loghorizon/templates/actor/partials/baseStats.hbs",
        "systems/loghorizon/templates/actor/partials/battleStats.hbs",
        "systems/loghorizon/templates/actor/partials/itemsTab.hbs",
        "systems/loghorizon/templates/actor/partials/problem.hbs", //DELETE
    ];

    return loadTemplates(templatePaths);
}

Hooks.once("init", function () {
    game.loghorizon = {
        LoghorizonActor,
        LoghorizonItem,
        rollItemMacro,
    };

    CONFIG.loghorizonD = loghorizonD;

    /**
     * Set an initiative formula for the system
     * @type {String}
     */
    CONFIG.Combat.initiative = {
        formula: "1d20 + @abilities.dex.mod",
        decimals: 0, //FIXME:
    };

    // Define custom Entity classes
    CONFIG.Actor.entityClass = LoghorizonActor;
    CONFIG.Item.entityClass = LoghorizonItem;

    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("loghorizon", LoghorizonCharacterSheet, {
        types: ["character"],
        makeDefault: true,
    });
    Actors.registerSheet("loghorizon", LoghorizonEnemySheet, {
        types: ["enemy"],
        makeDefault: true,
    });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("loghorizon", LoghorizonItemSheet, {
        makeDefault: true,
    });

    preloadHandlebarsTemplates();
    Handlebars.registerHelper("times", function (n, content) {
        let result = "";
        for (let i = 0; i < n; ++i) {
            result += content.fn(i);
        }

        return result;
    });

    // If you need to add Handlebars helpers, here are a few useful examples:
    Handlebars.registerHelper("concat", function () {
        var outStr = "";
        for (var arg in arguments) {
            if (typeof arguments[arg] != "object") {
                outStr += arguments[arg];
            }
        }
        return outStr;
    });

    Handlebars.registerHelper("toLowerCase", function (str) {
        return str.toLowerCase();
    });
});

Hooks.once("ready", async function () {
    // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
    Hooks.on("hotbarDrop", (bar, data, slot) =>
        createLoghorizonMacro(data, slot)
    );
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createLoghorizonMacro(data, slot) {
    if (data.type !== "Item") return;
    if (!("data" in data))
        return ui.notifications.warn(
            "You can only create macro buttons for owned Items"
        );
    const item = data.data;

    // Create the macro command
    const command = `game.loghorizon.rollItemMacro("${item.name}");`;
    let macro = game.macros.entities.find(
        (m) => m.name === item.name && m.command === command
    );
    if (!macro) {
        macro = await Macro.create({
            name: item.name,
            type: "script",
            img: item.img,
            command: command,
            flags: { "loghorizon.itemMacro": true },
        });
    }
    game.user.assignHotbarMacro(macro, slot);
    return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemName
 * @return {Promise}
 */
function rollItemMacro(itemName) {
    const speaker = ChatMessage.getSpeaker();
    let actor;
    if (speaker.token) actor = game.actors.tokens[speaker.token];
    if (!actor) actor = game.actors.get(speaker.actor);
    const item = actor ? actor.items.find((i) => i.name === itemName) : null;
    if (!item)
        return ui.notifications.warn(
            `Your controlled Actor does not have an item named ${itemName}`
        );

    // Trigger the item roll
    return item.roll();
}
