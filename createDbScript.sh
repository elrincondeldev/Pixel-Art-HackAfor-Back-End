#!bin/bash

echo "DROP TABLE IF EXISTS GRID;" > dbScript.sql
echo "CREATE TABLE GRID(i INT NOT NULL,c TINYINT NOT NULL,PRIMARY KEY (i));" >> dbScript.sql
for i in {0..16383}
do
	echo "INSERT into GRID VALUES($i, 0);" >> dbScript.sql
done
