import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as MdIcons from 'react-icons/md';
import * as BsIcons  from "react-icons/bs";
export const SidebarData = [

    {
        title: 'User',
        path: '/User',
        icon: <IoIcons.IoMdPerson />,
        cName: 'nav-text'
    },
    {
        title: 'Airline',
        path: '/Airline',
        icon: <MdIcons.MdOutlineAirlines />,
        cName: 'nav-text'
    },
    {
        title: 'Aircraft',
        path: '/aircraft',
        icon: <BsIcons.BsFillAirplaneEnginesFill />,
        cName: 'nav-text'
    },
    {
        title: 'Station',
        path: '/Station',
        icon: <BsIcons.BsFillEvStationFill />,
        cName: 'nav-text'
    },
    {
        title: 'Flight',
        path: '/Flight',
        icon: <MdIcons.MdOutlineFlightTakeoff />,
        cName: 'nav-text'
    }
];