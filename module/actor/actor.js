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
        data.abilities.athletics.value = data.attributes.str.mod;
        data.abilities.endurance.value = data.attributes.str.mod;
        data.abilities.disable.value = data.attributes.dex.mod;
        data.abilities.operate.value = data.attributes.dex.mod;
        data.abilities.evasion.value = data.attributes.dex.mod;
        data.abilities.perception.value = data.attributes.pow.mod;
        data.abilities.negotiation.value = data.attributes.pow.mod;
        data.abilities.resistance.value = data.attributes.pow.mod;
        data.abilities.knowledge.value = data.attributes.int.mod;
        data.abilities.analyze.value = data.attributes.int.mod;

        data.abilities.accuracy.value = high;

        data.battleStatus.phyDefense.value = data.attributes.str.mod * 2;
        data.battleStatus.magicDefense.value = data.attributes.int.mod * 2;
        data.battleStatus.initiative.value =
            data.attributes.str.mod + data.attributes.int.mod;
    }
}
