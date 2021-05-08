/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class LoghorizonItem extends Item {
    /**
     * Augment the basic Item data model with additional dynamic data.
     */
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
        const token = this.actor.token;
        const item = this.data;
        const actorData = this.actor ? this.actor.data.data : {};
        const itemData = item.data;

        let roll = new Roll("d6+@attributes.str.mod", actorData);
        let label = `Rolling ${item.name}`;
        roll.roll().toMessage({
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: label,
        });
    }

    /* get amods() {
        const item = this.data;
        const itemData = item.data;

        let result = {
            str: itemData.statIncreases.str.value,
            dex: itemData.statIncreases.dex.value,
            pow: itemData.statIncreases.pow.value,
            int: itemData.statIncreases.int.value,
        };
        return result;
    }*/

    /* calcHp(level) {
        const item = this.data;
        const itemData = item.data;

        let base = itemData.hp.base;
        let mod = itemData.hp.modifier;
        let lvl = level - 1;

        return base + mod * lvl;
    } */
}
