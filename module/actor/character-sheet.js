import { calcStat, healthCalc } from "./auxscripts/actorCalculations.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class LoghorizonCharacterSheet extends ActorSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["loghorizon", "sheet", "actor"],
            template: "systems/loghorizon/templates/actor/character-sheet.hbs",
            width: 760,
            height: 410,
            tabs: [
                {
                    navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "description",
                },
            ],
        });
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    /** @override */
    getData() {
        const data = super.getData();
        data.dtypes = ["String", "Number", "Boolean"];
        data.config = CONFIG.loghorizonD;
        for (let attr of Object.values(data.data.attributes)) {
            attr.isCheckbox = attr.dtype === "Boolean";
        }

        // Prepare items.
        if (this.actor.data.type == "character") {
            this._prepareCharacterItems(data);
        }

        return data;
    }

    /**
     * Organize and classify Items for Character sheets.
     *
     * @param {Object} actorData The actor to prepare.
     *
     * @return {undefined}
     */
    _prepareCharacterItems(sheetData) {
        const actorData = sheetData.actor;
        const cData = actorData.data;

        // Initialize containers.
        const equipment = [];
        const skills = [];

        // Iterate through items, allocating to containers
        // let totalWeight = 0;
        for (let i of sheetData.items) {
            let item = i.data;
            i.img = i.img || DEFAULT_TOKEN;
            // Append to equipment.
            if (i.type === "item") {
                equipment.push(i);
            }
            // Append to skills.
            else if (i.type === "skill") {
                skills.push(i);
            } else if (i.type === "class") {
                cData.class = i;

                let modifier = calcStat(i, cData.race);

                cData.attributes.str.value =
                    cData.attributes.str.sValue + modifier[0];
                cData.attributes.dex.value =
                    cData.attributes.dex.sValue + modifier[1];
                cData.attributes.pow.value =
                    cData.attributes.pow.sValue + modifier[2];
                cData.attributes.int.value =
                    cData.attributes.int.sValue + modifier[3];

                cData.health.max = healthCalc(i, cData.race, cData.level.value);
            }
        }

        // Assign and return
        actorData.equipment = equipment;
        actorData.skills = skills;
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        //  Everything below here is only needed if the sheet is editable  //
        if (!this.options.editable) return;

        // ~~~~~~~~~~ Add Inventory Item ~~~~~~~~~ //
        html.find(".item-create").click(this._onItemCreate.bind(this));

        // ~~~~~~~~ Update Inventory Item ~~~~~~~~ //
        html.find(".item-edit").click((ev) => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.getOwnedItem(li.data("itemId"));
            item.sheet.render(true);
        });

        // ~~~~~~~~ Delete Inventory Item ~~~~~~~~ //
        html.find(".item-delete").click((ev) => {
            const li = $(ev.currentTarget).parents(".item");
            this.actor.deleteOwnedItem(li.data("itemId"));
            li.slideUp(200, () => this.render(false));
        });

        // ~~~~~~~~~ Rollable abilities. ~~~~~~~~~ //
        html.find(".rollable").click(this._onRoll.bind(this));

        // ~~~~~~~ Drag events for macros. ~~~~~~~ //
        if (this.actor.owner) {
            let handler = (ev) => this._onDragStart(ev);
            html.find("li.item").each((i, li) => {
                if (li.classList.contains("inventory-header")) return;
                li.setAttribute("draggable", true);
                li.addEventListener("dragstart", handler, false);
            });
        }
    }

    /**
     * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
     * @param {Event} event   The originating click event
     * @private
     */
    _onItemCreate(event) {
        event.preventDefault();
        const header = event.currentTarget;
        // Get the type of item to create.
        const type = header.dataset.type;
        // Grab any data associated with this control.
        const data = duplicate(header.dataset);
        // Initialize a default name.
        const name = `New ${type.capitalize()}`;
        // Prepare the item object.
        const itemData = {
            name: name,
            type: type,
            data: data,
        };
        // Remove the type from the dataset since it's in the itemData.type prop.
        delete itemData.data["type"];

        // Finally, create the item!
        return this.actor.createOwnedItem(itemData);
    }

    /**
     * Handle clickable rolls.
     * @param {Event} event   The originating click event
     * @private
     */
    _onRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;

        if (dataset.roll) {
            let roll = new Roll(dataset.roll, this.actor.data.data);
            let label = dataset.label ? `Rolling ${dataset.label}` : "";
            roll.roll().toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: label,
            });
        }
    }
}