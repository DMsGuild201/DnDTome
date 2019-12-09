import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/char/CharOverview.css';
import { reciveAllChars } from '../../database/CharacterService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Char from './Char';

export default function SpellOverview() {
    const [currentCharList, setCurrentCharList] = useState([]);

    const receiveChars = (result) => {
        setCurrentCharList(result);
    }

    useEffect(() => {
        reciveAllChars(function (result) {
            receiveChars(result)
        })
    }, []);

    return (
        <div id="overview">
            <div id="chars">
                {currentCharList.map((char, index) => {
                    return <Char delay={index} char={char} key={char.char_id} />;
                })}
                <Link to="/add-char">
                    <div className="add">
                        <div className="addIcon"><FontAwesomeIcon icon={faUserPlus} /></div><br />Add new Character
                    </div>
                </Link>
            </div>
        </div>
    )
}
