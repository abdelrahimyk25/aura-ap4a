#ifndef SENSOR_HPP
#define SENSOR_HPP
#include "Server.hpp"

#include <string>

class Sensor
{
private:
    int _id;
    std::string _type;
    double _donnee;
    Server* _server;

public:
    // Constructeur par défaut
    Sensor();

    // Constructeur avec parametres
    Sensor(const int _id, std::string _type, Server* _server);

    // Constructeur de copie
    Sensor(const Sensor& other);

    // Opérateur d'affectation
    Sensor& operator=(const Sensor& other);

    // Destructeur
    ~Sensor();

    // Surcharge opérateur de sortie (injection dans un flux)
    friend std::ostream& operator<<(std::ostream& os, const Sensor& sensor);

    //Genere une nouvelle donnee aleatoire pour le capteur
    void execute();

    //actualise la valeur du capteur lorsque son temps interne est écoulé
    void update();
};

#endif