import React, { useState, useEffect } from 'react';
import * as ReactDOM from "react-dom";
import '../../assets/css/monster/MonsterView.css';
import { saveMonster, deleteMonster, addMonsterToChar } from '../../database/MonsterService';
import { reciveAllChars } from '../../database/CharacterService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { dialog } = electron.remote;

export default function MonsterView({ monster }) {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [pic, setPic] = useState("");
    const [size, setSize] = useState("");
    const [type, setType] = useState("");
    const [subtype, setSubtype] = useState("");
    const [alignment, setAlignment] = useState("");
    const [ac, setAc] = useState("");
    const [hp, setHp] = useState("");
    const [speed, setSpeed] = useState("");
    const [cr, setCr] = useState("");
    const [source, setSource] = useState("");
    const [str, setStr] = useState("");
    const [dex, setDex] = useState("");
    const [con, setCon] = useState("");
    const [int, setInt] = useState("");
    const [wis, setWis] = useState("");
    const [cha, setCha] = useState("");
    const [savingThrows, setSavingThrows] = useState("");
    const [skills, setSkills] = useState("");
    const [senses, setSenses] = useState("");
    const [lang, setLang] = useState("");
    const [dmgVulnerabilitie, setDmgVulnerabilitie] = useState("");
    const [dmgResistance, setDmgResistance] = useState("");
    const [dmgImmunities, setDmgImmunities] = useState("");
    const [conImmunities, setConImmunities] = useState("");
    const [sAblt, setSAblt] = useState("");
    const [ablt, setAblt] = useState("");
    const [lAblt, setLAblt] = useState("");

    const [chars, setChars] = useState([]);
    const [selectedChar, setSelectedChar] = useState(0);

    const receiveMonster = (result) => {
        ReactDOM.unstable_batchedUpdates(() => {
            console.time("receiveMonster")

            let text_sAblt = "";
            if (result.monster_sAblt !== null) {
                text_sAblt = result.monster_sAblt.replace(/\\r\\n/gm, "\r\n");
            }
            let text_ablt = "";
            if (result.monster_ablt !== null) {
                text_ablt = result.monster_ablt.replace(/\\r\\n/gm, "\r\n");
            }
            let text_lAbtl = ""
            if (result.monster_lAbtl !== null) {
                text_lAbtl = result.monster_lAbtl.replace(/\\r\\n/gm, "\r\n");
            }

            setId(result.monster_id);
            setName(result.monster_name);
            setType(result.monster_type);
            setSubtype(result.monster_subtype);
            setPic(result.monster_pic);
            setSize(result.monster_size);
            setType(result.monster_type);
            setAlignment(result.monster_alignment);
            setAc(result.monster_armorClass);
            setHp(result.monster_hitPoints);
            setSpeed(result.monster_speed);
            setCr(result.monster_cr);
            setSource(result.monster_source);
            setStr(result.monster_strength);
            setDex(result.monster_dexterity);
            setCon(result.monster_constitution);
            setInt(result.monster_intelligence);
            setWis(result.monster_wisdom);
            setCha(result.monster_charisma);
            setSavingThrows(result.monster_savingThrows);
            setSkills(result.monster_skills);
            setSenses(result.monster_senses);
            setLang(result.monster_lang);
            setDmgVulnerabilitie(result.monster_dmgVulnerabilities);
            setDmgResistance(result.monster_dmgResistance);
            setDmgImmunities(result.monster_dmgImmunities);
            setConImmunities(result.monster_conImmunities);
            setSAblt(text_sAblt);
            setAblt(text_ablt);
            setLAblt(text_lAbtl);
            console.timeEnd("receiveMonster")
        })
    }

    const receiveChars = (result) => {
        setChars(result);
        setSelectedChar(result[0].char_id);
    }

    useEffect(() => {
        reciveAllChars(function (result) {
            receiveChars(result)
        })
    }, [id]);

    useEffect(() => {
        receiveMonster(monster);
    }, [monster]);

    const formatScore = (score) => {
        let mod = Math.floor((score - 10) / 2);
        if (mod >= 0) {
            return "+" + mod;
        } else {
            return mod;
        }
    }

    const addMonsterToCharAction = (e) => {
        addMonsterToChar({ selectedChar }, { id, name }, function () { });
    }

    const saveMonsterAction = (e) => {
        saveMonster({
            id, name, type, subtype, cr, ac, hp, str, dex, con,
            int, wis, cha, senses, lang, speed, source, skills, savingThrows, dmgImmunities, dmgResistance,
            dmgVulnerabilitie, conImmunities, sAblt, ablt, lAblt, pic, size, alignment
        });
        ipcRenderer.send('updateWindow', {
            monster_id: id, monster_name: name, monster_size: size, monster_type: type, monster_subtype: subtype, monster_alignment: alignment,
            monster_hitPoints: hp, monster_speed: speed, monster_strength: str, monster_dexterity: dex, monster_constitution: con,
            monster_intelligence: int, monster_wisdom: wis, monster_charisma: cha, monster_savingThrows: savingThrows, monster_skills: skills,
            monster_dmgVulnerabilities: dmgVulnerabilitie, monster_dmgResistance: setDmgResistance, monster_dmgImmunities: setDmgImmunities,
            monster_conImmunities: conImmunities, monster_senses: senses, monster_lang: lang, monster_armorClass: ac,
            monster_cr: cr, monster_sAblt: sAblt, monster_ablt: ablt, monster_lAbtl: lAblt, monster_source: source, monster_pic: pic
        });
    }

    const deleteMonsterAction = (e) => {
        const options = {
            type: 'question',
            buttons: ['Cancel', 'Yes, please', 'No, thanks'],
            defaultId: 2,
            title: `Delete ${name}?`,
            message: 'Do you want to do this?'
        };

        dialog.showMessageBox(null, options, (response) => {
            if (response == 1) {
                deleteMonster({
                    id, name, type, subtype, cr, ac, hp, str, dex, con,
                    int, wis, cha, senses, lang, speed, source, skills, savingThrows, dmgImmunities, dmgResistance,
                    dmgVulnerabilitie, conImmunities, sAblt, ablt, lAblt, pic, size, alignment
                });
            }
        });
    }

    const style = {
        backgroundImage: `url(${pic})`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
    };

    return (
        <div id="monsterView">
            <div className="image" style={style}></div>
            <div className="top">
                <label>Name:<input name="name" type="text" value={name} onChange={e => setName(e.target.value)} /></label>
                <label>Type:<input name="type" type="text" value={type} onChange={e => setType(e.target.value)} /></label>
                <label>Subtype:<input name="subtype" type="text" value={subtype} onChange={e => setSubtype(e.target.value)} /></label>
                <label>Pic:<input name="pic" type="text" value={pic} onChange={e => setPic(e.target.value)} /></label>
                <label>Source:<input name="source" type="text" value={source} onChange={e => setSource(e.target.value)} /></label>
                <label className="left">Char:<select value={selectedChar} onChange={e => setSelectedChar(e.target.value)}>
                    {chars.map((char, index) => {
                        return <option key={index} value={char.char_id}>{char.char_name}</option>;
                    })}
                </select></label>
            </div>
            <div className="top">
                <label className="smallLabel">Cr:<input name="cr" type="text" value={cr} onChange={e => setCr(e.target.value)} /></label>
                <label className="smallLabel">AC:<input name="ac" type="number" value={ac} onChange={e => setAc(e.target.value)} /></label>
                <label>Alignment:<input name="alignment" type="text" value={alignment} onChange={e => setAlignment(e.target.value)} /></label>
                <label>Hit Points:<input name="hp" type="text" value={hp} onChange={e => setHp(e.target.value)} /></label>
                <label>Speed:<input name="speed" type="text" value={speed} onChange={e => setSpeed(e.target.value)} /></label>
                <label>Size:<input name="size" type="text" value={size} onChange={e => setSize(e.target.value)} /></label>
                <button className="delete" onClick={deleteMonsterAction}><FontAwesomeIcon icon={faTrashAlt} /> Delete</button>
                <button onClick={saveMonsterAction}><FontAwesomeIcon icon={faSave} /> Save</button>
                <button onClick={addMonsterToCharAction}><FontAwesomeIcon icon={faPlus} /> Add to char</button>
            </div>
            <div className="abilityScores">
                <div className="score">
                    <label>Strength: <input type="number" value={str} onChange={e => setStr(e.target.value)}></input></label>
                    <div className="abilityBonus">{formatScore(str)}</div>
                </div>
                <div className="score">
                    <label>Dexterity: <input type="number" value={dex} onChange={e => setDex(e.target.value)}></input></label>
                    <div className="abilityBonus">{formatScore(dex)}</div>
                </div>
                <div className="score">
                    <label>Constitution: <input type="number" value={con} onChange={e => setCon(e.target.value)}></input></label>
                    <div className="abilityBonus">{formatScore(con)}</div>
                </div>
                <div className="score">
                    <label>Intelligence: <input type="number" value={int} onChange={e => setInt(e.target.value)}></input></label>
                    <div className="abilityBonus">{formatScore(int)}</div>
                </div>
                <div className="score">
                    <label>Wisdom: <input type="number" value={wis} onChange={e => setWis(e.target.value)}></input></label>
                    <div className="abilityBonus">{formatScore(wis)}</div>
                </div>

                <div className="score">
                    <label>Charisma: <input type="number" value={cha} onChange={e => setCha(e.target.value)}></input></label>
                    <div className="abilityBonus">{formatScore(cha)}</div>
                </div>
            </div>
            <div className="top">
                <textarea className="small" value={savingThrows} onChange={e => setSavingThrows(e.target.value)} placeholder="Saving Throws..."></textarea>
                <div className="textareaTip">Saving Throws</div>
                <textarea className="small" value={skills} onChange={e => setSkills(e.target.value)} placeholder="Skills..."></textarea>
                <div className="textareaTip">Skills</div>
                <textarea className="small" value={senses} onChange={e => setSenses(e.target.value)} placeholder="Senses..."></textarea>
                <div className="textareaTip">Senses</div>
                <textarea className="small" value={lang} onChange={e => setLang(e.target.value)} placeholder="Languages..."></textarea>
                <div className="textareaTip">Languages</div>
            </div>
            <div className="top">
                <textarea className="small" value={dmgVulnerabilitie} onChange={e => setDmgVulnerabilitie(e.target.value)} placeholder="Vulnerabilities..."></textarea>
                <div className="textareaTip">Vulnerabilities</div>
                <textarea className="small" value={dmgResistance} onChange={e => setDmgResistance(e.target.value)} placeholder="Resistances..."></textarea>
                <div className="textareaTip">Resistances</div>
                <textarea className="small" value={dmgImmunities} onChange={e => setDmgImmunities(e.target.value)} placeholder="Damage immunities..."></textarea>
                <div className="textareaTip">Damage immunities</div>
                <textarea className="small" value={conImmunities} onChange={e => setConImmunities(e.target.value)} placeholder="Condition immunities..."></textarea>
                <div className="textareaTip">Condition immunities</div>
            </div>
            <textarea value={sAblt} onChange={e => setSAblt(e.target.value)} placeholder="Special abilities..."></textarea>
            <textarea value={ablt} onChange={e => setAblt(e.target.value)} placeholder="Actions..."></textarea>
            <textarea value={lAblt} onChange={e => setLAblt(e.target.value)} placeholder="Legendary Actions..."></textarea>
        </div>
    )
}
