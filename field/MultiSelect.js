/*
 * Sencha Touch select field with multiple selection
 * Copyright(c) 2014 Arda Beyazoglu
 * MIT Licensed
 */
Ext.define('kiva.field.MultiSelect', {
    extend: 'Ext.field.Select',

    xtype: 'multiselectfield',

    _selectedRecords: [],

    initConfig: function(config){
        this.callParent(arguments);
    },

    /**
     * override to show multi selectable list
     * @private
     * @returns {*}
     */
    getTabletPicker: function() {
        var config = this.getDefaultTabletPickerConfig();

        if (!this.listPanel) {
            this.listPanel = Ext.create('Ext.Panel', Ext.apply({
                left: 0,
                top: 0,
                modal: true,
                cls: Ext.baseCSSPrefix + 'select-overlay',
                layout: 'fit',
                hideOnMaskTap: true,
                width: Ext.os.is.Phone ? '14em' : '18em',
                height: (Ext.os.is.BlackBerry && Ext.os.version.getMajor() === 10) ? '12em' : (Ext.os.is.Phone ? '12.5em' : '22em'),
                items: {
                    xtype: 'list',
                    store: this.getStore(),
                    mode: 'MULTI',
                    itemTpl: '<span class="x-list-label">{' + this.getDisplayField() + ':htmlEncode}</span>',
                    listeners: {
                        select: this.onListSelect,
                        deselect: this.onListDeselect,
                        itemtap: this.onListTap,
                        scope: this
                    }
                }
            }, config));
        }

        return this.listPanel;
    },

    /**
     * TODO override to allow multiple selection
     * @returns {*}
     */
    getPhonePicker: function() {
        this.callParent(arguments);
    },

    /**
     * override to show multi selectable list
     * {@link Ext.List list}.
     */
    showPicker: function() {
        var me = this,
            store = me.getStore(),
            value = me.getValue();

        //check if the store is empty, if it is, return
        if (!store || store.getCount() === 0) {
            return;
        }

        if (me.getReadOnly()) {
            return;
        }

        me.isFocused = true;

        if (me.getUsePicker()) {
            var picker = me.getPhonePicker(),
                name = me.getName(),
                pickerValue = {};

            pickerValue[name] = value;
            picker.setValue(pickerValue);

            if (!picker.getParent()) {
                Ext.Viewport.add(picker);
            }

            picker.show();
        } else {
            var listPanel = me.getTabletPicker(),
                list = listPanel.down('list');

            if (!listPanel.getParent()) {
                Ext.Viewport.add(listPanel);
            }

            listPanel.showBy(me.getComponent(), null);

            if (this._selectedRecords.length > 0 || me.getAutoSelect()) {
                for(var key in this._selectedRecords){
                    if(this._selectedRecords.hasOwnProperty(key)){
                        list.select(this._selectedRecords[key], true, true);
                    }
                }
            }
        }
    },

    // @private
    onListSelect: function(list, record) {
        if(record){
            this.appendRecord(record);
        }
    },

    // @private
    onListDeselect: function(list, record) {
        if(record){
            this.removeRecord(record);
        }
    },

    /**
     * override to keep the list open
     */
    onListTap: function() {
        // skip
    },

    /**
     * get selected values
     * @returns {Array}
     */
    getValue: function() {
        var values = [];
        for(var key in this._selectedRecords){
            if(this._selectedRecords.hasOwnProperty(key)){
                values.push(this._selectedRecords[key].get(this.getValueField()));
            }
        }

        return values;
    },

    /**
     * set value in array format or single string value
     * @param value
     */
    setValue: function(value){
        this._selectedRecords = [];

        if(value){
            var ids = typeof(value) == 'string' ? [value] : value;
            for(var key in ids){
                if(ids.hasOwnProperty(key)){
                    var rc = this.getStore().findRecord(this.getValueField(), ids[key]);
                    if(rc){
                        this._selectedRecords[rc.id] = rc;
                    }
                }
            }
        }

        this.updateValue();
    },

    /**
     * override to single selectfield to display multi values
     */
    updateValue: function(){
        var component  = this.getComponent();
        if(component){
            component.setValue(this.getDisplayValue());
        }

        var valueValid = component.getValue() != "";
        this[valueValid && this.isDirty() ? 'showClearIcon' : 'hideClearIcon']();

        this.syncEmptyCls();
    },

    /**
     * append a record to selections
     * @param record
     */
    appendRecord: function(record){
        this._selectedRecords[record.id] = record;
        this.updateValue();
    },

    /**
     * remove a record from selections
     * @param record
     */
    removeRecord: function(record){
        delete this._selectedRecords[record.id];
        this.updateValue();
    },

    /**
     * get displayed text inside the field
     * @returns {string}
     */
    getDisplayValue: function(){
        var labels = [];
        for(var key in this._selectedRecords){
            if(this._selectedRecords.hasOwnProperty(key)){
                labels.push(this._selectedRecords[key].get(this.getDisplayField()));
            }
        }

        return labels.join(", ");
    }
});