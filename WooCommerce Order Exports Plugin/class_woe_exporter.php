<?php 
/**
* Exports orders with meta data from WooCommerce Orders
* Class: WOE_Exporter
*
*
**/

class WOE_Exporter {

    /**
    * For Testing Purposes only
    *
    **/
    
    public function woe_test_function(){
            
        $start = 'January 1st, 2015';
        $end = 'January 1st, 2017';
        
        $list = $this->woe_compile_data($start, $end);

        $fp = fopen('php://output', 'w');
        ob_start(); 
        
        foreach ($list as $fields) {
            fputcsv($fp, $fields);
        }
        
        $output = ob_get_clean();
        
        fclose($fp);         
        exit($output);
        
        return $output;

    }
    
    /**
    * Creates an array of all the data fields
    * @param Date $start, Date $end
    * @return Array CSV data
    *
    **/

    function woe_compile_data($start, $end){
        
        $args = array(
            'post_type' => 'shop_order',
            'posts_per_page' => -1,
            'post_status' => 'all'
        );
        
        // add date query if set
        if ( $start && $end ) :
        	$args['date_query'] = array( array( 'after' => $start, 'before' => $end ) );
        endif;
        
        // find the orders
        $orders = new WP_Query( $args );  
        
        // generate the CSV headers
        $headers = $this->woe_get_headers( $orders );
        // add the headers to the CSV array        
        $csv = array( $headers );

        //loop through the orders 
        if( $orders->have_posts()) :
            
            while ($orders->have_posts()) : $orders->the_post();
                
                $order = new WC_Order( get_the_ID() );
                $order_items = $order->get_items();
                
                foreach ( $order_items as $order_item ) :
                    
                    $line = $this->woe_get_line( $order, $order_item, $headers, 0 );
                    
                    // push each line to the CSV array

                    // if specific item exists in the item meta, add new line

                   // $custom_meta = $this->woe_get_custom_meta( $order_item );
                   // foreach ( $custom_meta as $custom_meta_item ) {
                    $new_line = 1;
                    while ( $new_line < 40 ) {
                        if($this->woe_break_line($order, $order_item, 'Entrant/Duet/ Trio/ Ensemble Band /Name(s)', $new_line ) === true ){
                            $line = $this->woe_get_line( $order, $order_item, $headers, $new_line );
                            array_push( $csv, $line);    
                        }
                        $new_line++;
                    }  
                    // }
                    
                  endforeach;
                
            endwhile;
            wp_reset_postdata();
        endif;
        
        return $csv;
    }

    /**
    * Checks if a line break is needed 
    * @param WC_Order $order, WC_Order_Item $order_item, String $search_meta, String $line_repeat
    * @return Boolean
    *
    **/

    protected function woe_break_line( $order, $order_item, $search_meta, $line_repeat ){
        
        $item_meta = $order_item->get_meta_data();
        
        foreach ( $item_meta as $meta ) :

            if ( $meta->key == $search_meta . ' - ' . $line_repeat ){
                return true;
            }
           
        endforeach;

        return false;
    }    

    /**
    * Return the custom meta for an order item
    * @param WC_Order_Item $order_item
    * @return Array
    *
    **/    

    protected function woe_get_custom_meta( $order_item ){

        $item_meta = $order_item->get_meta_data();
        $custom_meta = array();
        
        // loop through each item meta
        foreach ( $item_meta as $meta ) :

            // if item meta does not begun with '_', assume it is custom meta data
            if( "_" !== substr($meta->key ,0,1) ) :

                    array_push( $custom_meta, $meta->key );
                    
            endif;

        endforeach;

        return $custom_meta; 
    }    

    /**
    * Compile the fields for a line in the CSV
    * @param WC_Order $order, WC_Order_Item $order_item, Array $headers, String $line_repeat
    * @return Array
    *
    **/
    
    protected function woe_get_line( $order, $order_item, $headers, $line_repeat ){
        
        // the SKU and Product Category
        $product = $order_item->get_product();
        $sku = $product->get_sku();
        $product_category_ids = $product->get_category_ids();
        $payment_method = '';
        $payment_date = 'Not paid';
        $product_category = '';
        
        if ( $order->is_paid() ) {
            $payment_method = $order->get_payment_method_title();
            $payment_date = $order->get_date_paid();
        }
        if ( isset($product_category_ids[0]) ){
            $product_category .= get_term_by('id', $product_category_ids[0], 'product_cat')->name;
            foreach($product_category_ids as $cat_id) {
                $product_category .= get_term_by('id', $cat_id, 'product_cat')->name . '/ ';
            }
        } 
        else {
            $product_category = "No category";   
        }
        
        $line = array( $order->get_status(), $order->get_id(), $order->get_billing_email(), $order->get_billing_phone(), $order->get_total(), $order->get_billing_first_name(),$order->get_billing_last_name(),$order->get_billing_company(),$order->get_billing_city(),$order->get_billing_postcode(), $order_item['name'], $order->get_date_created(), $payment_date, $payment_method, $order_item->get_quantity(), $sku, $product_category, chr(163) . $order->get_line_total( $order_item ) );
        
        // count fields in the $line so we know where to start the custom fields
        $line_count = count($line);

        // loop through the items on the order
        foreach ( array_slice($headers, $line_count) as $heading ) :
                       
            $field = $this->woe_get_field($order, $order_item, $heading, $line_repeat); 
            array_push($line, $field);
                    
        endforeach;    
 
        return $line;
        
    }

    /**
    * Return the data for a field in a CSV line
    * @param WC_Order $order, WC_Order_Item $order_item, String $heading, String $line_repeat
    * @return String 
    *
    **/    

