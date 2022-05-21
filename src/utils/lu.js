import fs from "fs"
export const luisPerson = {
  person_info: [
    "#name",
    "thông tin về #name",
    "#name là ai",
    "cho tôi thông tin về #name",
    "thông tin ngắn về #name",
    "ai là #name",
    "thông tin của #name",
  ],
  person_image: [
    "hình ảnh về #name",
    "hình ảnh của #name",
    "ảnh của #name",
    "hình anh cua #name",
    "hinh ảnh của #namme",
    "image của #name",
    "image #name",
  ],
  person_nienhieu: [
    "niên hiệu của #name",
    "#name có niên hiệu là gì",
    "#name có nien hieu",
    "#name co niên hiệu",
    "nien hieu của #name",
  ],
  person_reference: [
    "liên kết ngoài của #name",
    "thông tin thêm của #name",
    "cho tôi liên kết về #name",
  ],
  person_tenkhac: [
    "#name còn được biết với tên là gì",
    "#name còn được biết tới với",
    "tên khác của #name",
    "#name còn có tên nào khác",
  ],
  person_congviec: [
    "chức vụ #name đã đảm nhiệm",
    "chức vụ #name đã làm",
    "#name đã làm chức vụ nào",
    "chức vụ của #name",
    "chuc vụu của #name",
    "công việc của #name",
    "#name có công việc",
    "công việc mà #name đã làm",
  ],
  person_sinh: [
    "ngày sinh của #name",
    "ngay sinh của #name",
    "#name có ngày sinh",
    "#name sinh vào ngày nào",
    "#name được sinh vào ngày nào",
    "ngày mà #name được sinh ra",
    "ngày sinh #name",
    "ngay sinh #name",
  ],
  person_mat: [
    "ngày mất của #name",
    "ngay mất của #name",
    "#name có ngày mất",
    "#name mất vào ngày nào",
    "#name được mất vào ngày nào",
    "ngày mà #name mất",
    "ngày mất #name",
    "ngay mat #name",
  ],
  person_cha: [
    "cha của #name",
    "cha của #name là ai",
    "ai là cha của #name",
    "#name có cha là ai",
    "ai là bố của #name",
    "bố của #name là ai",
    "#name có bố là ai",
    "phụ thân của #name",
    "tía của #name",
    "phu than của #name",
  ],
  person_me: [
    "mẹ của #name",
    "mama của #name",
    "ai là mẹ của #name",
    "me của #name",
    "me cua #name",
    "#name có mẹ là ai",
    "#name có mẹ",
    "thân mẫu của #name",
    "than mau #name",
  ],
  person_tenhuy: [
    "tên huý #name",
    "tênn huý của #name",
    "ten huy #name",
    "tên khai sinh #name",
    "tên khai sinh của #name",
    "tên thật của #name",
    "#name có tên khai sinh",
    "#name có tên thật",
    "#name có tên huý là gi",
  ],
  person_noimat: [
    "#name mất tại đâu",
    "nơi #name mất",
    "nơi #name băng hà",
    "#name băng hà ở đâu",
    "nơi mất #name",
  ],
  person_tuocHieu: [
    "tước hiệu của #name",
    "#name có tước hiệu là gì",
    "tước hiệu #name",
    "tuoc hieu #name",
  ],
  person_trieuDai: [
    "#name thuộc triều đại nào",
    "triều đại #name",
    "trieu dai #name",
    "triều đại của #name",
  ],
  person_con: [
    "con của #name",
    "hậu duệ của #name",
    "con #name",
    "hậu duệ #name",
    "hau due #name",
    "#name có con là ai",
    "#name có hậu duệ là ai",
    "ai là con của #name",
    "ai là hậu duệ #name",
  ],
  person_thuyhieu: [
    "thuỵ hiệu của #name",
    "thuỵ hiệu #name",
    "thuy hiệu #name",
    "thuy hieu #name",
    "thuy heu của #name",
  ],
  person_noisinh: [
    "#name được sinh tại đâu",
    "nơi sinh #name",
    "nơi #name sinh",
    "nơi #name được sinh ra",
    "nơi sinh của #name",
  ],
  person_antang: [
    "nơi an táng của #name",
    "#name có nơi an táng",
    "#name được an táng tại đâu",
    "#name được chôn cất tại đâu",
    "nơi chôn cất #name",
    "noi chon cat #name",
  ],
  person_chong: [
    "chồng của #name là ai",
    "chong của #name là ai",
    "#name có chồng là ai",
    "#name có chông",
    "chồng #name",
    "chong #name",
    "phu quân #name",
    "phu quan #name",
    "#name có phu quân là ai",
  ],
  person_vo: [
    "vợ của #name là ai",
    "vo của #name là ai",
    "#name có vợ là ai",
    "#name có vo",
    "vợ #name",
    "vo #name",
    "thê thiếp của #name",
    "the thiep của #name",
    "hoàng hậu của #name",
    "hoang hau #name",
  ],
  person_mieuhieu: [
    "miếu hiệu của #name",
    "mieu hieu cua #name",
    "miếu hiệu #name",
    "#name có miếu hiệu là gì",
    "#name miếu hiệu",
  ],
  person_tongiao: [
    "tôn giáo của #name",
    "ton giao cua #name",
    "tôn giáo #name",
    "#name có tôn giáo là gì",
    "#name tôn giáo",
  ],
}

async function readFile(filename, path) {
  const data = fs.readFileSync(
    `/Users/dung/workspaces/doan/crawdata/data/${path}/${filename}`,
    {
      encoding: "utf-8",
    }
  )
  return JSON.parse(data)
}

const readListFile = (path) => {
  return fs.readdirSync(`/Users/dung/workspaces/doan/crawdata/data/${path}/`)
}

async function genFileLuPerson() {
  const persons = new Set()
  const keyExtract = [
    "other",
    "tên húy",
    "tước hiệu",
    "thuỵ hiệu",
    "miếu hiệu",
    "tên khác",
  ]
  const filenames = readListFile("person")
  for (let index = 0; index < filenames.length; index++) {
    const data = await readFile(filenames[index], "person")
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "object" && !Array.isArray(value)) {
        if (key.toLocaleLowerCase() === "thông tin chung") {
          for (const [key1, value1] of Object.entries(value)) {
            if (keyExtract.indexOf(key1.toLocaleLowerCase())) {
              const tmp = Array.isArray(value1) ? value1 : [value1]
              tmp.forEach((item) => {
                persons.add(item)
              })
            }
          }
        }
      }
      if (keyExtract.indexOf(key.toLocaleLowerCase())) {
        const tmp = Array.isArray(value) ? value : [value]
        tmp.forEach((item) => {
          persons.add(item)
        })
      }
    }
  }
  console.log(persons)
}

genFileLuPerson()
