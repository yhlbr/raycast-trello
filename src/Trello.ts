import { Cache, getPreferenceValues } from '@raycast/api';
import axios, { AxiosInstance } from 'axios';
const fs = require('fs');
const cache = new Cache();

interface Preferences {
    apiKey: string;
    apiToken: string;
}

type TrelloCardCoverScaled = {
    url: string
}
type TrelloCardLabel = {
    id: string,
    name: string,
    color: string
}

export type TrelloCard = {
    id: string,
    name: string,
    shortUrl: string,
    desc: string,
    due: string,
    dueComplete: boolean,
    closed: boolean,
    cover: {
        scaled: TrelloCardCoverScaled[]
    },
    idMembers: string[],
    labels: TrelloCardLabel[]
}

export type TrelloComment = {
    memberCreator: TrelloMember,
    data: {
        text: string
    }
}

export type TrelloBoard = {
    id: string,
    name: string
}

export type TrelloList = {
    id: string,
    name: string
}

export type TrelloMember = {
    id: string,
    fullName: string
}

type TrelloMemberBatchResponse = {
    '200': TrelloMember
}

export default class Trello {
    axios: AxiosInstance;

    constructor() {
        const creds = this.getCredentials();
        this.axios = axios.create({
            baseURL: 'https://api.trello.com/1',
            params: {
                key: creds.apiKey,
                token: creds.apiToken
            }
        });
    }

    getCredentials() {
        return getPreferenceValues<Preferences>();
    }

    async getBoards() {
        return (await this.axios.get('/members/me/boards')).data;
    }

    async getLists(boardId: string) {
        return (await this.axios.get('/boards/' + boardId + '/lists')).data;
    }

    async getCards(listId: string) {
        return (await this.axios.get('/lists/' + listId + '/cards')).data;
    }

    async search(query: string) {
        if (!query) {
            return [];
        }
        return (await this.axios.get('/search/', {
            params: {
                query: query
            }
        })).data.cards;
    }

    async downloadAsset(url: string, localpath: string) {
        const creds = this.getCredentials();

        const writer = fs.createWriteStream(localpath)
        const res = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            headers: {
                'Authorization': 'OAuth oauth_consumer_key="' +
                    creds.apiKey + '", oauth_token="' +
                    creds.apiToken + '"',
            },
        })
        res.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
        })
    }

    async getMembers(members: string[]): Promise<TrelloMember[]> {
        const cached = cache.get('trello_members');
        let items = <TrelloMember[]>(cached ? JSON.parse(cached) : []);
        let results = [];

        for (const member of items) {
            if (members.includes(member.id)) {
                results.push(member);
                members.splice(members.indexOf(member.id), 1);
            }
        }

        if (members.length === 0) {
            return results;
        }

        const chunkSize = 10;
        for (let i = 0; i < members.length; i += chunkSize) {
            const chunk = members.slice(i, i + chunkSize);
            let urls = [];
            for (let member of chunk) {
                urls.push('/members/' + member);
            }
            const res = <TrelloMemberBatchResponse[]>(await this.axios.get('/batch/', {
                params: {
                    urls: urls
                }
            })).data;
            const resData = <TrelloMember[]>(res.map((member) => {
                return member['200'];
            }));

            items = [...items, ...resData];
            cache.set('trello_members', JSON.stringify(items));
            results = [...results, ...resData];
        }

        return results;
    }

    async getComments(cardId: string) {
        return (await this.axios.get('/cards/' + cardId + '/actions/', {
            params: {
                filter: 'commentCard'
            }
        })).data;
    }

    async addComment(cardId: string, comment: string) {
        return this.axios.post('/cards/' + cardId + '/actions/comments', null, {
            params: {
                text: comment,
            }
        });
    }

    async archiveCard(cardId: string) {
        return this.axios.put('/cards/' + cardId, null, {
            params: {
                closed: true,
            }
        });
    }
}
