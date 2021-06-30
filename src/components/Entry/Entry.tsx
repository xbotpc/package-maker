import cx from 'classnames';
import { FocusEvent, MouseEvent } from 'react';
import styles from './Entry.module.scss';

interface EntryProps {
    id: string;
    name?: string;
    styleClass?: string;
    label?: string;
    onClick?: (e: MouseEvent<HTMLInputElement>) => void;
    onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
    onChange: (id: string, value: string) => void;
}

const Entry = ({ name, id, onChange, styleClass, label, onClick, onFocus }: EntryProps): JSX.Element => {
    return (
        <>
            <div className={cx(styles.container, styleClass)}>
                <label htmlFor={id}>{label}</label>
                <input
                    type="text"
                    name={name}
                    id={id}
                    onChange={(e) => onChange(id, e.target.value)}
                    onClick={onClick}
                    onFocus={onFocus}
                />
            </div>
        </>
    )
}

export default Entry
