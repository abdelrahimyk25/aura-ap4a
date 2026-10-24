#include "Server.hpp"
#include "Luxmeter.hpp"
#include "Scheduler.hpp"
#include <iostream>
#include <fstream>

int main(){

    //TEST:

    Server serv("Server", 8080);

    Luxmeter lux(1, &serv, 3);

    Scheduler ordonanceur;

    ordonanceur.addSensor(&lux);

    ordonanceur.simulation(2);

    /*
    std::string nom_cap = "luxmetre";

    lux.execute();
    float data = lux.getLuminosity(); 
    std::string data_cap = std::to_string(data);

    std::string date = "07/10/2026";
    std::string heure = "16:40:47";

    serv.fileWrite(nom_cap, data_cap, date, heure);

    serv.consoleWrite(nom_cap, data_cap, date, heure);
    */

    

    

    return 0;
}