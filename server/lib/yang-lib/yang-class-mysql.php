<?php
/**
 * @package MySQL connector
 */

class yangMysql{
	private $db_host;
	private $db_usr;
	private $db_password;
	private $db_database;
	private $db_port;
	private $db_table;

	private $charset; //

	private $connection; //mySQL connection
	private $query; //mySQL query

	// private $row;
	// private $result = array();
	public $row;
	public $result = array();

	private $logEnable = true;

	// private $errorInfo = array("errno" => "", "error" => "");
	public $errorInfo = array("errno" => "", "error" => "");

	/**
	 * yangMysql constructor
	 */
	public function __construct(){
		$this->db_host = DB_HOST;
		// $this->db_host = (string)xmlFileRead($url)->mysqlConfig->host;
		$this->db_usr = DB_USER;
		$this->db_password = DB_PASSWORD;
		$this->db_database = DB_DATABASE; //default database
		$this->db_port = DB_PORT;
		$this->db_table = DB_TABLE; //default table
		$this->connect(); //connect to mysql
	}
	/**
	 * yangMysql destructor
	 */
	public function __destruct(){
		$this->connection->close();
	}

	/**
	 * connect to MySQL
	 */
	public function connect(){
		@ $this->connection = new mysqli($this->db_host, $this->db_usr, $this->db_password, $this->db_database, $this->db_port);
		if($this->connection->connect_error){
			$this->errorHandle();
			$this->connection = null; //if error occur, set connection null
			return false;
		}
		if($this->db_table)
			$this->selectTable($this->db_table);
	}

	/**
	 * MySQL query
	 */
	public function query($query){
		$this->query = $query;
		// echo "@@ query is "; echo json_encode($this->query); echo "\n";
		$result = $this->connection->query($this->query);
		if(!$result){ //Returns FALSE on failure.
			$this->errorHandle();
			return false;
		}
		if(!is_bool($result)){ //For successful SELECT, SHOW, DESCRIBE or EXPLAIN queries mysqli_query() will return a mysqli_result object.
			$this->row = $result->num_rows;
			$this->result = $result->fetch_all(MYSQLI_ASSOC); //PHP 5 >= 5.3.0, PHP 7, MYSQL_ASSOC means return an association array
			// echo "## affect $this->row rows \n$$ result is "; echo json_encode($this->result); echo "\n";
			return $this->result;
		}
		else //For other successful queries mysqli_query() will return TRUE.
			return true;
	}

	/**
	 * deal with errors
	 */
	public function errorHandle(){
		$this->errorInfo["errno"] = $this->connection->connect_errno;
		$this->errorInfo["error"] = $this->connection->connect_error;
		$this->log(); //log the error
	}
	/**
	 * log
	 */
	public function log(){
		$logging = "\n\t##errno ".$this->errorInfo["errno"]."\n\t##error ".$this->errorInfo["error"];
		$this->_logFileIO($logging, 'yang-mysql-error');
	}
	/**
	 *
	 */
	private function _logFileIO($logging='', $filename='commonlog'){
		$folder = dirname(__FILE__)."/mysql-log/";
		$logFileName = $filename.'-';

		// set the default timezone to use. Available since PHP 5.1
		date_default_timezone_set('Asia/Shanghai');
		$currentDate = date("Y-m-d");
		$currentTime = date("Y-m-d H:i:s");

		$logFile = fopen($folder.$logFileName.$currentDate.".log", "a+");
		fwrite($logFile, $currentTime." ".$logging."\n");
		fclose($logFile);
	}

	/**
	 * get MySQL charset
	 */
	public function getCharset(){
		$queryCharset = "SHOW VARIABLES LIKE 'character_set_connection'";
		$this->charset = $this->query($queryCharset)[0]["Value"];
		return $this->charset;
	}

	/**
	 * select database
	 */
	public function selectDb($database){
		$this->connection->select_db($database);
		if($this->connection->connect_error){
			$this->errorHandle();
			return flase;
		}
		$this->db_database = $database;
		// echo json_encode($this->db_database);
		return $this->db_database;
	}

	/**
	 * show all tables from the database
	 */
	public function showTables(){
		$query = "show tables";
		return $this->query($query); //[{}]
	}
	/**
	 * select a table
	 */
	public function selectTable($table){
		//remind: here must have some methods to check the table
		$this->db_table = $table;
	}

	/**
	 * clear all date from $table
	 */
	public function truncateTable($table){
		//remind: here must have some methods to check the table
		$query = "TRUNCATE $table";
		return $this->query($query);
	}

	/**
	 * decorate value
	 */
	private function _decorate(&$array){
		while(list($name, $value) = each($array)){
			if($value==null)
				$array[$name] = "null";
			else
				$array[$name] = "'$value'";
		}
		reset($array); //reset index of the $array
	}

	/**
	 * basic method
	 * select from a single table
	 * $select_col is an array [name]
	 * $condition is a string
	 * $order is an array [col_name, ASC | DESC]
	 * $limite is an array [offset, row_count]
	 */
	public function simpleSelect($select_col, $condition, $order, $limit){
		if($select_col){
			$this->_decorate($select_col);
			$select_expr = implode(",", $select_col);
		}
		else
			$select_expr = "*"; //all columns
		$where_condition = $condition ? "WHERE $condition" : "";
		$orderby = $order ? "ORDER BY $order[0] $order[1]" : "";
		$limitby = $limit ? "LIMIT $limit[0] $limit[1]" : "";
		$query = "SELECT $select_expr FROM $this->db_table $where_condition $orderby $limitby";
		return $this->query($query);
	}

	/**
	 * basic method
	 * insert one record
	 * $record is an associate array [name => value]
	 */
	public function insert($record){
		if(!is_array($record)) return false;
		$this->_decorate($record); //decorate the value. add "".
		$name = implode(",", array_keys($record)); //implode() join()  Join array elements with a string
		$value = implode(",", $record); //
		$query = "INSERT INTO $this->db_table($name) VALUES($value)";
		return $this->query($query);
	}

	/**
	 * basic method
	 * update a specify row
	 * $record is an associate array [name => value]
	 * $condition is a string
	 * $order is an array [col_name, ASC | DESC]
	 * $limite is a string or num
	 */
	public function update($record, $condition, $order, $rowcount){
		if(!is_array($record)) return false;
		$updateExp = "";
		$this->_decorate($record); //decorate the value. add "".
		while(list($name, $value)=each($record)){
			$updateExp = ($updateExp!="") ? $updateExp.",".$name."=".$value : $updateExp.$name."=".$value;
		}
		$where_condition = $condition ? "WHERE $condition" : "";
		$orderby = $order ? "ORDER BY $order[0] $order[1]" : "";
		$limit = $rowcount ? "LIMIT $rowcount" : "";
		$query = "UPDATE $this->db_table SET $updateExp $where_condition $orderby $limit";
		return $this->query($query);
	}

	/**
	 * basic method
	 */
	public function delete($condition){
		$where_condition = $condition ? "WHERE $condition" : "";
		$query = "DELETE FROM $this->db_table $where_condition";
		return $this->query($query);
	}
}


/**
 * test
 */
 /*
$yangsql = new yangMysql(); //instantiation

$yangsql->getCharset(); //test queryCharset()
$yangsql->selectDb(DB_DATABASE); //
$yangsql->showTables(); //
$yangsql->selectTable("car");
$yangsql->insert(["id"=>1]); //
$yangsql->simpleSelect(null,"id=1",null,null);
$yangsql->simpleSelect(null,"id=1",null,null);
$yangsql->delete("id=1");
// $yangsql->truncateTable("car"); //
*/
