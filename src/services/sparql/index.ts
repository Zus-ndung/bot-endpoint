import axios from "axios"
import * as QueryString from "qs"

const Perfix = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX : <http://www.semanticweb.org/dung/ontologies/2022/3/untitled-ontology-20#>`

const intents = [
  [
    { objectProperty: "", dataProperty: "tenHuy" },
    "person_tenHuy",
    "person_name",
  ],
  [{ objectProperty: "coCha", dataProperty: "tenKhac" }, "person_cha"],
  [{ objectProperty: null, dataProperty: "moTaNgan" }, "person_info"],
  [{ objectProperty: "coVo", dataProperty: "tenKhac" }, "person_vo"],
  [{ objectProperty: "coMe", dataProperty: "tenKhac" }, "person_me"],
  [{ objectProperty: "coCon", dataProperty: "tenKhac" }, "person_child"],
  [{ objectProperty: "coHinhAnh", dataProperty: "linkImage" }, "person_image"],
]

const relationships = [
  ["coCha", "cha", "bố", "thân phụ"],
  ["coMe", "mẹ", "thân mẫu"],
  ["coCon", "con", "hậu duệ"],
]

class Sparql {
  constructor() {}

  async extractSubject(entity: string) {
    console.log(entity)
    const query = `${Perfix}
    SELECT DISTINCT ?subject WHERE {
      OPTIONAL {
        ?subject :tenHuy ?s1.
        FILTER regex(?s1, "${entity}", "i")
      }
      OPTIONAL {
        ?subject :mieuHieu ?s2.
        FILTER regex(?s2, "${entity}", "i")
      }
      OPTIONAL {
        ?subject :tenKhac ?s3.
        FILTER regex(?s3, "${entity}",  "i")
      }
      OPTIONAL {
        ?subject :nienHieu ?s4.
        FILTER regex(?s4, "${entity}",  "i")
      }
      OPTIONAL {
        ?subject :thuyHieu ?s5.
        FILTER regex(?s5, "${entity}",  "i")
      }
    }
    `
    const res = await axios({
      method: "post",
      url: "http://localhost:3000/ds/sparql",
      data: QueryString.stringify({
        query,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    const dataProcess = {}
    const { data } = res
    const { head, results } = data
    if (head.vars.length >= 1) {
      head.vars.forEach((key) => {
        dataProcess[key] = new Set()
      })
      results.bindings.forEach((element) => {
        for (const [key, value] of Object.entries(element)) {
          dataProcess[key].add(value["value"])
        }
      })
      for (const [key, value] of Object.entries(dataProcess)) {
        dataProcess[key] = Array.from(dataProcess[key])
      }
    }
    return dataProcess
  }

  genSparqlQueryString(intent: string, entity: any): string {
    let count = 1
    const { relationship, subject } = entity
    const index = intents.findIndex((item) => item.indexOf(intent, 1) !== -1)
    if (index > -1) {
      let tmp = ""
      if (relationship) {
        const index = relationships.findIndex(
          (item) => item.indexOf(relationship) !== -1
        )
        if (index > -1) {
          tmp = `<${subject}> :${relationships[index][0]} ?s${count}.`
        }
      }
      const intent = intents[index][0]
      const { objectProperty, dataProperty } = intent as any
      let tmp1
      if (objectProperty) {
        tmp1 = `${tmp ? "?s1" : "<" + subject + ">"} :${objectProperty} ?s2.
        ?s2 :${dataProperty} ?${dataProperty}.
        `
      } else {
        tmp1 = `${
          tmp ? "?s1" : "<" + subject + ">"
        } :${dataProperty} ?${dataProperty}.
        `
      }
      const query = `${Perfix}
        SELECT DISTINCT ?${dataProperty} WHERE {
        ${tmp}
        ${tmp1}
      }`
      return query
    }
    return ""
  }
  async queryOntology(intent: string, entity: {}) {
    const query = this.genSparqlQueryString(intent, entity)
    console.log(query)
    const dataProcess = {}
    if (query) {
      const res = await axios({
        method: "post",
        url: "http://localhost:3000/ds/sparql",
        data: QueryString.stringify({
          query,
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })

      const { data } = res
      const { head, results } = data
      if (head.vars.length >= 1) {
        head.vars.forEach((key) => {
          dataProcess[key] = new Set()
        })
        results.bindings.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            dataProcess[key].add(value["value"])
          }
        })
        for (const [key, value] of Object.entries(dataProcess)) {
          dataProcess[key] = Array.from(dataProcess[key])
        }
      }
    }
    return dataProcess
  }
}

export default Sparql
