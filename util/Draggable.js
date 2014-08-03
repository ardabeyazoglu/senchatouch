/**
 * Sencha Touch draggable extension with element based dragging
 * @version 1.0
 * @copyright (c) 2014 Arda Beyazoglu
 * @licence MIT licensed
 */
Ext.define('Ext.ux.util.Draggable', {
    extend: 'Ext.util.Draggable',

    config: {
        /**
         * @cfg {bool} true to revert drag operation if drop not allowed
         */
        revert: false,

        /**
         * @cfg {string} group
         */
        group: 'base'
    },

    constructor: function(config) {
        this.callParent(arguments);

        // compatibility
        this.group = this.getGroup();

        // init global draggable cache
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

    /**
     * destroy draggable
     */
    destroy: function(){
        this.callParent(arguments);

        delete Ext.Draggables[this.draggableIndex];
    },

    /**
     * on drag start
     */
    onDragStart: function(){
        this.callParent(arguments);

        // keep old container info of draggable element
        this.oldContainer = this.getElement().parent();
    },

    /**
     * on drag end
     * @param e
     */
    onDragEnd: function(e) {
        if (!this.isDragging) {
            return;
        }

        this.onDrag(e);

        this.isDragging = false;
        this.getElement().removeCls(this.getDraggingCls());

        this.fireEvent('dragend', this, e, this.offset.x, this.offset.y);

        // revert back ?
        if(this.getRevert() && !this.dropAllowed){
            this.setOffset(this.dragStartOffset.x, this.dragStartOffset.y, {
                duration: 250
            });
        }
    }

});