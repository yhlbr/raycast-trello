import { List, showToast, Toast } from "@raycast/api";
import { useState } from "react";
import CardListItem from "./CardListItem";
import Trello, { TrelloCard } from "./Trello";
import debounce from "lodash.debounce";


export default function Search() {
    const trello = new Trello();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);

    const searchTrellos = (text: string) => {
        if (text !== "") {
            setLoading(true);
        }
        else {
            return;
        }

        trello.search(text).then((cards) => {
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
    }

    const changeHandler = debounce(searchTrellos, 500);

    return (
        <List isLoading={loading} filtering={false} onSearchTextChange={changeHandler}>
            {cards.map((card: TrelloCard) => {
                return (<CardListItem key={card.id} card={card} />)
            })}
        </List>
    );
}
