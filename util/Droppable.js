Ext.define('Ext.ux.util.Droppable', {
    mixins: {
        observable: 'Ext.mixin.Observable'
    },

    requires: [
        'Ext.util.Region'
    ],

    config: {
        baseCls: Ext.baseCSSPrefix + 'droppable',
        activeCls: Ext.baseCSSPrefix + 'drop-active',
        invalidCls: Ext.baseCSSPrefix + 'drop-invalid',
        hoverCls: Ext.baseCSSPrefix + 'drop-hover',

        /**
         * @cfg {String} validDropMode
         * Valid values are: 'intersects', 'contains', 'containsVertical', 'containsHorizontal'
         */
        validDropMode: 'intersect',

        /**
         * @cfg {Boolean} disabled
         */
        disabled: false,

        /**
         * @cfg {String} group
         * Draggable and Droppable objects can participate in a group which are
         * capable of interacting.
         */
        group: 'base',

        /**
         * @cfg {Ext.Element} el
         */
        element: null
    },

    // @private
    monitoring: false,

    /**
     * Creates new Droppable
     * @param {Object} config Configuration options for this class.
     */
    constructor: function(config) {
        var me = this;

        config = config || {};
        Ext.apply(me, config);

        // init element
        config.element = Ext.get(config.element);

        this.initConfig(config);

        // init droppable
        if(!this.getDisabled()){
            this.enable();
        }

        // init global droppable cache
        if(!Ext.Droppables){
            Ext.Droppables = {};
        }

        var group = this.getGroup();
        if(!Ext.Droppables[group]){
            Ext.Droppables[group] = [];
        }
        Ext.Droppables[group].push(this);

        return me;
    },

    // @private
    onDragStart: function(draggable, e) {
        var me = this;
        var element = me.getElement() || me;

        draggable.dropAllowed = false;

        if (draggable.group === me.group) {
            me.monitoring = true;
            element.addCls(me.getActiveCls());

            me.region = element.getPageBox(true);

            draggable.on({
                order: 'before',
                drag: me.onDrag,
                dragend: me.onDragEnd,
                scope: me
            });

            if (me.isDragOver(draggable)) {
                me.setCanDrop(true, draggable, e);
            }

            me.fireEvent('dropactivate', me, draggable, e);
        } else {
            draggable.on({
                dragend: function() {
                    element.removeCls(me.getInvalidCls());
                },
                scope: me,
                single: true
            });

            element.addCls(me.getInvalidCls());
        }
    },

    // @private
    isDragOver: function(draggable) {
        var dRegion = (draggable.getElement() || draggable).getPageBox(true);
        return this.region[this.validDropMode](dRegion);
    },

    // @private
    onDrag: function(draggable, e) {
        this.setCanDrop(this.isDragOver(draggable), draggable, e);
    },

    // @private
    setCanDrop: function(canDrop, draggable, e) {
        if (canDrop && !this.canDrop) {
            this.canDrop = true;
            this.getElement().addCls(this.getHoverCls());
            this.fireEvent('dropenter', this, draggable, e);
        }else if (!canDrop && this.canDrop) {
            this.canDrop = false;
            this.getElement().removeCls(this.getHoverCls());
            this.fireEvent('dropleave', this, draggable, e);
        }
    },

    // @private
    onDragEnd: function(draggable, e) {
        this.monitoring = false;
        this.getElement().removeCls(this.getActiveCls());

        draggable.un({
            drag: this.onDrag,
            dragend: this.onDragEnd,
            scope: this
        });

        if(this.canDrop){
            draggable.dropAllowed = true;

            this.canDrop = false;
            this.getElement().removeCls(this.getHoverCls());
            this.fireEvent('drop', this, draggable, e);
        }

        this.fireEvent('dropdeactivate', this, draggable, e);
    },

    /**
     * Enable the Droppable target.
     * This is invoked immediately after constructing a Droppable if the
     * disabled parameter is NOT set to true.
     */
    enable: function() {
        if(!Ext.Draggables){
            Ext.Draggables = {};
        }

        var group = this.getGroup();
        if(!Ext.Draggables[group]){
            Ext.Draggables[group] = [];
        }

        var draggables = Ext.Draggables[group];
        for(var key in draggables){
            if(draggables.hasOwnProperty(key)){
                draggables[key].on({
                    scope: this,
                    dragstart: this.onDragStart
                });
            }
        }

        this.setDisabled(true);
    },

    /**
     * Disable the Droppable
     */
    disable: function() {
        var group = this.getGroup();
        if(Ext.Draggables && Ext.Draggables[group]){
            var draggables = Ext.Draggables[group];
            for (var key in draggables) {
                if(draggables.hasOwnProperty(key)){
                    draggables[key].un({
                        scope: this,
                        dragstart: this.onDragStart
                    });
                }
            }
        }

        this.setDisabled(true);
    },

    /**
     * Method to determine whether this Droppable is currently monitoring drag operations of Draggables.
     * @return {Boolean} the monitoring state of this Droppable
     */
    isMonitoring: function() {
        return this.monitoring;
    }
});