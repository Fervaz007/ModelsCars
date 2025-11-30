
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

// Get a single car by ID
export async function GET(req: Request, context: { params: { id: string } }) {
    const { id } = context.params;
    const cars = await readCars();
    const car = cars.find(c => c.id === parseInt(id));
    if (car) {
        return NextResponse.json(car);
    } else {
        return new NextResponse('Car not found', {status: 404});
    }
}

// Update a car
export async function PUT(req: Request, context: { params: { id: string } }) {
    const { id } = context.params;
    const body = await req.json();
    const cars = await readCars();
    const index = cars.findIndex(c => c.id === parseInt(id));
    if (index !== -1) {
        const updatedCar = {...cars[index], ...body};
        cars[index] = updatedCar;
        await writeCars(cars);
        return NextResponse.json(updatedCar);
    } else {
        return new NextResponse('Car not found', {status: 404});
    }
}

// Delete a car
export async function DELETE(req: Request, context: { params: { id: string } }) {
    const { id } = context.params;
    let cars = await readCars();
    const initialLength = cars.length;
    cars = cars.filter(c => c.id !== parseInt(id));
    if (cars.length < initialLength) {
        await writeCars(cars);
        return new NextResponse(null, {status: 204});
    } else {
        return new NextResponse('Car not found', {status: 404});
    }
}
