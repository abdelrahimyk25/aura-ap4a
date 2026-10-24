#ifndef SENSOR_HPP
#define SENSOR_HPP
#include "Server.hpp"

#include <string>

class Sensor
{
protected:
    int _id;
    std::string _type;
    double _donnee;
    Server* _server;

    int _period;  // Intervalle nécessaire entre 2 mesures (ex: 3)
    int _counter; // Compteur de pas de temps

public:
    // Constructeur par défaut
    Sensor();

    // Constructeur avec parametres
    Sensor(const int _id, std::string _type, Server* _server, int _period, int _counter);

    // Constructeur de copie
    Sensor(const Sensor& other);

    // Opérateur d'affectation
    Sensor& operator=(const Sensor& other);

    // Destructeur
    virtual ~Sensor();

    // Surcharge opérateur de sortie (injection dans un flux)
    friend std::ostream& operator<<(std::ostream& os, const Sensor& sensor);

    //Genere une nouvelle donnee aleatoire pour le capteur
    virtual void execute() = 0;

    //actualise la valeur du capteur lorsque son temps interne est écoulé
    void update();
};

#endif