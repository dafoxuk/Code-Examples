jQuery(document).ready(function($){

    'use strict';

    /**
    * Declare OptionCalc object
    * @param DOM element
    *
    **/

    function OptionCalc(el){

        // dom and values
        this.calc = el;
        this.type = this.calc.find('.option-type');
        this.lngth = this.calc.find('#option-length');
        this.hght = this.calc.find('#option-height');
        this.items = [];

        // target divs

        this.itemsDiv = this.calc.find('#option-items');
        this.totalDiv = this.calc.find('#option-totals');
        this.hghtFtDiv = this.calc.find('#option-height-feet');
        this.lngthFtDiv = this.calc.find('#option-length-feet');

        // init
        
        this.init();

        // custom vals

        this.postHeightMap = {
            '1-2' : '1-8',
            '1-5' : '2-1',
            '1-8' : '2-4',
            '2-1' : '2-7'
        }
    }

    /**
    * Add methods to the OptionCalc object
    *
    *
    **/

    OptionCalc.prototype = {
        /**
        * Initalise the object. Add Event Listeners
        *
        **/

        init: function(){

            var obj = this;

            // clicking a option
            obj.calc.on('click', '.option-type', function(){

                obj.setClass($(this.parentNode.parentNode).find('.option-wrap'), this, '.option-type', 'option-selected');

                obj.listHeights();

            });

            // selecting a length
            obj.lngth.on('change', 'input', function(){

                obj.lngthFtDiv.html( obj.convertMetric( obj.getLength(), 3.28084) + ' FOOT');

                obj.itemsDiv.html( obj.itemsTable() );

                obj.totalDiv.html( '&pound;' + obj.getTotals().toFixed(2) );

            });

            // selecting a height
            obj.hght.on('click', 'li', function(){
                
                obj.setClass(this.parentNode, this, 'li', 'height-selected');

                if (obj.getSelectedOptions() == 3) {
                    obj.itemsDiv.html( obj.itemsTable() );

                    obj.hghtFtDiv.html( parseFloat(obj.convertMetric( (parseFloat(obj.getHeight().replace('-', '.'))+parseFloat(obj.getBoardHeight())), 3.28084 )).toFixed() + ' FOOT' );

                    obj.totalDiv.html( '&pound;' + obj.getTotals().toFixed(2) );
                } else {
                    alert("Please make sure you have selected a panel, a post and a board from the above options");
                }
                

            });
        },
        
        /**
        * Set CSS class to target
        *
        **/

        setClass: function(parent, clicked, target, selectClass){
            $(parent).children(target).removeClass(selectClass);
            $(clicked).addClass(selectClass);
        },

        /**
        * Return the selected length
        *
        **/
        
        getLength: function(){
            return parseFloat(this.calc.find( '.length-selected input' ).val());
        },

        /**
        * Return the selected height
        *
        **/

        getHeight: function(){
            if ( this.calc.find( '.height-selected' )){
                return this.calc.find( '.height-selected' ).attr( 'data-height' );
            } else {
                return false;
            }
        },

        /**
        * Return the calculated quantities
        *
        **/

        getQuantities: function(qty){
            return qty * Math.ceil(this.getLength() / 1.9);
        },

        /**
        * Return the selected options
        *
        **/

        getSelectedOptions: function(){
             var obj = this;
             return obj.calc.find('.option-selected').length;
        },

        /**
        * Return any selected addons
        *
        **/

        getAddons: function(){
            var obj = this;
            obj.items = [];
            obj.calc.find('.option-selected').each(function(i){
                obj.items.push(JSON.parse($(this).attr('data-addons')) );
            });

            return obj.items;
        },

        /**
        * Return the items excluded by the selected options
        *
        **/

        getExcludes: function(){
            var obj = this;
            var excludes = [];
            obj.calc.find('.option-selected').each(function(i){
                $.each(JSON.parse($(this).attr('data-excludes')), function(){
                   excludes.push(this);
                })
            });

            return excludes;
        },

        /**
        * Return the attributes of an option
        *
        **/

        getAttributes: function( height, vars, field ){
            if ( vars[height] &&  vars[height][0][field]){
                return vars[height][0][field];
             }
             else {
                return '';
             }
        },

        /**
        * Convert the METERS to FEET
        *
        **/

        convertMetric: function(metric, multiplier){
            return (metric*multiplier).toFixed(2);
        },

        /**
        * Render the quote table
        *
        **/

        itemsTable: function(){

            var obj = this;

            if ( $( document ).width() > 641 ) {
                var qtyTitle = 'Quantity';
                var prodCode = 'Product Code';
            }
            else {
                var qtyTitle = 'Qty';
                var prodCode = 'Code';
            }

            var table = '<table>' +
                        '<thead><th>Item</th><th>'+qtyTitle+'</th><th>'+prodCode+'</th><th>Price</th></thead>'+
                        '<tbody>';
                        
            this.calc.find('.option-selected').each(function(){

                // lines for variable products except posts
                if ( $(this).attr('data-vars') && $(this).attr('data-option') !== 'post-type' ) {
                    table += '<tr><td>'+$(this).attr('data-name')+'</td><td>'+(Math.ceil(obj.getQuantities(1))+Math.ceil(parseFloat($(this).attr('data-initialqty'))))+'</td><td class="options-table-sku">'+obj.getAttributes( obj.getHeight(), JSON.parse($(this).attr('data-vars')), 'sku' )+'</td><td class="options-table-cost">&pound;'+ (obj.getAttributes( obj.getHeight(), JSON.parse($(this).attr('data-vars')), 'cost' )*(Math.ceil(obj.getQuantities(1))+parseFloat($(this).attr('data-initialqty')))).toFixed(2) +'</td></tr>';
                }
                // lines for non variable products except posts
                if ( $(this).attr('data-cost') && $(this).attr('data-option') !== 'post-type' ) {
                    table += '<tr><td>'+$(this).attr('data-name')+'</td><td>'+(Math.ceil(obj.getQuantities(1))+Math.ceil(parseFloat($(this).attr('data-initialqty'))))+'</td><td class="options-table-sku">'+$(this).attr('data-sku')+'</td><td class="options-table-cost">&pound;'+ ( $(this).attr('data-cost')*(Math.ceil(obj.getQuantities(1)+parseFloat($(this).attr('data-initialqty')))) ).toFixed(2) +'</td></tr>';
                }
                // lines for only posts and must be variable products
                if ( $(this).attr('data-vars') && $(this).attr('data-option') == 'post-type' ) {
                   var newHeight = (parseFloat(obj.getHeight().replace(/\-/g, '.'))+ parseFloat(obj.getBoardHeight())).toFixed(1).replace(/\./g, '-');

                    table += '<tr><td>'+$(this).attr('data-name')+'</td><td>'+(Math.ceil(obj.getQuantities(1))+Math.ceil(parseFloat($(this).attr('data-initialqty'))))+'</td><td class="options-table-sku">'+obj.getAttributes( obj.postHeightMap[ newHeight ], JSON.parse($(this).attr('data-vars')), 'sku' )+'</td><td class="options-table-cost">&pound;'+ (obj.getAttributes( obj.postHeightMap[ newHeight ], JSON.parse($(this).attr('data-vars')), 'cost' )*(Math.ceil(obj.getQuantities(1))+parseFloat($(this).attr('data-initialqty')))).toFixed(2) +'</td></tr>';
                }
            });

            $.each(this.getAddons(), function(){
                for ( var i = 0; i < this.length; i++ ){
                    if ( this[i].addon_name && $.inArray(this[i].addon_name, obj.getExcludes()) == -1 ){

                        var $addon_quantity = (parseFloat(obj.getQuantities(this[i].addon_qty)))+ (parseFloat(this[i].addon_init_qty));

                        table += '<tr><td>'+this[i].addon_name+'</td><td>'+$addon_quantity+'</td><td class="options-table-sku">'+this[i].addon_sku+'</td><td class="options-table-cost">&pound;'+($addon_quantity*parseFloat(this[i].addon_cost)).toFixed(2)+'</td></tr>';
                    }
                }
            });
            table += '</tbody>'+
            '</table>';

            return table;
        },

        /**
        * Return the calculated totals
        *
        **/

        getTotals: function(){
            var total = 0;
            var obj = this;
            $.each($(obj.itemsTable()).find('.options-table-cost'), function(){
                total += parseFloat($(this).text().replace(/[^0-9\.]+/g,""));
            });
            return total;
        },

        /**
        * Check if the selected size is available for a given option
        *
        **/

        isSizeAvailable: function(size){
            var counter = 0;
            var selectedVars = $('.option-selected[data-vars]');
            $.each( selectedVars, function(){
                if ( JSON.parse( $(this).attr('data-vars') )[size] ) {
                    counter++;
                }
            })
            if ( selectedVars.length === counter ){
                return true;
            } else {
                return false;
            }
        },

        /**
        * Return height of the select panel
        *
        **/

        getPanelHeight: function(){
            return this.calc.find('#panels').find('.option-selected').attr('data-vars');
        },

        /**
        * Return height of the selected board
        *
        **/

        getBoardHeight: function(){
            var boardHeight = this.calc.find('#gravel-board-type').find('.option-selected').attr('data-attribute-height');
            if ( boardHeight ){
                return boardHeight;
            }
            else {
                return 0;
            }
        },

        /**
        * Return height of the selected post
        *
        **/

        getPostHeight: function(){
            return this.calc.find('#post-type').find('.option-selected').attr('data-vars');
        },

        /**
        * Render the list of heights for each panel
        *
        **/

        listHeights: function(){
            var obj = this;
            var heights = [];
            obj.hght.empty();

            $.each( JSON.parse( obj.getPanelHeight() ), function(){
               obj.hght.append( '<li data-height="'+this[0].height+'">'+(parseFloat(this[0].height.replace(/\-/g, '.'))+parseFloat(obj.getBoardHeight())).toFixed(1)+' METRES</li>' );
            } );
        }
    }

    var calc = new OptionCalc( $('#option-calc') );

  });
