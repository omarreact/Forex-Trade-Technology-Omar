<?php
/** Never put API keys in frontend configuration, template HTML or theme JSON. */
declare(strict_types=1);
defined('ABSPATH') || exit;
function ftt_contact_setting(string $name):string {
    return defined($name)?trim((string)constant($name)):trim((string)(getenv($name)?:''));
}
function ftt_contact_value(WP_REST_Request $r,string $name,int $max=160):string {
    $value=$r->get_param($name);
    if(!is_scalar($value))return '';
    $text=trim(sanitize_text_field((string)$value));
    return function_exists('mb_substr')?mb_substr($text,0,$max):substr($text,0,$max);
}
function ftt_contact_endpoint(WP_REST_Request $request): WP_REST_Response {
    $reply=static fn(int $status,string $message)=>new WP_REST_Response(['message'=>$message],$status,['Cache-Control'=>'no-store']);
    $origin=$request->get_header('Origin');
    if($origin){$a=wp_parse_url(home_url('/'));$b=wp_parse_url($origin);
      if(!is_array($a)||!is_array($b)||strcasecmp($a['host']??'',$b['host']??'')!==0)return $reply(403,'Invalid form origin.');
    }
    $nonce=$request->get_param('nonce');
    if($nonce && !wp_verify_nonce(sanitize_text_field((string)$nonce),'wp_rest'))return $reply(403,'Form session expired. Reload and try again.');
    if(ftt_contact_value($request,'website'))return $reply(200,'Thank you for your enquiry.');
    $name=ftt_contact_value($request,'name',100);$email=sanitize_email(ftt_contact_value($request,'email'));$message=ftt_contact_value($request,'message',4000);
    if(strlen($name)<2||!is_email($email)||strlen($message)<10)return $reply(400,'Enter your name, a valid email and at least ten characters.');
    $ip=(string)($_SERVER['REMOTE_ADDR']??'unknown');$rate='ftt_contact_'.hash_hmac('sha256',$ip,wp_salt('auth'));
    $n=(int)get_transient($rate);if($n>=5)return $reply(429,'Too many messages. Please try later.');
    set_transient($rate,$n+1,HOUR_IN_SECONDS);
    $details=['Name: '.$name,'Email: '.$email];
    foreach(['company','country','contact','interest','stage'] as $key)$details[]=ucfirst($key).': '.ftt_contact_value($request,$key,160);
    $details[]='';$details[]=$message;$content=implode("\n",$details);
    $to=ftt_contact_setting('FTT_CONTACT_TO_EMAIL');$from=ftt_contact_setting('FTT_CONTACT_FROM_EMAIL');
    if(!is_email($to))return $reply(503,'Contact delivery is not configured. Please try again later.');
    $mode=ftt_contact_setting('FTT_CONTACT_MAIL_TRANSPORT')?:'wp_mail';
    if($mode==='resend'){
        $key=ftt_contact_setting('FTT_RESEND_API_KEY');
        if(!$key||!$from)return $reply(503,'Contact delivery is not configured.');
        $r=wp_remote_post('https://api.resend.com/emails',[ 'timeout'=>14,'redirection'=>0,
            'headers'=>['Authorization'=>'Bearer '.$key,'Content-Type'=>'application/json'],
            'body'=>wp_json_encode(['from'=>$from,'to'=>[$to],'reply_to'=>$email,'subject'=>'Forex Trade Technology consultation','text'=>$content]) ]);
        if(is_wp_error($r))return $reply(502,'Email delivery is currently unavailable.');
        $ok=(int)wp_remote_retrieve_response_code($r);
        return $ok>=200&&$ok<300?$reply(200,'Your enquiry was accepted. Thank you.'):$reply(502,'Email delivery failed. Please try again.');
    }
    if($mode!=='wp_mail')return $reply(503,'Contact delivery mode is unsupported.');
    $headers=['Reply-To: '.$email];
    if(is_email($from))$headers[]='From: '.$from;
    $ok=wp_mail($to,'Forex Trade Technology consultation',$content,$headers);
    return $ok?$reply(200,'Your enquiry has been submitted.'):$reply(502,'Email delivery failed. Please try again later.');
}
add_action('rest_api_init',static function ():void {
    register_rest_route('ftt/v1','/contact',['methods'=>'POST','callback'=>'ftt_contact_endpoint','permission_callback'=>'__return_true']);
});
