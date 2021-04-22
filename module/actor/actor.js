/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class LoghorizonActor extends Actor {
    /**
     * Augment the basic actor data with additional dynamic data.
     */
    prepareData() {
        super.prepareData();

        const actorData = this.data;
        const data = actorData.data;
        const flags = actorData.flags;

        // Make separate methods for each Actor type (character, npc, etc.) to keep
        // things organized.
        if (actorData.type === "character")
            this._prepareCharacterData(actorData);
    }

    /**
     * Prepare Character type specific data
     */
    _prepareCharacterData(actorData) {
        const data = actorData.data;
        var high = 0;

        // Make modifications to data here. For example:

        // Loop through ability scores, and add their modifiers to our sheet output. DELETE
        //key es el nombre del atributo DELETE
        for (let [key, attribute] of Object.entries(data.attributes)) {
            // Calculate the modifier using d20 rules.
            attribute.mod = Math.floor(attribute.value / 3);
            if (attribute.mod > high) {
                high = attribute.mod;
            }
        }
        data.ability.athletics = data.attributes.str;
        data.ability.endurance = data.attributes.str;
        data.ability.disable = data.attributes.dex;
        data.ability.operate = data.attributes.dex;
        data.ability.evasion = data.attributes.dex;
        data.ability.perception = data.attributes.pow;
        data.ability.negotiation = data.attributes.pow;
        data.ability.resistance = data.attributes.pow;
        data.ability.knowledge = data.attributes.int;
        data.ability.analyze = data.attributes.int;

        data.ability.accuracy = high;

        data.battleStatus.phyDefense = data.attributes.str * 2;
        data.battleStatus.magicDefense = data.attributes.int * 2;
        data.battleStatus.initiative =
            data.attributes.str + data.attributes.int;
    }
}
