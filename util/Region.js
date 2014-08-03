/**
 * Sencha Touch region utility with new drop modes
 * @version 1.0
 * @copyright (c) 2014 Arda Beyazoglu
 * @licence MIT licensed
 */
Ext.define('Ext.ux.util.Region', {
    override: 'Ext.util.Region',

    /**
     * checks if region contains more than half of the element verticaly
     * @param region (draggable)
     */
    containsVertical: function(region){
        if(this.intersect(region) !== false){
            var size = region.getSize(), dif;
            if(this.top > region.top){
                dif = region.bottom - this.top;
            }else if(this.bottom < region.bottom){
                dif = region.top - this.bottom;
            }else return this.contains(region);

            dif = Math.abs(dif);
            return (dif > size.height / 2);
        }else{
            return false;
        }
    },

    /**
     * checks if region contains more than half of the element horizontally
     * @param region
     * @returns {*}
     */
    containsHorizontal: function(region){
        if(this.intersect(region) !== false){
            var size = region.getSize(), dif;
            if(this.left > region.left){
                dif = region.right - this.left;
            }else if(this.right < region.right){
                dif = region.left - this.right;
            }else return this.contains(region);

            dif = Math.abs(dif);
            return (dif > size.width / 2);
        }else{
            return false;
        }
    },

    // alias for intersect
    intersects: function(){
        return this.intersect();
    }
});