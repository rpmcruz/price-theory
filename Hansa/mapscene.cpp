#include "mapscene.h"
#include <qpainter.h>
#include <QGraphicsSvgItem>
#include <QCursor>
#include <iostream>
#include <QApplication>
#include "trade.h"
#include "game.h"

static const float WIDTH = 800.f;
static const float HEIGHT = 480.f;

struct CityShape;
CityShape *pressed = 0;

struct CityShape : public QGraphicsEllipseItem
{
    City *city;

    CityShape(City *city)
    : QGraphicsEllipseItem(city->getX(), city->getY(), 12, 12), city(city)
    {
        setBrush(QBrush(Qt::white));
        setPen(QPen(QColor("#292929"), 1.5));
        setToolTip(city->getName());
        setCursor(QCursor(Qt::PointingHandCursor));
        setAcceptHoverEvents(true);
    }

protected:
    void mousePressEvent(QGraphicsSceneMouseEvent *)
    {
        if(pressed) {
            if(pressed != this) {
                QWidget *parent = QApplication::activeWindow();
                Trade *trade = new Trade(parent, pressed->city, this->city);
                trade->show();
            }
            pressed->setBrush(QBrush(Qt::white));
            pressed->update();
            pressed = 0;
        }
        else
            pressed = this;
    }

    void hoverEnterEvent(QGraphicsSceneHoverEvent *)
    {
        setBrush(QBrush(QColor("#292929")));
        update();
    }

    void hoverLeaveEvent(QGraphicsSceneHoverEvent *)
    {
        if(pressed != this) {
            setBrush(QBrush(Qt::white));
            update();
        }
    }
};

MapScene::MapScene(QObject *parent)
    : QGraphicsScene(parent)
{
    setSceneRect(0, 0, 700, 275);

    addRect(-1, -1, 700+2, 275+2, QPen(Qt::NoPen), QBrush(QColor("#979cab")));
    addItem(new QGraphicsSvgItem(":/images/img/map.svg"));
    for(int i = 0; i < Game::get()->getCitiesLen(); i++)
        addItem(new CityShape(Game::get()->getCity(i)));
}
