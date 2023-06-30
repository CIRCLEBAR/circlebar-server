#!/bin/bash

# Start the circlebar COMPOSE

# check if mariadb_docker dir is empty

if [ -z "$(ls -A ./mariadb_docker)" ]; then
    echo "Mariadb_docker is Empty"
    docker-compose up -d
    sleep 10s
    echo "inputing database"
    docker exec -i circlebar_mariadb mariadb -u root -pyourpassword -e "CREATE DATABASE circlebar;"
    docker exec -i circlebar_mariadb mariadb -u root -pyourpassword circlebar < ../db.sql
    #check return code
    if [ $? -eq 0 ]; then
        echo "Database created successfully"
    else
        echo "Error in creating database"
    fi
else
    echo "mariadb_docker is not Empty"
    docker compose up -d
fi