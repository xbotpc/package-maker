import { MouseEvent, ReactNode } from "react";
import './button.scss';

type ButtonProps = {
    id?: string,
    children?: ReactNode,
    type?: 'invisible',
    styleClass?: string,
    onClick: (id: string, e: MouseEvent<HTMLButtonElement>) => void
}

const Button = ({ id = '', children, styleClass = '', type = 'invisible', onClick }: ButtonProps): JSX.Element => {
    return (
        <button type="button" id={id} className={`${type} ${styleClass}`} onClick={(e) => onClick(id, e)} data-testid="button">
            {children}
        </button>
    )
}

export default Button
