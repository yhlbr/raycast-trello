import { ActionPanel, List, Action, showToast, Toast } from "@raycast/api";
import { useState, useEffect } from "react";
import BoardDetails from "./BoardDetails";
import Trello, { TrelloBoard } from "./Trello";

export default function Navigate() {
    const trello = new Trello();
    const [boards, setBoards] = useState<TrelloBoard[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        trello.getBoards().then((boards) => {
            setBoards(boards);
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
        <List isLoading={loading}>
            {boards.map((board) => {
                return (<List.Item
                icon="list-icon.png"
                title={board.name}
                key={board.id}
                actions={
                    <ActionPanel>
                        <Action.Push title="Show Details" target={<BoardDetails boardId={board.id} />} />
                    </ActionPanel>
                } />)
            })}
        </List>
    );
}
