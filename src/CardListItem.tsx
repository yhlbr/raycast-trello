import { ActionPanel, Detail, List, Action } from "@raycast/api";
import CardActions from "./CardActions";
import CardDetails from "./CardDetails";

export default function CardListItem({ card }) {
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
