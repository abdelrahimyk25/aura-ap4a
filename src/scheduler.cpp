#include "scheduler.hpp"
#include <iostream>

// Constructeur par défaut
Scheduler::Scheduler() {}

// Constructeur de copie
Scheduler::Scheduler(const Scheduler& other) 
    : _sensors(other._sensors) {}

// Opérateur d'affectation
Scheduler& Scheduler::operator=(const Scheduler& other) {
    if (this != &other) {
        _sensors = other._sensors;
    }
    return *this;
}

// Destructeur
Scheduler::~Scheduler() {
    _sensors.clear();
}

// Permet d'ajouter un capteur à l'ordonnanceur
void Scheduler::addSensor(Sensor* sensor) {
    if (sensor != nullptr) {
        _sensors.push_back(sensor);
    }
}

// Fonction de simulation : cadence l'exécution des capteurs[cite: 4]
void Scheduler::simulation(int nbCycles) {
    for (int cycle = 1; cycle <= nbCycles; ++cycle) {
        std::cout << "\n=== Début du cycle N° " << cycle << " ===" << std::endl;
        
        for (Sensor* sensor : _sensors) {
            if (sensor != nullptr) {
                sensor->update(); // Active le comportement dynamique de chaque capteur[cite: 4]
            }
        }
    }
}