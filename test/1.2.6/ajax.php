<?php
$act=isset($_GET['act'])?$_GET['act']:'';
if($act=="test"){
  $d=["a"=>1,"b"=>2];
  echo json_encode($d);
}
if($act=="test2"){
  abc();
  echo json_encode($d);
}