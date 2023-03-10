import CardListItem from "./CardListItem";
import { List } from "@raycast/api";
import { TrelloCard } from "./Trello";


type PropTypes = {
    cards: TrelloCard[],
    loading: boolean
};

export default function CardsList({ cards, loading }: PropTypes) {
    return (
        <List isLoading={loading}>
            {cards.map((card) => {
                return (<CardListItem key={card.id} card={card} />)
            })}
        </List>
    );
}
