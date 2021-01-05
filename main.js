const fs = require("fs")

class Command {
  constructor(name, params) {
    this.name = name
    this.params = params
  }
}

function main() {
  const filename = "input.txt"
  const commands = getCommandsFromFileName(filename)
  let keyCards = []
  const hotel = []

  function leftFillNum(num, targetLength) {
    return num.toString().padStart(targetLength, 0)
  }

  commands.forEach(command => {
    switch (command.name) {
      case "create_hotel":
        const [floor, roomPerFloor] = command.params

        keyCards = Array.from({ length: floor * roomPerFloor }).map((_, index) => ({
          keycardNumber: index + 1,
          guestName: null,
          roomNumber: null
        }))

        for (let i = 1; i <= floor; i++) {
          for (let j = 1; j <= roomPerFloor; j++) {
            hotel.push({
              roomNumber: `${i}${j.toString().padStart(2, "0")}`,
              guestName: null,
              guestAge: null
            })
          }
        }

        // console.log(keyCards)
        // console.log(hotel)

        console.log(`Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`)
        return
      case "list_available_rooms":
        const availabelRooms = hotel
          .map((cached, room) => (room.guestName === null ? [...cached, room.roomNumber] : cached.roomNumber), [])
          .join(", ")
        console.log(availabelRooms)
      default:
        return
    }
  })
}

function getCommandsFromFileName(fileName) {
  const file = fs.readFileSync(fileName, "utf-8")

  return file
    .split("\n")
    .map(line => line.split(" "))
    .map(
      ([commandName, ...params]) =>
        new Command(
          commandName,
          params.map(param => {
            const parsedParam = parseInt(param, 10)

            return Number.isNaN(parsedParam) ? param : parsedParam
          })
        )
    )
}

main()
