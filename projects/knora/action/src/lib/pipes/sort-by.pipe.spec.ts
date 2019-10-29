import { SortByPipe } from './sort-by.pipe';

describe('SortByPipe', () => {

    let pipe: SortByPipe;
    let sortKey: string = '';
    const data = [
        {
            prename: 'Gaston',
            lastname: 'Lagaffe',
            creator: 'André Franquin'
        },
        {
            prename: 'Mickey',
            lastname: 'Mouse',
            creator: 'Walt Disney'
        },
        {
            prename: 'Gyro',
            lastname: 'Gearloose',
            creator: 'Carl Barks'
        },
        {
            prename: 'Charlie',
            lastname: 'Brown',
            creator: 'Charles M. Schulz'
        }
    ];

    beforeEach(() => {
        pipe = new SortByPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return a sorted array by creator', () => {
        sortKey = 'creator';
        expect(pipe.transform(data, sortKey)).toEqual([Object({ prename: 'Gaston', lastname: 'Lagaffe', creator: 'André Franquin' }), Object({ prename: 'Gyro', lastname: 'Gearloose', creator: 'Carl Barks' }), Object({ prename: 'Charlie', lastname: 'Brown', creator: 'Charles M. Schulz' }), Object({ prename: 'Mickey', lastname: 'Mouse', creator: 'Walt Disney' })]);
    });

    it('should return a sorted array by prename', () => {
        sortKey = 'prename';
        expect(pipe.transform(data, sortKey)).toEqual([Object({ prename: 'Charlie', lastname: 'Brown', creator: 'Charles M. Schulz' }), Object({ prename: 'Gaston', lastname: 'Lagaffe', creator: 'André Franquin' }), Object({ prename: 'Gyro', lastname: 'Gearloose', creator: 'Carl Barks' }), Object({ prename: 'Mickey', lastname: 'Mouse', creator: 'Walt Disney' })]);
    });

    it('should return a sorted array by lastname', () => {
        sortKey = 'lastname';
        expect(pipe.transform(data, sortKey)).toEqual([Object({ prename: 'Charlie', lastname: 'Brown', creator: 'Charles M. Schulz' }), Object({ prename: 'Gyro', lastname: 'Gearloose', creator: 'Carl Barks' }), Object({ prename: 'Gaston', lastname: 'Lagaffe', creator: 'André Franquin' }), Object({ prename: 'Mickey', lastname: 'Mouse', creator: 'Walt Disney' })]);
    });
});
