#include "game.h"
#include <iostream>

static const char *cities_names[] = {
    "Lübeck", "London", "Hamburg", "Lisbon", "Madrid",
    "Paris", "Bologne", "Prague", "Antwerp",
};

static const int cities_pos[][2] = {
    {495,389}, {357,264}, {468,199}, {36,139}, {108,98},
    {352,176}, {377,8}, {420,105}, {405,207},
};

void Game::postConstructor()
{
    cities = new City*[getCitiesLen()];
    for(int i = 0; i < getCitiesLen(); i++)
        cities[i] = new City(i, cities_names[i], cities_pos[i][0], cities_pos[i][1]);
}

Game::~Game()
{
    for(int i = 0; i < getCitiesLen(); i++)
        delete cities[i];
    delete [] cities;
}

Game *Game::get()
{
    static Game *singleton = 0;
    if(!singleton) {
        singleton = new Game();
        singleton->postConstructor();
    }
    return singleton;
}

int Game::getCitiesLen()
{
    return sizeof(cities_pos) / sizeof(int) / 2;
}

City *Game::getCity(int i)
{
    return cities[i];
}
