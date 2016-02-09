#ifndef CITY_H
#define CITY_H

#define NCOMMODITIES 2

class City
{
// constant stuff
int population;
float cost[NCOMMODITIES];  // units = labor-per-quantity

// what the player can change
int employment[NCOMMODITIES];  // units = labor
int *exports[NCOMMODITIES];  // units = labor
int *imports[NCOMMODITIES];  // units = labor

// Notice we never use prices or quantities explicitily, because those
// are set by productivitity and etc, there is no way we can meet them.

const char *name;
int id;
int x;
int y;

public:
    City(int id, const char *name, int x, int y);

    int utility() const;

    static int trade(City *A, City *B, int c);

    int calcImports(int c) const;
    int calcExports(int c) const;
    int calcProd(int c) const;
    int calcMaxProd(int c) const;
    int calcUnemployment() const;

    void setProd(int c, int p);

    void setExport(City *B, int c, int p);
    void setImport(City *B, int c, int p);  // call both !!

    const char *getName() const { return name; }
    int getX() const { return x; }
    int getY() const { return y; }
};

#endif // CITY_H
