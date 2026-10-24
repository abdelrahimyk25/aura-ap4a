#ifndef LUXMETER_HPP
#define LUXMETER_HPP

#include "Sensor.hpp"

class Luxmeter : public Sensor {
public:
    // Constructeur : transmet les paramètres à la classe mère
    Luxmeter(int id, Server* server, int _period);
    
    ~Luxmeter() override;

    void execute() override;

    float getLuminosity() const;

private:
    float _luminosity;
};

#endif