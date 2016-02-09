#ifndef GAME_H
#define GAME_H

#include "city.h"

class Game
{
    void postConstructor();
    ~Game();
    City **cities;

public:
    static Game *get();
    int getCitiesLen();
    City *getCity(int i);
};

#endif // GAME_H
