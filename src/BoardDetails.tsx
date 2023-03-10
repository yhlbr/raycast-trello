import { ActionPanel, List, Action, LocalStorage } from "@raycast/api";
import { useState, useEffect } from "react";
import ListDetails from "./ListDetails";
import Trello, { TrelloList } from "./Trello";

type PropTypes = {
    boardId: string
};

export default function BoardDetails({ boardId }: PropTypes) {
    const trello = new Trello();
    const [lists, setLists] = useState<TrelloList[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        trello.getLists(boardId).then((lists) => {
            setLists(lists);
            setLoading(false);
        });
    }, []);

    const favouriteList = async (listId: string) => {
        await LocalStorage.setItem("favouriteListId", listId);
    }

    return (
        <List isLoading={loading}>
            {lists.map((list) => {
                return (<List.Item
                    icon="list-icon.png"
                    title={list.name}
                    key={list.id}
                    actions={
                        <ActionPanel>
                            <Action.Push title="Show Details" target={<ListDetails listId={list.id} />} />
                            <Action title="Favourite" onAction={() => { favouriteList(list.id); }} />
                        </ActionPanel>
                    } />)
            })}
        </List>
    );
}
