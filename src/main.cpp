#include "Server.hpp"
#include <iostream>
#include <fstream>

int main(){

    //TEST:

    Server serv("Server", 8080);

    std::string nom_cap = "luxmetre";
    std::string data_cap = "100 lx";
    std::string date = "07/10/2026";
    std::string heure = "16:40:47";

    serv.fileWrite(nom_cap, data_cap, date, heure);

    serv.consoleWrite(nom_cap, data_cap, date, heure);

    std::cout << serv << std::endl;

    return 0;
}