#ifndef MAPSCENE_H
#define MAPSCENE_H

#include <qgraphicsscene.h>
#include <qpainterpath.h>

class MapScene : public QGraphicsScene
{
public:
    MapScene(QObject *parent);

private:
    QPainterPath mapPath;
};

#endif // MAPSCENE_H
