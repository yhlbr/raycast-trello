import { Action, ActionPanel, Icon } from "@raycast/api";
import CardCommentForm from "./CardCommentForm";
import Trello, { TrelloCard } from "./Trello";

type PropTypes = {
    card: TrelloCard
}

export default function CardActions({ card }: PropTypes) {
    const trello = new Trello();

    return (
        <ActionPanel.Section>
            <Action.OpenInBrowser shortcut={{ modifiers: ["cmd"], key: "enter" }} url={card.shortUrl} />
            <Action.CopyToClipboard shortcut={{ modifiers: ["cmd"], key: "c" }} title="Copy URL" content={card.shortUrl} />
            <Action.Push shortcut={{ modifiers: ["cmd"], key: "t" }} icon={Icon.Reply} title="Comment" target={<CardCommentForm cardId={card.id} />} />
            <Action shortcut={{ modifiers: ["opt"], key: "c" }} title="Archive" icon={Icon.Trash} onAction={() => trello.archiveCard(card.id)} />
        </ActionPanel.Section>
    );
}
