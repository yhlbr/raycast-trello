import Trello from "./Trello";
import { Action, ActionPanel, Form, useNavigation } from "@raycast/api";

interface FormValues {
    comment: string;
}

type PropTypes = {
    cardId: string
};

export default function CardCommentForm({ cardId }: PropTypes) {
    const trello = new Trello();
    const { pop } = useNavigation();

    return (
        <Form
            actions={
                <ActionPanel>
                    <Action.SubmitForm
                        onSubmit={(values: FormValues) => {
                            trello.addComment(cardId, values.comment)
                                .then(() => {
                                    pop();
                                });
                        }}
                    />
                </ActionPanel>
            }
        >
            <Form.TextArea id="comment" title="Comment" />
        </Form>
    );
}

