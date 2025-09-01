export class mouseMeasurements {
    id?: number;
    time: number;
    xPosition: number;
    yPosition: number;
    click: boolean;

    constructor (id: number, time: number, xPosition: number, yPosition: number, click: boolean) {
        this.id = id;
        this.time = time;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.click = click;
    }
}