#include "Server.hpp"
#include "Sensor.hpp"
#include <iostream>
#include <fstream>

/*
// Constructeur par défaut
Sensor::Sensor()
    : _type("INDEFINI")
{
}
*/


// Constructeur avec paramètres
Sensor::Sensor(const int id, std::string type, Server* server)
    : _id(id), _type(type), _server(server)
{
}

// Constructeur de copie
Sensor::Sensor(const Sensor& other)
    : _id(other._id), _type(other._type), _server(other._server)
{
}

// Opérateur d'affectation
Sensor& Sensor::operator=(const Sensor& other)
{
    if (this != &other)
    {
        _id = other._id;
        _type = other._type;
        _server = other._server;
    }

    return *this;
}

// Destructeur
Sensor::~Sensor()
{
}