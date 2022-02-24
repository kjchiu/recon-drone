import { Card } from "../Card";
export default interface CardSource {
    load(): Promise<Map<string, Card>>;
}