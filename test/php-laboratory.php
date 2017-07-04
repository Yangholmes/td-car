<?php

date_default_timezone_set('Asia/Shanghai');

echo date('Y-m-d H:i:s');

echo "\n";

echo date('Y-m-d 00:00:00', time()+2*24*60*60);

echo "\n";

echo date('H-i-s 00:00:00');