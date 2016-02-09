#include "trade.h"
#include "ui_trade.h"
#include <iostream>

Trade::Trade(QWidget *parent, City *A, City *B)
    : QDialog(parent), ui(new Ui::Trade), A(A), B(B), block(true)
{
    ui->setupUi(this);

    ui->cityA->setText(A->getName());
    ui->cityB->setText(B->getName());
    block = false;
    update();
}

Trade::~Trade()
{
    delete ui;
}

void Trade::update()
{
    if(block)
        return;
    block = true;

    std::cerr << "** changing to: " << A->calcProd(0) << std::endl;
    ui->prodA1->setValue(A->calcProd(0));
    ui->prodA2->setValue(A->calcProd(1));
    ui->prodA1->setMaximum(A->calcMaxProd(0));
    ui->prodA2->setMaximum(A->calcMaxProd(1));

    ui->prodB1->setValue(B->calcProd(0));
    ui->prodB2->setValue(B->calcProd(1));
    ui->prodB1->setMaximum(B->calcMaxProd(0));
    ui->prodB2->setMaximum(B->calcMaxProd(1));

    ui->trade1->setMinimum(-B->calcProd(0));
    ui->trade1->setMaximum(+A->calcProd(0));
    ui->trade1->setValue(City::trade(A, B, 0));
    ui->trade2->setMinimum(-B->calcProd(1));
    ui->trade2->setMaximum(+A->calcProd(1));
    ui->trade2->setValue(City::trade(A, B, 1));

    ui->utilityA->setValue(A->utility());
    ui->utilityB->setValue(B->utility());
    //std::cout << "utility: " << A->utility() << std::endl;
    ui->laborA->setText(QString::number(A->calcUnemployment()));
    ui->laborB->setText(QString::number(B->calcUnemployment()));

    block = false;
}

void Trade::on_prodA1_valueChanged(int value) { std::cerr << "** set value: " << value << std::endl; A->setProd(0, value); update(); }
void Trade::on_prodA2_valueChanged(int value) { if(!block) A->setProd(1, value); update(); }
void Trade::on_prodB1_valueChanged(int value) { if(!block) B->setProd(0, value); update(); }
void Trade::on_prodB2_valueChanged(int value) { if(!block) B->setProd(1, value); update(); }

void Trade::on_trade1_valueChanged(int value)
{
    if(block) return;
    if(value > 0) {
        A->setExport(B, 0, value);
        B->setImport(A, 0, value);
    }
    else {
        A->setImport(B, 0, -value);
        B->setExport(A, 0, -value);
    }
    update();
}

void Trade::on_trade2_valueChanged(int value)
{
    if(block) return;
    if(value > 0) {
        A->setExport(B, 1, value);
        B->setImport(A, 1, value);
    }
    else {
        A->setImport(B, 1, -value);
        B->setExport(A, 1, -value);
    }
    update();
}
