/**
 * Sencha Touch maximizable plugin
 * @version 1.0
 * @copyright (c) 2014 Arda Beyazoglu
 * @licence MIT licensed
 */
Ext.define('Ext.ux.plugin.Maximizable', {
    mixins: ['Ext.mixin.Observable'],

    config: {
        /**
         * @cfg {Ext.Component} component
         * the component that use this plugin
         */
        component: null,
        /**
         * @cfg {Ext.Container} container
         * owner container of the component
         */
        container: null,
        /**
         * @cfg {Boolean} maximized
         */
        maximized: false
    },

    constructor: function(config){
        this.callParent(arguments);

        // add listeners support
        if(config.listeners){
            this.addListener(config.listeners);
        }
    },

    /**
     * initialize plugin
     * @param cmp
     */
    init: function(cmp){
        this.setComponent(cmp);

        // add neccesary method definitions to the component and bind them
        cmp.maximize = Ext.bind(this.maximize, this);
        cmp.minimize = Ext.bind(this.minimize, this);
        cmp.isMaximized = Ext.bind(this.isMaximized, this);
    },

    /**
     * set this component floating and maximized
     */
    maximize: function(){
        var me = this;

        var cmp = this.getComponent();
        if(!this.getContainer()){
            this.setContainer(cmp.up());
        }

        Ext.Viewport.add(cmp);

        cmp.element.addCls("ux-maximized-cmp");

        cmp.show({
            type: 'pop',
            listeners: {
                animationend: function(){
                    me.fireEvent("maximized", me, me.getComponent());
                }
            }
        });

        this.setMaximized(true);
    },

    /**
     * revert the component layout
     */
    minimize: function(){
        this.getContainer().add(this.getComponent());
        this.getComponent().element.removeCls("ux-maximized-cmp");

        this.setMaximized(false);

        this.fireEvent("minimized", this, this.getComponent());
    },

    /**
     * check the component is maximized or not
     * @returns {*}
     */
    isMaximized: function(){
        return this.getMaximized();
    }
});