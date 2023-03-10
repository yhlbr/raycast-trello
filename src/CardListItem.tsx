import { ActionPanel, List, Action } from "@raycast/api";
import CardActions from "./CardActions";
import CardDetails from "./CardDetails";
import { TrelloCard } from "./Trello";

type PropTypes = {
    card: TrelloCard
}

export default function CardListItem({ card }: PropTypes) {
    return (<List.Item
                icon="list-icon.png"
                title={card.name}
                key={card.id}
                actions={
                    <ActionPanel>
                        <Action.Push title="Show Details" target={<CardDetails card={card} />} />
                        <CardActions card={card} />
                    </ActionPanel>
                } />
    );
}
