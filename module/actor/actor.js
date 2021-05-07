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

    /** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     * Prepara datos especificos del personaje
     * es una buena función para calcular
     * valores derivados
     * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    _prepareCharacterData(actorData) {
        const data = actorData.data;
        var high = 0;
        data.health.rMod = 0;
        data.fate.rMod = 0;

        switch (data.race) {
            case "human":
                data.health.rMod = 8;
                data.fate.rMod = 1;
                data.attributes.str.rMod = 0;
                data.attributes.dex.rMod = 0;
                data.attributes.pow.rMod = 0;
                data.attributes.int.rMod = 0;
                break;
            case "elf":
                data.health.rMod = 8;
                data.fate.rMod = 1;
                data.attributes.str.rMod = 0;
                data.attributes.dex.rMod = 1;
                data.attributes.pow.rMod = 1;
                data.attributes.int.rMod = 0;
                break;
            case "dwarf":
                data.health.rMod = 16;
                data.fate.rMod = 0;
                data.attributes.str.rMod = 1;
                data.attributes.dex.rMod = 0;
                data.attributes.pow.rMod = 1;
                data.attributes.int.rMod = 0;
                break;
            case "halfalv":
                data.health.rMod = 8;
                data.fate.rMod = 1;
                data.attributes.str.rMod = 0;
                data.attributes.dex.rMod = 1;
                data.attributes.pow.rMod = 0;
                data.attributes.int.rMod = 1;
                break;
            case "werecat":
                data.health.rMod = 8;
                data.fate.rMod = 1;
                data.attributes.str.rMod = 1;
                data.attributes.dex.rMod = 1;
                data.attributes.pow.rMod = 0;
                data.attributes.int.rMod = 0;
                break;
            case "wolffang":
                data.health.rMod = 16;
                data.fate.rMod = 0;
                data.attributes.str.rMod = 2;
                data.attributes.dex.rMod = 0;
                data.attributes.pow.rMod = 0;
                data.attributes.int.rMod = 0;
                break;
            case "foxtail":
                data.health.rMod = 8;
                data.fate.rMod = 1;
                data.attributes.str.rMod = 0;
                data.attributes.dex.rMod = 0;
                data.attributes.pow.rMod = 1;
                data.attributes.int.rMod = 1;
                break;
            case "raceofritual":
                data.health.rMod = 0;
                data.fate.rMod = 2;
                data.attributes.str.rMod = 0;
                data.attributes.dex.rMod = 0;
                data.attributes.pow.rMod = 0;
                data.attributes.int.rMod = 2;
                break;
            default:
                break;
        }

        for (let [key, attribute] of Object.entries(data.attributes)) {
            attribute.value = attribute.sValue + attribute.rMod; //attribute.cMod
            attribute.mod = Math.floor(attribute.value / 3);
            if (attribute.mod > high) {
                high = attribute.mod;
            }
        }

        // ~~~~~~ Calculo de las habilidades ~~~~~ //
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

        // ~~~~~~ Calculo del battle status ~~~~~~ //
        data.health.max = data.health.rMod; //data.health.cMod
        data.fate.max = data.fate.rMod;
        data.battleStatus.phyDefense.value = data.attributes.str.mod * 2;
        data.battleStatus.magicDefense.value = data.attributes.int.mod * 2;
        data.battleStatus.initiative.value =
            data.attributes.str.mod + data.attributes.int.mod;
    }
}
