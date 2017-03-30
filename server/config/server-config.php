<?php

// dd host config
define("OAPI_HOST", "https://oapi.dingtalk.com");

// this app server host
define("SERVER_HOST", "http://192.168.4.211/dingding/td-car");
// define("SERVER_HOST", "http://www.gdrtc.org");

// image path
define("IMAGE_ROOT", SERVER_HOST."/img");
// define("IMAGE_ROOT", SERVER_HOST."/car/img");

// mysql config
// ** MySQL settings - You can get this info from your web host ** //

// local
/** MySQL hostname */
define('DB_HOST', 'localhost');
/** MySQL database username */
define('DB_USER', 'root');
/** MySQL port */
define('DB_PORT', '3306');
/** MySQL database password */
define('DB_PASSWORD', 'random2to666');
/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');
/** The name of the database  */
define('DB_DATABASE', 'td_car');
/** The name of the table  */
define('DB_TABLE', 'car');
/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

//remote
// /** MySQL hostname */
// define('DB_HOST', 'sdm218631467.my3w.com');
// /** MySQL database username */
// define('DB_USER', 'sdm218631467');
// /** MySQL port */
// define('DB_PORT', '3306');
// /** MySQL database password */
// define('DB_PASSWORD', 'Gdrtc750');
// /** Database Charset to use in creating database tables. */
// define('DB_CHARSET', 'utf8');
// /** The name of the database  */
// define('DB_DATABASE', 'sdm218631467_db');
// /** The name of the table  */
// define('DB_TABLE', 'car');
// /** The Database Collate type. Don't change this if in doubt. */
// define('DB_COLLATE', '');
