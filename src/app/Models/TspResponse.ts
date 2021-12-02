import { District } from './district';
export class TspResponse {
    best_route: District[];
    progress: number[] = [];
}