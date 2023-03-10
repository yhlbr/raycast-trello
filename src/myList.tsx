import { Detail, LocalStorage } from "@raycast/api";
import { useEffect, useState } from "react";
import ListDetails from "./ListDetails";


export default function MyList() {
    const [favouriteListId, setFavouriteListId] = useState('');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        LocalStorage.getItem<string>("favouriteListId").then((listId) => {
            setFavouriteListId(listId);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (<Detail markdown="" />);
    }

    if (!favouriteListId) {
        return (
            <Detail markdown="Favourite a List with the Trello command" />
        );
    }

    return (
        <ListDetails listId={favouriteListId} />
    );
}
