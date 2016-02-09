#ifndef TRADE_H
#define TRADE_H

#include <QDialog>
#include "city.h"

namespace Ui {
class Trade;
}

class Trade : public QDialog
{
    Q_OBJECT

public:
    explicit Trade(QWidget *parent, City *cityA, City *cityB);
    ~Trade();

private slots:
    void on_prodB2_valueChanged(int value);
    void on_trade2_valueChanged(int value);
    void on_prodA2_valueChanged(int value);
    void on_prodB1_valueChanged(int value);
    void on_trade1_valueChanged(int value);
    void on_prodA1_valueChanged(int value);

private:
    void update();

    Ui::Trade *ui;
    City *A, *B;
    bool block;
};

#endif // TRADE_H
