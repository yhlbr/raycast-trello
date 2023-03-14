import { showToast, Toast } from "@raycast/api";
import { useState, useEffect } from "react";
import CardsList from "./CardsList";
import Trello, { TrelloCard } from "./Trello";


type PropTypes = {
    listId: string
};


export default function ListDetails({ listId }: PropTypes) {
    const trello = new Trello();
    const [cards, setCards] = useState<TrelloCard[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        trello.getCards(listId).then((cards) => {
            setCards(cards);
            setLoading(false);
        })
        .catch(() => {
            setLoading(false);
            showToast({
                style: Toast.Style.Failure,
                title: "Error: Please check the API credentials"
              });
        });
    }, []);

    return (
        <CardsList cards={cards} loading={loading} />
    );
}

