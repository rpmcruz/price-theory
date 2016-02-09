#-------------------------------------------------
#
# Project created by QtCreator 2016-02-09T11:07:39
#
#-------------------------------------------------

QT       += core gui svg

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = Hansa
TEMPLATE = app


SOURCES += main.cpp\
        mainwindow.cpp \
    mapscene.cpp \
    trade.cpp \
    city.cpp \
    game.cpp

HEADERS  += mainwindow.h \
    mapscene.h \
    trade.h \
    city.h \
    game.h \
    box_muller.h

FORMS    += mainwindow.ui \
    trade.ui

CONFIG += mobility
MOBILITY = 

DISTFILES +=

RESOURCES += \
    res.qrc

