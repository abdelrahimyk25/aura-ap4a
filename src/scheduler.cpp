#include "Scheduler.hpp"

Scheduler::Scheduler() {}

Scheduler::~Scheduler() {}

void Scheduler::addSensor(Sensor* sensor) {
    _sensors.push_back(sensor);
}

void Scheduler::simulation(int totalSteps) {
    for (int step = 0; step < totalSteps; ++step) {
        // À chaque pas de temps, on notifie tous les capteurs
        for (Sensor* sensor : _sensors) {
            if (sensor != nullptr) {
                sensor->update(); //[cite: 5]
            }
        }
    }
}