#ifndef SERVER_HPP
#define SERVER_HPP

#include <string>

class Server
{
private:
    std::string _name;
    int _port;

public:
    // Constructeur par défaut
    Server();

    // Constructeur de copie
    Server(const Server& other);

    // Opérateur d'affectation
    Server& operator=(const Server& other);

    // Destructeur
    ~Server();

    //visualiser les donnees recues des capteurs dans la console.
    void consoleWrite(std::string nom_capteur, std::string donnee);

    //stocker les donnees des capteurs dans des fichiers de logs
    void fileWrite(std::string nom_capteur, std::string donnee,std::string date, std::string heure);
};

#endif