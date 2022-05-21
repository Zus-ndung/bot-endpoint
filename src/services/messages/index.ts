const pattern = [
  ["tên thật", "name", "tenHuy"],
  ["tên cha", "tenCha"],
  ["liên kết ngoài", "lienket"],
  ["tên khác", "tenKhac"],
  ["link", "linkImage"],
  ["s"],
]

export class Message {
  constructor() {}
  genMessage(response: any): Array<string> {
    const resultsMessage = []
    for (const [key, value] of Object.entries(response)) {
      // const index = pattern.findIndex((item) => item.indexOf(key) !== -1)
      // if (index > -1) {
      const messages = Array.isArray(value) ? value : [value]
      resultsMessage.push(...messages.map((message) => `${message}`))
      //}
    }
    if (resultsMessage.length === 0) {
      resultsMessage.push("không tìm thấy dữ liệu")
    }
    return resultsMessage
  }
}
