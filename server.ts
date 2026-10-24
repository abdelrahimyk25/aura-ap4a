import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

interface SensorData {
  id: number;
  type: string;
  period: number;
  counter: number;
  luminosity: number;
}

const embeddedSourceFiles = [
  {
    path: 'include/Luxmeter.hpp',
    content: `#ifndef LUXMETER_HPP
#define LUXMETER_HPP

#include "Sensor.hpp"

class Luxmeter : public Sensor {
public:
    Luxmeter(int id, Server* server, int _period);
    ~Luxmeter() override;

    void execute() override;

    float getLuminosity() const;

private:
    float _luminosity;
};

#endif`
  },
  {
    path: 'include/Scheduler.hpp',
    content: `#ifndef SCHEDULER_HPP
#define SCHEDULER_HPP

#include <vector>
#include "Sensor.hpp"

class Scheduler {
private:
    std::vector<Sensor*> _sensors;

public:
    Scheduler();
    ~Scheduler();

    void addSensor(Sensor* sensor);
    void simulation(int totalSteps);
};

#endif`
  },
  {
    path: 'include/Sensor.hpp',
    content: `#ifndef SENSOR_HPP
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

    int _period;
    int _counter;

public:
    Sensor();
    Sensor(const int _id, std::string _type, Server* _server, int _period, int _counter);
    Sensor(const Sensor& other);
    Sensor& operator=(const Sensor& other);
    virtual ~Sensor();

    friend std::ostream& operator<<(std::ostream& os, const Sensor& sensor);

    virtual void execute() = 0;
    void update();
};

#endif`
  },
  {
    path: 'include/Server.hpp',
    content: `#ifndef SERVER_HPP
#define SERVER_HPP

#include <string>

class Server
{
private:
    std::string _name;
    int _port;

public:
    Server();
    Server(const std::string& name, int port);
    Server(const Server& other);
    Server& operator=(const Server& other);
    ~Server();

    void consoleWrite(std::string nom_capteur, std::string donnee, std::string date, std::string heure);
    void fileWrite(std::string nom_capteur, std::string donnee,std::string date, std::string heure);

    friend std::ostream& operator<<(std::ostream& os, const Server& server);
};

#endif`
  },
  {
    path: 'src/luxmeter.cpp',
    content: `#include "Luxmeter.hpp"

Luxmeter::Luxmeter(int id, Server* server, int period)
    : Sensor(id, "LUXMETER", server, period, 0), _luminosity(0.0f)
{
}

void Luxmeter::execute()
{
    _luminosity = static_cast<float>(rand() % 1000);
    std::string typeCapteur = _type;
    std::string donneeStr = std::to_string(_luminosity);
    std::string date = "21/10/2026";
    std::string heure = "12:00:00";

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
}`
  },
  {
    path: 'src/scheduler.cpp',
    content: `#include "Scheduler.hpp"

Scheduler::Scheduler() {}
Scheduler::~Scheduler() {}

void Scheduler::addSensor(Sensor* sensor) {
    _sensors.push_back(sensor);
}

void Scheduler::simulation(int totalSteps) {
    for (int step = 0; step < totalSteps; ++step) {
        for (Sensor* sensor : _sensors) {
            if (sensor != nullptr) {
                sensor->update();
            }
        }
    }
}`
  },
  {
    path: 'src/sensor.cpp',
    content: `#include "Server.hpp"
#include "Sensor.hpp"
#include <iostream>
#include <fstream>

Sensor::Sensor(const int id, std::string type, Server* server, int period, int counter)
    : _id(id), _type(type), _server(server), _period(period), _counter(counter)
{
}

Sensor::Sensor(const Sensor& other)
    : _id(other._id), _type(other._type), _server(other._server), _period(other._period), _counter(other._counter)
{
}

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
        execute();
        _counter = 0;
    }
}

Sensor::~Sensor()
{
}`
  },
  {
    path: 'src/server.cpp',
    content: `#include "Server.hpp"
#include <iostream>
#include <fstream>

Server::Server() : _name(""), _port(0) {}
Server::Server(const std::string& name, int port) : _name(name), _port(port) {}
Server::Server(const Server& other) : _name(other._name), _port(other._port) {}

Server& Server::operator=(const Server& other)
{
    if (this != &other)
    {
        _name = other._name;
        _port = other._port;
    }
    return *this;
}

Server::~Server() {}

void Server::consoleWrite(std::string nom_capteur, std::string donnee, std::string date, std::string heure)
{
    std::cout << date << " : "<< heure << " : "<< nom_capteur << " : "<< donnee << std::endl;
}

void Server::fileWrite(std::string nom_capteur, std::string donnee, std::string date, std::string heure)
{
    std::string nom_fichier = "../data/log_" + nom_capteur + ".txt";
    std::ofstream fichier(nom_fichier, std::ios::app);
    fichier << date << " : " << heure << " : " << nom_capteur << " : " << donnee << std::endl;
}

std::ostream& operator<<(std::ostream& os, const Server& server)
{
    os << "Serveur : " << server._name << " | Port : " << server._port;
    return os;
}`
  },
  {
    path: 'src/main.cpp',
    content: `#include "Server.hpp"
#include "Luxmeter.hpp"
#include "Scheduler.hpp"
#include <iostream>

int main(){
    Server serv("Server", 8080);
    Luxmeter lux(1, &serv, 3);
    Scheduler ordonanceur;
    ordonanceur.addSensor(&lux);
    ordonanceur.simulation(2);
    return 0;
}`
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  let serverInfo = {
    name: "Server",
    port: 8080
  };

  let sensors: SensorData[] = [
    { id: 1, type: "LUXMETER", period: 3, counter: 0, luminosity: 41.0 }
  ];

  let consoleLogs: string[] = [
    "21/10/2026 : 12:00:00 : LUXMETER : 41.000000",
    "21/10/2026 : 12:00:00 : LUXMETER : 41.000000",
    "21/10/2026 : 12:00:00 : LUXMETER : 41.000000"
  ];

  function getCurrentDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return {
      date: `${day}/${month}/${year}`,
      heure: `${hours}:${minutes}:${seconds}`
    };
  }

  app.get('/api/status', (req, res) => {
    res.json({
      server: serverInfo,
      sensorCount: sensors.length,
      status: 'Running (C++ Migration Active)'
    });
  });

  app.get('/api/sensors', (req, res) => {
    res.json(sensors);
  });

  app.post('/api/sensors/add', (req, res) => {
    const { id, type, period } = req.body;
    const newSensor: SensorData = {
      id: id || sensors.length + 1,
      type: type || "LUXMETER",
      period: period || 3,
      counter: 0,
      luminosity: Math.floor(Math.random() * 1000)
    };
    sensors.push(newSensor);
    res.json({ success: true, sensors });
  });

  app.post('/api/simulation/run', (req, res) => {
    const { totalSteps = 2 } = req.body;
    const executedLogs: { step: number; logs: string[] }[] = [];

    const { date, heure } = getCurrentDateTime();

    for (let step = 0; step < totalSteps; step++) {
      const stepLogs: string[] = [];
      sensors.forEach(sensor => {
        sensor.counter++;
        if (sensor.counter >= sensor.period) {
          sensor.luminosity = parseFloat((Math.random() * 1000).toFixed(2));
          sensor.counter = 0;

          const logLine = `${date} : ${heure} : ${sensor.type} : ${sensor.luminosity.toFixed(6)}`;
          consoleLogs.push(logLine);
          stepLogs.push(logLine);

          try {
            const dataDir = path.join(process.cwd(), 'data');
            if (!fs.existsSync(dataDir)) {
              fs.mkdirSync(dataDir, { recursive: true });
            }
            const logFilePath = path.join(dataDir, `log_${sensor.type}.txt`);
            fs.appendFileSync(logFilePath, logLine + '\n');
          } catch (e) {
            console.error("Failed to write log file:", e);
          }
        }
      });
      executedLogs.push({ step: step + 1, logs: stepLogs });
    }

    res.json({
      success: true,
      totalSteps,
      executedLogs,
      sensors,
      consoleLogs: consoleLogs.slice(-50)
    });
  });

  app.get('/api/logs', (req, res) => {
    try {
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const files = fs.readdirSync(dataDir);
      const logFilesData: { filename: string; content: string }[] = [];

      files.forEach(file => {
        if (file.endsWith('.txt')) {
          const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
          logFilesData.push({ filename: file, content });
        }
      });

      res.json({
        consoleLogs: consoleLogs.slice(-50),
        logFiles: logFilesData
      });
    } catch (e) {
      res.json({ consoleLogs, logFiles: [] });
    }
  });

  app.post('/api/logs/clear', (req, res) => {
    consoleLogs = [];
    try {
      const dataDir = path.join(process.cwd(), 'data');
      if (fs.existsSync(dataDir)) {
        const files = fs.readdirSync(dataDir);
        files.forEach(file => {
          if (file.endsWith('.txt')) {
            fs.writeFileSync(path.join(dataDir, file), '');
          }
        });
      }
    } catch (e) {}
    res.json({ success: true });
  });

  app.get('/api/source-code', (req, res) => {
    res.json(embeddedSourceFiles);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
