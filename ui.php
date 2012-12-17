<?php
require_once('log.php');
header('Content-type: text/html; charset="windows-1251"',true);
setlocale(LC_ALL, 'ru_RU');

$url = 'http://www.cbr.ru/scripts/XML_dynamic.asp?date_req1='.$_POST['strd'].'&date_req2='.$_POST['endd'].'&VAL_NM_RQ='.$_POST['money'];
$log = new Log();
$log->write($url,"main");
$data = file_get_contents($url);

file_put_contents('tst.txt',print_r($_SERVER['DOCUMENT_ROOT'].'/lida/logs/'.$name.'.txt',true));

echo $data; 
?>
