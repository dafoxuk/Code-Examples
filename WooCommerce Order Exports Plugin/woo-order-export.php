<?php
/*
Plugin Name: Woo Order Export
Plugin URI: http://www.aylshamwebsites.co.uk
Description: Exports order data for norfolkmusic.org.uk
Author: David Fox
Version: 1.01
Author URI: http://www.aylshamwebsites.co.uk
License: GPLv2 or later
*/

defined('ABSPATH') or die('This script cannot be accessed directly!');

define( 'WOE_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

require('class_woe_exporter.php');

/**
* Add the admin page
*
**/

function woe_add_page(){
    add_menu_page( 'Orders Export', 'Orders Export', 'read_private_pages', 'woe-export-csv', 'woe_init');
}

add_action('admin_menu', 'woe_add_page');

/**
* The Content of the admin page + instanitate the WOE_Exporter
*
**/

function woe_init(){
    ?>
    <h2>Export WooCommerce orders</h2>
    <p>Click the button below to generate and download a CSV file of your WooCommerce orders.</p>
    <?php
    
    $woe_export = new WOE_Exporter();
    $woe_export->woe_form();
    
    ?>

    <!-- <h2>Test Function</h2> -->
    <pre>
        
        <?php // echo $woe_export->woe_test_function() ; ?>
        
    </pre>
    <?php
    
}

/**
* Enqueue the date picker
*
**/

add_action('admin_enqueue_scripts', 'woe_enqueue_date_picker');

function woe_enqueue_date_picker()
{
    wp_enqueue_script(
            'woe-date-js', plugins_url() . '/woo-order-export/woe.js', array('jquery', 'jquery-ui-core', 'jquery-ui-datepicker'), time(), true
    );
    wp_register_style('jquery-ui', 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css');
    wp_enqueue_style('jquery-ui');
}

/**
 * Send debug code to the Javascript console
 */ 

function debug_to_console($data) {
    if(is_array($data) || is_object($data))
	{
		return("<script>console.log('PHP: ".json_encode($data)."');</script>");
	} else {
		return("<script>console.log('PHP: ".$data."');</script>");
	}
}