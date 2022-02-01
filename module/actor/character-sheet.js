import { calcStat, healthCalc } from "./auxscripts/actorCalculations.js";
import * as Dice from "../dice.js";

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
            width: 770,
            height: 500,
            tabs: [
                {
                    navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "basestats",
                },
            ],
        });
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    /** @override */
    getData() {
        const baseData = super.getData();
        baseData.dtypes = ["String", "Number", "Boolean"];

        let sheetData = {
            editable: this.isEditable,
            actor: this.actor,
            data: this.actor.data.data,
            config: CONFIG.loghorizonD,
        };

        // Prepare items.
        if (this.actor.data.type == "character") {
            this._prepareCharacterItems(baseData);
        }

        return sheetData;
    }

    /**
     * Organize and classify Items for Character sheets.
     *
     * @param {Object} actorData The actor to prepare.
     *
     * @return {undefined}
     */
    _prepareCharacterItems(baseData) {
        const actorData = this.actor;
        const cData = this.actor.data.data;

        // Initialize containers.
        const equipment = [];
        const skills = [];

        // Iterate through items, allocating to containers
        // let totalWeight = 0;
        for (let i of baseData.items) {
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
                    cData.attributes.str.extra + modifier[0];
                cData.attributes.dex.value =
                    cData.attributes.dex.extra + modifier[1];
                cData.attributes.pow.value =
                    cData.attributes.pow.extra + modifier[2];
                cData.attributes.int.value =
                    cData.attributes.int.extra + modifier[3];

                cData.health.max =
                    healthCalc(i, cData.race, cData.level.value) +
                    cData.health.extra;
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
            const item = this.actor.items.get(li.data("itemId"));
            //getOwnedItem(li.data("itemId"));
            item.sheet.render(true);
        });

        // ~~~~~~~~ Delete Inventory Item ~~~~~~~~ //
        html.find(".item-delete").click((ev) => {
            const li = $(ev.currentTarget).parents(".item");
            this.actor.deleteEmbeddedDocuments("Item", [itemId]);
            //OwnedItem(li.data("itemId"));
            li.slideUp(200, () => this.render(false));
        });

        // ~~~~~~~~~ Rollable abilities. ~~~~~~~~~ //
        html.find(".rollable").click(this._onRoll.bind(this));

        // ~~~~~~~ Drag events for macros. ~~~~~~~ //
        if (this.actor.isOwner) {
            let handler = (ev) => this._onDragStart(ev);
            html.find("li.item").each((i, li) => {
                if (li.classList.contains("inventory-header")) return;
                li.setAttribute("draggable", true);
                li.addEventListener("dragstart", handler, false);
            });
            html.find(".item-roll").click(this._onItemRoll.bind(this));
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
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
        //OwnedItem(itemData);
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
            let rollResult = new Roll(dataset.roll, this.actor.data.data).roll({
                async: true,
            });
            let label = dataset.label ? `Rolling ${dataset.label}` : "";
            rollResult.toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: label,
            });
        }
    }

    _onItemRoll(event) {
        const itemID = event.currentTarget.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemID);
        //getOwnedItem(itemID);

        item.roll();
    }
}
