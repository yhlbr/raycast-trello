import { ActionPanel, List, Action } from "@raycast/api";
import { useState, useEffect } from "react";
import BoardDetails from "./BoardDetails";
import Trello from "./Trello";

export default function Navigate() {
    const trello = new Trello();
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        trello.getBoards().then((boards) => {
            setBoards(boards);
            setLoading(false);
        });
    }, []);
    return (
        <List isLoading={loading}>
            {boards.map((board, i) => {
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
