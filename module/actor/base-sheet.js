export default class ActorSheetLoghorizon extends ActorSheet {
    constructor(...args) {
        super(...args);

        /**
         * Track the set of item filters which are applied
         * @type {Set}
         */
        this._filters = {
            inventory: new Set(),
            skills: new Set(),
        };
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            scrollY: [".inventory .inventory-list", ".skills .inventory-list"],
            tabs: [
                {
                    navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "basestats",
                },
            ],
        });
    }

    static unsupportedItemTypes = new Set();

    /** @override */
    get template() {
        /* if (!game.user.isGM && this.actor.limited)
            return "systems/loghorizon/templates/actor/limited-sheet.html"; */
        return "systems/loghorizon/templates/actor/${this.actor.data.type}-sheet.hbs";
    }

    getData(options) {
        // Basic data
        let isOwner = this.actor.isOwner;
        const data = {
            owner: isOwner,
            limited: this.actor.limited,
            options: this.options,
            editable: this.isEditable,
            cssClass: isOwner ? "editable" : "locked",
            isCharacter: this.actor.type === "character",
            isNPC: this.actor.type === "enemy",
            config: CONFIG.loghorizonD,
            rollData: this.actor.getRollData.bind(this.actor),
        };

        // The Actor's data
        const actorData = this.actor.data.toObject(false);
        data.actor = actorData;
        data.data = actorData.data;

        // Owned Items
        data.items = actorData.items;
        for (let i of data.items) {
            const item = this.actor.items.get(i._id);
            i.labels = item.labels;
        }
        data.items.sort((a, b) => (a.sort || 0) - (b.sort || 0));

        // Labels and filters
        data.labels = this.actor.labels || {};
        data.filters = this._filters;

        /* // Skills
        if (actorData.data.skills) {
            for (let [s, skl] of Object.entries(actorData.data.skills)) {
                skl.ability = CONFIG.DND5E.abilityAbbreviations[skl.ability];
                skl.icon = this._getProficiencyIcon(skl.value);
                skl.hover = CONFIG.DND5E.proficiencyLevels[skl.value];
                skl.label = CONFIG.DND5E.skills[s];
            }
        } */

        // Prepare owned items
        this._prepareItems(data);

        /* // Prepare active effects
        data.effects = prepareActiveEffectCategories(this.actor.effects); */

        // Return data to the sheet
        return data;
    }

    _onItemRoll(event) {
        event.preventDefault();
        const itemId = event.currentTarget.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);
        return item.roll();
    }
}
