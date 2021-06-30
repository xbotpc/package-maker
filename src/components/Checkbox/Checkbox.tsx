import cx from 'classnames';
import { ChangeEvent } from 'react';
import styles from './Checkbox.module.scss';

interface CheckboxProps {
    id: string;
    name?: string;
    label?: string;
    styleClass?: string;
    onSelect: (id: string, e: ChangeEvent<HTMLInputElement>) => void
}

const Checkbox = ({ name, id, label, styleClass, onSelect }: CheckboxProps): JSX.Element => {
    return (
        <>
            <div className={cx(styles.container, styleClass)}>
                <input type="checkbox" name={name} id={id} onChange={(e) => onSelect(id, e)} />
                <label htmlFor={id}>{label}</label>
            </div>
        </>
    )
}

export default Checkbox
