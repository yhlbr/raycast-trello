import { Detail, LocalStorage, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import ListDetails from "./ListDetails";


export default function MyList() {
    const [favouriteListId, setFavouriteListId] = useState<string|null>('');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        LocalStorage.getItem<string>("favouriteListId").then((listId: string|undefined) => {
            setFavouriteListId(listId || null);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (<Detail markdown="" />);
    }

    if (!favouriteListId) {
        showToast({
            style: Toast.Style.Failure,
            title: "Favourite a List first to show it here"
          });
        return (
            <Detail markdown="Favourite a List with the Trello command" />
        );
    }

    return (
        <ListDetails listId={favouriteListId} />
    );
}
