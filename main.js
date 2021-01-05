const fs = require("fs");

class Command {
  constructor(name, params) {
    this.name = name;
    this.params = params;
  }
}

function main() {
  const filename = "input.txt";
  const commands = getCommandsFromFileName(filename);
  let keyCards = [];
  let hotel = [];

  function leftFillNum(num, targetLength) {
    return num.toString().padStart(targetLength, 0);
  }

  commands.forEach((command) => {
    switch (command.name) {
      case "create_hotel": {
        const [floor, roomPerFloor] = command.params;

        keyCards = Array.from({ length: floor * roomPerFloor }).map(
          (_, index) => ({
            keycardNumber: index + 1,
            guestName: null,
            roomNumber: null,
          })
        );

        for (let i = 1; i <= floor; i++) {
          for (let j = 1; j <= roomPerFloor; j++) {
            hotel.push({
              roomNumber: `${i}${j.toString().padStart(2, "0")}`,
              guestName: null,
              guestAge: null,
            });
          }
        }

        console.log(
          `Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`
        );
        return;
      }
      case "book": {
        const [roomNumber, guestName, guestAge] = command.params;
        const hotelIndex = hotel.findIndex(
          (room) => +room.roomNumber === +roomNumber
        );
        const isAvailable = !hotel[hotelIndex].guestName;

        if (isAvailable) {
          const index = keyCards.findIndex((kc) => kc.roomNumber === null);
          keyCards[index] = {
            keycardNumber: index + 1,
            guestName,
            roomNumber,
          };

          hotel = hotel.map((room) =>
            +room.roomNumber === +roomNumber
              ? { ...room, guestName, guestAge }
              : room
          );
          console.log(
            `Room ${roomNumber} is booked by Thor with keycard number ${keyCards[index].keycardNumber}.`
          );
        } else {
          console.log(
            `Cannot book room ${roomNumber} for ${guestName}, The room is currently booked by ${hotel[hotelIndex].guestName}.`
          );
        }
        return;
      }
      case "list_available_rooms": {
        const availabelRooms = hotel
          .filter((room) => room.guestName === null)
          .map((room) => room.roomNumber)
          .join(", ");
        console.log(availabelRooms);
        return;
      }
      case "list_guest": {
        const list_guest = hotel
          .reduce(
            (cached, room) =>
              room.guestName !== null ? cached.concat(room.guestName) : cached,
            []
          )
          .join(", ");
        console.log(list_guest);
        return;
      }
      // case "list_guest_by_age":
      //   const [operator, age] = command.params
      //   const guestList = hotel.filter(room => eval(`${room.guestAge}${operator}${age}`))
      default:
        return;
    }
  });
}

function getCommandsFromFileName(fileName) {
  const file = fs.readFileSync(fileName, "utf-8");

  return file
    .split("\n")
    .map((line) => line.split(" "))
    .map(
      ([commandName, ...params]) =>
        new Command(
          commandName,
          params.map((param) => {
            const parsedParam = parseInt(param, 10);

            return Number.isNaN(parsedParam) ? param : parsedParam;
          })
        )
    );
}

main();
