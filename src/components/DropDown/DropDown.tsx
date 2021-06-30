import { useState } from "react";
import Button from '../Button/Button';
import styles from './Dropdown.module.scss';

type Option = {
    id: string | number,
    name: string | number,
    value: string | number
}

interface DropDownProps {
    displayValue?: string;
    options: Array<Option>;
    optionClick: (id: string | number, value: string | number) => void;
}

const DropDown = ({ displayValue = 'Select an option', options, optionClick }: DropDownProps): JSX.Element => {
    const [showOptions, setShowOptions] = useState(true);

    const onOptionClick = (id: string | number, value: string | number) => {
        optionClick(id, value);
    }

    const onBlur = () => {
        setShowOptions(false);
    }

    const renderOptions = () => {
        return options.map(({ value, name, id }, i: number) => {
            return (
                <li key={`${id}-${i}`} id={id.toString()} value={value}>
                    <Button onClick={() => onOptionClick(id, value)}>
                        {name}
                    </Button>
                </li>
            )
        })
    }

    return (
        <>
            <div className={styles.container} onBlur={onBlur} role="presentation">
                <h5>{displayValue}</h5>
                {showOptions ?
                    <div className={styles.optionsContainer}>
                        <ul>{renderOptions()}</ul>
                    </div>
                    : null}
            </div>
        </>
    )
}

export default DropDown
