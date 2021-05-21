import * as Dice from "./dice.js";

export function addChatListeners(html) {
    html.on("click", "button.use", onUse);
}

function onUse(event) {
    const card = event.currentTarget.closest(".skill");
    let pj = game.actors.get(card.dataset.ownerId);
    let skill = pj.getOwnedItem(card.dataset.itemId);
    Dice.useCheck(skill, pj);
}
