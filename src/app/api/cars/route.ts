
import {NextResponse} from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'src/data/cars.json');

interface Car {
    id: number;
    brand: string;
    model: string;
    year: number;
}

// Helper function to read the database
const readCars = async (): Promise<Car[]> => {
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error: unknown) {
        if (typeof error === 'object' && error !== null && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
};

// Helper function to write to the database
const writeCars = async (cars: Car[]): Promise<void> => {
    await fs.writeFile(dbPath, JSON.stringify(cars, null, 2));
};

// Get all cars
export async function GET() {
    const cars = await readCars();
    return NextResponse.json(cars);
}

// Create a new car
export async function POST(req: Request) {
    const body = await req.json();
    const cars = await readCars();
    const newCar: Car = {
        id: cars.length > 0 ? Math.max(...cars.map(c => c.id)) + 1 : 1,
        brand: body.brand,
        model: body.model,
        year: body.year,
    };
    cars.push(newCar);
    await writeCars(cars);
    return new NextResponse(JSON.stringify(newCar), {
        status: 201,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
