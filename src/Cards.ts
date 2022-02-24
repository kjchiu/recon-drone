import CardSource from "./sources/CardSource";
import { Card, CardType } from "./Card";
import Fuse from "fuse.js";

export default class Cards {
    private cards: Map<string, Card>;
    private sources: CardSource[];
    private index: Fuse<Card>;

    constructor(sources: CardSource[]) {
        this.sources = sources;
    }

    async load(): Promise<void> {
        console.log(`loading cards from ${this.sources.length} sources`);
        const dumps = await Promise.all(this.sources.map(s => s.load()));
        this.cards = dumps.reduce((cards, update) => {
            update.forEach((card, name) => {
                if (! cards.has(name)) {
                    cards.set(name, card)
                }
            });
            return cards;
        }, new Map<string,Card>());
        console.log(`loaded ${this.cards.size} cards`);

        const options = {
            keys: ["name"],
        }
        const cardList = [...this.cards.values()];
        this.index = new Fuse(cardList, options, Fuse.createIndex(options.keys, cardList));
    }


    async findByName(name: string): Promise<Card|undefined> {
        const results = this.index.search(name);
        return results[0]?.item;
    }
}