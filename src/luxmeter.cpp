#include "Luxmeter.hpp"

Luxmeter::Luxmeter(int id, Server* server, int period)
    : Sensor(id, "LUXMETER", server, period, 0), _luminosity(0.0f)
{
}

void Luxmeter::execute()
{
    //1. Simulation : génère une luminosité aléatoire entre 0 et 1000 Lux
    _luminosity = static_cast<float>(rand() % 1000);

    // 2. Préparation des données pour le serveur
    std::string typeCapteur = _type; // Ex: "LUXMETER" (hérité de Sensor)
    std::string donneeStr = std::to_string(_luminosity);
    
    // Exemple de date/heure (tu peux utiliser <chrono> ou des valeurs temporaires)
    std::string date = "21/10/2026";
    std::string heure = "12:00:00";

    // 3. Envoi au serveur (via le pointeur _server hérité de Sensor)
    if (_server != nullptr) 
    {
        _server->consoleWrite(typeCapteur, donneeStr, date, heure);
        _server->fileWrite(typeCapteur, donneeStr, date, heure);
    }
}

float Luxmeter::getLuminosity() const
{
    return _luminosity;
}

Luxmeter::~Luxmeter()
{
}

