import { useState, useEffect } from "react";
import CardsList from "./CardsList";
import Trello from "./Trello";


type PropTypes = {
    listId: string
};


export default function ListDetails({ listId }: PropTypes) {
    const trello = new Trello();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        trello.getCards(listId).then((cards) => {
            setCards(cards);
            setLoading(false);
        });
    }, []);

    return (
        <CardsList cards={cards} loading={loading} />
    );
}

