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
};

#endif