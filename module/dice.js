export async function useCheck(skill, pj) {
    const messageTemplate =
        "systems/loghorizon/templates/item/checks/use-skill-check.hbs";

    let checkValue = pj.getAbility(skill.data.data.ability);
    let rollFormula = "2d6 + @checkValue";
    let rollData = {
        checkValue: checkValue,
    };
    let roll = await new Roll(rollFormula, rollData);
    let rollResult = roll.roll({ async: true });

    let messageData = {
        speaker: ChatMessage.getSpeaker(),
        content: await rollResult.render({
            template: messageTemplate,
        }),
    };

    rollResult.toMessage(messageData);
}
