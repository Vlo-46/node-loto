const allowedItems: number[] = Array.from(Array(99).keys()).slice(1)
const ticketsLength: number = 3;
const allowedItemsInOneTicket: number = 15;

function createEmptyTicketsTickets() {
    let array: any = []
    for (let i = 0; i < ticketsLength; i++) {
        array.push([])
    }

    return array
}

export function createTickets() {
    let tickets: any = []
    const schema = createEmptyTicketsTickets()

    schema.forEach((ticket: any) => {
        let array = []
        for (let i = 0; i < allowedItemsInOneTicket; i++) {
            array.push(allowedItems[Math.floor(Math.random() * 99)])
        }
        ticket = shuffleArray(array)
        tickets.push(ticket)
    })

    return parseToCorrectStructure(schema)
}

function parseToCorrectStructure(tickets: any[]) {
    const generateColumn = () => {
        const column = Array.from({length: 5}, () => ({
            notMarked: false,
            selected: false,
            num: allowedItems[Math.floor(Math.random() * 99)]
        }));

        return shuffleArray(column).sort((a, b) => a.num - b.num);
    };

    const changeTicketStructure = (ticket: any[]) => {
        return ticket.map((col) => changeStructure(col));
    };

    return tickets.map(() => {
        const col1 = generateColumn();
        const col2 = generateColumn();
        const col3 = generateColumn();

        const ticket = [col1, col2, col3];

        return changeTicketStructure(ticket);
    });
}

function changeStructure(col: any) {
    const newArray: any[] = Array(10).fill(undefined);

    col.forEach((item: any) => {
        const index = Math.floor(item.num / 10);
        if (index >= 0 && index < 10) {
            newArray[index] = item;
        }
    });

    return newArray
}

function shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

export function generateExpectedNumbers(): number[] {
    const generatedNumbers = []
    for (let i = 1; i < 100; i++) {
        generatedNumbers.push(i)
    }
    return shuffleArray(generatedNumbers)
}

export interface ICub {
    notMarked: boolean
    selected: boolean
    num: number
}