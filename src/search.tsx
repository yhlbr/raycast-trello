import { List } from "@raycast/api";
import { useState, useEffect } from "react";
import CardListItem from "./CardListItem";
import Trello from "./Trello";
import debounce from 'lodash.debounce';


export default function Search() {
    const trello = new Trello();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);

    const searchTrellos = (text) => {
        setLoading(true);
        trello.search(text).then((cards) => {
            setCards(cards);
            setLoading(false);
        });
    }

    const changeHandler = debounce(searchTrellos, 500);

    return (
        <List isLoading={loading} filtering={false} onSearchTextChange={changeHandler}>
            {cards.map((card) => {
                return (<CardListItem key={card.id} card={card} />)
            })}
        </List>
    );
}
