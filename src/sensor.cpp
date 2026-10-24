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
Sensor::Sensor(const int id, std::string type, Server* server, int period, int counter)
    : _id(id), _type(type), _server(server), _period(period), _counter(counter)
{
}

// Constructeur de copie
Sensor::Sensor(const Sensor& other)
    : _id(other._id), _type(other._type), _server(other._server), _period(other._period), _counter(other._counter)
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
        _period = other._period;
        _counter = other._counter;
    }

    return *this;
}

void Sensor::update()
{
    _counter++;
    if (_counter >= _period)
    {
        execute();   // Appelle la méthode virtuelle de la classe fille
        _counter = 0; // Réinitialise le compteur
    }
}

// Destructeur
Sensor::~Sensor()
{
}