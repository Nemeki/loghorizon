import { calcStat, healthCalc } from "./auxscripts/actorCalculations.js";

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
        if (actorData.type === "character") {
            this._prepareCharacterData(actorData);
        } else if (actorData.type === "enemy") {
            this._prepareEnemyData(actorData);
        }
    }

    /** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     * Prepara datos especificos del personaje
     * es una buena función para calcular
     * valores derivados
     * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    _prepareCharacterData(actorData) {
        const data = actorData.data;
        var high = 0;
        /* let modifier = calcStat(data.class, data.race);

        data.attributes.str.value = data.attributes.str.sValue + modifier[0];
        data.attributes.dex.value = data.attributes.dex.sValue + modifier[1];
        data.attributes.pow.value = data.attributes.pow.sValue + modifier[2];
        data.attributes.int.value = data.attributes.int.sValue + modifier[3];

        data.health.max = healthCalc(data.class, data.race, data.level.value); */

        if (data.race == "dwarf" || data.race == "wolffang") {
            data.fate.rMod = 0;
        } else if (data.race == "raceofritual") {
            data.fate.rMod = 2;
        } else {
            data.fate.rMod = 1;
        }

        for (let [key, attribute] of Object.entries(data.attributes)) {
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
        data.fate.max += data.fate.rMod;
        data.battleStatus.phyDef.value += data.attributes.str.mod * 2;
        data.battleStatus.magicDef.value += data.attributes.int.mod * 2;
        data.battleStatus.initiative.value +=
            data.attributes.str.mod + data.attributes.int.mod;
    }

    _prepareEnemyData(actorData) {
        const data = actorData.data;
    }

    getAbility(valor) {
        let data = this.data.data.abilities;
        let result = 0;

        switch (valor) {
            case 1:
                result = data.athletics.value;
                break;
            case 2:
                result = data.disable.value;
                break;
            case 3:
                result = data.perception.value;
                break;
            case 4:
                result = data.knowledge.value;
                break;
            case 5:
                result = data.endurance.value;
                break;
            case 6:
                result = data.operate.value;
                break;
            case 7:
                result = data.negotiation.value;
                break;
            case 8:
                result = data.analyze.value;
                break;
            case 9:
                result = data.resistance.value;
                break;
            case 10:
                result = data.evasion.value;
                break;
            case 11:
                result = data.accuracy.value;
                break;
            default:
                break;
        }

        return result;
    }

    recalculate() {
        let data = this.data.data;
        var high = 0;

        for (let [key, attribute] of Object.entries(data.attributes)) {
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
        data.fate.max += data.fate.rMod;
        data.battleStatus.phyDef.value += data.attributes.str.mod * 2;
        data.battleStatus.magicDef.value += data.attributes.int.mod * 2;
        data.battleStatus.initiative.value +=
            data.attributes.str.mod + data.attributes.int.mod;
    }
}
