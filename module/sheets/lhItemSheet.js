export default class lhItemSheet extends ItemSheet {
    get template() {
        return "systems/loghorizon/templates/sheets/${this.item.data.type}-sheet.html";
    }
}
