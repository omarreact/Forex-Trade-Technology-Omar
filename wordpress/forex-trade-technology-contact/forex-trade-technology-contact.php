<?php
/**
 * Plugin Name: Forex Trade Technology — Contact
 * Description: Secure, server-side Resend delivery for the separate Forex Trade Technology WordPress block theme. No credentials in browser/theme content.
 * Version: 0.1.0
 * Requires at least: 6.5
 * Requires PHP: 8.1
 * Author: PINCODE IT
 * Text Domain: forex-trade-technology-contact
 */
declare(strict_types=1);
defined('ABSPATH') || exit;

/** Configure in wp-config.php: FTT_RESEND_API_KEY, FTT_CONTACT_FROM_EMAIL, FTT_CONTACT_TO_EMAIL. */
function ftt_contact_secret(string $key):string{
    if(defined($key))return trim((string)constant($key));
    $env=getenv($key);
    return $env===false?'':trim((string)$env);
}
function ftt_contact_value(WP_REST_Request $request,string $key,int $max):string{
    $value=$request->get_param($key);
    return is_scalar($value)?substr(trim(sanitize_text_field((string)$value)),0,$max):'';
}
function ftt_contact_send(WP_REST_Request $request):WP_REST_Response{
    // A public form cannot depend on a logged-in WP nonce. Apply anti-spam controls instead.
    $origin=$request->get_header('origin');
    if($origin){
        $allowed=wp_parse_url(home_url('/'));
        $provided=wp_parse_url($origin);
        if(!$allowed||!$provided||strcasecmp($allowed['host']??'',$provided['host']??'')!==0)
            return new WP_REST_Response(['message'=>'Invalid form origin.'],403);
    }
    if(ftt_contact_value($request,'website',100))
        return new WP_REST_Response(['ok'=>true,'message'=>'Thank you.'],200);
    $name=ftt_contact_value($request,'name',100);
    $email=ftt_contact_value($request,'email',150);
    $message=ftt_contact_value($request,'message',4000);
    if(strlen($name)<2||!is_email($email)||strlen($message)<10)
        return new WP_REST_Response(['message'=>'Enter your name, a valid email and a project description of at least 10 characters.'],400);
    // Rate limit applies to valid submissions only, keyed to a one-way hash of client IP.
    $ip=(string)($_SERVER['REMOTE_ADDR']??'unknown');
    $rateKey='ftt_contact_'.hash_hmac('sha256',$ip,wp_salt('auth'));
    $count=(int)get_transient($rateKey);
    if($count>=5)return new WP_REST_Response(['message'=>'Too many requests. Please try again later.'],429);
    set_transient($rateKey,$count+1,HOUR_IN_SECONDS);
    $key=ftt_contact_secret('FTT_RESEND_API_KEY');
    $from=ftt_contact_secret('FTT_CONTACT_FROM_EMAIL');
    $to=ftt_contact_secret('FTT_CONTACT_TO_EMAIL');
    if(!$key||!$from||!$to)
        return new WP_REST_Response(['message'=>'Email delivery is not yet configured. No message was sent; please try again later.'],503);
    $isFeedback=ftt_contact_value($request,'kind',40)==='website-feedback';
    $keys=$isFeedback?['pageUrl','section','category']:['company','country','contact','interest','stage'];
    $details=[];foreach($keys as $field)$details[]=$field.': '.ftt_contact_value($request,$field,$field==='pageUrl'?500:150);
    $payload=[
        'from'=>$from,'to'=>[$to],'reply_to'=>$email,
        'subject'=>$isFeedback?'Website change request — Forex Trade Technology':'New Forex Trade Technology enquiry',
        'text'=>implode("\n",array_merge([$isFeedback?'New website change request':'New enquiry','Name: '.$name,'Email: '.$email],$details,['',$message]))
    ];
    $response=wp_remote_post('https://api.resend.com/emails',[
        'timeout'=>12,
        'redirection'=>0,
        'headers'=>['Authorization'=>'Bearer '.$key,'Content-Type'=>'application/json'],
        'body'=>wp_json_encode($payload)
    ]);
    if(is_wp_error($response)){
        error_log('FTT contact mail provider transport unavailable');
        return new WP_REST_Response(['message'=>'Email delivery failed. Please try again later.'],502);
    }
    $status=(int)wp_remote_retrieve_response_code($response);
    if($status<200||$status>=300){
        error_log('FTT contact mail provider status '.$status);
        return new WP_REST_Response(['message'=>'Email delivery failed. Please try again later.'],502);
    }
    return new WP_REST_Response(['ok'=>true,'message'=>$isFeedback?'Your website feedback was accepted by the email provider.':'Your enquiry was accepted by the email provider.'],200);
}
add_action('rest_api_init',function():void{
    register_rest_route('ftt/v1','/contact',[
        'methods'=>'POST',
        'callback'=>'ftt_contact_send',
        'permission_callback'=>'__return_true',
    ]);
});
