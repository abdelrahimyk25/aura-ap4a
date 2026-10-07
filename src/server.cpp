
#include "Server.hpp"
#include <iostream>
#include <fstream>

// Constructeur par défaut
Server::Server()
    : _name(""), _port(0)
{
}

// Constructeur avec paramètres
Server::Server(const std::string& name, int port)
    : _name(name), _port(port)
{
}

// Constructeur de copie
Server::Server(const Server& other)
    : _name(other._name), _port(other._port)
{
}

// Opérateur d'affectation
Server& Server::operator=(const Server& other)
{
    if (this != &other)
    {
        _name = other._name;
        _port = other._port;
    }

    return *this;
}

// Destructeur
Server::~Server()
{
}

// Afficher les données des capteurs dans la console
void Server::consoleWrite(std::string nom_capteur, std::string donnee, std::string date, std::string heure)
{
    std::cout << date << " : "<< heure << " : "<< nom_capteur << " : "<< donnee << std::endl;
}

// Stocker les données des capteurs dans des fichiers de logs
void Server::fileWrite(std::string nom_capteur, std::string donnee, std::string date, std::string heure)
{
    //Construction du nom du fichier
    std::string nom_fichier = "../data/log_" + nom_capteur + ".txt";

    //Ouverture ou création du fichier si il n'existe pas
    std::ofstream fichier(nom_fichier, std::ios::app);

    //Ecriture dans le fichier
    fichier << date << " : "
            << heure << " : "
            << nom_capteur << " : "
            << donnee << std::endl;
}

std::ostream& operator<<(std::ostream& os, const Server& server)
{
    // On écrit dans 'os' (qui peut être std::cout ou un std::ofstream)
    os << "Serveur : " << server._name << " | Port : " << server._port;
    
    // On retourne le flux pour permettre le chaînage (ex: std::cout << serv << std::endl;)
    return os;
}








