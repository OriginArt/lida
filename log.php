<?PHP 
class Log{
          //Log::write('message', 'file');

                static function write($mess="", $name="main"){

                        if(strlen(trim($mess)) < 2){

                                return fasle;

                        }

                        if(preg_match("/^([a-z0-9A-Z]+)$/i", $name, $matches)){

                                $file_path = $_SERVER['DOCUMENT_ROOT'].'/lida/logs/'.$name.'.txt';

                                $text = date("d.m.Y (H:i:s)")." - ".htmlspecialchars($mess)."\r\n";

                                $handle = fopen($file_path, "a+");

                                @flock ($handle, LOCK_EX);

                                fwrite ($handle, $text);

                                fwrite ($handle, "==============================================================\r\n\r\n");

                                @flock ($handle, LOCK_UN);

                                fclose($handle);

                                return true;

                        }

                        else{

                                return false;

                        }

                }

        }

?>