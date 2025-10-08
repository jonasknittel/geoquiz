export class MouseCoordinates {
    id?: number;
    time: number;
    lng: number;
    lat: number;
    click: boolean;

    constructor (id: number, time: number, xPosition: number, yPosition: number, click: boolean) {
        this.id = id;
        this.time = time;
        this.lng = xPosition;
        this.lat = yPosition;
        this.click = click;
    }
}