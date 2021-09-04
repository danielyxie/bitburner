import React, { useState } from 'react';
import { createPopup, removePopup } from "../../ui/React/createPopup";
import { numeralWrapper } from "../../ui/numeralFormat";
import { CorporationConstants } from "../data/Constants";
import { ICorporation } from "../ICorporation";
import { OfficeSpace } from "../OfficeSpace";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { getRandomInt } from "../../../utils/helpers/getRandomInt";
import { formatNumber } from "../../../utils/StringHelperFunctions";
import { Employee } from "../Employee";
import { dialogBoxCreate } from "../../../utils/DialogBox";

interface INameEmployeeProps {
    office: OfficeSpace;
    corp: ICorporation;
    popupId: string;
    employee: Employee;
    player: IPlayer;
}

function NameEmployeePopup(props: INameEmployeeProps): React.ReactElement {
    const [name, setName] = useState('');
    function nameEmployee(): void {
        for (let i = 0; i < props.office.employees.length; ++i) {
            if (props.office.employees[i].name === name) {
                dialogBoxCreate("You already have an employee with this nickname!");
                return;
            }
        }
        props.employee.name = name;
        props.office.employees.push(props.employee);
        props.corp.rerender(props.player);
        removePopup(props.popupId);
    }

    function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
        if (event.keyCode === 13) nameEmployee();
    }

    function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setName(event.target.value);
    }

    return (<>
        <p>Give your employee a nickname!</p>
        <input value={name} className="text-input" type="text" placeholder="Employee nickname" onKeyDown={onKeyDown} onChange={onChange} />
        <button className="std-button" onClick={nameEmployee}>Hire!</button>
    </>);
}

interface IHireEmployeeProps {
    employee: Employee;
    office: OfficeSpace;
    popupId: string;
    player: IPlayer;
    corp: ICorporation;
}

function HireEmployeeButton(props: IHireEmployeeProps): React.ReactElement {
    function hire(): void {
        const popupId = "cmpy-mgmt-name-employee-popup";
        createPopup(popupId, NameEmployeePopup, {
            office: props.office,
            corp: props.corp,
            popupId: popupId,
            player: props.player,
            employee: props.employee,
        });
        removePopup(props.popupId);
    }

    return (<div onClick={hire} className="cmpy-mgmt-find-employee-option">
        Intelligence: {formatNumber(props.employee.int, 1)}<br />
        Charisma: {formatNumber(props.employee.cha, 1)}<br />
        Experience: {formatNumber(props.employee.exp, 1)}<br />
        Creativity: {formatNumber(props.employee.cre, 1)}<br />
        Efficiency: {formatNumber(props.employee.eff, 1)}<br />
        Salary: {numeralWrapper.formatMoney(props.employee.sal)} \ s<br />
    </div>);
}

interface IProps {
    office: OfficeSpace;
    corp: ICorporation;
    popupId: string;
    player: IPlayer;
}

// Create a popup that lets the player manage exports
export function HireEmployeePopup(props: IProps): React.ReactElement {
    if (props.office.atCapacity()) return (<></>);

    //Generate three random employees (meh, decent, amazing)
    const mult1 = getRandomInt(25, 50)/100;
    const mult2 = getRandomInt(51, 75)/100;
    const mult3 = getRandomInt(76, 100)/100;
    const int = getRandomInt(50, 100);
    const cha = getRandomInt(50, 100);
    const exp = getRandomInt(50, 100);
    const cre = getRandomInt(50, 100);
    const eff = getRandomInt(50, 100);
    const sal = CorporationConstants.EmployeeSalaryMultiplier * (int + cha + exp + cre + eff);

    const emp1 = new Employee({
        intelligence: int * mult1,
        charisma: cha * mult1,
        experience: exp * mult1,
        creativity: cre * mult1,
        efficiency: eff * mult1,
        salary: sal * mult1,
    });

    const emp2 = new Employee({
        intelligence: int * mult2,
        charisma: cha * mult2,
        experience: exp * mult2,
        creativity: cre * mult2,
        efficiency: eff * mult2,
        salary: sal * mult2,
    });

    const emp3 = new Employee({
        intelligence: int * mult3,
        charisma: cha * mult3,
        experience: exp * mult3,
        creativity: cre * mult3,
        efficiency: eff * mult3,
        salary: sal * mult3,
    });

    return (<>
        <h1>Select one of the following candidates for hire:</h1>
        <HireEmployeeButton employee={emp1} office={props.office} corp={props.corp} popupId={props.popupId} player={props.player} />
        <HireEmployeeButton employee={emp2} office={props.office} corp={props.corp} popupId={props.popupId} player={props.player} />
        <HireEmployeeButton employee={emp3} office={props.office} corp={props.corp} popupId={props.popupId} player={props.player} />
    </>);
}
