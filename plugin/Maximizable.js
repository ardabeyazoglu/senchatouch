/**
 * Sencha Touch maximizable plugin
 * @version 1.0
 * @copyright (c) 2014 Arda Beyazoglu
 * @licence MIT licensed
 */
Ext.define('Ext.ux.plugin.Maximizable', {
    extend: 'Ext.Base',

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
        maximized: false,
        /**
         * @cfg {object} animation while maximizing
         */
        maximizeAnimation: "pop",
        /**
         * @cfg {object} animation while minimizing
         */
        minimizeAnimation: null
    },

    constructor: function(config){
        this.callParent(arguments);

        this.initConfig(config);
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

        if(this.getMaximizeAnimation()){
            var anim = this.getMaximizeAnimation();
            if(typeof(anim) == "string") anim = {type: anim};
            Ext.apply(anim, {
                listeners: {
                    animationend: function(){
                        me.fireEvent("maximize", me, me.getComponent());
                    }
                }
            });

            cmp.show(anim);
        }else{
            cmp.show();
            this.fireEvent("maximize", this, this.getComponent());
        }

        this.setMaximized(true);
    },

    /**
     * revert the component layout
     */
    minimize: function(){
        var me = this;

        if(this.getMinimizeAnimation()){
            var anim = this.getMinimizeAnimation();
            if(typeof(anim) == "string") anim = {type: anim};
            Ext.apply(anim, {
                listeners: {
                    animationend: function(){
                        me.getContainer().add(me.getComponent());
                        me.getComponent().element.removeCls("ux-maximized-cmp");

                        me.fireEvent("minimize", me, me.getComponent());
                    }
                }
            });

            me.getComponent().hide(anim);
        }else{
            this.getContainer().add(this.getComponent());
            this.getComponent().element.removeCls("ux-maximized-cmp");

            this.fireEvent("minimize", this, this.getComponent());
        }

        this.setMaximized(false);
    },

    /**
     * check the component is maximized or not
     * @returns {*}
     */
    isMaximized: function(){
        return this.getMaximized();
    }
});