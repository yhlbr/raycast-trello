import CardListItem from "./CardListItem";
import { List } from "@raycast/api";

export default function CardsList({ cards, loading }) {
    return (
        <List isLoading={loading}>
            {cards.map((card) => {
                return (<CardListItem key={card.id} card={card} />)
            })}
        </List>
    );
}
