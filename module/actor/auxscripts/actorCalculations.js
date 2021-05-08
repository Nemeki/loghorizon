export function calcStat(actorClass, race) {
    let mods = [0, 0, 0, 0];
    let increases = actorClass.data.statIncreases;

    switch (race) {
        case "elf":
            mods[1] = 1;
            mods[2] = 1;
            break;
        case "dwarf":
            mods[0] = 1;
            mods[2] = 1;
            break;
        case "halfalv":
            mods[1] = 1;
            mods[3] = 1;
            break;
        case "werecat":
            mods[0] = 1;
            mods[1] = 1;
            break;
        case "wolffang":
            mods[0] = 2;
            break;
        case "foxtail":
            mods[2] = 1;
            mods[3] = 1;
            break;
        case "raceofritual":
            mods[3] = 2;
            break;
        default:
            break;
    }

    mods[0] += increases.str.value;
    mods[1] += increases.dex.value;
    mods[2] += increases.pow.value;
    mods[3] += increases.int.value;

    return mods;
}

export function healthCalc(actorClass, race, level) {
    let rHp = 8;
    let hpData = actorClass.data.hp;
    let lvlmod = (level - 1) * hpData.modifier;
    if (race == "dwarf" || race == "wolffang") {
        rHp = 16;
    } else if (race == "raceofritual") {
        rHp = 0;
    }

    return rHp + hpData.base + lvlmod;
}
