import SJEmitter from "../emitter/emitter";

export default class SJToolBar extends SJEmitter {
    private toolbarEl: HTMLDivElement;
    private toolbarItems: NodeListOf<Element>;
    constructor(toolbarEl: HTMLDivElement) {
        super();
        this.toolbarEl = toolbarEl;
        this.toolbarItems = document.querySelectorAll('.sj-wb-toolbar-item');
        this.registerEvents();
    }

    private registerEvents() {
        this.toolbarItems.forEach(item => {
            item.on('click', this.onItemClick, false);
        })
    }

    private onItemClick = (event: MouseEvent) =>{
        const currentTarget = event.currentTarget as Element;
        const type = currentTarget.getAttribute('type');
        this.toolbarItems.forEach(ti => {
            const tType = ti.getAttribute('type');
            if(tType === type) {
                ti.classList.add('selected');
            }else {
                ti.classList.remove('selected');
            }
        });
        this.emit('toolbar-change', {type});
    }
}