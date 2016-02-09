#include "city.h"
#include "box_muller.h"
#include "game.h"
#include <QtGlobal>
#include <QtCore/qmath.h>
#include <iostream>

City::City(int id, const char *name, int x, int y)
    : name(name), id(id), x(x), y(275-y)
{
    population = (int)(rand_normal(1000, 200)+0.5);
    for(int c = 0; c < NCOMMODITIES; c++) {
        employment[c] = population/2;
        cost[c] = qMax(0., (int)(rand_normal(10, 1.5))+0.5),
        exports[c] = new int[Game::get()->getCitiesLen()];
        imports[c] = new int[Game::get()->getCitiesLen()];
        for(int i = 0; i < Game::get()->getCitiesLen(); i++)
            exports[c][i] = imports[c][i] = 0;
    }
}

int City::trade(City *A, City *B, int c)
{
    return A->exports[c][B->id];
}

int City::utility() const
{
    float utility = 0;
    for(int c = 0; c < NCOMMODITIES; c++) {
        int consumption = calcProd(c) + calcImports(c) - calcExports(c);
        std::cout << "consumtion: " << consumption << " -> " << qLn(consumption) << std::endl;
        if(consumption > 0)
            utility += qLn(consumption);
    }
    return utility*50;
}

int City::calcExports(int c) const
{
    int sum = 0;
    for(int i = 0; i < Game::get()->getCitiesLen(); i++)
        sum += exports[c][i];
    return sum;
}

int City::calcImports(int c) const
{
    int sum = 0;
    for(int i = 0; i < Game::get()->getCitiesLen(); i++)
        sum += imports[c][i];
std::cout << "imports: " << name << " " << sum << std::endl;
    return sum;
}

int City::calcMaxProd(int c) const
{
    int E = employment[c];
    int U = calcUnemployment();
    int ret = (int)((E + U) / cost[c]);

    std::cerr << "is producing with " << E << " has extra labor: " << U << " at cost: " << cost[c] << " calc max prod: " << ret << std::endl;
    return ret;
}

int City::calcProd(int c) const
{
    int E = employment[c];
    int prod = (int)(E / cost[c]);
    std::cerr << "calc prod: " << prod << std::endl;
    return prod;
}

void City::setProd(int c, int Q)
{
    Q = qMax(Q, calcExports(c));  // cannot go lower than exports
    employment[c] = Q*cost[c];
}

void City::setExport(City *B, int c, int p)
{
    exports[c][B->id] += p;
}

void City::setImport(City *B, int c, int p)
{
    imports[c][B->id] += p;
}

int City::calcUnemployment() const
{
    int sum = 0;
    for(int c = 0; c < NCOMMODITIES; c++)
        sum += employment[c];
    return population - sum;
}
