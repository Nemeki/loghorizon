/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class LoghorizonItem extends Item {
    /**
     * Augment the basic Item data model with additional dynamic data.
     */

    chatTemplate = {
        item: "systems/loghorizon/templates/item/cards/item-card.hbs",
        skill: "systems/loghorizon/templates/item/cards/skill-card.hbs",
        class: "systems/loghorizon/templates/item/cards/class-card.hbs",
    };

    prepareData() {
        super.prepareData();

        // Get the Item's data
        const itemData = this.data;
        const actorData = this.actor ? this.actor.data : {};
        const data = itemData.data;
    }

    /**
     * Handle clickable rolls.
     * @param {Event} event   The originating click event
     * @private
     */
    async roll() {
        // Basic template rendering data
        /* const token = this.actor.token;
        const item = this.data;
        const actorData = this.actor ? this.actor.data.data : {};
        const itemData = item.data;

        let roll = new Roll("d6+@attributes.str.mod", actorData);
        let label = `Rolling ${item.name}`;
        roll.roll().toMessage({
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: label,
        }); */

        let chatData = {
            user: game.user._id,
            speaker: ChatMessage.getSpeaker(),
        };

        let cardData = {
            ...this.data,
            owner: this.actor.id,
        };

        chatData.content = await renderTemplate(
            this.chatTemplate[this.type],
            cardData
        );

        chatData.roll = true;

        return ChatMessage.create(chatData);
    }
}
