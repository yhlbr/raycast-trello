import { ActionPanel, Detail } from "@raycast/api";
import Trello, { TrelloCard, TrelloComment, TrelloMember } from "./Trello";
import { useEffect, useState } from "react";
import CardActions from "./CardActions";

const moment = require('moment');


type PropTypes = {
    card: TrelloCard
};

export default function CardDetails({ card }: PropTypes) {
    const trello = new Trello();
    const [hasImage, setHasImage] = useState(false);
    const [members, setMembers] = useState<TrelloMember[]>([]);
    const [comments, setComments] = useState<TrelloComment[]>([]);
    const [description, setDescription] = useState('');
    const [metadata, setMetadata] = useState(<></>);

    const getDescription = (): string => {
        let description = "# " + card.name + "\n\n";
        if (hasImage) {
            description += "![](/tmp/raycast_trello_thumb.png)\n\n";
            description += card.desc;
        }
        description += card.desc;

        if (comments) {
            description += "\n\n# Comments\n";
            for (const comment of comments) {
                description += "\n## " + comment.memberCreator.fullName + "\n";
                description += comment.data.text;
            }
        }

        return description;
    }

    const buildMetadata = () => {
        let metadatas = [];

        metadatas.push(<Detail.Metadata.Label key="status" title="Status" text={card.closed ? 'Closed' : 'Open'} />);

        metadatas.push(<Detail.Metadata.TagList key="labels" title="Labels">{
            card.labels.map((label) => {
                return (<Detail.Metadata.TagList.Item key={label.id} text={label.name} color={label.color} />);
            })
        }</Detail.Metadata.TagList>);

        if (card.due) {
            const date = moment(card.due).calendar();
            metadatas.push(<Detail.Metadata.Label key="due" title="Due" text={(card.dueComplete ? '✓ ' : '') + date} />);
        }

        metadatas.push(<Detail.Metadata.TagList key="members" title="Members">{
            members.map((member) => {
                return (<Detail.Metadata.TagList.Item key={member.id} text={member.fullName} />);
            })
        }</Detail.Metadata.TagList>);

        metadatas.push(<Detail.Metadata.Link key="link" title="Link" target={card.shortUrl} text="Trello Link" />);

        return (<Detail.Metadata>{metadatas}</Detail.Metadata>);
    }

    useEffect(() => {
        if (card.cover?.scaled && card.cover?.scaled[0]?.url) {
            const creds = trello.getCredentials();
            let url = card.cover.scaled[card.cover.scaled.length - 1].url;
            url += '?key=' + creds.apiKey + "&token=" + creds.apiKey;
            trello.downloadAsset(url, '/tmp/raycast_trello_thumb.png').then(() => {
                setHasImage(true);
            });
        }

        trello.getMembers(card.idMembers).then((members) => {
            setMembers(members);
        });

        trello.getComments(card.id).then((comments) => {
            setComments(comments);
        });
    }, []);

    useEffect(() => {
        setDescription(getDescription());
    }, [hasImage, comments, members]);

    useEffect(() => {
        setMetadata(buildMetadata());
    }, [members]);


    return (<Detail
        markdown={description}
        metadata={metadata}
        actions={
            <ActionPanel>
                <CardActions card={card} />
            </ActionPanel>
        }
    />
    );
}