    protected function woe_get_field( $order, $order_item, $heading, $line_repeat ){
    
            $item_meta = $order_item->get_meta_data();
            
            // loop through each item meta
            foreach ( $item_meta as $meta ) :

                // if item meta does not begun with '_', assume it is custom meta data
                if( "_" != substr($meta->key ,0,1) ) :
                    
                    // if headings name matached the meta key, grab the value. Else, enter blank        
                    if( strtolower($heading) == strtolower($meta->key)) :
                        return $meta->value;
                    endif;

                    if ( $line_repeat && $heading . ' - ' . $line_repeat == $meta->key ) {
                        return $meta->value;
                    }

                endif;                     
                        
                endforeach;
        
        return ' ';
    }

    /**
    * Return the headers for the CSV
    * @param Array $orders
    * @return Array
    *
    **/    

    protected function woe_get_headers($orders){
        
      $headers = array("Order Status", "Order ID", "Customer Email", "Phone Number", "Order Amount", "Billing First Name", "Billing Last Name", "Billing Company", "Billing City", "Billing Postcode", "Product Name", "Order Date", "Payment Date", "Payment Method",  "Product Quantity", "SKU/ Class", "Category 1", "Cost");

      if( $orders->have_posts()) :
                
                while ($orders->have_posts()) : $orders->the_post();
                    
                    $order = new WC_Order( get_the_ID() );
                    $order_items = $order->get_items();

                    // loop through the items on the order
                    foreach ( $order_items as $item ) :
                        
                            $item_meta = $item->get_meta_data();
                            
                            // loop through each item meta
                            foreach ( $item_meta as $meta ) :
                                
                                // if item meta does not begun with '_', assume it is custom meta data
                                if( "_" != substr($meta->key ,0,1)  ) :
                                    
                                    if ( strpos($meta->key, ' - ') ) :
                                        $trimmed_key = substr($meta->key, 0, strpos($meta->key, ' - '));
                                    else :
                                        $trimmed_key = ucfirst($meta->key);
                                    endif;
                                      
                                    if ( !in_array( $trimmed_key, $headers ) ) :
                                        array_push( $headers, $trimmed_key  ); 
                                    endif;  
                                    
                                endif;
                                
                            endforeach;
       
                    endforeach;
                
                endwhile;
            wp_reset_postdata();
        endif;
        
        return $headers;
    }

    /**
    * Output the form for exporting the orders
    * @echo HTML
    *
    **/
    
    public function woe_form(){
        ?>
        <div class="woe-button">
            <form method="post" action="/woe-download">
                <input class="woe-date" type="text" name="start_date" />
                <input class="woe-date" type="text" name="end_date" />
 			    <input type="hidden" id="woe_export_nonce" name="nonce" value="<?php echo wp_create_nonce('woe_export_nonce') ?>" />                 
                <button type="submit" name="woe_do_export" value="export">Export Orders</button>
            </form>

        </div>
        <?php        
    }

}

/**
* Stream the file to the browser after clicking download
*
**/

add_action('template_redirect','wo_get_download_url');

function wo_get_download_url() {
  if ($_SERVER['REQUEST_URI']=='/woe-download') :
    if ( !empty( $_POST['woe_do_export'] ) && wp_verify_nonce( $_POST['nonce'], 'woe_export_nonce')  ) :
        
        $start = $_POST['start_date'];
        $end = $_POST['end_date'];
    
        $exporter = new WOE_Exporter();
        $list = $exporter->woe_compile_data($start, $end);

        $fp = fopen('php://output', 'w');
        ob_start(); 
        
        foreach ($list as $fields) {
            fputcsv($fp, $fields);
        }
        
        $output = ob_get_clean();
        
        header("Content-type: application/x-msdownload",true,200);
        header("Content-Disposition: attachment; filename=data.csv");
        header("Pragma: no-cache");
        header("Expires: 0");
        
        fclose($fp);         
        exit($output);
        
    endif;
  endif;
}

/**
 * Add Custom Order Statuses
 * 
 * 
 */

function register_cheque_order_status() {
    register_post_status( 'wc-cheque-recieved', array(
        'label'                     => 'Cheque Recieved',
        'public'                    => true,
        'show_in_admin_status_list' => true,
        'show_in_admin_all_list'    => true,
        'exclude_from_search'       => false,
        'label_count'               => _n_noop( 'Cheque Recieved <span class="count">(%s)</span>', 'Cheque Recieved <span class="count">(%s)</span>' )
    ) );    
    
    register_post_status( 'wc-cheque-banked', array(
        'label'                     => 'Cheque Banked',
        'public'                    => true,
        'show_in_admin_status_list' => true,
        'show_in_admin_all_list'    => true,
        'exclude_from_search'       => false,
        'label_count'               => _n_noop( 'Cheque Banked <span class="count">(%s)</span>', 'Cheque Banked <span class="count">(%s)</span>' )
    ) );
}
add_action( 'init', 'register_cheque_order_status' );
 
function add_cheque_to_order_statuses( $order_statuses ) {
 
    $new_order_statuses = array();
 
    foreach ( $order_statuses as $key => $status ) {
 
        $new_order_statuses[ $key ] = $status;
 
        if ( 'wc-processing' === $key ) {
            $new_order_statuses['wc-cheque-recieved'] = 'Cheque Recieved';
            $new_order_statuses['wc-cheque-banked'] = 'Cheque Banked';
        }
    }
 
    return $new_order_statuses;
}
add_filter( 'wc_order_statuses', 'add_cheque_to_order_statuses' );