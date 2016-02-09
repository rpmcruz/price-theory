#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <iostream>
#include "mapscene.h"

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    MapScene *scene = new MapScene(this);
    ui->graphicsView->setScene(scene);
}

void MainWindow::resizeEvent(QResizeEvent *)
{
    QRectF bounds = ui->graphicsView->scene()->sceneRect();
    ui->graphicsView->fitInView(bounds, Qt::KeepAspectRatio);
    ui->graphicsView->centerOn(bounds.center());
}

void MainWindow::showEvent(QShowEvent *)
{
    resizeEvent(0);
}

MainWindow::~MainWindow()
{
    delete ui;
}
