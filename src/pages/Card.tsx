import { Component, JSX } from "solid-js";
import './Card.css';

interface CardProps {
    title: string;
    value: number;
    color: string;
    icon: JSX.Element; 
    circleColor: string;
}

const Card: Component<CardProps> = (props) => {
    return (
        <div class="card" style={{ "background-color": props.color }}>
            <div class="icon-circle" style={{ "background-color": props.circleColor }}>
                {props.icon}
            </div>
            <p>{props.value}</p>
            <h3>{props.title}</h3>
        </div>
    );
};

export default Card;
