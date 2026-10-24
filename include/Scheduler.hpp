#ifndef SCHEDULER_HPP
#define SCHEDULER_HPP

#include <vector>
#include "Sensor.hpp"

class Scheduler {
private:
    std::vector<Sensor*> _sensors; // Liste des capteurs à animer

public:
    Scheduler();
    ~Scheduler();

    // Ajouter un capteur à la simulation
    void addSensor(Sensor* sensor);

    // Lancer la simulation pour un nombre donné de pas de temps
    void simulation(int totalSteps);
};

#endif