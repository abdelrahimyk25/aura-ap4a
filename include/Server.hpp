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

    // Constructeur avec parametres
    Server(const std::string& name, int port);

    // Constructeur de copie
    Server(const Server& other);

    // Opérateur d'affectation
    Server& operator=(const Server& other);

    // Destructeur
    ~Server();

    //visualiser les donnees recues des capteurs dans la console.
    void consoleWrite(std::string nom_capteur, std::string donnee, std::string date, std::string heure);

    //stocker les donnees des capteurs dans des fichiers de logs
    void fileWrite(std::string nom_capteur, std::string donnee,std::string date, std::string heure);

    // Surcharge opérateur de sortie (injection dans un flux)
    friend std::ostream& operator<<(std::ostream& os, const Server& server);
};

#endif