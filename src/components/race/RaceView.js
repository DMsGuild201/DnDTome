import React, { useState, useEffect } from 'react';
import * as ReactDOM from "react-dom";
import '../../assets/css/race/RaceView.css';
import OptionService from '../../database/OptionService';
import ThemeService from '../../services/ThemeService';
import { saveRace, deleteRace, addRaceToChar, reciveRacePerks } from '../../database/RaceService';
import { reciveAllChars } from '../../database/CharacterService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { dialog } = electron.remote;

export default function RaceView() {
    const [id, setId] = useState(0);
    const [name, setName] = useState("");
    const [sources, setSources] = useState("");
    const [pic, setPic] = useState("");
    const [abilityScoreImprov, setAbilityScoreImprov] = useState("");
    const [age, setAge] = useState("");
    const [alignment, setAlignment] = useState("");
    const [size, setSize] = useState("");
    const [speed, setSpeed] = useState("");
    const [lang, setLang] = useState("");
    const [perks, setPerks] = useState([]);

    const [chars, setChars] = useState([]);
    const [selectedChar, setSelectedChar] = useState(0);

    const receiveRace = (event, result) => {
        ReactDOM.unstable_batchedUpdates(() => {
            console.time("receiveRace")
            setName(result.race_name);
            setSources(result.race_sources);
            setId(result.race_id);
            setPic(result.race_pic);
            setAbilityScoreImprov(result.race_abilityScoreImprov);
            setAge(result.race_age);
            setAlignment(result.race_alignment);
            setSize(result.race_size);
            setLang(result.race_lang);
            setSpeed(result.race_speed);
            if (result.race_pic === null) {
                setPic("");
            }

            console.timeEnd("receiveRace")
        })
    }

    const receivePerksResult = (result) => {
        setPerks(result);
    }

    const receiveChars = (result) => {
        setChars(result);
        setSelectedChar(result[0].char_id);
    }

    const changeTheme = (event, result) => {
        ThemeService.applyTheme(result.theme);
    }

    useEffect(() => {
        OptionService.get('theme', function (result) {
            ThemeService.setTheme(result);
            ThemeService.applyTheme(result);
        });

        ipcRenderer.on("onViewRace", receiveRace);
        ipcRenderer.on("changeTheme", changeTheme);
        return () => {
            ipcRenderer.removeListener("onViewRace", receiveRace);
            ipcRenderer.removeListener("changeTheme", changeTheme);
        }
    }, []);

    useEffect(() => {
        reciveAllChars(function (result) {
            receiveChars(result)
        })
        reciveRacePerks(id, function (result) {
            receivePerksResult(result);
        })
    }, [id]);

    useEffect(() => {
        console.log(perks)
    }, [perks]);

    const saveRaceAction = (e) => {
        saveRace({ id, name, sources, pic });
    }

    const addRaceToCharAction = (e) => {
        addRaceToChar({ selectedChar }, { id, name }, function () { });
    }

    const deleteRaceAction = (e) => {
        const options = {
            type: 'question',
            buttons: ['Cancel', 'Yes, please', 'No, thanks'],
            defaultId: 2,
            title: `Delete ${name}?`,
            message: 'Do you want to do this?'
        };

        dialog.showMessageBox(null, options, (response) => {
            if (response == 1) {
                deleteRace({ id, name, sources });
            }
        });
    }

    const setPerkTitle = (e, id) => {
        let part = perks.map(perk => {
            if (perk.perk_id === id) { return { ...perk, perk_title: e.target.value }; } else { return perk; }
        });
        setPerks(part);
    }
    const setPerkLevel = (e, id) => {
        let part = perks.map(perk => {
            if (perk.perk_id === id) { return { ...perk, perk_level: e.target.value }; } else { return perk; }
        });
        setPerks(part);
    }
    const setPerkText = (e, id) => {
        let part = perks.map(perk => {
            if (perk.perk_id === id) { return { ...perk, perk_text: e.target.value }; } else { return perk; }
        });
        setPerks(part);
    }

    const style = {
        backgroundImage: `url(${pic})`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
    };

    return (
        <div id="raceView">
            <div className="left">
                <div className="topPart">
                    <div className="top">
                        <label>Name:<input name="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name..." /></label>
                        <label className="smallPic">Pic:<input name="pic" type="text" value={pic} onChange={e => setPic(e.target.value)} /></label>
                        <label>Sources:<input name="sources" type="text" value={sources} onChange={e => setSources(e.target.value)} placeholder="Sources..." /></label>
                        <label>Char: <select value={selectedChar} onChange={e => setSelectedChar(e.target.value)}>
                            {chars.map((char, index) => {
                                return <option key={index} value={char.char_id}>{char.char_name}</option>;
                            })}
                        </select>
                        </label>
                        <label>Ability Score:<input name="abilityScoreImprov" type="text" value={abilityScoreImprov} onChange={e => setAbilityScoreImprov(e.target.value)} placeholder="Ability score improvement..." /></label>
                    </div>
                    <div className="image" style={style}></div>
                    <button onClick={addRaceToCharAction}><FontAwesomeIcon icon={faPlus} /> Add to char</button>
                    <button onClick={saveRaceAction}><FontAwesomeIcon icon={faSave} /> Save</button>
                </div>
                <label>Age:<textarea className="small" name="age" value={age} onChange={e => setAge(e.target.value)} placeholder="Age..."></textarea></label>
                <label>Alignment:<textarea className="small" name="alignment" value={alignment} onChange={e => setAlignment(e.target.value)} placeholder="Alignment..."></textarea></label>
                <label>Size:<textarea className="small" name="size" value={size} onChange={e => setSize(e.target.value)} placeholder="Size..."></textarea></label>
                <label>Speed:<textarea className="small" name="speed" value={speed} onChange={e => setSpeed(e.target.value)} placeholder="Speed..."></textarea></label>
                <label>Language:<textarea className="small" name="language" value={lang} onChange={e => setLang(e.target.value)} placeholder="Language..."></textarea></label>
                <button onClick={deleteRaceAction} className="delete" style={{ float: "right" }}><FontAwesomeIcon icon={faTrashAlt} /> Delete</button>
            </div>
            <div className="right">
                {perks.map((perk, index) => {
                    return <div className="perk" key={perk.perk_id}>
                        <input className="perkTitle" type="text" value={perk.perk_title} onChange={e => setPerkTitle(e, perk.perk_id)} placeholder="Perk title..."></input>
                        <input className="perkLevel" type="number" value={perk.perk_level} onChange={e => setPerkLevel(e, perk.perk_id)} placeholder="Perk level..."></input>
                        <textarea className="perkText" value={perk.perk_text} onChange={e => setPerkText(e, perk.perk_id)} placeholder="Perk text..."></textarea>
                    </div>;
                })}
            </div>
        </div>
    )
}