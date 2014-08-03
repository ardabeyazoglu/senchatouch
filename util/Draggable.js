Ext.define('Ext.ux.util.Draggable', {
    extend: 'Ext.util.Draggable',

    config: {
        revert: false
    },

    constructor: function(config) {
        this.callParent(arguments);

        if(config.group){
            this.group = config.group;
        }

        if(!Ext.Draggables){
            Ext.Draggables = {};
        }

        if(!Ext.Draggables[this.group]){
            Ext.Draggables[this.group] = [];
        }

        var index = Ext.Draggables[this.group].push(this);
        this.draggableIndex = index - 1;

        return this;
    },

    destroy: function(){
        this.callParent(arguments);

        delete Ext.Draggables[this.draggableIndex];
    },

    onDragStart: function(){
        this.callParent(arguments);

        // keep old container info of draggable element
        this.oldContainer = this.getElement().parent();
    },

    onDragEnd: function(e) {
        if (!this.isDragging) {
            return;
        }

        this.onDrag(e);

        this.isDragging = false;
        this.getElement().removeCls(this.getDraggingCls());

        this.fireEvent('dragend', this, e, this.offset.x, this.offset.y);

        if(this.getRevert() && !this.dropAllowed){
            this.setOffset(this.dragStartOffset.x, this.dragStartOffset.y, {
                duration: 250
            });
        }
    }

});