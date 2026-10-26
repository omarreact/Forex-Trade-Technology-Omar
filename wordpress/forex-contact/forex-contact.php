<?php
/**
 * Plugin Name: Forex Trade Technology Contact
 * Description: Private contact form delivery via Resend for Forex Trade Technology WordPress block theme.
 * Version: 0.1.0
 * Requires PHP: 8.1
 * Text Domain: ftt-contact
 */
defined('ABSPATH') || exit;
add_action('rest_api_init',function(){
 register_rest_route('ftt-contact/v1','/send',array(
  'methods'=>'POST',
  'permission_callback'=>'__return_true',
  'callback'=>'ftt_contact_handle_request',
 ));
});
function ftt_contact_handle_request(WP_REST_Request $request){
 $headers=array('Cache-Control'=>'no-store');
 $json=function($status,$message)use($headers){return new WP_REST_Response(array('message'=>$message),$status,$headers);};
 $ip=isset($_SERVER['REMOTE_ADDR'])?sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])):'';
 $key='ftt_rate_'.hash('sha256',wp_salt('auth').'|'.$ip);
 $hits=(int)get_transient($key);
 if($hits>=5)return $json(429,'Too many messages. Try again later.');
 set_transient($key,$hits+1,3600);
 $params=$request->get_params();
 $field=function($name,$length=250)use($params){
  $value=$params[$name]??'';
  return is_scalar($value)?mb_substr(trim(sanitize_text_field((string)$value)),0,$length):'';
 };
 if($field('website'))return $json(200,'Thank you.');
 $name=$field('name',100);
 $email=sanitize_email($field('email',150));
 $message=$field('message',4000);
 if(mb_strlen($name)<2||!is_email($email)||mb_strlen($message)<10)return $json(400,'Enter your name, a valid email and at least ten message characters.');
 $sender=defined('FTT_CONTACT_FROM')?FTT_CONTACT_FROM:'';
 $recipient=defined('FTT_CONTACT_TO')?FTT_CONTACT_TO:'';
 $secret=defined('FTT_RESEND_API_KEY')?FTT_RESEND_API_KEY:'';
 if(!$sender||!is_email($recipient)||!$secret)return $json(503,'Email service is not configured. Nothing was sent.');
 $lines=array('Name: '.$name,'Email: '.$email);
 foreach(array('company','country','contact','interest','stage') as $keyName)$lines[]=ucfirst($keyName).': '.$field($keyName);
 $lines[]='';$lines[]=$message;
 $response=wp_remote_post('https://api.resend.com/emails',array('timeout'=>12,'headers'=>array('Authorization'=>'Bearer '.$secret,'Content-Type'=>'application/json'),'body'=>wp_json_encode(array(
   'from'=>$sender,'to'=>array($recipient),'reply_to'=>$email,'subject'=>'New Forex Trade Technology consultation','text'=>implode("\n",$lines)
 ))));
 if(is_wp_error($response)){error_log('FTT contact delivery network failed');return $json(502,'Email delivery failed. Please try again later.');}
 $code=(int)wp_remote_retrieve_response_code($response);
 if($code<200||$code>=300){error_log('FTT contact mail provider HTTP '.$code);return $json(502,'Email delivery failed. Please try again later.');}
 return $json(200,'Your enquiry was accepted by the email provider.');
}
add_action('wp_enqueue_scripts',function(){
 if(!is_page()&&!is_front_page())return;
 $theme=get_stylesheet_directory_uri();
 $file=get_stylesheet_directory().'/assets/js/contact.js';
 if(file_exists($file))wp_enqueue_script('ftt-contact-form-client',$theme.'/assets/js/contact.js',array(),filemtime($file),true);
});
